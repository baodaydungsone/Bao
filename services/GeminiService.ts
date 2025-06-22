
import { GoogleGenAI, GenerateContentResponse, Chat, Part } from "@google/genai";
import {
    WorldSetup, CharacterSetup, Entity, StoryMessage, PlayerChoice,
    NSFWPreferences, WorldEvent, GameState, EntityType, CharacterStats,
    InventoryItem, CharacterAttribute, ItemEffect, StatChange, Achievement, Skill, SkillChange,
    InitialStoryAIData, NextStoryAIData, NPCProfile, RelationshipStatus, Objective, AIExtractedSetupData,
    CharacterGender, WorldTone, CharacterTrait, SkillProficiency, EquipmentSlot, StatBonus, AIRandomGenerationParams, Settings
} from '../types';
import { GEMINI_TEXT_MODEL, STORY_PROMPT_CONFIG_BASE } from '../constants';

let ai: GoogleGenAI | null = null;
let currentInitializedApiKey: string | null = null;

function initializeGemini(apiKey: string) {
  if (!apiKey) { 
    throw new Error("API key is required to initialize Gemini service. Attempted to initialize with an empty key.");
  }
  if (ai === null || currentInitializedApiKey !== apiKey) {
    ai = new GoogleGenAI({ apiKey });
    currentInitializedApiKey = apiKey;
  }
}

function getResolvedApiKey(passedApiKey: string, useDefaultAPI: boolean): string {
  let keyToUse: string;
  if (useDefaultAPI) {
    keyToUse = (typeof process !== 'undefined' && process.env && typeof process.env.API_KEY === 'string')
               ? process.env.API_KEY
               : "";
    if (!keyToUse) {
      console.error("Default API Key (process.env.API_KEY) is not configured in the environment.");
      throw new Error("API Key not available: Default API Key (process.env.API_KEY) is not configured in the environment. Please check server configuration or switch to a custom API key in settings.");
    }
  } else {
    keyToUse = passedApiKey;
    if (!keyToUse) {
      console.error("User-provided API Key is missing or empty.");
      throw new Error("API Key not available: User-provided API Key is missing or empty. Please provide one in settings or use the default API key.");
    }
  }
  return keyToUse;
}


