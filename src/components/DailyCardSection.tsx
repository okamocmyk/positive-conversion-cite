import React, { useState } from "react";
import { Sun, Sparkles, Volume2, Share2, RefreshCw, Heart, Quote } from "lucide-react";
import { ReframedCard } from "../types";
import { speakText } from "../utils/speech";
import { ShareQuoteModal } from "./ShareQuoteModal";

const DAILY_PRESETS: ReframedCard[] = [
  {
    id: "daily-1",
    originalText: "なりふり構わず全力で突き進んでしまう",
    mainReframedKeyword: "情熱に満ちた圧倒的な突破力",
    strengths: [
      "自分の「やりたい」という衝動に嘘をつかない真っ直ぐさ",
      "誰もが躊躇する一歩目を踏み出す大きな勇気",
      "結果を引き寄せる強い推進力と熱量"
    ],
    situationalExamples: [
      "新しい冒険やプロジェクトのスタートダッシュ",
      "ピンチの時に希望の光を灯す挑戦"
    ],
    selfCompassionMessage: "夢中になれる何かを持っていること自体が尊いギフトです。その熱量が誰かの勇気になっています。",
    affirmation: "「私は自分の情熱に従い、前を向いてパワフルに未来を切り拓くことができる。」",
    actionAdvice: "今日ひとつだけ、自分の「やってみたい」という気持ちを素直に叶えてあげましょう。",
    categoryTag: "今日の運気UP",
    timestamp: new Date().toISOString()
  },
  {
    id: "daily-2",
    originalText: "つい人の目が気になって自信が持てない",
    mainReframedKeyword: "豊かな感性と人を思いやる心の優しさ",
    strengths: [
      "相手の感情や微細な変化をキャッチする細やかな共感力",
      "トラブルや衝突を未然に防ぐ平和主義の優しさ",
      "自慢せず謙虚で誠実な美しい姿勢"
    ],
    situationalExamples: [
      "悩んでいる人の気持ちに寄り添い安心感を与える時",
      "チームの信頼と絆を深める心の交流"
    ],
    selfCompassionMessage: "人の目が気になるのは、それだけ周りの人を大切にしたい温かい心を持っているからです。自分にも同じ優しさを向けてあげてください。",
    affirmation: "「私はありのままの自分を優しく受け入れ、安心感と温かさに満たされている。」",
    actionAdvice: "「今日もよく頑張ったね」と温かいお茶を飲みながら自分に声をかけましょう。",
    categoryTag: "自己受容",
    timestamp: new Date().toISOString()
  },
  {
    id: "daily-3",
    originalText: "思うように物事が進まず焦ってしまう",
    mainReframedKeyword: "大きく跳躍するための大切なエネルギー充填期間",
    strengths: [
      "現状に満足せず成長し続けたいという高い目標意識",
      "一度立ち止まって計画を見直す冷静な客観性",
      "どんな状況でも諦めない粘り強い情熱"
    ],
    situationalExamples: [
      "次のステップに向けて根を深く張る準備プロセス",
      "予期せぬトラブルにも臨機応変に対応する柔軟性の獲得"
    ],
    selfCompassionMessage: "植物が花を咲かせる前には必ず冬の準備期間があります。今の停滞は、次へ大きく跳ぶための助走です。",
    affirmation: "「私は自分のペースを信頼し、着実に目標へと近づいている。」",
    actionAdvice: "一気に完璧を目指さず、今日できた小さなできたことを3つ褒めましょう。",
    categoryTag: "心の充電",
    timestamp: new Date().toISOString()
  }
];

export const DailyCardSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedShareCard, setSelectedShareCard] = useState<ReframedCard | null>(null);

  const card = DAILY_PRESETS[currentIndex];

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_PRESETS.length);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold border border-indigo-200">
          <Sun className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" />
          今日を最高の一日にするヒント
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          今日のアファメーション・カード
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm">
          このカードの言葉を心の中で3回唱えて、自己肯定感を高めてみましょう。
        </p>
      </div>

      {/* Main Quote Display Card */}
      <div className="bg-white/50 backdrop-blur-3xl rounded-[40px] p-8 border border-white/70 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-200/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-200/30 blur-[100px] rounded-full pointer-events-none" />

        <Quote className="w-20 h-20 text-indigo-200/40 absolute -top-4 -left-4 pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/50 pb-3 relative z-10">
          <span className="text-xs font-bold px-3.5 py-1 bg-white/80 text-indigo-700 rounded-full border border-indigo-200 shadow-2xs">
            {card.categoryTag}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText(`今日のアファメーション。${card.mainReframedKeyword}。${card.affirmation}。メッセージ。${card.selfCompassionMessage}`)}
              className="p-2 bg-white/60 hover:bg-white text-gray-700 rounded-full border border-white/80 shadow-2xs transition-all"
              title="音声を聴く"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              onClick={() => setSelectedShareCard(card)}
              className="p-2 bg-white/60 hover:bg-white text-gray-700 rounded-full border border-white/80 shadow-2xs transition-all"
              title="カードをシェア・保存"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reframed Core Title */}
        <div className="space-y-2 text-center py-4 relative z-10">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">ネガティブの向こう側にある真実</span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight leading-snug">
            ✨ <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-2">{card.mainReframedKeyword}</span>
          </h3>
        </div>

        {/* Affirmation Big Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-3xl shadow-lg shadow-indigo-100 text-center space-y-2 relative z-10">
          <p className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 本日の自己肯定宣言
          </p>
          <p className="text-lg sm:text-xl font-bold leading-relaxed">
            {card.affirmation}
          </p>
        </div>

        {/* Message */}
        <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/80 space-y-2 relative z-10">
          <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-200" /> 心のお守り言葉
          </p>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            {card.selfCompassionMessage}
          </p>
        </div>

        {/* Action button */}
        <div className="pt-2 text-center relative z-10">
          <button
            onClick={handleNextCard}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            別のアファメーションカードを引く
          </button>
        </div>
      </div>

      {selectedShareCard && (
        <ShareQuoteModal
          card={selectedShareCard}
          onClose={() => setSelectedShareCard(null)}
        />
      )}
    </div>
  );
};
