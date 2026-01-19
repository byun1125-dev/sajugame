
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TESTS } from '@/lib/config/tests-config';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, UserCircle, Check, Edit2 } from 'lucide-react';
import { saveProfile, getProfile, clearProfile, type ProfileData } from '@/lib/utils/profile-storage';

export default function Home() {
  const [profileSaved, setProfileSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    gender: 'female',
    birthDate: '',
    birthTime: '',
    calendarType: 'solar'
  });

  // Load profile on mount
  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setFormData(savedProfile);
      setProfileSaved(true);
    } else {
      setIsEditing(true); // Show form if no profile exists
    }
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.birthDate) {
      alert('생년월일을 입력해주세요.');
      return;
    }
    saveProfile(formData);
    setProfileSaved(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClear = () => {
    if (confirm('저장된 정보를 삭제하시겠습니까?')) {
      clearProfile();
      setFormData({
        name: '',
        gender: 'female',
        birthDate: '',
        birthTime: '',
        calendarType: 'solar'
      });
      setProfileSaved(false);
      setIsEditing(true);
    }
  };

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

        {/* Profile Section */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-purple-600" />
                <CardTitle>내 정보</CardTitle>
              </div>
              {profileSaved && !isEditing && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> 저장됨
                  </span>
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-1" /> 수정
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              한 번만 입력하면 모든 테스트에 자동으로 적용됩니다
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!isEditing && profileSaved ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">이름</span>
                  <span className="font-medium">{formData.name || '(미입력)'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">성별</span>
                  <span className="font-medium">{formData.gender === 'male' ? '남성' : '여성'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">생년월일</span>
                  <span className="font-medium">{formData.calendarType === 'solar' ? '양력' : '음력'} {formData.birthDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">태어난 시간</span>
                  <span className="font-medium">{formData.birthTime || '정오 (12:00)'}</span>
                </div>
                <Button onClick={handleClear} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 w-full mt-2">
                  정보 삭제
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
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
                    value={formData.gender}
                    onValueChange={(v) => handleInputChange('gender', v as 'male' | 'female')}
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
                  <Label>생년월일 *</Label>
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
                  <Label>태어난 시간 (선택)</Label>
                  <Input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleInputChange('birthTime', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">* 모르면 비워두세요 (정오 12:00 기준)</p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    저장하기
                  </Button>
                  {profileSaved && (
                    <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
                      취소
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Test Cards */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">테스트 선택</h2>
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
        </div>

        <footer className="text-center text-slate-400 py-10">
          © 2026 Saju Multiverse. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