function getSystemPrompt(
    world: WorldSetup,
    character: CharacterSetup,
    currentEntities: Entity[],
    storyLog: StoryMessage[],
    nsfw: NSFWPreferences,
    currentWorldEvent: WorldEvent | null,
    characterStats: CharacterStats | undefined,
    inventory: InventoryItem[] | undefined,
    equippedItems: Partial<Record<EquipmentSlot, InventoryItem['id']>> | undefined,
    unlockedAchievements: Achievement[] | undefined,
    characterSkills: Skill[] | undefined,
    npcRelationships: Record<string, NPCProfile> | undefined,
    objectives: Objective[] | undefined,
    isRoleplayModeActive?: boolean,
    isAuthorInterventionModeActive?: boolean,
    // New optional system settings
    currencyEnabled?: boolean,
    currentCurrency?: { name: string; amount: number; icon?: string },
    timeSystemEnabled?: boolean,
    currentTime?: string,
    reputationSystemEnabled?: boolean
  ): string {

  let baseSystemInstruction = STORY_PROMPT_CONFIG_BASE.systemInstruction;

  baseSystemInstruction += `\n\n**THIẾT LẬP HIỆN TẠI CỦA NGƯỜI CHƠI:**\n`;
  baseSystemInstruction += `**Thế Giới:**\n- Chủ đề: ${world.theme}\n- Bối cảnh: ${world.context}\n- Phong cách/Giọng văn: ${world.tone}\n`;
  if (world.advancedPrompt) {
    baseSystemInstruction += `- Prompt Nâng Cao: ${world.advancedPrompt}\n`;
  }

  baseSystemInstruction += `\n**Nhân Vật Chính (MC - ${character.name}):**\n- Tên: ${character.name}\n- Giới tính: ${character.gender}\n- Sơ lược: ${character.summary}\n- Mục tiêu/Động lực chính: ${character.goal}\n`;
  if (character.traits.length > 0) {
    baseSystemInstruction += `- Đặc điểm:\n${character.traits.map(t => `  - ${t.name}: ${t.description}`).join('\n')}\n`;
  }

  if (characterStats && Object.keys(characterStats).length > 0) {
    baseSystemInstruction += `\n**Chỉ Số GỐC Nhân Vật Hiện Tại (chưa bao gồm bonus từ trang bị):**\n${Object.values(characterStats).map(stat => {
        let statDisplay = `  - ${stat.name} (${stat.id}): ${String(stat.value)}`;
        if (['crit_chance', 'evasion_chance', 'crit_damage_bonus'].includes(stat.id)) statDisplay += '%';
        if (!stat.isProgressionStat && typeof stat.value === 'number' && stat.maxValue !== undefined && !['crit_chance', 'evasion_chance'].includes(stat.id)) {
            statDisplay += `/${stat.maxValue}`;
        }
        return statDisplay;
    }).join('\n')}\n`;
  }

  if (equippedItems && inventory && Object.keys(equippedItems).length > 0) {
    baseSystemInstruction += `\n**Trang Bị Hiện Tại:**\n`;
    for (const slot in equippedItems) {
        const itemId = equippedItems[slot as EquipmentSlot];
        if (itemId) {
            const item = inventory.find(i => i.id === itemId);
            if (item) {
                 baseSystemInstruction += `  - ${slot}: [ITEM:${item.name}]\n`;
            }
        }
    }
  }
  
  if (currencyEnabled && currentCurrency) {
    baseSystemInstruction += `\n**Tiền Tệ Hiện Tại (${currentCurrency.name}):** ${currentCurrency.amount.toLocaleString()} ${currentCurrency.name} (Icon: ${currentCurrency.icon || 'fas fa-coins'}). Yêu cầu AI cập nhật qua \`currency_changes\`.\n`;
  }

  if (inventory && inventory.length > 0) {
    baseSystemInstruction += `\n**Vật Phẩm Trong Ba Lô Hiện Tại (Ưu tiên vật phẩm 'quan trọng' và 'trang bị'):**\n${inventory.map(item => `  - [ITEM:${item.name}] (SL: ${item.quantity}, Loại: ${item.category || 'khác'}, Icon: ${item.icon || 'fas fa-question-circle'})${item.description ? `: ${item.description.substring(0,50)}...` : ''}`).join('\n')}\n`;
  }


  if (characterSkills && characterSkills.length > 0) {
    baseSystemInstruction += `\n**Kỹ Năng Hiện Tại Của Nhân Vật:**\n${characterSkills.map(skill => `  - [SKILL:${skill.name}] (ID: ${skill.id}, Proficiency: ${skill.proficiency}, Icon: ${skill.icon || 'fas fa-star'}, Mô tả hiện tại: ${skill.description.substring(0,70)}...): ${skill.xp}/${skill.xpToNextLevel} XP`).join('\n')}\nAI chỉ cần cung cấp các kỹ năng MỚI được mở khóa trong \`new_skills_unlocked\` hoặc thay đổi XP/proficiency (kèm \`new_description\`) trong \`skill_changes\`.\n`;
  }

  if (unlockedAchievements && unlockedAchievements.length > 0) {
    baseSystemInstruction += `\n**Thành Tựu Đã Mở Khóa:**\n${unlockedAchievements.map(ach => `  - ${ach.name}: ${ach.description.substring(0,70)}...`).join('\n')}\nAI chỉ cần cung cấp các thành tựu MỚI được mở khóa trong \`newly_unlocked_achievements\`.\n`;
  }

  if (currentEntities.length > 0) {
    baseSystemInstruction += `\n**Các Thực Thể/Đối Tượng Đã Biết (Trong Bách Khoa Toàn Thư):**\n${currentEntities.map(e => `  - ${e.type} "[${e.type === EntityType.NPC ? 'NPC:' : e.type === EntityType.Location ? 'LOC:' : e.type === EntityType.Organization ? 'ORG:' : e.type === EntityType.Item ? 'ITEM:' : 'OTH:'}${e.name}]": ${e.description.substring(0,100)}...`).join('\n')}\nLưu ý: AI chỉ cần bổ sung các mục thực sự mới hoặc cập nhật mô tả cho các mục đã có này vào 'new_encyclopedia_entries' nếu cần. Không liệt kê lại toàn bộ.\n`;
  }

  if (npcRelationships && Object.keys(npcRelationships).length > 0) {
    baseSystemInstruction += `\n**Mối Quan Hệ Với NPC Hiện Tại:**\n${Object.values(npcRelationships).filter(r => r.known).map(rel => `  - [NPC:${rel.name}]: ${rel.status} (Điểm: ${rel.score})`).join('\n')}\nAI cần xem xét các mối quan hệ này khi NPC tương tác với MC và cung cấp \`relationship_changes\` nếu hành động của MC thay đổi đáng kể tình cảm của NPC.\n`;
  }

  if (objectives && objectives.length > 0) {
    baseSystemInstruction += `\n**Mục Tiêu/Nhiệm Vụ Hiện Tại:**\n${objectives.filter(obj => obj.status === 'active').map(obj => `  - ${obj.title} (ID: ${obj.id}): ${obj.description.substring(0,70)}...`).join('\n')}\nAI có thể đề xuất \`new_objectives_suggested\` hoặc \`objective_updates\`.\n`;
  }

  if (currentWorldEvent) {
    baseSystemInstruction += `\n**Sự Kiện Thế Giới Hiện Tại (${currentWorldEvent.status}):**\n- Tên: ${currentWorldEvent.name}\n- Loại: ${currentWorldEvent.type}\n- Phạm vi: ${currentWorldEvent.scope}\n- Mô tả: ${currentWorldEvent.description}\n`;
    if (currentWorldEvent.keyElements && currentWorldEvent.keyElements.length > 0) {
        baseSystemInstruction += `- Yếu tố chính: ${currentWorldEvent.keyElements.join(', ')}\n`;
    }
  }
  
  if (timeSystemEnabled && currentTime) {
    baseSystemInstruction += `\n**Thời Gian Hiện Tại:** ${currentTime}. Yêu cầu AI cập nhật qua \`time_update\`.\n`;
  }
  
  baseSystemInstruction += `\n**HỆ THỐNG TÙY CHỈNH KÍCH HOẠT:**\n`;
  baseSystemInstruction += `- Hệ thống Tiền Tệ: ${currencyEnabled ? 'BẬT' : 'TẮT'}\n`;
  baseSystemInstruction += `- Hệ thống Thời Gian: ${timeSystemEnabled ? 'BẬT' : 'TẮT'}\n`;
  baseSystemInstruction += `- Hệ thống Danh Tiếng (Ngầm): ${reputationSystemEnabled ? 'BẬT' : 'TẮT'}\n`;


  if (nsfw.enabled) {
    baseSystemInstruction += `\n**Chế Độ NSFW Đang BẬT:**\n`;
    if (nsfw.eroticaLevel !== 'none') baseSystemInstruction += `- Khiêu dâm: ${nsfw.eroticaLevel}\n`;
    if (nsfw.violenceLevel !== 'none') baseSystemInstruction += `- Bạo lực: ${nsfw.violenceLevel}\n`;
    if (nsfw.darkContentLevel !== 'none') baseSystemInstruction += `- Nội dung đen tối: ${nsfw.darkContentLevel}\n`;
    if (nsfw.customPrompt && nsfw.customPrompt.trim() !== '') {
      baseSystemInstruction += `- Phong cách tùy chỉnh: ${nsfw.customPrompt}\n`;
    }
    baseSystemInstruction += `Hãy lồng ghép các yếu tố này một cách tự nhiên, không gượng ép, và phù hợp với bối cảnh truyện khi có cơ hội.\n`;
  } else {
    baseSystemInstruction += `\n**Chế Độ NSFW Đang TẮT.** Tránh các nội dung nhạy cảm.\n`;
  }
  
  if (isRoleplayModeActive) { // This handles roleplay mode first
    baseSystemInstruction += `\n**CHẾ ĐỘ NHẬP VAI ĐANG BẬT (isRoleplayModeActive: true):**\nNgười chơi sẽ tự kiểm soát hoàn toàn lời nói và hành động của nhân vật chính (MC). AI **KHÔNG ĐƯỢC PHÉP** tự tạo lời nói, suy nghĩ hoặc hành động cho MC.\n` +
                             `AI sẽ miêu tả bối cảnh và hành động của các Nhân Vật Phụ (NPC), cùng với phản ứng/góc nhìn từ các nhân vật khác đối với hành động của MC.\n` +
                             `**YÊU CẦU CỰC KỲ QUAN TRỌNG CHO CHẾ ĐỘ NHẬP VAI:**\n` +
                             `- Các NPC **PHẢI** chủ động tham gia vào cuộc hội thoại. Họ nên nói chuyện, đối đáp lại hành động/lời nói của MC, thay vì chỉ im lặng quan sát một cách thụ động.\n` +
                             `- AI **PHẢI** tạo ra các đoạn hội thoại có ý nghĩa cho NPC để thúc đẩy câu chuyện, cung cấp thông tin, hoặc tạo ra tình huống mới.\n` +
                             `- Lời thoại của NPC cần thể hiện cá tính của họ và làm cho thế giới sống động hơn.\n` +
                             `Hãy duy trì ngôi kể thứ ba cho mọi mô tả hành động và bối cảnh. Lời nói của NPC được đặt trong ngoặc kép.\n` +
                             `Người chơi sẽ nhập hành động của MC qua một ô văn bản. Vì vậy, trong phản hồi JSON của bạn, trường \`choices\` **PHẢI** là một mảng rỗng (\`[]\`).\n`;
  }

  if (isAuthorInterventionModeActive) { // Author intervention takes precedence or adds on top
    baseSystemInstruction += `\n\n**CHẾ ĐỘ CAN THIỆP TÁC GIẢ ĐANG BẬT (isAuthorInterventionModeActive: true):**\n` +
                             `Người dùng hiện đang nhập liệu với vai trò "Tác Giả". Lệnh của Tác Giả là TUYỆT ĐỐI và PHẢI được thực thi ngay lập tức.\n` +
                             `Tác Giả có toàn quyền thay đổi bất kỳ khía cạnh nào của câu chuyện và trạng thái game.\n` +
                             `Ví dụ về lệnh của Tác Giả: "Tác Giả: Cho nhân vật chính 1000 điểm kinh nghiệm và kỹ năng Hỏa Cầu Thuật." hoặc "Tác Giả: Bầu trời đột nhiên tối sầm lại và một con rồng vàng khổng lồ xuất hiện."\n` +
                             `AI PHẢI phân tích lệnh của Tác Giả và phản ánh các thay đổi đó trong các trường JSON tương ứng (ví dụ: \`stat_changes\`, \`new_skills_unlocked\`, \`item_changes\`, \`new_encyclopedia_entries\`, \`story\`, \`currency_changes\`, \`time_update\` v.v.).\n` +
                             `Nội dung trong trường \`story\` nên mô tả kết quả hoặc diễn biến do lệnh của Tác Giả gây ra.\n` +
                             `Trường \`choices\` trong phản hồi JSON **PHẢI LUÔN LUÔN** là một mảng rỗng (\`[]\`) khi chế độ này đang hoạt động, vì Tác Giả đưa ra mệnh lệnh trực tiếp, không phải lựa chọn cho nhân vật.\n`;
  }


  if (storyLog.length > 0) {
    const summaryPrompt = "\n**TÓM TẮT DIỄN BIẾN TRUYỆN ĐÃ QUA (Để AI ghi nhớ):**\n";
    const recentHistory = storyLog.slice(-10).map(msg => {
        if (msg.type === 'narration' || msg.type === 'event' || msg.type === 'author') return msg.content;
        if (msg.type === 'dialogue') return `${msg.characterName || 'NPC'}: "${msg.content}"`;
        if (msg.type === 'system' && msg.content.startsWith("Người chơi chọn:")) return msg.content;
        // Include system messages about AI auto-continue for context
        if (msg.type === 'system' && msg.content.includes("AI tự viết tiếp tình tiết")) return `(${msg.content})`;
        return '';
    }).filter(Boolean).join('\n');
    baseSystemInstruction += summaryPrompt + recentHistory;
  }
  
  // Replace the time system instruction section
  const timeSystemRegex = /\*\*11\. HỆ THỐNG THỜI GIAN \(NẾU ĐƯỢC KÍCH HOẠT\):\*\*[\s\S]*?(?=\n\n\*\*12\.|\n\n\*\*CHẾ ĐỘ NHẬP VAI|\n\n\*\*NGUYÊN TẮC CHUNG|$)/;
  const newTimeSystemInstruction = `**11. HỆ THỐNG THỜI GIAN (NẾU ĐƯỢC KÍCH HOẠT):**
   - Nếu hệ thống thời gian được kích hoạt (thông qua cờ \`timeSystemEnabled: true\` trong thiết lập), AI PHẢI:
     - **Khi bắt đầu câu chuyện mới:** Cung cấp thời gian bắt đầu trong trường \`initial_time\`. Định dạng: 'HH:MM Ngày DD, Tháng MM, Năm YYYY (Mô tả buổi, ví dụ: Bình minh, Trưa, Hoàng hôn, Nửa đêm)'. Ví dụ: '08:00 Ngày 1, Tháng Giêng, Năm Đại Việt thứ 10 (Buổi sáng trong lành)'.
     - **Trong quá trình chơi:**
       - AI PHẢI chủ động theo dõi và cập nhật thời gian trong trường \`time_update\` mỗi khi có hành động hoặc sự kiện làm thời gian trôi qua một cách hợp lý (ví dụ: một cuộc hành trình dài, một khoảng thời gian nghỉ ngơi, một trận chiến kéo dài).
       - **QUAN TRỌNG:** Nếu người chơi nhập một hành động có chứa thông tin thời gian cụ thể (ví dụ: "Tôi ngủ đến sáng hôm sau", "Vào năm 2013...", "Buổi tối hôm đó, tôi quyết định..."), AI PHẢI phân tích thông tin này và cố gắng phản ánh sự thay đổi thời gian đó trong trường \`time_update\`.
       - Mô tả sự thay đổi thời gian trong truyện nếu hợp lý (ví dụ: 'Sau một hồi tìm kiếm, trời đã về chiều.', 'Màn đêm buông xuống...', 'Thời gian thấm thoắt thoi đưa, đã là năm 2013.').
       - Định dạng thời gian trong \`time_update\` NÊN cố gắng giữ sự nhất quán với định dạng \`initial_time\` đã cung cấp, nhưng AI có thể linh hoạt nếu người chơi cung cấp thông tin không đầy đủ (ví dụ, nếu người chơi chỉ nói "Buổi tối", AI có thể cập nhật phần mô tả buổi trong chuỗi thời gian).`;

  baseSystemInstruction = baseSystemInstruction.replace(timeSystemRegex, newTimeSystemInstruction);


  return baseSystemInstruction;
}

