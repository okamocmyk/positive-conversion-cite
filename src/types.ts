export interface ReframedCard {
  id: string;
  originalText: string;
  mainReframedKeyword: string;
  strengths: string[];
  situationalExamples: string[];
  selfCompassionMessage: string;
  affirmation: string;
  actionAdvice: string;
  categoryTag: string;
  timestamp: string;
  moodBefore?: number; // 1 to 5 rating
  moodAfter?: number;  // 1 to 5 rating
  isFavorite?: boolean;
  notes?: string;
}

export interface ReframingDictionaryItem {
  id: string;
  negativeWord: string;
  category: "性格・自己評価" | "人間関係・コミュニケーション" | "行動・習慣" | "出来事・失敗";
  reframedKeywords: string[];
  explanation: string;
  situations: string[];
  affirmation: string;
  tags: string[];
}

export interface UserStats {
  totalReframed: number;
  favoritesCount: number;
  streakDays: number;
  averageMoodBoost: number; // e.g. +1.8
}

export type DressUpCategory = 'headwear' | 'accessory' | 'aura' | 'outfit';

export type DressUpPosition = 'face' | 'hand' | 'chest' | 'head' | 'back' | 'aura';

export interface DressUpItem {
  id: string;
  name: string;
  category: DressUpCategory;
  emoji: string;
  description: string;
  requiredLevel: number;
  cost: number;
  position?: DressUpPosition;
}

export interface CharacterState {
  name: string;
  level: number;
  exp: number;
  points: number;
  streakDays: number;
  lastLoginDate: string; // YYYY-MM-DD
  equipped: {
    headwear?: string;
    accessory?: string;
    aura?: string;
    outfit?: string;
  };
  unlockedItemIds: string[];
}
