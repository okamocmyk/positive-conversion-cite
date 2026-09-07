import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Heart,
  Shirt,
  Award,
  Crown,
  Check,
  Lock,
  Flame,
  Star,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { CharacterState, DressUpCategory, DressUpItem } from '../types';
import { DRESS_UP_ITEMS, getCharacterStage } from '../data/dressUpCatalog';

interface CharacterSectionProps {
  characterState: CharacterState;
  onUpdateCharacterState: (newState: CharacterState) => void;
  onClaimDailyBonus: () => void;
}

export const CharacterSection: React.FC<CharacterSectionProps> = ({
  characterState,
  onUpdateCharacterState,
  onClaimDailyBonus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DressUpCategory>('headwear');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(characterState.name || 'ココロん');
  const [petMessage, setPetMessage] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const isClaimedToday = characterState.lastLoginDate === todayStr;

  const currentStage = getCharacterStage(characterState.level);
  const nextStageLevel = characterState.level + 1;
  const expForCurrentLevel = characterState.level * 100;
  const expProgressPercent = Math.min(
    100,
    Math.round((characterState.exp / expForCurrentLevel) * 100)
  );

  // Equipped items resolution
  const equippedHeadwear = DRESS_UP_ITEMS.find(
    (i) => i.id === characterState.equipped.headwear
  );
  const equippedAccessory = DRESS_UP_ITEMS.find(
    (i) => i.id === characterState.equipped.accessory
  );
  const equippedAura = DRESS_UP_ITEMS.find(
    (i) => i.id === characterState.equipped.aura
  );
  const equippedOutfit = DRESS_UP_ITEMS.find(
    (i) => i.id === characterState.equipped.outfit
  );

  // Equip or Unequip Item
  const handleToggleEquip = (item: DressUpItem) => {
    const isEquipped = characterState.equipped[item.category] === item.id;
    const newEquipped = { ...characterState.equipped };

    if (isEquipped) {
      delete newEquipped[item.category];
    } else {
      newEquipped[item.category] = item.id;
    }

    onUpdateCharacterState({
      ...characterState,
      equipped: newEquipped,
    });
  };

  // Buy item
  const handleUnlockItem = (item: DressUpItem) => {
    if (characterState.points < item.cost) return;

    const newUnlocked = [...characterState.unlockedItemIds, item.id];
    const newEquipped = { ...characterState.equipped, [item.category]: item.id };

    onUpdateCharacterState({
      ...characterState,
      points: characterState.points - item.cost,
      unlockedItemIds: newUnlocked,
      equipped: newEquipped,
    });
  };

  // Save Partner Name
  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateCharacterState({
        ...characterState,
        name: nameInput.trim(),
      });
    }
    setIsEditingName(false);
  };

  // Interactive petting
  const handlePet = () => {
    const messages = [
      `「きょうもがんばってるね！ボクがいつでも味方だよ✨」`,
      `「言葉をポジティブに変えると、心がぽかぽかしてくるね♪」`,
      `「うれしい！なでなでしてくれてありがとう❤️」`,
      `「どんなあなたも大好きだよ。焦らず一歩ずつ進もうね！」`,
      `「きょうの自分をいっぱい褒めてあげようね✨」`,
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setPetMessage(randomMsg);
  };

  const filteredItems = DRESS_UP_ITEMS.filter((i) => i.category === selectedCategory);

  const categories: { id: DressUpCategory; label: string; icon: string }[] = [
    { id: 'headwear', label: '帽子・かぶりもの', icon: '🌸' },
    { id: 'accessory', label: 'アクセ・持ち物', icon: '👓' },
    { id: 'aura', label: 'オーラ・輝き', icon: '✨' },
    { id: 'outfit', label: '衣装・羽', icon: '🪽' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Daily Login Header Banner */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
              <Gift className="w-3.5 h-3.5 text-indigo-600" />
              毎日ログイン ＆ パートナー成長
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              マイパートナー「{characterState.name}」
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              毎日ログインやリフレーミングでポイントを獲得し、ココロんを成長・着せ替えしましょう！
            </p>
          </div>

          {/* Daily Login Claim Button */}
          <div>
            {isClaimedToday ? (
              <div className="bg-emerald-100/80 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>本日のログインボーナス取得済み (+50 EXP / +100pt)</span>
              </div>
            ) : (
              <button
                onClick={onClaimDailyBonus}
                className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
                <span>ログインボーナスを受け取る (+50 EXP / +100pt)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 space-y-0.5 shadow-2xs">
            <span className="text-[11px] text-indigo-700 font-bold block uppercase tracking-wider">連続ログイン</span>
            <p className="text-xl font-black text-indigo-950 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {characterState.streakDays} <span className="text-xs font-normal">日</span>
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 space-y-0.5 shadow-2xs">
            <span className="text-[11px] text-purple-700 font-bold block uppercase tracking-wider">成長レベル</span>
            <p className="text-xl font-black text-purple-950 flex items-center gap-1">
              <Crown className="w-4 h-4 text-purple-500" />
              Lv.{characterState.level}
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 space-y-0.5 shadow-2xs">
            <span className="text-[11px] text-pink-700 font-bold block uppercase tracking-wider">所持ポイント</span>
            <p className="text-xl font-black text-pink-950 flex items-center gap-1">
              <Star className="w-4 h-4 text-pink-500 fill-pink-500" />
              {characterState.points} <span className="text-xs font-normal">pt</span>
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 space-y-0.5 shadow-2xs">
            <span className="text-[11px] text-emerald-700 font-bold block uppercase tracking-wider">現在の称号</span>
            <p className="text-xs font-bold text-emerald-900 truncate mt-1">
              {currentStage.title}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Character Stage & Preview, Right = Dress-up Wardrobe Shop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Character Stage & Interactive Box (5 cols) */}
        <div className="lg:col-span-5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Background decorative blur */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-indigo-200/30 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-pink-200/30 blur-[90px] rounded-full pointer-events-none" />

          {/* Partner Header & Renaming */}
          <div className="flex items-center justify-between z-10">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-white/80 border border-indigo-300 rounded-xl px-3 py-1 text-sm font-bold text-gray-800 outline-none w-32"
                />
                <button
                  onClick={handleSaveName}
                  className="text-xs font-bold px-3 py-1 bg-indigo-600 text-white rounded-xl"
                >
                  保存
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                  {characterState.name}
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                    {currentStage.stageName}
                  </span>
                </h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="名前を変更"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="text-xs font-bold text-indigo-700 bg-white/60 px-3 py-1 rounded-full border border-white/80">
              Lv.{characterState.level}
            </div>
          </div>

            {/* Visual Avatar Stage Display Container */}
            <div className="relative my-4 flex flex-col items-center justify-center p-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/70 shadow-inner z-10 min-h-[250px] overflow-visible">
              {/* Aura Effect Layer - Surrounding Kokoron so it's not hidden behind */}
              {equippedAura && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Center radiating pulse glow */}
                  <div
                    className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full blur-2xl opacity-60 animate-pulse ${
                      equippedAura.id === 'aura-rainbow'
                        ? 'bg-gradient-to-r from-rose-300 via-amber-200 via-emerald-300 to-sky-300'
                        : equippedAura.id === 'aura-sun'
                        ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300'
                        : equippedAura.id === 'aura-hearts'
                        ? 'bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300'
                        : 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300'
                    }`}
                  />
                  {/* Orbiting / Surrounding aura particles around Kokoron */}
                  <div className="absolute top-2 left-6 text-2xl sm:text-3xl animate-bounce opacity-95">
                    {equippedAura.emoji}
                  </div>
                  <div className="absolute top-3 right-6 text-2xl sm:text-3xl animate-pulse opacity-95">
                    {equippedAura.emoji}
                  </div>
                  <div className="absolute bottom-8 left-6 text-2xl sm:text-3xl animate-pulse opacity-90">
                    {equippedAura.emoji}
                  </div>
                  <div className="absolute bottom-8 right-6 text-2xl sm:text-3xl animate-bounce opacity-90">
                    {equippedAura.emoji}
                  </div>
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 text-2xl sm:text-3xl animate-pulse opacity-90">
                    {equippedAura.emoji}
                  </div>
                  <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-2xl sm:text-3xl animate-pulse opacity-90">
                    {equippedAura.emoji}
                  </div>
                </div>
              )}

              {/* Character & Equipment Composition Box */}
              <div
                className="relative inline-flex items-center justify-center select-none my-2 cursor-pointer group"
                onClick={handlePet}
              >
                {/* Back Layer: Wings / Cape (Left & Right) */}
                {equippedOutfit && equippedOutfit.position === 'back' && (
                  <>
                    <div className="absolute top-1 -left-7 text-3xl sm:text-4xl z-10 pointer-events-none transform -scale-x-100 animate-pulse">
                      {equippedOutfit.emoji}
                    </div>
                    <div className="absolute top-1 -right-7 text-3xl sm:text-4xl z-10 pointer-events-none animate-pulse">
                      {equippedOutfit.emoji}
                    </div>
                  </>
                )}

                {/* Main Character Body Stage Emoji */}
                <div className="relative z-20 text-7xl sm:text-8xl transition-transform group-hover:scale-110 duration-300 drop-shadow-md">
                  {currentStage.avatarEmoji}
                </div>

                {/* Headwear Item (Placed directly on head) */}
                {equippedHeadwear && (
                  <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl z-30 pointer-events-none filter drop-shadow animate-bounce">
                    {equippedHeadwear.emoji}
                  </div>
                )}

                {/* Face Accessory: Sunglasses / Glasses (Placed directly on Face!) */}
                {equippedAccessory && equippedAccessory.position === 'face' && (
                  <div className="absolute top-[32%] left-1/2 -translate-x-1/2 text-3xl sm:text-4xl z-30 pointer-events-none filter drop-shadow-md select-none transform transition-transform">
                    {equippedAccessory.emoji}
                  </div>
                )}

                {/* Hand Accessory: Wand, etc. (Held at side) */}
                {equippedAccessory && equippedAccessory.position === 'hand' && (
                  <div className="absolute bottom-1 -right-6 text-3xl sm:text-4xl z-30 pointer-events-none filter drop-shadow animate-pulse">
                    {equippedAccessory.emoji}
                  </div>
                )}

                {/* Chest / Badge Accessory: Medal, Ribbon */}
                {equippedAccessory && equippedAccessory.position === 'chest' && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl z-30 pointer-events-none filter drop-shadow">
                    {equippedAccessory.emoji}
                  </div>
                )}

                {/* Chest Outfit: Kimono, etc. */}
                {equippedOutfit && equippedOutfit.position === 'chest' && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl z-30 pointer-events-none filter drop-shadow">
                    {equippedOutfit.emoji}
                  </div>
                )}
              </div>

              {/* Stage Description */}
              <p className="text-xs text-gray-600 text-center font-medium mt-3 z-10 max-w-xs">
                {currentStage.description}
              </p>
            </div>

          {/* Interactive Petting Message Bubble */}
          {petMessage && (
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-pink-200 shadow-sm text-xs font-bold text-pink-900 text-center animate-fade-in z-10">
              {petMessage}
            </div>
          )}

          {/* EXP Progress Bar */}
          <div className="space-y-1.5 z-10">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600">
              <span>次のレベル (Lv.{nextStageLevel}) まで</span>
              <span>
                {characterState.exp} / {expForCurrentLevel} EXP ({expProgressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden border border-white/80 p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${expProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Pet Button */}
          <button
            onClick={handlePet}
            className="w-full py-3 bg-white/60 hover:bg-white text-pink-700 border border-white/80 font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs z-10"
          >
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>{characterState.name}をなでなで（声を聴く）</span>
          </button>
        </div>

        {/* Wardrobe & Dress-up Shop (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/50 pb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <Shirt className="w-5 h-5 text-indigo-500" />
                クローゼット ＆ きせかえショップ
              </h3>
              <p className="text-xs text-gray-500">
                レベルやポイントで可愛いアイテムを解放してコーディネートしよう！
              </p>
            </div>

            <div className="text-xs font-bold bg-white/60 text-pink-900 px-3.5 py-1.5 rounded-full border border-white/80 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>{characterState.points} pt</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200'
                    : 'bg-white/40 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/70'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isUnlocked = characterState.unlockedItemIds.includes(item.id) || item.cost === 0;
              const isEquipped = characterState.equipped[item.category] === item.id;
              const isLevelLocked = characterState.level < item.requiredLevel;
              const canAfford = characterState.points >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isEquipped
                      ? 'bg-white/80 border-2 border-indigo-400 shadow-md ring-1 ring-indigo-200'
                      : isUnlocked
                      ? 'bg-white/50 hover:bg-white/80 border-white/80 shadow-2xs'
                      : 'bg-white/20 border-white/40 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/80 border border-white flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {item.emoji}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 flex-wrap">
                        <span>{item.name}</span>
                        {item.position && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                            {item.position === 'face'
                              ? '顔・目元'
                              : item.position === 'head'
                              ? '頭部'
                              : item.position === 'hand'
                              ? '手持ち'
                              : item.position === 'aura'
                              ? '全身オーラ'
                              : item.position === 'back'
                              ? '背中・翼'
                              : '胸元・体'}
                          </span>
                        )}
                        {isEquipped && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500 text-white rounded-full">
                            着用中
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Cost */}
                  <div className="pt-2 border-t border-white/50 flex items-center justify-between gap-2">
                    {isLevelLocked ? (
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Lv.{item.requiredLevel}で解放
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleToggleEquip(item)}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          isEquipped
                            ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xs hover:shadow-md'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" /> はずす
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5" /> きせかえる
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlockItem(item)}
                        disabled={!canAfford}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          canAfford
                            ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-xs hover:shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.cost}ptで解放</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