function parseNewEncyclopediaEntries(entriesRaw: any): Entity[] {
    if (!Array.isArray(entriesRaw)) return [];
    return entriesRaw.map((entry: any, index: number) => ({
        id: entry.id || `temp-encyclopedia-${Date.now()}-${index}`,
        name: entry.name || "Không tên",
        type: Object.values(EntityType).includes(entry.type) ? entry.type : EntityType.Other,
        description: entry.description || "Không có mô tả."
    })).filter(e => e.name !== "Không tên");
}

function parseCharacterStats(statsRaw: any): CharacterStats | undefined {
  if (!statsRaw || typeof statsRaw !== 'object' || Array.isArray(statsRaw)) return undefined;
  const stats: CharacterStats = {};
  for (const key in statsRaw) {
    if (Object.prototype.hasOwnProperty.call(statsRaw, key)) {
      const rawStat = statsRaw[key];
      const id = rawStat.id || key;

      if (rawStat && typeof rawStat.name === 'string' && (typeof rawStat.value === 'number' || typeof rawStat.value === 'string')) {
        const attribute: CharacterAttribute = {
          id: id,
          name: rawStat.name,
          value: rawStat.value,
          description: typeof rawStat.description === 'string' ? rawStat.description : undefined,
          icon: typeof rawStat.icon === 'string' ? rawStat.icon : undefined,
          isProgressionStat: typeof rawStat.isProgressionStat === 'boolean' ? rawStat.isProgressionStat : (id === 'progression_level'),
        };
        if (typeof rawStat.maxValue === 'number') {
            attribute.maxValue = rawStat.maxValue;
        }
        stats[id] = attribute;
      }
    }
  }
  return Object.keys(stats).length > 0 ? stats : undefined;
}

function parseInventoryItems(itemsRaw: any): InventoryItem[] | undefined {
  if (!Array.isArray(itemsRaw)) return undefined;
  return itemsRaw.map((itemRaw: any) => {
    if (!itemRaw || typeof itemRaw.name !== 'string' || typeof itemRaw.quantity !== 'number') return null;

    const statBonuses: StatBonus[] = [];
    if (Array.isArray(itemRaw.statBonuses)) {
        itemRaw.statBonuses.forEach((bonus: any) => {
            if (bonus && typeof bonus.statId === 'string' && typeof bonus.value === 'number') {
                statBonuses.push({
                    statId: bonus.statId,
                    value: bonus.value,
                    isPercentage: typeof bonus.isPercentage === 'boolean' ? bonus.isPercentage : undefined,
                    appliesToMax: typeof bonus.appliesToMax === 'boolean' ? bonus.appliesToMax : undefined,
                });
            }
        });
    }

    const item: InventoryItem = {
      id: itemRaw.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: itemRaw.name,
      description: itemRaw.description || "Không có mô tả.",
      quantity: itemRaw.quantity,
      icon: itemRaw.icon,
      category: itemRaw.category,
      usable: typeof itemRaw.usable === 'boolean' ? itemRaw.usable : undefined,
      consumable: typeof itemRaw.consumable === 'boolean' ? itemRaw.consumable : undefined,
      effects: Array.isArray(itemRaw.effects) ? itemRaw.effects.map((eff: any) => ({
        statId: eff.statId,
        changeValue: eff.changeValue,
      })).filter((e:ItemEffect) => e.statId && typeof e.changeValue === 'number') as ItemEffect[] : undefined,
      equippable: typeof itemRaw.equippable === 'boolean' ? itemRaw.equippable : undefined,
      slot: Object.values(EquipmentSlot).includes(itemRaw.slot) ? itemRaw.slot : undefined,
      statBonuses: statBonuses.length > 0 ? statBonuses : undefined,
    };
    return item;
  }).filter(Boolean) as InventoryItem[];
}


function parseAchievements(achievementsRaw: any): Array<Omit<Achievement, 'id' | 'unlockedAt'>> | undefined {
    if (!Array.isArray(achievementsRaw)) return undefined;
    return achievementsRaw.map((achRaw: any) => {
        if (!achRaw || typeof achRaw.name !== 'string' || typeof achRaw.description !== 'string') return null;
        return {
            name: achRaw.name,
            description: achRaw.description,
            icon: achRaw.icon,
            isSecret: !!achRaw.isSecret,
        };
    }).filter(Boolean) as Array<Omit<Achievement, 'id' | 'unlockedAt'>>;
}

function generateStableIdFromName(name: string): string {
  if (!name) return `skill_unknown_${Date.now()}_${Math.random().toString(36).substring(2,7)}`;
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .substring(0, 50);
}

function parseSkills(skillsRaw: any): Skill[] | undefined {
  if (!Array.isArray(skillsRaw)) return undefined;
  return skillsRaw.map((skillRaw: any) => {
    if (!skillRaw || typeof skillRaw.name !== 'string') return null;
    const stableId = skillRaw.id || generateStableIdFromName(skillRaw.name);
    return {
      id: stableId,
      name: skillRaw.name,
      description: skillRaw.description || "Chưa có mô tả.",
      icon: skillRaw.icon || 'fas fa-book-sparkles',
      category: skillRaw.category || 'khác',
      proficiency: skillRaw.proficiency || "Sơ Nhập Môn",
      xp: typeof skillRaw.xp === 'number' ? skillRaw.xp : 0,
      xpToNextLevel: typeof skillRaw.xpToNextLevel === 'number' ? skillRaw.xpToNextLevel : 100,
      effects: skillRaw.effects || [],
    };
  }).filter(Boolean) as Skill[];
}

function parsePlayerChoices(choicesRaw: any): PlayerChoice[] {
    if (!Array.isArray(choicesRaw)) {
        return [];
    }
    return choicesRaw.map((choice: any, index: number) => {
        if (typeof choice === 'string') {
            return { id: `choice-${Date.now()}-${index}`, text: choice };
        } else if (typeof choice === 'object' && choice.text) {
            return { id: `choice-${Date.now()}-${index}`, text: choice.text, tooltip: choice.tooltip || undefined };
        }
        return { id: `choice-invalid-${Date.now()}-${index}`, text: "Lựa chọn không hợp lệ", tooltip: "Lỗi định dạng" };
    }).filter((c: PlayerChoice) => c.text !== "Lựa chọn không hợp lệ");
}

