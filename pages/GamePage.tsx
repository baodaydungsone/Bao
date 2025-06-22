import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GameState, StoryMessage, PlayerChoice, ModalType, NSFWPreferences, Entity, EntityType, CharacterStats, InventoryItem, CharacterAttribute, ItemEffect, ToastType, StatChange, Achievement, Skill, SkillChange, ActiveSidebarTab, NPCProfile, RelationshipStatus, Objective, EquipmentSlot, StatBonus, StorySetupData, SkillProficiency, AutosavedGameInfo, Settings } from '../types';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import { useSettings } from '../contexts/SettingsContext';
import { usePublicToast } from '../contexts/ToastContext';
import { generateInitialStory, generateNextStorySegment, NextStorySegmentResult } from '../services/GeminiService';
import { LOCAL_STORAGE_API_KEY } from '../constants';
import Modal from '../components/Modal'; 
import MobileActionSheet from '../components/MobileActionSheet'; // Import MobileActionSheet
import GoogleAuthButton from '../components/GoogleAuthButton'; // Import GoogleAuthButton

interface GamePageProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  openModal: (modalType: ModalType) => void;
  quitGame: () => void;
  nsfwSettings: NSFWPreferences;
  autosaveCurrentStory: (gameState: GameState) => void;
}

// Custom hook for media queries (simple implementation)
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => {
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
    };
    updateMatch(); // Initial check
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [matches, query]);

  return matches;
}


const INITIAL_MESSAGES_TO_SHOW = 20;
const MESSAGES_TO_LOAD_PER_CLICK = 20;

const KEYWORD_TYPE_COLORS: Record<string, { base: string; focusRing: string }> = {
  [EntityType.NPC]:         { base: 'text-sky-600 dark:text-sky-400', focusRing: 'focus:ring-sky-500' },
  [EntityType.Item]:        { base: 'text-amber-600 dark:text-amber-400', focusRing: 'focus:ring-amber-500' },
  [EntityType.Location]:    { base: 'text-green-600 dark:text-green-400', focusRing: 'focus:ring-green-500' },
  [EntityType.Organization]:{ base: 'text-purple-600 dark:text-purple-400', focusRing: 'focus:ring-purple-500' },
  "STAT":                   { base: 'text-blue-600 dark:text-blue-400', focusRing: 'focus:ring-blue-500' },
  "SKILL":                  { base: 'text-cyan-600 dark:text-cyan-400', focusRing: 'focus:ring-cyan-500' },
  "ACH":                    { base: 'text-yellow-500 dark:text-yellow-300', focusRing: 'focus:ring-yellow-400' },
  "TRAIT":                  { base: 'text-fuchsia-600 dark:text-fuchsia-400', focusRing: 'focus:ring-fuchsia-500' },
  [EntityType.Other]:       { base: 'text-slate-600 dark:text-slate-400', focusRing: 'focus:ring-slate-500' },
  "DEFAULT":                { base: 'text-orange-600 dark:text-orange-400', focusRing: 'focus:ring-orange-500'} // Default/fallback
};


// --- Helper Functions for Stats with Equipment ---
const calculateEffectiveStats = (
    baseStats: CharacterStats, 
    equippedItems: Partial<Record<EquipmentSlot, InventoryItem['id']>>,
    inventory: InventoryItem[]
): CharacterStats => {
    const effectiveStats = JSON.parse(JSON.stringify(baseStats)) as CharacterStats; 

    const allBonuses: StatBonus[] = [];
    Object.values(equippedItems).forEach(itemId => {
        if (itemId) {
            const item = inventory.find(i => i.id === itemId);
            if (item && item.equippable && item.statBonuses) {
                allBonuses.push(...item.statBonuses);
            }
        }
    });

    // Apply flat bonuses first
    allBonuses.forEach(bonus => {
        if (!bonus.isPercentage) {
            const stat = effectiveStats[bonus.statId];
            if (stat) {
                if (bonus.appliesToMax && typeof stat.maxValue === 'number') {
                    stat.maxValue += bonus.value;
                } else if (typeof stat.value === 'number') {
                    stat.value += bonus.value;
                }
                if (bonus.statId === 'hp' && typeof stat.value === 'number' && typeof stat.maxValue === 'number') {
                    stat.value = Math.min(stat.value, stat.maxValue);
                }
            }
        }
    });

    // Apply percentage bonuses
    allBonuses.forEach(bonus => {
        if (bonus.isPercentage) {
            const statToUpdateWithPercentage = effectiveStats[bonus.statId]; 
            const originalBaseStatForPercentage = baseStats[bonus.statId];

            if (statToUpdateWithPercentage && originalBaseStatForPercentage) {
                const baseValueForCalc = bonus.appliesToMax && typeof originalBaseStatForPercentage.maxValue === 'number'
                    ? originalBaseStatForPercentage.maxValue
                    : typeof originalBaseStatForPercentage.value === 'number'
                    ? originalBaseStatForPercentage.value
                    : 0; 

                if (typeof baseValueForCalc === 'number' && baseValueForCalc !== 0) { 
                    const percentageIncrement = baseValueForCalc * (bonus.value / 100);
                    if (bonus.appliesToMax && typeof statToUpdateWithPercentage.maxValue === 'number') {
                        statToUpdateWithPercentage.maxValue += percentageIncrement;
                    } else if (typeof statToUpdateWithPercentage.value === 'number') {
                        statToUpdateWithPercentage.value += percentageIncrement;
                    }
                    if (bonus.statId === 'hp' && typeof statToUpdateWithPercentage.value === 'number' && typeof statToUpdateWithPercentage.maxValue === 'number') {
                        statToUpdateWithPercentage.value = Math.min(statToUpdateWithPercentage.value, statToUpdateWithPercentage.maxValue);
                    }
                }
            }
        }
    });
    
    if (effectiveStats.hp && typeof effectiveStats.hp.value === 'number' && typeof effectiveStats.hp.maxValue === 'number') {
        effectiveStats.hp.value = Math.min(effectiveStats.hp.value, effectiveStats.hp.maxValue);
        effectiveStats.hp.value = Math.max(0, effectiveStats.hp.value); 
    }
    for (const statId in effectiveStats) {
        const stat = effectiveStats[statId];
        if (typeof stat.value === 'number' && typeof stat.maxValue === 'number' && stat.id !== 'hp' && !stat.isProgressionStat) { 
            stat.value = Math.min(stat.value, stat.maxValue);
             if (stat.id === 'mp' || stat.id === 'spiritual_qi') stat.value = Math.max(0, stat.value); 
        }
        if (typeof stat.value === 'number' && stat.id !== 'attack_speed') stat.value = parseFloat(stat.value.toFixed(1));
        if (typeof stat.maxValue === 'number' && stat.id !== 'attack_speed') stat.maxValue = parseFloat(stat.maxValue.toFixed(1));
    }
    return effectiveStats;
};


// --- Panel Components ---
interface CharacterStatsPanelProps {
  baseStats: CharacterStats;
  equippedItems: Partial<Record<EquipmentSlot, InventoryItem['id']>>;
  inventory: InventoryItem[];
  characterName: string;
}
const CharacterStatsPanel: React.FC<CharacterStatsPanelProps> = React.memo(({ baseStats, equippedItems, inventory, characterName }) => {
  const effectiveStats = useMemo(() => calculateEffectiveStats(baseStats, equippedItems, inventory), [baseStats, equippedItems, inventory]);
  
  if (Object.keys(baseStats).length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 p-4 text-center">Chưa có thông tin chỉ số.</p>;
  }

  const progressionStat = Object.values(effectiveStats).find(stat => stat.isProgressionStat);
  const coreStatsToDisplay: (keyof CharacterStats)[] = ['hp', 'mp', 'spiritual_qi'];
  const primaryAttributes: (keyof CharacterStats)[] = ['intelligence', 'constitution', 'agility', 'luck']; 
  const combatStatOrder: (keyof CharacterStats)[] = ['damage_output', 'defense_value', 'attack_speed', 'crit_chance', 'crit_damage_bonus', 'evasion_chance'];

  const otherNonCombatStats = Object.values(effectiveStats).filter(stat =>
    !stat.isProgressionStat &&
    !coreStatsToDisplay.includes(stat.id) &&
    !primaryAttributes.includes(stat.id) && 
    !combatStatOrder.includes(stat.id)
  );

  const renderStat = useCallback((stat: CharacterAttribute, isCombatStat: boolean = false, isPrimaryAttribute: boolean = false, isCore: boolean = false) => {
    const valueIsPercentage = ['crit_chance', 'crit_damage_bonus', 'evasion_chance'].includes(stat.id);
    let displayValue: string | number = typeof stat.value === 'number' 
        ? parseFloat(stat.value.toFixed(stat.id === 'attack_speed' ? 2 : 1)) 
        : String(stat.value);
    
    if (valueIsPercentage) {
        displayValue = `${displayValue}%`;
    } else if (typeof stat.value === 'number' && stat.maxValue !== undefined && !stat.isProgressionStat) {
        const val = parseFloat(stat.value.toFixed(1));
        const maxVal = parseFloat(stat.maxValue.toFixed(1));
        displayValue = `${val} / ${maxVal}`;
    }

    let bgColor = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/80';
    let textColor = 'text-slate-700 dark:text-slate-200';
    let iconColor = 'text-primary dark:text-primary-light';
    let progressBarColor = 'bg-primary dark:bg-primary-dark';

    if (isCombatStat) {
        bgColor = 'bg-rose-50 dark:bg-rose-900/50 border-rose-200 dark:border-rose-700/70';
        textColor = 'text-rose-700 dark:text-rose-200';
        iconColor = 'text-rose-500 dark:text-rose-400';
        progressBarColor = 'bg-rose-500 dark:bg-rose-400';
    } else if (isPrimaryAttribute) {
        bgColor = 'bg-sky-50 dark:bg-sky-900/50 border-sky-200 dark:border-sky-700/70';
        textColor = 'text-sky-700 dark:text-sky-200';
        iconColor = 'text-sky-500 dark:text-sky-400';
        progressBarColor = 'bg-sky-500 dark:bg-sky-400';
    } else if (isCore) {
        if (stat.id === 'hp') { iconColor = 'text-red-500 dark:text-red-400'; progressBarColor = 'bg-red-500 dark:bg-red-400'; }
        else if (stat.id === 'mp') { iconColor = 'text-blue-500 dark:text-blue-400'; progressBarColor = 'bg-blue-500 dark:bg-blue-400'; }
        else if (stat.id === 'spiritual_qi') { iconColor = 'text-amber-500 dark:text-amber-400'; progressBarColor = 'bg-amber-500 dark:bg-amber-400'; }
    }


    const originalBaseStatValue = baseStats[stat.id]?.value; 
    const originalBaseStatMaxValue = baseStats[stat.id]?.maxValue; 
    let bonusDisplay = "";

    if (typeof stat.value === 'number' && typeof originalBaseStatValue === 'number' && Math.abs(stat.value - originalBaseStatValue) > 0.01) {
        const diff = stat.value - originalBaseStatValue;
        bonusDisplay += ` (Gốc ${parseFloat(originalBaseStatValue.toFixed(1))}${diff !== 0 ? `, ${diff > 0 ? '+' : ''}${parseFloat(diff.toFixed(1))} từ trang bị` : ''})`;
    }
    
    if (typeof stat.maxValue === 'number' && typeof originalBaseStatMaxValue === 'number' && 
        stat.maxValue !== originalBaseStatMaxValue && 
        (!bonusDisplay.includes("Gốc") || ['hp', 'mp', 'spiritual_qi'].includes(stat.id)) ) { 
      const maxDiff = stat.maxValue - originalBaseStatMaxValue;
      if (bonusDisplay.includes("Gốc")) { 
        if (maxDiff !== 0) bonusDisplay += ` / Max Gốc ${parseFloat(originalBaseStatMaxValue.toFixed(1))}${maxDiff !==0 ? `, ${maxDiff > 0 ? '+' : ''}${parseFloat(maxDiff.toFixed(1))} từ trang bị` : ''}`;
      } else { 
         bonusDisplay += ` (Max Gốc ${parseFloat(originalBaseStatMaxValue.toFixed(1))}${maxDiff !== 0 ? `, ${maxDiff > 0 ? '+' : ''}${parseFloat(maxDiff.toFixed(1))} từ trang bị` : ''})`;
      }
    }


    return (
        <div key={stat.id} className={`p-3.5 rounded-xl shadow-interactive dark:shadow-interactive-dark border ${bgColor} transition-all duration-200 hover:shadow-md`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className={`font-semibold text-md flex items-center ${textColor}`}>
              {stat.icon && <i className={`${stat.icon} mr-2.5 w-5 text-center ${iconColor} text-xl opacity-90`}></i>}
              {stat.name}:
            </span>
            <span className={`font-bold text-lg ${textColor}`}>
              {displayValue}
            </span>
          </div>
           {bonusDisplay && <p className={`text-xs mt-0.5 ${textColor} opacity-80 italic`}>{bonusDisplay.trim()}</p>}
          {typeof stat.value === 'number' && stat.maxValue !== undefined && !stat.isProgressionStat && !valueIsPercentage && stat.maxValue > 0 && (
            <div className={`w-full rounded-full h-3 overflow-hidden mt-2 ${bgColor} bg-opacity-60 shadow-inner`}>
              <div
                className={`${progressBarColor} h-full rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${Math.max(0, Math.min(100, (stat.value / stat.maxValue) * 100))}%` }}
              ></div>
            </div>
          )}
          {stat.description && <p className={`text-xs mt-2 ${textColor} opacity-90 leading-relaxed`}>{stat.description}</p>}
        </div>
    );
  }, [baseStats]);

  return (
    <div className="space-y-4 text-sm">
      <h3 className="text-2xl font-bold mb-4 text-center text-primary dark:text-primary-light tracking-wide drop-shadow-sm">
         {characterName}
      </h3>
      {progressionStat && (
        <div key={progressionStat.id} className="p-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 dark:from-amber-500 dark:via-yellow-600 dark:to-amber-700 rounded-xl shadow-xl text-white">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-2xl flex items-center">
              {progressionStat.icon && <i className={`${progressionStat.icon} mr-3 w-7 text-center text-3xl opacity-80`}></i>}
              {progressionStat.name}:
            </span>
            <span className="font-extrabold text-2xl tracking-tight">
              {String(progressionStat.value)}
            </span>
          </div>
          {progressionStat.description && <p className="text-xs opacity-90 mt-1.5">{progressionStat.description}</p>}
        </div>
      )}

      {coreStatsToDisplay.map(id => effectiveStats[id] && renderStat(effectiveStats[id], false, false, true))}

      <h4 className="text-xl font-semibold mt-5 pt-4 border-t border-border-light dark:border-border-dark text-sky-600 dark:text-sky-300">Thuộc Tính Chính</h4>
      {primaryAttributes.map(id => effectiveStats[id] && renderStat(effectiveStats[id], false, true))}


      <h4 className="text-xl font-semibold mt-5 pt-4 border-t border-border-light dark:border-border-dark text-rose-600 dark:text-rose-300">Chỉ Số Chiến Đấu</h4>
      {combatStatOrder.map(id => effectiveStats[id] && renderStat(effectiveStats[id], true))}

      {otherNonCombatStats.length > 0 && (
          <>
            <h4 className="text-xl font-semibold mt-5 pt-4 border-t border-border-light dark:border-border-dark">Chỉ Số Khác</h4>
            {otherNonCombatStats.map(stat => renderStat(stat))}
          </>
      )}
    </div>
  );
});

