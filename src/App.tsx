import React, { useState, useEffect } from "react";
import { Header, NavTab } from "./components/Header";
import { AiReframeSection } from "./components/AiReframeSection";
import { DictionarySection } from "./components/DictionarySection";
import { JournalSection } from "./components/JournalSection";
import { DailyCardSection } from "./components/DailyCardSection";
import { CalendarSection } from "./components/CalendarSection";
import { CharacterSection } from "./components/CharacterSection";
import { ReframedCard, UserStats, CharacterState } from "./types";
import { Heart, Cloud, LogIn, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "./context/AuthContext";

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
  const { user, fetchWithAuth, signInWithGoogle, loading: authLoading, error: authError } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>("ai");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

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

  // Sync to database when user logs in
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    setIsSyncing(true);

    fetchWithAuth("/api/auth/sync", { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("Sync failed");
        return res.json();
      })
      .then(async (data) => {
        if (!isMounted) return;
        if (data.cards && data.cards.length > 0) {
          setSavedCards(data.cards);
        } else if (savedCards.length > 0) {
          // If user has local cards from before login, upload them
          for (const card of savedCards) {
            await fetchWithAuth("/api/cards", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ card }),
            });
          }
        }

        if (data.character) {
          setCharacterState(data.character);
        }

        setSyncNotice("クラウドデータベースと同期しました");
        setTimeout(() => setSyncNotice(null), 3500);
      })
      .catch((err) => {
        console.error("Database sync error:", err);
      })
      .finally(() => {
        if (isMounted) setIsSyncing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Sync to localStorage as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem("reframing_cards_v1", JSON.stringify(savedCards));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [savedCards]);

  useEffect(() => {
    try {
      localStorage.setItem("character_state_v1", JSON.stringify(characterState));
    } catch (e) {
      console.error("Failed to save character state", e);
    }
  }, [characterState]);

  // Helper to persist character updates to database if logged in
  const updateCharacterWithSync = (next: CharacterState | ((prev: CharacterState) => CharacterState)) => {
    setCharacterState((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      if (user) {
        fetchWithAuth("/api/character", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ character: updated }),
        }).catch((err) => console.error("Failed to sync character:", err));
      }
      return updated;
    });
  };

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

    const updated: CharacterState = {
      ...characterState,
      level: newLevel,
      exp: newExp,
      points: characterState.points + gainedPoints,
      streakDays: newStreak,
      lastLoginDate: todayStr,
    };

    updateCharacterWithSync(updated);
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

    if (user) {
      fetchWithAuth("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card }),
      }).catch((err) => console.error("Failed to save card to cloud:", err));
    }

    // Reward partner on new reframing!
    updateCharacterWithSync((prev) => {
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
        points: prev.points + gainedPoints,
      };
    });
  };

  const handleDeleteCard = (id: string) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== id));
    if (user) {
      fetchWithAuth(`/api/cards/${id}`, { method: "DELETE" }).catch((err) =>
        console.error("Failed to delete card in cloud:", err)
      );
    }
  };

  const handleToggleFavorite = (id: string) => {
    setSavedCards((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
      const target = next.find((c) => c.id === id);
      if (user && target) {
        fetchWithAuth("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card: target }),
        }).catch((err) => console.error("Failed to update favorite in cloud:", err));
      }
      return next;
    });
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setSavedCards((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, notes } : c));
      const target = next.find((c) => c.id === id);
      if (user && target) {
        fetchWithAuth("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card: target }),
        }).catch((err) => console.error("Failed to update notes in cloud:", err));
      }
      return next;
    });
  };

  const handleSelectFromDictionary = (_word: string) => {
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
        isSyncing={isSyncing}
      />

      {/* Sync / Notification Toast */}
      {syncNotice && (
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-3">
          <div className="bg-emerald-50/90 backdrop-blur-md border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        </div>
      )}

      {/* Auth Error Banner (e.g. Firebase unauthorized domain on Vercel) */}
      {authError && (
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-3">
          <div className="bg-red-50/95 backdrop-blur-md border border-red-200 text-red-900 p-4 rounded-2xl text-xs flex items-start gap-3 shadow-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-red-950">ログインエラーが発生しました</p>
              <p className="text-red-800 leading-relaxed">{authError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Account Login Invitation Banner (shown when guest) */}
      {!user && !authLoading && (
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-4">
          <div className="bg-white/60 backdrop-blur-md border border-indigo-100 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  アカウント連携でデータを安全にクラウド保存
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    ユーザー個別管理
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Googleアカウントでログインすると、あなただけのリフレーミング記録やココロんの育成データが安全に保存されます。
                </p>
              </div>
            </div>
            <button
              id="banner-login-btn"
              onClick={() => signInWithGoogle()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Googleでログイン</span>
            </button>
          </div>
        </div>
      )}

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
            onUpdateCharacterState={updateCharacterWithSync}
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