function parseRelationshipChanges(changesRaw: any): Array<{ npc_name: string; score_change?: number; new_status?: RelationshipStatus; reason?: string }> | undefined {
    if (!Array.isArray(changesRaw)) return undefined;
    return changesRaw.map((change: any) => {
        if (!change || typeof change.npc_name !== 'string') return null;
        return {
            npc_name: change.npc_name,
            score_change: typeof change.score_change === 'number' ? change.score_change : undefined,
            new_status: Object.values(RelationshipStatus).includes(change.new_status) ? change.new_status : undefined,
            reason: typeof change.reason === 'string' ? change.reason : undefined,
        };
    }).filter(Boolean) as Array<{ npc_name: string; score_change?: number; new_status?: RelationshipStatus; reason?: string }>;
}

function parseObjectives(objectivesRaw: any, isInitial: boolean = false): Array<Omit<Objective, 'id' | 'status'>> | undefined {
    if (!Array.isArray(objectivesRaw)) return undefined;
    return objectivesRaw.map((objRaw: any) => {
        if (!objRaw || typeof objRaw.title !== 'string' || typeof objRaw.description !== 'string') return null;
        const objective: Partial<Omit<Objective, 'id' | 'status'>> & { isPlayerGoal?: boolean } = {
            title: objRaw.title,
            description: objRaw.description,
            subObjectives: Array.isArray(objRaw.subObjectives) ? objRaw.subObjectives.filter(s => typeof s === 'string') : undefined,
            rewardPreview: typeof objRaw.rewardPreview === 'string' ? objRaw.rewardPreview : undefined,
        };
        if (isInitial && typeof objRaw.isPlayerGoal === 'boolean') {
            objective.isPlayerGoal = objRaw.isPlayerGoal;
        }
        return objective;
    }).filter(Boolean) as Array<Omit<Objective, 'id' | 'status'>>;
}


function parseInitialRelationships(relationshipsRaw: any): Array<Partial<NPCProfile>> | undefined {
    if (!Array.isArray(relationshipsRaw)) return undefined;
    return relationshipsRaw.map((relRaw: any) => {
        if (!relRaw || typeof relRaw.name !== 'string') return null;
        return {
            id: relRaw.id || `npc-${generateStableIdFromName(relRaw.name)}`,
            name: relRaw.name,
            status: Object.values(RelationshipStatus).includes(relRaw.status) ? relRaw.status : RelationshipStatus.Neutral,
            score: typeof relRaw.score === 'number' ? relRaw.score : 0,
            description: relRaw.description,
            known: typeof relRaw.known === 'boolean' ? relRaw.known : true,
        };
    }).filter(Boolean) as Array<Partial<NPCProfile>>;
}

function parseInitialCurrency(currencyRaw: any): { name: string; amount: number; icon?: string } | undefined {
    if (!currencyRaw || typeof currencyRaw.name !== 'string' || typeof currencyRaw.amount !== 'number') {
        return undefined;
    }
    return {
        name: currencyRaw.name,
        amount: currencyRaw.amount,
        icon: typeof currencyRaw.icon === 'string' ? currencyRaw.icon : 'fas fa-coins',
    };
}


export async function generateInitialStory(
  apiKeyFromArgs: string, 
  useDefaultAPI: boolean,
  world: WorldSetup,
  character: CharacterSetup,
  initialEntities: Entity[],
  nsfw: NSFWPreferences,
  settings: Pick<Settings, 'currencyEnabled' | 'timeSystemEnabled' | 'reputationSystemEnabled'>
): Promise<{
  story: StoryMessage;
  choices: PlayerChoice[];
  newEntries?: Entity[];
  initialStats?: CharacterStats;
  initialInventory?: InventoryItem[];
  initialSkills?: Skill[];
  newlyUnlockedAchievements?: Array<Omit<Achievement, 'id' | 'unlockedAt'>>;
  initialRelationships?: Array<Partial<NPCProfile>>;
  initialObjectives?: Array<Omit<Objective, 'id'|'status'>>;
  initialCurrency?: { name: string; amount: number; icon?: string };
  initialTime?: string;
}> {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);

  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");

  const systemPrompt = getSystemPrompt(
    world, character, initialEntities, [], nsfw, null, 
    undefined, undefined, undefined, undefined, undefined, {}, [], 
    false, false,
    settings.currencyEnabled, undefined, // No current currency/time for initial story
    settings.timeSystemEnabled, undefined,
    settings.reputationSystemEnabled
  );
  
  let userPrompt = `Hãy bắt đầu câu chuyện, tập trung vào hành trình của nhân vật chính ${character.name}.
Yêu cầu cụ thể:
*   Bắt đầu bằng một tình huống làm nổi bật hoàn cảnh hiện tại của MC.
*   Nhanh chóng giới thiệu một mâu thuẫn hoặc cơ hội đầu tiên.
*   Cung cấp \`initial_stats\` **phù hợp và ngẫu nhiên** dựa trên thiết lập thế giới và nhân vật (bao gồm \`icon\` Font Awesome cho mỗi chỉ số), \`initial_inventory\` (bao gồm trang bị nếu có, với các trường \`equippable\`, \`slot\`, \`statBonuses\`, và \`icon\` Font Awesome), \`initial_skills\` (bao gồm \`icon\` Font Awesome).`;

  if (settings.currencyEnabled) {
    userPrompt += `\n*   Cung cấp \`initial_currency\` (bao gồm \`name\`, \`amount\`, và \`icon\` Font Awesome) phù hợp với thế giới.`;
  }
  if (settings.timeSystemEnabled) {
    userPrompt += `\n*   Cung cấp \`initial_time\` theo định dạng 'HH:MM Ngày DD, Tháng MM, Năm YYYY (Mô tả buổi)'.`;
  }

  userPrompt += `
*   Nếu có NPC quan trọng hoặc thân nhân (ví dụ: cha mẹ, sư phụ, anh chị em ruột thịt), cung cấp \`initial_relationships\` **VỚI TRẠNG THÁI VÀ ĐIỂM SỐ PHÙ HỢP (ví dụ: cha mẹ NÊN có status "Thân Thiện" hoặc "Hòa Hảo", điểm số từ 30-70 tùy theo mô tả ban đầu)** và mô tả họ trong \`new_encyclopedia_entries\`. Các NPC khác chưa quen biết có thể khởi đầu ở "Trung Lập". **Đảm bảo tất cả NPC ban đầu đã biết đều có trong initial_relationships.**
*   Cung cấp \`initial_objectives\`, trong đó mục tiêu chính của nhân vật (\`${character.goal}\`) nên là một objective với \`isPlayerGoal: true\`.
*   Thêm các thực thể mới (bao gồm cả cảnh giới tu luyện nếu được đề cập) vào "new_encyclopedia_entries".
*   Nếu có thành tựu mở khóa, thêm vào "newly_unlocked_achievements".
*   Đưa ra 3-4 lựa chọn hành động cho người chơi.
*   Trả lời JSON theo cấu trúc. Đối tượng JSON phải CHỈ chứa các trường sau: story (bắt buộc), choices (bắt buộc), và các trường tùy chọn sau NẾU CÓ: initial_stats, initial_inventory, initial_skills, new_encyclopedia_entries, newly_unlocked_achievements, initial_relationships, initial_objectives${settings.currencyEnabled ? ', initial_currency' : ''}${settings.timeSystemEnabled ? ', initial_time' : ''}. TUYỆT ĐỐI KHÔNG thêm bất kỳ trường nào khác.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{text: userPrompt}] }],
    config: { systemInstruction: systemPrompt, responseMimeType: "application/json" }
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) { jsonStr = match[2].trim(); }

  try {
    const parsedData: InitialStoryAIData = JSON.parse(jsonStr);
    const storyText = parsedData.story || "Lỗi: AI không trả về nội dung truyện.";
    const choices = parsePlayerChoices(parsedData.choices);

    return {
      story: { id: `story-${Date.now()}`, type: "narration", content: storyText, timestamp: new Date().toISOString() },
      choices: choices,
      newEntries: parseNewEncyclopediaEntries(parsedData.new_encyclopedia_entries),
      initialStats: parseCharacterStats(parsedData.initial_stats),
      initialInventory: parseInventoryItems(parsedData.initial_inventory),
      initialSkills: parseSkills(parsedData.initial_skills),
      newlyUnlockedAchievements: parseAchievements(parsedData.newly_unlocked_achievements),
      initialRelationships: parseInitialRelationships(parsedData.initial_relationships),
      initialObjectives: parseObjectives(parsedData.initial_objectives, true) as Array<Omit<Objective, 'id'|'status'>> | undefined,
      initialCurrency: settings.currencyEnabled ? parseInitialCurrency(parsedData.initial_currency) : undefined,
      initialTime: settings.timeSystemEnabled ? parsedData.initial_time : undefined,
    };
  } catch (e) {
    console.error("Failed to parse JSON response for initial story:", e, "\nRaw response:", response.text);
    const storyPartMatch = response.text.match(/"story"\s*:\s*"(.*?)"/s);
    const storyText = storyPartMatch && storyPartMatch[1] ? storyPartMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "AI không thể tạo câu chuyện ban đầu. Vui lòng thử lại.";
     return {
      story: { id: `story-${Date.now()}`, type: "narration", content: storyText, timestamp: new Date().toISOString() },
      choices: [],
    };
  }
}

export interface NextStorySegmentResult {
  story: StoryMessage;
  choices: PlayerChoice[];
  updatedSummary?: string;
  newEntries?: Entity[];
  statChanges?: StatChange[];
  itemChanges?: { gained?: InventoryItem[]; lost?: Array<{ id: string; quantity: number } | { name: string; quantity: number }> };
  skillChanges?: SkillChange[];
  newSkillsUnlocked?: Skill[];
  newlyUnlockedAchievements?: Array<Omit<Achievement, 'id' | 'unlockedAt'>>;
  relationshipChanges?: Array<{ npc_name: string; score_change?: number; new_status?: RelationshipStatus; reason?: string }>;
  newObjectivesSuggested?: Array<Omit<Objective, 'id' | 'status' | 'isPlayerGoal'>>;
  objectiveUpdates?: Array<{ objective_id_or_title: string; new_status: 'completed' | 'failed'; reason?: string }>;
  currencyChanges?: { change_value?: number; new_amount?: number; reason?: string };
  timeUpdate?: string;
}


export async function generateNextStorySegment(
  apiKeyFromArgs: string,
  useDefaultAPI: boolean,
  gameState: GameState,
  playerAction: string,
  nsfw: NSFWPreferences,
  settings: Pick<Settings, 'currencyEnabled' | 'timeSystemEnabled' | 'reputationSystemEnabled'>
): Promise<NextStorySegmentResult> {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);

  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");

  const { 
      setup, storyLog, currentWorldEvent, encyclopedia, characterStats, inventory, equippedItems, 
      unlockedAchievements, characterSkills, npcRelationships, objectives, isRoleplayModeActive, 
      isAuthorInterventionModeActive, currency, currentTime 
  } = gameState;

  const systemPrompt = getSystemPrompt(
    setup.world, setup.character, encyclopedia, storyLog, nsfw, currentWorldEvent, 
    characterStats, inventory, equippedItems, unlockedAchievements, characterSkills, 
    npcRelationships, objectives, isRoleplayModeActive, isAuthorInterventionModeActive,
    settings.currencyEnabled, currency,
    settings.timeSystemEnabled, currentTime,
    settings.reputationSystemEnabled
  );

  let userPrompt = "";
  if (playerAction === "AI_AUTO_CONTINUE_STORY") {
    userPrompt = `AI được yêu cầu tự động viết tiếp câu chuyện.
