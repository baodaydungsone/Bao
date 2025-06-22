
export enum Theme {
  Light = "light",
  Dark = "dark",
}

export enum ModalType {
  None,
  APISettings,
  NSFWSettings,
  GeneralSettings,
  Guide,
  NewStorySetup,
  LoadStory,
  WorldEventCreator,
  StorySummary,
  Encyclopedia,
  DeathConfirmation,
  SaveGame, // Added new modal type
}

export interface Settings {
  theme: Theme;
  apiKeyStatus: "unknown" | "valid" | "invalid" | "default";
  language: string;
  fontSize: number;
  useDefaultAPI: boolean;
  currencyEnabled: boolean;
  timeSystemEnabled: boolean;
  reputationSystemEnabled: boolean;
}

export interface NSFWPreferences {
  enabled: boolean;
  eroticaLevel: "none" | "medium" | "high" | "extreme";
  violenceLevel: "none" | "medium" | "high" | "extreme";
  darkContentLevel: "none" | "medium" | "high" | "extreme";
  customPrompt?: string;
}

export enum WorldTone {
  Humorous = "Hài hước",
  Serious = "Nghiêm túc",
  Fantasy = "Kỳ ảo",
  Horror = "Kinh dị",
  Romance = "Lãng mạn",
  Epic = "Sử thi",
  Custom = "Tùy chỉnh"
}

export interface WorldSetup {
  theme: string;
  context: string;
  tone: WorldTone | string;
  advancedPrompt?: string;
}

export enum CharacterGender {
  Male = "Nam",
  Female = "Nữ",
  Other = "Khác",
  AIDecides = "AI quyết định",
}

export interface CharacterTrait {
  id: string;
  name: string;
  description: string;
}

export interface CharacterSetup {
  name: string;
  gender: CharacterGender | string;
  summary: string;
  traits: CharacterTrait[];
  goal: string;
  initialSkills?: Skill[];
}

export enum EntityType {
  NPC = "NPC",
  Item = "Vật phẩm",
  Location = "Địa điểm",
  Organization = "Tổ chức",
  Other = "Khác"
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  description: string;
}

export interface CharacterAttribute {
  id: string;
  name: string;
  value: number | string;
  maxValue?: number;
  description?: string;
  icon?: string;
  isProgressionStat?: boolean;
}

export type CharacterStats = Record<string, CharacterAttribute>;

export interface ItemEffect { // For consumable items
  statId: string;
  changeValue: number;
  duration?: number; // Optional duration for temporary effects
}

export enum EquipmentSlot {
    Weapon = "Vũ Khí Chính",
    OffHand = "Tay Phụ", // Shield, orb, dagger etc.
    Helmet = "Mũ",
    Armor = "Giáp",
    Boots = "Giày",
    Amulet = "Dây Chuyền",
    Ring1 = "Nhẫn 1",
    Ring2 = "Nhẫn 2",
}

export interface StatBonus { // For equipment
    statId: string; // ID of the stat to modify (e.g., "hp", "damage_output")
    value: number;  // The amount of change
    isPercentage?: boolean; // If true, value is a percentage (e.g., 5 for 5%)
    appliesToMax?: boolean; // If true and stat has maxValue, bonus applies to maxValue (e.g. +10 Max HP)
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  icon?: string; // Font Awesome class or similar for abstract icon
  category?: 'thuốc' | 'vũ khí' | 'trang bị' | 'nguyên liệu' | 'khác' | 'quan trọng';
  usable?: boolean; // Can it be actively used (e.g. potion)
  consumable?: boolean; // Is it consumed on use
  effects?: ItemEffect[]; // Effects if it's a consumable

  equippable?: boolean; // Can this item be equipped?
  slot?: EquipmentSlot; // Which slot does it go into?
  statBonuses?: StatBonus[]; // Stat bonuses it provides when equipped
}

export type SkillProficiency = "Sơ Nhập Môn" | "Tiểu Thành" | "Đại Thành" | "Viên Mãn" | "Lô Hoả Thuần Thanh" | "Đăng Phong Tạo Cực";

export interface SkillEffect {
    description: string;
    details?: Record<string, any>;
}
export interface Skill {
  id: string;
  name: string;
  description: string;
  icon?: string; // Font Awesome class or similar for abstract icon
  proficiency: SkillProficiency;
  xp: number;
  xpToNextLevel: number;
  effects?: SkillEffect[];
  category?: 'chiến đấu' | 'chế tạo' | 'sinh tồn' | 'phép thuật' | 'hỗ trợ' | 'khác';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon?: string;
  isSecret?: boolean;
}

export interface StorySetupData {
  id: string;
  world: WorldSetup;
  character: CharacterSetup;
  entities: Entity[];
  createdAt: string;
  name?: string;
  initialCharacterStats?: CharacterStats;
  initialInventory?: InventoryItem[];
  initialSkills?: Skill[];
}

export interface StoryMessage {
  id:string;
  type: "narration" | "dialogue" | "system" | "event" | "loading" | "author";
  content: string;
  characterName?: string;
  timestamp: string;
}

export interface PlayerChoice {
  id: string;
  text: string;
  tooltip?: string;
}

export type ActiveSidebarTab = 'actions' | 'stats' | 'inventory' | 'equipment' | 'cultivation' | 'skills' | 'achievements' | 'relationships' | 'objectives';

// --- NPC Relationship System ---
export enum RelationshipStatus {
    Hostile = "Thù Địch",
    Mistrustful = "Không Tin Tưởng",
    Neutral = "Trung Lập",
    Amicable = "Hòa Hảo",
    Friendly = "Thân Thiện",
    Loyal = "Trung Thành",
    Adored = "Ngưỡng Mộ",
}

