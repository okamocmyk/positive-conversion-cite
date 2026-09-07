import React, { useState } from "react";
import {
  Sparkles,
  Volume2,
  Bookmark,
  Share2,
  CheckCircle2,
  Compass,
  Heart,
  Lightbulb,
  ArrowRight,
  Smile,
  RefreshCw,
  VolumeX,
} from "lucide-react";
import { ReframedCard } from "../types";
import { speakText, stopSpeaking } from "../utils/speech";

interface AiReframeSectionProps {
  onSaveCard: (card: ReframedCard) => void;
  savedCards: ReframedCard[];
}

const QUICK_PROMPTS = [
  "なりふり構わず行動してしまう",
  "八方美人に振る舞ってしまう",
  "仕事で単純なミスをして落ち込んでいる",
  "優柔不断でなかなか決められない",
  "周りの目が気になって本音が言えない",
  "飽き性で何をやっても長続きしない",
  "頑固で周りの意見を聞き入れられない",
];

export const AiReframeSection: React.FC<AiReframeSectionProps> = ({ onSaveCard, savedCards }) => {
  const [inputText, setInputText] = useState("");
  const [context, setContext] = useState("");
  const [moodBefore, setMoodBefore] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState<ReframedCard | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [savedSuccessAlert, setSavedSuccessAlert] = useState(false);

  const handleReframe = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;

    setLoading(true);
    setCurrentCard(null);
    setMoodAfter(null);

    try {
      const response = await fetch("/api/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
      });

      if (!response.ok) {
        throw new Error("サーバーとの通信に失敗しました。");
      }

      const data = await response.json();
      const newCard: ReframedCard = {
        id: "card-" + Date.now(),
        originalText: data.originalText || text,
        mainReframedKeyword: data.mainReframedKeyword,
        strengths: data.strengths || [],
        situationalExamples: data.situationalExamples || [],
        selfCompassionMessage: data.selfCompassionMessage,
        affirmation: data.affirmation,
        actionAdvice: data.actionAdvice,
        categoryTag: data.categoryTag || "自己肯定感",
        timestamp: new Date().toISOString(),
        moodBefore,
        isFavorite: false,
      };

      setCurrentCard(newCard);
      // Auto-save initial card to journal history
      onSaveCard(newCard);
    } catch (err) {
      console.error(err);
      alert("リフレーミング処理中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleMoodAfterSelect = (rating: number) => {
    setMoodAfter(rating);
    if (currentCard) {
      const updatedCard = { ...currentCard, moodAfter: rating };
      setCurrentCard(updatedCard);
      onSaveCard(updatedCard);
      setSavedSuccessAlert(true);
      setTimeout(() => setSavedSuccessAlert(false), 2500);
    }
  };

  const toggleFavorite = () => {
    if (!currentCard) return;
    const updatedCard = { ...currentCard, isFavorite: !currentCard.isFavorite };
    setCurrentCard(updatedCard);
    onSaveCard(updatedCard);
  };

  const isCurrentFavorite = savedCards.some((c) => c.id === currentCard?.id && c.isFavorite);

  const handleAudioToggle = () => {
    if (!currentCard) return;
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${currentCard.mainReframedKeyword}。アファメーション。${currentCard.affirmation}。メッセージ。${currentCard.selfCompassionMessage}`;
      speakText(textToRead, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Input Banner Container */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-indigo-200/30 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-pink-200/30 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold mb-2.5 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              ネガティブ言葉を「才能・強み」に変換
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              今、自分についてモヤモヤしている言葉は何ですか？
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              性格やクセ、最近の出来事や失敗など、どんな言葉でも大丈夫です。心理学の視点で肯定的に捉え直します。
            </p>
          </div>

          {/* Quick Preset Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">よくある言葉から選ぶ:</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(prompt);
                    handleReframe(prompt);
                  }}
                  className="text-xs bg-white/50 hover:bg-white/90 text-gray-700 hover:text-indigo-900 px-3.5 py-1.5 rounded-full border border-white/80 transition-all text-left shadow-2xs"
                >
                  「{prompt}」
                </button>
              ))}
            </div>
          </div>

          {/* Input Text Area */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                id="input-negative-text"
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例: 「私はなりふり構わず行動してしまう」「つい人の目が気になって失敗を恐れてしまう」"
                className="w-full bg-white/30 backdrop-blur-md border border-white/50 focus:border-indigo-300 focus:bg-white/60 focus:ring-2 focus:ring-indigo-200 rounded-2xl p-4 text-gray-800 text-sm placeholder:text-gray-400 leading-relaxed transition-all resize-none outline-none shadow-inner"
              />
            </div>

            {/* Context option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              {/* Mood Before Selector */}
              <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/60">
                <span className="text-xs font-medium text-gray-600">今の気分:</span>
                <div className="flex items-center gap-1">
                  {[
                    { rating: 1, label: "😞 落ち込み", emoji: "😞" },
                    { rating: 2, label: "😟 モヤモヤ", emoji: "😟" },
                    { rating: 3, label: "😐 ふつう", emoji: "😐" },
                    { rating: 4, label: "🙂 悪くない", emoji: "🙂" },
                    { rating: 5, label: "✨ 良い", emoji: "✨" },
                  ].map((m) => (
                    <button
                      key={m.rating}
                      onClick={() => setMoodBefore(m.rating)}
                      title={m.label}
                      className={`p-1 text-base rounded-lg transition-transform ${
                        moodBefore === m.rating ? "scale-125 bg-white border border-indigo-200 shadow-2xs" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-reframe"
                disabled={loading || !inputText.trim()}
                onClick={() => handleReframe()}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    リフレーミング中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    ポジティブに変換する
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Result Display Card */}
      {currentCard && (
        <div className="bg-white/50 backdrop-blur-3xl border border-white/70 rounded-[40px] p-6 sm:p-10 shadow-2xl space-y-8 animate-slide-up relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-200/30 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-200/30 blur-[100px] rounded-full pointer-events-none" />

          {/* Card Top Banner */}
          <div className="bg-white/40 border border-white/80 p-6 rounded-3xl shadow-inner relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="font-medium">元の言葉:</span>
                  <span className="line-through text-gray-600 bg-white/70 px-2 py-0.5 rounded-md">
                    「{currentCard.originalText}」
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-2">✨ {currentCard.mainReframedKeyword}</span>
                </h3>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAudioToggle}
                  className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isPlayingAudio
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white/60 hover:bg-white text-gray-700 border-white/80"
                  }`}
                  title="朗読を聞く"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-500" />}
                  <span>{isPlayingAudio ? "停止" : "聴く"}</span>
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isCurrentFavorite
                      ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                      : "bg-white/60 hover:bg-white text-gray-700 border-white/80"
                  }`}
                  title="お気に入りに保存"
                >
                  <Bookmark className={`w-4 h-4 ${isCurrentFavorite ? "fill-white" : "text-pink-500"}`} />
                  <span>{isCurrentFavorite ? "保存済み" : "保存"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Core Dimensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Strengths (強みの発見) */}
            <div className="bg-emerald-50/60 backdrop-blur-md p-5 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>秘められた「3つの強み」</span>
              </div>
              <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                {currentCard.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100/60 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Situational Examples (強みが活きる場面) */}
            <div className="bg-purple-50/60 backdrop-blur-md p-5 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Compass className="w-5 h-5 text-purple-600" />
                <span>この強みが輝く場面</span>
              </div>
              <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                {currentCard.situationalExamples.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-purple-100/60 shadow-2xs">
                    <span className="text-purple-500 font-bold mt-0.5">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Affirmation Mantra Box */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-2xl shadow-lg shadow-indigo-100 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/20 pb-2">
              <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 text-indigo-100">
                <Sparkles className="w-4 h-4 text-amber-300" /> 自己肯定感を高めるアファメーション
              </span>
              <Heart className="w-4 h-4 text-pink-200 fill-pink-200" />
            </div>
            <p className="text-lg sm:text-xl font-bold tracking-tight leading-relaxed pt-1">
              {currentCard.affirmation}
            </p>
          </div>

          {/* 4. Self Compassion Message & Action Step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/80 space-y-2">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-100" />
                <span>心のお守りメッセージ</span>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                {currentCard.selfCompassionMessage}
              </p>
            </div>

            <div className="bg-indigo-50/60 backdrop-blur-md p-5 rounded-2xl border border-indigo-100 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>小さな1歩アドバイス</span>
              </div>
              <p className="text-indigo-950 text-xs leading-relaxed">
                {currentCard.actionAdvice}
              </p>
            </div>
          </div>

          {/* Post-Reframing Mood Rating Uplift */}
          <div className="border-t border-white/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Smile className="w-5 h-5 text-indigo-500" />
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                リフレーミング後の今の気分はどうですか？
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[
                { rating: 1, emoji: "😞" },
                { rating: 2, emoji: "😟" },
                { rating: 3, emoji: "😐" },
                { rating: 4, emoji: "🙂" },
                { rating: 5, emoji: "✨" },
              ].map((m) => (
                <button
                  key={m.rating}
                  onClick={() => handleMoodAfterSelect(m.rating)}
                  className={`p-2 rounded-xl text-lg transition-transform ${
                    moodAfter === m.rating
                      ? "scale-125 bg-white border border-indigo-300 shadow-xs"
                      : "bg-white/40 hover:bg-white/80 text-gray-600"
                  }`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          {savedSuccessAlert && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs text-center font-medium animate-fade-in">
              ✨ 気分ログを記録しました！マイノートから振り返ることができます。
            </div>
          )}
        </div>
      )}
    </div>
  );
};