Hãy phát triển tình tiết một cách tự nhiên và hợp lý dựa trên bối cảnh hiện tại, mục tiêu của nhân vật ${setup.character.name}, các sự kiện đang diễn ra, và các yếu tố khác trong game.
Nếu không ở Chế Độ Nhập Vai hoặc Can Thiệp Tác Giả, hãy cung cấp 3-4 lựa chọn hành động mới cho người chơi sau khi mô tả diễn biến.
Mô tả hành động, suy nghĩ của nhân vật chính (trừ khi Chế độ Nhập Vai đang BẬT, lúc đó chỉ tập trung vào NPC và thế giới).
Cập nhật tất cả các trường JSON cần thiết (ví dụ: \`stat_changes\`, \`item_changes\`, \`skill_changes\`, \`new_encyclopedia_entries\`, \`relationship_changes\`, \`currency_changes\`, \`time_update\` v.v.) nếu có thay đổi.
**ĐẢM BẢO TÍNH MỚI MẺ TRONG NỘI DUNG TRUYỆN (\`story\`):** AI PHẢI tạo ra nội dung \`story\` hoàn toàn MỚI, không lặp lại các câu văn, đoạn văn, hoặc mô tả tình huống từ các lượt trước. Tập trung vào việc phát triển câu chuyện và giới thiệu các diễn biến, thông tin, hoặc phản ứng mới của thế giới/NPC.
Trả lời JSON theo cấu trúc. Đối tượng JSON phải CHỈ chứa các trường sau: story (bắt buộc), choices (bắt buộc), và các trường tùy chọn sau NẾU CÓ THAY ĐỔI: stat_changes, item_changes, skill_changes, new_skills_unlocked, new_encyclopedia_entries, summary_update, newly_unlocked_achievements, relationship_changes, new_objectives_suggested, objective_updates${settings.currencyEnabled ? ', currency_changes' : ''}${settings.timeSystemEnabled ? ', time_update' : ''}. TUYỆT ĐỐI KHÔNG thêm bất kỳ trường nào khác.`;
  } else if (isAuthorInterventionModeActive) {
    userPrompt = `Tác Giả: "${playerAction}".
Hãy thực hiện lệnh này của Tác Giả một cách chính xác.
QUAN TRỌNG: Mô tả kết quả và các thay đổi trong trường 'story' PHẢI SÁNG TẠO VÀ KHÔNG LẶP LẠI. Kể cả khi lệnh của Tác Giả tương tự như lệnh trước, hãy tìm cách diễn đạt hậu quả một cách mới mẻ, sử dụng từ ngữ và chi tiết khác biệt. Câu chuyện phải cảm thấy như đang tiến triển, không chỉ là lặp lại mô tả.
Cập nhật tất cả các trường JSON cần thiết (\`stat_changes\`, \`item_changes\`, \`skill_changes\`, \`new_skills_unlocked\`, \`new_encyclopedia_entries\`, \`summary_update\`, \`newly_unlocked_achievements\`, \`relationship_changes\`, \`new_objectives_suggested\`, \`objective_updates\`${settings.currencyEnabled ? ', `currency_changes`' : ''}${settings.timeSystemEnabled ? ', `time_update`' : ''}).
Trường 'choices' PHẢI là một mảng rỗng.`;
  } else if (isRoleplayModeActive) {
    userPrompt = `Nhân vật chính (${setup.character.name}) thực hiện hành động/nói: "${playerAction}". Hãy miêu tả phản ứng của thế giới và các NPC. **QUAN TRỌNG: Các NPC NÊN chủ động nói chuyện, đối đáp với hành động/lời nói của nhân vật chính. Hãy tạo ra các đoạn hội thoại có ý nghĩa cho NPC để thúc đẩy câu chuyện.** KHÔNG tạo lời nói hay hành động cho nhân vật chính. Cung cấp mảng \`choices\` rỗng.
Cập nhật các trường JSON cần thiết nếu có thay đổi (ví dụ: \`currency_changes\` nếu có giao dịch, \`time_update\` nếu thời gian trôi qua${settings.timeSystemEnabled ? ' hoặc nếu người chơi đề cập đến thời gian cụ thể trong hành động của họ' : ''}).`;
  } else {
    userPrompt = `Người chơi chọn hành động: "${playerAction}".`;
    if (playerAction.startsWith("Người chơi đã trang bị") || playerAction.startsWith("Người chơi đã tháo bỏ")) {
        userPrompt = playerAction + "\nClient đã xử lý việc thay đổi trang bị. AI KHÔNG CẦN mô tả lại hành động này và KHÔNG cung cấp \`stat_changes\` cho việc này.";
    } else {
      userPrompt += `
Nếu hành động là người chơi sử dụng vật phẩm, hãy mô tả kết quả.
Nếu hành động là "Tập Trung Nâng Cấp", mô tả quá trình và cung cấp \`stat_changes\` cho \`spiritual_qi\`.
Nếu hành động là "Thử Thách Thăng Tiến", mô tả kết quả và cập nhật \`progression_level\`, \`spiritual_qi\` qua \`stat_changes\`.
Nếu hành động là "vứt bỏ [Tên Vật Phẩm]" hoặc tương tự, hãy xác nhận việc mất vật phẩm trong \`item_changes.lost\`.
Nếu hành động là "quên kỹ năng [Tên Kỹ Năng]" hoặc tương tự, hãy xác nhận trong \`skill_changes\`.
Trong chiến đấu, mô tả diễn biến, ảnh hưởng của chỉ số và kỹ năng.
Khi có cơ hội nhặt vật phẩm, hãy tuân thủ cơ chế loot dựa trên chỉ số May Mắn đã được mô tả trong system prompt. Mô tả việc tìm thấy trong \`story\` và trả về chi tiết trong \`item_changes.gained\`.
Nếu diễn biến truyện hoặc hành động của người chơi dẫn đến thay đổi chỉ số một cách hợp lý (ví dụ: luyện hóa thành công một loại đan dược, nhận được sự gia trì từ một thực thể mạnh mẽ), hãy cung cấp \`stat_changes\`.

**ĐẢM BẢO TÍNH MỚI MẺ TRONG NỘI DUNG TRUYỆN (\`story\`):** AI PHẢI tạo ra nội dung \`story\` hoàn toàn MỚI, không lặp lại các câu văn, đoạn văn, hoặc mô tả tình huống từ các lượt trước (có trong "TÓM TẮT DIỄN BIẾN TRUYỆN ĐÃ QUA" mà bạn đã nhận được trong system prompt). Tập trung vào việc phát triển câu chuyện dựa trên hành động "${playerAction}" và giới thiệu các diễn biến, thông tin, hoặc phản ứng mới của thế giới/NPC. Câu chuyện phải tiến triển, không đứng yên.

Tiếp tục câu chuyện. Nếu HP về 0, mô tả cái chết, \`choices\` rỗng.
Cung cấp lựa chọn mới (trừ khi Roleplay Mode BẬT hoặc MC chết).
Cung cấp \`stat_changes\`, \`item_changes\` (bao gồm cả trang bị với \`equippable\`, \`slot\`, \`statBonuses\`, và \`icon\` Font Awesome), \`skill_changes\`, \`new_skills_unlocked\` (bao gồm \`icon\` Font Awesome), \`new_encyclopedia_entries\` (bao gồm cảnh giới tu luyện nếu được mô tả), \`newly_unlocked_achievements\`, \`summary_update\` khi cần.
**Rất quan trọng: Cung cấp \`relationship_changes\` CHI TIẾT nếu hành động của người chơi hoặc diễn biến truyện ảnh hưởng đến NPC, hoặc nếu NPC mới được giới thiệu. Đây là một đầu ra ưu tiên cao.**
Quan trọng: Cung cấp \`new_objectives_suggested\` hoặc \`objective_updates\` nếu có liên quan đến mục tiêu/nhiệm vụ.
${settings.currencyEnabled ? 'Cung cấp `currency_changes` nếu có giao dịch hoặc thay đổi tiền tệ.' : ''}
${settings.timeSystemEnabled ? 'Nếu người chơi đề cập đến thời gian trong hành động của họ (ví dụ: "năm 2013", "ngày mai", "buổi tối"), hãy phân tích và cập nhật `time_update` cho phù hợp. Nếu không, hãy ước lượng thời gian trôi qua dựa trên hành động và cập nhật `time_update`.' : ''}
Trả lời JSON theo cấu trúc. Đối tượng JSON phải CHỈ chứa các trường sau: story (bắt buộc), choices (bắt buộc), và các trường tùy chọn sau NẾU CÓ THAY ĐỔI: stat_changes, item_changes, skill_changes, new_skills_unlocked, new_encyclopedia_entries, summary_update, newly_unlocked_achievements, relationship_changes, new_objectives_suggested, objective_updates${settings.currencyEnabled ? ', currency_changes' : ''}${settings.timeSystemEnabled ? ', time_update' : ''}. TUYỆT ĐỐI KHÔNG thêm bất kỳ trường nào khác.`;
    }
  }


  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{text: userPrompt}] }],
    config: { systemInstruction: systemPrompt, responseMimeType: "application/json" }
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) { jsonStr = match[2].trim(); }

  try {
    const parsedData: NextStoryAIData = JSON.parse(jsonStr);
    const storyText = parsedData.story || "Lỗi: AI không trả về nội dung truyện tiếp theo.";
    const choices = parsePlayerChoices(parsedData.choices);
    let finalItemChanges;
    if (parsedData.item_changes) {
        finalItemChanges = {
            gained: parseInventoryItems(parsedData.item_changes.gained),
            lost: parsedData.item_changes.lost
        }
    }
    
    const messageType = isAuthorInterventionModeActive ? "author" : "narration";

    return {
      story: { id: `story-${Date.now()}`, type: messageType, content: storyText, timestamp: new Date().toISOString() },
      choices: choices,
      updatedSummary: parsedData.summary_update,
      newEntries: parseNewEncyclopediaEntries(parsedData.new_encyclopedia_entries),
      statChanges: parsedData.stat_changes,
      itemChanges: finalItemChanges,
      skillChanges: parsedData.skill_changes,
      newSkillsUnlocked: parseSkills(parsedData.new_skills_unlocked),
      newlyUnlockedAchievements: parseAchievements(parsedData.newly_unlocked_achievements),
      relationshipChanges: parseRelationshipChanges(parsedData.relationship_changes),
      newObjectivesSuggested: parseObjectives(parsedData.new_objectives_suggested, false) as Array<Omit<Objective, 'id' | 'status' | 'isPlayerGoal'>> | undefined,
      objectiveUpdates: parsedData.objective_updates,
      currencyChanges: settings.currencyEnabled ? parsedData.currency_changes : undefined,
      timeUpdate: settings.timeSystemEnabled ? parsedData.time_update : undefined,
    };
  } catch (e) {
    console.error("Failed to parse JSON response for next story segment:", e, "\nRaw response:", response.text);
    const storyPartMatch = response.text.match(/"story"\s*:\s*"(.*?)"/s);
    const storyText = storyPartMatch && storyPartMatch[1] ? storyPartMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "AI không thể tiếp tục câu chuyện. Vui lòng thử lại.";
    return {
      story: { id: `story-${Date.now()}`, type: "narration", content: storyText, timestamp: new Date().toISOString() },
      choices: [],
    };
  }
}

