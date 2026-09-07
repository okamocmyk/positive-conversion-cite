import React from "react";
import { Sparkles, BookOpen, BookmarkCheck, Sun, Heart, Flame, Calendar as CalendarIcon, Crown } from "lucide-react";
import { UserStats } from "../types";

export type NavTab = "ai" | "dictionary" | "journal" | "calendar" | "character" | "daily";

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stats: UserStats;
  partnerName?: string;
  partnerLevel?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, stats, partnerName = "ココロん", partnerLevel = 1 }) => {
  return (
    <header className="bg-white/40 backdrop-blur-2xl border-b border-white/60 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3.5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/60 flex items-center justify-center shadow-sm text-indigo-500">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
                ココロ・リフレーミング
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  自己肯定感UP
                </span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                ネガティブな視点を「あなたの強み」へ優しく変換
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab("character")}
              className="bg-white/50 backdrop-blur-md border border-white/60 text-purple-900 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs font-medium hover:bg-white/80 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-purple-500" />
              <span>{partnerName} <strong className="font-bold text-purple-950">Lv.{partnerLevel}</strong></span>
            </button>
            <div className="bg-white/50 backdrop-blur-md border border-white/60 text-indigo-900 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs font-medium">
              <Flame className="w-3.5 h-3.5 text-indigo-500" />
              <span>変換数 <strong className="font-bold text-indigo-950">{stats.totalReframed}</strong>回</span>
            </div>
            <div className="bg-white/50 backdrop-blur-md border border-white/60 text-pink-900 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs font-medium">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/30" />
              <span>お気に入り <strong className="font-bold text-pink-950">{stats.favoritesCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 mt-3 pt-2 border-t border-white/40 overflow-x-auto no-scrollbar">
          <button
            id="tab-btn-ai"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AIリフレーミング
          </button>

          <button
            id="tab-btn-calendar"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "calendar"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            カレンダー
          </button>

          <button
            id="tab-btn-character"
            onClick={() => setActiveTab("character")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "character"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            パートナー＆きせかえ
          </button>

          <button
            id="tab-btn-dictionary"
            onClick={() => setActiveTab("dictionary")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "dictionary"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            変換辞書（言葉図鑑）
          </button>

          <button
            id="tab-btn-journal"
            onClick={() => setActiveTab("journal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "journal"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-pink-400" />
            マイノート ({stats.favoritesCount})
          </button>

          <button
            id="tab-btn-daily"
            onClick={() => setActiveTab("daily")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            今日のアファメーション
          </button>
        </nav>
      </div>
    </header>
  );
};

