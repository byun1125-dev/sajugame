
import React from 'react';
import Link from 'next/link';
import { TESTS } from '@/lib/config/tests-config';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4 pt-10">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            사주 <span className="text-purple-600">멀티버스</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            나의 운명을 다양한 테마로 확인해보세요.<br />
            연애, 직장, 재물까지 모든 운세가 여기에 있습니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(TESTS).map((test) => (
            <Link href={`/tests/${test.slug}`} key={test.slug} className="group cursor-pointer">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 overflow-hidden">
                <div className={`h-3 w-full ${test.themeColor.primary}`} />
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {test.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {test.description}
                  </CardDescription>
                  <Button variant="ghost" className="mt-4 w-full justify-between group-hover:bg-slate-50">
                    테스트 시작하기 <span className="text-lg">→</span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <footer className="text-center text-slate-400 py-10">
          © 2026 Saju Multiverse. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