export async function generateRandomWithAI(
  apiKeyFromArgs: string,
  useDefaultAPI: boolean,
  promptType: "theme" | "context" | "tone" | "charName" | "charSummary" | "charGoal" | "traitSuggestion" | "entitySuggestion" | "worldEvent" | "skillSuggestion",
  currentData?: any
): Promise<string | string[] | Array<{name: string, description: string}> | Partial<Skill>> {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);

  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");

  let userPrompt = "";
  let expectMultiple = false;
  let expectTraitObjects = false;
  let expectObject = false;
  let expectSkillObject = false;

  switch (promptType) {
    case "theme":
      userPrompt = "Tạo 3-5 gợi ý chủ đề độc đáo cho một thế giới truyện nhập vai kiểu tiểu thuyết mạng Trung Quốc. Mỗi chủ đề cần ngắn gọn (dưới 10 từ). Trả lời dưới dạng danh sách JSON array của strings.";
      expectMultiple = true;
      break;
    case "context":
      userPrompt = `Dựa trên chủ đề "${currentData?.theme || "Tiên hiệp"}", hãy tạo 3-5 gợi ý bối cảnh (khoảng 1-2 câu mỗi bối cảnh) cho truyện. Trả lời dưới dạng danh sách JSON array của strings.`;
      expectMultiple = true;
      break;
    case "tone":
      userPrompt = `Gợi ý 3-5 phong cách/giọng văn (ví dụ: Hài hước đen tối, Sử thi bi tráng, Lãng mạn kỳ ảo) cho một câu chuyện dựa trên chủ đề "${currentData?.theme || "Huyền ảo"}". Trả lời dưới dạng danh sách JSON array của strings.`;
      expectMultiple = true;
      break;
    case "charName":
      userPrompt = `Gợi ý 5 tên nhân vật chính (MC) phù hợp với thế giới có chủ đề "${currentData?.worldTheme || "Tiên hiệp"}" và bối cảnh "${currentData?.worldContext || "Một thế giới tu tiên rộng lớn"}". Tên nên có phong cách Trung Quốc hoặc phù hợp với bối cảnh. Trả lời dưới dạng danh sách JSON array của strings.`;
      expectMultiple = true;
      break;
    case "charSummary":
      userPrompt = `Dựa trên tên "${currentData?.charName || "Lâm Phàm"}", giới tính "${currentData?.charGender || "Nam"}", trong thế giới chủ đề "${currentData?.worldTheme || "Tiên hiệp"}", hãy viết một sơ lược (ngoại hình, tính cách, nguồn gốc - khoảng 3-5 câu) cho nhân vật này. Trả lời dưới dạng một JSON object với key "summary" và value là string.`;
      expectObject = true;
      break;
    case "charGoal":
       userPrompt = `Với nhân vật ${currentData?.charName || "MC"} có sơ lược: "${currentData?.charSummary || "Một thiếu niên bình thường tình cờ nhặt được bí kíp võ công."}", hãy gợi ý 3 mục tiêu/động lực chính cho nhân vật này trong một câu chuyện tiểu thuyết mạng. Trả lời dưới dạng danh sách JSON array của strings.`;
       expectMultiple = true;
      break;
    case "traitSuggestion":
        userPrompt = `Nhân vật ${currentData?.charName || 'MC'} (Sơ lược: ${currentData?.charSummary || 'chưa có'}) trong thế giới chủ đề ${currentData?.worldTheme || 'chưa rõ'}. Gợi ý 3 đặc điểm (có thể là thiên phú, kỹ năng đặc biệt, hoặc một vật phẩm khởi đầu độc đáo). Mỗi đặc điểm cần có tên (ngắn gọn, hấp dẫn) và mô tả (1-2 câu, giải thích rõ tác dụng/ý nghĩa). Trả lời dưới dạng một JSON array các object, mỗi object có dạng: {"name": "Tên Đặc Điểm", "description": "Mô tả Đặc Điểm"}.`;
        expectMultiple = true;
        expectTraitObjects = true;
        break;
    case "entitySuggestion":
        userPrompt = `Trong thế giới ${currentData?.worldTheme || 'chưa rõ'}, cho loại thực thể ${currentData?.entityType || EntityType.NPC}. Gợi ý tên và mô tả chi tiết cho 1 thực thể này. Mô tả nên bao gồm các chi tiết thú vị, phù hợp với loại thực thể và bối cảnh. Nếu là cảnh giới tu luyện (type: "Khác"), hãy mô tả đặc điểm của cảnh giới đó. Trả lời dạng JSON object: {"name": "Tên Thực Thể", "description": "Mô tả chi tiết..."}.`;
        expectObject = true;
        break;
    case "worldEvent":
        userPrompt = `Tạo một sự kiện thế giới cho câu chuyện đang diễn ra. Thông tin hiện tại: ${JSON.stringify(currentData?.storyContext)}. Yêu cầu: Loại sự kiện ${currentData?.eventType}, phạm vi ${currentData?.eventScope}, từ khóa gợi ý "${currentData?.keywords || 'không có'}". Sự kiện cần có tên, mô tả, các yếu tố chính (NPC, vật phẩm, địa điểm liên quan nếu có) và trạng thái là "active". Trả lời dưới dạng JSON object: {"name": "...", "description": "...", "keyElements": ["..."], "status": "active"}.`;
        expectObject = true;
        break;
    case "skillSuggestion":
        userPrompt = `Dựa trên thế giới có chủ đề "${currentData?.worldTheme || "Tiên hiệp"}" và nhân vật ${currentData?.charName || "MC"}, gợi ý MỘT kỹ năng khởi đầu phù hợp. Kỹ năng cần có \`name\`, \`id\` (một chuỗi không dấu, viết thường, nối bằng gạch dưới, ví dụ: "kiem_phap_so_cap"), \`description\` (mô tả ban đầu cho cấp Sơ Nhập Môn), \`category\` (ví dụ: 'chiến đấu', 'chế tạo', 'phép thuật'), \`icon\` (Font Awesome class, ví dụ "fas fa-sword"). Trả lời dưới dạng một JSON object duy nhất chứa các trường này. Ví dụ: {"id": "kiem_phap_so_cap", "name": "Kiếm Pháp Sơ Cấp", "description": "Những đường kiếm cơ bản nhất.", "category": "chiến đấu", "icon": "fas fa-khanda"}. Đặt proficiency mặc định là "Sơ Nhập Môn", xp là 0, xpToNextLevel là 100.`;
        expectSkillObject = true;
        break;
    default:
      return "Loại prompt không hợp lệ";
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{text: userPrompt}] }],
    config: { responseMimeType: "application/json" }
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) { jsonStr = match[2].trim(); }

  try {
    const parsedData = JSON.parse(jsonStr);
    if (expectSkillObject) {
        if (parsedData && typeof parsedData.name === 'string') {
            if (!parsedData.id && parsedData.name) {
                parsedData.id = generateStableIdFromName(parsedData.name);
            }
            return parsedData as Partial<Skill>;
        }
        console.warn("Skill suggestion format incorrect:", parsedData);
        return { name: "Lỗi Kỹ Năng", description: "AI không trả về đúng định dạng.", id: `error_skill_${Date.now()}`};
    }
    if (expectTraitObjects) {
        if(Array.isArray(parsedData) && parsedData.every(item => typeof item === 'object' && item.name && item.description)) {
            return parsedData as Array<{name: string, description: string}>;
        } else {
            if(typeof parsedData === 'object' && parsedData.name && parsedData.description){
                return [parsedData] as Array<{name: string, description: string}>;
            }
            console.warn("Trait suggestion format incorrect, expected array of objects:", parsedData);
            return [{name: "Lỗi định dạng", description: "AI không trả về đúng định dạng cho đặc điểm."}];
        }
    }
    if (expectMultiple) { return parsedData as string[]; }
    if (expectObject) {
      if (promptType === "charSummary" && typeof parsedData.summary === 'string') return parsedData.summary;
      if (promptType === "entitySuggestion" || promptType === "worldEvent") return JSON.stringify(parsedData);
      return JSON.stringify(parsedData);
    }
    if(typeof parsedData === 'string') return parsedData;
    if(parsedData && typeof parsedData.result === 'string') return parsedData.result;
    return "Dữ liệu trả về không đúng định dạng mong muốn.";
  } catch (e) {
    console.error("Failed to parse JSON for AI suggestion:", e, "\nRaw response:", response.text);
    if (!expectMultiple && !expectTraitObjects && !expectObject && !expectSkillObject && typeof response.text === 'string' && response.text.length < 200) return response.text;
    return `Lỗi khi tạo gợi ý.`;
  }
}

