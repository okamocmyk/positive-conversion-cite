import { DressUpItem } from '../types';

export const DRESS_UP_ITEMS: DressUpItem[] = [
  // Headwear
  {
    id: 'hat-flower',
    name: '幸福のおはな',
    category: 'headwear',
    emoji: '🌸',
    description: '咲くたびに心がやわらぐ可愛いお花',
    requiredLevel: 1,
    cost: 0, // default unlocked
    position: 'head',
  },
  {
    id: 'hat-sprout',
    name: '成長のふたば',
    category: 'headwear',
    emoji: '🌱',
    description: '毎日の気づきとともに伸びていく双葉',
    requiredLevel: 1,
    cost: 50,
    position: 'head',
  },
  {
    id: 'hat-crown',
    name: '自己肯定感の王冠',
    category: 'headwear',
    emoji: '👑',
    description: '自分を大切にできた証のきらめく王冠',
    requiredLevel: 3,
    cost: 200,
    position: 'head',
  },
  {
    id: 'hat-ribbon',
    name: '魔法のエンジェルリボン',
    category: 'headwear',
    emoji: '🎀',
    description: '心を優しく結ぶピンクのリボン',
    requiredLevel: 2,
    cost: 100,
    position: 'head',
  },
  {
    id: 'hat-witch',
    name: '言葉の魔法使いハット',
    category: 'headwear',
    emoji: '🧙',
    description: 'ネガティブをポジティブに変える帽子',
    requiredLevel: 4,
    cost: 350,
    position: 'head',
  },

  // Accessories
  {
    id: 'acc-glasses',
    name: 'リフレーミングメガネ',
    category: 'accessory',
    emoji: '👓',
    description: '物事のよい側面がくっきり見える魔法の眼鏡',
    requiredLevel: 1,
    cost: 80,
    position: 'face',
  },
  {
    id: 'acc-sunglasses',
    name: '前向きサングラス',
    category: 'accessory',
    emoji: '🕶️',
    description: 'どんな困難もスタイリッシュに乗り越える',
    requiredLevel: 2,
    cost: 150,
    position: 'face',
  },
  {
    id: 'acc-star-wand',
    name: 'きらめきステッキ',
    category: 'accessory',
    emoji: '🪄',
    description: '一振りで気分が明るくなる魔法のステッキ',
    requiredLevel: 3,
    cost: 250,
    position: 'hand',
  },
  {
    id: 'acc-[#1-ribbon]',
    name: 'ご褒美メダル',
    category: 'accessory',
    emoji: '🏅',
    description: '毎日がんばっている自分への栄誉メダル',
    requiredLevel: 5,
    cost: 500,
    position: 'chest',
  },

  // Auras
  {
    id: 'aura-sparkles',
    name: '希望の輝き',
    category: 'aura',
    emoji: '✨',
    description: 'ココロんを包むやわらかな光の粒子',
    requiredLevel: 1,
    cost: 0,
    position: 'aura',
  },
  {
    id: 'aura-rainbow',
    name: '虹色のやすらぎ',
    category: 'aura',
    emoji: '🌈',
    description: '雨のあとに架かる架け橋の祝福',
    requiredLevel: 2,
    cost: 120,
    position: 'aura',
  },
  {
    id: 'aura-sun',
    name: 'ぽかぽか太陽光線',
    category: 'aura',
    emoji: '☀️',
    description: '周りの人の心まで温かくするぽかぽかオーラ',
    requiredLevel: 4,
    cost: 300,
    position: 'aura',
  },
  {
    id: 'aura-hearts',
    name: 'あふれる愛のハート',
    category: 'aura',
    emoji: '💖',
    description: '自分への思いやりに満ちた溢れるハート',
    requiredLevel: 3,
    cost: 220,
    position: 'aura',
  },

  // Outfits
  {
    id: 'outfit-angel-wings',
    name: '天使のはね',
    category: 'outfit',
    emoji: '🪽',
    description: '自由な発想で羽ばたけるふんわり羽',
    requiredLevel: 2,
    cost: 180,
    position: 'back',
  },
  {
    id: 'outfit-cape',
    name: 'ヒーローのマント',
    category: 'outfit',
    emoji: '🦸',
    description: '自分の人生の主人公になれる赤いマント',
    requiredLevel: 3,
    cost: 280,
    position: 'back',
  },
  {
    id: 'outfit-kimono',
    name: 'お祝いのおべべ',
    category: 'outfit',
    emoji: '👘',
    description: 'ハレの日を彩る上品で華やかな和服',
    requiredLevel: 4,
    cost: 400,
    position: 'chest',
  },
];

export interface StageInfo {
  levelThreshold: number;
  stageName: string;
  avatarEmoji: string;
  description: string;
  title: string;
}

export const CHARACTER_STAGES: StageInfo[] = [
  {
    levelThreshold: 1,
    stageName: 'タマゴの心',
    avatarEmoji: '🥚',
    description: 'まだ小さな心のつぼみ。毎日の気づきで暖められています。',
    title: 'ひよっこチャレンジャー',
  },
  {
    levelThreshold: 2,
    stageName: 'ひよっこ精霊',
    avatarEmoji: '🐣',
    description: '羽を広げはじめた愛らしい精霊。言葉の変換を楽しんでいます。',
    title: 'ポジティブ探求者',
  },
  {
    levelThreshold: 4,
    stageName: '癒やしのフクロウ',
    avatarEmoji: '🦉',
    description: '物事の裏側にある優しさに気づける知恵を持ちました。',
    title: '物知りのセラピスト',
  },
  {
    levelThreshold: 6,
    stageName: '心の守護天使',
    avatarEmoji: '👼',
    description: '自分自身も周りの人も温かく包み込める大きな愛の持ち主。',
    title: '光のカウンセラー',
  },
  {
    levelThreshold: 10,
    stageName: 'ココロの神様',
    avatarEmoji: '🦄',
    description: 'どんなネガティブも一瞬で最高の強みに変える究極の存在。',
    title: '自己肯定感マスター',
  },
];

export function getCharacterStage(level: number): StageInfo {
  let currentStage = CHARACTER_STAGES[0];
  for (const stage of CHARACTER_STAGES) {
    if (level >= stage.levelThreshold) {
      currentStage = stage;
    }
  }
  return currentStage;
}