export interface NPCProfile {
    id: string; 
    name: string;
    status: RelationshipStatus;
    score: number; 
    description?: string; 
    known: boolean;
}

// --- AI-Generated Objectives ---
export interface Objective {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'failed';
    isPlayerGoal?: boolean; 
    subObjectives?: string[]; 
    rewardPreview?: string;
}


export interface GameState {
  setup: StorySetupData;
  storyLog: StoryMessage[];
  currentChoices: PlayerChoice[];
  currentSummary: string;
  currentWorldEvent: WorldEvent | null;
  history: Omit<GameState, 'history' | 'setup'>[];
  encyclopedia: Entity[];
  isInitialStoryGenerated?: boolean;
  characterStats: CharacterStats; 
  inventory: InventoryItem[];
  equippedItems: Partial<Record<EquipmentSlot, InventoryItem['id']>>; 
  unlockedAchievements: Achievement[];
  characterSkills: Skill[];
  isRoleplayModeActive: boolean;
  isAuthorInterventionModeActive: boolean;
  activeSidebarTab?: ActiveSidebarTab; // This will now be used by GamePage for mobile panel/action sheet toggling
  npcRelationships: Record<string, NPCProfile>; 
  objectives: Objective[];
  currency?: { name: string; amount: number; icon?: string };
  currentTime?: string;
}

export interface AutosavedGameInfo {
  gameState: GameState;
  savedAt: string; // ISO string for the save timestamp
}

export interface StatChange { 
    attribute_id: string;
    change_value?: number;
    new_value?: number | string;
    new_max_value?: number;
    reason?: string;
}

export interface SkillChange {
    skill_id: string;
    xp_gained?: number;
    new_proficiency?: SkillProficiency;
    new_xp_to_next_level?: number;
    new_description?: string;
    reason?: string;
}

export enum WorldEventType {
  Boon = "Kỳ Ngộ / Cơ Duyên",
  Calamity = "Tai Họa / Biến Cố",
  PoliticalConflict = "Mâu Thuẫn / Xung Đột Chính Trị",
  SocialEvent = "Sự Kiện Xã Hội",
  Rumor = "Tin Đồn / Bí Mật Bị Tiết Lộ",
  Random = "Ngẫu Nhiên",
}

export enum WorldEventScope {
  Personal = "Cá Nhân",
  Regional = "Khu Vực",
  Global = "Toàn Cầu / Rộng Lớn",
}
export interface WorldEvent {
  id: string;
  name: string;
  type: WorldEventType;
  scope: WorldEventScope;
  description: string;
  keyElements?: string[];
  status: "active" | "concluded";
  timestamp: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  icon?: string;
}

export interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export interface InitialStoryAIData {
    story: string;
    choices: Array<{text: string; tooltip?: string} | string>;
    initial_stats?: Record<string, Partial<CharacterAttribute>>;
    initial_inventory?: Array<Partial<InventoryItem>>; 
    initial_skills?: Array<Partial<Skill>>;
    new_encyclopedia_entries?: Array<Partial<Entity>>;
    newly_unlocked_achievements?: Array<Omit<Achievement, 'id' | 'unlockedAt'>>;
    initial_relationships?: Array<Partial<NPCProfile>>;
    initial_objectives?: Array<Omit<Objective, 'id' | 'status'>>;
    initial_currency?: { name: string; amount: number; icon?: string };
    initial_time?: string;
}

export interface NextStoryAIData {
    story: string;
    choices: Array<{text: string; tooltip?: string} | string>;
    stat_changes?: StatChange[]; 
    item_changes?: {
        gained?: Array<Partial<InventoryItem>>; 
        lost?: Array<{ id: string; quantity: number } | { name: string; quantity: number }>;
    };
    skill_changes?: SkillChange[];
    new_skills_unlocked?: Array<Partial<Skill>>;
    new_encyclopedia_entries?: Array<Partial<Entity>>;
    summary_update?: string;
    newly_unlocked_achievements?: Array<Omit<Achievement, 'id' | 'unlockedAt'>>;
    relationship_changes?: Array<{ npc_name: string; score_change?: number; new_status?: RelationshipStatus; reason?: string }>;
    new_objectives_suggested?: Array<Omit<Objective, 'id' | 'status' | 'isPlayerGoal'>>;
    objective_updates?: Array<{ objective_id_or_title: string; new_status: 'completed' | 'failed'; reason?: string }>;
    currency_changes?: { change_value?: number; new_amount?: number; reason?: string };
    time_update?: string;
}

export interface AIExtractedSetupData {
  story_setup_name?: string;
  world_setup?: {
    theme?: string;
    context?: string;
    tone?: string; 
    advanced_prompt?: string;
  };
  character_setup?: {
    name?: string;
    gender?: string; 
    summary?: string;
    traits_raw?: string[]; 
    goal?: string;
    initial_skills_raw?: string[]; 
  };
  entities_raw?: Array<{
    name?: string;
    type?: string; 
    description?: string;
  }>;
}

export interface AIRandomGenerationParams {
  userTheme: string;
  userDescription: string;
  numEntities: number;
}

// Google Auth & Drive Types
export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
}

export interface GoogleTokenResponse {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties from Google's response
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

// Extend GAPI types if needed, or use 'any' for simplicity if specific types are too complex
declare global {
  // eslint-disable-next-line no-var
  var gapi: any;
  // eslint-disable-next-line no-var
  var google: any;
}
 