export async function generateEntitiesFromText(
  apiKeyFromArgs: string,
  useDefaultAPI: boolean,
  text: string,
  worldTheme?: string
): Promise<Array<Omit<Entity, 'id'>>> {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");

  const entityTypesString = Object.values(EntityType).join('", "');
  const userPrompt = `
Phân tích đoạn văn bản sau đây để trích xuất các thực thể (NPC, Vật phẩm, Địa điểm, Tổ chức, Khác) cho một trò chơi nhập vai.
Thế giới có chủ đề chính là: "${worldTheme || 'Không xác định'}". Hãy cố gắng phân loại các thực thể dựa trên ngữ cảnh này.
Đặc biệt, nếu có đề cập đến các cảnh giới tu luyện, cấp độ, hoặc các khái niệm trừu tượng quan trọng có mô tả, hãy trích xuất chúng với type là "Khác".
Văn bản cần phân tích:
---
${text}
---
Yêu cầu định dạng trả lời là một JSON array. Mỗi object trong array phải có các key: "name", "type" (phải là một trong: "${entityTypesString}"), "description".
Nếu không tìm thấy, trả về array rỗng []. Chỉ trả về JSON array.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { responseMimeType: "application/json" }
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) { jsonStr = match[2].trim(); }
  try {
    const parsedData = JSON.parse(jsonStr);
    if (Array.isArray(parsedData)) {
      return parsedData.filter(
        (item: any) => item.name && item.description && typeof item.name === 'string' && typeof item.description === 'string' && Object.values(EntityType).includes(item.type)
      ).map(item => ({name: item.name, type: item.type, description: item.description})) as Array<Omit<Entity, 'id'>>;
    }
    return [];
  } catch (e) { console.error("Failed to parse JSON for entity extraction:", e); return []; }
}


export async function generateStorySummary(
  apiKeyFromArgs: string,
  useDefaultAPI: boolean,
  storyLog: StoryMessage[]
): Promise<string> {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");

  const fullStoryText = storyLog.map(msg => {
    if (msg.type === 'narration' || msg.type === 'event' || msg.type === 'author') return msg.content;
    if (msg.type === 'dialogue') return `${msg.characterName || 'NPC'}: "${msg.content}"`;
    if (msg.type === 'system' && msg.content.startsWith("Người chơi chọn:")) return `(${msg.content})`;
    if (msg.type === 'system' && msg.content.includes("AI tự viết tiếp tình tiết")) return `(AI tự động tiếp tục câu chuyện)`;
    return '';
  }).filter(Boolean).join('\n\n');

  if (fullStoryText.length < 100) return "Câu chuyện còn quá ngắn để tóm tắt.";

  const userPrompt = `Dựa trên toàn bộ diễn biến câu chuyện sau đây, hãy viết một bản tóm tắt cốt truyện chính từ đầu đến hiện tại. Tập trung vào các sự kiện quan trọng, sự phát triển của nhân vật chính và các mâu thuẫn lớn.
Bản tóm tắt nên mạch lạc, dễ hiểu và không quá dài (khoảng 200-300 từ). Trả lời chỉ bằng nội dung tóm tắt, không thêm lời dẫn.
Toàn bộ câu chuyện:
${fullStoryText}
Bắt đầu tóm tắt:`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{text: userPrompt}] }],
  });
  return response.text.trim();
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  try {
    const tempAiValidator = new GoogleGenAI({ apiKey });
    await tempAiValidator.models.generateContent({model: GEMINI_TEXT_MODEL, contents: [{role: "user", parts: [{text: "Test API Key"}]}] });
    return true;
  } catch (error) {
    console.warn("API Key validation failed:", error);
    return false;
  }
}


export async function extractFullStorySetupFromText(
  apiKeyFromArgs: string,
  useDefaultAPI: boolean,
  userText: string
): Promise<AIExtractedSetupData> {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");

  const skillCategoriesString = ['chiến đấu', 'chế tạo', 'sinh tồn', 'phép thuật', 'hỗ trợ', 'khác'].join('", "');
  const entityTypesString = Object.values(EntityType).join('", "');

  const userPrompt = `
Phân tích đoạn văn bản sau đây để trích xuất thông tin thiết lập cho một trò chơi nhập vai.
Văn bản:
---
${userText}
---
Yêu cầu định dạng trả lời là một JSON object duy nhất. JSON object này phải CHỈ chứa các key sau (nếu có thông tin):
- "story_setup_name": string (tên chung cho thiết lập này)
- "world_setup": object (
    "theme": string,
    "context": string,
    "tone": string (một trong số: "Hài hước", "Nghiêm túc", "Kỳ ảo", "Kinh dị", "Lãng mạn", "Sử thi", hoặc một giá trị tùy chỉnh),
    "advanced_prompt": string (bất kỳ thông tin bổ sung nào về thế giới không thuộc các mục trên, có thể là toàn bộ userText nếu phù hợp)
  )
- "character_setup": object (
    "name": string,
    "gender": string (một trong số: "Nam", "Nữ", "Khác", "AI quyết định"),
    "summary": string (sơ lược về nhân vật),
    "traits_raw": array of strings (mỗi string là "Tên Đặc Điểm: Mô tả"),
    "goal": string (mục tiêu chính của nhân vật),
    "initial_skills_raw": array of strings (mỗi string là "Tên Kỹ Năng: Mô tả (Loại: [một trong: ${skillCategoriesString}], Icon: [font awesome class])")
  )
- "entities_raw": array of objects (mỗi object có dạng {"name": string, "type": string (một trong: "${entityTypesString}"), "description": string})

Nếu không tìm thấy thông tin cho một key nào đó, hãy bỏ qua key đó hoặc trả về giá trị mặc định (ví dụ: array rỗng).
LƯU Ý QUAN TRỌNG:
- Với "traits_raw", mỗi phần tử PHẢI là một chuỗi có định dạng "Tên Đặc Điểm: Mô tả".
- Với "initial_skills_raw", mỗi phần tử PHẢI là một chuỗi có định dạng "Tên Kỹ Năng: Mô tả (Loại: ..., Icon: ...)".
- Với "world_setup.advanced_prompt", nếu không có thông tin cụ thể nào được trích xuất cho theme, context, tone thì có thể đưa toàn bộ userText vào đây nếu nó phù hợp làm mô tả chung.
Chỉ trả về JSON object. Không bao gồm markdown fences.
`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { responseMimeType: "application/json" }
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) { jsonStr = match[2].trim(); }

  try {
    const parsedData: AIExtractedSetupData = JSON.parse(jsonStr);
    return parsedData;
  } catch (e) {
    console.error("Failed to parse JSON for full story setup extraction:", e, "\nRaw response:", response.text);
    // Try to salvage parts if possible, or return an empty structure
    return {
      story_setup_name: userText.substring(0, 30) + " (Extraction Failed)",
      world_setup: { advanced_prompt: userText }, // At least put the original text somewhere
    };
  }
}


export async function generateFullRandomStorySetup(
  apiKeyFromArgs: string,
  useDefaultAPI: boolean,
  params: AIRandomGenerationParams
): Promise<AIExtractedSetupData> {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");
  
  const skillCategoriesString = ['chiến đấu', 'chế tạo', 'sinh tồn', 'phép thuật', 'hỗ trợ', 'khác'].join('", "');
  const entityTypesString = Object.values(EntityType).join('", "');

  const userPrompt = `
Tạo một thiết lập truyện nhập vai hoàn chỉnh và đồ sộ dựa trên các thông tin sau:
- Chủ đề gợi ý từ người dùng (nếu có): "${params.userTheme}"
- Mô tả ngắn từ người dùng (nếu có): "${params.userDescription}"
- Số lượng thực thể (NPC, vật phẩm, địa điểm, tổ chức, khái niệm 'Khác') cần tạo: ${params.numEntities} (phân bổ đều hoặc hợp lý).

Yêu cầu định dạng trả lời là một JSON object duy nhất. JSON object này phải CHỈ chứa các key sau:
- "story_setup_name": string (tên chung hấp dẫn cho thiết lập này, dựa trên chủ đề và mô tả)
- "world_setup": object (
    "theme": string (chủ đề chính, có thể phát triển từ gợi ý),
    "context": string (bối cảnh chi tiết, rộng lớn),
    "tone": string (một trong: "Hài hước", "Nghiêm túc", "Kỳ ảo", "Kinh dị", "Lãng mạn", "Sử thi", hoặc một giá trị tùy chỉnh phù hợp),
    "advanced_prompt": string (thông tin bổ sung về thế giới: lịch sử, phe phái, luật lệ đặc biệt, các vùng đất, v.v. - làm cho nó thật phong phú)
  )
- "character_setup": object (
    "name": string (tên nhân vật chính phù hợp),
    "gender": string (một trong: "Nam", "Nữ", "Khác", "AI quyết định"),
    "summary": string (sơ lược chi tiết về nhân vật: ngoại hình, tính cách, nguồn gốc, hoàn cảnh ban đầu),
    "traits_raw": array of strings (tạo 2-3 đặc điểm độc đáo, mỗi string là "Tên Đặc Điểm: Mô tả"),
    "goal": string (mục tiêu chính rõ ràng, hấp dẫn cho nhân vật),
    "initial_skills_raw": array of strings (tạo 1-2 kỹ năng khởi đầu, mỗi string là "Tên Kỹ Năng: Mô tả (Loại: [một trong: ${skillCategoriesString}], Icon: [font awesome class])")
  )
- "entities_raw": array of objects (tạo ${params.numEntities} thực thể, mỗi object có dạng {"name": string, "type": string (một trong: "${entityTypesString}"), "description": string}. Mô tả thực thể chi tiết, thú vị).

LƯU Ý CỰC KỲ QUAN TRỌNG:
- Tất cả các trường phải được điền đầy đủ, sáng tạo, và có chất lượng cao.
- "world_setup.advanced_prompt" phải thật sự "nâng cao", cung cấp nhiều chi tiết làm nền tảng cho thế giới.
- Mô tả cho "character_setup.summary" và các "entities_raw.description" phải chi tiết, không hời hợt.
- Với "traits_raw", mỗi phần tử PHẢI là một chuỗi có định dạng "Tên Đặc Điểm: Mô tả".
- Với "initial_skills_raw", mỗi phần tử PHẢI là một chuỗi có định dạng "Tên Kỹ Năng: Mô tả (Loại: ..., Icon: ...)".
- Đảm bảo tạo đúng ${params.numEntities} thực thể trong "entities_raw".
Chỉ trả về JSON object. Không bao gồm markdown fences.
`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL, // Consider a more powerful model if available and needed for complexity
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { responseMimeType: "application/json", temperature: 0.8 } // Slightly higher temp for creativity
  });

  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) { jsonStr = match[2].trim(); }

  try {
    const parsedData: AIExtractedSetupData = JSON.parse(jsonStr);
    return parsedData;
  } catch (e) {
    console.error("Failed to parse JSON for AI random full generation:", e, "\nRaw response:", response.text);
    // Return a very basic structure to avoid crashing the app
    return {
      story_setup_name: params.userTheme || "Lỗi Tạo Ngẫu Nhiên",
      world_setup: { theme: params.userTheme || "Lỗi", context: "AI không thể tạo bối cảnh.", tone: "Nghiêm túc"},
      character_setup: { name: "Nhân Vật Lỗi", summary: "AI không thể tạo nhân vật.", goal: "Sống sót" },
      entities_raw: [{name: "Thực Thể Lỗi", type: EntityType.Other, description: "AI không thể tạo thực thể."}]
    };
  }
}