interface InventoryPanelProps {
  items: InventoryItem[];
  equippedItems: Partial<Record<EquipmentSlot, InventoryItem['id']>>;
  onUseItem: (item: InventoryItem) => void;
  onEquipItem: (item: InventoryItem) => void;
  isLoadingAI: boolean;
  currency?: { name: string; amount: number; icon?: string };
  currencyEnabled: boolean;
}
const InventoryPanel: React.FC<InventoryPanelProps> = React.memo(({ items, equippedItems, onUseItem, onEquipItem, isLoadingAI, currency, currencyEnabled }) => {
  const importantItems = items.filter(item => item.category === 'quan trọng');
  const otherItems = items.filter(item => item.category !== 'quan trọng');

  const renderItemList = useCallback((itemList: InventoryItem[], title?: string) => {
    if (itemList.length === 0 && !title) return null; 
    if (itemList.length === 0 && title) return <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md text-center">{title}: Trống.</p>;

    return (
        <div className="space-y-3.5">
            {title && <h4 className="text-lg font-semibold mt-4 pt-3 text-slate-700 dark:text-slate-300">{title}</h4>}
            {itemList.map(item => {
              const isEquipped = Object.values(equippedItems).includes(item.id);
              return (
                <div key={item.id} className={`p-3.5 border rounded-xl bg-white dark:bg-slate-800/80 shadow-interactive dark:shadow-interactive-dark hover:shadow-lg transition-all duration-200 ease-in-out ${isEquipped ? 'border-primary dark:border-primary-dark ring-2 ring-primary/60 dark:ring-primary-dark/60' : 'border-border-light dark:border-border-dark'}`}>
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-grow flex items-start gap-3.5">
                       <div className={`w-14 h-14 flex-shrink-0 rounded-lg ${item.category === 'quan trọng' ? 'bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-700 dark:to-amber-800' : 'bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-700 dark:to-gray-800'} flex items-center justify-center shadow-inner`}>
                         <i className={`${item.icon || (item.category === 'quan trọng' ? 'fas fa-star' : 'fas fa-box-open')} ${item.category === 'quan trọng' ? 'text-yellow-500 dark:text-yellow-300' : 'text-secondary dark:text-secondary-light'} text-3xl opacity-80`}></i>
                       </div>
                        <div className="flex-grow">
                            <span className="font-semibold text-md text-slate-800 dark:text-slate-100 flex items-center flex-wrap">
                            {item.name} <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 mr-2">(SL: {item.quantity})</span>
                            {isEquipped && <span className="text-xs px-2.5 py-1 bg-primary text-white dark:bg-primary-dark dark:text-black rounded-full font-medium shadow-sm">Đang Trang Bị</span>}
                            </span>
                            {item.description && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.description}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 items-center mt-1">
                        {item.equippable && !isEquipped && (
                             <Button size="sm" variant="outline" onClick={() => onEquipItem(item)} className="px-3 py-1.5 text-xs font-semibold min-w-[75px] border-green-500 text-green-600 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-300 dark:hover:bg-green-500 dark:hover:text-white" title={`Trang bị ${item.name}`}>
                                <i className="fas fa-shield-alt sm:mr-1.5"></i><span className="hidden sm:inline">Trang Bị</span>
                            </Button>
                        )}
                        {item.usable && (
                        <Button size="sm" variant="primary" onClick={() => onUseItem(item)} className="px-3 py-1.5 text-xs font-semibold min-w-[75px]" disabled={isLoadingAI} title={`Sử dụng ${item.name}`}>
                            <i className="fas fa-hand-sparkles sm:mr-1.5"></i><span className="hidden sm:inline">Dùng</span>
                        </Button>
                        )}
                    </div>
                </div>
                {item.effects && item.effects.length > 0 && (
                    <ul className="text-xs mt-2.5 list-disc list-inside pl-4 text-sky-700 dark:text-sky-300 space-y-1">
                        {item.effects.map((eff, i) => (
                            <li key={i} className="italic">{eff.statId}: {eff.changeValue > 0 ? '+' : ''}{eff.changeValue}{eff.duration ? ` (trong ${eff.duration} lượt)`: ''}</li>
                        ))}
                    </ul>
                 )}
                 {item.statBonuses && item.statBonuses.length > 0 && (
                     <div className="text-xs mt-2.5 pl-1 text-purple-700 dark:text-purple-300 space-y-0.5">
                         <strong className="font-medium block mb-0.5">Bonus Trang Bị: </strong> 
                         {item.statBonuses.map((bonus, i) => (
                            <span key={i} className="italic mr-3 inline-flex items-center">
                                <i className="fas fa-arrow-up text-[10px] mr-1 opacity-70"></i>
                                {bonus.statId}: {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''}{bonus.appliesToMax ? ' (Tối đa)' : ''}
                            </span>
                         ))}
                     </div>
                 )}
                </div>
              );
            })}
        </div>
    );
  }, [equippedItems, isLoadingAI, onEquipItem, onUseItem]);

  return (
    <div className="space-y-4 text-sm">
       <h3 className="text-2xl font-bold mb-4 text-center text-primary dark:text-primary-light tracking-wide">Ba Lô Vật Phẩm</h3>
        {currencyEnabled && currency && (
            <div className="mb-4 p-3.5 border rounded-xl bg-amber-50 dark:bg-amber-900/50 shadow-md border-amber-300 dark:border-amber-600 flex items-center justify-between sticky top-0 bg-opacity-90 backdrop-blur-sm z-10">
                <span className="font-semibold text-md text-amber-700 dark:text-amber-200 flex items-center">
                    <i className={`${currency.icon || 'fas fa-coins'} mr-2.5 text-xl text-amber-500 dark:text-amber-300`}></i>
                    Tiền tệ ({currency.name}):
                </span>
                <span className="font-bold text-lg text-amber-800 dark:text-amber-100">{currency.amount.toLocaleString()}</span>
            </div>
        )}
       {renderItemList(importantItems, "Vật Phẩm Quan Trọng")}
       {renderItemList(otherItems, otherItems.length > 0 && importantItems.length > 0 ? "Vật Phẩm Khác" : (items.length > 0 && importantItems.length === 0 ? "" : undefined))}
        {items.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400 p-4 text-center">Ba lô của bạn hiện đang trống rỗng.</p>}
    </div>
  );
});

interface EquipmentPanelProps {
    equippedItems: Partial<Record<EquipmentSlot, InventoryItem['id']>>;
    inventory: InventoryItem[];
    onUnequipItem: (slot: EquipmentSlot) => void;
}
const EquipmentPanel: React.FC<EquipmentPanelProps> = React.memo(({ equippedItems, inventory, onUnequipItem }) => {
    const slotsInOrder: EquipmentSlot[] = [
        EquipmentSlot.Weapon, EquipmentSlot.OffHand,
        EquipmentSlot.Helmet, EquipmentSlot.Armor, EquipmentSlot.Boots,
        EquipmentSlot.Amulet, EquipmentSlot.Ring1, EquipmentSlot.Ring2
    ];

    const getSlotIcon = (slot: EquipmentSlot) => {
        switch(slot) {
            case EquipmentSlot.Weapon: return "fas fa-gavel"; 
            case EquipmentSlot.OffHand: return "fas fa-shield-halved"; 
            case EquipmentSlot.Helmet: return "fas fa-hard-hat";
            case EquipmentSlot.Armor: return "fas fa-shirt"; 
            case EquipmentSlot.Boots: return "fas fa-shoe-prints";
            case EquipmentSlot.Amulet: return "fas fa-gem";
            case EquipmentSlot.Ring1: return "fas fa-ring";
            case EquipmentSlot.Ring2: return "fas fa-ring";
            default: return "fas fa-question-circle";
        }
    }

    return (
        <div className="space-y-3.5 text-sm">
            <h3 className="text-2xl font-bold mb-4 text-center text-orange-600 dark:text-orange-400 tracking-wide">
                <i className="fas fa-user-shield mr-2.5"></i>Trang Bị Nhân Vật
            </h3>
            {slotsInOrder.map(slot => {
                const itemId = equippedItems[slot];
                const item = itemId ? inventory.find(i => i.id === itemId) : null;
                return (
                    <div key={slot} className={`p-3.5 bg-white dark:bg-orange-900/40 rounded-xl shadow-interactive dark:shadow-interactive-dark border border-orange-200 dark:border-orange-700/70 transition-all duration-200 hover:shadow-md`}>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-md flex items-center text-orange-700 dark:text-orange-200">
                                <i className={`${getSlotIcon(slot)} mr-3 w-5 text-center text-xl opacity-80`}></i>
                                {slot}:
                            </span>
                            {item ? (
                                <div className="flex items-center gap-2.5">
                                     <span className="font-medium text-orange-800 dark:text-orange-100 flex items-center">
                                         <i className={`${item.icon || getSlotIcon(slot)} mr-2 opacity-70`}></i>
                                         {item.name}
                                     </span>
                                    <Button size="xs" variant="outline" onClick={() => onUnequipItem(slot)} className="px-2.5 py-1 text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-300 dark:hover:bg-red-500 dark:hover:text-white">
                                        <i className="fas fa-times sm:mr-1"></i><span className="hidden sm:inline">Tháo</span>
                                    </Button>
                                </div>
                            ) : (
                                <span className="text-sm italic text-orange-500 dark:text-orange-400">-- Trống --</span>
                            )}
                        </div>
                        {item && item.statBonuses && item.statBonuses.length > 0 && (
                             <div className="text-xs mt-2.5 pl-1 text-purple-700 dark:text-purple-300 space-y-0.5">
                                 <strong className="font-medium block mb-0.5">Bonus: </strong>
                                 {item.statBonuses.map((bonus, i) => (
                                    <span key={i} className="italic mr-3 inline-flex items-center">
                                        <i className="fas fa-arrow-up text-[10px] mr-1 opacity-70"></i>
                                        {bonus.statId}: {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''}{bonus.appliesToMax ? ' (Tối đa)' : ''}
                                    </span>
                                 ))}
                             </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});


interface CharacterSkillsPanelProps {
  skills: Skill[];
  isLoadingAI: boolean;
}
const CharacterSkillsPanel: React.FC<CharacterSkillsPanelProps> = React.memo(({ skills, isLoadingAI }) => {
  if (skills.length === 0) {
    return <p className="text-sm text-center p-4 text-slate-500 dark:text-slate-400">Chưa học được kỹ năng nào.</p>;
  }

 const proficiencyStyles: Record<SkillProficiency, { text: string; bg: string; border: string; shadow?: string }> = {
    "Sơ Nhập Môn": { text: "text-sky-700 dark:text-sky-200", bg: "bg-sky-100 dark:bg-sky-800", border: "border-sky-300 dark:border-sky-600" },
    "Tiểu Thành": { text: "text-lime-700 dark:text-lime-200", bg: "bg-lime-100 dark:bg-lime-800", border: "border-lime-300 dark:border-lime-600" },
    "Đại Thành": { text: "text-green-700 dark:text-green-200", bg: "bg-green-100 dark:bg-green-800", border: "border-green-300 dark:border-green-600" },
    "Viên Mãn": { text: "text-yellow-700 dark:text-yellow-200", bg: "bg-yellow-100 dark:bg-yellow-700", border: "border-yellow-400 dark:border-yellow-500" },
    "Lô Hoả Thuần Thanh": { text: "text-orange-700 dark:text-orange-200", bg: "bg-orange-100 dark:bg-orange-700", border: "border-orange-400 dark:border-orange-500" },
    "Đăng Phong Tạo Cực": { text: "text-red-700 dark:text-red-100", bg: "bg-gradient-to-r from-red-400 to-rose-500 dark:from-red-600 dark:to-rose-700", border: "border-red-500 dark:border-rose-500", shadow: "shadow-lg" },
  };


  return (
    <div className="space-y-4 text-sm">
      <h3 className="text-2xl font-bold mb-4 text-center text-purple-600 dark:text-purple-400 tracking-wide">Kỹ Năng Đã Học</h3>
      {skills.sort((a,b) => b.xp - a.xp).map(skill => {
        const currentProfStyle = proficiencyStyles[skill.proficiency] || proficiencyStyles["Sơ Nhập Môn"];
        return (
        <div key={skill.id} className={`p-4 bg-white dark:bg-purple-900/50 rounded-xl shadow-interactive dark:shadow-interactive-dark border border-purple-200 dark:border-purple-700/70 transition-all duration-200 hover:shadow-lg`}>
          <div className="flex justify-between items-start mb-2">
             <div className="flex items-start gap-3.5 flex-grow">
                <div className={`w-14 h-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-700 dark:to-pink-800 flex items-center justify-center shadow-inner`}>
                    <i className={`${skill.icon || 'fas fa-book-sparkles'} text-purple-500 dark:text-purple-300 text-3xl opacity-80`}></i>
                </div>
                <div className="flex-grow">
                    <span className="font-semibold text-lg text-purple-700 dark:text-purple-200">
                        {skill.name}
                    </span>
                    <span className={`ml-2 text-xs px-3 py-1 rounded-full font-bold shadow ${currentProfStyle.bg} ${currentProfStyle.text} ${currentProfStyle.border} ${currentProfStyle.shadow || ''}`}>
                        {skill.proficiency}
                    </span>
                </div>
             </div>
          </div>
          {skill.description && <p className="text-sm text-purple-600 dark:text-purple-300 mt-1.5 mb-2.5 whitespace-pre-line leading-relaxed">{skill.description}</p>}
          {skill.xpToNextLevel > 0 && (
             <div title={`${skill.xp} / ${skill.xpToNextLevel} XP`} className={`w-full bg-purple-200 dark:bg-purple-800/80 rounded-full h-4 overflow-hidden text-xs font-medium text-white flex items-center justify-center relative shadow-inner`}>
                <div
                    className="bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 dark:from-purple-500 dark:via-pink-600 dark:to-rose-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-center shadow"
                    style={{ width: `${Math.max(0, Math.min(100, (skill.xp / skill.xpToNextLevel) * 100))}%` }}
                >
                </div>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white font-bold tracking-tight" style={{textShadow: '0 0 3px rgba(0,0,0,0.6)'}}>
                    {skill.xp} / {skill.xpToNextLevel} XP
                </span>
             </div>
          )}
          {skill.effects && skill.effects.length > 0 && (
            <div className="mt-3 text-xs">
                <strong className="text-purple-600 dark:text-purple-400 font-medium">Hiệu ứng:</strong>
                <ul className="list-disc list-inside pl-4 text-purple-500 dark:text-purple-300 italic space-y-1 mt-1">
                    {skill.effects.map((effect, idx) => <li key={idx}>{effect.description}</li>)}
                </ul>
            </div>
          )}
        </div>
      )})}
    </div>
  );
});


interface AchievementsPanelProps {
  achievements: Achievement[];
}
const AchievementsPanel: React.FC<AchievementsPanelProps> = React.memo(({ achievements }) => {
  if (achievements.length === 0) {
    return <p className="text-sm text-center p-4 text-slate-500 dark:text-slate-400">Chưa mở khóa thành tựu nào.</p>;
  }
  return (
    <div className="space-y-3.5 text-sm">
      <h3 className="text-2xl font-bold mb-4 text-center text-yellow-500 dark:text-yellow-400 tracking-wide">Thành Tựu</h3>
      {achievements.slice().reverse().map(ach => (
        <div key={ach.id} className={`p-4 border rounded-xl shadow-interactive dark:shadow-interactive-dark flex items-start gap-4 ${ach.isSecret ? 'bg-indigo-50 dark:bg-indigo-900/60 border-indigo-300 dark:border-indigo-600/70' : 'bg-yellow-50 dark:bg-yellow-800/60 border-yellow-300 dark:border-yellow-600/70'}`}>
          <i className={`${ach.icon || 'fas fa-trophy'} ${ach.isSecret ? 'text-indigo-500 dark:text-indigo-300' : 'text-yellow-500 dark:text-yellow-300'} text-4xl w-10 text-center mt-1 opacity-80`}></i>
          <div className="flex-grow">
            <span className={`font-semibold text-lg ${ach.isSecret ? 'text-indigo-700 dark:text-indigo-200' : 'text-yellow-700 dark:text-yellow-200'}`}>{ach.name} {ach.isSecret && <span className="text-xs font-normal opacity-80">(Bí Mật)</span>}</span>
            <p className={`text-sm ${ach.isSecret ? 'text-indigo-600 dark:text-indigo-400' : 'text-yellow-600 dark:text-yellow-400'} mt-1 leading-relaxed`}>{ach.description}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Mở khóa: {new Date(ach.unlockedAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

interface RelationshipsPanelProps {
  relationships: Record<string, NPCProfile>;
}
const RelationshipsPanel: React.FC<RelationshipsPanelProps> = React.memo(({ relationships }) => {
  const knownNpcs = Object.values(relationships).filter(npc => npc.known);
  if (knownNpcs.length === 0) {
    return <p className="text-sm text-center p-4 text-slate-500 dark:text-slate-400">Chưa có mối quan hệ nào đáng chú ý.</p>;
  }
  return (
    <div className="space-y-4 text-sm">
      <h3 className="text-2xl font-bold mb-4 text-center text-pink-600 dark:text-pink-400 tracking-wide">
        <i className="fas fa-users mr-2.5"></i>Mối Quan Hệ NPC
      </h3>
      {knownNpcs.sort((a,b) => b.score - a.score).map(npc => {
        let statusColorClass = 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100';
        let borderColorClass = 'border-slate-300 dark:border-slate-500';
        if (npc.status === RelationshipStatus.Adored || npc.status === RelationshipStatus.Loyal) { statusColorClass = 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'; borderColorClass = 'border-red-300 dark:border-red-500';}
        else if (npc.status === RelationshipStatus.Friendly) { statusColorClass = 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'; borderColorClass = 'border-green-300 dark:border-green-500';}
        else if (npc.status === RelationshipStatus.Amicable) { statusColorClass = 'bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100'; borderColorClass = 'border-sky-300 dark:border-sky-500';}
        else if (npc.status === RelationshipStatus.Hostile) { statusColorClass = 'bg-rose-700 text-white dark:bg-rose-500 dark:text-white'; borderColorClass = 'border-rose-500 dark:border-rose-300';}
        else if (npc.status === RelationshipStatus.Mistrustful) { statusColorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-700 dark:text-amber-100'; borderColorClass = 'border-amber-300 dark:border-amber-500';}
        
        return (
        <div key={npc.id} className={`p-4 bg-white dark:bg-pink-900/50 rounded-xl shadow-interactive dark:shadow-interactive-dark border border-pink-200 dark:border-pink-700/70 transition-all duration-200 hover:shadow-lg`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg flex items-center text-pink-700 dark:text-pink-200">
              <i className="fas fa-user-friends mr-3 w-5 text-center text-xl opacity-80"></i>{npc.name}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${statusColorClass} border ${borderColorClass}`}>
              {npc.status} ({npc.score})
            </span>
          </div>
          {npc.description && <p className="text-sm text-pink-600 dark:text-pink-300 mt-1 italic whitespace-pre-line leading-relaxed">{npc.description}</p>}
        </div>
      )})}
    </div>
  );
});

interface ObjectivesPanelProps { 
  objectives: Objective[];
  characterGoal: string;
}
const ObjectivesPanel: React.FC<ObjectivesPanelProps> = React.memo(({ objectives, characterGoal }) => {
  const activeObjectives = objectives.filter(obj => obj.status === 'active');
  const completedObjectives = objectives.filter(obj => obj.status === 'completed');
  const failedObjectives = objectives.filter(obj => obj.status === 'failed');
  
  const mainGoal = objectives.find(obj => obj.isPlayerGoal && obj.status === 'active') || 
                   { title: characterGoal || "Chưa xác định", description: "Mục tiêu chính của nhân vật.", status: 'active', isPlayerGoal: true, id: 'main-player-goal' };


  const renderObjectiveList = (list: Objective[], title: string, iconClass: string, baseColorClass: string, isCompleted: boolean = false, isFailed: boolean = false) => {
    if (list.length === 0) return null;
    let textColor = isFailed ? 'text-red-700 dark:text-red-200' : isCompleted ? 'text-green-700 dark:text-green-200' : baseColorClass;
    let bgColor = isFailed ? 'bg-red-50 dark:bg-red-900/60 border-red-200 dark:border-red-700/70' 
                : isCompleted ? 'bg-green-50 dark:bg-green-900/60 border-green-200 dark:border-green-700/70 opacity-90' 
                : 'bg-teal-50 dark:bg-teal-900/60 border-teal-200 dark:border-teal-700/70';

    return (
      <div className="mb-4">
        <h4 className={`text-lg font-semibold mb-2.5 ${textColor}`}>
          <i className={`${iconClass} mr-2`}></i>{title} ({list.length})
        </h4>
        <div className="space-y-3">
          {list.map(obj => (
            <div key={obj.id} className={`p-3.5 rounded-xl shadow-sm border ${bgColor} ${isCompleted ? 'line-through decoration-green-500/70 dark:decoration-green-400/70' : ''} ${isFailed ? 'opacity-80' : ''}`}>
              <p className={`font-semibold text-md ${textColor}`}>
                {obj.isPlayerGoal && !isCompleted && !isFailed && <i className="fas fa-bullseye text-error-DEFAULT mr-2" title="Mục tiêu chính"></i>}
                {obj.title}
              </p>
              <p className={`text-sm mt-1 ${textColor} opacity-90 whitespace-pre-line leading-relaxed`}>{obj.description}</p>
              {obj.subObjectives && obj.subObjectives.length > 0 && (
                <ul className="list-disc list-inside text-sm pl-3 mt-2 text-slate-500 dark:text-slate-400 space-y-1">
                  {obj.subObjectives.map((sub, i) => <li key={i}>{sub}</li>)}
                </ul>
              )}
              {obj.rewardPreview && <p className="text-xs mt-2 italic text-amber-600 dark:text-amber-400">Phần thưởng (dự kiến): {obj.rewardPreview}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4 text-sm">
      <h3 className="text-2xl font-bold mb-4 text-center text-teal-600 dark:text-teal-400 tracking-wide">
        <i className="fas fa-tasks mr-2.5"></i>Mục Tiêu Hành Trình
      </h3>

      <div className="p-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 dark:from-teal-600 dark:via-cyan-600 dark:to-sky-700 rounded-xl shadow-xl text-white">
          <h4 className="font-bold text-xl mb-1 flex items-center">
            <i className="fas fa-bullseye mr-3 text-2xl opacity-90"></i>Mục Tiêu Chính:
          </h4>
          <p className="text-lg font-semibold">{mainGoal.title}</p>
          <p className="text-xs mt-1 opacity-90">{mainGoal.description}</p>
      </div>

      {renderObjectiveList(activeObjectives.filter(obj => !obj.isPlayerGoal), "Nhiệm Vụ Phụ Đang Thực Hiện", "fas fa-spinner fa-spin", "text-teal-600 dark:text-teal-300")}
      {renderObjectiveList(completedObjectives, "Đã Hoàn Thành", "fas fa-check-circle", "text-green-600 dark:text-green-300", true)}
      {renderObjectiveList(failedObjectives, "Đã Thất Bại", "fas fa-times-circle", "text-red-600 dark:text-red-300", false, true)}
      
      {activeObjectives.length === 0 && completedObjectives.length === 0 && failedObjectives.length === 0 && !characterGoal &&
         <p className="text-sm text-center p-4 text-slate-500 dark:text-slate-400">Không có mục tiêu nào được AI tạo.</p>
      }
    </div>
  );
});

interface CultivationPanelProps {
  progressionStat: CharacterAttribute | undefined;
  qiStat: CharacterAttribute | undefined;
  onAdvance: () => void;
  onCultivate: () => void;
  isLoadingAI: boolean;
}
const CultivationPanel: React.FC<CultivationPanelProps> = React.memo(({ progressionStat, qiStat, onAdvance, onCultivate, isLoadingAI }) => {
  if (!progressionStat || !qiStat) {
    return <p className="text-sm text-center p-4 text-slate-500 dark:text-slate-400">Hệ thống tu luyện chưa được khởi tạo. Vui lòng đảm bảo AI đã cung cấp chỉ số "Cấp Độ" (ID: "progression_level") và "Điểm Kinh Nghiệm" (ID: "spiritual_qi").</p>;
  }

  let canAdvance = false;
  // Refactored canAdvance logic for explicit type checking
  const qiValue = qiStat.value;
  const qiMaxValue = qiStat.maxValue;
  if (typeof qiValue === 'number' && typeof qiMaxValue === 'number') {
    if (qiValue >= qiMaxValue && qiMaxValue > 0) {
      canAdvance = true;
    }
  }


  return (
    <div className="space-y-5 text-sm">
      <h3 className="text-2xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-400 tracking-wide">
        <i className="fas fa-hat-wizard mr-2.5"></i>Tiến Triển Tu Luyện
      </h3>

      <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800/70 dark:to-purple-800/70 rounded-xl shadow-xl border border-indigo-200 dark:border-indigo-700">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-bold text-xl flex items-center text-indigo-700 dark:text-indigo-200">
            {progressionStat.icon && <i className={`${progressionStat.icon} mr-3 w-6 text-center text-2xl opacity-90`}></i>}
            {progressionStat.name}:
          </span>
          <span className="font-extrabold text-xl text-indigo-800 dark:text-indigo-100 tracking-tight">{String(progressionStat.value)}</span>
        </div>
        {progressionStat.description && <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1.5 opacity-90 leading-relaxed">{progressionStat.description}</p>}
      </div>

      <div className="p-4 bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-800/70 dark:to-cyan-800/70 rounded-xl shadow-xl border border-sky-200 dark:border-sky-700">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-semibold text-lg flex items-center text-sky-700 dark:text-sky-200">
            {qiStat.icon && <i className={`${qiStat.icon} mr-3 w-5 text-center text-xl opacity-90`}></i>}
            {qiStat.name}:
          </span>
          <span className="font-bold text-lg text-sky-800 dark:text-sky-100">
            {typeof qiStat.value === 'number' && qiStat.maxValue ? `${parseFloat(qiStat.value.toFixed(1))} / ${parseFloat(qiStat.maxValue.toFixed(1))}` : String(qiStat.value)}
          </span>
        </div>
        {typeof qiStat.value === 'number' && typeof qiStat.maxValue === 'number' && qiStat.maxValue > 0 && (
          <div className="w-full bg-sky-200 dark:bg-sky-800/80 rounded-full h-4 mt-2 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-sky-400 to-cyan-500 dark:from-sky-500 to-cyan-600 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${Math.max(0,Math.min(100,(qiStat.value / qiStat.maxValue) * 100))}%` }}
            ></div>
          </div>
        )}
        {qiStat.description && <p className="text-sm text-sky-600 dark:text-sky-300 mt-2 opacity-90 leading-relaxed">{qiStat.description}</p>}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
        <Button 
          onClick={onCultivate} 
          isLoading={isLoadingAI} 
          disabled={isLoadingAI}
          fullWidth
          variant="outline"
          className="border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-500 dark:hover:text-white !py-3 !text-base"
        >
          <i className="fas fa-praying-hands mr-2"></i>Tập Trung Nâng Cấp
        </Button>
        <Button 
          onClick={onAdvance} 
          isLoading={isLoadingAI} 
          disabled={!canAdvance || isLoadingAI}
          fullWidth
          variant="primary"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 !py-3 !text-base"
        >
          <i className="fas fa-level-up-alt mr-2"></i>Thử Thách Thăng Tiến
        </Button>
      </div>
       <p className={`text-sm text-center mt-2 ${canAdvance ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
         {canAdvance ? `Đã đủ ${qiStat.name} để thăng tiến!` : `Cần thêm ${typeof qiStat.value === 'number' && typeof qiStat.maxValue === 'number' && qiStat.maxValue > qiStat.value ? (qiStat.maxValue - qiStat.value).toFixed(1) : '?'} ${qiStat.name} để thăng tiến.`}
       </p>
    </div>
  );
});

interface ActionPanelContentProps {
  choices: PlayerChoice[];
  onChooseAction: (action: string) => void;
  isLoadingAI: boolean;
  isRoleplayModeActive: boolean;
  isAuthorInterventionModeActive: boolean;
  toggleRoleplayMode: () => void;
  toggleAuthorInterventionMode: () => void;
  isMobile: boolean;
}
const ActionPanelContent: React.FC<ActionPanelContentProps> = React.memo(({ 
    choices, onChooseAction, isLoadingAI, isRoleplayModeActive, isAuthorInterventionModeActive,
    toggleRoleplayMode, toggleAuthorInterventionMode, isMobile
}) => {
  const [customAction, setCustomAction] = useState('');

  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !isLoadingAI) {
      onChooseAction(customAction.trim());
      setCustomAction('');
    }
  };

  const handleAiContinue = () => {
    if (!isLoadingAI) {
        onChooseAction("AI_AUTO_CONTINUE_STORY");
    }
  };

  return (
    <div className="space-y-3 flex flex-col h-full"> {/* Make parent flex-col and h-full for mobile sheet */}
       <div className={`flex items-center gap-2 mb-3 pt-1 ${isMobile ? 'justify-around' : 'sm:border-t-0 border-t border-slate-200 dark:border-slate-700/60'}`}>
        <Button
            size="sm"
            variant={isRoleplayModeActive ? "primary" : "outline"}
            onClick={toggleRoleplayMode}
            disabled={isLoadingAI}
            className={`flex-1 !text-xs !py-2 ${isMobile ? '!px-2' : ''}`}
            title={isRoleplayModeActive ? "Chuyển sang Chế độ AI Hỗ Trợ (Gợi ý)" : "Chuyển sang Chế độ Nhập Vai (Tự do)"}
        >
            <i className={`mr-1.5 ${isRoleplayModeActive ? 'fas fa-theater-masks text-yellow-300 dark:text-yellow-400' : 'fas fa-brain'}`}></i> {isRoleplayModeActive ? "Nhập Vai" : "AI Hỗ Trợ"}
        </Button>
        <Button
            size="sm"
            variant={isAuthorInterventionModeActive ? "primary" : "outline"}
            onClick={toggleAuthorInterventionMode}
            disabled={isLoadingAI}
            className={`flex-1 !text-xs !py-2 ${isMobile ? '!px-2' : ''}`}
            title={isAuthorInterventionModeActive ? "Tắt Chế độ Can Thiệp Tác Giả" : "Bật Chế độ Can Thiệp Tác Giả"}
        >
            <i className={`mr-1.5 ${isAuthorInterventionModeActive ? 'fas fa-feather-alt text-red-300 dark:text-red-400' : 'fas fa-feather'}`}></i> Tác Giả
        </Button>
        </div>


      {!isRoleplayModeActive && !isAuthorInterventionModeActive && choices.length > 0 && (
        <div className={`space-y-2.5 ${isMobile ? 'max-h-48' : 'max-h-40 sm:max-h-60'} overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex-grow`}> {/* Added flex-grow */}
          {choices.map((choice, index) => (
            <Button
              key={choice.id}
              onClick={() => onChooseAction(choice.text)}
              fullWidth
              className="bg-gray-700 dark:bg-gray-800 border-2 border-primary dark:border-primary-light text-slate-100 dark:text-slate-50 hover:bg-gray-600 dark:hover:bg-gray-700 hover:border-primary-light dark:hover:border-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-primary-light text-left px-3 py-2.5 !text-sm !font-normal !rounded-xl transition-all duration-150 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] w-full flex items-center"
              disabled={isLoadingAI}
              title={choice.tooltip || choice.text} 
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-start min-w-0"> 
                  <span 
                    className="bg-primary text-white dark:bg-primary-dark dark:text-gray-900 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold mr-2 sm:mr-3 flex-shrink-0"
                  >
                    {index + 1}
                  </span>
                  <span className="whitespace-normal break-words">{choice.text}</span> 
                </div>
                <i className="fas fa-chevron-right text-slate-400 dark:text-slate-500 text-xs ml-2 flex-shrink-0"></i>
              </div>
            </Button>
          ))}
        </div>
      )}
      {(isRoleplayModeActive || isAuthorInterventionModeActive || choices.length === 0) && !isLoadingAI && (
         <p className="text-sm text-slate-500 dark:text-slate-400 italic p-3 bg-slate-100 dark:bg-slate-800/60 rounded-md text-center">
            {isAuthorInterventionModeActive ? "Chế độ Can Thiệp Tác Giả đang BẬT. Nhập lệnh của bạn." :
             isRoleplayModeActive ? "Chế độ Nhập Vai đang bật. Hãy tự do nhập hành động của bạn." :
             "AI không đưa ra lựa chọn nào. Hãy tự quyết định hành động tiếp theo."}
        </p>
      )}

      <form onSubmit={handleCustomActionSubmit} className="space-y-3 pt-1 mt-auto"> {/* Added mt-auto to push form to bottom in flex-col */}
        <Textarea
          value={customAction}
          onChange={(e) => setCustomAction(e.target.value)}
          placeholder={
              isAuthorInterventionModeActive ? "Nhập lệnh của Tác Giả (VD: Cho Lý Phàm 1000 vàng)..." :
              isRoleplayModeActive ? "Nhập lời nói, hành động, suy nghĩ của bạn..." :
              "Hoặc nhập hành động tùy chỉnh của bạn..."
          }
          rows={isMobile ? 2 : 3}
          className="text-sm bg-white dark:bg-slate-700/60 !rounded-lg focus:ring-primary-dark dark:focus:ring-primary-light"
          disabled={isLoadingAI}
          aria-label="Custom action input"
        />
        <div className="grid grid-cols-2 gap-2">
            <Button type="submit" isLoading={isLoadingAI} disabled={isLoadingAI || !customAction.trim()} variant="success" className={`!text-base ${isMobile ? '!py-2.5' : '!py-3'} !rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700`}>
                <i className="fas fa-paper-plane mr-2"></i>Gửi
            </Button>
            <Button type="button" onClick={handleAiContinue} isLoading={isLoadingAI} disabled={isLoadingAI} variant="secondary" className={`!text-base ${isMobile ? '!py-2.5' : '!py-3'} !rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700`}>
                <i className="fas fa-wand-magic-sparkles mr-2"></i>AI Viết Tiếp
            </Button>
        </div>
      </form>
    </div>
  );
});

const generateStableId = (text: string, prefix: string = "id"): string => {
  if (!text) return `${prefix}_unknown_${Date.now().toString(36)}${Math.random().toString(36).substring(2,5)}`;
  return `${prefix}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now().toString(36)}${Math.random().toString(36).substring(2,5)}`;
};

const updateInventory = (
    currentInventory: InventoryItem[],
    gained?: InventoryItem[],
    lost?: Array<{ id: string; quantity: number } | { name: string; quantity: number }>
): {updatedInventory: InventoryItem[], lostItemIds: string[]} => {
    let newInventory = [...currentInventory];
    const fullyLostItemIds: string[] = [];

    if (gained) {
        gained.forEach(newItem => {
            if (!newItem.name || typeof newItem.quantity !== 'number' || newItem.quantity <=0) return; 
            const existingItemIndex = newInventory.findIndex(item => item.name === newItem.name); 
            if (existingItemIndex > -1) {
                newInventory[existingItemIndex].quantity += newItem.quantity;
            } else {
                newInventory.push({ ...newItem, id: newItem.id || generateStableId(newItem.name, 'item') });
            }
        });
    }

    if (lost) {
        lost.forEach(itemToRemove => {
             if (typeof itemToRemove.quantity !== 'number' || itemToRemove.quantity <=0) return; 
            let itemIndex = -1;
            if ('id' in itemToRemove && itemToRemove.id) {
                itemIndex = newInventory.findIndex(item => item.id === itemToRemove.id);
            } else if ('name' in itemToRemove && itemToRemove.name) { 
                itemIndex = newInventory.findIndex(item => item.name === itemToRemove.name);
            }

            if (itemIndex > -1) {
                const currentItem = newInventory[itemIndex];
                newInventory[itemIndex].quantity -= itemToRemove.quantity;
                if (newInventory[itemIndex].quantity <= 0) {
                    fullyLostItemIds.push(currentItem.id); 
                    newInventory.splice(itemIndex, 1);
                }
            }
        });
    }
    return { updatedInventory: newInventory, lostItemIds: fullyLostItemIds };
};


export const GamePage: React.FC<GamePageProps> = ({
  gameState,
  setGameState,
  openModal, 
  quitGame,
  nsfwSettings,
  autosaveCurrentStory,
}) => {
  const { settings } = useSettings();
  const { addToast } = usePublicToast();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const storyLogRef = useRef<HTMLDivElement>(null);
  
  const [activePanelModal, setActivePanelModal] = useState<ActiveSidebarTab | null>(null); 
  const [numMessagesToShow, setNumMessagesToShow] = useState(INITIAL_MESSAGES_TO_SHOW);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const headerDropdownRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('(max-width: 639px)'); 

  const [tooltip, setTooltip] = useState<{ content: React.ReactNode; x: number; y: number; width: number } | null>(null);
  const hideTooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipElementRef = useRef<HTMLDivElement>(null);

  const effectiveCharacterStats = useMemo(() => {
    return calculateEffectiveStats(gameState.characterStats, gameState.equippedItems, gameState.inventory);
  }, [gameState.characterStats, gameState.equippedItems, gameState.inventory]);

  const [isDesktopPanelsDropdownOpen, setIsDesktopPanelsDropdownOpen] = useState(false);
  const desktopPanelsDropdownRef = useRef<HTMLDivElement>(null);

  const prevIsLoadingAIRef = useRef<boolean>(isLoadingAI);
  const prevCurrentWorldEventIdRef = useRef<string | null | undefined>(null);


  // Close header dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerDropdownRef.current && !headerDropdownRef.current.contains(event.target as Node)) {
        setIsHeaderDropdownOpen(false);
      }
      if (desktopPanelsDropdownRef.current && !desktopPanelsDropdownRef.current.contains(event.target as Node)) {
        setIsDesktopPanelsDropdownOpen(false);
      }
    };
    if (isHeaderDropdownOpen || isDesktopPanelsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHeaderDropdownOpen, isDesktopPanelsDropdownOpen]);


 useEffect(() => {
    if (gameState) {
      autosaveCurrentStory(gameState);
    }
  }, [gameState, autosaveCurrentStory]);


  useEffect(() => {
    setNumMessagesToShow(INITIAL_MESSAGES_TO_SHOW);
  }, [gameState.setup.id]);


  useEffect(() => {
    if (storyLogRef.current && gameState.storyLog.length > 0) {
      const lastMessage = gameState.storyLog[gameState.storyLog.length - 1];
      const secondLastMessage = gameState.storyLog.length > 1 ? gameState.storyLog[gameState.storyLog.length - 2] : null;

      const isNewAIMessage = 
        (lastMessage.type === 'narration' || lastMessage.type === 'event' || lastMessage.type === 'author') &&
        (
          (secondLastMessage && secondLastMessage.type === 'system' && secondLastMessage.content.includes("quyết định:")) || 
          (gameState.storyLog.length === 1 && (lastMessage.type === 'narration' || lastMessage.type === 'author')) 
        );

      if (isNewAIMessage) {
        const newMessageElement = document.getElementById(lastMessage.id);
        if (newMessageElement) {
          newMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return; 
        }
      }

      const { scrollTop, scrollHeight, clientHeight } = storyLogRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 150; 
      
      if (isScrolledToBottom || gameState.storyLog.length <= numMessagesToShow) {
        storyLogRef.current.scrollTop = storyLogRef.current.scrollHeight;
      }
    }
  }, [gameState.storyLog, numMessagesToShow]);
  
   useEffect(() => {
    const hpStat = effectiveCharacterStats.hp;
    if (hpStat && typeof hpStat.value === 'number' && hpStat.value <= 0) {
      const isAlreadyDeadOrModalOpen = gameState.storyLog.some(msg => msg.type === 'system' && msg.content.includes("qua đời")) ||
                                     gameState.currentChoices.length === 0 && gameState.isInitialStoryGenerated && gameState.storyLog.length > 1; 
      if (!isAlreadyDeadOrModalOpen) {
          addToast({message: `${gameState.setup.character.name} đã trút hơi thở cuối cùng...`, type: 'error', icon: 'fas fa-skull-crossbones', duration: 10000});
          setActivePanelModal(null); 
          setGameState(prev => {
              if (!prev) return null;
              const deathMessage: StoryMessage = {
                  id: `system-death-${Date.now()}`,
                  type: 'system',
                  content: `${prev.setup.character.name} đã tử vong. Số mệnh đã định, không thể xoay chuyển.`,
                  timestamp: new Date().toISOString()
              };
              return { ...prev, storyLog: [...prev.storyLog, deathMessage], currentChoices: [] };
          });
          openModal(ModalType.DeathConfirmation);
      }
    }
  }, [effectiveCharacterStats.hp, gameState.setup.character.name, gameState.storyLog, gameState.currentChoices.length, gameState.isInitialStoryGenerated, openModal, setGameState, addToast]);

  const processAndAddNewEntries = useCallback((
        currentEntries: Entity[],
        newEntriesRaw?: Partial<Entity>[]
    ): Entity[] => {
        if (!newEntriesRaw || newEntriesRaw.length === 0) return currentEntries;
        let updatedEntries = [...currentEntries];
        newEntriesRaw.forEach(newEntryRaw => {
            if (!newEntryRaw.name || !newEntryRaw.type) return;
            const existingIndex = updatedEntries.findIndex(e => e.name === newEntryRaw.name && e.type === newEntryRaw.type);
            if (existingIndex > -1) {
                if (newEntryRaw.description && newEntryRaw.description !== updatedEntries[existingIndex].description) {
                     addToast({ message: `Bách khoa cập nhật: ${newEntryRaw.name}`, type: 'info', icon: 'fas fa-book-medical' });
                    updatedEntries[existingIndex] = { ...updatedEntries[existingIndex], description: newEntryRaw.description };
                }
            } else {
                 addToast({ message: `Khám phá mới: ${newEntryRaw.name} (${newEntryRaw.type})`, type: 'info', icon: 'fas fa-map-marked-alt' });
                updatedEntries.push({
                    id: newEntryRaw.id || generateStableId(newEntryRaw.name, `encyclopedia-${newEntryRaw.type}`),
                    name: newEntryRaw.name,
                    type: newEntryRaw.type,
                    description: newEntryRaw.description || "Chưa có mô tả chi tiết."
                });
            }
        });
        return updatedEntries;
  }, [addToast]);

  const handleAction = useCallback(async (actionText: string) => {
    if (isLoadingAI) return;
    setIsLoadingAI(true);
    // if(activePanelModal) setActivePanelModal(null); // Close panel modal if open

    const playerActionMessage: StoryMessage = {
      id: `msg-action-${Date.now()}`,
      type: 'system',
      content: actionText === "AI_AUTO_CONTINUE_STORY" 
                 ? `${gameState.setup.character.name} để AI tự viết tiếp tình tiết...`
                 : `${gameState.setup.character.name} ${gameState.isAuthorInterventionModeActive ? ' (Tác Giả)' : ''} quyết định: "${actionText}"`,
      timestamp: new Date().toISOString()
    };
    
    const currentStateSnapshot = {
        storyLog: gameState.storyLog, 
        currentChoices: gameState.currentChoices,
        currentSummary: gameState.currentSummary,
        currentWorldEvent: gameState.currentWorldEvent,
        encyclopedia: gameState.encyclopedia,
        characterStats: gameState.characterStats,
        inventory: gameState.inventory,
        equippedItems: gameState.equippedItems,
        unlockedAchievements: gameState.unlockedAchievements,
        characterSkills: gameState.characterSkills,
        isRoleplayModeActive: gameState.isRoleplayModeActive,
        isAuthorInterventionModeActive: gameState.isAuthorInterventionModeActive,
        activeSidebarTab: activePanelModal || gameState.activeSidebarTab,
        npcRelationships: gameState.npcRelationships,
        objectives: gameState.objectives,
        currency: gameState.currency,
        currentTime: gameState.currentTime,
    };

    let previousGameState: GameState | null = null;
    setGameState(prev => {
      if (!prev) return null;
      previousGameState = prev; 
      const limitedHistory = prev.history.slice(-9); 
      return { 
        ...prev, 
        storyLog: [...prev.storyLog, playerActionMessage],
        history: [...limitedHistory, currentStateSnapshot] 
      };
    });

    const apiKey = settings.useDefaultAPI ? (process.env.API_KEY || '') : (localStorage.getItem(LOCAL_STORAGE_API_KEY) || '');
    
    try {
      const stateForAI = { ...gameState, storyLog: [...gameState.storyLog, playerActionMessage] };
      const nextSegmentData: NextStorySegmentResult = await generateNextStorySegment(
        apiKey,
        settings.useDefaultAPI,
        stateForAI, 
        actionText,
        nsfwSettings,
        { currencyEnabled: settings.currencyEnabled, timeSystemEnabled: settings.timeSystemEnabled, reputationSystemEnabled: settings.reputationSystemEnabled }
      );

      setGameState(prev => {
        if (!prev) return null;
        let updatedGameState = { ...prev };
        
        updatedGameState.storyLog = [...updatedGameState.storyLog, nextSegmentData.story];
        updatedGameState.currentChoices = nextSegmentData.choices;
        if(nextSegmentData.updatedSummary) updatedGameState.currentSummary = nextSegmentData.updatedSummary;
        
        updatedGameState.encyclopedia = processAndAddNewEntries(updatedGameState.encyclopedia, nextSegmentData.newEntries);
        
        if (nextSegmentData.statChanges) {
          nextSegmentData.statChanges.forEach(change => {
            const statToUpdate = updatedGameState.characterStats[change.attribute_id];
            if (statToUpdate) {
                let changeDescription = "";
                const originalValue = statToUpdate.value;
                if (change.new_value !== undefined) {
                    statToUpdate.value = change.new_value;
                    changeDescription = `${statToUpdate.name}: ${originalValue} -> ${change.new_value}`;
                } else if (change.change_value !== undefined && typeof statToUpdate.value === 'number') {
                    statToUpdate.value += change.change_value;
                    changeDescription = `${statToUpdate.name}: ${originalValue} ${change.change_value >= 0 ? '+' : ''}${change.change_value} -> ${statToUpdate.value}`;
                }
                
                if (change.new_max_value !== undefined && typeof statToUpdate.maxValue === 'number') {
                    statToUpdate.maxValue = change.new_max_value;
                     changeDescription += ` (Max: ${statToUpdate.maxValue})`;
                }
                 if(change.reason) changeDescription += ` (Lý do: ${change.reason})`;
                if (changeDescription) addToast({message: changeDescription, type: 'info', icon: 'fas fa-chart-line'});
            }
          });
        }
        
        const { updatedInventory, lostItemIds } = updateInventory(updatedGameState.inventory, nextSegmentData.itemChanges?.gained, nextSegmentData.itemChanges?.lost);
        updatedGameState.inventory = updatedInventory;

        if (lostItemIds.length > 0) {
            for (const slot in updatedGameState.equippedItems) {
                const typedSlot = slot as EquipmentSlot;
                if (updatedGameState.equippedItems[typedSlot] && lostItemIds.includes(updatedGameState.equippedItems[typedSlot]!)) {
                    const lostItemName = previousGameState?.inventory.find(i => i.id === updatedGameState.equippedItems[typedSlot])?.name || "Một vật phẩm"; 
                    delete updatedGameState.equippedItems[typedSlot];
                    addToast({ message: `${lostItemName} đã bị mất và tự động tháo ra.`, type: 'warning', icon: 'fas fa-box-tissue' });
                }
            }
        }

        if (nextSegmentData.itemChanges?.gained) {
            nextSegmentData.itemChanges.gained.forEach(item => addToast({ message: `Nhận được: ${item.name} (x${item.quantity})`, type: 'success', icon: item.icon || 'fas fa-gift' }));
        }
        if (nextSegmentData.itemChanges?.lost) {
            nextSegmentData.itemChanges.lost.forEach(itemLost => {
                const name = 'name' in itemLost ? itemLost.name : previousGameState?.inventory.find(i => i.id === itemLost.id)?.name || 'Một vật phẩm';
                addToast({ message: `Mất: ${name} (x${itemLost.quantity})`, type: 'warning', icon: 'fas fa-minus-circle' });
            });
        }

        if (nextSegmentData.newSkillsUnlocked) {
            nextSegmentData.newSkillsUnlocked.forEach(newSkill => {
                if (!updatedGameState.characterSkills.find(s => s.id === newSkill.id || s.name === newSkill.name)) {
                    const skillToAdd: Skill = {
                        id: newSkill.id || generateStableId(newSkill.name, 'skill'),
                        name: newSkill.name, description: newSkill.description || "Chưa có mô tả.", icon: newSkill.icon || 'fas fa-book-sparkles',
                        category: newSkill.category || 'khác', proficiency: newSkill.proficiency || 'Sơ Nhập Môn',
                        xp: newSkill.xp || 0, xpToNextLevel: newSkill.xpToNextLevel || 100, effects: newSkill.effects || []
                    };
                    updatedGameState.characterSkills.push(skillToAdd);
                    addToast({ message: `Học được kỹ năng mới: ${skillToAdd.name}!`, type: 'success', icon: skillToAdd.icon || 'fas fa-brain' });
                }
            });
        }
        if (nextSegmentData.skillChanges && Array.isArray(nextSegmentData.skillChanges)) {
            nextSegmentData.skillChanges.forEach(change => {
                const skillIndex = updatedGameState.characterSkills.findIndex(s => s.id === change.skill_id || s.name === change.skill_id); 
                if (skillIndex > -1) {
                    const skillToUpdate = {...updatedGameState.characterSkills[skillIndex]}; 
                    let toastMessage = `Kỹ năng ${skillToUpdate.name}: `;
                    let changesMade = false;
                    if (change.xp_gained !== undefined) {
                        skillToUpdate.xp += change.xp_gained;
                        toastMessage += `+${change.xp_gained} XP. `; changesMade = true;
                    }
                    if (change.new_proficiency) {
                        toastMessage += `Thành thạo -> ${change.new_proficiency}. `;
                        skillToUpdate.proficiency = change.new_proficiency; skillToUpdate.xp = 0; changesMade = true;
                    }
                    if (change.new_xp_to_next_level !== undefined) skillToUpdate.xpToNextLevel = change.new_xp_to_next_level;
                    if (change.new_description) {
                        skillToUpdate.description = change.new_description;
                        if(!changesMade) toastMessage += `Mô tả cập nhật. `; changesMade = true;
                    }
                    if(change.reason) toastMessage += `(Lý do: ${change.reason})`;

                    if (changesMade) addToast({ message: toastMessage, type: 'info', icon: skillToUpdate.icon || 'fas fa-graduation-cap' });
                    
                    if (skillToUpdate.xp >= skillToUpdate.xpToNextLevel && skillToUpdate.xpToNextLevel > 0) {
                        const proficiencies: Skill['proficiency'][] = ["Sơ Nhập Môn", "Tiểu Thành", "Đại Thành", "Viên Mãn", "Lô Hoả Thuần Thanh", "Đăng Phong Tạo Cực"];
                        const currentProfIndex = proficiencies.indexOf(skillToUpdate.proficiency);
                        if (currentProfIndex < proficiencies.length - 1) {
                            skillToUpdate.proficiency = proficiencies[currentProfIndex + 1];
                            skillToUpdate.xp -= skillToUpdate.xpToNextLevel; 
                            skillToUpdate.xpToNextLevel = Math.floor(skillToUpdate.xpToNextLevel * (1.5 + Math.random()*0.5)); 
                            addToast({ message: `Kỹ năng ${skillToUpdate.name} đã thăng cấp thành thạo lên ${skillToUpdate.proficiency}!`, type: 'success', icon: 'fas fa-angle-double-up' });
                        } else if (skillToUpdate.proficiency === "Đăng Phong Tạo Cực") {
                             skillToUpdate.xp = skillToUpdate.xpToNextLevel; 
                        }
                    }
                     updatedGameState.characterSkills[skillIndex] = skillToUpdate;
                }
            });
        }
        
        if (nextSegmentData.newlyUnlockedAchievements) {
            nextSegmentData.newlyUnlockedAchievements.forEach(ach => {
                 if (!updatedGameState.unlockedAchievements.find(ua => ua.name === ach.name)) {
                    const newAch = { ...ach, id: generateStableId(ach.name, 'ach'), unlockedAt: new Date().toISOString() };
                    updatedGameState.unlockedAchievements = [ ...updatedGameState.unlockedAchievements, newAch ];
                    addToast({ message: `Thành tựu mới: ${newAch.name}!`, type: 'success', icon: newAch.icon || 'fas fa-trophy' });
                }
            });
        }
        
        if (nextSegmentData.relationshipChanges) {
            nextSegmentData.relationshipChanges.forEach(change => {
                let npcProfile = Object.values(updatedGameState.npcRelationships).find(p => p.name === change.npc_name);
                if (!npcProfile && updatedGameState.encyclopedia.find(e => e.name === change.npc_name && e.type === EntityType.NPC)) {
                    const newNpcEntry = updatedGameState.encyclopedia.find(e => e.name === change.npc_name && e.type === EntityType.NPC);
                    if (newNpcEntry) {
                        const newNpcId = newNpcEntry.id;
                         updatedGameState.npcRelationships[newNpcId] = {
                            id: newNpcId, name: newNpcEntry.name, status: RelationshipStatus.Neutral, score: 0,
                            description: newNpcEntry.description, known: true,
                        };
                        npcProfile = updatedGameState.npcRelationships[newNpcId];
                        addToast({message: `Gặp gỡ ${newNpcEntry.name}.`, type: 'info', icon: 'fas fa-user-plus'});
                    }
                }

                if (npcProfile) {
                    let oldStatus = npcProfile.status; let oldScore = npcProfile.score;
                    if (change.score_change !== undefined) npcProfile.score = Math.max(-100, Math.min(100, npcProfile.score + change.score_change));
                    if (change.new_status) npcProfile.status = change.new_status;
                    else { 
                        if (npcProfile.score <= -80) npcProfile.status = RelationshipStatus.Hostile;
                        else if (npcProfile.score <= -30) npcProfile.status = RelationshipStatus.Mistrustful;
                        else if (npcProfile.score < 30) npcProfile.status = RelationshipStatus.Neutral;
                        else if (npcProfile.score < 60) npcProfile.status = RelationshipStatus.Amicable;
                        else if (npcProfile.score < 80) npcProfile.status = RelationshipStatus.Friendly;
                        else if (npcProfile.score < 100) npcProfile.status = RelationshipStatus.Loyal;
                        else npcProfile.status = RelationshipStatus.Adored;
                    }
                    if (change.reason) npcProfile.description = change.reason; 

                    if (oldStatus !== npcProfile.status || oldScore !== npcProfile.score) {
                         addToast({ message: `Quan hệ với ${npcProfile.name}: ${oldStatus} (${oldScore}) -> ${npcProfile.status} (${npcProfile.score}). ${change.reason ? `Lý do: ${change.reason}` : ''}`.trim(), type: 'info', icon: 'fas fa-heartbeat', duration: 7000 });
                    }
                    updatedGameState.npcRelationships[npcProfile.id] = npcProfile;
                }
            });
        }
        
        if (nextSegmentData.newObjectivesSuggested) {
            nextSegmentData.newObjectivesSuggested.forEach(objSugg => {
                if (!updatedGameState.objectives.find(o => o.title === objSugg.title && o.status === 'active')) {
                     const newObjective: Objective = { ...objSugg, id: generateStableId(objSugg.title, 'obj'), status: 'active', isPlayerGoal: false, };
                     updatedGameState.objectives.push(newObjective);
                     addToast({ message: `Mục tiêu mới được gợi ý: ${newObjective.title}`, type: 'info', icon: 'fas fa-lightbulb' });
                }
            });
        }
        if (nextSegmentData.objectiveUpdates) {
            nextSegmentData.objectiveUpdates.forEach(update => {
                const objIndex = updatedGameState.objectives.findIndex(o => (o.id === update.objective_id_or_title || o.title === update.objective_id_or_title) && o.status === 'active');
                if (objIndex > -1) {
                    updatedGameState.objectives[objIndex].status = update.new_status;
                    let toastIcon = update.new_status === 'completed' ? 'fas fa-flag-checkered' : 'fas fa-times-circle';
                    let toastTypeVal: ToastType = update.new_status === 'completed' ? 'success' : 'error';
                    addToast({ message: `Mục tiêu "${updatedGameState.objectives[objIndex].title}" đã ${update.new_status === 'completed' ? 'hoàn thành' : 'thất bại'}! ${update.reason ? `Lý do: ${update.reason}` : ''}`, type: toastTypeVal, icon: toastIcon, duration: 8000 });
                }
            });
        }

        if (settings.currencyEnabled && nextSegmentData.currencyChanges) {
            const change = nextSegmentData.currencyChanges;
            if (updatedGameState.currency) {
                const oldAmount = updatedGameState.currency.amount;
                updatedGameState.currency.amount = change.new_amount !== undefined ? change.new_amount : updatedGameState.currency.amount + (change.change_value || 0);
                updatedGameState.currency.amount = Math.max(0, updatedGameState.currency.amount);
                if (oldAmount !== updatedGameState.currency.amount) {
                     addToast({ message: `Tiền tệ (${updatedGameState.currency.name}): ${change.change_value ? (change.change_value > 0 ? '+' : '') + change.change_value.toLocaleString() : `-> ${updatedGameState.currency.amount.toLocaleString()}`} ${change.reason ? `(${change.reason})` : ''}`, type: 'info', icon: updatedGameState.currency.icon || 'fas fa-coins'});
                }
            }
        }

        if (settings.timeSystemEnabled && nextSegmentData.timeUpdate) {
            updatedGameState.currentTime = nextSegmentData.timeUpdate;
        }

        return updatedGameState;
      });
    } catch (error: any) {
      console.error("Error generating next story segment:", error);
      addToast({ message: `Lỗi AI: ${error.message}. Hãy thử lại.`, type: 'error' });
    } finally {
      setIsLoadingAI(false);
    }
  }, [gameState, setGameState, nsfwSettings, settings, isLoadingAI, addToast, processAndAddNewEntries, activePanelModal]);

  useEffect(() => {
    const aiJustFinishedLoading = prevIsLoadingAIRef.current === true && !isLoadingAI;

    if (aiJustFinishedLoading) {
        // This block executes only when isLoadingAI transitions from true to false.
        if (
          gameState &&
          !gameState.isRoleplayModeActive &&
          !gameState.isAuthorInterventionModeActive &&
          gameState.currentChoices.length === 0 &&
          gameState.isInitialStoryGenerated &&
          gameState.history.length > 0 &&
          !gameState.storyLog.some(msg => msg.type === 'system' && msg.content.includes("tử vong"))
        ) {
          handleAction("Nhân vật chính quan sát xung quanh và cân nhắc bước tiếp theo.");
        }
    }
    prevIsLoadingAIRef.current = isLoadingAI;
  }, [
    isLoadingAI,
    gameState, 
    handleAction
  ]);

  useEffect(() => {
    if (gameState && gameState.currentWorldEvent && gameState.currentWorldEvent.id !== prevCurrentWorldEventIdRef.current) {
      const lastMessage = gameState.storyLog[gameState.storyLog.length - 1];
      if (lastMessage && lastMessage.type === 'event' && lastMessage.content.includes(gameState.currentWorldEvent.name) && !isLoadingAI) {
        // A new world event was just activated by the modal.
        setTimeout(() => {
          if (!isLoadingAI) { // Re-check isLoadingAI inside timeout
            handleAction("AI_AUTO_CONTINUE_STORY");
          }
        }, 100);
      }
    }
    prevCurrentWorldEventIdRef.current = gameState?.currentWorldEvent?.id;
  }, [gameState?.currentWorldEvent, gameState?.storyLog, isLoadingAI, handleAction]);


  const handleUseItem = useCallback((itemToUse: InventoryItem) => {
    if (!itemToUse.usable || itemToUse.quantity <= 0) {
      addToast({ message: "Không thể sử dụng vật phẩm này.", type: 'warning' });
      return;
    }
    let tempInventory = [...gameState.inventory];
    if (itemToUse.consumable) {
        const itemIndex = tempInventory.findIndex(i => i.id === itemToUse.id);
        if (itemIndex > -1) {
            tempInventory[itemIndex].quantity -= 1;
            if (tempInventory[itemIndex].quantity <= 0) {
                tempInventory.splice(itemIndex, 1);
                let tempEquipped = {...gameState.equippedItems}; let unequipped = false;
                for(const slot in tempEquipped){
                    if(tempEquipped[slot as EquipmentSlot] === itemToUse.id){ delete tempEquipped[slot as EquipmentSlot]; unequipped = true; break;}
                }
                if(unequipped) setGameState(prev => prev ? ({...prev, equippedItems: tempEquipped}) : null);
            }
        }
        setGameState(prev => prev ? ({...prev, inventory: tempInventory}) : null);
    }
    let newCharacterStats = {...gameState.characterStats}; 
    if (itemToUse.effects) {
        itemToUse.effects.forEach(effect => {
            const stat = newCharacterStats[effect.statId];
            if (stat && typeof stat.value === 'number') {
                const oldValue = stat.value; stat.value += effect.changeValue;
                if (stat.maxValue !== undefined) stat.value = Math.min(stat.value, stat.maxValue);
                if (stat.id === 'hp') stat.value = Math.max(0, stat.value); 
                 addToast({ message: `${itemToUse.name} đã sử dụng. ${stat.name}: ${parseFloat(oldValue.toFixed(1))} -> ${parseFloat(stat.value.toFixed(1))}.`, type: 'success', icon: itemToUse.icon || 'fas fa-magic-wand-sparkles' });
            }
        });
        setGameState(prev => prev ? ({...prev, characterStats: newCharacterStats}) : null);
    }
    handleAction(`Sử dụng vật phẩm ${itemToUse.name}.`);
  }, [gameState.inventory, gameState.characterStats, gameState.equippedItems, setGameState, handleAction, addToast]);

  const handleEquipItem = useCallback((itemToEquip: InventoryItem) => {
    if (!itemToEquip.equippable || !itemToEquip.slot) {
        addToast({message: "Vật phẩm này không thể trang bị.", type: 'warning'}); return;
    }
    setGameState(prev => {
        if (!prev) return null;
        const newEquippedItems = { ...prev.equippedItems };
        newEquippedItems[itemToEquip.slot!] = itemToEquip.id;
        addToast({ message: `Đã trang bị: ${itemToEquip.name} vào ô ${itemToEquip.slot}.`, type: 'success', icon: itemToEquip.icon || 'fas fa-user-shield'});
        return { ...prev, equippedItems: newEquippedItems };
    });
  }, [setGameState, addToast]);

  const handleUnequipItem = useCallback((slot: EquipmentSlot) => {
      setGameState(prev => {
          if (!prev) return null;
          const itemId = prev.equippedItems[slot]; if (!itemId) return prev;
          const item = prev.inventory.find(i => i.id === itemId);
          const newEquippedItems = { ...prev.equippedItems }; delete newEquippedItems[slot];
          addToast({message: `Đã tháo: ${item?.name || 'Vật phẩm'} từ ô ${slot}.`, type: 'info', icon: item?.icon || 'fas fa-hand-paper'});
          return { ...prev, equippedItems: newEquippedItems };
      });
  }, [setGameState, addToast]);

  const handleCultivate = useCallback(() => handleAction("Tập Trung Nâng Cấp"), [handleAction]);
  const handleAdvance = useCallback(() => {
    const qiStat = effectiveCharacterStats.spiritual_qi;
     if (qiStat && typeof qiStat.value === 'number' && typeof qiStat.maxValue === 'number' && qiStat.value >= qiStat.maxValue && qiStat.maxValue > 0) {
        handleAction("Thử Thách Thăng Tiến");
    } else {
        addToast({message: "Chưa đủ điểm kinh nghiệm để đột phá.", type: 'warning'});
    }
  }, [handleAction, effectiveCharacterStats.spiritual_qi, addToast]);

  const toggleRoleplayMode = useCallback(() => {
    setGameState(prev => {
        if (!prev) return null;
        const newRoleplayMode = !prev.isRoleplayModeActive;
        addToast({message: `Chế độ ${newRoleplayMode ? "Nhập Vai (Tự do)" : "AI Hỗ Trợ (Gợi ý)"} đã ${newRoleplayMode ? "BẬT" : "TẮT"}.`, type: 'info', icon: newRoleplayMode ? 'fas fa-theater-masks' : 'fas fa-brain'});
        const newAuthorMode = newRoleplayMode ? false : prev.isAuthorInterventionModeActive; 
        return {...prev, isRoleplayModeActive: newRoleplayMode, isAuthorInterventionModeActive: newAuthorMode, currentChoices: (newRoleplayMode || newAuthorMode) ? [] : prev.currentChoices };
    });
  }, [setGameState, addToast]);
  
  const toggleAuthorInterventionMode = useCallback(() => {
    setGameState(prev => {
      if (!prev) return null;
      const newAuthorMode = !prev.isAuthorInterventionModeActive;
      addToast({
        message: `Chế độ Can Thiệp Tác Giả ${newAuthorMode ? "BẬT" : "TẮT"}.`,
        type: 'info',
        icon: newAuthorMode ? 'fas fa-feather-alt' : 'fas fa-feather'
      });
      const newRoleplayMode = newAuthorMode ? false : prev.isRoleplayModeActive; 
      return {
        ...prev,
        isAuthorInterventionModeActive: newAuthorMode,
        isRoleplayModeActive: newRoleplayMode,
        currentChoices: (newAuthorMode || newRoleplayMode) ? [] : prev.currentChoices
      };
    });
  }, [setGameState, addToast]);
  
  const handleUndoLastAction = useCallback(() => {
    setGameState(prev => {
        if (!prev || prev.history.length === 0) {
            addToast({ message: "Không có hành động nào để hoàn tác.", type: 'warning' }); return prev;
        }
        const previousStateSnapshot = prev.history[prev.history.length - 1];
        const newHistory = prev.history.slice(0, -1);
        addToast({ message: "Đã hoàn tác hành động trước đó.", type: 'info', icon: 'fas fa-undo' });
        
        const restoredGameState: GameState = {
            ...prev, 
            storyLog: previousStateSnapshot.storyLog, 
            currentChoices: previousStateSnapshot.currentChoices,
            currentSummary: previousStateSnapshot.currentSummary, 
            currentWorldEvent: previousStateSnapshot.currentWorldEvent,
            encyclopedia: previousStateSnapshot.encyclopedia, 
            characterStats: previousStateSnapshot.characterStats,
            inventory: previousStateSnapshot.inventory, 
            equippedItems: previousStateSnapshot.equippedItems,
            unlockedAchievements: previousStateSnapshot.unlockedAchievements, 
            characterSkills: previousStateSnapshot.characterSkills,
            isRoleplayModeActive: previousStateSnapshot.isRoleplayModeActive, 
            isAuthorInterventionModeActive: previousStateSnapshot.isAuthorInterventionModeActive,
            activeSidebarTab: previousStateSnapshot.activeSidebarTab,
            npcRelationships: previousStateSnapshot.npcRelationships, 
            objectives: previousStateSnapshot.objectives,
            currency: previousStateSnapshot.currency,
            currentTime: previousStateSnapshot.currentTime,
            history: newHistory, 
        };
        return restoredGameState;
    });
  }, [setGameState, addToast]);

  const handleRerollInitialStory = useCallback(async () => {
    if (isLoadingAI || !gameState || gameState.history.length > 0) return; 

    setIsLoadingAI(true);
    addToast({ message: "Đang yêu cầu AI tạo lại mở đầu mới...", type: 'info', icon: 'fas fa-dice-d6 fa-spin' });
    setNumMessagesToShow(INITIAL_MESSAGES_TO_SHOW); 

    const apiKey = settings.useDefaultAPI ? (process.env.API_KEY || '') : (localStorage.getItem(LOCAL_STORAGE_API_KEY) || '');

    try {
        const data = await generateInitialStory(
            apiKey,
            settings.useDefaultAPI,
            gameState.setup.world,
            gameState.setup.character,
            gameState.setup.entities, 
            nsfwSettings,
            { currencyEnabled: settings.currencyEnabled, timeSystemEnabled: settings.timeSystemEnabled, reputationSystemEnabled: settings.reputationSystemEnabled }
        );

        setGameState(prev => {
            if (!prev) return null;

            const newMessages: StoryMessage[] = [data.story]; 
            
            let updatedEncyclopedia = [...prev.setup.entities];
            updatedEncyclopedia = processAndAddNewEntries(updatedEncyclopedia, data.newEntries);


            let updatedStats = data.initialStats || prev.characterStats; 
            let updatedInventory = data.initialInventory || []; 
            let updatedSkills = data.initialSkills || []; 
            
            let updatedAchievements: Achievement[] = []; 
            if (data.newlyUnlockedAchievements) {
                updatedAchievements = data.newlyUnlockedAchievements.map(ach => ({
                    ...ach,
                    id: generateStableId(ach.name, 'ach'),
                    unlockedAt: new Date().toISOString()
                }));
                data.newlyUnlockedAchievements.forEach(ach => addToast({ message: `Thành tựu mới: ${ach.name}!`, type: 'success', icon: ach.icon || 'fas fa-trophy' }));
            }
            
            let updatedRelationships: Record<string, NPCProfile> = {}; 
            if (data.initialRelationships) {
                data.initialRelationships.forEach(rel => {
                    if (rel.name) {
                        const npcId = rel.id || generateStableId(rel.name, 'npc');
                        updatedRelationships[npcId] = {
                            id: npcId, name: rel.name,
                            status: rel.status || RelationshipStatus.Neutral,
                            score: rel.score || 0,
                            description: rel.description,
                            known: rel.known !== undefined ? rel.known : true,
                        };
                    }
                });
            }
            
            let updatedObjectives: Objective[] = []; 
            if (data.initialObjectives) {
                updatedObjectives = data.initialObjectives.map(obj => ({
                    ...obj,
                    id: generateStableId(obj.title, 'obj'),
                    status: 'active' as 'active',
                    isPlayerGoal: obj.isPlayerGoal !== undefined ? obj.isPlayerGoal : (obj.title.toLowerCase().includes(prev.setup.character.goal.toLowerCase()) && prev.setup.character.goal.length > 5)
                }));
                data.initialObjectives.forEach(obj => addToast({ message: `Mục tiêu mới: ${obj.title}`, type: 'info', icon: 'fas fa-flag-checkered' }));
            }
            
            const initialCurrency = settings.currencyEnabled && data.initialCurrency
                ? data.initialCurrency
                : (settings.currencyEnabled ? { name: "Đồng", amount: 100, icon: "fas fa-coins" } : undefined);
            const initialTime = settings.timeSystemEnabled && data.initialTime
                ? data.initialTime
                : (settings.timeSystemEnabled ? "08:00 Ngày 1, Tháng 1, Năm 1 (Sáng sớm)" : undefined);

            addToast({ message: "Đã tạo lại mở đầu câu chuyện!", type: 'success', icon: 'fas fa-dice-d6' });

            const newState: GameState = {
                ...prev,
                storyLog: newMessages,
                currentChoices: data.choices,
                encyclopedia: updatedEncyclopedia,
                isInitialStoryGenerated: true, 
                characterStats: updatedStats,
                inventory: updatedInventory,
                equippedItems: {}, 
                characterSkills: updatedSkills,
                unlockedAchievements: updatedAchievements,
                npcRelationships: updatedRelationships,
                objectives: updatedObjectives,
                history: [], 
                currentSummary: "", 
                currentWorldEvent: null,
                currency: initialCurrency,
                currentTime: initialTime,
            };
            return newState;
        });
    } catch (error: any) {
        console.error("Error rerolling initial story:", error);
        addToast({ message: `Lỗi AI khi tạo lại mở đầu: ${error.message}.`, type: 'error', duration: 10000 });
    } finally {
        setIsLoadingAI(false);
    }
  }, [isLoadingAI, gameState, nsfwSettings, settings, setGameState, addToast, processAndAddNewEntries]);


  const handleKeywordMouseEnter = useCallback((event: React.MouseEvent<HTMLSpanElement> | React.FocusEvent<HTMLSpanElement>, entryId: string, entryType: EntityType | "STAT" | "SKILL" | "ACH" | "TRAIT") => {
    if (hideTooltipTimeoutRef.current) clearTimeout(hideTooltipTimeoutRef.current);
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    
    let contentNode: React.ReactNode = null;
    if(entryType === "STAT"){
      const stat = effectiveCharacterStats[entryId];
      if(stat) contentNode = <div className="p-2 text-xs"><strong className="font-semibold">{stat.name}</strong>: {String(stat.value)}{stat.maxValue ? `/${stat.maxValue}`: ''}<br/>{stat.description}</div>;
    } else if (entryType === "SKILL"){
      const skill = gameState.characterSkills.find(s => s.id === entryId || s.name === entryId);
      if(skill) contentNode = <div className="p-2 text-xs"><strong className="font-semibold">{skill.name}</strong> ({skill.proficiency})<br/>{skill.description}</div>;
    } else { 
      const entry = entryType === "ACH" ? gameState.unlockedAchievements.find(a => a.id === entryId || a.name === entryId)
                  : entryType === "TRAIT" ? gameState.setup.character.traits.find(t => t.id === entryId || t.name === entryId)
                  : gameState.encyclopedia.find(e => (e.id === entryId || e.name === entryId) && e.type === entryType);
      if(entry) contentNode = <div className="p-2 text-xs"><strong className="font-semibold">{entry.name}</strong> {entryType !== "ACH" && entryType !== "TRAIT" ? `(${(entry as Entity).type})` : ''}<br/>{entry.description}</div>;
    }


    if (contentNode) {
      setTooltip({ content: contentNode, x: rect.left + rect.width / 2, y: rect.top, width: rect.width });
    }
  }, [gameState, effectiveCharacterStats]);
  
  const handleKeywordMouseLeave = useCallback(() => {
    hideTooltipTimeoutRef.current = setTimeout(() => {
        setTooltip(null);
    }, 200);
  }, []);

  const handleKeywordFocus = useCallback((event: React.FocusEvent<HTMLSpanElement>, entryId: string, entryType: EntityType | "STAT" | "SKILL" | "ACH" | "TRAIT") => {
    handleKeywordMouseEnter(event, entryId, entryType);
  }, [handleKeywordMouseEnter]);

  const handleKeywordBlur = useCallback(() => {
    handleKeywordMouseLeave();
  }, [handleKeywordMouseLeave]);


  const KeywordTooltipWrapper: React.FC<{
      keyword: string; 
      id: string; 
      type: EntityType | "STAT" | "SKILL" | "ACH" | "TRAIT"; 
      children: React.ReactNode;
      textColorClass: string;
      focusRingClass: string;
  }> = React.memo(({ keyword, id, type, children, textColorClass, focusRingClass }) => {
    return (
        <span 
          className={`keyword-tooltip-trigger font-semibold cursor-pointer ${textColorClass} hover:underline focus:outline-none focus:ring-1 ${focusRingClass} rounded-sm px-0.5 -mx-0.5`}
          onMouseEnter={(e) => handleKeywordMouseEnter(e, id, type)}
          onMouseLeave={handleKeywordMouseLeave}
          onFocus={(e) => handleKeywordFocus(e, id, type)}
          onBlur={handleKeywordBlur}
          tabIndex={0} 
          role="button"
          aria-describedby="keyword-tooltip"
        >
          {children}
        </span>
    );
  });
  
 const parseAndRenderMessageContent = useCallback((content: string): React.ReactNode[] => {
    const allPotentialKeywords: Array<{ name: string; id: string; type: EntityType | "STAT" | "SKILL" | "ACH" | "TRAIT" }> = [];

    gameState.encyclopedia.forEach(e => {
      if (e.name) allPotentialKeywords.push({ name: e.name, id: e.id, type: e.type });
    });
    Object.values(effectiveCharacterStats).forEach(s => {
      if (s.name) allPotentialKeywords.push({ name: s.name, id: s.id, type: "STAT" });
    });
    gameState.characterSkills.forEach(s => {
      if (s.name) allPotentialKeywords.push({ name: s.name, id: s.id, type: "SKILL" });
    });
    gameState.unlockedAchievements.forEach(a => {
      if (a.name) allPotentialKeywords.push({ name: a.name, id: a.id, type: "ACH" });
    });
    gameState.setup.character.traits.forEach(t => {
      if (t.name) allPotentialKeywords.push({ name: t.name, id: t.id, type: "TRAIT" });
    });

    const uniqueKeywordsForRegex = Array.from(new Set(allPotentialKeywords.map(kw => kw.name)))
      .filter(name => name.trim().length > 1) 
      .sort((a, b) => b.length - a.length);

    if (uniqueKeywordsForRegex.length === 0) {
      return [content];
    }
    
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = uniqueKeywordsForRegex.map(kw => escapeRegExp(kw)).join('|');
    const regex = new RegExp(`(?<=\\W|^)(${regexPattern})(?=\\W|$)`, 'giu');


    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const matchedText = match[1]; 
      
      const matchedKeywordInfo = allPotentialKeywords
        .filter(kw => kw.name.toLowerCase() === matchedText.toLowerCase())
        .sort((a,b) => b.name.length - a.name.length)[0];

      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      if (matchedKeywordInfo) {
        const colorConfig = KEYWORD_TYPE_COLORS[matchedKeywordInfo.type] || KEYWORD_TYPE_COLORS["DEFAULT"];
        parts.push(
          <KeywordTooltipWrapper 
            key={`${match.index}-${matchedKeywordInfo.name}`} 
            keyword={matchedKeywordInfo.name}
            id={matchedKeywordInfo.id} 
            type={matchedKeywordInfo.type}
            textColorClass={colorConfig.base}
            focusRingClass={colorConfig.focusRing}
          >
            {match[0]} 
          </KeywordTooltipWrapper>
        );
      } else {
        parts.push(match[0]); 
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    return parts.length > 0 ? parts : [content];
  }, [gameState, effectiveCharacterStats, KeywordTooltipWrapper]);

  const allPanelButtons: Array<{ 
    id: ActiveSidebarTab; 
    label: string; 
    icon: string; 
    component?: React.ReactNode; 
  }> = [
    { id: 'actions', label: 'Hành Động', icon: 'fas fa-hand-pointer' },
    { id: 'stats', label: 'Chỉ Số', icon: 'fas fa-chart-line', component: <CharacterStatsPanel baseStats={gameState.characterStats} equippedItems={gameState.equippedItems} inventory={gameState.inventory} characterName={gameState.setup.character.name}/> },
    { id: 'inventory', label: 'Ba Lô', icon: 'fas fa-briefcase', component: <InventoryPanel items={gameState.inventory} equippedItems={gameState.equippedItems} onUseItem={handleUseItem} onEquipItem={handleEquipItem} isLoadingAI={isLoadingAI} currency={gameState.currency} currencyEnabled={settings.currencyEnabled}/> },
    { id: 'equipment', label: 'Trang Bị', icon: 'fas fa-user-shield', component: <EquipmentPanel equippedItems={gameState.equippedItems} inventory={gameState.inventory} onUnequipItem={handleUnequipItem} /> },
    { id: 'cultivation', label: 'Tu Luyện', icon: 'fas fa-hat-wizard', component: <CultivationPanel progressionStat={effectiveCharacterStats.progression_level} qiStat={effectiveCharacterStats.spiritual_qi} onAdvance={handleAdvance} onCultivate={handleCultivate} isLoadingAI={isLoadingAI} /> },
    { id: 'skills', label: 'Kỹ Năng', icon: 'fas fa-book-sparkles', component: <CharacterSkillsPanel skills={gameState.characterSkills} isLoadingAI={isLoadingAI} /> },
    { id: 'achievements', label: 'Thành Tựu', icon: 'fas fa-trophy', component: <AchievementsPanel achievements={gameState.unlockedAchievements} /> },
    { id: 'relationships', label: 'Quan Hệ', icon: 'fas fa-users', component: <RelationshipsPanel relationships={gameState.npcRelationships} /> },
    { id: 'objectives', label: 'Mục Tiêu', icon: 'fas fa-tasks', component: <ObjectivesPanel objectives={gameState.objectives} characterGoal={gameState.setup.character.goal} /> },
  ];
  
  const desktopPanelDropdownButtons = allPanelButtons.filter(p => p.id !== 'actions');
  
  if (!gameState) {
    return <div className="flex items-center justify-center h-screen">Đang tải dữ liệu game...</div>;
  }

  const headerActionButtons = [
    { id: ModalType.Encyclopedia, icon: 'fas fa-book-open', title: 'Bách Khoa Toàn Thư', mobileHidden: false },
    { id: ModalType.StorySummary, icon: 'fas fa-scroll', title: 'Tóm Tắt Cốt Truyện', mobileHidden: true },
    { id: ModalType.WorldEventCreator, icon: 'fas fa-meteor', title: 'Tạo Sự Kiện Thế Giới', mobileHidden: true },
    { id: 'undo', icon: 'fas fa-undo', title: 'Hoàn Tác', action: handleUndoLastAction, disabled: gameState.history.length === 0, mobileHidden: true },
  ];
  
  const visibleHeaderButtons = isMobile ? headerActionButtons.filter(b => !b.mobileHidden) : headerActionButtons;
  const dropdownHeaderButtons = isMobile ? headerActionButtons.filter(b => b.mobileHidden) : [];
  if (!gameState.isInitialStoryGenerated && isMobile) {
     dropdownHeaderButtons.push({ id: 'reroll', icon: 'fas fa-dice-d6', title: 'Tạo Lại Mở Đầu', action: handleRerollInitialStory, disabled: isLoadingAI || gameState.history.length > 0, mobileHidden: false});
  }
   if (isMobile) {
    dropdownHeaderButtons.push({ id: 'google_auth_mobile', icon: 'fab fa-google', title: 'Tài Khoản Google', isComponent: true, component: <GoogleAuthButton variant="dropdownItem"/>, mobileHidden: false });
   }


  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-background-dark dark:to-slate-800 text-text-light dark:text-text-dark overflow-hidden transition-colors duration-300 ${isMobile && activePanelModal === 'actions' ? 'mobile-action-sheet-body-padding' : ''}`}>
      {/* Top Bar - Game Controls */}
      <header className="flex-shrink-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg p-2.5 border-b border-border-light dark:border-border-dark z-20">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex-grow min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary dark:text-primary-light truncate sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg" title={gameState.setup.name || "Cuộc Phiêu Lưu Chưa Đặt Tên"}>
              {gameState.setup.name || "Cuộc Phiêu Lưu Chưa Đặt Tên"}
            </h1>
            {settings.timeSystemEnabled && gameState.currentTime && (
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                <i className="fas fa-clock mr-1.5 opacity-80"></i>
                <span title={`Thời gian trong game: ${gameState.currentTime}`}>{gameState.currentTime}</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center space-x-1 sm:space-x-1.5">
            {!isMobile && <GoogleAuthButton />} {/* Google Auth Button for Desktop */}
            <Button size="xs" variant="ghost" onClick={() => openModal(ModalType.SaveGame)} title="Lưu Game"><i className="fas fa-save"></i><span className="hidden sm:inline ml-1.5">Lưu</span></Button>
            
            {!isMobile && !gameState.isInitialStoryGenerated && (
              <Button 
                size="xs" 
                variant="ghost" 
                onClick={handleRerollInitialStory} 
                disabled={isLoadingAI || gameState.history.length > 0} 
                title="Tạo Lại Mở Đầu"
                className="text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-700/50"
              >
                <i className="fas fa-dice-d6"></i><span className="hidden sm:inline ml-1.5">Tạo Lại Mở Đầu</span>
              </Button>
            )}

            {!isMobile && (
              <div className="relative" ref={desktopPanelsDropdownRef}>
                <Button size="xs" variant="ghost" onClick={() => setIsDesktopPanelsDropdownOpen(o => !o)} title="Mở Bảng Điều Khiển">
                  <i className="fas fa-th-large"></i><span className="hidden sm:inline ml-1.5">Bảng Điều Khiển</span>
                </Button>
                {isDesktopPanelsDropdownOpen && (
                  <div className="absolute right-0 sm:left-0 mt-2 w-56 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-border-light dark:border-border-dark">
                    {desktopPanelDropdownButtons.map(panel => (
                      <button
                        key={panel.id}
                        onClick={() => {
                          setActivePanelModal(panel.id);
                          setIsDesktopPanelsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center"
                        title={panel.label}
                      >
                        <i className={`${panel.icon} mr-2.5 w-4 text-center`}></i>{panel.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {visibleHeaderButtons.map(btn => (
                <Button key={btn.title} size="xs" variant="ghost" onClick={() => btn.action ? btn.action() : openModal(btn.id as ModalType)} disabled={btn.disabled} title={btn.title}>
                    <i className={btn.icon}></i>
                </Button>
            ))}

            {isMobile && dropdownHeaderButtons.length > 0 && (
                <div className="relative" ref={headerDropdownRef}>
                    <Button size="xs" variant="ghost" onClick={() => setIsHeaderDropdownOpen(o => !o)} title="Thêm tùy chọn">
                        <i className="fas fa-ellipsis-v"></i>
                    </Button>
                    {isHeaderDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-border-light dark:border-border-dark">
                            {dropdownHeaderButtons.map(btn => {
                              if ((btn as any).isComponent) {
                                return <div key={btn.id as string}>{(btn as any).component}</div>;
                              }
                              return (
                                <button
                                    key={btn.title}
                                    onClick={() => { btn.action ? btn.action() : openModal(btn.id as ModalType); setIsHeaderDropdownOpen(false); }}
                                    disabled={btn.disabled}
                                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 flex items-center"
                                    title={btn.title}
                                >
                                    <i className={`${btn.icon} mr-2.5 w-4 text-center`}></i>{btn.title}
                                </button>
                            )})}
                        </div>
                    )}
                </div>
            )}
            <Button size="xs" variant="danger" onClick={quitGame} title="Thoát Game"><i className="fas fa-door-open"></i><span className="hidden sm:inline ml-1.5">Thoát</span></Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-grow flex flex-col sm:flex-row overflow-hidden p-2 sm:p-3 gap-2 sm:gap-3 ${isMobile ? 'pb-[60px]' : ''}`}> {/* Add padding-bottom for mobile footer */}
        {/* Story Log Area (Left on Desktop, Main on Mobile) */}
        <div ref={storyLogRef} className="flex-grow w-full sm:w-3/5 xl:w-2/3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 overflow-y-auto custom-scrollbar relative flex flex-col">
          {gameState.storyLog.length > numMessagesToShow && (
            <Button onClick={() => setNumMessagesToShow(prev => prev + MESSAGES_TO_LOAD_PER_CLICK)} variant="outline" size="sm" className="mx-auto mb-3 text-xs">
              <i className="fas fa-history mr-2"></i>Tải Thêm Tin Nhắn Cũ
            </Button>
          )}
          <div className="space-y-3 sm:space-y-4 flex-grow">
            {gameState.storyLog.slice(Math.max(0, gameState.storyLog.length - numMessagesToShow)).map((msg) => {
              let msgStyle = 'bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100';
              let align = 'self-start';
              let icon = null;

              switch (msg.type) {
                case 'narration':
                  msgStyle = 'bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-600/50';
                  icon = <i className="fas fa-feather-alt mr-2 sm:mr-2.5 text-slate-400 dark:text-slate-500 opacity-80"></i>;
                  break;
                case 'dialogue':
                  msgStyle = 'bg-primary-light/30 dark:bg-primary-dark/40 text-primary-dark dark:text-primary-light border border-primary/40 dark:border-primary-dark/50 shadow-sm';
                  icon = <i className="fas fa-comments mr-2 sm:mr-2.5 text-primary dark:text-primary-light opacity-90"></i>;
                  break;
                case 'system':
                  msgStyle = 'bg-amber-50 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200 border border-amber-300 dark:border-amber-600/70 text-xs italic shadow-sm';
                  align = 'self-center w-full sm:w-auto max-w-xl text-center';
                  icon = <i className="fas fa-info-circle mr-1.5 sm:mr-2 text-amber-5