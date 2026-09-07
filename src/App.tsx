import React, { useState, useEffect } from "react";
import { Header, NavTab } from "./components/Header";
import { AiReframeSection } from "./components/AiReframeSection";
import { DictionarySection } from "./components/DictionarySection";
import { JournalSection } from "./components/JournalSection";
import { DailyCardSection } from "./components/DailyCardSection";
import { CalendarSection } from "./components/CalendarSection";
import { CharacterSection } from "./components/CharacterSection";
import { ReframedCard, UserStats, CharacterState } from "./types";
import { Heart } from "lucide-react";

const INITIAL_EXAMPLE_CARDS: ReframedCard[] = [
  {
    id: "init-1",
    originalText: "私はなりふり構わず行動してしまう",
    mainReframedKeyword: "圧倒的な行動力と情熱の持ち主",
    strengths: [
      "目標に向かって迷いなく突き進むエネルギーがある",
      "周囲が躊躇する場面でも素早く第一歩を踏み出せる",
      "自分の「やってみたい」という情熱に誠実である"
    ],
    situationalExamples: [
      "スタートアップや新しい挑戦を始めるスピード感が求められる場面",
      "緊急時や誰も手をあげない問題に真っ先に向き合う時",
      "自分の本当に大切にしたい夢や目標を実現するプロセス"
    ],
    selfCompassionMessage: "なりふり構わず動けるのは、それだけ本気で生きていて情熱を持っている証拠です。周りの目を気にしすぎて動けない人から見れば、あなたのその推進力は眩しいほどの才能ですよ。",
    affirmation: "「私は自分の情熱に従って、パワフルに未来を切り拓く行動力を持っている」",
    actionAdvice: "走り始める直前に『一呼吸だけ深呼吸』を入れて、進む方向を確認するとさらに無敵の行動力になります。",
    categoryTag: "行動・情熱",
    timestamp: new Date().toISOString(),
    moodBefore: 2,
    moodAfter: 5,
    isFavorite: true,
    notes: "自分の行動力を肯定できるようになってすごく心が軽くなった！"
  }
];

const INITIAL_CHARACTER_STATE: CharacterState = {
  name: "ココロん",
  level: 1,
  exp: 30,
  points: 100,
  streakDays: 1,
  lastLoginDate: "",
  equipped: {
    headwear: "hat-flower",
    aura: "aura-sparkles"
  },
  unlockedItemIds: ["hat-flower", "aura-sparkles"]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("ai");
  const [savedCards, setSavedCards] = useState<ReframedCard[]>(() => {
    try {
      const stored = localStorage.getItem("reframing_cards_v1");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load local storage cards", e);
    }
    return INITIAL_EXAMPLE_CARDS;
  });

  const [characterState, setCharacterState] = useState<CharacterState>(() => {
    try {
      const stored = localStorage.getItem("character_state_v1");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load character state", e);
    }
    return INITIAL_CHARACTER_STATE;
  });

  // Sync savedCards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("reframing_cards_v1", JSON.stringify(savedCards));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [savedCards]);

  // Sync characterState to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("character_state_v1", JSON.stringify(characterState));
    } catch (e) {
      console.error("Failed to save character state", e);
    }
  }, [characterState]);

  // Speech helper
  const handleSpeakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Claim Daily Login Bonus
  const handleClaimDailyBonus = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (characterState.lastLoginDate === todayStr) return;

    let newStreak = characterState.streakDays;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (characterState.lastLoginDate === yesterdayStr) {
      newStreak += 1;
    } else if (characterState.lastLoginDate !== todayStr) {
      newStreak = Math.max(1, newStreak + 1);
    }

    const gainedExp = 50;
    const gainedPoints = 100;

    let newExp = characterState.exp + gainedExp;
    let newLevel = characterState.level;
    const requiredExp = newLevel * 100;

    if (newExp >= requiredExp) {
      newExp -= requiredExp;
      newLevel += 1;
    }

    setCharacterState((prev) => ({
      ...prev,
      level: newLevel,
      exp: newExp,
      points: prev.points + gainedPoints,
      streakDays: newStreak,
      lastLoginDate: todayStr
    }));
  };

  // Compute user stats
  const totalReframed = savedCards.length;
  const favoritesCount = savedCards.filter((c) => c.isFavorite).length;

  const cardsWithUplift = savedCards.filter((c) => c.moodBefore !== undefined && c.moodAfter !== undefined);
  const totalUplift = cardsWithUplift.reduce((acc, c) => acc + (c.moodAfter! - c.moodBefore!), 0);
  const averageMoodBoost = cardsWithUplift.length > 0 ? totalUplift / cardsWithUplift.length : 1.8;

  const stats: UserStats = {
    totalReframed,
    favoritesCount,
    streakDays: characterState.streakDays,
    averageMoodBoost,
  };

  const handleSaveCard = (card: ReframedCard) => {
    setSavedCards((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === card.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = card;
        return next;
      }
      return [card, ...prev];
    });

    // Reward partner on new reframing!
    setCharacterState((prev) => {
      const gainedExp = 30;
      const gainedPoints = 50;
      let newExp = prev.exp + gainedExp;
      let newLevel = prev.level;
      const requiredExp = newLevel * 100;
      if (newExp >= requiredExp) {
        newExp -= requiredExp;
        newLevel += 1;
      }
      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        points: prev.points + gainedPoints
      };
    });
  };

  const handleDeleteCard = (id: string) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setSavedCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setSavedCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );
  };

  const handleSelectFromDictionary = (word: string) => {
    setActiveTab("ai");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#fce7f3] to-[#fef3c7] text-gray-800 font-sans flex flex-col antialiased selection:bg-indigo-200 selection:text-indigo-900">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        partnerName={characterState.name}
        partnerLevel={characterState.level}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6">
        {activeTab === "ai" && (
          <AiReframeSection onSaveCard={handleSaveCard} savedCards={savedCards} />
        )}

        {activeTab === "calendar" && (
          <CalendarSection
            savedCards={savedCards}
            onToggleFavorite={handleToggleFavorite}
            onSpeakText={handleSpeakText}
            onNavigateToAi={() => setActiveTab("ai")}
          />
        )}

        {activeTab === "character" && (
          <CharacterSection
            characterState={characterState}
            onUpdateCharacterState={setCharacterState}
            onClaimDailyBonus={handleClaimDailyBonus}
          />
        )}

        {activeTab === "dictionary" && (
          <DictionarySection onSelectForAi={handleSelectFromDictionary} />
        )}

        {activeTab === "journal" && (
          <JournalSection
            savedCards={savedCards}
            onDeleteCard={handleDeleteCard}
            onToggleFavorite={handleToggleFavorite}
            onUpdateNotes={handleUpdateNotes}
            stats={stats}
          />
        )}

        {activeTab === "daily" && <DailyCardSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-xl border-t border-white/50 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-stone-600 flex items-center justify-center gap-1 font-medium">
            <span>すべての言葉や短所には、あなたを守るための素敵な理由があります</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          </p>
          <p className="text-[11px] text-stone-500">
            ココロ・リフレーミング &copy; {new Date().getFullYear()} — 自己肯定感を高めるポジティブ変換ツール
          </p>
        </div>
      </footer>
    </div>
  );
}

