
import { NextResponse } from 'next/server';
import { TESTS } from '@/lib/config/tests-config';
import { getSaju, getSolarDate } from '@gracefullight/saju';
import { createDateFnsAdapter } from '@gracefullight/saju/adapters/date-fns';
import { DAY_MASTER_DATA } from '@/lib/data/saju-data';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug, birthDate, birthTime, gender, calendarType } = body;

        // Validate request
        if (!slug || !birthDate || !gender) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const config = TESTS[slug];
        if (!config) {
            return NextResponse.json({ error: 'Invalid test type' }, { status: 404 });
        }

        // Parse Date
        let year: number, month: number, day: number;

        // Check if birthDate is YYYY-MM-DD
        const [y, m, d] = birthDate.split('-').map(Number);
        year = y;
        month = m;
        day = d;

        // Convert Lunar to Solar if needed
        if (calendarType === 'lunar') {
            const solar = getSolarDate(year, month, day, false);
            year = solar.year;
            month = solar.month;
            day = solar.day;
        }

        // Default time to 12:00 if unknown
        const [hour, minute] = (birthTime || '12:00').split(':').map(Number);

        // Create Saju Adapter
        const adapter = await createDateFnsAdapter();
        const dt = {
            date: new Date(year, month - 1, day, hour, minute),
            timeZone: 'Asia/Seoul'
        };

        // Calculate Pillars
        const saju = getSaju(dt, {
            adapter,
            gender: gender === 'male' ? 'male' : 'female',
        });

        const pillars = saju.pillars;

        // --- RULE-BASED LOGIC START ---

        // 1. Identify Day Master (일간) - The Heavenly Stem of the Day Pillar
        // The library returns Chinese characters (e.g. '甲子').
        // The first character of the Day pillar is the Day Master.
        const dayPillar = pillars.day; // e.g. "甲子"
        const dayMasterChar = dayPillar.charAt(0); // e.g. "甲"

        // 2. Lookup Interpretation
        const interpretation = DAY_MASTER_DATA[dayMasterChar];

        // Fallback for unknown characters (should not happen with standard Saju)
        if (!interpretation) {
            console.error("Unknown Day Master:", dayMasterChar);
            return NextResponse.json({ error: 'Failed to analyze Saju' }, { status: 500 });
        }

        // 3. Construct Final Result based on the Test Type (slug)
        // We select the most relevant field from the interpretation data

        let result = {
            summary: "",
            personality: "",
            future_partner: "",
            advice: ""
        };

        // Common fields
        result.summary = `[${interpretation.feature}] ${interpretation.summary}`;
        result.personality = interpretation.personality;
        result.advice = interpretation.advice;

        // Feature-specific logic
        if (slug === 'love') {
            result.future_partner = interpretation.love;
            // Add Love-specific flavor to advice if possible
        } else if (slug === 'work') {
            // For work test, we might map 'love' field to something else or just reuse general advice
            // But our data text has specific 'work' field
            result.future_partner = interpretation.work; // Using 'future_partner' key to match frontend expectation (or we should change frontend)
            // Ideally frontend should look for 'work', but let's check frontend. 
            // Frontend expects: personality, future_partner, advice.
            // Let's repurpose 'future_partner' field for 'Job/Work' content in Work test case 
            // so we don't break frontend.
        } else if (slug === 'wealth') {
            result.future_partner = interpretation.wealth; // Repurposing field
        }

        return NextResponse.json({
            success: true,
            result: result
        });

    } catch (error) {
        console.error('Analysis Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
