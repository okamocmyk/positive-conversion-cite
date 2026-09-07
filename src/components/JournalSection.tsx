import React, { useState } from "react";
import {
  Bookmark,
  Trash2,
  Volume2,
  Share2,
  Sparkles,
  Heart,
  TrendingUp,
  Smile,
  Calendar,
  Filter,
} from "lucide-react";
import { ReframedCard, UserStats } from "../types";
import { speakText } from "../utils/speech";
import { ShareQuoteModal } from "./ShareQuoteModal";

interface JournalSectionProps {
  savedCards: ReframedCard[];
  onDeleteCard: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  stats: UserStats;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  savedCards,
  onDeleteCard,
  onToggleFavorite,
  onUpdateNotes,
  stats,
}) => {
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [selectedShareCard, setSelectedShareCard] = useState<ReframedCard | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const displayedCards = filterFavoritesOnly
    ? savedCards.filter((c) => c.isFavorite)
    : savedCards;

  const handleStartEditingNote = (card: ReframedCard) => {
    setEditingNoteId(card.id);
    setNoteInput(card.notes || "");
  };

  const handleSaveNote = (id: string) => {
    onUpdateNotes(id, noteInput);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview Banner */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-bold mb-2 border border-pink-200">
              <Bookmark className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
              自己肯定感ログ & お守りノート
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              マイリフレーミング日記（{savedCards.length}件）
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              これまで積み重ねてきた肯定的な気づきと、心の変化を振り返る場所です。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                filterFavoritesOnly
                  ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                  : "bg-white/40 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/70"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${filterFavoritesOnly ? "fill-white" : "text-pink-500"}`} />
              <span>お気に入りのみ ({savedCards.filter((c) => c.isFavorite).length})</span>
            </button>
          </div>
        </div>

        {/* Analytics Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 space-y-1 shadow-2xs">
            <span className="text-xs text-indigo-800 font-bold block uppercase tracking-wider">累計変換数</span>
            <p className="text-2xl font-black text-indigo-950">{stats.totalReframed} <span className="text-xs font-normal">回</span></p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 space-y-1 shadow-2xs">
            <span className="text-xs text-purple-800 font-bold flex items-center gap-1 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> 平均気分アップ
            </span>
            <p className="text-2xl font-black text-purple-950">
              +{stats.averageMoodBoost.toFixed(1)} <span className="text-xs font-normal">★/5</span>
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 space-y-1 col-span-2 sm:col-span-1 shadow-2xs">
            <span className="text-xs text-pink-800 font-bold block uppercase tracking-wider">お気に入りカード</span>
            <p className="text-2xl font-black text-pink-950">{stats.favoritesCount} <span className="text-xs font-normal">個</span></p>
          </div>
        </div>
      </div>

      {/* Cards History List */}
      <div className="space-y-4">
        {displayedCards.map((card) => {
          const formattedDate = new Date(card.timestamp).toLocaleDateString("ja-JP", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={card.id}
              className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all space-y-4 relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 border border-indigo-200">
                    {card.categoryTag || "自己肯定感"}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formattedDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mood delta badge */}
                  {card.moodBefore !== undefined && card.moodAfter !== undefined && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Smile className="w-3.5 h-3.5 text-emerald-600" />
                      気分: {card.moodBefore}★ ➔ {card.moodAfter}★ (+{Math.max(0, card.moodAfter - card.moodBefore)})
                    </span>
                  )}

                  <button
                    onClick={() => onToggleFavorite(card.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      card.isFavorite
                        ? "bg-pink-500 text-white border-pink-500 shadow-2xs"
                        : "bg-white/50 text-gray-500 hover:text-gray-700 border-white/80"
                    }`}
                    title="お気に入り"
                  >
                    <Heart className={`w-4 h-4 ${card.isFavorite ? "fill-white" : ""}`} />
                  </button>

                  <button
                    onClick={() => speakText(`${card.mainReframedKeyword}。アファメーション。${card.affirmation}`)}
                    className="p-2 text-gray-500 hover:text-indigo-600 rounded-full bg-white/50 hover:bg-white border border-white/80 transition-colors"
                    title="音声を聴く"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedShareCard(card)}
                    className="p-2 text-gray-500 hover:text-gray-800 rounded-full bg-white/50 hover:bg-white border border-white/80 transition-colors"
                    title="シェア・カード化"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteCard(card.id)}
                    className="p-2 text-gray-400 hover:text-pink-600 rounded-full bg-white/50 hover:bg-pink-50 border border-white/80 transition-colors"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Card Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>気づきのきっかけ:</span>
                  <span className="line-through italic">「{card.originalText}」</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  ✨ {card.mainReframedKeyword}
                </h3>

                <div className="bg-indigo-50/70 backdrop-blur-md p-4 rounded-2xl border border-indigo-100 space-y-1">
                  <p className="text-xs font-bold text-indigo-900">【アファメーション】</p>
                  <p className="text-gray-800 text-sm font-semibold">{card.affirmation}</p>
                </div>

                <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/60 space-y-1">
                  <p className="text-xs font-bold text-gray-600">【心のお守りメッセージ】</p>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{card.selfCompassionMessage}</p>
                </div>
              </div>

              {/* Notes Area */}
              <div className="pt-2 border-t border-white/40">
                {editingNoteId === card.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="この言葉についての個人的なメモや振り返りを残す..."
                      className="flex-1 text-xs bg-white/40 border border-white/60 rounded-xl px-3 py-2 text-gray-800 outline-none focus:border-indigo-300"
                    />
                    <button
                      onClick={() => handleSaveNote(card.id)}
                      className="text-xs font-bold px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-xs"
                    >
                      保存
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="italic">
                      {card.notes ? `📝 メモ: ${card.notes}` : "（メモを追加）"}
                    </span>
                    <button
                      onClick={() => handleStartEditingNote(card)}
                      className="text-indigo-600 hover:text-indigo-800 underline font-bold"
                    >
                      {card.notes ? "編集" : "メモを書く"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {displayedCards.length === 0 && (
          <div className="py-16 text-center bg-white/40 backdrop-blur-2xl rounded-3xl border border-dashed border-white/80 text-gray-500 space-y-2">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm font-medium">まだノートに記録がありません。</p>
            <p className="text-xs text-gray-400">「AIリフレーミング」でネガティブな言葉を変換してみましょう。</p>
          </div>
        )}
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
