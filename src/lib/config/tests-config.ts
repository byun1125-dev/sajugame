
import { LucideIcon, Heart, Briefcase, Coins } from 'lucide-react';

export interface TestConfig {
  slug: string;           // URL identifier (e.g., 'love', 'wealth')
  title: string;          // Display title
  description?: string;   // Short subtitle
  themeColor: {
    primary: string;      // Hex codes or Tailwind classes
    background: string;
    text: string;
    accent: string;       // Secondary color for specialized UI elements
  };
  systemPrompt: string;   // The "persona" for the AI
  backgroundImage?: string; // For the result card (path in public folder)
  inputs: ('birthDate' | 'birthTime' | 'gender')[]; // Configurable inputs
  icon?: LucideIcon; // Component to render icon
}

export const TESTS: Record<string, TestConfig> = {
  love: {
    slug: 'love',
    title: '찐 사랑 찾기 사주 테스트',
    description: '나의 연애 운세와 미래의 연인을 찾아보세요.',
    themeColor: { 
      primary: 'bg-pink-500', 
      background: 'bg-pink-50', 
      text: 'text-pink-900',
      accent: 'text-pink-600'
    },
    systemPrompt: '당신은 팩트 폭격을 날리는 연애 컨설턴트입니다. 사용자의 사주 정보를 바탕으로 연애 성향, 미래 배우자의 특징, 연애 조언을 직설적이고 유머러스하게 해설해주세요. 결과는 JSON 포맷으로 "summary", "personality", "future_partner", "advice" 키를 포함해야 합니다.',
    inputs: ['birthDate', 'birthTime', 'gender'],
  },
  work: {
    slug: 'work',
    title: '직장/사업 운세 테스트',
    description: '나에게 맞는 직업과 성공 전략을 알아보세요.',
    themeColor: { 
      primary: 'bg-blue-600', 
      background: 'bg-blue-50', 
      text: 'text-blue-900',
      accent: 'text-blue-700'
    },
    systemPrompt: '당신은 냉철한 커리어 코치입니다. 사용자의 사주를 분석하여 적합한 직무, 직장 내 처세술, 사업 운을 분석해주세요. 현실적이고 구체적인 조언을 제공하세요.',
    inputs: ['birthDate', 'birthTime', 'gender'],
  },
  wealth: {
    slug: 'wealth',
    title: '재물운 대박 테스트',
    description: '나의 타고난 재물 그릇과 돈 버는 법.',
    themeColor: { 
      primary: 'bg-yellow-500', 
      background: 'bg-yellow-50', 
      text: 'text-yellow-900',
      accent: 'text-yellow-700'
    },
    systemPrompt: '당신은 전설적인 투자 전문가입니다. 사주를 통해 재물운의 흐름, 돈을 모으는 방법, 주의해야 할 지출 습관을 분석해주세요.',
    inputs: ['birthDate', 'birthTime', 'gender'],
  },
};
