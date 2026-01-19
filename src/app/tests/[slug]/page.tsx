
'use client';

import React, { useState, useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { TESTS } from '@/lib/config/tests-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Loader2, Download, Share2, RefreshCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

type AnalysisResult = {
    summary: string;
    personality: string;
    future_partner: string;
    advice: string;
};

export default function TestPage() {
    const params = useParams();
    const slug = params.slug as string;
    const config = TESTS[slug];

    // Validate slug
    if (!config) {
        return notFound();
    }

    const [step, setStep] = useState<'intro' | 'input' | 'analyzing' | 'result'>('intro');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        gender: 'female',
        birthDate: '',
        birthTime: '',
        calendarType: 'solar'
    });

    const resultRef = useRef<HTMLDivElement>(null);

    const handleStart = () => setStep('input');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('analyzing');
        setLoading(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    ...formData
                })
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.result);
                setStep('result');
            } else {
                alert('분석 중 오류가 발생했습니다: ' + (data.error || 'Unknown error'));
                setStep('input');
            }
        } catch (error) {
            console.error(error);
            alert('서버 통신 오류가 발생했습니다.');
            setStep('input');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!resultRef.current) return;

        try {
            const canvas = await html2canvas(resultRef.current, {
                scale: 2, // Reting display support
                backgroundColor: null,
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `${config.slug}-result.png`;
            link.click();
        } catch (err) {
            console.error("Capture failed", err);
            alert("이미지 저장에 실패했습니다.");
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={cn("min-h-screen flex items-center justify-center p-4 transition-colors duration-500", config.themeColor.background)}>
            <div className="max-w-md w-full">

                {/* Intro Step */}
                {step === 'intro' && (
                    <Card className="border-none shadow-xl">
                        <CardHeader className={cn("text-white rounded-t-xl py-12 text-center", config.themeColor.primary)}>
                            <CardTitle className="text-3xl font-bold mb-2">{config.title}</CardTitle>
                            <CardDescription className="text-white/90 text-lg">{config.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="text-center space-y-4 text-gray-600">
                                <p>당신의 사주를 분석하여<br />{config.title}를 알려드립니다.</p>
                                <div className="p-4 bg-gray-50 rounded-lg text-sm">
                                    💡 생년월일과 태어난 시간을<br />정확히 입력할수록 정확도가 올라갑니다.
                                </div>
                            </div>
                            <Button
                                onClick={handleStart}
                                className={cn("w-full text-lg h-12 font-bold shadow-lg hover:opacity-90 transition-opacity", config.themeColor.primary)}
                            >
                                테스트 시작하기
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Input Step */}
                {step === 'input' && (
                    <Card className="shadow-lg">
                        <CardHeader className={cn("text-white rounded-t-xl py-6", config.themeColor.primary)}>
                            <CardTitle className="text-xl">정보 입력</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="space-y-2">
                                    <Label>이름 (선택)</Label>
                                    <Input
                                        placeholder="홍길동"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>성별</Label>
                                    <RadioGroup
                                        defaultValue="female"
                                        value={formData.gender}
                                        onValueChange={(v) => handleInputChange('gender', v)}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" />
                                            <Label htmlFor="female">여성</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" />
                                            <Label htmlFor="male">남성</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label>생년월일</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={formData.calendarType}
                                            onValueChange={(v) => handleInputChange('calendarType', v)}
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="양력" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="solar">양력</SelectItem>
                                                <SelectItem value="lunar">음력</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>태어난 시간</Label>
                                    <Input
                                        type="time"
                                        value={formData.birthTime}
                                        onChange={(e) => handleInputChange('birthTime', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500">* 모르면 비워두세요 (정오 12:00 기준으로 분석됩니다)</p>
                                </div>

                                <Button type="submit" className={cn("w-full h-12 text-lg", config.themeColor.primary)}>
                                    결과 보기
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Analyzing */}
                {step === 'analyzing' && (
                    <div className="text-center py-20 space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className={cn("absolute inset-0 rounded-full opacity-20 animate-ping", config.themeColor.primary)}></div>
                            <div className={cn("relative flex items-center justify-center w-full h-full rounded-full bg-white shadow-lg")}>
                                <Loader2 className={cn("w-10 h-10 animate-spin", config.themeColor.text)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-800">사주를 분석하고 있습니다...</h3>
                            <p className="text-gray-500">잠시만 기다려주세요.</p>
                        </div>
                    </div>
                )}

                {/* Result Step */}
                {step === 'result' && result && (
                    <div className="space-y-4">
                        <div ref={resultRef} className="bg-white rounded-xl overflow-hidden shadow-2xl">
                            <div className={cn("text-white py-8 text-center px-4", config.themeColor.primary)}>
                                <p className="text-white/80 text-sm mb-1">{formData.birthDate}생 {formData.name || '익명'}님의</p>
                                <CardTitle className="text-2xl font-bold">{config.title} 결과</CardTitle>
                            </div>
                            <div className="p-8 space-y-6">

                                <div className="text-center">
                                    <h3 className={cn("text-xl font-bold mb-2", config.themeColor.text)}>"{result.summary}"</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className={cn("font-bold mb-2 flex items-center gap-2", config.themeColor.accent)}>
                                            👤 성향 분석
                                        </h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">{result.personality}</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className={cn("font-bold mb-2 flex items-center gap-2", config.themeColor.accent)}>
                                            💘 미래 파트너
                                        </h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">{result.future_partner}</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className={cn("font-bold mb-2 flex items-center gap-2", config.themeColor.accent)}>
                                            💡 행운 조언
                                        </h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">{result.advice}</p>
                                    </div>
                                </div>

                                <div className="text-center text-xs text-gray-400 mt-4">
                                    Saju Multiverse에서 분석한 결과입니다.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleDownload}
                                className={cn("flex-1", config.themeColor.primary)}
                            >
                                <Download className="mr-2 h-4 w-4" /> 결과 저장
                            </Button>
                            <Button
                                onClick={() => setStep('intro')}
                                variant="outline"
                                className="flex-1"
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" /> 다시하기
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
