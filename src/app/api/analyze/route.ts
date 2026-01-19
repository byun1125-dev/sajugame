
import { NextResponse } from 'next/server';
import { TESTS } from '@/lib/config/tests-config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSaju, getSolarDate } from '@gracefullight/saju';
import { createDateFnsAdapter } from '@gracefullight/saju/adapters/date-fns';

// Initialize Gemini client
// Note: We'll check for the key inside the handler to provide better error messages/mocks
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

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
            // Assuming standard lunar conversion (no leap month info from simple UI, defaulting false)
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
        // Pillars are strings like '甲子' (Gapja)

        const pillarsText = `
    Year: ${pillars.year}
    Month: ${pillars.month}
    Day: ${pillars.day}
    Hour: ${pillars.hour}
    `;

        const systemPrompt = config.systemPrompt;
        const userPrompt = `
      User Info:
      - Gender: ${gender}
      - Birth Date (Solar): ${year}-${month}-${day} ${hour}:${minute}
      - original Calendar: ${calendarType}
      
      Saju Pillars (Four Pillars):
      ${pillarsText}
      
      Please analyze this user's fortune based on the Four Pillars above and the system prompt provided.
      
      SYSTEM INSTRUCTIONS: ${systemPrompt}

      Return the response in strictly valid JSON format with the following keys:
      {
        "summary": "One sentence summary",
        "personality": "Refined personality analysis based on Saju(Detailed)",
        "future_partner": "Detailed Partner analysis",
        "advice": "Practical advice"
      }
    `;

        // Check availability of API Key
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy-key') {
            console.log("No GEMINI_API_KEY found, returning mock response for:", slug);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return NextResponse.json({
                success: true,
                result: {
                    summary: `[Mock Result for ${slug}] 당신은 정말 특별한 사람입니다. (Gemini Key Missing)`,
                    personality: `(API Key Missing) ${pillars.year}년주를 가진 당신은 강인한 성품을 지녔습니다.`,
                    future_partner: "배려심이 깊고 성실한 배우자를 만날 운명입니다.",
                    advice: "GEMINI_API_KEY를 설정해주세요."
                }
            });
        }

        console.log("Calling Gemini API with key:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");

        // Use Gemini Flash for speed and free tier
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini API response received, length:", text.length);

        const finalResult = JSON.parse(text);

        return NextResponse.json({
            success: true,
            result: finalResult
        });

    } catch (error) {
        console.error('API Error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));

        // Return more descriptive error
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 });
    }
}
