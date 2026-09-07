import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  Heart,
  Smile,
  Volume2,
  Bookmark,
  ArrowRight,
  Flame,
  Clock
} from 'lucide-react';
import { ReframedCard } from '../types';

interface CalendarSectionProps {
  savedCards: ReframedCard[];
  onSelectCardForAi?: (text: string) => void;
  onToggleFavorite: (id: string) => void;
  onSpeakText: (text: string) => void;
  onNavigateToAi: () => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  savedCards,
  onToggleFavorite,
  onSpeakText,
  onNavigateToAi,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  // Helper to get formatted YYYY-MM-DD for any Date
  const formatDateKey = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 6 = Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group cards by YYYY-MM-DD
  const cardsByDate = savedCards.reduce((acc: Record<string, ReframedCard[]>, card: ReframedCard) => {
    const dateKey = card.timestamp.split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(card);
    return acc;
  }, {});

  // Get cards for selected date
  const selectedDateCards = cardsByDate[selectedDateStr] || [];

  // Monthly stats
  const currentMonthKeyPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthActiveDaysCount = Object.keys(cardsByDate).filter(dateKey =>
    dateKey.startsWith(currentMonthKeyPrefix)
  ).length;

  const monthTotalCardsCount = Object.entries(cardsByDate)
    .filter(([dateKey]) => dateKey.startsWith(currentMonthKeyPrefix))
    .reduce((sum: number, [, cards]) => sum + (cards as ReframedCard[]).length, 0);

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Calendar Header Banner */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
              リフレーミング・カレンダー
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              心と言葉の記録カレンダー
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              日付ごとにポジティブ変換した日と心の変化（気分アップ）を可視化します。
            </p>
          </div>

          {/* Month Navigator Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="text-xs font-bold px-3 py-2 bg-white/60 hover:bg-white text-indigo-700 rounded-full border border-white/80 shadow-2xs transition-all"
            >
              今月
            </button>
            <div className="flex items-center bg-white/50 backdrop-blur-md rounded-full border border-white/80 p-1 shadow-2xs">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-white rounded-full transition-colors"
                title="前月"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 text-sm font-bold text-gray-800 min-w-[100px] text-center">
                {year}年 {month + 1}月
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-white rounded-full transition-colors"
                title="翌月"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 space-y-0.5 shadow-2xs">
            <span className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider block">今月の記録日数</span>
            <p className="text-xl font-black text-indigo-950 flex items-center gap-1">
              <Flame className="w-4 h-4 text-indigo-500" />
              {monthActiveDaysCount} <span className="text-xs font-normal">日</span>
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 space-y-0.5 shadow-2xs">
            <span className="text-[11px] text-purple-700 font-bold uppercase tracking-wider block">今月の変換数</span>
            <p className="text-xl font-black text-purple-950 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              {monthTotalCardsCount} <span className="text-xs font-normal">個</span>
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 space-y-0.5 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] text-pink-700 font-bold uppercase tracking-wider block">選択中の日付</span>
            <p className="text-sm font-bold text-pink-950 flex items-center gap-1">
              <Clock className="w-4 h-4 text-pink-500" />
              {selectedDateStr} ({selectedDateCards.length}件)
            </p>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid & Day Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Container (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-5 shadow-xl space-y-4">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-500 py-2 border-b border-white/50">
            {weekDays.map((d, i) => (
              <span key={d} className={i === 0 ? 'text-rose-500' : i === 6 ? 'text-indigo-500' : ''}>
                {d}
              </span>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty offset cells before 1st day */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-white/10" />
            ))}

            {/* Actual day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateKey(year, month, dayNum);
              const dayCards = cardsByDate[dateStr] || [];
              const isSelected = selectedDateStr === dateStr;
              const isToday = dateStr === todayStr;
              const hasCards = dayCards.length > 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 sm:h-20 rounded-2xl p-1.5 flex flex-col justify-between items-stretch text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-300 scale-[1.02] z-10'
                      : isToday
                      ? 'bg-white/80 border-2 border-indigo-400 text-indigo-900 shadow-xs'
                      : hasCards
                      ? 'bg-white/60 hover:bg-white/90 border border-white/80 text-gray-800 shadow-2xs'
                      : 'bg-white/20 hover:bg-white/50 text-gray-600 border border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isSelected
                          ? 'text-white'
                          : isToday
                          ? 'text-indigo-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {hasCards && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-white/30 text-white'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {dayCards.length}
                      </span>
                    )}
                  </div>

                  {/* Day Badges/Dots */}
                  <div className="space-y-0.5">
                    {hasCards ? (
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-[9px] font-bold truncate px-1 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100/60'
                          }`}
                        >
                          ✨ {dayCards[0].mainReframedKeyword}
                        </span>
                        {dayCards.length > 1 && (
                          <span
                            className={`text-[8px] text-right font-medium block pr-1 ${
                              isSelected ? 'text-indigo-100' : 'text-gray-400'
                            }`}
                          >
                            他+{dayCards.length - 1}件
                          </span>
                        )}
                      </div>
                    ) : isToday ? (
                      <span className="text-[9px] text-indigo-500 font-semibold block text-center opacity-80">
                        今日
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Cards View (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/50 pb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-base">
                  {selectedDateStr} のリフレーミング
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedDateCards.length > 0
                    ? `${selectedDateCards.length}件の記録があります`
                    : 'この日の記録はまだありません'}
                </p>
              </div>

              {selectedDateStr === todayStr && (
                <button
                  onClick={onNavigateToAi}
                  className="text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-3.5 py-1.5 rounded-full shadow-md shadow-indigo-100 transition-all flex items-center gap-1"
                >
                  <span>言葉を変換する</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List of cards for selected date */}
            {selectedDateCards.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {selectedDateCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/50 pb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {card.categoryTag || '自己肯定感'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onToggleFavorite(card.id)}
                          className={`p-1.5 rounded-full border transition-colors ${
                            card.isFavorite
                              ? 'bg-pink-500 text-white border-pink-500'
                              : 'bg-white/50 text-gray-400 hover:text-gray-600 border-white/80'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${card.isFavorite ? 'fill-white' : ''}`} />
                        </button>
                        <button
                          onClick={() => onSpeakText(`リフレーミング。${card.mainReframedKeyword}。${card.affirmation}`)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 bg-white/50 hover:bg-white rounded-full border border-white/80 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400 line-through">「{card.originalText}」</p>
                      <h4 className="text-base font-extrabold text-gray-800 mt-0.5">
                        ✨ {card.mainReframedKeyword}
                      </h4>
                    </div>

                    <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                      <p className="text-xs font-bold text-indigo-900 leading-snug">
                        「{card.affirmation}」
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed bg-white/40 p-3 rounded-xl border border-white/60">
                      {card.selfCompassionMessage}
                    </p>

                    {card.moodBefore !== undefined && card.moodAfter !== undefined && (
                      <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-100 flex items-center gap-1">
                        <Smile className="w-3.5 h-3.5 text-emerald-600" />
                        気分変化: {card.moodBefore}★ ➔ {card.moodAfter}★ (+{Math.max(0, card.moodAfter - card.moodBefore)})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-white/30 rounded-2xl border border-dashed border-white/60 space-y-3">
                <CalendarIcon className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
                <p className="text-xs font-semibold text-gray-600">
                  {selectedDateStr} に記録された変換はありません
                </p>
                <button
                  onClick={onNavigateToAi}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
                >
                  「AIリフレーミング」で言葉を入力する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
