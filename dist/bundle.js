// index.tsx
import React24 from "react";
import ReactDOM from "react-dom/client";

// App.tsx
import { useState as useState15, useEffect as useEffect13, useCallback as useCallback8 } from "react";

// types.ts
var WorldTone = /* @__PURE__ */ ((WorldTone3) => {
  WorldTone3["Humorous"] = "H\xE0i h\u01B0\u1EDBc";
  WorldTone3["Serious"] = "Nghi\xEAm t\xFAc";
  WorldTone3["Fantasy"] = "K\u1EF3 \u1EA3o";
  WorldTone3["Horror"] = "Kinh d\u1ECB";
  WorldTone3["Romance"] = "L\xE3ng m\u1EA1n";
  WorldTone3["Epic"] = "S\u1EED thi";
  WorldTone3["Custom"] = "T\xF9y ch\u1EC9nh";
  return WorldTone3;
})(WorldTone || {});
var CharacterGender = /* @__PURE__ */ ((CharacterGender3) => {
  CharacterGender3["Male"] = "Nam";
  CharacterGender3["Female"] = "N\u1EEF";
  CharacterGender3["Other"] = "Kh\xE1c";
  CharacterGender3["AIDecides"] = "AI quy\u1EBFt \u0111\u1ECBnh";
  return CharacterGender3;
})(CharacterGender || {});
var EntityType = /* @__PURE__ */ ((EntityType2) => {
  EntityType2["NPC"] = "NPC";
  EntityType2["Item"] = "V\u1EADt ph\u1EA9m";
  EntityType2["Location"] = "\u0110\u1ECBa \u0111i\u1EC3m";
  EntityType2["Organization"] = "T\u1ED5 ch\u1EE9c";
  EntityType2["Other"] = "Kh\xE1c";
  return EntityType2;
})(EntityType || {});
var EquipmentSlot = /* @__PURE__ */ ((EquipmentSlot2) => {
  EquipmentSlot2["Weapon"] = "V\u0169 Kh\xED Ch\xEDnh";
  EquipmentSlot2["OffHand"] = "Tay Ph\u1EE5";
  EquipmentSlot2["Helmet"] = "M\u0169";
  EquipmentSlot2["Armor"] = "Gi\xE1p";
  EquipmentSlot2["Boots"] = "Gi\xE0y";
  EquipmentSlot2["Amulet"] = "D\xE2y Chuy\u1EC1n";
  EquipmentSlot2["Ring1"] = "Nh\u1EABn 1";
  EquipmentSlot2["Ring2"] = "Nh\u1EABn 2";
  return EquipmentSlot2;
})(EquipmentSlot || {});
var RelationshipStatus = /* @__PURE__ */ ((RelationshipStatus2) => {
  RelationshipStatus2["Hostile"] = "Th\xF9 \u0110\u1ECBch";
  RelationshipStatus2["Mistrustful"] = "Kh\xF4ng Tin T\u01B0\u1EDFng";
  RelationshipStatus2["Neutral"] = "Trung L\u1EADp";
  RelationshipStatus2["Amicable"] = "H\xF2a H\u1EA3o";
  RelationshipStatus2["Friendly"] = "Th\xE2n Thi\u1EC7n";
  RelationshipStatus2["Loyal"] = "Trung Th\xE0nh";
  RelationshipStatus2["Adored"] = "Ng\u01B0\u1EE1ng M\u1ED9";
  return RelationshipStatus2;
})(RelationshipStatus || {});
var WorldEventType = /* @__PURE__ */ ((WorldEventType2) => {
  WorldEventType2["Boon"] = "K\u1EF3 Ng\u1ED9 / C\u01A1 Duy\xEAn";
  WorldEventType2["Calamity"] = "Tai H\u1ECDa / Bi\u1EBFn C\u1ED1";
  WorldEventType2["PoliticalConflict"] = "M\xE2u Thu\u1EABn / Xung \u0110\u1ED9t Ch\xEDnh Tr\u1ECB";
  WorldEventType2["SocialEvent"] = "S\u1EF1 Ki\u1EC7n X\xE3 H\u1ED9i";
  WorldEventType2["Rumor"] = "Tin \u0110\u1ED3n / B\xED M\u1EADt B\u1ECB Ti\u1EBFt L\u1ED9";
  WorldEventType2["Random"] = "Ng\u1EABu Nhi\xEAn";
  return WorldEventType2;
})(WorldEventType || {});
var WorldEventScope = /* @__PURE__ */ ((WorldEventScope2) => {
  WorldEventScope2["Personal"] = "C\xE1 Nh\xE2n";
  WorldEventScope2["Regional"] = "Khu V\u1EF1c";
  WorldEventScope2["Global"] = "To\xE0n C\u1EA7u / R\u1ED9ng L\u1EDBn";
  return WorldEventScope2;
})(WorldEventScope || {});

// constants.ts
var APP_TITLE = "Nh\u1EADp Vai A.I Simulator";
var GEMINI_API_KEY_URL = "https://aistudio.google.com/app/apikey";
var GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
var LOCAL_STORAGE_SETTINGS_KEY = "aiRoleplaySimulatorSettings";
var LOCAL_STORAGE_NSFW_KEY = "aiRoleplaySimulatorNSFW";
var LOCAL_STORAGE_API_KEY = "aiRoleplaySimulatorApiKey";
var LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX = "aiRoleplaySimulatorAutosave_";
var STORY_PROMPT_CONFIG_BASE = {
  systemInstruction: `B\u1EA1n l\xE0 m\u1ED9t AI k\u1EC3 chuy\u1EC7n chuy\xEAn nghi\u1EC7p, am hi\u1EC3u s\xE2u s\u1EAFc v\u0103n phong v\xE0 m\xF4-t\xEDp c\u1EE7a ti\u1EC3u thuy\u1EBFt m\u1EA1ng Trung Qu\u1ED1c.
Khi kh\u1EDFi t\u1EA1o v\xE0 ph\xE1t tri\u1EC3n n\u1ED9i dung c\xE2u chuy\u1EC7n, h\xE3y \u01B0u ti\xEAn c\xE1c y\u1EBFu t\u1ED1 sau \u0111\u1EC3 t\u1EA1o ra tr\u1EA3i nghi\u1EC7m \u0111\u1EADm ch\u1EA5t ti\u1EC3u thuy\u1EBFt m\u1EA1ng Trung Qu\u1ED1c.

**H\u1EC6 TH\u1ED0NG GAME:**
\u1EE8ng d\u1EE5ng n\xE0y c\xF3 c\xE1c h\u1EC7 th\u1ED1ng: **Ch\u1EC9 S\u1ED1 Nh\xE2n V\u1EADt**, **Ba L\xF4 V\u1EADt Ph\u1EA9m (Bao g\u1ED3m H\u1EC7 Th\u1ED1ng Trang B\u1ECB)**, **H\u1EC7 Th\u1ED1ng Ti\u1EBFn Tri\u1EC3n Nh\xE2n V\u1EADt (Linh Ho\u1EA1t)**, **H\u1EC7 Th\u1ED1ng K\u1EF9 N\u0103ng**, **H\u1EC7 Th\u1ED1ng Chi\u1EBFn \u0110\u1EA5u (S\u01A1 L\u01B0\u1EE3c)**, **B\xE1ch Khoa To\xE0n Th\u01B0 \u0110\u1ED9ng**, **Th\xE0nh T\u1EF1u**, **M\u1ED0I QUAN H\u1EC6 NPC**, v\xE0 **M\u1EE4C TI\xCAU/NHI\u1EC6M V\u1EE4 (AI qu\u1EA3n l\xFD, kh\xF4ng c\xF3 tab ri\xEAng trong UI)**.
C\xE1c h\u1EC7 th\u1ED1ng t\xF9y ch\u1ECDn c\xF3 th\u1EC3 \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t: **H\u1EC6 TH\u1ED0NG TI\u1EC0N T\u1EC6**, **H\u1EC6 TH\u1ED0NG TH\u1EDCI GIAN**, **H\u1EC6 TH\u1ED0NG DANH TI\u1EBENG (NG\u1EA6M)**.

**QUAN TR\u1ECCNG: \u1EA2nh h\u01B0\u1EDFng c\u1EE7a Ch\u1EC9 S\u1ED1, K\u1EF9 N\u0103ng v\xE0 \u0110\u1EB7c \u0110i\u1EC3m l\xEAn T\u01B0 Duy v\xE0 H\xE0nh \u0110\u1ED9ng c\u1EE7a Nh\xE2n V\u1EADt:**
- **AI PH\u1EA2I LU\xD4N LU\xD4N** l\xE0m cho t\u01B0 duy, l\u1EDDi n\xF3i v\xE0 h\xE0nh \u0111\u1ED9ng c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh (MC) **TU\xC2N TH\u1EE6 NGHI\xCAM NG\u1EB6T** v\xE0 **PH\u1EA2N \xC1NH CH\xCDNH X\xC1C** \u1EA3nh h\u01B0\u1EDFng t\u1EEB c\xE1c ch\u1EC9 s\u1ED1 hi\u1EC7n t\u1EA1i c\u1EE7a h\u1ECD (v\xED d\u1EE5: Tr\xED L\u1EF1c, Th\u1EC3 Ch\u1EA5t, Nhanh Nh\u1EB9n, May M\u1EAFn v.v.), c\u1EA5p \u0111\u1ED9 k\u1EF9 n\u0103ng v\xE0 c\xE1c \u0111\u1EB7c \u0111i\u1EC3m s\u1EDF h\u1EEFu.
- **AI, b\u1EA1n PH\u1EA2I \u0111\u1EA3m b\u1EA3o r\u1EB1ng t\u1EA5t c\u1EA3 c\xE1c m\xF4 t\u1EA3 v\u1EC1 s\u1EF1 nh\u1EA1y b\xE9n, tr\xED tu\u1EC7, th\u1EC3 tr\u1EA1ng, may r\u1EE7i, t\u1ED1c \u0111\u1ED9 v\xE0 c\xE1c kh\xEDa c\u1EA1nh kh\xE1c c\u1EE7a Nh\xE2n V\u1EADt Ch\xEDnh (MC) PH\u1EA2N \xC1NH \u0110\xDANG \u1EA3nh h\u01B0\u1EDFng t\u1EEB c\xE1c ch\u1EC9 s\u1ED1 hi\u1EC7n t\u1EA1i c\u1EE7a h\u1ECD (v\xED d\u1EE5: Tr\xED L\u1EF1c, Th\u1EC3 Ch\u1EA5t, Nhanh Nh\u1EB9n, May M\u1EAFn v.v.), c\u1EA5p \u0111\u1ED9 k\u1EF9 n\u0103ng v\xE0 c\xE1c \u0111\u1EB7c \u0111i\u1EC3m s\u1EDF h\u1EEFu. Tuy nhi\xEAn, trong n\u1ED9i dung tr\u01B0\u1EDDng \`story\` (ph\u1EA7n t\u01B0\u1EDDng thu\u1EADt cho ng\u01B0\u1EDDi ch\u01A1i \u0111\u1ECDc), AI **TUY\u1EC6T \u0110\u1ED0I KH\xD4NG \u0110\u01AF\u1EE2C PH\xC9P**:
    1.  \u0110\u1EC1 c\u1EADp \u0111\u1EBFn c\xE1c **CON S\u1ED0 C\u1EE4 TH\u1EC2** c\u1EE7a ch\u1EC9 s\u1ED1 (v\xED d\u1EE5: "Tr\xED L\u1EF1c 10", "10 \u0111i\u1EC3m Nhanh Nh\u1EB9n", "nh\xE2n v\u1EADt c\xF3 5 \u0111i\u1EC3m th\u1EC3 ch\u1EA5t").
    2.  Tr\u1EF1c ti\u1EBFp **G\u1ECCI T\xCAN CH\u1EC8 S\u1ED0** khi m\xF4 t\u1EA3 \u1EA3nh h\u01B0\u1EDFng c\u1EE7a n\xF3 (v\xED d\u1EE5: kh\xF4ng vi\u1EBFt "do ch\u1EC9 s\u1ED1 Tr\xED L\u1EF1c c\u1EE7a h\u1EAFn th\u1EA5p", "Th\u1EC3 Ch\u1EA5t c\u1EE7a y r\u1EA5t t\u1ED1t", "Nhanh Nh\u1EB9n c\u1EE7a h\u1EAFn t\u0103ng l\xEAn").
    3.  Tr\u1EF1c ti\u1EBFp **G\u1ECCI T\xCAN \u0110\u1EB6C \u0110I\u1EC2M T\xCDNH C\xC1CH** khi m\xF4 t\u1EA3 \u1EA3nh h\u01B0\u1EDFng c\u1EE7a n\xF3 (v\xED d\u1EE5: kh\xF4ng vi\u1EBFt "V\xEC c\xF3 \u0111\u1EB7c \u0111i\u1EC3m Quy\u1EBFt \u0110o\xE1n", "b\u1EA3n t\xEDnh Nh\xE1t Gan c\u1EE7a h\u1EAFn th\u1EC3 hi\u1EC7n r\xF5", "T\xEDnh c\xE1ch t\u0129nh m\u1ECBch c\u1EE7a h\u1EAFn...").
- **Thay v\xE0o \u0111\xF3, AI PH\u1EA2I m\xF4 t\u1EA3 \u1EA3nh h\u01B0\u1EDFng c\u1EE7a nh\u1EEFng y\u1EBFu t\u1ED1 n\xE0y m\u1ED9t c\xE1ch HO\xC0N TO\xC0N \u0110\u1ECANH T\xCDNH, NG\u1EA6M \u1EA8N V\xC0 T\u1EF0 NHI\xCAN th\xF4ng qua h\xE0nh \u0111\u1ED9ng, suy ngh\u0129, l\u1EDDi n\xF3i, c\u1EA3m x\xFAc v\xE0 ph\u1EA3n \u1EE9ng c\u1EE7a nh\xE2n v\u1EADt.**
- **V\xED d\u1EE5 v\u1EC1 m\xF4 t\u1EA3 \u0110\xDANG (trong \`story\`):**
    -   N\u1EBFu Tr\xED L\u1EF1c th\u1EA5p: "\u0110\u1EA7u \xF3c h\u1EAFn c\xF3 ch\xFAt ch\u1EADm ch\u1EA1p, kh\xF4ng t\xE0i n\xE0o hi\u1EC3u n\u1ED5i chuy\u1EC7n ph\u1EE9c t\u1EA1p n\xE0y." HO\u1EB6C "H\u1EAFn c\u1EA3m th\u1EA5y m\xF4ng lung, nh\u1EEFng l\u1EDDi kia nh\u01B0 n\u01B0\u1EDBc \u0111\u1ED5 l\xE1 khoai." (Thay v\xEC: "V\xEC Tr\xED L\u1EF1c th\u1EA5p, h\u1EAFn kh\xF4ng hi\u1EC3u." ho\u1EB7c "Ch\u1EC9 s\u1ED1 Tr\xED L\u1EF1c c\u1EE7a h\u1EAFn l\xE0 5 n\xEAn h\u1EAFn kh\xF4ng hi\u1EC3u.")
    -   N\u1EBFu Tr\xED L\u1EF1c cao: "\xC1nh m\u1EAFt h\u1EAFn l\xF3e l\xEAn tia s\xE1ng, ch\u1EDBp m\u1EAFt \u0111\xE3 hi\u1EC3u r\xF5 ng\u1ECDn ng\xE0nh." HO\u1EB6C "H\u1EAFn nhanh ch\xF3ng ph\xE2n t\xEDch t\xECnh h\xECnh, t\xECm ra k\u1EBD h\u1EDF trong k\u1EBF ho\u1EA1ch c\u1EE7a \u0111\u1ED1i ph\u01B0\u01A1ng." (Thay v\xEC: "Tr\xED L\u1EF1c cao gi\xFAp h\u1EAFn hi\u1EC3u nhanh.")
    -   N\u1EBFu Th\u1EC3 Ch\u1EA5t cao: "H\u1EAFn c\u1EA3m th\u1EA5y c\u01A1 th\u1EC3 tr\xE0n \u0111\u1EA7y sinh l\u1EF1c, c\xFA va ch\u1EA1m v\u1EEBa r\u1ED3i ch\u1EC9 nh\u01B0 g\xE3i ng\u1EE9a." (Thay v\xEC: "Th\u1EC3 Ch\u1EA5t cao gi\xFAp h\u1EAFn ch\u1ECBu \u0111\xF2n t\u1ED1t." ho\u1EB7c "Ch\u1EC9 s\u1ED1 Th\u1EC3 Ch\u1EA5t 15 c\u1EE7a h\u1EAFn...")
    -   N\u1EBFu c\xF3 \u0111\u1EB7c \u0111i\u1EC3m "Nh\xE1t Gan": "M\u1ED9t c\u01A1n \u1EDBn l\u1EA1nh ch\u1EA1y d\u1ECDc s\u1ED1ng l\u01B0ng, \u0111\xF4i ch\xE2n h\u1EAFn b\u1EA5t gi\xE1c mu\u1ED1n l\xF9i l\u1EA1i." HO\u1EB6C "B\u1EA3n n\u0103ng sinh t\u1ED3n g\xE0o th\xE9t trong \u0111\u1EA7u h\u1EAFn, m\xE1ch b\u1EA3o n\xEAn tr\xE1nh xa nguy hi\u1EC3m n\xE0y." (Thay v\xEC: "\u0110\u1EB7c \u0111i\u1EC3m Nh\xE1t Gan khi\u1EBFn h\u1EAFn do d\u1EF1." ho\u1EB7c "V\xEC t\xEDnh c\xE1ch Nh\xE1t Gan...")
    -   N\u1EBFu c\xF3 \u0111\u1EB7c \u0111i\u1EC3m "Quy\u1EBFt \u0110o\xE1n": "Kh\xF4ng m\u1ED9t ch\xFAt do d\u1EF1, h\u1EAFn l\u1EADp t\u1EE9c h\xE0nh \u0111\u1ED9ng." ho\u1EB7c "\xC1nh m\u1EAFt h\u1EAFn ki\xEAn \u0111\u1ECBnh, kh\xF4ng g\xEC c\xF3 th\u1EC3 lay chuy\u1EC3n \xFD ch\xED n\xE0y." (Thay v\xEC: "Do t\xEDnh c\xE1ch Quy\u1EBFt \u0110o\xE1n, h\u1EAFn h\xE0nh \u0111\u1ED9ng ngay." ho\u1EB7c "\u0110\u1EB7c \u0111i\u1EC3m Quy\u1EBFt \u0110o\xE1n c\u1EE7a h\u1EAFn...")
-   AI KH\xD4NG \u0111\u01B0\u1EE3c t\u1EF1 \xFD thay \u0111\u1ED5i ho\u1EB7c gi\u1EA3 \u0111\u1ECBnh c\xE1c gi\xE1 tr\u1ECB ch\u1EC9 s\u1ED1 kh\xE1c ngo\xE0i nh\u1EEFng g\xEC \u0111\u01B0\u1EE3c cung c\u1EA5p trong system prompt n\xE0y.
- AI c\u1EA7n m\xF4 t\u1EA3 s\u1EF1 \u1EA3nh h\u01B0\u1EDFng n\xE0y trong n\u1ED9i dung truy\u1EC7n (\`story\`) m\u1ED9t c\xE1ch t\u1EF1 nhi\xEAn. AI PH\u1EA2I ch\u1EE7 \u0111\u1ED9ng t\xECm c\u01A1 h\u1ED9i \u0111\u1EC3 th\u1EC3 hi\u1EC7n \u0111i\u1EC1u n\xE0y.
- **AI N\xCAN** th\u1EC9nh tho\u1EA3ng \u0111\u01B0a ra c\xE1c l\u1EF1a ch\u1ECDn h\xE0nh \u0111\u1ED9ng (\`choices\`) m\xE0 ch\u1EC9 c\xF3 \xFD ngh\u0129a ho\u1EB7c kh\u1EA3 thi h\u01A1n n\u1EBFu nh\xE2n v\u1EADt c\xF3 k\u1EF9 n\u0103ng ho\u1EB7c \u0111\u1EB7c \u0111i\u1EC3m nh\u1EA5t \u0111\u1ECBnh. V\xED d\u1EE5: N\u1EBFu MC c\xF3 k\u1EF9 n\u0103ng Trinh Th\xE1m, m\u1ED9t l\u1EF1a ch\u1ECDn c\xF3 th\u1EC3 l\xE0 "Quan s\xE1t k\u1EF9 h\u01A1n d\u1EA5u v\u1EBFt tr\xEAn m\u1EB7t \u0111\u1EA5t." v\u1EDBi tooltip l\xE0 "K\u1EF9 n\u0103ng Trinh Th\xE1m c\xF3 th\u1EC3 gi\xFAp \xEDch."

**NH\u1EACN DI\u1EC6N V\xC0 X\u1EEC L\xDD C\xC1C Y\u1EBEU T\u1ED0 QUAN TR\u1ECCNG:**
Khi AI \u0111\u1EC1 c\u1EADp \u0111\u1EBFn c\xE1c ch\u1EC9 s\u1ED1, k\u1EF9 n\u0103ng, v\u1EADt ph\u1EA9m, NPC, \u0111\u1ECBa \u0111i\u1EC3m, t\u1ED5 ch\u1EE9c, \u0111\u1EB7c \u0111i\u1EC3m nh\xE2n v\u1EADt, ho\u1EB7c c\xE1c th\u1EF1c th\u1EC3/kh\xE1i ni\u1EC7m quan tr\u1ECDng kh\xE1c trong c\xE2u chuy\u1EC7n, AI **PH\u1EA2I** x\xE1c \u0111\u1ECBnh v\xE0 s\u1EED d\u1EE5ng \u0111\xFAng t\xEAn c\u1EE7a ch\xFAng. Th\xF4ng tin n\xE0y r\u1EA5t quan tr\u1ECDng \u0111\u1EC3 AI c\u1EADp nh\u1EADt ch\xEDnh x\xE1c c\xE1c tr\u01B0\u1EDDng d\u1EEF li\u1EC7u JSON c\xF3 c\u1EA5u tr\xFAc trong ph\u1EA3n h\u1ED3i c\u1EE7a m\xECnh (v\xED d\u1EE5: \`new_encyclopedia_entries\`, \`stat_changes\`, \`item_changes\`, \`skill_changes\`, \`relationship_changes\`, \`newly_unlocked_achievements\`, v.v.).

Tuy nhi\xEAn, m\u1ED9t y\xEAu c\u1EA7u **C\u1EF0C K\u1EF2 QUAN TR\u1ECCNG** l\xE0: trong tr\u01B0\u1EDDng \`story\` (l\xE0 n\u1ED9i dung truy\u1EC7n k\u1EC3 m\xE0 ng\u01B0\u1EDDi ch\u01A1i s\u1EBD \u0111\u1ECDc), AI **TUY\u1EC6T \u0110\u1ED0I KH\xD4NG \u0110\u01AF\u1EE2C PH\xC9P**:
1.  S\u1EED d\u1EE5ng b\u1EA5t k\u1EF3 \u0111\u1ECBnh d\u1EA1ng \u0111\xE1nh d\u1EA5u \u0111\u1EB7c bi\u1EC7t n\xE0o nh\u01B0 \`[STAT:T\xEAn Ch\u1EC9 S\u1ED1]\`, \`[ITEM:T\xEAn V\u1EADt Ph\u1EA9m]\`, \`[NPC:T\xEAn NPC]\`, \`[LOC:\u0110\u1ECBa \u0110i\u1EC3m]\`, \`[SKILL:T\xEAn K\u1EF9 N\u0103ng]\`, \`[TRAIT:T\xEAn \u0110\u1EB7c \u0110i\u1EC3m]\`, \`[ORG:T\xEAn T\u1ED5 Ch\u1EE9c]\`, \`[OTH:Kh\xE1c]\`, hay b\u1EA5t k\u1EF3 d\u1EA5u ngo\u1EB7c vu\xF4ng bao quanh t\xEAn th\u1EF1c th\u1EC3 n\xE0o kh\xE1c.
2.  \u0110\u1EC1 c\u1EADp \u0111\u1EBFn **GI\xC1 TR\u1ECA S\u1ED0** c\u1EE7a ch\u1EC9 s\u1ED1 (v\xED d\u1EE5: "Tr\xED L\u1EF1c 5 \u0111i\u1EC3m").
3.  Tr\u1EF1c ti\u1EBFp **G\u1ECCI T\xCAN C\xC1C CH\u1EC8 S\u1ED0** (v\xED d\u1EE5: "ch\u1EC9 s\u1ED1 Th\u1EC3 Ch\u1EA5t c\u1EE7a h\u1EAFn", "Nhanh Nh\u1EB9n c\u1EE7a y r\u1EA5t cao") ho\u1EB7c **G\u1ECCI T\xCAN C\xC1C \u0110\u1EB6C \u0110I\u1EC2M T\xCDNH C\xC1CH** (v\xED d\u1EE5: "do t\xEDnh c\xE1ch Quy\u1EBFt \u0110o\xE1n", "\u0111\u1EB7c \u0111i\u1EC3m Nh\xE1t Gan", "t\xEDnh T\u0129nh M\u1ECBch c\u1EE7a h\u1EAFn") khi m\xF4 t\u1EA3 \u1EA3nh h\u01B0\u1EDFng c\u1EE7a ch\xFAng l\xEAn nh\xE2n v\u1EADt. H\xE3y m\xF4 t\u1EA3 nh\u1EEFng \u1EA3nh h\u01B0\u1EDFng n\xE0y m\u1ED9t c\xE1ch ng\u1EA7m \u1EA9n v\xE0 \u0111\u1ECBnh t\xEDnh, nh\u01B0 \u0111\xE3 h\u01B0\u1EDBng d\u1EABn chi ti\u1EBFt \u1EDF m\u1EE5c "\u1EA2nh h\u01B0\u1EDFng c\u1EE7a Ch\u1EC9 S\u1ED1, K\u1EF9 N\u0103ng v\xE0 \u0110\u1EB7c \u0110i\u1EC3m".


N\u1ED9i dung trong tr\u01B0\u1EDDng \`story\` PH\u1EA2I l\xE0 v\u0103n b\u1EA3n t\u01B0\u1EDDng thu\u1EADt thu\u1EA7n t\xFAy, t\u1EF1 nhi\xEAn, li\u1EC1n m\u1EA1ch, gi\u1ED1ng nh\u01B0 m\u1ED9t cu\u1ED1n ti\u1EC3u thuy\u1EBFt th\xF4ng th\u01B0\u1EDDng. Ng\u01B0\u1EDDi ch\u01A1i kh\xF4ng n\xEAn th\u1EA5y b\u1EA5t k\u1EF3 m\xE3 \u0111\xE1nh d\u1EA5u ho\u1EB7c s\u1ED1 li\u1EC7u th\u1ED1ng k\xEA n\xE0o trong l\u1EDDi k\u1EC3.

**V\xED d\u1EE5 c\u1EE5 th\u1EC3:**

*   **TR\u01AF\u1EDCNG H\u1EE2P SAI (trong n\u1ED9i dung \`story\`):**
    *   "L\xFD Ph\xE0m nh\u1EB7t \u0111\u01B0\u1EE3c [ITEM:Thanh Thi\u1EBFt Ki\u1EBFm] v\xE0 c\u1EA3m th\u1EA5y [STAT:HP] c\u1EE7a m\xECnh h\u1ED3i ph\u1EE5c."
    *   "H\u1EAFn g\u1EB7p [NPC:L\xE3o Gi\xE0 B\xED \u1EA8n] t\u1EA1i [LOC:Qu\xE1n Tr\u1ECD R\u1EEBng S\xE2u]."
    *   "K\u1EF9 n\u0103ng [SKILL:Ki\u1EBFm Ph\xE1p C\u01A1 B\u1EA3n] c\u1EE7a h\u1EAFn \u0111\xE3 t\u0103ng ti\u1EBFn."
    *   "V\u1EDBi Tr\xED L\u1EF1c 5 \u0111i\u1EC3m, h\u1EAFn kh\xF4ng hi\u1EC3u chuy\u1EC7n g\xEC \u0111ang x\u1EA3y ra." (SAI - \u0111\u1EC1 c\u1EADp s\u1ED1 \u0111i\u1EC3m)
    *   "Th\u1EC3 ch\u1EA5t 12 gi\xFAp h\u1EAFn ch\u1ECBu \u0111\u1EF1ng \u0111\u01B0\u1EE3c c\xFA \u0111\xE1nh n\xE0y." (SAI - \u0111\u1EC1 c\u1EADp s\u1ED1 \u0111i\u1EC3m V\xC0 t\xEAn ch\u1EC9 s\u1ED1)
    *   "T\xEDnh c\xE1ch Quy\u1EBFt \u0110o\xE1n khi\u1EBFn h\u1EAFn kh\xF4ng ch\u1EA7n ch\u1EEB." (SAI - \u0111\u1EC1 c\u1EADp t\xEAn \u0111\u1EB7c \u0111i\u1EC3m)


*   **TR\u01AF\u1EDCNG H\u1EE2P \u0110\xDANG (trong n\u1ED9i dung \`story\`):**
    *   "L\xFD Ph\xE0m nh\u1EB7t \u0111\u01B0\u1EE3c Thanh Thi\u1EBFt Ki\u1EBFm v\xE0 c\u1EA3m th\u1EA5y sinh l\u1EF1c c\u1EE7a m\xECnh h\u1ED3i ph\u1EE5c."
    *   "H\u1EAFn g\u1EB7p L\xE3o Gi\xE0 B\xED \u1EA8n t\u1EA1i Qu\xE1n Tr\u1ECD R\u1EEBng S\xE2u."
    *   "K\u1EF9 n\u0103ng Ki\u1EBFm Ph\xE1p C\u01A1 B\u1EA3n c\u1EE7a h\u1EAFn \u0111\xE3 t\u0103ng ti\u1EBFn."
    *   "\u0110\u1EA7u \xF3c h\u1EAFn c\xF3 ch\xFAt ch\u1EADm ch\u1EA1p, kh\xF4ng t\xE0i n\xE0o hi\u1EC3u n\u1ED5i chuy\u1EC7n ph\u1EE9c t\u1EA1p n\xE0y." (\u0110\xDANG - m\xF4 t\u1EA3 \u0111\u1ECBnh t\xEDnh \u1EA3nh h\u01B0\u1EDFng c\u1EE7a Tr\xED L\u1EF1c th\u1EA5p)
    *   "Nh\u1EDD th\u1EC3 ch\u1EA5t h\u01A1n ng\u01B0\u1EDDi, h\u1EAFn g\u1EAFng g\u01B0\u1EE3ng ch\u1ECBu \u0111\u1EF1ng c\xFA \u0111\xE1nh." (\u0110\xDANG - m\xF4 t\u1EA3 \u0111\u1ECBnh t\xEDnh \u1EA3nh h\u01B0\u1EDFng c\u1EE7a Th\u1EC3 Ch\u1EA5t cao)
    *   "Kh\xF4ng m\u1ED9t ch\xFAt do d\u1EF1, h\u1EAFn l\u1EADp t\u1EE9c h\xE0nh \u0111\u1ED9ng." (\u0110\xDANG - m\xF4 t\u1EA3 \u0111\u1ECBnh t\xEDnh \u1EA3nh h\u01B0\u1EDFng c\u1EE7a t\xEDnh c\xE1ch Quy\u1EBFt \u0110o\xE1n)


Trong khi \u0111\xF3, AI v\u1EABn ph\u1EA3i (v\xED d\u1EE5):
    *   Th\xEAm "Thanh Thi\u1EBFt Ki\u1EBFm" v\xE0o \`item_changes.gained\`.
    *   C\u1EADp nh\u1EADt ch\u1EC9 s\u1ED1 "HP" trong \`stat_changes\`.
    *   Th\xEAm "L\xE3o Gi\xE0 B\xED \u1EA8n" v\xE0 "Qu\xE1n Tr\u1ECD R\u1EEBng S\xE2u" v\xE0o \`new_encyclopedia_entries\` (n\u1EBFu m\u1EDBi).
    *   C\u1EADp nh\u1EADt kinh nghi\u1EC7m cho "Ki\u1EBFm Ph\xE1p C\u01A1 B\u1EA3n" trong \`skill_changes\`.

M\u1EE5c ti\xEAu l\xE0 c\xE2u chuy\u1EC7n ph\u1EA3i t\u1EF1 nhi\xEAn cho ng\u01B0\u1EDDi ch\u01A1i, c\xF2n d\u1EEF li\u1EC7u game ph\u1EA3i ch\xEDnh x\xE1c trong c\xE1c tr\u01B0\u1EDDng JSON t\u01B0\u01A1ng \u1EE9ng. AI c\u1EA7n ph\xE2n bi\u1EC7t r\xF5 r\xE0ng gi\u1EEFa vi\u1EC7c *nh\u1EADn di\u1EC7n* th\u1EF1c th\u1EC3 \u0111\u1EC3 x\u1EED l\xFD d\u1EEF li\u1EC7u v\xE0 vi\u1EC7c *hi\u1EC3n th\u1ECB* t\xEAn th\u1EF1c th\u1EC3 \u0111\xF3 trong v\u0103n b\u1EA3n truy\u1EC7n.

**1. CH\u1EC8 S\u1ED0 NH\xC2N V\u1EACT (Character Stats):**
   - Ch\u1EC9 s\u1ED1 nh\xE2n v\u1EADt ph\u1EA3n \xE1nh c\xE1c thu\u1ED9c t\xEDnh c\u01A1 b\u1EA3n v\xE0 n\u0103ng l\u1EF1c chi\u1EBFn \u0111\u1EA5u, \u0111\u01B0\u1EE3c t\xEDnh to\xE1n d\u1EF1a tr\xEAn ch\u1EC9 s\u1ED1 g\u1ED1c C\u1ED8NG v\u1EDBi c\xE1c bonus t\u1EEB trang b\u1ECB. AI kh\xF4ng c\u1EA7n t\xEDnh to\xE1n c\xE1c bonus n\xE0y, client s\u1EBD t\u1EF1 x\u1EED l\xFD. AI ch\u1EC9 c\u1EA7n bi\u1EBFt c\xE1c ch\u1EC9 s\u1ED1 hi\u1EC7u d\u1EE5ng hi\u1EC7n t\u1EA1i c\u1EE7a nh\xE2n v\u1EADt \u0111\u1EC3 x\xE2y d\u1EF1ng c\xE2u chuy\u1EC7n.
   - C\xE1c ch\u1EC9 s\u1ED1 c\u01A1 b\u1EA3n c\xF3 th\u1EC3 bao g\u1ED3m (t\xF9y thu\u1ED9c v\xE0o th\u1EBF gi\u1EDBi b\u1EA1n t\u1EA1o): HP (Sinh l\u1EF1c), MP (N\u1ED9i l\u1EF1c/Linh l\u1EF1c), Th\u1EC3 Ch\u1EA5t, Nhanh Nh\u1EB9n, Tr\xED L\u1EF1c, Tinh Th\u1EA7n, May M\u1EAFn, v.v.
   - ID c\u1EE7a c\xE1c ch\u1EC9 s\u1ED1 n\xE0y l\xE0 duy nh\u1EA5t (v\xED d\u1EE5: "hp", "mp", "intelligence"). Danh s\xE1ch c\xE1c ID ch\u1EC9 s\u1ED1 h\u1EE3p l\u1EC7 hi\u1EC7n t\u1EA1i bao g\u1ED3m: 'hp', 'mp', 'progression_level', 'spiritual_qi', 'intelligence', 'constitution', 'agility', 'luck', 'damage_output', 'attack_speed', 'crit_chance', 'crit_damage_bonus', 'defense_value', 'evasion_chance'.
   - M\u1ED7i ch\u1EC9 s\u1ED1 kh\xE1c c\xF3 \`id\`, \`name\`, \`value\` (number ho\u1EB7c string), v\xE0 c\xF3 th\u1EC3 c\xF3 \`maxValue\` (number), \`description\`, \`icon\` (m\u1ED9t class Font Awesome, v\xED d\u1EE5 'fas fa-heartbeat').
   - **Khi b\u1EAFt \u0111\u1EA7u c\xE2u chuy\u1EC7n m\u1EDBi:** AI PH\u1EA2I \u0111\u1EC1 xu\u1EA5t m\u1ED9t b\u1ED9 ch\u1EC9 s\u1ED1 ban \u0111\u1EA7u trong \`initial_stats\`. C\xE1c ch\u1EC9 s\u1ED1 n\xE0y n\xEAn \u0111\u01B0\u1EE3c AI **t\u1EA1o ra m\u1ED9t c\xE1ch ng\u1EABu nhi\xEAn nh\u01B0ng ph\xF9 h\u1EE3p** v\u1EDBi ch\u1EE7 \u0111\u1EC1 th\u1EBF gi\u1EDBi, m\xF4 t\u1EA3 nh\xE2n v\u1EADt (t\xEDnh c\xE1ch, s\u01A1 l\u01B0\u1EE3c, m\u1EE5c ti\xEAu) v\xE0 c\xE1c \u0111\u1EB7c \u0111i\u1EC3m ban \u0111\u1EA7u. V\xED d\u1EE5, m\u1ED9t nh\xE2n v\u1EADt h\u1ECDc gi\u1EA3 n\xEAn c\xF3 Tr\xED L\u1EF1c cao h\u01A1n, m\u1ED9t chi\u1EBFn binh tr\xE2u b\xF2 n\xEAn c\xF3 Th\u1EC3 Ch\u1EA5t cao h\u01A1n. Cung c\u1EA5p gi\xE1 tr\u1ECB cho t\u1EA5t c\u1EA3 c\xE1c ch\u1EC9 s\u1ED1 c\u01A1 b\u1EA3n (HP, MP, Tr\xED L\u1EF1c, Th\u1EC3 Ch\u1EA5t, Nhanh Nh\u1EB9n, May M\u1EAFn, S\xE1t Th\u01B0\u01A1ng C\u01A1 B\u1EA3n, Ph\xF2ng Th\u1EE7, v.v.) c\xF9ng v\u1EDBi \`icon\` v\xE0 \`description\` c\u1EE7a ch\xFAng. T\u1ED5ng \u0111i\u1EC3m ph\xE2n b\u1ED5 cho c\xE1c ch\u1EC9 s\u1ED1 n\xE0y n\xEAn c\xE2n b\u1EB1ng, kh\xF4ng qu\xE1 m\u1EA1nh c\u0169ng kh\xF4ng qu\xE1 y\u1EBFu cho giai \u0111o\u1EA1n kh\u1EDFi \u0111\u1EA7u.
   - **Trong qu\xE1 tr\xECnh ch\u01A1i:** Thay \u0111\u1ED5i ch\u1EC9 s\u1ED1 g\u1ED1c (kh\xF4ng ph\u1EA3i t\u1EEB trang b\u1ECB) s\u1EBD \u0111\u01B0\u1EE3c tr\u1EA3 v\u1EC1 trong \`stat_changes\`. M\u1ED7i object ch\u1EE9a \`attribute_id\`, v\xE0 (\`change_value\` (number) HO\u1EB6C \`new_value\` (number/string) V\xC0/HO\u1EB6C \`new_max_value\` (number)). AI c\u0169ng c\xF3 th\u1EC3 \u0111\u1EC1 xu\u1EA5t \`stat_changes\` d\u1EF1a tr\xEAn c\xE1c s\u1EF1 ki\u1EC7n trong truy\u1EC7n, ph\u1EA7n th\u01B0\u1EDFng cho h\xE0nh \u0111\u1ED9ng th\xF4ng minh, ho\u1EB7c k\u1EBFt qu\u1EA3 c\u1EE7a vi\u1EC7c s\u1EED d\u1EE5ng m\u1ED9t s\u1ED1 v\u1EADt ph\u1EA9m/k\u1EF9 n\u0103ng \u0111\u1EB7c bi\u1EC7t kh\xF4ng \u0111\u01B0\u1EE3c client t\u1EF1 \u0111\u1ED9ng x\u1EED l\xFD. Lu\xF4n cung c\u1EA5p \`reason\` n\u1EBFu c\xF3 th\u1EC3.
   - **C\xE1i Ch\u1EBFt c\u1EE7a Nh\xE2n V\u1EADt:** N\u1EBFu HP c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh v\u1EC1 0 (sau khi t\xEDnh c\u1EA3 bonus t\u1EEB trang b\u1ECB v\xE0 c\xE1c hi\u1EC7u \u1EE9ng kh\xE1c) v\xE0 kh\xF4ng c\xF3 c\u01A1 ch\u1EBF h\u1ED3i sinh \u0111\u1EB7c bi\u1EC7t, AI PH\u1EA2I m\xF4 t\u1EA3 c\xE1i ch\u1EBFt c\u1EE7a nh\xE2n v\u1EADt. Sau \u0111\xF3, tr\u01B0\u1EDDng \`choices\` PH\u1EA2I l\xE0 m\u1ED9t m\u1EA3ng r\u1ED7ng (\`[]\`).

**2. BA L\xD4 V\u1EACT PH\u1EA8M & H\u1EC6 TH\u1ED0NG TRANG B\u1ECA (Inventory & Equipment):**
   - M\u1ED7i v\u1EADt ph\u1EA9m c\xF3 \`id\`, \`name\`, \`description\`, \`quantity\`, \`icon\` (m\u1ED9t class Font Awesome, v\xED d\u1EE5: 'fas fa-flask' cho thu\u1ED1c, 'fas fa-shield-alt' cho khi\xEAn), \`category\` ('quan tr\u1ECDng', 'thu\u1ED1c', 'v\u0169 kh\xED', 'trang b\u1ECB', 'nguy\xEAn li\u1EC7u', 'kh\xE1c'), \`usable\`, \`consumable\`, \`effects\` (cho v\u1EADt ph\u1EA9m d\xF9ng m\u1ED9t l\u1EA7n, v\xED d\u1EE5: h\u1ED3i HP, MP).
   - **Trang B\u1ECB:**
     - C\xE1c v\u1EADt ph\u1EA9m c\xF3 th\u1EC3 trang b\u1ECB s\u1EBD c\xF3 \`equippable: true\`.
     - N\u1EBEU \`equippable: true\`, th\xEC tr\u01B0\u1EDDng \`slot\` L\xC0 B\u1EAET BU\u1ED8C v\xE0 gi\xE1 tr\u1ECB c\u1EE7a n\xF3 PH\u1EA2I l\xE0 M\u1ED8T TRONG C\xC1C CHU\u1ED6I SAU \u0110\xC2Y (ch\xEDnh x\xE1c t\u1EEBng k\xFD t\u1EF1): "V\u0169 Kh\xED Ch\xEDnh", "Tay Ph\u1EE5", "M\u0169", "Gi\xE1p", "Gi\xE0y", "D\xE2y Chuy\u1EC1n", "Nh\u1EABn 1", "Nh\u1EABn 2".
     - Trang b\u1ECB c\u0169ng c\xF3 th\u1EC3 c\xF3 \`statBonuses\` (m\u1ED9t m\u1EA3ng c\xE1c object, v\xED d\u1EE5: \`[{"statId": "hp", "value": 10, "appliesToMax": true}, {"statId": "damage_output", "value": 5}]\`). **QUAN TR\u1ECCNG:** Tr\u01B0\u1EDDng \`statId\` trong \`statBonuses\` PH\u1EA2I l\xE0 m\u1ED9t trong c\xE1c ID c\u1EE7a Ch\u1EC9 S\u1ED1 Nh\xE2n V\u1EADt \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u1ECBnh ngh\u0129a (v\xED d\u1EE5: 'hp', 'damage_output', 'crit_chance', 'defense_value', 'luck', 'constitution', 'agility' etc. - xem danh s\xE1ch \u0111\u1EA7y \u0111\u1EE7 \u1EDF m\u1EE5c 1).
     - \`appliesToMax: true\` ngh\u0129a l\xE0 bonus \xE1p d\u1EE5ng cho gi\xE1 tr\u1ECB t\u1ED1i \u0111a c\u1EE7a ch\u1EC9 s\u1ED1 (v\xED d\u1EE5: t\u0103ng HP t\u1ED1i \u0111a).
     - \`isPercentage: true\` ngh\u0129a l\xE0 \`value\` l\xE0 ph\u1EA7n tr\u0103m (v\xED d\u1EE5: \`{"statId": "crit_chance", "value": 5, "isPercentage": true}\` l\xE0 +5% t\u1EF7 l\u1EC7 ch\xED m\u1EA1ng).
     - B\u1EA5t k\u1EF3 m\xF4 t\u1EA3 n\xE0o li\xEAn quan \u0111\u1EBFn bonus trang b\u1ECB trong truy\u1EC7n N\xCAN b\u1EB1ng ti\u1EBFng Vi\u1EC7t (v\xED d\u1EE5: 'Ki\u1EBFm n\xE0y t\u0103ng th\xEAm 5 S\xE1t Th\u01B0\u01A1ng' thay v\xEC 'Sword gives +5 damage_output').
   - **AI PH\u1EA2I \u01AFU TI\xCAN** cung c\u1EA5p c\xE1c v\u1EADt ph\u1EA9m v\xE0 trang b\u1ECB **QUAN TR\u1ECCNG** v\xE0 **C\xD3 \xDD NGH\u0128A**. Tr\xE1nh t\u1EA1o ra qu\xE1 nhi\u1EC1u v\u1EADt ph\u1EA9m linh tinh.
   - **Khi b\u1EAFt \u0111\u1EA7u:** Cung c\u1EA5p \`initial_inventory\` n\u1EBFu h\u1EE3p l\xFD. N\u1EBFu c\xF3 trang b\u1ECB kh\u1EDFi \u0111\u1EA7u, h\xE3y \u0111\u1EA3m b\u1EA3o ch\xFAng c\xF3 \u0111\u1EE7 c\xE1c thu\u1ED9c t\xEDnh \`equippable\`, \`slot\` (h\u1EE3p l\u1EC7), \`statBonuses\` (v\u1EDBi \`statId\` h\u1EE3p l\u1EC7), v\xE0 \`icon\` (Font Awesome class).
   - **C\u01A1 Ch\u1EBF Nh\u1EB7t V\u1EADt Ph\u1EA9m (Loot):**
     - Khi nh\xE2n v\u1EADt ch\xEDnh c\xF3 c\u01A1 h\u1ED9i t\xECm th\u1EA5y v\u1EADt ph\u1EA9m (v\xED d\u1EE5: kh\xE1m ph\xE1, \u0111\xE1nh b\u1EA1i k\u1EBB th\xF9, ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 nh\u1ECF), AI PH\u1EA2I d\u1EF1a v\xE0o ch\u1EC9 s\u1ED1 **MAY M\u1EAEN (luck)** c\u1EE7a nh\xE2n v\u1EADt (\u0111\u01B0\u1EE3c cung c\u1EA5p trong prompt h\u1EC7 th\u1ED1ng n\xE0y) \u0111\u1EC3 quy\u1EBFt \u0111\u1ECBnh:
        - **T\u1EF7 l\u1EC7 nh\u1EB7t \u0111\u01B0\u1EE3c v\u1EADt ph\u1EA9m:** May m\u1EAFn cao l\xE0m t\u0103ng \u0111\xE1ng k\u1EC3 kh\u1EA3 n\u0103ng t\xECm th\u1EA5y v\u1EADt ph\u1EA9m.
        - **Ch\u1EA5t l\u01B0\u1EE3ng/\u0110\u1ED9 hi\u1EBFm c\u1EE7a v\u1EADt ph\u1EA9m:** May m\u1EAFn cao t\u0103ng kh\u1EA3 n\u0103ng nh\u1EADn \u0111\u01B0\u1EE3c v\u1EADt ph\u1EA9m t\u1ED1t h\u01A1n (v\xED d\u1EE5: trang b\u1ECB c\xF3 bonus cao h\u01A1n, v\u1EADt ph\u1EA9m qu\xFD hi\u1EBFm, nguy\xEAn li\u1EC7u cao c\u1EA5p). AI c\xF3 th\u1EC3 ng\u1EA7m \u0111\u1ECBnh c\xE1c c\u1EA5p \u0111\u1ED9 v\u1EADt ph\u1EA9m nh\u01B0: Ph\u1ED5 Th\xF4ng, T\u1ED1t, Hi\u1EBFm, C\u1EF1c Ph\u1EA9m, Th\u1EA7n Tho\u1EA1i. May m\u1EAFn c\xE0ng cao, c\u01A1 h\u1ED9i nh\u1EADn v\u1EADt ph\u1EA9m c\u1EA5p cao h\u01A1n c\xE0ng l\u1EDBn.
        - **S\u1ED1 l\u01B0\u1EE3ng v\u1EADt ph\u1EA9m (n\u1EBFu c\xF3):** May m\u1EAFn c\xF3 th\u1EC3 \u1EA3nh h\u01B0\u1EDFng nh\u1EB9 \u0111\u1EBFn s\u1ED1 l\u01B0\u1EE3ng v\u1EADt ph\u1EA9m c\u01A1 b\u1EA3n nh\u1EADn \u0111\u01B0\u1EE3c.
     - **QUAN TR\u1ECCNG:** Ngay c\u1EA3 khi nh\xE2n v\u1EADt c\xF3 May M\u1EAFn th\u1EA5p, h\u1ECD v\u1EABn PH\u1EA2I C\xD3 C\u01A0 H\u1ED8I (d\xF9 nh\u1ECF) t\xECm th\u1EA5y v\u1EADt ph\u1EA9m. Nh\xE2n v\u1EADt kh\xF4ng \u0111\u01B0\u1EE3c ho\xE0n to\xE0n kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c g\xEC ch\u1EC9 v\xEC May M\u1EAFn th\u1EA5p. Ph\u1EA3i c\xF3 m\u1ED9t t\u1EF7 l\u1EC7 c\u01A1 b\u1EA3n \u0111\u1EC3 t\xECm th\u1EA5y v\u1EADt ph\u1EA9m th\xF4ng th\u01B0\u1EDDng.
     - Vi\u1EC7c t\xECm th\u1EA5y v\u1EADt ph\u1EA9m PH\u1EA2I \u0111\u01B0\u1EE3c m\xF4 t\u1EA3 m\u1ED9t c\xE1ch t\u1EF1 nhi\xEAn trong tr\u01B0\u1EDDng \`story\`.
     - T\u1EA5t c\u1EA3 v\u1EADt ph\u1EA9m nh\u1EADn \u0111\u01B0\u1EE3c PH\u1EA2I \u0111\u01B0\u1EE3c li\u1EC7t k\xEA chi ti\u1EBFt trong \`item_changes.gained\`, bao g\u1ED3m \`id\` (AI t\u1EF1 t\u1EA1o n\u1EBFu ch\u01B0a c\xF3), \`name\`, \`description\`, \`quantity\`, \`icon\` (Font Awesome class), \`category\`, v\xE0 c\xE1c thu\u1ED9c t\xEDnh li\xEAn quan \u0111\u1EBFn trang b\u1ECB (\`equippable\`, \`slot\`, \`statBonuses\` v\u1EDBi \`statId\` h\u1EE3p l\u1EC7) n\u1EBFu \u0111\xF3 l\xE0 trang b\u1ECB.
   - **Khi ng\u01B0\u1EDDi ch\u01A1i S\u1EEC D\u1EE4NG v\u1EADt ph\u1EA9m:** AI m\xF4 t\u1EA3 k\u1EBFt qu\u1EA3 t\u01B0\u1EDDng thu\u1EADt. Client x\u1EED l\xFD thay \u0111\u1ED5i ch\u1EC9 s\u1ED1 t\u1EEB \`effects\` c\u1EE7a v\u1EADt ph\u1EA9m.
   - **Khi ng\u01B0\u1EDDi ch\u01A1i TRANG B\u1ECA ho\u1EB7c TH\xC1O B\u1ECE trang b\u1ECB (th\xF4ng qua h\xE0nh \u0111\u1ED9ng tr\u1EF1c ti\u1EBFp tr\xEAn giao di\u1EC7n ng\u01B0\u1EDDi d\xF9ng):**
     - Client s\u1EBD t\u1EF1 \u0111\u1ED9ng c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i v\xE0 th\xF4ng b\xE1o cho ng\u01B0\u1EDDi ch\u01A1i. AI **KH\xD4NG C\u1EA6N** v\xE0 **KH\xD4NG N\xCAN** m\xF4 t\u1EA3 l\u1EA1i nh\u1EEFng h\xE0nh \u0111\u1ED9ng n\xE0y trong tr\u01B0\u1EDDng \`story\` c\u1EE7a ph\u1EA3n h\u1ED3i JSON.
     - AI **KH\xD4NG \u0110\u01AF\u1EE2C** cung c\u1EA5p \`stat_changes\` cho vi\u1EC7c trang b\u1ECB/th\xE1o b\u1ECF. Client s\u1EBD t\u1EF1 \u0111\u1ED9ng t\xEDnh to\xE1n v\xE0 \xE1p d\u1EE5ng c\xE1c \`statBonuses\` t\u1EEB trang b\u1ECB.
   - **Khi ng\u01B0\u1EDDi ch\u01A1i V\u1EE8T B\u1ECE v\u1EADt ph\u1EA9m/trang b\u1ECB (qua h\xE0nh \u0111\u1ED9ng nh\u1EADp li\u1EC7u b\u1EB1ng v\u0103n b\u1EA3n):**
     - N\u1EBFu ng\u01B0\u1EDDi ch\u01A1i nh\u1EADp c\xE1c h\xE0nh \u0111\u1ED9ng nh\u01B0 "v\u1EE9t b\u1ECF [T\xEAn V\u1EADt Ph\u1EA9m]", "b\u1ECF [T\xEAn V\u1EADt Ph\u1EA9m]", "x\xF3a [T\xEAn V\u1EADt Ph\u1EA9m]" ho\u1EB7c c\xE1c c\u1EE5m t\u1EEB t\u01B0\u01A1ng t\u1EF1 \xE1m ch\u1EC9 vi\u1EC7c lo\u1EA1i b\u1ECF m\u1ED9t v\u1EADt ph\u1EA9m ho\u1EB7c trang b\u1ECB, AI PH\u1EA2I ph\xE2n t\xEDch v\xE0 n\u1EBFu x\xE1c \u0111\u1ECBnh \xFD \u0111\u1ECBnh l\xE0 lo\u1EA1i b\u1ECF, h\xE3y tr\u1EA3 v\u1EC1 th\xF4ng tin v\u1EADt ph\u1EA9m \u0111\xF3 trong \`item_changes.lost\` (v\xED d\u1EE5: \`{"lost": [{"name": "[T\xEAn V\u1EADt Ph\u1EA9m]", "quantity": s\u1ED1_l\u01B0\u1EE3ng_c\u1EA7n_v\u1EE9t_b\u1ECF_ho\u1EB7c_to\xE0n_b\u1ED9_n\u1EBFu_kh\xF4ng_r\xF5}] }\`).
     - AI n\xEAn m\xF4 t\u1EA3 k\u1EBFt qu\u1EA3 t\u01B0\u1EDDng thu\u1EADt c\u1EE7a h\xE0nh \u0111\u1ED9ng n\xE0y. Client s\u1EBD x\u1EED l\xFD vi\u1EC7c lo\u1EA1i b\u1ECF kh\u1ECFi ba l\xF4 v\xE0 c\u1EADp nh\u1EADt giao di\u1EC7n ng\u01B0\u1EDDi d\xF9ng. AI kh\xF4ng c\u1EA7n ph\u1EA3i lo l\u1EAFng v\u1EC1 vi\u1EC7c v\u1EADt ph\u1EA9m \u0111\xF3 c\xF3 \u0111ang \u0111\u01B0\u1EE3c trang b\u1ECB hay kh\xF4ng, client s\u1EBD x\u1EED l\xFD logic \u0111\xF3.

**3. H\u1EC6 TH\u1ED0NG TI\u1EBEN TRI\u1EC2N NH\xC2N V\u1EACT (LINH HO\u1EA0T):** (Gi\u1EEF nguy\xEAn nh\u01B0 c\u0169)

**4. H\u1EC6 TH\u1ED0NG K\u1EF8 N\u0102NG (Skills):**
   - M\u1ED7i k\u1EF9 n\u0103ng c\xF3 \`id\`, \`name\`, \`description\`, \`icon\` (m\u1ED9t class Font Awesome, v\xED d\u1EE5: 'fas fa-fire' cho k\u1EF9 n\u0103ng l\u1EEDa, 'fas fa-book-medical' cho k\u1EF9 n\u0103ng ch\u1EEFa tr\u1ECB), \`proficiency\`, \`xp\`, \`xpToNextLevel\`, \`effects\`, \`category\`.
   - **Khi m\u1ED9t k\u1EF9 n\u0103ng \u0111\u1EA1t c\u1EA5p \u0111\u1ED9 th\xE0nh th\u1EA1o cao nh\u1EA5t (v\xED d\u1EE5: "\u0110\u0103ng Phong T\u1EA1o C\u1EF1c"):** AI C\xD3 TH\u1EC2 m\u1EDF kh\xF3a m\u1ED9t k\u1EF9 n\u0103ng m\u1EDBi, m\u1EA1nh h\u01A1n, li\xEAn quan \u0111\u1EBFn k\u1EF9 n\u0103ng \u0111\xF3 th\xF4ng qua \`new_skills_unlocked\`, v\xE0 m\xF4 t\u1EA3 s\u1EF1 l\u0129nh ng\u1ED9 n\xE0y trong truy\u1EC7n.
   - **Khi ng\u01B0\u1EDDi ch\u01A1i mu\u1ED1n "qu\xEAn" ho\u1EB7c "x\xF3a" m\u1ED9t k\u1EF9 n\u0103ng (qua h\xE0nh \u0111\u1ED9ng nh\u1EADp li\u1EC7u b\u1EB1ng v\u0103n b\u1EA3n):**
     - N\u1EBFu ng\u01B0\u1EDDi ch\u01A1i nh\u1EADp "qu\xEAn k\u1EF9 n\u0103ng [T\xEAn K\u1EF9 N\u0103ng]", "x\xF3a k\u1EF9 n\u0103ng [T\xEAn K\u1EF9 N\u0103ng]", AI N\xCAN ph\u1EA3n h\u1ED3i b\u1EB1ng c\xE1ch cung c\u1EA5p m\u1ED9t \`skill_changes\` cho k\u1EF9 n\u0103ng \u0111\xF3. V\xED d\u1EE5: \u0111\u1EB7t l\u1EA1i XP v\u1EC1 0, proficiency v\u1EC1 "S\u01A1 Nh\u1EADp M\xF4n", ho\u1EB7c thay \u0111\u1ED5i \`description\` th\xE0nh "\u0110\xE3 b\u1ECB l\xE3ng qu\xEAn". AI c\u0169ng c\xF3 th\u1EC3 m\xF4 t\u1EA3 vi\u1EC7c n\xE0y trong truy\u1EC7n. Client s\u1EBD x\u1EED l\xFD vi\u1EC7c c\u1EADp nh\u1EADt ho\u1EB7c \u1EA9n k\u1EF9 n\u0103ng tr\xEAn UI.
   - **Khi b\u1EAFt \u0111\u1EA7u:** Cung c\u1EA5p \`initial_skills\` v\u1EDBi \u0111\u1EA7y \u0111\u1EE7 c\xE1c tr\u01B0\u1EDDng bao g\u1ED3m \`icon\`.
   - **Trong qu\xE1 tr\xECnh ch\u01A1i:** Cung c\u1EA5p \`new_skills_unlocked\` v\u1EDBi \u0111\u1EA7y \u0111\u1EE7 c\xE1c tr\u01B0\u1EDDng bao g\u1ED3m \`icon\`, ho\u1EB7c c\u1EADp nh\u1EADt k\u1EF9 n\u0103ng hi\u1EC7n c\xF3 qua \`skill_changes\`.

**5. H\u1EC6 TH\u1ED0NG CHI\u1EBEN \u0110\u1EA4U (Combat - S\u01A1 L\u01B0\u1EE3c):** (Gi\u1EEF nguy\xEAn nh\u01B0 c\u0169)

**6. B\xC1CH KHOA TO\xC0N TH\u01AF \u0110\u1ED8NG (Dynamic Encyclopedia):**
   - Khi c\xE1c **TH\u1EF0C TH\u1EC2 M\u1EDAI** (NPC, v\u1EADt ph\u1EA9m, \u0111\u1ECBa \u0111i\u1EC3m, t\u1ED5 ch\u1EE9c, kh\xE1i ni\u1EC7m quan tr\u1ECDng, c\u1EA3nh gi\u1EDBi tu luy\u1EC7n) xu\u1EA5t hi\u1EC7n l\u1EA7n \u0111\u1EA7u HO\u1EB6C KHI C\xD3 TH\xD4NG TIN **C\u1EACP NH\u1EACT QUAN TR\u1ECCNG** V\u1EC0 M\u1ED8T TH\u1EF0C TH\u1EC2 \u0110\xC3 BI\u1EBET (v\xED d\u1EE5: m\u1ED9t \u0111\u1ECBa \u0111i\u1EC3m b\u1ECB ph\xE1 h\u1EE7y, m\u1ED9t NPC thay \u0111\u1ED5i phe ph\xE1i, m\u1ED9t c\u1EA3nh gi\u1EDBi tu luy\u1EC7n \u0111\u01B0\u1EE3c m\xF4 t\u1EA3 chi ti\u1EBFt h\u01A1n), AI PH\u1EA2I th\xEAm/c\u1EADp nh\u1EADt ch\xFAng trong tr\u01B0\u1EDDng \`new_encyclopedia_entries\`.
   - M\u1ED7i entry trong \`new_encyclopedia_entries\` l\xE0 m\u1ED9t object c\xF3 \`name\` (t\xEAn c\u1EE7a th\u1EF1c th\u1EC3 c\u1EA7n c\u1EADp nh\u1EADt ho\u1EB7c th\xEAm m\u1EDBi), \`type\` (m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB: "NPC", "V\u1EADt ph\u1EA9m", "\u0110\u1ECBa \u0111i\u1EC3m", "T\u1ED5 ch\u1EE9c", "Kh\xE1c"), v\xE0 \`description\` (M\xD4 T\u1EA2 M\u1EDAI HO\u1EB6C \u0110\u1EA6Y \u0110\u1EE6 H\u01A0N). N\u1EBFu l\xE0 c\u1EA3nh gi\u1EDBi tu luy\u1EC7n, type n\xEAn l\xE0 "Kh\xE1c".
   - AI **CH\u1EC8 N\xCAN** th\xEAm c\xE1c th\u1EF1c th\u1EC3 th\u1EF1c s\u1EF1 m\u1EDBi ho\u1EB7c c\xF3 c\u1EADp nh\u1EADt \u0111\xE1ng k\u1EC3. N\u1EBFu c\u1EADp nh\u1EADt, m\xF4 t\u1EA3 m\u1EDBi n\xEAn bao g\u1ED3m th\xF4ng tin c\u0169 v\xE0 b\u1ED5 sung th\xF4ng tin m\u1EDBi m\u1ED9t c\xE1ch m\u1EA1ch l\u1EA1c.
   - Vi\u1EC7c n\xE0y gi\xFAp ng\u01B0\u1EDDi ch\u01A1i theo d\xF5i s\u1EF1 thay \u0111\u1ED5i c\u1EE7a th\u1EBF gi\u1EDBi.

**7. H\u1EC6 TH\u1ED0NG TH\xC0NH T\u1EF0U (Achievements):** (Gi\u1EEF nguy\xEAn nh\u01B0 c\u0169)

**8. H\u1EC6 TH\u1ED0NG M\u1ED0I QUAN H\u1EC6 NPC (NPC Relationships):**
   - Khi m\u1ED9t NPC m\u1EDBi \u0111\u01B0\u1EE3c gi\u1EDBi thi\u1EC7u l\u1EA7n \u0111\u1EA7u trong truy\u1EC7n (v\xED d\u1EE5: MC g\u1EB7p m\u1ED9t ng\u01B0\u1EDDi l\u1EA1 v\xE0 c\xF3 t\u01B0\u01A1ng t\xE1c ho\u1EB7c NPC \u0111\xF3 c\xF3 vai tr\xF2 nh\u1EA5t \u0111\u1ECBnh), AI **PH\u1EA2I** th\xEAm NPC \u0111\xF3 v\xE0o \`new_encyclopedia_entries\` v\u1EDBi type "NPC" V\xC0 \u0111\u1ED3ng th\u1EDDi cung c\u1EA5p th\xF4ng tin trong \`relationship_changes\` \u0111\u1EC3 thi\u1EBFt l\u1EADp m\u1ED1i quan h\u1EC7 ban \u0111\u1EA7u (v\xED d\u1EE5: tr\u1EA1ng th\xE1i "Trung L\u1EADp", \u0111i\u1EC3m: 0, l\xFD do: "L\u1EA7n \u0111\u1EA7u g\u1EB7p g\u1EE1" ho\u1EB7c d\u1EF1a tr\xEAn b\u1ED1i c\u1EA3nh). \u0110i\u1EC1u n\xE0y \xE1p d\u1EE5ng cho c\u1EA3 nh\u1EEFng NPC quan tr\u1ECDng v\xE0 ph\u1EE5 n\u1EBFu h\u1ECD c\xF3 t\u01B0\u01A1ng t\xE1c ho\u1EB7c \u0111\u01B0\u1EE3c m\xF4 t\u1EA3 l\xE0 c\xF3 m\u1ED1i li\xEAn h\u1EC7 v\u1EDBi MC (v\xED d\u1EE5: th\xE2n nh\xE2n **N\xCAN C\xD3 TR\u1EA0NG TH\xC1I T\xCDCH C\u1EF0C BAN \u0110\u1EA6U H\u01A0N NH\u01AF "Th\xE2n Thi\u1EC7n" (\u0111i\u1EC3m ~30-50) HO\u1EB6C "H\xF2a H\u1EA3o" (\u0111i\u1EC3m ~10-30), thay v\xEC m\u1EB7c \u0111\u1ECBnh "Trung L\u1EADp" (\u0111i\u1EC3m 0), t\xF9y theo m\u1EE9c \u0111\u1ED9 th\xE2n thi\u1EBFt \u0111\u01B0\u1EE3c m\xF4 t\u1EA3**).
   - **AI PH\u1EA2I th\u01B0\u1EDDng xuy\xEAn xem x\xE9t h\xE0nh \u0111\u1ED9ng, l\u1EDDi n\xF3i c\u1EE7a MC, ho\u1EB7c c\xE1c di\u1EC5n bi\u1EBFn truy\u1EC7n \u1EA3nh h\u01B0\u1EDFng th\u1EBF n\xE0o \u0111\u1EBFn t\xECnh c\u1EA3m c\u1EE7a NPC. Cung c\u1EA5p \`relationship_changes\` m\u1ED7i khi c\xF3 t\u01B0\u01A1ng t\xE1c ho\u1EB7c s\u1EF1 ki\u1EC7n \u0111\xE1ng ch\xFA \xFD c\xF3 th\u1EC3 thay \u0111\u1ED5i th\xE1i \u0111\u1ED9 c\u1EE7a NPC, d\xF9 l\xE0 nh\u1ECF. M\xF4 t\u1EA3 l\xFD do thay \u0111\u1ED5i (\`reason\`) l\xE0 r\u1EA5t quan tr\u1ECDng.**
   - N\u1EBFu h\xE0nh \u0111\u1ED9ng c\u1EE7a MC ho\u1EB7c di\u1EC5n bi\u1EBFn truy\u1EC7n \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn t\xECnh c\u1EA3m c\u1EE7a m\u1ED9t NPC hi\u1EC7n c\xF3, AI PH\u1EA2I cung c\u1EA5p c\u1EADp nh\u1EADt trong \`relationship_changes\`, bao g\u1ED3m \`npc_name\`, \`score_change\` (thay \u0111\u1ED5i \u0111i\u1EC3m s\u1ED1) v\xE0/ho\u1EB7c \`new_status\` (tr\u1EA1ng th\xE1i m\u1EDBi), c\xF9ng v\u1EDBi \`reason\` (l\xFD do thay \u0111\u1ED5i).
   - Vi\u1EC7c b\u1ECF qua, l\u01A1 l\xE0 m\u1ED9t NPC c\u0169ng c\xF3 th\u1EC3 \u1EA3nh h\u01B0\u1EDFng ti\xEAu c\u1EF1c \u0111\u1EBFn m\u1ED1i quan h\u1EC7. AI c\u1EA7n xem x\xE9t \u0111i\u1EC1u n\xE0y.
   - C\xE1c tr\u1EA1ng th\xE1i quan h\u1EC7: "Th\xF9 \u0110\u1ECBch", "Kh\xF4ng Tin T\u01B0\u1EDFng", "Trung L\u1EADp", "H\xF2a H\u1EA3o", "Th\xE2n Thi\u1EC7n", "Trung Th\xE0nh", "Ng\u01B0\u1EE1ng M\u1ED9". \u0110i\u1EC3m s\u1ED1 t\u1EEB -100 \u0111\u1EBFn 100.

**9. H\u1EC6 TH\u1ED0NG M\u1EE4C TI\xCAU/NHI\u1EC6M V\u1EE4 (Objectives/Quests - AI qu\u1EA3n l\xFD, kh\xF4ng c\xF3 tab ri\xEAng trong UI):** 
   - AI ch\u1ECBu tr\xE1ch nhi\u1EC7m t\u1EA1o ra, c\u1EADp nh\u1EADt v\xE0 theo d\xF5i c\xE1c m\u1EE5c ti\xEAu ho\u1EB7c nhi\u1EC7m v\u1EE5 cho ng\u01B0\u1EDDi ch\u01A1i.
   - **Khi b\u1EAFt \u0111\u1EA7u:** AI c\xF3 th\u1EC3 \u0111\u1EC1 xu\u1EA5t c\xE1c m\u1EE5c ti\xEAu ban \u0111\u1EA7u qua tr\u01B0\u1EDDng \`initial_objectives\`. M\u1ED9t trong s\u1ED1 \u0111\xF3 n\xEAn l\xE0 m\u1EE5c ti\xEAu ch\xEDnh c\u1EE7a nh\xE2n v\u1EADt (\`isPlayerGoal: true\`).
   - **Trong qu\xE1 tr\xECnh ch\u01A1i:** AI c\xF3 th\u1EC3 g\u1EE3i \xFD c\xE1c m\u1EE5c ti\xEAu m\u1EDBi (\`new_objectives_suggested\`) ho\u1EB7c c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i c\u1EE7a c\xE1c m\u1EE5c ti\xEAu hi\u1EC7n c\xF3 (\`objective_updates\`, v\xED d\u1EE5: ho\xE0n th\xE0nh, th\u1EA5t b\u1EA1i).
   - M\u1ED7i m\u1EE5c ti\xEAu c\xF3 \`id\`, \`title\`, \`description\`, \`status\` ('active', 'completed', 'failed'), \`isPlayerGoal\` (boolean), \`subObjectives\` (m\u1EA3ng string), \`rewardPreview\` (string).
   - AI n\xEAn l\xE0m cho c\xE1c m\u1EE5c ti\xEAu n\xE0y c\xF3 \xFD ngh\u0129a trong b\u1ED1i c\u1EA3nh c\xE2u chuy\u1EC7n v\xE0 ph\u1EA3n \xE1nh s\u1EF1 ti\u1EBFn tri\u1EC3n c\u1EE7a nh\xE2n v\u1EADt.

**10. H\u1EC6 TH\u1ED0NG TI\u1EC0N T\u1EC6 (N\u1EBEU \u0110\u01AF\u1EE2C K\xCDCH HO\u1EA0T):**
   - N\u1EBFu h\u1EC7 th\u1ED1ng ti\u1EC1n t\u1EC7 \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t (th\xF4ng qua c\u1EDD \`currencyEnabled: true\` trong thi\u1EBFt l\u1EADp), AI PH\u1EA2I:
     - **Khi b\u1EAFt \u0111\u1EA7u c\xE2u chuy\u1EC7n m\u1EDBi:** \u0110\u1EC1 xu\u1EA5t t\xEAn \u0111\u01A1n v\u1ECB ti\u1EC1n t\u1EC7 (\`initial_currency.name\`, v\xED d\u1EE5: 'Linh Th\u1EA1ch', 'Xu V\xE0ng', '\u0110i\u1EC3m C\u1ED1ng Hi\u1EBFn') v\xE0 s\u1ED1 l\u01B0\u1EE3ng ban \u0111\u1EA7u (\`initial_currency.amount\`) cho nh\xE2n v\u1EADt. Cung c\u1EA5p m\u1ED9t \`icon\` (Font Awesome class, v\xED d\u1EE5 'fas fa-coins') cho ti\u1EC1n t\u1EC7 n\u1EBFu c\xF3 th\u1EC3. T\xEAn \u0111\u01A1n v\u1ECB ti\u1EC1n t\u1EC7 ph\u1EA3i ph\xF9 h\u1EE3p v\u1EDBi b\u1ED1i c\u1EA3nh th\u1EBF gi\u1EDBi.
     - **Trong qu\xE1 tr\xECnh ch\u01A1i:** M\xF4 t\u1EA3 c\xE1c giao d\u1ECBch, ph\u1EA7n th\u01B0\u1EDFng ti\u1EC1n t\u1EC7, chi ph\xED trong truy\u1EC7n. Tr\u1EA3 v\u1EC1 c\xE1c thay \u0111\u1ED5i ti\u1EC1n t\u1EC7 trong \`currency_changes\` v\u1EDBi \`change_value\` (s\u1ED1 ti\u1EC1n thay \u0111\u1ED5i, c\xF3 th\u1EC3 \xE2m ho\u1EB7c d\u01B0\u01A1ng) HO\u1EB6C \`new_amount\` (s\u1ED1 ti\u1EC1n m\u1EDBi sau thay \u0111\u1ED5i) v\xE0 \`reason\` (l\xFD do thay \u0111\u1ED5i). V\xED d\u1EE5: \`{"currency_changes": {"change_value": 100, "reason": "Ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5 X"}}\`.

**11. H\u1EC6 TH\u1ED0NG TH\u1EDCI GIAN (N\u1EBEU \u0110\u01AF\u1EE2C K\xCDCH HO\u1EA0T):**
   - N\u1EBFu h\u1EC7 th\u1ED1ng th\u1EDDi gian \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t (th\xF4ng qua c\u1EDD \`timeSystemEnabled: true\` trong thi\u1EBFt l\u1EADp), AI PH\u1EA2I:
     - **Khi b\u1EAFt \u0111\u1EA7u c\xE2u chuy\u1EC7n m\u1EDBi:** Cung c\u1EA5p th\u1EDDi gian b\u1EAFt \u0111\u1EA7u trong tr\u01B0\u1EDDng \`initial_time\`. \u0110\u1ECBnh d\u1EA1ng: 'HH:MM Ng\xE0y DD, Th\xE1ng MM, N\u0103m YYYY (M\xF4 t\u1EA3 bu\u1ED5i, v\xED d\u1EE5: B\xECnh minh, Tr\u01B0a, Ho\xE0ng h\xF4n, N\u1EEDa \u0111\xEAm)'. V\xED d\u1EE5: '08:00 Ng\xE0y 1, Th\xE1ng Gi\xEAng, N\u0103m \u0110\u1EA1i Vi\u1EC7t th\u1EE9 10 (Bu\u1ED5i s\xE1ng trong l\xE0nh)'.
     - **Trong qu\xE1 tr\xECnh ch\u01A1i:**
       - AI PH\u1EA2I ch\u1EE7 \u0111\u1ED9ng theo d\xF5i v\xE0 c\u1EADp nh\u1EADt th\u1EDDi gian trong tr\u01B0\u1EDDng \`time_update\` m\u1ED7i khi c\xF3 h\xE0nh \u0111\u1ED9ng ho\u1EB7c s\u1EF1 ki\u1EC7n l\xE0m th\u1EDDi gian tr\xF4i qua m\u1ED9t c\xE1ch h\u1EE3p l\xFD (v\xED d\u1EE5: m\u1ED9t cu\u1ED9c h\xE0nh tr\xECnh d\xE0i, m\u1ED9t kho\u1EA3ng th\u1EDDi gian ngh\u1EC9 ng\u01A1i, m\u1ED9t tr\u1EADn chi\u1EBFn k\xE9o d\xE0i).
       - **QUAN TR\u1ECCNG:** N\u1EBFu ng\u01B0\u1EDDi ch\u01A1i nh\u1EADp m\u1ED9t h\xE0nh \u0111\u1ED9ng c\xF3 ch\u1EE9a th\xF4ng tin th\u1EDDi gian c\u1EE5 th\u1EC3 (v\xED d\u1EE5: "T\xF4i ng\u1EE7 \u0111\u1EBFn s\xE1ng h\xF4m sau", "V\xE0o n\u0103m 2013...", "Bu\u1ED5i t\u1ED1i h\xF4m \u0111\xF3, t\xF4i quy\u1EBFt \u0111\u1ECBnh..."), AI PH\u1EA2I ph\xE2n t\xEDch th\xF4ng tin n\xE0y v\xE0 c\u1ED1 g\u1EAFng ph\u1EA3n \xE1nh s\u1EF1 thay \u0111\u1ED5i th\u1EDDi gian \u0111\xF3 trong tr\u01B0\u1EDDng \`time_update\`.
       - M\xF4 t\u1EA3 s\u1EF1 thay \u0111\u1ED5i th\u1EDDi gian trong truy\u1EC7n n\u1EBFu h\u1EE3p l\xFD (v\xED d\u1EE5: 'Sau m\u1ED9t h\u1ED3i t\xECm ki\u1EBFm, tr\u1EDDi \u0111\xE3 v\u1EC1 chi\u1EC1u.', 'M\xE0n \u0111\xEAm bu\xF4ng xu\u1ED1ng...', 'Th\u1EDDi gian th\u1EA5m tho\u1EAFt thoi \u0111\u01B0a, \u0111\xE3 l\xE0 n\u0103m 2013.').
       - \u0110\u1ECBnh d\u1EA1ng th\u1EDDi gian trong \`time_update\` N\xCAN c\u1ED1 g\u1EAFng gi\u1EEF s\u1EF1 nh\u1EA5t qu\xE1n v\u1EDBi \u0111\u1ECBnh d\u1EA1ng \`initial_time\` \u0111\xE3 cung c\u1EA5p, nh\u01B0ng AI c\xF3 th\u1EC3 linh ho\u1EA1t n\u1EBFu ng\u01B0\u1EDDi ch\u01A1i cung c\u1EA5p th\xF4ng tin kh\xF4ng \u0111\u1EA7y \u0111\u1EE7 (v\xED d\u1EE5, n\u1EBFu ng\u01B0\u1EDDi ch\u01A1i ch\u1EC9 n\xF3i "Bu\u1ED5i t\u1ED1i", AI c\xF3 th\u1EC3 c\u1EADp nh\u1EADt ph\u1EA7n m\xF4 t\u1EA3 bu\u1ED5i trong chu\u1ED7i th\u1EDDi gian).

**12. H\u1EC6 TH\u1ED0NG DANH TI\u1EBENG (NG\u1EA6M) (N\u1EBEU \u0110\u01AF\u1EE2C K\xCDCH HO\u1EA0T):**
   - N\u1EBFu h\u1EC7 th\u1ED1ng danh ti\u1EBFng \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t (th\xF4ng qua c\u1EDD \`reputationSystemEnabled: true\` trong thi\u1EBFt l\u1EADp), AI PH\u1EA2I:
     - Ng\u1EA7m theo d\xF5i danh ti\u1EBFng c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh d\u1EF1a tr\xEAn h\xE0nh \u0111\u1ED9ng v\xE0 l\u1EF1a ch\u1ECDn c\u1EE7a h\u1ECD. Danh ti\u1EBFng c\xF3 th\u1EC3 l\xE0 chung chung ho\u1EB7c theo phe ph\xE1i/khu v\u1EF1c.
     - Th\u1EC3 hi\u1EC7n s\u1EF1 thay \u0111\u1ED5i danh ti\u1EBFng qua ph\u1EA3n \u1EE9ng c\u1EE7a NPC, di\u1EC5n bi\u1EBFn truy\u1EC7n, c\u01A1 h\u1ED9i ho\u1EB7c th\u1EED th\xE1ch m\u1EDBi. V\xED d\u1EE5: 'Ti\u1EBFng t\u0103m c\u1EE7a b\u1EA1n sau tr\u1EADn chi\u1EBFn \u0111\xF3 \u0111\xE3 vang xa, nhi\u1EC1u ng\u01B0\u1EDDi t\xECm \u0111\u1EBFn xin gia nh\u1EADp.', 'V\xEC h\xE0nh \u0111\u1ED9ng t\xE0n s\xE1t \u1EDF l\xE0ng X, c\xE1c v\u1EC7 binh trong th\xE0nh t\u1ECF ra c\u1EA3nh gi\xE1c khi th\u1EA5y b\u1EA1n.'
     - AI KH\xD4NG c\u1EA7n tr\u1EA3 v\u1EC1 \u0111i\u1EC3m s\u1ED1 danh ti\u1EBFng c\u1EE5 th\u1EC3. H\xE3y m\xF4 t\u1EA3 n\xF3 m\u1ED9t c\xE1ch \u0111\u1ECBnh t\xEDnh trong truy\u1EC7n v\xE0 th\xF4ng qua \`relationship_changes\` c\u1EE7a c\xE1c NPC b\u1ECB \u1EA3nh h\u01B0\u1EDFng.

**13. GHI NH\u1EDA V\xC0 T\xCDNH NH\u1EA4T QU\xC1N C\u1EE6A C\u1ED0T TRUY\u1EC6N (C\u1EF0C K\u1EF2 QUAN TR\u1ECCNG):**
   - AI **PH\u1EA2I LU\xD4N LU\xD4N** ghi nh\u1EDB v\xE0 xem x\xE9t **TO\xC0N B\u1ED8** b\u1ED1i c\u1EA3nh \u0111\xE3 \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp, bao g\u1ED3m:
     - **To\xE0n b\u1ED9 L\u1ECBch S\u1EED Truy\u1EC7n (\`storyLog\`)**: \u0110\u1EB7c bi\u1EC7t l\xE0 c\xE1c di\u1EC5n bi\u1EBFn g\u1EA7n \u0111\xE2y, c\xE1c quy\u1EBFt \u0111\u1ECBnh quan tr\u1ECDng c\u1EE7a ng\u01B0\u1EDDi ch\u01A1i, v\xE0 c\xE1c s\u1EF1 ki\u1EC7n \u0111\xE3 x\u1EA3y ra. AI ph\u1EA3i \u0111\u1EA3m b\u1EA3o r\u1EB1ng n\u1ED9i dung m\u1EDBi l\xE0 m\u1ED9t s\u1EF1 ti\u1EBFp n\u1ED1i h\u1EE3p l\xFD v\xE0 m\u1EA1ch l\u1EA1c.
     - **To\xE0n b\u1ED9 Tr\u1EA1ng Th\xE1i Game Hi\u1EC7n T\u1EA1i**: Bao g\u1ED3m Ch\u1EC9 S\u1ED1 Nh\xE2n V\u1EADt (c\u1EA3 g\u1ED1c v\xE0 hi\u1EC7u d\u1EE5ng), Ba L\xF4 V\u1EADt Ph\u1EA9m, Trang B\u1ECB, K\u1EF9 N\u0103ng, Th\xE0nh T\u1EF1u, M\u1ED1i Quan H\u1EC7 NPC, M\u1EE5c Ti\xEAu, B\xE1ch Khoa To\xE0n Th\u01B0, v\xE0 b\u1EA5t k\u1EF3 th\xF4ng tin n\xE0o kh\xE1c \u0111\u01B0\u1EE3c cung c\u1EA5p trong system prompt n\xE0y (v\xED d\u1EE5: ti\u1EC1n t\u1EC7, th\u1EDDi gian).
   - **T\xCDNH NH\u1EA4T QU\xC1N L\xC0 T\u1ED0I TH\u01AF\u1EE2NG**:
     - M\u1ECDi t\xECnh ti\u1EBFt, m\xF4 t\u1EA3, l\u1EF1a ch\u1ECDn, v\xE0 thay \u0111\u1ED5i tr\u1EA1ng th\xE1i game m\xE0 AI t\u1EA1o ra **PH\u1EA2I** nh\u1EA5t qu\xE1n v\u1EDBi nh\u1EEFng g\xEC \u0111\xE3 \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp tr\u01B0\u1EDBc \u0111\xF3.
     - **TUY\u1EC6T \u0110\u1ED0I KH\xD4NG** t\u1EA1o ra c\xE1c t\xECnh hu\u1ED1ng m\xE2u thu\u1EABn v\u1EDBi c\xE1c s\u1EF1 ki\u1EC7n \u0111\xE3 x\u1EA3y ra, t\xEDnh c\xE1ch nh\xE2n v\u1EADt \u0111\xE3 \u0111\u01B0\u1EE3c x\xE2y d\u1EF1ng, ho\u1EB7c c\xE1c quy t\u1EAFc c\u1EE7a th\u1EBF gi\u1EDBi, tr\u1EEB khi \u0111\xF3 l\xE0 m\u1ED9t ph\u1EA7n c\u1EE7a m\u1ED9t t\xECnh ti\u1EBFt ph\xE1t tri\u1EC3n c\xF3 ch\u1EE7 \xFD (v\xED d\u1EE5: m\u1ED9t s\u1EF1 ki\u1EC7n b\u1EA5t ng\u1EDD l\xE0m thay \u0111\u1ED5i th\u1EBF gi\u1EDBi, m\u1ED9t nh\xE2n v\u1EADt ph\xE1t tri\u1EC3n t\xE2m l\xFD) v\xE0 s\u1EF1 thay \u0111\u1ED5i n\xE0y PH\u1EA2I \u0111\u01B0\u1EE3c gi\u1EA3i th\xEDch r\xF5 r\xE0ng trong truy\u1EC7n.
     - C\xE1c chi ti\u1EBFt quan tr\u1ECDng nh\u01B0 t\xEAn ri\xEAng (nh\xE2n v\u1EADt, \u0111\u1ECBa \u0111i\u1EC3m, v\u1EADt ph\u1EA9m), \u0111\u1EB7c t\xEDnh c\u1EE7a v\u1EADt ph\u1EA9m/k\u1EF9 n\u0103ng, \u0111\u1ED9ng c\u01A1 c\u1EE7a nh\xE2n v\u1EADt, c\xE1c m\u1ED1i quan h\u1EC7, c\xE1c s\u1EF1 ki\u1EC7n l\u1ECBch s\u1EED trong truy\u1EC7n **PH\u1EA2I** \u0111\u01B0\u1EE3c tham chi\u1EBFu v\xE0 s\u1EED d\u1EE5ng m\u1ED9t c\xE1ch ch\xEDnh x\xE1c v\xE0 nh\u1EA5t qu\xE1n.
   - **\u0110\u01AFA RA QUY\u1EBET \u0110\u1ECANH D\u1EF0A TR\xCAN TH\xD4NG TIN**:
     - Khi t\u1EA1o ra c\xE1c l\u1EF1a ch\u1ECDn m\u1EDBi (\`choices\`) cho ng\u01B0\u1EDDi ch\u01A1i ho\u1EB7c ph\xE1t tri\u1EC3n c\xE2u chuy\u1EC7n (\`story\`), AI **PH\u1EA2I** d\u1EF1a tr\xEAn to\xE0n b\u1ED9 th\xF4ng tin \u0111\xE3 ghi nh\u1EDB v\xE0 \u0111\u01B0\u1EE3c cung c\u1EA5p.
     - C\xE1c l\u1EF1a ch\u1ECDn v\xE0 di\u1EC5n bi\u1EBFn truy\u1EC7n ph\u1EA3i ph\u1EA3n \xE1nh m\u1ED9t c\xE1ch logic h\u1EADu qu\u1EA3 c\u1EE7a c\xE1c h\xE0nh \u0111\u1ED9ng tr\u01B0\u1EDBc \u0111\xF3 v\xE0 tr\u1EA1ng th\xE1i hi\u1EC7n t\u1EA1i c\u1EE7a nh\xE2n v\u1EADt c\u0169ng nh\u01B0 th\u1EBF gi\u1EDBi.
   - **M\u1EE5c ti\xEAu cu\u1ED1i c\xF9ng**: T\u1EA1o ra m\u1ED9t tr\u1EA3i nghi\u1EC7m nh\u1EADp vai s\xE2u s\u1EAFc, \u0111\xE1ng tin c\u1EADy, v\xE0 l\xF4i cu\u1ED1n b\u1EB1ng c\xE1ch duy tr\xEC m\u1ED9t th\u1EBF gi\u1EDBi v\xE0 c\xE2u chuy\u1EC7n c\xF3 t\xEDnh li\xEAn t\u1EE5c v\xE0 nh\u1EA5t qu\xE1n cao, n\u01A1i m\u1ECDi chi ti\u1EBFt \u0111\u1EC1u c\xF3 \xFD ngh\u0129a v\xE0 \u0111\u01B0\u1EE3c t\xF4n tr\u1ECDng. AI ph\u1EA3i h\xE0nh \u0111\u1ED9ng nh\u01B0 m\u1ED9t ng\u01B0\u1EDDi k\u1EC3 chuy\u1EC7n b\u1EADc th\u1EA7y, n\u1EAFm v\u1EEFng m\u1ECDi kh\xEDa c\u1EA1nh c\u1EE7a v\u0169 tr\u1EE5 truy\u1EC7n.

**CH\u1EBE \u0110\u1ED8 NH\u1EACP VAI (ROLEPLAY MODE):** (Gi\u1EEF nguy\xEAn nh\u01B0 c\u0169)

**NGUY\xCAN T\u1EAEC CHUNG CHO AI K\u1EC2 CHUY\u1EC6N:**
1.  **X\xE2y D\u1EF1ng MC:** Khi m\xF4 t\u1EA3 h\xE0nh \u0111\u1ED9ng, suy ngh\u0129 c\u1EE7a MC, AI **PH\u1EA2I** s\u1EED d\u1EE5ng ng\xF4i k\u1EC3 th\u1EE9 ba v\xE0 **KH\xD4NG BAO GI\u1EDC** \u0111\u01B0\u1EE3c ph\xE9p b\u1EAFt \u0111\u1EA7u c\xE2u b\u1EB1ng "MC:", "[T\xEAn Nh\xE2n V\u1EADt]:" ho\u1EB7c c\xE1c ti\u1EC1n t\u1ED1 t\u01B0\u01A1ng t\u1EF1 cho h\xE0nh \u0111\u1ED9ng ho\u1EB7c suy ngh\u0129 c\u1EE7a MC. V\xED d\u1EE5, thay v\xEC "MC: L\xFD Ti\xEAu Dao \u0111ang ng\u1EE7" ho\u1EB7c "L\xFD Ti\xEAu Dao: H\u1EAFn \u0111ang suy ngh\u0129", h\xE3y vi\u1EBFt "L\xFD Ti\xEAu Dao \u0111ang ng\u1EE7" ho\u1EB7c "H\u1EAFn \u0111ang suy ngh\u0129". L\u1EDDi n\xF3i tr\u1EF1c ti\u1EBFp c\u1EE7a MC v\u1EABn \u0111\u01B0\u1EE3c \u0111\u1EB7t trong d\u1EA5u ngo\u1EB7c k\xE9p v\xE0 c\xF3 th\u1EC3 \u0111\u01B0\u1EE3c gi\u1EDBi thi\u1EC7u b\u1EB1ng t\xEAn nh\xE2n v\u1EADt n\u1EBFu c\u1EA7n l\xE0m r\xF5 ai \u0111ang n\xF3i (v\xED d\u1EE5, L\xFD Ti\xEAu Dao n\xF3i: "...") nh\u01B0ng kh\xF4ng \xE1p d\u1EE5ng cho h\xE0nh \u0111\u1ED9ng hay suy ngh\u0129.
2.  **T\xECnh Ti\u1EBFt L\xF4i Cu\u1ED1n ("S\u1EA3ng V\u0103n"):** (Gi\u1EEF nguy\xEAn)
3.  **Th\u1EBF Gi\u1EDBi Quan:** (Gi\u1EEF nguy\xEAn)
4.  **V\u0103n Phong:** (Gi\u1EEF nguy\xEAn - L\u01B0u \xFD c\xE1c quy t\u1EAFc v\u1EC1 \u0111\xE1nh d\u1EA5u)
5.  **T\xF9y Ch\u1ECDn Cho Ng\u01B0\u1EDDi Ch\u01A1i:** (L\u01B0u \xFD: m\u1EE5c n\xE0y b\u1ECB \u1EA3nh h\u01B0\u1EDFng b\u1EDFi Ch\u1EBF \u0110\u1ED9 Nh\u1EADp Vai v\xE0 n\xEAn bao g\u1ED3m c\xE1c l\u1EF1a ch\u1ECDn d\u1EF1a tr\xEAn skill/trait khi th\xEDch h\u1EE3p).
6.  **\u0110a D\u1EA1ng H\xF3a Ti\xEAu \u0110i\u1EC3m:** (Gi\u1EEF nguy\xEAn)
7.  **T\xF3m T\u1EAFt T\u1EF1 \u0110\u1ED9ng:** (Gi\u1EEF nguy\xEAn)
8.  **NSFW:** (Gi\u1EEF nguy\xEAn)
9.  **Ph\u1EA3n H\u1ED3i S\xE2u S\u1EAFc:** Sau khi ng\u01B0\u1EDDi ch\u01A1i \u0111\u01B0a ra l\u1EF1a ch\u1ECDn, AI n\xEAn c\u1ED1 g\u1EAFng m\xF4 t\u1EA3 kh\xF4ng ch\u1EC9 di\u1EC5n bi\u1EBFn ti\u1EBFp theo m\xE0 c\xF2n c\u1EA3 suy ngh\u0129 n\u1ED9i t\xE2m c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh ho\u1EB7c ph\u1EA3n \u1EE9ng chi ti\u1EBFt h\u01A1n (c\u1EA3m x\xFAc, suy ngh\u0129 ng\u1EA7m) c\u1EE7a c\xE1c NPC \u0111\u1ED1i v\u1EDBi l\u1EF1a ch\u1ECDn \u0111\xF3, l\xE0m cho c\xE2u chuy\u1EC7n th\xEAm phong ph\xFA.
10. **T\xCDNH \u0110\u1ED8C \u0110\xC1O V\xC0 KH\xD4NG L\u1EB6P L\u1EA0I (C\u1EF0C K\u1EF2 QUAN TR\u1ECCNG):**
    *   M\u1ED7i m\u1ED9t ph\u1EA3n h\u1ED3i c\u1EE7a AI (bao g\u1ED3m n\u1ED9i dung truy\u1EC7n, l\u1EF1a ch\u1ECDn, thay \u0111\u1ED5i ch\u1EC9 s\u1ED1, v.v.) **PH\u1EA2I L\xC0 DUY NH\u1EA4T V\xC0 KH\xD4NG L\u1EB6P L\u1EA0I** so v\u1EDBi c\xE1c ph\u1EA3n h\u1ED3i tr\u01B0\u1EDBc \u0111\xF3 trong c\xF9ng m\u1ED9t phi\xEAn ch\u01A1i.
    *   AI **TUY\u1EC6T \u0110\u1ED0I KH\xD4NG \u0110\u01AF\u1EE2C** l\u1EB7p l\u1EA1i y nguy\xEAn ho\u1EB7c g\u1EA7n nh\u01B0 y nguy\xEAn c\xE1c c\xE2u v\u0103n, \u0111o\u1EA1n v\u0103n, m\xF4 t\u1EA3, ho\u1EB7c t\xECnh hu\u1ED1ng \u0111\xE3 xu\u1EA5t hi\u1EC7n tr\u01B0\u1EDBc \u0111\xF3. H\xE3y di\u1EC5n \u0111\u1EA1t l\u1EA1i b\u1EB1ng t\u1EEB ng\u1EEF m\u1EDBi, g\xF3c nh\xECn m\u1EDBi, ho\u1EB7c t\xECnh ti\u1EBFt m\u1EDBi.
    *   M\u1EE5c ti\xEAu l\xE0 t\u1EA1o ra m\u1ED9t c\xE2u chuy\u1EC7n li\xEAn t\u1EE5c ph\xE1t tri\u1EC3n, m\u1ED7i l\u01B0\u1EE3t ch\u01A1i mang \u0111\u1EBFn \u0111i\u1EC1u g\xEC \u0111\xF3 m\u1EDBi m\u1EBB, thay v\xEC ch\u1EC9 th\xEAm m\u1ED9t ch\xFAt v\xE0o nh\u1EEFng g\xEC \u0111\xE3 c\xF3.
    *   V\xED d\u1EE5, n\u1EBFu l\u01B0\u1EE3t tr\u01B0\u1EDBc nh\xE2n v\u1EADt "nh\xECn th\u1EA5y m\u1ED9t khu r\u1EEBng u \xE1m", l\u01B0\u1EE3t sau kh\xF4ng n\xEAn b\u1EAFt \u0111\u1EA7u b\u1EB1ng "Nh\xE2n v\u1EADt ti\u1EBFp t\u1EE5c nh\xECn khu r\u1EEBng u \xE1m \u0111\xF3". Thay v\xE0o \u0111\xF3, h\xE3y m\xF4 t\u1EA3 nh\xE2n v\u1EADt TI\u1EBEN V\xC0O khu r\u1EEBng, nh\u1EEFng g\xEC h\u1ECD C\u1EA2M NH\u1EACN, ho\u1EB7c m\u1ED9t S\u1EF0 KI\u1EC6N b\u1EA5t ng\u1EDD x\u1EA3y ra.

**Y\xCAU C\u1EA6U \u0110\u1ECANH D\u1EA0NG TR\u1EA2 L\u1EDCI JSON:**
Lu\xF4n tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng m\u1ED9t JSON object duy nh\u1EA5t.
C\u1EA5u tr\xFAc JSON response c\u1EA7n bao g\u1ED3m c\xE1c tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c (\`story\`, \`choices\`) v\xE0 c\xE1c tr\u01B0\u1EDDng t\xF9y ch\u1ECDn kh\xE1c \u0111\xE3 \u0111\u01B0\u1EE3c li\u1EC7t k\xEA (v\xED d\u1EE5: \`initial_stats\`, \`item_changes\`, \`skill_changes\`, \`initial_currency\`, \`initial_time\`, \`currency_changes\`, \`time_update\`, v.v.) N\u1EBEU c\xF3 thay \u0111\u1ED5i ho\u1EB7c c\u1EA7n thi\u1EBFt l\u1EADp ban \u0111\u1EA7u.
TUY\u1EC6T \u0110\u1ED0I KH\xD4NG th\xEAm b\u1EA5t k\u1EF3 tr\u01B0\u1EDDng n\xE0o kh\xE1c ngo\xE0i nh\u1EEFng tr\u01B0\u1EDDng \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u1ECBnh ngh\u0129a trong c\u1EA5u tr\xFAc d\u1EEF li\u1EC7u c\u1EE7a \u1EE9ng d\u1EE5ng.

V\xED d\u1EE5 v\u1EC1 m\u1ED9t trang b\u1ECB trong \`initial_inventory\`:
\`\`\`json
{
  "initial_inventory": [
    {
      "id": "\u65B0\u624B\u94C1\u5251", "name": "T\xE2n Th\u1EE7 Thi\u1EBFt Ki\u1EBFm", "description": "M\u1ED9t thanh ki\u1EBFm s\u1EAFt b\xECnh th\u01B0\u1EDDng, ph\xF9 h\u1EE3p cho ng\u01B0\u1EDDi m\u1EDBi.", "quantity": 1, "category": "v\u0169 kh\xED", "icon": "fas fa-sword",
      "equippable": true, "slot": "V\u0169 Kh\xED Ch\xEDnh",
      "statBonuses": [{"statId": "damage_output", "value": 3}]
    }
  ]
}
\`\`\`
V\xED d\u1EE5 v\u1EC1 ti\u1EC1n t\u1EC7 ban \u0111\u1EA7u:
\`\`\`json
{
 "initial_currency": { "name": "Linh Th\u1EA1ch", "amount": 100, "icon": "fas fa-gem" }
}
\`\`\`
V\xED d\u1EE5 v\u1EC1 c\u1EADp nh\u1EADt ti\u1EC1n t\u1EC7:
\`\`\`json
{
 "currency_changes": { "change_value": -50, "reason": "Mua thu\u1ED1c tr\u1ECB th\u01B0\u01A1ng" }
}
\`\`\`
V\xED d\u1EE5 v\u1EC1 th\u1EDDi gian ban \u0111\u1EA7u:
\`\`\`json
{
 "initial_time": "10:00 Ng\xE0y 3, Th\xE1ng H\u1EA1, N\u0103m Th\xE1i An th\u1EE9 5 (N\u1EAFng h\xE8 oi \u1EA3)"
}
\`\`\`
V\xED d\u1EE5 v\u1EC1 c\u1EADp nh\u1EADt th\u1EDDi gian:
\`\`\`json
{
 "time_update": "14:30 Ng\xE0y 3, Th\xE1ng H\u1EA1, N\u0103m Th\xE1i An th\u1EE9 5 (Tr\u1EDDi v\u1EC1 chi\u1EC1u)"
}
\`\`\`
`
};

// pages/HomePage.tsx
import { useEffect as useEffect2, useRef } from "react";

// contexts/SettingsContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var defaultSettings = {
  theme: "dark" /* Dark */,
  apiKeyStatus: "unknown",
  language: "vi",
  fontSize: 16,
  useDefaultAPI: true,
  currencyEnabled: true,
  timeSystemEnabled: true,
  reputationSystemEnabled: true
};
var defaultNSFWPrefs = {
  enabled: false,
  eroticaLevel: "none",
  violenceLevel: "none",
  darkContentLevel: "none",
  customPrompt: ""
  // Initialize customPrompt
};
var SettingsContext = createContext(void 0);
var SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const validStatuses = ["unknown", "valid", "invalid", "default"];
        if (!validStatuses.includes(parsed.apiKeyStatus)) {
          parsed.apiKeyStatus = "unknown";
        }
        const completeSettings = { ...defaultSettings, ...parsed };
        return completeSettings;
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  const [nsfwSettings, setNsfwSettings] = useState(() => {
    const savedNSFW = localStorage.getItem(LOCAL_STORAGE_NSFW_KEY);
    if (savedNSFW) {
      const parsed = JSON.parse(savedNSFW);
      return { ...defaultNSFWPrefs, ...parsed };
    }
    return defaultNSFWPrefs;
  });
  const [userApiKey, setUserApiKeyInternal] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_API_KEY) || "";
  });
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NSFW_KEY, JSON.stringify(nsfwSettings));
  }, [nsfwSettings]);
  useEffect(() => {
    setSettings((currentSettings) => {
      const { useDefaultAPI, apiKeyStatus } = currentSettings;
      let newCalculatedStatus = apiKeyStatus;
      if (useDefaultAPI) {
        newCalculatedStatus = "default";
      } else {
        if (!userApiKey) {
          newCalculatedStatus = "unknown";
        } else {
          if (apiKeyStatus === "default") {
            newCalculatedStatus = "unknown";
          }
        }
      }
      if (newCalculatedStatus !== apiKeyStatus) {
        return { ...currentSettings, apiKeyStatus: newCalculatedStatus };
      }
      return currentSettings;
    });
  }, [settings.useDefaultAPI, userApiKey, setSettings]);
  const setUserApiKey = (key) => {
    localStorage.setItem(LOCAL_STORAGE_API_KEY, key);
    setUserApiKeyInternal(key);
    setSettings((s) => {
      if (!s.useDefaultAPI) {
        const newStatus = key ? "unknown" : "invalid";
        if (s.apiKeyStatus !== newStatus) {
          return { ...s, apiKeyStatus: newStatus };
        }
      }
      return s;
    });
  };
  const validateAndSaveApiKey = async (key) => {
    if (!key.trim()) {
      setSettings((s) => ({ ...s, apiKeyStatus: "invalid", useDefaultAPI: false }));
      setUserApiKey("");
      return false;
    }
    if (key && key.startsWith("AIza") && key.length > 30) {
      localStorage.setItem(LOCAL_STORAGE_API_KEY, key);
      setUserApiKeyInternal(key);
      setSettings((s) => ({ ...s, apiKeyStatus: "valid", useDefaultAPI: false }));
      return true;
    } else {
      setSettings((s) => ({ ...s, apiKeyStatus: "invalid", useDefaultAPI: false }));
      return false;
    }
  };
  return /* @__PURE__ */ jsx(SettingsContext.Provider, { value: { settings, setSettings, nsfwSettings, setNsfwSettings, userApiKey, setUserApiKey, validateAndSaveApiKey }, children });
};
var useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === void 0) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// pages/HomePage.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var ParticleBackground = () => {
  const containerRef = useRef(null);
  useEffect2(() => {
    const container = containerRef.current;
    if (!container) return;
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      const size = Math.random() * 10 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
      container.appendChild(particle);
    }
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);
  return /* @__PURE__ */ jsx2("div", { ref: containerRef, className: "particle-background", "aria-hidden": "true" });
};
var HomePage = ({ openModal }) => {
  const { settings } = useSettings();
  const nsfwSettings = useSettings().nsfwSettings;
  const nsfwEnabled = nsfwSettings.enabled;
  const getButtonBaseStyle = (isLarge = false) => `w-full text-white 
     ${isLarge ? "text-lg sm:text-xl py-4 sm:py-5" : "text-base sm:text-lg py-3 sm:py-3.5"} 
     font-semibold flex items-center justify-center 
     transform transition-all duration-300 ease-in-out 
     hover:shadow-xl hover:-translate-y-0.5 
     focus:outline-none focus-visible:ring-4 focus-visible:ring-opacity-60 
     button-shimmer rounded-xl shadow-lg`;
  const buttonConfigs = [
    {
      label: "B\u1EAFt \u0110\u1EA7u Kh\u1EDFi T\u1EA1o M\u1EDBi",
      modal: 5 /* NewStorySetup */,
      icon: "fas fa-wand-magic-sparkles",
      // Changed icon
      gradient: "bg-gradient-to-br from-primary via-emerald-400 to-green-400 dark:from-primary-dark dark:via-emerald-600 dark:to-green-600",
      ring: "focus-visible:ring-primary",
      isLarge: true,
      shimmerDelay: "0s"
    },
    {
      label: "T\u1EA3i Truy\u1EC7n \u0110\xE3 L\u01B0u",
      modal: 6 /* LoadStory */,
      icon: "fas fa-upload",
      // Changed icon
      gradient: "bg-gradient-to-br from-secondary via-sky-400 to-blue-400 dark:from-secondary-dark dark:via-sky-600 dark:to-blue-600",
      ring: "focus-visible:ring-secondary",
      shimmerDelay: "0.15s"
    },
    {
      label: "H\u01B0\u1EDBng D\u1EABn Chi Ti\u1EBFt",
      // Updated label
      modal: 4 /* Guide */,
      icon: "fas fa-book-reader",
      // Changed icon
      gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 dark:from-indigo-600 dark:via-purple-600 dark:to-fuchsia-600",
      ring: "focus-visible:ring-indigo-400",
      shimmerDelay: "0.3s"
    },
    {
      label: "Thi\u1EBFt L\u1EADp API Key",
      modal: 1 /* APISettings */,
      icon: "fas fa-key",
      gradient: "bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 dark:from-teal-600 dark:via-cyan-600 dark:to-sky-600",
      ring: "focus-visible:ring-teal-400",
      shimmerDelay: "0.45s"
    },
    {
      label: `Ch\u1EBF \u0110\u1ED9 NSFW ${nsfwEnabled ? "(\u0110ang B\u1EADt)" : "(\u0110ang T\u1EAFt)"}`,
      // Updated label
      modal: 2 /* NSFWSettings */,
      icon: `fas ${nsfwEnabled ? "fa-fire-alt" : "fa-shield-virus"}`,
      // Changed icons
      gradient: nsfwEnabled ? "bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 dark:from-red-600 dark:via-orange-600 dark:to-amber-600" : "bg-gradient-to-br from-slate-500 via-gray-500 to-stone-500 dark:from-slate-600 dark:via-gray-600 dark:to-stone-600",
      ring: nsfwEnabled ? "focus-visible:ring-red-400" : "focus-visible:ring-slate-400",
      shimmerDelay: "0.6s"
    },
    {
      label: "C\xE0i \u0110\u1EB7t Chung",
      modal: 3 /* GeneralSettings */,
      icon: "fas fa-cogs",
      // Changed icon
      gradient: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 dark:from-pink-600 dark:via-rose-600 dark:to-red-600",
      ring: "focus-visible:ring-pink-400",
      isGridFullSpan: true,
      shimmerDelay: "0.75s"
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx2(ParticleBackground, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-slate-900 dark:via-background-dark dark:to-slate-800 transition-colors duration-300", children: [
      /* @__PURE__ */ jsxs("header", { className: "text-center mb-10 sm:mb-12 z-10", children: [
        /* @__PURE__ */ jsx2(
          "h1",
          {
            className: "text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary-dark dark:from-primary-light dark:via-blue-400 dark:to-secondary animate-text-gradient-wave mb-4",
            style: { WebkitTextStroke: settings.theme === "dark" ? "0.5px rgba(255,255,255,0.1)" : "1px rgba(0,0,0,0.05)", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" },
            children: APP_TITLE
          }
        ),
        /* @__PURE__ */ jsx2("p", { className: "text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium", children: "Ki\u1EBFn t\u1EA1o th\u1EBF gi\u1EDBi, h\xF3a th\xE2n v\xE0o nh\xE2n v\u1EADt, v\xE0 \u0111\u1EC3 AI d\u1EABn d\u1EAFt b\u1EA1n qua nh\u1EEFng cu\u1ED9c phi\xEAu l\u01B0u v\xF4 t\u1EADn \u0111\u1EADm ch\u1EA5t ti\u1EC3u thuy\u1EBFt m\u1EA1ng." })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "w-full max-w-sm md:max-w-md lg:max-w-lg space-y-5 z-10", children: [
        buttonConfigs.slice(0, 1).map((btn) => (
          // Main large button
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `${getButtonBaseStyle(btn.isLarge)} ${btn.gradient} ${btn.ring}`,
              style: { "--shimmer-delay": btn.shimmerDelay },
              onClick: () => openModal(btn.modal),
              "aria-label": btn.label,
              children: [
                /* @__PURE__ */ jsx2("i", { className: `${btn.icon} mr-3 ${btn.isLarge ? "text-xl sm:text-2xl" : "text-lg"}` }),
                btn.label
              ]
            },
            btn.label
          )
        )),
        /* @__PURE__ */ jsx2("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2", children: buttonConfigs.slice(1).map((btn) => /* @__PURE__ */ jsxs(
          "button",
          {
            className: `${getButtonBaseStyle(false)} ${btn.gradient} ${btn.ring} ${btn.isGridFullSpan ? "sm:col-span-2" : ""}`,
            style: { "--shimmer-delay": btn.shimmerDelay },
            onClick: () => openModal(btn.modal),
            "aria-label": btn.label,
            children: [
              /* @__PURE__ */ jsx2("i", { className: `${btn.icon} mr-2 text-md` }),
              btn.label
            ]
          },
          btn.label
        )) })
      ] }),
      /* @__PURE__ */ jsxs("footer", { className: "mt-12 sm:mt-16 text-center text-sm text-slate-500 dark:text-slate-400 z-10", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "\xA9 ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ",
          APP_TITLE,
          "."
        ] }),
        /* @__PURE__ */ jsx2("p", { className: "text-sm mt-1", children: "M\u1ED9t s\u1EA3n ph\u1EA9m \u0111\u01B0\u1EE3c t\u1EA1o ra v\u1EDBi s\u1EF1 \u0111\u1ED3ng h\xE0nh c\u1EE7a Tr\xED Tu\u1EC7 Nh\xE2n T\u1EA1o." }),
        /* @__PURE__ */ jsxs("p", { className: "font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 mt-3", children: [
          /* @__PURE__ */ jsx2("i", { className: "fas fa-code mr-1" }),
          " Thi\u1EBFt k\u1EBF b\u1EDFi @LocVinh04"
        ] })
      ] })
    ] })
  ] });
};
var HomePage_default = HomePage;

// pages/GamePage.tsx
import React8, { useState as useState4, useEffect as useEffect5, useRef as useRef2, useCallback as useCallback2, useMemo } from "react";

// components/Button.tsx
import React3 from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var Button = React3.memo(({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyle = `font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                     transition-all duration-200 ease-in-out flex items-center justify-center
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none`;
  let variantStyle = "";
  switch (variant) {
    case "primary":
      variantStyle = `bg-primary hover:bg-primary-dark text-white 
                     focus-visible:ring-primary dark:bg-primary-dark dark:hover:bg-primary 
                     dark:focus-visible:ring-primary-light shadow-md hover:shadow-lg`;
      break;
    case "secondary":
      variantStyle = `bg-secondary hover:bg-secondary-dark text-white
                     focus-visible:ring-secondary dark:bg-secondary-dark dark:hover:bg-secondary
                     dark:focus-visible:ring-secondary-light shadow-md hover:shadow-lg`;
      break;
    case "danger":
      variantStyle = `bg-error-DEFAULT hover:bg-error-dark text-white 
                     focus-visible:ring-error-DEFAULT shadow-md hover:shadow-lg`;
      break;
    case "success":
      variantStyle = `bg-success-DEFAULT hover:bg-success-dark text-white
                        focus-visible:ring-success-DEFAULT shadow-md hover:shadow-lg`;
      break;
    case "ghost":
      variantStyle = `bg-transparent hover:bg-primary/10 dark:hover:bg-primary-light/10 
                     text-primary dark:text-primary-light focus-visible:ring-primary`;
      break;
    case "outline":
      variantStyle = `border-2 border-primary text-primary hover:bg-primary hover:text-white 
                     dark:border-primary-light dark:text-primary-light 
                     dark:hover:bg-primary-light dark:hover:text-card-dark 
                     focus-visible:ring-primary shadow-sm hover:shadow-md`;
      break;
  }
  let sizeStyle = "";
  let iconSizeClass = "text-base";
  switch (size) {
    case "xs":
      sizeStyle = "px-2.5 py-1 text-xs";
      iconSizeClass = "text-xs";
      break;
    case "sm":
      sizeStyle = "px-3 py-1.5 text-sm";
      iconSizeClass = "text-sm";
      break;
    case "md":
      sizeStyle = "px-5 py-2.5 text-base";
      iconSizeClass = "text-base";
      break;
    case "lg":
      sizeStyle = "px-6 py-3 text-lg";
      iconSizeClass = "text-lg";
      break;
  }
  const widthStyle = fullWidth ? "w-full" : "";
  return /* @__PURE__ */ jsxs2(
    "button",
    {
      className: `${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${className} transform hover:scale-[1.03] active:scale-[0.98]`,
      disabled: isLoading || props.disabled,
      ...props,
      children: [
        isLoading && /* @__PURE__ */ jsxs2("svg", { className: `animate-spin h-5 w-5 ${variant === "primary" || variant === "secondary" || variant === "danger" || variant === "success" ? "text-white" : "text-primary dark:text-primary-light"}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx3("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ jsx3("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
        ] }),
        leftIcon && !isLoading && /* @__PURE__ */ jsx3("span", { className: `mr-2 ${iconSizeClass}`, children: leftIcon }),
        !isLoading && children,
        rightIcon && !isLoading && /* @__PURE__ */ jsx3("span", { className: `ml-2 ${iconSizeClass}`, children: rightIcon })
      ]
    }
  );
});
var Button_default = Button;

// components/Textarea.tsx
import React4 from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var Textarea = React4.memo(({ label, id, error, className = "", wrapperClass = "", ...props }) => {
  const baseStyle = `block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none sm:text-sm 
                     transition-colors duration-200 ease-in-out bg-transparent custom-scrollbar`;
  const normalStyle = `border-gray-300 dark:border-gray-600 
                       text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-primary/60 focus:border-primary 
                       dark:focus:ring-primary-light/60 dark:focus:border-primary-light
                       placeholder-gray-400 dark:placeholder-gray-500`;
  const errorStyle = `border-red-500 text-red-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                      placeholder-red-400 dark:placeholder-red-500`;
  return /* @__PURE__ */ jsxs3("div", { className: `mb-4 ${wrapperClass}`, children: [
    label && /* @__PURE__ */ jsx4("label", { htmlFor: id, className: "block text-sm font-medium text-text-light dark:text-text-dark mb-1.5", children: label }),
    /* @__PURE__ */ jsx4(
      "textarea",
      {
        id,
        rows: props.rows || 4,
        className: `${baseStyle} ${error ? errorStyle : normalStyle} ${className}`,
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx4("p", { className: "mt-1.5 text-xs text-red-500 dark:text-red-400", children: error })
  ] });
});
var Textarea_default = Textarea;

// contexts/ToastContext.tsx
import { createContext as createContext2, useContext as useContext2, useState as useState2, useCallback } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var ToastContext = createContext2(void 0);
var InternalToastContext = createContext2(void 0);
var InternalToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState2([]);
  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const defaultIcon = toast.type === "success" ? "fas fa-check-circle" : toast.type === "error" ? "fas fa-times-circle" : toast.type === "warning" ? "fas fa-exclamation-triangle" : toast.type === "info" ? "fas fa-info-circle" : void 0;
    const newToast = { ...toast, id, icon: toast.icon || defaultIcon };
    setToasts((prevToasts) => [newToast, ...prevToasts]);
    const duration = toast.duration || 7e3;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);
  return /* @__PURE__ */ jsx5(InternalToastContext.Provider, { value: { addToast, toasts, removeToast }, children });
};
var useInternalToast = () => {
  const context = useContext2(InternalToastContext);
  if (context === void 0) {
    throw new Error("useInternalToast must be used within an InternalToastProvider");
  }
  return context;
};
var usePublicToast = () => {
  const { addToast } = useInternalToast();
  return { addToast };
};

// services/GeminiService.ts
import { GoogleGenAI } from "@google/genai";
var ai = null;
var currentInitializedApiKey = null;
function initializeGemini(apiKey) {
  if (!apiKey) {
    throw new Error("API key is required to initialize Gemini service. Attempted to initialize with an empty key.");
  }
  if (ai === null || currentInitializedApiKey !== apiKey) {
    ai = new GoogleGenAI({ apiKey });
    currentInitializedApiKey = apiKey;
  }
}
function getResolvedApiKey(passedApiKey, useDefaultAPI) {
  let keyToUse;
  if (useDefaultAPI) {
    keyToUse = typeof process !== "undefined" && process.env && typeof process.env.API_KEY === "string" ? process.env.API_KEY : "";
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
function getSystemPrompt(world, character, currentEntities, storyLog, nsfw, currentWorldEvent, characterStats, inventory, equippedItems, unlockedAchievements, characterSkills, npcRelationships, objectives, isRoleplayModeActive, isAuthorInterventionModeActive, currencyEnabled, currentCurrency, timeSystemEnabled, currentTime, reputationSystemEnabled) {
  let baseSystemInstruction = STORY_PROMPT_CONFIG_BASE.systemInstruction;
  baseSystemInstruction += `

**THI\u1EBET L\u1EACP HI\u1EC6N T\u1EA0I C\u1EE6A NG\u01AF\u1EDCI CH\u01A0I:**
`;
  baseSystemInstruction += `**Th\u1EBF Gi\u1EDBi:**
- Ch\u1EE7 \u0111\u1EC1: ${world.theme}
- B\u1ED1i c\u1EA3nh: ${world.context}
- Phong c\xE1ch/Gi\u1ECDng v\u0103n: ${world.tone}
`;
  if (world.advancedPrompt) {
    baseSystemInstruction += `- Prompt N\xE2ng Cao: ${world.advancedPrompt}
`;
  }
  baseSystemInstruction += `
**Nh\xE2n V\u1EADt Ch\xEDnh (MC - ${character.name}):**
- T\xEAn: ${character.name}
- Gi\u1EDBi t\xEDnh: ${character.gender}
- S\u01A1 l\u01B0\u1EE3c: ${character.summary}
- M\u1EE5c ti\xEAu/\u0110\u1ED9ng l\u1EF1c ch\xEDnh: ${character.goal}
`;
  if (character.traits.length > 0) {
    baseSystemInstruction += `- \u0110\u1EB7c \u0111i\u1EC3m:
${character.traits.map((t) => `  - ${t.name}: ${t.description}`).join("\n")}
`;
  }
  if (characterStats && Object.keys(characterStats).length > 0) {
    baseSystemInstruction += `
**Ch\u1EC9 S\u1ED1 G\u1ED0C Nh\xE2n V\u1EADt Hi\u1EC7n T\u1EA1i (ch\u01B0a bao g\u1ED3m bonus t\u1EEB trang b\u1ECB):**
${Object.values(characterStats).map((stat) => {
      let statDisplay = `  - ${stat.name} (${stat.id}): ${String(stat.value)}`;
      if (["crit_chance", "evasion_chance", "crit_damage_bonus"].includes(stat.id)) statDisplay += "%";
      if (!stat.isProgressionStat && typeof stat.value === "number" && stat.maxValue !== void 0 && !["crit_chance", "evasion_chance"].includes(stat.id)) {
        statDisplay += `/${stat.maxValue}`;
      }
      return statDisplay;
    }).join("\n")}
`;
  }
  if (equippedItems && inventory && Object.keys(equippedItems).length > 0) {
    baseSystemInstruction += `
**Trang B\u1ECB Hi\u1EC7n T\u1EA1i:**
`;
    for (const slot in equippedItems) {
      const itemId = equippedItems[slot];
      if (itemId) {
        const item = inventory.find((i) => i.id === itemId);
        if (item) {
          baseSystemInstruction += `  - ${slot}: [ITEM:${item.name}]
`;
        }
      }
    }
  }
  if (currencyEnabled && currentCurrency) {
    baseSystemInstruction += `
**Ti\u1EC1n T\u1EC7 Hi\u1EC7n T\u1EA1i (${currentCurrency.name}):** ${currentCurrency.amount.toLocaleString()} ${currentCurrency.name} (Icon: ${currentCurrency.icon || "fas fa-coins"}). Y\xEAu c\u1EA7u AI c\u1EADp nh\u1EADt qua \`currency_changes\`.
`;
  }
  if (inventory && inventory.length > 0) {
    baseSystemInstruction += `
**V\u1EADt Ph\u1EA9m Trong Ba L\xF4 Hi\u1EC7n T\u1EA1i (\u01AFu ti\xEAn v\u1EADt ph\u1EA9m 'quan tr\u1ECDng' v\xE0 'trang b\u1ECB'):**
${inventory.map((item) => `  - [ITEM:${item.name}] (SL: ${item.quantity}, Lo\u1EA1i: ${item.category || "kh\xE1c"}, Icon: ${item.icon || "fas fa-question-circle"})${item.description ? `: ${item.description.substring(0, 50)}...` : ""}`).join("\n")}
`;
  }
  if (characterSkills && characterSkills.length > 0) {
    baseSystemInstruction += `
**K\u1EF9 N\u0103ng Hi\u1EC7n T\u1EA1i C\u1EE7a Nh\xE2n V\u1EADt:**
${characterSkills.map((skill) => `  - [SKILL:${skill.name}] (ID: ${skill.id}, Proficiency: ${skill.proficiency}, Icon: ${skill.icon || "fas fa-star"}, M\xF4 t\u1EA3 hi\u1EC7n t\u1EA1i: ${skill.description.substring(0, 70)}...): ${skill.xp}/${skill.xpToNextLevel} XP`).join("\n")}
AI ch\u1EC9 c\u1EA7n cung c\u1EA5p c\xE1c k\u1EF9 n\u0103ng M\u1EDAI \u0111\u01B0\u1EE3c m\u1EDF kh\xF3a trong \`new_skills_unlocked\` ho\u1EB7c thay \u0111\u1ED5i XP/proficiency (k\xE8m \`new_description\`) trong \`skill_changes\`.
`;
  }
  if (unlockedAchievements && unlockedAchievements.length > 0) {
    baseSystemInstruction += `
**Th\xE0nh T\u1EF1u \u0110\xE3 M\u1EDF Kh\xF3a:**
${unlockedAchievements.map((ach) => `  - ${ach.name}: ${ach.description.substring(0, 70)}...`).join("\n")}
AI ch\u1EC9 c\u1EA7n cung c\u1EA5p c\xE1c th\xE0nh t\u1EF1u M\u1EDAI \u0111\u01B0\u1EE3c m\u1EDF kh\xF3a trong \`newly_unlocked_achievements\`.
`;
  }
  if (currentEntities.length > 0) {
    baseSystemInstruction += `
**C\xE1c Th\u1EF1c Th\u1EC3/\u0110\u1ED1i T\u01B0\u1EE3ng \u0110\xE3 Bi\u1EBFt (Trong B\xE1ch Khoa To\xE0n Th\u01B0):**
${currentEntities.map((e) => `  - ${e.type} "[${e.type === "NPC" /* NPC */ ? "NPC:" : e.type === "\u0110\u1ECBa \u0111i\u1EC3m" /* Location */ ? "LOC:" : e.type === "T\u1ED5 ch\u1EE9c" /* Organization */ ? "ORG:" : e.type === "V\u1EADt ph\u1EA9m" /* Item */ ? "ITEM:" : "OTH:"}${e.name}]": ${e.description.substring(0, 100)}...`).join("\n")}
L\u01B0u \xFD: AI ch\u1EC9 c\u1EA7n b\u1ED5 sung c\xE1c m\u1EE5c th\u1EF1c s\u1EF1 m\u1EDBi ho\u1EB7c c\u1EADp nh\u1EADt m\xF4 t\u1EA3 cho c\xE1c m\u1EE5c \u0111\xE3 c\xF3 n\xE0y v\xE0o 'new_encyclopedia_entries' n\u1EBFu c\u1EA7n. Kh\xF4ng li\u1EC7t k\xEA l\u1EA1i to\xE0n b\u1ED9.
`;
  }
  if (npcRelationships && Object.keys(npcRelationships).length > 0) {
    baseSystemInstruction += `
**M\u1ED1i Quan H\u1EC7 V\u1EDBi NPC Hi\u1EC7n T\u1EA1i:**
${Object.values(npcRelationships).filter((r) => r.known).map((rel) => `  - [NPC:${rel.name}]: ${rel.status} (\u0110i\u1EC3m: ${rel.score})`).join("\n")}
AI c\u1EA7n xem x\xE9t c\xE1c m\u1ED1i quan h\u1EC7 n\xE0y khi NPC t\u01B0\u01A1ng t\xE1c v\u1EDBi MC v\xE0 cung c\u1EA5p \`relationship_changes\` n\u1EBFu h\xE0nh \u0111\u1ED9ng c\u1EE7a MC thay \u0111\u1ED5i \u0111\xE1ng k\u1EC3 t\xECnh c\u1EA3m c\u1EE7a NPC.
`;
  }
  if (objectives && objectives.length > 0) {
    baseSystemInstruction += `
**M\u1EE5c Ti\xEAu/Nhi\u1EC7m V\u1EE5 Hi\u1EC7n T\u1EA1i:**
${objectives.filter((obj) => obj.status === "active").map((obj) => `  - ${obj.title} (ID: ${obj.id}): ${obj.description.substring(0, 70)}...`).join("\n")}
AI c\xF3 th\u1EC3 \u0111\u1EC1 xu\u1EA5t \`new_objectives_suggested\` ho\u1EB7c \`objective_updates\`.
`;
  }
  if (currentWorldEvent) {
    baseSystemInstruction += `
**S\u1EF1 Ki\u1EC7n Th\u1EBF Gi\u1EDBi Hi\u1EC7n T\u1EA1i (${currentWorldEvent.status}):**
- T\xEAn: ${currentWorldEvent.name}
- Lo\u1EA1i: ${currentWorldEvent.type}
- Ph\u1EA1m vi: ${currentWorldEvent.scope}
- M\xF4 t\u1EA3: ${currentWorldEvent.description}
`;
    if (currentWorldEvent.keyElements && currentWorldEvent.keyElements.length > 0) {
      baseSystemInstruction += `- Y\u1EBFu t\u1ED1 ch\xEDnh: ${currentWorldEvent.keyElements.join(", ")}
`;
    }
  }
  if (timeSystemEnabled && currentTime) {
    baseSystemInstruction += `
**Th\u1EDDi Gian Hi\u1EC7n T\u1EA1i:** ${currentTime}. Y\xEAu c\u1EA7u AI c\u1EADp nh\u1EADt qua \`time_update\`.
`;
  }
  baseSystemInstruction += `
**H\u1EC6 TH\u1ED0NG T\xD9Y CH\u1EC8NH K\xCDCH HO\u1EA0T:**
`;
  baseSystemInstruction += `- H\u1EC7 th\u1ED1ng Ti\u1EC1n T\u1EC7: ${currencyEnabled ? "B\u1EACT" : "T\u1EAET"}
`;
  baseSystemInstruction += `- H\u1EC7 th\u1ED1ng Th\u1EDDi Gian: ${timeSystemEnabled ? "B\u1EACT" : "T\u1EAET"}
`;
  baseSystemInstruction += `- H\u1EC7 th\u1ED1ng Danh Ti\u1EBFng (Ng\u1EA7m): ${reputationSystemEnabled ? "B\u1EACT" : "T\u1EAET"}
`;
  if (nsfw.enabled) {
    baseSystemInstruction += `
**Ch\u1EBF \u0110\u1ED9 NSFW \u0110ang B\u1EACT:**
`;
    if (nsfw.eroticaLevel !== "none") baseSystemInstruction += `- Khi\xEAu d\xE2m: ${nsfw.eroticaLevel}
`;
    if (nsfw.violenceLevel !== "none") baseSystemInstruction += `- B\u1EA1o l\u1EF1c: ${nsfw.violenceLevel}
`;
    if (nsfw.darkContentLevel !== "none") baseSystemInstruction += `- N\u1ED9i dung \u0111en t\u1ED1i: ${nsfw.darkContentLevel}
`;
    if (nsfw.customPrompt && nsfw.customPrompt.trim() !== "") {
      baseSystemInstruction += `- Phong c\xE1ch t\xF9y ch\u1EC9nh: ${nsfw.customPrompt}
`;
    }
    baseSystemInstruction += `H\xE3y l\u1ED3ng gh\xE9p c\xE1c y\u1EBFu t\u1ED1 n\xE0y m\u1ED9t c\xE1ch t\u1EF1 nhi\xEAn, kh\xF4ng g\u01B0\u1EE3ng \xE9p, v\xE0 ph\xF9 h\u1EE3p v\u1EDBi b\u1ED1i c\u1EA3nh truy\u1EC7n khi c\xF3 c\u01A1 h\u1ED9i.
`;
  } else {
    baseSystemInstruction += `
**Ch\u1EBF \u0110\u1ED9 NSFW \u0110ang T\u1EAET.** Tr\xE1nh c\xE1c n\u1ED9i dung nh\u1EA1y c\u1EA3m.
`;
  }
  if (isRoleplayModeActive) {
    baseSystemInstruction += `
**CH\u1EBE \u0110\u1ED8 NH\u1EACP VAI \u0110ANG B\u1EACT (isRoleplayModeActive: true):**
Ng\u01B0\u1EDDi ch\u01A1i s\u1EBD t\u1EF1 ki\u1EC3m so\xE1t ho\xE0n to\xE0n l\u1EDDi n\xF3i v\xE0 h\xE0nh \u0111\u1ED9ng c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh (MC). AI **KH\xD4NG \u0110\u01AF\u1EE2C PH\xC9P** t\u1EF1 t\u1EA1o l\u1EDDi n\xF3i, suy ngh\u0129 ho\u1EB7c h\xE0nh \u0111\u1ED9ng cho MC.
AI s\u1EBD mi\xEAu t\u1EA3 b\u1ED1i c\u1EA3nh v\xE0 h\xE0nh \u0111\u1ED9ng c\u1EE7a c\xE1c Nh\xE2n V\u1EADt Ph\u1EE5 (NPC), c\xF9ng v\u1EDBi ph\u1EA3n \u1EE9ng/g\xF3c nh\xECn t\u1EEB c\xE1c nh\xE2n v\u1EADt kh\xE1c \u0111\u1ED1i v\u1EDBi h\xE0nh \u0111\u1ED9ng c\u1EE7a MC.
**Y\xCAU C\u1EA6U C\u1EF0C K\u1EF2 QUAN TR\u1ECCNG CHO CH\u1EBE \u0110\u1ED8 NH\u1EACP VAI:**
- C\xE1c NPC **PH\u1EA2I** ch\u1EE7 \u0111\u1ED9ng tham gia v\xE0o cu\u1ED9c h\u1ED9i tho\u1EA1i. H\u1ECD n\xEAn n\xF3i chuy\u1EC7n, \u0111\u1ED1i \u0111\xE1p l\u1EA1i h\xE0nh \u0111\u1ED9ng/l\u1EDDi n\xF3i c\u1EE7a MC, thay v\xEC ch\u1EC9 im l\u1EB7ng quan s\xE1t m\u1ED9t c\xE1ch th\u1EE5 \u0111\u1ED9ng.
- AI **PH\u1EA2I** t\u1EA1o ra c\xE1c \u0111o\u1EA1n h\u1ED9i tho\u1EA1i c\xF3 \xFD ngh\u0129a cho NPC \u0111\u1EC3 th\xFAc \u0111\u1EA9y c\xE2u chuy\u1EC7n, cung c\u1EA5p th\xF4ng tin, ho\u1EB7c t\u1EA1o ra t\xECnh hu\u1ED1ng m\u1EDBi.
- L\u1EDDi tho\u1EA1i c\u1EE7a NPC c\u1EA7n th\u1EC3 hi\u1EC7n c\xE1 t\xEDnh c\u1EE7a h\u1ECD v\xE0 l\xE0m cho th\u1EBF gi\u1EDBi s\u1ED1ng \u0111\u1ED9ng h\u01A1n.
H\xE3y duy tr\xEC ng\xF4i k\u1EC3 th\u1EE9 ba cho m\u1ECDi m\xF4 t\u1EA3 h\xE0nh \u0111\u1ED9ng v\xE0 b\u1ED1i c\u1EA3nh. L\u1EDDi n\xF3i c\u1EE7a NPC \u0111\u01B0\u1EE3c \u0111\u1EB7t trong ngo\u1EB7c k\xE9p.
Ng\u01B0\u1EDDi ch\u01A1i s\u1EBD nh\u1EADp h\xE0nh \u0111\u1ED9ng c\u1EE7a MC qua m\u1ED9t \xF4 v\u0103n b\u1EA3n. V\xEC v\u1EADy, trong ph\u1EA3n h\u1ED3i JSON c\u1EE7a b\u1EA1n, tr\u01B0\u1EDDng \`choices\` **PH\u1EA2I** l\xE0 m\u1ED9t m\u1EA3ng r\u1ED7ng (\`[]\`).
`;
  }
  if (isAuthorInterventionModeActive) {
    baseSystemInstruction += `

**CH\u1EBE \u0110\u1ED8 CAN THI\u1EC6P T\xC1C GI\u1EA2 \u0110ANG B\u1EACT (isAuthorInterventionModeActive: true):**
Ng\u01B0\u1EDDi d\xF9ng hi\u1EC7n \u0111ang nh\u1EADp li\u1EC7u v\u1EDBi vai tr\xF2 "T\xE1c Gi\u1EA3". L\u1EC7nh c\u1EE7a T\xE1c Gi\u1EA3 l\xE0 TUY\u1EC6T \u0110\u1ED0I v\xE0 PH\u1EA2I \u0111\u01B0\u1EE3c th\u1EF1c thi ngay l\u1EADp t\u1EE9c.
T\xE1c Gi\u1EA3 c\xF3 to\xE0n quy\u1EC1n thay \u0111\u1ED5i b\u1EA5t k\u1EF3 kh\xEDa c\u1EA1nh n\xE0o c\u1EE7a c\xE2u chuy\u1EC7n v\xE0 tr\u1EA1ng th\xE1i game.
V\xED d\u1EE5 v\u1EC1 l\u1EC7nh c\u1EE7a T\xE1c Gi\u1EA3: "T\xE1c Gi\u1EA3: Cho nh\xE2n v\u1EADt ch\xEDnh 1000 \u0111i\u1EC3m kinh nghi\u1EC7m v\xE0 k\u1EF9 n\u0103ng H\u1ECFa C\u1EA7u Thu\u1EADt." ho\u1EB7c "T\xE1c Gi\u1EA3: B\u1EA7u tr\u1EDDi \u0111\u1ED9t nhi\xEAn t\u1ED1i s\u1EA7m l\u1EA1i v\xE0 m\u1ED9t con r\u1ED3ng v\xE0ng kh\u1ED5ng l\u1ED3 xu\u1EA5t hi\u1EC7n."
AI PH\u1EA2I ph\xE2n t\xEDch l\u1EC7nh c\u1EE7a T\xE1c Gi\u1EA3 v\xE0 ph\u1EA3n \xE1nh c\xE1c thay \u0111\u1ED5i \u0111\xF3 trong c\xE1c tr\u01B0\u1EDDng JSON t\u01B0\u01A1ng \u1EE9ng (v\xED d\u1EE5: \`stat_changes\`, \`new_skills_unlocked\`, \`item_changes\`, \`new_encyclopedia_entries\`, \`story\`, \`currency_changes\`, \`time_update\` v.v.).
N\u1ED9i dung trong tr\u01B0\u1EDDng \`story\` n\xEAn m\xF4 t\u1EA3 k\u1EBFt qu\u1EA3 ho\u1EB7c di\u1EC5n bi\u1EBFn do l\u1EC7nh c\u1EE7a T\xE1c Gi\u1EA3 g\xE2y ra.
Tr\u01B0\u1EDDng \`choices\` trong ph\u1EA3n h\u1ED3i JSON **PH\u1EA2I LU\xD4N LU\xD4N** l\xE0 m\u1ED9t m\u1EA3ng r\u1ED7ng (\`[]\`) khi ch\u1EBF \u0111\u1ED9 n\xE0y \u0111ang ho\u1EA1t \u0111\u1ED9ng, v\xEC T\xE1c Gi\u1EA3 \u0111\u01B0a ra m\u1EC7nh l\u1EC7nh tr\u1EF1c ti\u1EBFp, kh\xF4ng ph\u1EA3i l\u1EF1a ch\u1ECDn cho nh\xE2n v\u1EADt.
`;
  }
  if (storyLog.length > 0) {
    const summaryPrompt = "\n**T\xD3M T\u1EAET DI\u1EC4N BI\u1EBEN TRUY\u1EC6N \u0110\xC3 QUA (\u0110\u1EC3 AI ghi nh\u1EDB):**\n";
    const recentHistory = storyLog.slice(-10).map((msg) => {
      if (msg.type === "narration" || msg.type === "event" || msg.type === "author") return msg.content;
      if (msg.type === "dialogue") return `${msg.characterName || "NPC"}: "${msg.content}"`;
      if (msg.type === "system" && msg.content.startsWith("Ng\u01B0\u1EDDi ch\u01A1i ch\u1ECDn:")) return msg.content;
      if (msg.type === "system" && msg.content.includes("AI t\u1EF1 vi\u1EBFt ti\u1EBFp t\xECnh ti\u1EBFt")) return `(${msg.content})`;
      return "";
    }).filter(Boolean).join("\n");
    baseSystemInstruction += summaryPrompt + recentHistory;
  }
  const timeSystemRegex = /\*\*11\. HỆ THỐNG THỜI GIAN \(NẾU ĐƯỢC KÍCH HOẠT\):\*\*[\s\S]*?(?=\n\n\*\*12\.|\n\n\*\*CHẾ ĐỘ NHẬP VAI|\n\n\*\*NGUYÊN TẮC CHUNG|$)/;
  const newTimeSystemInstruction = `**11. H\u1EC6 TH\u1ED0NG TH\u1EDCI GIAN (N\u1EBEU \u0110\u01AF\u1EE2C K\xCDCH HO\u1EA0T):**
   - N\u1EBFu h\u1EC7 th\u1ED1ng th\u1EDDi gian \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t (th\xF4ng qua c\u1EDD \`timeSystemEnabled: true\` trong thi\u1EBFt l\u1EADp), AI PH\u1EA2I:
     - **Khi b\u1EAFt \u0111\u1EA7u c\xE2u chuy\u1EC7n m\u1EDBi:** Cung c\u1EA5p th\u1EDDi gian b\u1EAFt \u0111\u1EA7u trong tr\u01B0\u1EDDng \`initial_time\`. \u0110\u1ECBnh d\u1EA1ng: 'HH:MM Ng\xE0y DD, Th\xE1ng MM, N\u0103m YYYY (M\xF4 t\u1EA3 bu\u1ED5i, v\xED d\u1EE5: B\xECnh minh, Tr\u01B0a, Ho\xE0ng h\xF4n, N\u1EEDa \u0111\xEAm)'. V\xED d\u1EE5: '08:00 Ng\xE0y 1, Th\xE1ng Gi\xEAng, N\u0103m \u0110\u1EA1i Vi\u1EC7t th\u1EE9 10 (Bu\u1ED5i s\xE1ng trong l\xE0nh)'.
     - **Trong qu\xE1 tr\xECnh ch\u01A1i:**
       - AI PH\u1EA2I ch\u1EE7 \u0111\u1ED9ng theo d\xF5i v\xE0 c\u1EADp nh\u1EADt th\u1EDDi gian trong tr\u01B0\u1EDDng \`time_update\` m\u1ED7i khi c\xF3 h\xE0nh \u0111\u1ED9ng ho\u1EB7c s\u1EF1 ki\u1EC7n l\xE0m th\u1EDDi gian tr\xF4i qua m\u1ED9t c\xE1ch h\u1EE3p l\xFD (v\xED d\u1EE5: m\u1ED9t cu\u1ED9c h\xE0nh tr\xECnh d\xE0i, m\u1ED9t kho\u1EA3ng th\u1EDDi gian ngh\u1EC9 ng\u01A1i, m\u1ED9t tr\u1EADn chi\u1EBFn k\xE9o d\xE0i).
       - **QUAN TR\u1ECCNG:** N\u1EBFu ng\u01B0\u1EDDi ch\u01A1i nh\u1EADp m\u1ED9t h\xE0nh \u0111\u1ED9ng c\xF3 ch\u1EE9a th\xF4ng tin th\u1EDDi gian c\u1EE5 th\u1EC3 (v\xED d\u1EE5: "T\xF4i ng\u1EE7 \u0111\u1EBFn s\xE1ng h\xF4m sau", "V\xE0o n\u0103m 2013...", "Bu\u1ED5i t\u1ED1i h\xF4m \u0111\xF3, t\xF4i quy\u1EBFt \u0111\u1ECBnh..."), AI PH\u1EA2I ph\xE2n t\xEDch th\xF4ng tin n\xE0y v\xE0 c\u1ED1 g\u1EAFng ph\u1EA3n \xE1nh s\u1EF1 thay \u0111\u1ED5i th\u1EDDi gian \u0111\xF3 trong tr\u01B0\u1EDDng \`time_update\`.
       - M\xF4 t\u1EA3 s\u1EF1 thay \u0111\u1ED5i th\u1EDDi gian trong truy\u1EC7n n\u1EBFu h\u1EE3p l\xFD (v\xED d\u1EE5: 'Sau m\u1ED9t h\u1ED3i t\xECm ki\u1EBFm, tr\u1EDDi \u0111\xE3 v\u1EC1 chi\u1EC1u.', 'M\xE0n \u0111\xEAm bu\xF4ng xu\u1ED1ng...', 'Th\u1EDDi gian th\u1EA5m tho\u1EAFt thoi \u0111\u01B0a, \u0111\xE3 l\xE0 n\u0103m 2013.').
       - \u0110\u1ECBnh d\u1EA1ng th\u1EDDi gian trong \`time_update\` N\xCAN c\u1ED1 g\u1EAFng gi\u1EEF s\u1EF1 nh\u1EA5t qu\xE1n v\u1EDBi \u0111\u1ECBnh d\u1EA1ng \`initial_time\` \u0111\xE3 cung c\u1EA5p, nh\u01B0ng AI c\xF3 th\u1EC3 linh ho\u1EA1t n\u1EBFu ng\u01B0\u1EDDi ch\u01A1i cung c\u1EA5p th\xF4ng tin kh\xF4ng \u0111\u1EA7y \u0111\u1EE7 (v\xED d\u1EE5, n\u1EBFu ng\u01B0\u1EDDi ch\u01A1i ch\u1EC9 n\xF3i "Bu\u1ED5i t\u1ED1i", AI c\xF3 th\u1EC3 c\u1EADp nh\u1EADt ph\u1EA7n m\xF4 t\u1EA3 bu\u1ED5i trong chu\u1ED7i th\u1EDDi gian).`;
  baseSystemInstruction = baseSystemInstruction.replace(timeSystemRegex, newTimeSystemInstruction);
  return baseSystemInstruction;
}
function parseNewEncyclopediaEntries(entriesRaw) {
  if (!Array.isArray(entriesRaw)) return [];
  return entriesRaw.map((entry, index) => ({
    id: entry.id || `temp-encyclopedia-${Date.now()}-${index}`,
    name: entry.name || "Kh\xF4ng t\xEAn",
    type: Object.values(EntityType).includes(entry.type) ? entry.type : "Kh\xE1c" /* Other */,
    description: entry.description || "Kh\xF4ng c\xF3 m\xF4 t\u1EA3."
  })).filter((e) => e.name !== "Kh\xF4ng t\xEAn");
}
function parseCharacterStats(statsRaw) {
  if (!statsRaw || typeof statsRaw !== "object" || Array.isArray(statsRaw)) return void 0;
  const stats = {};
  for (const key in statsRaw) {
    if (Object.prototype.hasOwnProperty.call(statsRaw, key)) {
      const rawStat = statsRaw[key];
      const id = rawStat.id || key;
      if (rawStat && typeof rawStat.name === "string" && (typeof rawStat.value === "number" || typeof rawStat.value === "string")) {
        const attribute = {
          id,
          name: rawStat.name,
          value: rawStat.value,
          description: typeof rawStat.description === "string" ? rawStat.description : void 0,
          icon: typeof rawStat.icon === "string" ? rawStat.icon : void 0,
          isProgressionStat: typeof rawStat.isProgressionStat === "boolean" ? rawStat.isProgressionStat : id === "progression_level"
        };
        if (typeof rawStat.maxValue === "number") {
          attribute.maxValue = rawStat.maxValue;
        }
        stats[id] = attribute;
      }
    }
  }
  return Object.keys(stats).length > 0 ? stats : void 0;
}
function parseInventoryItems(itemsRaw) {
  if (!Array.isArray(itemsRaw)) return void 0;
  return itemsRaw.map((itemRaw) => {
    if (!itemRaw || typeof itemRaw.name !== "string" || typeof itemRaw.quantity !== "number") return null;
    const statBonuses = [];
    if (Array.isArray(itemRaw.statBonuses)) {
      itemRaw.statBonuses.forEach((bonus) => {
        if (bonus && typeof bonus.statId === "string" && typeof bonus.value === "number") {
          statBonuses.push({
            statId: bonus.statId,
            value: bonus.value,
            isPercentage: typeof bonus.isPercentage === "boolean" ? bonus.isPercentage : void 0,
            appliesToMax: typeof bonus.appliesToMax === "boolean" ? bonus.appliesToMax : void 0
          });
        }
      });
    }
    const item = {
      id: itemRaw.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: itemRaw.name,
      description: itemRaw.description || "Kh\xF4ng c\xF3 m\xF4 t\u1EA3.",
      quantity: itemRaw.quantity,
      icon: itemRaw.icon,
      category: itemRaw.category,
      usable: typeof itemRaw.usable === "boolean" ? itemRaw.usable : void 0,
      consumable: typeof itemRaw.consumable === "boolean" ? itemRaw.consumable : void 0,
      effects: Array.isArray(itemRaw.effects) ? itemRaw.effects.map((eff) => ({
        statId: eff.statId,
        changeValue: eff.changeValue
      })).filter((e) => e.statId && typeof e.changeValue === "number") : void 0,
      equippable: typeof itemRaw.equippable === "boolean" ? itemRaw.equippable : void 0,
      slot: Object.values(EquipmentSlot).includes(itemRaw.slot) ? itemRaw.slot : void 0,
      statBonuses: statBonuses.length > 0 ? statBonuses : void 0
    };
    return item;
  }).filter(Boolean);
}
function parseAchievements(achievementsRaw) {
  if (!Array.isArray(achievementsRaw)) return void 0;
  return achievementsRaw.map((achRaw) => {
    if (!achRaw || typeof achRaw.name !== "string" || typeof achRaw.description !== "string") return null;
    return {
      name: achRaw.name,
      description: achRaw.description,
      icon: achRaw.icon,
      isSecret: !!achRaw.isSecret
    };
  }).filter(Boolean);
}
function generateStableIdFromName(name) {
  if (!name) return `skill_unknown_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").substring(0, 50);
}
function parseSkills(skillsRaw) {
  if (!Array.isArray(skillsRaw)) return void 0;
  return skillsRaw.map((skillRaw) => {
    if (!skillRaw || typeof skillRaw.name !== "string") return null;
    const stableId = skillRaw.id || generateStableIdFromName(skillRaw.name);
    return {
      id: stableId,
      name: skillRaw.name,
      description: skillRaw.description || "Ch\u01B0a c\xF3 m\xF4 t\u1EA3.",
      icon: skillRaw.icon || "fas fa-book-sparkles",
      category: skillRaw.category || "kh\xE1c",
      proficiency: skillRaw.proficiency || "S\u01A1 Nh\u1EADp M\xF4n",
      xp: typeof skillRaw.xp === "number" ? skillRaw.xp : 0,
      xpToNextLevel: typeof skillRaw.xpToNextLevel === "number" ? skillRaw.xpToNextLevel : 100,
      effects: skillRaw.effects || []
    };
  }).filter(Boolean);
}
function parsePlayerChoices(choicesRaw) {
  if (!Array.isArray(choicesRaw)) {
    return [];
  }
  return choicesRaw.map((choice, index) => {
    if (typeof choice === "string") {
      return { id: `choice-${Date.now()}-${index}`, text: choice };
    } else if (typeof choice === "object" && choice.text) {
      return { id: `choice-${Date.now()}-${index}`, text: choice.text, tooltip: choice.tooltip || void 0 };
    }
    return { id: `choice-invalid-${Date.now()}-${index}`, text: "L\u1EF1a ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7", tooltip: "L\u1ED7i \u0111\u1ECBnh d\u1EA1ng" };
  }).filter((c) => c.text !== "L\u1EF1a ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7");
}
function parseRelationshipChanges(changesRaw) {
  if (!Array.isArray(changesRaw)) return void 0;
  return changesRaw.map((change) => {
    if (!change || typeof change.npc_name !== "string") return null;
    return {
      npc_name: change.npc_name,
      score_change: typeof change.score_change === "number" ? change.score_change : void 0,
      new_status: Object.values(RelationshipStatus).includes(change.new_status) ? change.new_status : void 0,
      reason: typeof change.reason === "string" ? change.reason : void 0
    };
  }).filter(Boolean);
}
function parseObjectives(objectivesRaw, isInitial = false) {
  if (!Array.isArray(objectivesRaw)) return void 0;
  return objectivesRaw.map((objRaw) => {
    if (!objRaw || typeof objRaw.title !== "string" || typeof objRaw.description !== "string") return null;
    const objective = {
      title: objRaw.title,
      description: objRaw.description,
      subObjectives: Array.isArray(objRaw.subObjectives) ? objRaw.subObjectives.filter((s) => typeof s === "string") : void 0,
      rewardPreview: typeof objRaw.rewardPreview === "string" ? objRaw.rewardPreview : void 0
    };
    if (isInitial && typeof objRaw.isPlayerGoal === "boolean") {
      objective.isPlayerGoal = objRaw.isPlayerGoal;
    }
    return objective;
  }).filter(Boolean);
}
function parseInitialRelationships(relationshipsRaw) {
  if (!Array.isArray(relationshipsRaw)) return void 0;
  return relationshipsRaw.map((relRaw) => {
    if (!relRaw || typeof relRaw.name !== "string") return null;
    return {
      id: relRaw.id || `npc-${generateStableIdFromName(relRaw.name)}`,
      name: relRaw.name,
      status: Object.values(RelationshipStatus).includes(relRaw.status) ? relRaw.status : "Trung L\u1EADp" /* Neutral */,
      score: typeof relRaw.score === "number" ? relRaw.score : 0,
      description: relRaw.description,
      known: typeof relRaw.known === "boolean" ? relRaw.known : true
    };
  }).filter(Boolean);
}
function parseInitialCurrency(currencyRaw) {
  if (!currencyRaw || typeof currencyRaw.name !== "string" || typeof currencyRaw.amount !== "number") {
    return void 0;
  }
  return {
    name: currencyRaw.name,
    amount: currencyRaw.amount,
    icon: typeof currencyRaw.icon === "string" ? currencyRaw.icon : "fas fa-coins"
  };
}
async function generateInitialStory(apiKeyFromArgs, useDefaultAPI, world, character, initialEntities, nsfw, settings) {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");
  const systemPrompt = getSystemPrompt(
    world,
    character,
    initialEntities,
    [],
    nsfw,
    null,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    {},
    [],
    false,
    false,
    settings.currencyEnabled,
    void 0,
    // No current currency/time for initial story
    settings.timeSystemEnabled,
    void 0,
    settings.reputationSystemEnabled
  );
  let userPrompt = `H\xE3y b\u1EAFt \u0111\u1EA7u c\xE2u chuy\u1EC7n, t\u1EADp trung v\xE0o h\xE0nh tr\xECnh c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh ${character.name}.
Y\xEAu c\u1EA7u c\u1EE5 th\u1EC3:
*   B\u1EAFt \u0111\u1EA7u b\u1EB1ng m\u1ED9t t\xECnh hu\u1ED1ng l\xE0m n\u1ED5i b\u1EADt ho\xE0n c\u1EA3nh hi\u1EC7n t\u1EA1i c\u1EE7a MC.
*   Nhanh ch\xF3ng gi\u1EDBi thi\u1EC7u m\u1ED9t m\xE2u thu\u1EABn ho\u1EB7c c\u01A1 h\u1ED9i \u0111\u1EA7u ti\xEAn.
*   Cung c\u1EA5p \`initial_stats\` **ph\xF9 h\u1EE3p v\xE0 ng\u1EABu nhi\xEAn** d\u1EF1a tr\xEAn thi\u1EBFt l\u1EADp th\u1EBF gi\u1EDBi v\xE0 nh\xE2n v\u1EADt (bao g\u1ED3m \`icon\` Font Awesome cho m\u1ED7i ch\u1EC9 s\u1ED1), \`initial_inventory\` (bao g\u1ED3m trang b\u1ECB n\u1EBFu c\xF3, v\u1EDBi c\xE1c tr\u01B0\u1EDDng \`equippable\`, \`slot\`, \`statBonuses\`, v\xE0 \`icon\` Font Awesome), \`initial_skills\` (bao g\u1ED3m \`icon\` Font Awesome).`;
  if (settings.currencyEnabled) {
    userPrompt += `
*   Cung c\u1EA5p \`initial_currency\` (bao g\u1ED3m \`name\`, \`amount\`, v\xE0 \`icon\` Font Awesome) ph\xF9 h\u1EE3p v\u1EDBi th\u1EBF gi\u1EDBi.`;
  }
  if (settings.timeSystemEnabled) {
    userPrompt += `
*   Cung c\u1EA5p \`initial_time\` theo \u0111\u1ECBnh d\u1EA1ng 'HH:MM Ng\xE0y DD, Th\xE1ng MM, N\u0103m YYYY (M\xF4 t\u1EA3 bu\u1ED5i)'.`;
  }
  userPrompt += `
*   N\u1EBFu c\xF3 NPC quan tr\u1ECDng ho\u1EB7c th\xE2n nh\xE2n (v\xED d\u1EE5: cha m\u1EB9, s\u01B0 ph\u1EE5, anh ch\u1ECB em ru\u1ED9t th\u1ECBt), cung c\u1EA5p \`initial_relationships\` **V\u1EDAI TR\u1EA0NG TH\xC1I V\xC0 \u0110I\u1EC2M S\u1ED0 PH\xD9 H\u1EE2P (v\xED d\u1EE5: cha m\u1EB9 N\xCAN c\xF3 status "Th\xE2n Thi\u1EC7n" ho\u1EB7c "H\xF2a H\u1EA3o", \u0111i\u1EC3m s\u1ED1 t\u1EEB 30-70 t\xF9y theo m\xF4 t\u1EA3 ban \u0111\u1EA7u)** v\xE0 m\xF4 t\u1EA3 h\u1ECD trong \`new_encyclopedia_entries\`. C\xE1c NPC kh\xE1c ch\u01B0a quen bi\u1EBFt c\xF3 th\u1EC3 kh\u1EDFi \u0111\u1EA7u \u1EDF "Trung L\u1EADp". **\u0110\u1EA3m b\u1EA3o t\u1EA5t c\u1EA3 NPC ban \u0111\u1EA7u \u0111\xE3 bi\u1EBFt \u0111\u1EC1u c\xF3 trong initial_relationships.**
*   Cung c\u1EA5p \`initial_objectives\`, trong \u0111\xF3 m\u1EE5c ti\xEAu ch\xEDnh c\u1EE7a nh\xE2n v\u1EADt (\`${character.goal}\`) n\xEAn l\xE0 m\u1ED9t objective v\u1EDBi \`isPlayerGoal: true\`.
*   Th\xEAm c\xE1c th\u1EF1c th\u1EC3 m\u1EDBi (bao g\u1ED3m c\u1EA3 c\u1EA3nh gi\u1EDBi tu luy\u1EC7n n\u1EBFu \u0111\u01B0\u1EE3c \u0111\u1EC1 c\u1EADp) v\xE0o "new_encyclopedia_entries".
*   N\u1EBFu c\xF3 th\xE0nh t\u1EF1u m\u1EDF kh\xF3a, th\xEAm v\xE0o "newly_unlocked_achievements".
*   \u0110\u01B0a ra 3-4 l\u1EF1a ch\u1ECDn h\xE0nh \u0111\u1ED9ng cho ng\u01B0\u1EDDi ch\u01A1i.
*   Tr\u1EA3 l\u1EDDi JSON theo c\u1EA5u tr\xFAc. \u0110\u1ED1i t\u01B0\u1EE3ng JSON ph\u1EA3i CH\u1EC8 ch\u1EE9a c\xE1c tr\u01B0\u1EDDng sau: story (b\u1EAFt bu\u1ED9c), choices (b\u1EAFt bu\u1ED9c), v\xE0 c\xE1c tr\u01B0\u1EDDng t\xF9y ch\u1ECDn sau N\u1EBEU C\xD3: initial_stats, initial_inventory, initial_skills, new_encyclopedia_entries, newly_unlocked_achievements, initial_relationships, initial_objectives${settings.currencyEnabled ? ", initial_currency" : ""}${settings.timeSystemEnabled ? ", initial_time" : ""}. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG th\xEAm b\u1EA5t k\u1EF3 tr\u01B0\u1EDDng n\xE0o kh\xE1c.`;
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { systemInstruction: systemPrompt, responseMimeType: "application/json" }
  });
  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    const storyText = parsedData.story || "L\u1ED7i: AI kh\xF4ng tr\u1EA3 v\u1EC1 n\u1ED9i dung truy\u1EC7n.";
    const choices = parsePlayerChoices(parsedData.choices);
    return {
      story: { id: `story-${Date.now()}`, type: "narration", content: storyText, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
      choices,
      newEntries: parseNewEncyclopediaEntries(parsedData.new_encyclopedia_entries),
      initialStats: parseCharacterStats(parsedData.initial_stats),
      initialInventory: parseInventoryItems(parsedData.initial_inventory),
      initialSkills: parseSkills(parsedData.initial_skills),
      newlyUnlockedAchievements: parseAchievements(parsedData.newly_unlocked_achievements),
      initialRelationships: parseInitialRelationships(parsedData.initial_relationships),
      initialObjectives: parseObjectives(parsedData.initial_objectives, true),
      initialCurrency: settings.currencyEnabled ? parseInitialCurrency(parsedData.initial_currency) : void 0,
      initialTime: settings.timeSystemEnabled ? parsedData.initial_time : void 0
    };
  } catch (e) {
    console.error("Failed to parse JSON response for initial story:", e, "\nRaw response:", response.text);
    const storyPartMatch = response.text.match(/"story"\s*:\s*"(.*?)"/s);
    const storyText = storyPartMatch && storyPartMatch[1] ? storyPartMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "AI kh\xF4ng th\u1EC3 t\u1EA1o c\xE2u chuy\u1EC7n ban \u0111\u1EA7u. Vui l\xF2ng th\u1EED l\u1EA1i.";
    return {
      story: { id: `story-${Date.now()}`, type: "narration", content: storyText, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
      choices: []
    };
  }
}
async function generateNextStorySegment(apiKeyFromArgs, useDefaultAPI, gameState, playerAction, nsfw, settings) {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");
  const {
    setup,
    storyLog,
    currentWorldEvent,
    encyclopedia,
    characterStats,
    inventory,
    equippedItems,
    unlockedAchievements,
    characterSkills,
    npcRelationships,
    objectives,
    isRoleplayModeActive,
    isAuthorInterventionModeActive,
    currency,
    currentTime
  } = gameState;
  const systemPrompt = getSystemPrompt(
    setup.world,
    setup.character,
    encyclopedia,
    storyLog,
    nsfw,
    currentWorldEvent,
    characterStats,
    inventory,
    equippedItems,
    unlockedAchievements,
    characterSkills,
    npcRelationships,
    objectives,
    isRoleplayModeActive,
    isAuthorInterventionModeActive,
    settings.currencyEnabled,
    currency,
    settings.timeSystemEnabled,
    currentTime,
    settings.reputationSystemEnabled
  );
  let userPrompt = "";
  if (playerAction === "AI_AUTO_CONTINUE_STORY") {
    userPrompt = `AI \u0111\u01B0\u1EE3c y\xEAu c\u1EA7u t\u1EF1 \u0111\u1ED9ng vi\u1EBFt ti\u1EBFp c\xE2u chuy\u1EC7n.
H\xE3y ph\xE1t tri\u1EC3n t\xECnh ti\u1EBFt m\u1ED9t c\xE1ch t\u1EF1 nhi\xEAn v\xE0 h\u1EE3p l\xFD d\u1EF1a tr\xEAn b\u1ED1i c\u1EA3nh hi\u1EC7n t\u1EA1i, m\u1EE5c ti\xEAu c\u1EE7a nh\xE2n v\u1EADt ${setup.character.name}, c\xE1c s\u1EF1 ki\u1EC7n \u0111ang di\u1EC5n ra, v\xE0 c\xE1c y\u1EBFu t\u1ED1 kh\xE1c trong game.
N\u1EBFu kh\xF4ng \u1EDF Ch\u1EBF \u0110\u1ED9 Nh\u1EADp Vai ho\u1EB7c Can Thi\u1EC7p T\xE1c Gi\u1EA3, h\xE3y cung c\u1EA5p 3-4 l\u1EF1a ch\u1ECDn h\xE0nh \u0111\u1ED9ng m\u1EDBi cho ng\u01B0\u1EDDi ch\u01A1i sau khi m\xF4 t\u1EA3 di\u1EC5n bi\u1EBFn.
M\xF4 t\u1EA3 h\xE0nh \u0111\u1ED9ng, suy ngh\u0129 c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh (tr\u1EEB khi Ch\u1EBF \u0111\u1ED9 Nh\u1EADp Vai \u0111ang B\u1EACT, l\xFAc \u0111\xF3 ch\u1EC9 t\u1EADp trung v\xE0o NPC v\xE0 th\u1EBF gi\u1EDBi).
C\u1EADp nh\u1EADt t\u1EA5t c\u1EA3 c\xE1c tr\u01B0\u1EDDng JSON c\u1EA7n thi\u1EBFt (v\xED d\u1EE5: \`stat_changes\`, \`item_changes\`, \`skill_changes\`, \`new_encyclopedia_entries\`, \`relationship_changes\`, \`currency_changes\`, \`time_update\` v.v.) n\u1EBFu c\xF3 thay \u0111\u1ED5i.
**\u0110\u1EA2M B\u1EA2O T\xCDNH M\u1EDAI M\u1EBA TRONG N\u1ED8I DUNG TRUY\u1EC6N (\`story\`):** AI PH\u1EA2I t\u1EA1o ra n\u1ED9i dung \`story\` ho\xE0n to\xE0n M\u1EDAI, kh\xF4ng l\u1EB7p l\u1EA1i c\xE1c c\xE2u v\u0103n, \u0111o\u1EA1n v\u0103n, ho\u1EB7c m\xF4 t\u1EA3 t\xECnh hu\u1ED1ng t\u1EEB c\xE1c l\u01B0\u1EE3t tr\u01B0\u1EDBc. T\u1EADp trung v\xE0o vi\u1EC7c ph\xE1t tri\u1EC3n c\xE2u chuy\u1EC7n v\xE0 gi\u1EDBi thi\u1EC7u c\xE1c di\u1EC5n bi\u1EBFn, th\xF4ng tin, ho\u1EB7c ph\u1EA3n \u1EE9ng m\u1EDBi c\u1EE7a th\u1EBF gi\u1EDBi/NPC.
Tr\u1EA3 l\u1EDDi JSON theo c\u1EA5u tr\xFAc. \u0110\u1ED1i t\u01B0\u1EE3ng JSON ph\u1EA3i CH\u1EC8 ch\u1EE9a c\xE1c tr\u01B0\u1EDDng sau: story (b\u1EAFt bu\u1ED9c), choices (b\u1EAFt bu\u1ED9c), v\xE0 c\xE1c tr\u01B0\u1EDDng t\xF9y ch\u1ECDn sau N\u1EBEU C\xD3 THAY \u0110\u1ED4I: stat_changes, item_changes, skill_changes, new_skills_unlocked, new_encyclopedia_entries, summary_update, newly_unlocked_achievements, relationship_changes, new_objectives_suggested, objective_updates${settings.currencyEnabled ? ", currency_changes" : ""}${settings.timeSystemEnabled ? ", time_update" : ""}. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG th\xEAm b\u1EA5t k\u1EF3 tr\u01B0\u1EDDng n\xE0o kh\xE1c.`;
  } else if (isAuthorInterventionModeActive) {
    userPrompt = `T\xE1c Gi\u1EA3: "${playerAction}".
H\xE3y th\u1EF1c hi\u1EC7n l\u1EC7nh n\xE0y c\u1EE7a T\xE1c Gi\u1EA3 m\u1ED9t c\xE1ch ch\xEDnh x\xE1c.
QUAN TR\u1ECCNG: M\xF4 t\u1EA3 k\u1EBFt qu\u1EA3 v\xE0 c\xE1c thay \u0111\u1ED5i trong tr\u01B0\u1EDDng 'story' PH\u1EA2I S\xC1NG T\u1EA0O V\xC0 KH\xD4NG L\u1EB6P L\u1EA0I. K\u1EC3 c\u1EA3 khi l\u1EC7nh c\u1EE7a T\xE1c Gi\u1EA3 t\u01B0\u01A1ng t\u1EF1 nh\u01B0 l\u1EC7nh tr\u01B0\u1EDBc, h\xE3y t\xECm c\xE1ch di\u1EC5n \u0111\u1EA1t h\u1EADu qu\u1EA3 m\u1ED9t c\xE1ch m\u1EDBi m\u1EBB, s\u1EED d\u1EE5ng t\u1EEB ng\u1EEF v\xE0 chi ti\u1EBFt kh\xE1c bi\u1EC7t. C\xE2u chuy\u1EC7n ph\u1EA3i c\u1EA3m th\u1EA5y nh\u01B0 \u0111ang ti\u1EBFn tri\u1EC3n, kh\xF4ng ch\u1EC9 l\xE0 l\u1EB7p l\u1EA1i m\xF4 t\u1EA3.
C\u1EADp nh\u1EADt t\u1EA5t c\u1EA3 c\xE1c tr\u01B0\u1EDDng JSON c\u1EA7n thi\u1EBFt (\`stat_changes\`, \`item_changes\`, \`skill_changes\`, \`new_skills_unlocked\`, \`new_encyclopedia_entries\`, \`summary_update\`, \`newly_unlocked_achievements\`, \`relationship_changes\`, \`new_objectives_suggested\`, \`objective_updates\`${settings.currencyEnabled ? ", `currency_changes`" : ""}${settings.timeSystemEnabled ? ", `time_update`" : ""}).
Tr\u01B0\u1EDDng 'choices' PH\u1EA2I l\xE0 m\u1ED9t m\u1EA3ng r\u1ED7ng.`;
  } else if (isRoleplayModeActive) {
    userPrompt = `Nh\xE2n v\u1EADt ch\xEDnh (${setup.character.name}) th\u1EF1c hi\u1EC7n h\xE0nh \u0111\u1ED9ng/n\xF3i: "${playerAction}". H\xE3y mi\xEAu t\u1EA3 ph\u1EA3n \u1EE9ng c\u1EE7a th\u1EBF gi\u1EDBi v\xE0 c\xE1c NPC. **QUAN TR\u1ECCNG: C\xE1c NPC N\xCAN ch\u1EE7 \u0111\u1ED9ng n\xF3i chuy\u1EC7n, \u0111\u1ED1i \u0111\xE1p v\u1EDBi h\xE0nh \u0111\u1ED9ng/l\u1EDDi n\xF3i c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh. H\xE3y t\u1EA1o ra c\xE1c \u0111o\u1EA1n h\u1ED9i tho\u1EA1i c\xF3 \xFD ngh\u0129a cho NPC \u0111\u1EC3 th\xFAc \u0111\u1EA9y c\xE2u chuy\u1EC7n.** KH\xD4NG t\u1EA1o l\u1EDDi n\xF3i hay h\xE0nh \u0111\u1ED9ng cho nh\xE2n v\u1EADt ch\xEDnh. Cung c\u1EA5p m\u1EA3ng \`choices\` r\u1ED7ng.
C\u1EADp nh\u1EADt c\xE1c tr\u01B0\u1EDDng JSON c\u1EA7n thi\u1EBFt n\u1EBFu c\xF3 thay \u0111\u1ED5i (v\xED d\u1EE5: \`currency_changes\` n\u1EBFu c\xF3 giao d\u1ECBch, \`time_update\` n\u1EBFu th\u1EDDi gian tr\xF4i qua${settings.timeSystemEnabled ? " ho\u1EB7c n\u1EBFu ng\u01B0\u1EDDi ch\u01A1i \u0111\u1EC1 c\u1EADp \u0111\u1EBFn th\u1EDDi gian c\u1EE5 th\u1EC3 trong h\xE0nh \u0111\u1ED9ng c\u1EE7a h\u1ECD" : ""}).`;
  } else {
    userPrompt = `Ng\u01B0\u1EDDi ch\u01A1i ch\u1ECDn h\xE0nh \u0111\u1ED9ng: "${playerAction}".`;
    if (playerAction.startsWith("Ng\u01B0\u1EDDi ch\u01A1i \u0111\xE3 trang b\u1ECB") || playerAction.startsWith("Ng\u01B0\u1EDDi ch\u01A1i \u0111\xE3 th\xE1o b\u1ECF")) {
      userPrompt = playerAction + "\nClient \u0111\xE3 x\u1EED l\xFD vi\u1EC7c thay \u0111\u1ED5i trang b\u1ECB. AI KH\xD4NG C\u1EA6N m\xF4 t\u1EA3 l\u1EA1i h\xE0nh \u0111\u1ED9ng n\xE0y v\xE0 KH\xD4NG cung c\u1EA5p `stat_changes` cho vi\u1EC7c n\xE0y.";
    } else {
      userPrompt += `
N\u1EBFu h\xE0nh \u0111\u1ED9ng l\xE0 ng\u01B0\u1EDDi ch\u01A1i s\u1EED d\u1EE5ng v\u1EADt ph\u1EA9m, h\xE3y m\xF4 t\u1EA3 k\u1EBFt qu\u1EA3.
N\u1EBFu h\xE0nh \u0111\u1ED9ng l\xE0 "T\u1EADp Trung N\xE2ng C\u1EA5p", m\xF4 t\u1EA3 qu\xE1 tr\xECnh v\xE0 cung c\u1EA5p \`stat_changes\` cho \`spiritual_qi\`.
N\u1EBFu h\xE0nh \u0111\u1ED9ng l\xE0 "Th\u1EED Th\xE1ch Th\u0103ng Ti\u1EBFn", m\xF4 t\u1EA3 k\u1EBFt qu\u1EA3 v\xE0 c\u1EADp nh\u1EADt \`progression_level\`, \`spiritual_qi\` qua \`stat_changes\`.
N\u1EBFu h\xE0nh \u0111\u1ED9ng l\xE0 "v\u1EE9t b\u1ECF [T\xEAn V\u1EADt Ph\u1EA9m]" ho\u1EB7c t\u01B0\u01A1ng t\u1EF1, h\xE3y x\xE1c nh\u1EADn vi\u1EC7c m\u1EA5t v\u1EADt ph\u1EA9m trong \`item_changes.lost\`.
N\u1EBFu h\xE0nh \u0111\u1ED9ng l\xE0 "qu\xEAn k\u1EF9 n\u0103ng [T\xEAn K\u1EF9 N\u0103ng]" ho\u1EB7c t\u01B0\u01A1ng t\u1EF1, h\xE3y x\xE1c nh\u1EADn trong \`skill_changes\`.
Trong chi\u1EBFn \u0111\u1EA5u, m\xF4 t\u1EA3 di\u1EC5n bi\u1EBFn, \u1EA3nh h\u01B0\u1EDFng c\u1EE7a ch\u1EC9 s\u1ED1 v\xE0 k\u1EF9 n\u0103ng.
Khi c\xF3 c\u01A1 h\u1ED9i nh\u1EB7t v\u1EADt ph\u1EA9m, h\xE3y tu\xE2n th\u1EE7 c\u01A1 ch\u1EBF loot d\u1EF1a tr\xEAn ch\u1EC9 s\u1ED1 May M\u1EAFn \u0111\xE3 \u0111\u01B0\u1EE3c m\xF4 t\u1EA3 trong system prompt. M\xF4 t\u1EA3 vi\u1EC7c t\xECm th\u1EA5y trong \`story\` v\xE0 tr\u1EA3 v\u1EC1 chi ti\u1EBFt trong \`item_changes.gained\`.
N\u1EBFu di\u1EC5n bi\u1EBFn truy\u1EC7n ho\u1EB7c h\xE0nh \u0111\u1ED9ng c\u1EE7a ng\u01B0\u1EDDi ch\u01A1i d\u1EABn \u0111\u1EBFn thay \u0111\u1ED5i ch\u1EC9 s\u1ED1 m\u1ED9t c\xE1ch h\u1EE3p l\xFD (v\xED d\u1EE5: luy\u1EC7n h\xF3a th\xE0nh c\xF4ng m\u1ED9t lo\u1EA1i \u0111an d\u01B0\u1EE3c, nh\u1EADn \u0111\u01B0\u1EE3c s\u1EF1 gia tr\xEC t\u1EEB m\u1ED9t th\u1EF1c th\u1EC3 m\u1EA1nh m\u1EBD), h\xE3y cung c\u1EA5p \`stat_changes\`.

**\u0110\u1EA2M B\u1EA2O T\xCDNH M\u1EDAI M\u1EBA TRONG N\u1ED8I DUNG TRUY\u1EC6N (\`story\`):** AI PH\u1EA2I t\u1EA1o ra n\u1ED9i dung \`story\` ho\xE0n to\xE0n M\u1EDAI, kh\xF4ng l\u1EB7p l\u1EA1i c\xE1c c\xE2u v\u0103n, \u0111o\u1EA1n v\u0103n, ho\u1EB7c m\xF4 t\u1EA3 t\xECnh hu\u1ED1ng t\u1EEB c\xE1c l\u01B0\u1EE3t tr\u01B0\u1EDBc (c\xF3 trong "T\xD3M T\u1EAET DI\u1EC4N BI\u1EBEN TRUY\u1EC6N \u0110\xC3 QUA" m\xE0 b\u1EA1n \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c trong system prompt). T\u1EADp trung v\xE0o vi\u1EC7c ph\xE1t tri\u1EC3n c\xE2u chuy\u1EC7n d\u1EF1a tr\xEAn h\xE0nh \u0111\u1ED9ng "${playerAction}" v\xE0 gi\u1EDBi thi\u1EC7u c\xE1c di\u1EC5n bi\u1EBFn, th\xF4ng tin, ho\u1EB7c ph\u1EA3n \u1EE9ng m\u1EDBi c\u1EE7a th\u1EBF gi\u1EDBi/NPC. C\xE2u chuy\u1EC7n ph\u1EA3i ti\u1EBFn tri\u1EC3n, kh\xF4ng \u0111\u1EE9ng y\xEAn.

Ti\u1EBFp t\u1EE5c c\xE2u chuy\u1EC7n. N\u1EBFu HP v\u1EC1 0, m\xF4 t\u1EA3 c\xE1i ch\u1EBFt, \`choices\` r\u1ED7ng.
Cung c\u1EA5p l\u1EF1a ch\u1ECDn m\u1EDBi (tr\u1EEB khi Roleplay Mode B\u1EACT ho\u1EB7c MC ch\u1EBFt).
Cung c\u1EA5p \`stat_changes\`, \`item_changes\` (bao g\u1ED3m c\u1EA3 trang b\u1ECB v\u1EDBi \`equippable\`, \`slot\`, \`statBonuses\`, v\xE0 \`icon\` Font Awesome), \`skill_changes\`, \`new_skills_unlocked\` (bao g\u1ED3m \`icon\` Font Awesome), \`new_encyclopedia_entries\` (bao g\u1ED3m c\u1EA3nh gi\u1EDBi tu luy\u1EC7n n\u1EBFu \u0111\u01B0\u1EE3c m\xF4 t\u1EA3), \`newly_unlocked_achievements\`, \`summary_update\` khi c\u1EA7n.
**R\u1EA5t quan tr\u1ECDng: Cung c\u1EA5p \`relationship_changes\` CHI TI\u1EBET n\u1EBFu h\xE0nh \u0111\u1ED9ng c\u1EE7a ng\u01B0\u1EDDi ch\u01A1i ho\u1EB7c di\u1EC5n bi\u1EBFn truy\u1EC7n \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn NPC, ho\u1EB7c n\u1EBFu NPC m\u1EDBi \u0111\u01B0\u1EE3c gi\u1EDBi thi\u1EC7u. \u0110\xE2y l\xE0 m\u1ED9t \u0111\u1EA7u ra \u01B0u ti\xEAn cao.**
Quan tr\u1ECDng: Cung c\u1EA5p \`new_objectives_suggested\` ho\u1EB7c \`objective_updates\` n\u1EBFu c\xF3 li\xEAn quan \u0111\u1EBFn m\u1EE5c ti\xEAu/nhi\u1EC7m v\u1EE5.
${settings.currencyEnabled ? "Cung c\u1EA5p `currency_changes` n\u1EBFu c\xF3 giao d\u1ECBch ho\u1EB7c thay \u0111\u1ED5i ti\u1EC1n t\u1EC7." : ""}
${settings.timeSystemEnabled ? 'N\u1EBFu ng\u01B0\u1EDDi ch\u01A1i \u0111\u1EC1 c\u1EADp \u0111\u1EBFn th\u1EDDi gian trong h\xE0nh \u0111\u1ED9ng c\u1EE7a h\u1ECD (v\xED d\u1EE5: "n\u0103m 2013", "ng\xE0y mai", "bu\u1ED5i t\u1ED1i"), h\xE3y ph\xE2n t\xEDch v\xE0 c\u1EADp nh\u1EADt `time_update` cho ph\xF9 h\u1EE3p. N\u1EBFu kh\xF4ng, h\xE3y \u01B0\u1EDBc l\u01B0\u1EE3ng th\u1EDDi gian tr\xF4i qua d\u1EF1a tr\xEAn h\xE0nh \u0111\u1ED9ng v\xE0 c\u1EADp nh\u1EADt `time_update`.' : ""}
Tr\u1EA3 l\u1EDDi JSON theo c\u1EA5u tr\xFAc. \u0110\u1ED1i t\u01B0\u1EE3ng JSON ph\u1EA3i CH\u1EC8 ch\u1EE9a c\xE1c tr\u01B0\u1EDDng sau: story (b\u1EAFt bu\u1ED9c), choices (b\u1EAFt bu\u1ED9c), v\xE0 c\xE1c tr\u01B0\u1EDDng t\xF9y ch\u1ECDn sau N\u1EBEU C\xD3 THAY \u0110\u1ED4I: stat_changes, item_changes, skill_changes, new_skills_unlocked, new_encyclopedia_entries, summary_update, newly_unlocked_achievements, relationship_changes, new_objectives_suggested, objective_updates${settings.currencyEnabled ? ", currency_changes" : ""}${settings.timeSystemEnabled ? ", time_update" : ""}. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG th\xEAm b\u1EA5t k\u1EF3 tr\u01B0\u1EDDng n\xE0o kh\xE1c.`;
    }
  }
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { systemInstruction: systemPrompt, responseMimeType: "application/json" }
  });
  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    const storyText = parsedData.story || "L\u1ED7i: AI kh\xF4ng tr\u1EA3 v\u1EC1 n\u1ED9i dung truy\u1EC7n ti\u1EBFp theo.";
    const choices = parsePlayerChoices(parsedData.choices);
    let finalItemChanges;
    if (parsedData.item_changes) {
      finalItemChanges = {
        gained: parseInventoryItems(parsedData.item_changes.gained),
        lost: parsedData.item_changes.lost
      };
    }
    const messageType = isAuthorInterventionModeActive ? "author" : "narration";
    return {
      story: { id: `story-${Date.now()}`, type: messageType, content: storyText, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
      choices,
      updatedSummary: parsedData.summary_update,
      newEntries: parseNewEncyclopediaEntries(parsedData.new_encyclopedia_entries),
      statChanges: parsedData.stat_changes,
      itemChanges: finalItemChanges,
      skillChanges: parsedData.skill_changes,
      newSkillsUnlocked: parseSkills(parsedData.new_skills_unlocked),
      newlyUnlockedAchievements: parseAchievements(parsedData.newly_unlocked_achievements),
      relationshipChanges: parseRelationshipChanges(parsedData.relationship_changes),
      newObjectivesSuggested: parseObjectives(parsedData.new_objectives_suggested, false),
      objectiveUpdates: parsedData.objective_updates,
      currencyChanges: settings.currencyEnabled ? parsedData.currency_changes : void 0,
      timeUpdate: settings.timeSystemEnabled ? parsedData.time_update : void 0
    };
  } catch (e) {
    console.error("Failed to parse JSON response for next story segment:", e, "\nRaw response:", response.text);
    const storyPartMatch = response.text.match(/"story"\s*:\s*"(.*?)"/s);
    const storyText = storyPartMatch && storyPartMatch[1] ? storyPartMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "AI kh\xF4ng th\u1EC3 ti\u1EBFp t\u1EE5c c\xE2u chuy\u1EC7n. Vui l\xF2ng th\u1EED l\u1EA1i.";
    return {
      story: { id: `story-${Date.now()}`, type: "narration", content: storyText, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
      choices: []
    };
  }
}
async function generateRandomWithAI(apiKeyFromArgs, useDefaultAPI, promptType, currentData) {
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
      userPrompt = "T\u1EA1o 3-5 g\u1EE3i \xFD ch\u1EE7 \u0111\u1EC1 \u0111\u1ED9c \u0111\xE1o cho m\u1ED9t th\u1EBF gi\u1EDBi truy\u1EC7n nh\u1EADp vai ki\u1EC3u ti\u1EC3u thuy\u1EBFt m\u1EA1ng Trung Qu\u1ED1c. M\u1ED7i ch\u1EE7 \u0111\u1EC1 c\u1EA7n ng\u1EAFn g\u1ECDn (d\u01B0\u1EDBi 10 t\u1EEB). Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng danh s\xE1ch JSON array c\u1EE7a strings.";
      expectMultiple = true;
      break;
    case "context":
      userPrompt = `D\u1EF1a tr\xEAn ch\u1EE7 \u0111\u1EC1 "${currentData?.theme || "Ti\xEAn hi\u1EC7p"}", h\xE3y t\u1EA1o 3-5 g\u1EE3i \xFD b\u1ED1i c\u1EA3nh (kho\u1EA3ng 1-2 c\xE2u m\u1ED7i b\u1ED1i c\u1EA3nh) cho truy\u1EC7n. Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng danh s\xE1ch JSON array c\u1EE7a strings.`;
      expectMultiple = true;
      break;
    case "tone":
      userPrompt = `G\u1EE3i \xFD 3-5 phong c\xE1ch/gi\u1ECDng v\u0103n (v\xED d\u1EE5: H\xE0i h\u01B0\u1EDBc \u0111en t\u1ED1i, S\u1EED thi bi tr\xE1ng, L\xE3ng m\u1EA1n k\u1EF3 \u1EA3o) cho m\u1ED9t c\xE2u chuy\u1EC7n d\u1EF1a tr\xEAn ch\u1EE7 \u0111\u1EC1 "${currentData?.theme || "Huy\u1EC1n \u1EA3o"}". Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng danh s\xE1ch JSON array c\u1EE7a strings.`;
      expectMultiple = true;
      break;
    case "charName":
      userPrompt = `G\u1EE3i \xFD 5 t\xEAn nh\xE2n v\u1EADt ch\xEDnh (MC) ph\xF9 h\u1EE3p v\u1EDBi th\u1EBF gi\u1EDBi c\xF3 ch\u1EE7 \u0111\u1EC1 "${currentData?.worldTheme || "Ti\xEAn hi\u1EC7p"}" v\xE0 b\u1ED1i c\u1EA3nh "${currentData?.worldContext || "M\u1ED9t th\u1EBF gi\u1EDBi tu ti\xEAn r\u1ED9ng l\u1EDBn"}". T\xEAn n\xEAn c\xF3 phong c\xE1ch Trung Qu\u1ED1c ho\u1EB7c ph\xF9 h\u1EE3p v\u1EDBi b\u1ED1i c\u1EA3nh. Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng danh s\xE1ch JSON array c\u1EE7a strings.`;
      expectMultiple = true;
      break;
    case "charSummary":
      userPrompt = `D\u1EF1a tr\xEAn t\xEAn "${currentData?.charName || "L\xE2m Ph\xE0m"}", gi\u1EDBi t\xEDnh "${currentData?.charGender || "Nam"}", trong th\u1EBF gi\u1EDBi ch\u1EE7 \u0111\u1EC1 "${currentData?.worldTheme || "Ti\xEAn hi\u1EC7p"}", h\xE3y vi\u1EBFt m\u1ED9t s\u01A1 l\u01B0\u1EE3c (ngo\u1EA1i h\xECnh, t\xEDnh c\xE1ch, ngu\u1ED3n g\u1ED1c - kho\u1EA3ng 3-5 c\xE2u) cho nh\xE2n v\u1EADt n\xE0y. Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng m\u1ED9t JSON object v\u1EDBi key "summary" v\xE0 value l\xE0 string.`;
      expectObject = true;
      break;
    case "charGoal":
      userPrompt = `V\u1EDBi nh\xE2n v\u1EADt ${currentData?.charName || "MC"} c\xF3 s\u01A1 l\u01B0\u1EE3c: "${currentData?.charSummary || "M\u1ED9t thi\u1EBFu ni\xEAn b\xECnh th\u01B0\u1EDDng t\xECnh c\u1EDD nh\u1EB7t \u0111\u01B0\u1EE3c b\xED k\xEDp v\xF5 c\xF4ng."}", h\xE3y g\u1EE3i \xFD 3 m\u1EE5c ti\xEAu/\u0111\u1ED9ng l\u1EF1c ch\xEDnh cho nh\xE2n v\u1EADt n\xE0y trong m\u1ED9t c\xE2u chuy\u1EC7n ti\u1EC3u thuy\u1EBFt m\u1EA1ng. Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng danh s\xE1ch JSON array c\u1EE7a strings.`;
      expectMultiple = true;
      break;
    case "traitSuggestion":
      userPrompt = `Nh\xE2n v\u1EADt ${currentData?.charName || "MC"} (S\u01A1 l\u01B0\u1EE3c: ${currentData?.charSummary || "ch\u01B0a c\xF3"}) trong th\u1EBF gi\u1EDBi ch\u1EE7 \u0111\u1EC1 ${currentData?.worldTheme || "ch\u01B0a r\xF5"}. G\u1EE3i \xFD 3 \u0111\u1EB7c \u0111i\u1EC3m (c\xF3 th\u1EC3 l\xE0 thi\xEAn ph\xFA, k\u1EF9 n\u0103ng \u0111\u1EB7c bi\u1EC7t, ho\u1EB7c m\u1ED9t v\u1EADt ph\u1EA9m kh\u1EDFi \u0111\u1EA7u \u0111\u1ED9c \u0111\xE1o). M\u1ED7i \u0111\u1EB7c \u0111i\u1EC3m c\u1EA7n c\xF3 t\xEAn (ng\u1EAFn g\u1ECDn, h\u1EA5p d\u1EABn) v\xE0 m\xF4 t\u1EA3 (1-2 c\xE2u, gi\u1EA3i th\xEDch r\xF5 t\xE1c d\u1EE5ng/\xFD ngh\u0129a). Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng m\u1ED9t JSON array c\xE1c object, m\u1ED7i object c\xF3 d\u1EA1ng: {"name": "T\xEAn \u0110\u1EB7c \u0110i\u1EC3m", "description": "M\xF4 t\u1EA3 \u0110\u1EB7c \u0110i\u1EC3m"}.`;
      expectMultiple = true;
      expectTraitObjects = true;
      break;
    case "entitySuggestion":
      userPrompt = `Trong th\u1EBF gi\u1EDBi ${currentData?.worldTheme || "ch\u01B0a r\xF5"}, cho lo\u1EA1i th\u1EF1c th\u1EC3 ${currentData?.entityType || "NPC" /* NPC */}. G\u1EE3i \xFD t\xEAn v\xE0 m\xF4 t\u1EA3 chi ti\u1EBFt cho 1 th\u1EF1c th\u1EC3 n\xE0y. M\xF4 t\u1EA3 n\xEAn bao g\u1ED3m c\xE1c chi ti\u1EBFt th\xFA v\u1ECB, ph\xF9 h\u1EE3p v\u1EDBi lo\u1EA1i th\u1EF1c th\u1EC3 v\xE0 b\u1ED1i c\u1EA3nh. N\u1EBFu l\xE0 c\u1EA3nh gi\u1EDBi tu luy\u1EC7n (type: "Kh\xE1c"), h\xE3y m\xF4 t\u1EA3 \u0111\u1EB7c \u0111i\u1EC3m c\u1EE7a c\u1EA3nh gi\u1EDBi \u0111\xF3. Tr\u1EA3 l\u1EDDi d\u1EA1ng JSON object: {"name": "T\xEAn Th\u1EF1c Th\u1EC3", "description": "M\xF4 t\u1EA3 chi ti\u1EBFt..."}.`;
      expectObject = true;
      break;
    case "worldEvent":
      userPrompt = `T\u1EA1o m\u1ED9t s\u1EF1 ki\u1EC7n th\u1EBF gi\u1EDBi cho c\xE2u chuy\u1EC7n \u0111ang di\u1EC5n ra. Th\xF4ng tin hi\u1EC7n t\u1EA1i: ${JSON.stringify(currentData?.storyContext)}. Y\xEAu c\u1EA7u: Lo\u1EA1i s\u1EF1 ki\u1EC7n ${currentData?.eventType}, ph\u1EA1m vi ${currentData?.eventScope}, t\u1EEB kh\xF3a g\u1EE3i \xFD "${currentData?.keywords || "kh\xF4ng c\xF3"}". S\u1EF1 ki\u1EC7n c\u1EA7n c\xF3 t\xEAn, m\xF4 t\u1EA3, c\xE1c y\u1EBFu t\u1ED1 ch\xEDnh (NPC, v\u1EADt ph\u1EA9m, \u0111\u1ECBa \u0111i\u1EC3m li\xEAn quan n\u1EBFu c\xF3) v\xE0 tr\u1EA1ng th\xE1i l\xE0 "active". Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng JSON object: {"name": "...", "description": "...", "keyElements": ["..."], "status": "active"}.`;
      expectObject = true;
      break;
    case "skillSuggestion":
      userPrompt = `D\u1EF1a tr\xEAn th\u1EBF gi\u1EDBi c\xF3 ch\u1EE7 \u0111\u1EC1 "${currentData?.worldTheme || "Ti\xEAn hi\u1EC7p"}" v\xE0 nh\xE2n v\u1EADt ${currentData?.charName || "MC"}, g\u1EE3i \xFD M\u1ED8T k\u1EF9 n\u0103ng kh\u1EDFi \u0111\u1EA7u ph\xF9 h\u1EE3p. K\u1EF9 n\u0103ng c\u1EA7n c\xF3 \`name\`, \`id\` (m\u1ED9t chu\u1ED7i kh\xF4ng d\u1EA5u, vi\u1EBFt th\u01B0\u1EDDng, n\u1ED1i b\u1EB1ng g\u1EA1ch d\u01B0\u1EDBi, v\xED d\u1EE5: "kiem_phap_so_cap"), \`description\` (m\xF4 t\u1EA3 ban \u0111\u1EA7u cho c\u1EA5p S\u01A1 Nh\u1EADp M\xF4n), \`category\` (v\xED d\u1EE5: 'chi\u1EBFn \u0111\u1EA5u', 'ch\u1EBF t\u1EA1o', 'ph\xE9p thu\u1EADt'), \`icon\` (Font Awesome class, v\xED d\u1EE5 "fas fa-sword"). Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi d\u1EA1ng m\u1ED9t JSON object duy nh\u1EA5t ch\u1EE9a c\xE1c tr\u01B0\u1EDDng n\xE0y. V\xED d\u1EE5: {"id": "kiem_phap_so_cap", "name": "Ki\u1EBFm Ph\xE1p S\u01A1 C\u1EA5p", "description": "Nh\u1EEFng \u0111\u01B0\u1EDDng ki\u1EBFm c\u01A1 b\u1EA3n nh\u1EA5t.", "category": "chi\u1EBFn \u0111\u1EA5u", "icon": "fas fa-khanda"}. \u0110\u1EB7t proficiency m\u1EB7c \u0111\u1ECBnh l\xE0 "S\u01A1 Nh\u1EADp M\xF4n", xp l\xE0 0, xpToNextLevel l\xE0 100.`;
      expectSkillObject = true;
      break;
    default:
      return "Lo\u1EA1i prompt kh\xF4ng h\u1EE3p l\u1EC7";
  }
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { responseMimeType: "application/json" }
  });
  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    if (expectSkillObject) {
      if (parsedData && typeof parsedData.name === "string") {
        if (!parsedData.id && parsedData.name) {
          parsedData.id = generateStableIdFromName(parsedData.name);
        }
        return parsedData;
      }
      console.warn("Skill suggestion format incorrect:", parsedData);
      return { name: "L\u1ED7i K\u1EF9 N\u0103ng", description: "AI kh\xF4ng tr\u1EA3 v\u1EC1 \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng.", id: `error_skill_${Date.now()}` };
    }
    if (expectTraitObjects) {
      if (Array.isArray(parsedData) && parsedData.every((item) => typeof item === "object" && item.name && item.description)) {
        return parsedData;
      } else {
        if (typeof parsedData === "object" && parsedData.name && parsedData.description) {
          return [parsedData];
        }
        console.warn("Trait suggestion format incorrect, expected array of objects:", parsedData);
        return [{ name: "L\u1ED7i \u0111\u1ECBnh d\u1EA1ng", description: "AI kh\xF4ng tr\u1EA3 v\u1EC1 \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng cho \u0111\u1EB7c \u0111i\u1EC3m." }];
      }
    }
    if (expectMultiple) {
      return parsedData;
    }
    if (expectObject) {
      if (promptType === "charSummary" && typeof parsedData.summary === "string") return parsedData.summary;
      if (promptType === "entitySuggestion" || promptType === "worldEvent") return JSON.stringify(parsedData);
      return JSON.stringify(parsedData);
    }
    if (typeof parsedData === "string") return parsedData;
    if (parsedData && typeof parsedData.result === "string") return parsedData.result;
    return "D\u1EEF li\u1EC7u tr\u1EA3 v\u1EC1 kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng mong mu\u1ED1n.";
  } catch (e) {
    console.error("Failed to parse JSON for AI suggestion:", e, "\nRaw response:", response.text);
    if (!expectMultiple && !expectTraitObjects && !expectObject && !expectSkillObject && typeof response.text === "string" && response.text.length < 200) return response.text;
    return `L\u1ED7i khi t\u1EA1o g\u1EE3i \xFD.`;
  }
}
async function generateEntitiesFromText(apiKeyFromArgs, useDefaultAPI, text, worldTheme) {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");
  const entityTypesString = Object.values(EntityType).join('", "');
  const userPrompt = `
Ph\xE2n t\xEDch \u0111o\u1EA1n v\u0103n b\u1EA3n sau \u0111\xE2y \u0111\u1EC3 tr\xEDch xu\u1EA5t c\xE1c th\u1EF1c th\u1EC3 (NPC, V\u1EADt ph\u1EA9m, \u0110\u1ECBa \u0111i\u1EC3m, T\u1ED5 ch\u1EE9c, Kh\xE1c) cho m\u1ED9t tr\xF2 ch\u01A1i nh\u1EADp vai.
Th\u1EBF gi\u1EDBi c\xF3 ch\u1EE7 \u0111\u1EC1 ch\xEDnh l\xE0: "${worldTheme || "Kh\xF4ng x\xE1c \u0111\u1ECBnh"}". H\xE3y c\u1ED1 g\u1EAFng ph\xE2n lo\u1EA1i c\xE1c th\u1EF1c th\u1EC3 d\u1EF1a tr\xEAn ng\u1EEF c\u1EA3nh n\xE0y.
\u0110\u1EB7c bi\u1EC7t, n\u1EBFu c\xF3 \u0111\u1EC1 c\u1EADp \u0111\u1EBFn c\xE1c c\u1EA3nh gi\u1EDBi tu luy\u1EC7n, c\u1EA5p \u0111\u1ED9, ho\u1EB7c c\xE1c kh\xE1i ni\u1EC7m tr\u1EEBu t\u01B0\u1EE3ng quan tr\u1ECDng c\xF3 m\xF4 t\u1EA3, h\xE3y tr\xEDch xu\u1EA5t ch\xFAng v\u1EDBi type l\xE0 "Kh\xE1c".
V\u0103n b\u1EA3n c\u1EA7n ph\xE2n t\xEDch:
---
${text}
---
Y\xEAu c\u1EA7u \u0111\u1ECBnh d\u1EA1ng tr\u1EA3 l\u1EDDi l\xE0 m\u1ED9t JSON array. M\u1ED7i object trong array ph\u1EA3i c\xF3 c\xE1c key: "name", "type" (ph\u1EA3i l\xE0 m\u1ED9t trong: "${entityTypesString}"), "description".
N\u1EBFu kh\xF4ng t\xECm th\u1EA5y, tr\u1EA3 v\u1EC1 array r\u1ED7ng []. Ch\u1EC9 tr\u1EA3 v\u1EC1 JSON array.`;
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { responseMimeType: "application/json" }
  });
  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    if (Array.isArray(parsedData)) {
      return parsedData.filter(
        (item) => item.name && item.description && typeof item.name === "string" && typeof item.description === "string" && Object.values(EntityType).includes(item.type)
      ).map((item) => ({ name: item.name, type: item.type, description: item.description }));
    }
    return [];
  } catch (e) {
    console.error("Failed to parse JSON for entity extraction:", e);
    return [];
  }
}
async function generateStorySummary(apiKeyFromArgs, useDefaultAPI, storyLog) {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");
  const fullStoryText = storyLog.map((msg) => {
    if (msg.type === "narration" || msg.type === "event" || msg.type === "author") return msg.content;
    if (msg.type === "dialogue") return `${msg.characterName || "NPC"}: "${msg.content}"`;
    if (msg.type === "system" && msg.content.startsWith("Ng\u01B0\u1EDDi ch\u01A1i ch\u1ECDn:")) return `(${msg.content})`;
    if (msg.type === "system" && msg.content.includes("AI t\u1EF1 vi\u1EBFt ti\u1EBFp t\xECnh ti\u1EBFt")) return `(AI t\u1EF1 \u0111\u1ED9ng ti\u1EBFp t\u1EE5c c\xE2u chuy\u1EC7n)`;
    return "";
  }).filter(Boolean).join("\n\n");
  if (fullStoryText.length < 100) return "C\xE2u chuy\u1EC7n c\xF2n qu\xE1 ng\u1EAFn \u0111\u1EC3 t\xF3m t\u1EAFt.";
  const userPrompt = `D\u1EF1a tr\xEAn to\xE0n b\u1ED9 di\u1EC5n bi\u1EBFn c\xE2u chuy\u1EC7n sau \u0111\xE2y, h\xE3y vi\u1EBFt m\u1ED9t b\u1EA3n t\xF3m t\u1EAFt c\u1ED1t truy\u1EC7n ch\xEDnh t\u1EEB \u0111\u1EA7u \u0111\u1EBFn hi\u1EC7n t\u1EA1i. T\u1EADp trung v\xE0o c\xE1c s\u1EF1 ki\u1EC7n quan tr\u1ECDng, s\u1EF1 ph\xE1t tri\u1EC3n c\u1EE7a nh\xE2n v\u1EADt ch\xEDnh v\xE0 c\xE1c m\xE2u thu\u1EABn l\u1EDBn.
B\u1EA3n t\xF3m t\u1EAFt n\xEAn m\u1EA1ch l\u1EA1c, d\u1EC5 hi\u1EC3u v\xE0 kh\xF4ng qu\xE1 d\xE0i (kho\u1EA3ng 200-300 t\u1EEB). Tr\u1EA3 l\u1EDDi ch\u1EC9 b\u1EB1ng n\u1ED9i dung t\xF3m t\u1EAFt, kh\xF4ng th\xEAm l\u1EDDi d\u1EABn.
To\xE0n b\u1ED9 c\xE2u chuy\u1EC7n:
${fullStoryText}
B\u1EAFt \u0111\u1EA7u t\xF3m t\u1EAFt:`;
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }]
  });
  return response.text.trim();
}
async function validateApiKey(apiKey) {
  if (!apiKey) return false;
  try {
    const tempAiValidator = new GoogleGenAI({ apiKey });
    await tempAiValidator.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: [{ role: "user", parts: [{ text: "Test API Key" }] }] });
    return true;
  } catch (error) {
    console.warn("API Key validation failed:", error);
    return false;
  }
}
async function extractFullStorySetupFromText(apiKeyFromArgs, useDefaultAPI, userText) {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");
  const skillCategoriesString = ["chi\u1EBFn \u0111\u1EA5u", "ch\u1EBF t\u1EA1o", "sinh t\u1ED3n", "ph\xE9p thu\u1EADt", "h\u1ED7 tr\u1EE3", "kh\xE1c"].join('", "');
  const entityTypesString = Object.values(EntityType).join('", "');
  const userPrompt = `
Ph\xE2n t\xEDch \u0111o\u1EA1n v\u0103n b\u1EA3n sau \u0111\xE2y \u0111\u1EC3 tr\xEDch xu\u1EA5t th\xF4ng tin thi\u1EBFt l\u1EADp cho m\u1ED9t tr\xF2 ch\u01A1i nh\u1EADp vai.
V\u0103n b\u1EA3n:
---
${userText}
---
Y\xEAu c\u1EA7u \u0111\u1ECBnh d\u1EA1ng tr\u1EA3 l\u1EDDi l\xE0 m\u1ED9t JSON object duy nh\u1EA5t. JSON object n\xE0y ph\u1EA3i CH\u1EC8 ch\u1EE9a c\xE1c key sau (n\u1EBFu c\xF3 th\xF4ng tin):
- "story_setup_name": string (t\xEAn chung cho thi\u1EBFt l\u1EADp n\xE0y)
- "world_setup": object (
    "theme": string,
    "context": string,
    "tone": string (m\u1ED9t trong s\u1ED1: "H\xE0i h\u01B0\u1EDBc", "Nghi\xEAm t\xFAc", "K\u1EF3 \u1EA3o", "Kinh d\u1ECB", "L\xE3ng m\u1EA1n", "S\u1EED thi", ho\u1EB7c m\u1ED9t gi\xE1 tr\u1ECB t\xF9y ch\u1EC9nh),
    "advanced_prompt": string (b\u1EA5t k\u1EF3 th\xF4ng tin b\u1ED5 sung n\xE0o v\u1EC1 th\u1EBF gi\u1EDBi kh\xF4ng thu\u1ED9c c\xE1c m\u1EE5c tr\xEAn, c\xF3 th\u1EC3 l\xE0 to\xE0n b\u1ED9 userText n\u1EBFu ph\xF9 h\u1EE3p)
  )
- "character_setup": object (
    "name": string,
    "gender": string (m\u1ED9t trong s\u1ED1: "Nam", "N\u1EEF", "Kh\xE1c", "AI quy\u1EBFt \u0111\u1ECBnh"),
    "summary": string (s\u01A1 l\u01B0\u1EE3c v\u1EC1 nh\xE2n v\u1EADt),
    "traits_raw": array of strings (m\u1ED7i string l\xE0 "T\xEAn \u0110\u1EB7c \u0110i\u1EC3m: M\xF4 t\u1EA3"),
    "goal": string (m\u1EE5c ti\xEAu ch\xEDnh c\u1EE7a nh\xE2n v\u1EADt),
    "initial_skills_raw": array of strings (m\u1ED7i string l\xE0 "T\xEAn K\u1EF9 N\u0103ng: M\xF4 t\u1EA3 (Lo\u1EA1i: [m\u1ED9t trong: ${skillCategoriesString}], Icon: [font awesome class])")
  )
- "entities_raw": array of objects (m\u1ED7i object c\xF3 d\u1EA1ng {"name": string, "type": string (m\u1ED9t trong: "${entityTypesString}"), "description": string})

N\u1EBFu kh\xF4ng t\xECm th\u1EA5y th\xF4ng tin cho m\u1ED9t key n\xE0o \u0111\xF3, h\xE3y b\u1ECF qua key \u0111\xF3 ho\u1EB7c tr\u1EA3 v\u1EC1 gi\xE1 tr\u1ECB m\u1EB7c \u0111\u1ECBnh (v\xED d\u1EE5: array r\u1ED7ng).
L\u01AFU \xDD QUAN TR\u1ECCNG:
- V\u1EDBi "traits_raw", m\u1ED7i ph\u1EA7n t\u1EED PH\u1EA2I l\xE0 m\u1ED9t chu\u1ED7i c\xF3 \u0111\u1ECBnh d\u1EA1ng "T\xEAn \u0110\u1EB7c \u0110i\u1EC3m: M\xF4 t\u1EA3".
- V\u1EDBi "initial_skills_raw", m\u1ED7i ph\u1EA7n t\u1EED PH\u1EA2I l\xE0 m\u1ED9t chu\u1ED7i c\xF3 \u0111\u1ECBnh d\u1EA1ng "T\xEAn K\u1EF9 N\u0103ng: M\xF4 t\u1EA3 (Lo\u1EA1i: ..., Icon: ...)".
- V\u1EDBi "world_setup.advanced_prompt", n\u1EBFu kh\xF4ng c\xF3 th\xF4ng tin c\u1EE5 th\u1EC3 n\xE0o \u0111\u01B0\u1EE3c tr\xEDch xu\u1EA5t cho theme, context, tone th\xEC c\xF3 th\u1EC3 \u0111\u01B0a to\xE0n b\u1ED9 userText v\xE0o \u0111\xE2y n\u1EBFu n\xF3 ph\xF9 h\u1EE3p l\xE0m m\xF4 t\u1EA3 chung.
Ch\u1EC9 tr\u1EA3 v\u1EC1 JSON object. Kh\xF4ng bao g\u1ED3m markdown fences.
`;
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { responseMimeType: "application/json" }
  });
  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    return parsedData;
  } catch (e) {
    console.error("Failed to parse JSON for full story setup extraction:", e, "\nRaw response:", response.text);
    return {
      story_setup_name: userText.substring(0, 30) + " (Extraction Failed)",
      world_setup: { advanced_prompt: userText }
      // At least put the original text somewhere
    };
  }
}
async function generateFullRandomStorySetup(apiKeyFromArgs, useDefaultAPI, params) {
  const resolvedApiKey = getResolvedApiKey(apiKeyFromArgs, useDefaultAPI);
  initializeGemini(resolvedApiKey);
  if (!ai) throw new Error("Gemini AI not initialized after API key resolution.");
  const skillCategoriesString = ["chi\u1EBFn \u0111\u1EA5u", "ch\u1EBF t\u1EA1o", "sinh t\u1ED3n", "ph\xE9p thu\u1EADt", "h\u1ED7 tr\u1EE3", "kh\xE1c"].join('", "');
  const entityTypesString = Object.values(EntityType).join('", "');
  const userPrompt = `
T\u1EA1o m\u1ED9t thi\u1EBFt l\u1EADp truy\u1EC7n nh\u1EADp vai ho\xE0n ch\u1EC9nh v\xE0 \u0111\u1ED3 s\u1ED9 d\u1EF1a tr\xEAn c\xE1c th\xF4ng tin sau:
- Ch\u1EE7 \u0111\u1EC1 g\u1EE3i \xFD t\u1EEB ng\u01B0\u1EDDi d\xF9ng (n\u1EBFu c\xF3): "${params.userTheme}"
- M\xF4 t\u1EA3 ng\u1EAFn t\u1EEB ng\u01B0\u1EDDi d\xF9ng (n\u1EBFu c\xF3): "${params.userDescription}"
- S\u1ED1 l\u01B0\u1EE3ng th\u1EF1c th\u1EC3 (NPC, v\u1EADt ph\u1EA9m, \u0111\u1ECBa \u0111i\u1EC3m, t\u1ED5 ch\u1EE9c, kh\xE1i ni\u1EC7m 'Kh\xE1c') c\u1EA7n t\u1EA1o: ${params.numEntities} (ph\xE2n b\u1ED5 \u0111\u1EC1u ho\u1EB7c h\u1EE3p l\xFD).

Y\xEAu c\u1EA7u \u0111\u1ECBnh d\u1EA1ng tr\u1EA3 l\u1EDDi l\xE0 m\u1ED9t JSON object duy nh\u1EA5t. JSON object n\xE0y ph\u1EA3i CH\u1EC8 ch\u1EE9a c\xE1c key sau:
- "story_setup_name": string (t\xEAn chung h\u1EA5p d\u1EABn cho thi\u1EBFt l\u1EADp n\xE0y, d\u1EF1a tr\xEAn ch\u1EE7 \u0111\u1EC1 v\xE0 m\xF4 t\u1EA3)
- "world_setup": object (
    "theme": string (ch\u1EE7 \u0111\u1EC1 ch\xEDnh, c\xF3 th\u1EC3 ph\xE1t tri\u1EC3n t\u1EEB g\u1EE3i \xFD),
    "context": string (b\u1ED1i c\u1EA3nh chi ti\u1EBFt, r\u1ED9ng l\u1EDBn),
    "tone": string (m\u1ED9t trong: "H\xE0i h\u01B0\u1EDBc", "Nghi\xEAm t\xFAc", "K\u1EF3 \u1EA3o", "Kinh d\u1ECB", "L\xE3ng m\u1EA1n", "S\u1EED thi", ho\u1EB7c m\u1ED9t gi\xE1 tr\u1ECB t\xF9y ch\u1EC9nh ph\xF9 h\u1EE3p),
    "advanced_prompt": string (th\xF4ng tin b\u1ED5 sung v\u1EC1 th\u1EBF gi\u1EDBi: l\u1ECBch s\u1EED, phe ph\xE1i, lu\u1EADt l\u1EC7 \u0111\u1EB7c bi\u1EC7t, c\xE1c v\xF9ng \u0111\u1EA5t, v.v. - l\xE0m cho n\xF3 th\u1EADt phong ph\xFA)
  )
- "character_setup": object (
    "name": string (t\xEAn nh\xE2n v\u1EADt ch\xEDnh ph\xF9 h\u1EE3p),
    "gender": string (m\u1ED9t trong: "Nam", "N\u1EEF", "Kh\xE1c", "AI quy\u1EBFt \u0111\u1ECBnh"),
    "summary": string (s\u01A1 l\u01B0\u1EE3c chi ti\u1EBFt v\u1EC1 nh\xE2n v\u1EADt: ngo\u1EA1i h\xECnh, t\xEDnh c\xE1ch, ngu\u1ED3n g\u1ED1c, ho\xE0n c\u1EA3nh ban \u0111\u1EA7u),
    "traits_raw": array of strings (t\u1EA1o 2-3 \u0111\u1EB7c \u0111i\u1EC3m \u0111\u1ED9c \u0111\xE1o, m\u1ED7i string l\xE0 "T\xEAn \u0110\u1EB7c \u0110i\u1EC3m: M\xF4 t\u1EA3"),
    "goal": string (m\u1EE5c ti\xEAu ch\xEDnh r\xF5 r\xE0ng, h\u1EA5p d\u1EABn cho nh\xE2n v\u1EADt),
    "initial_skills_raw": array of strings (t\u1EA1o 1-2 k\u1EF9 n\u0103ng kh\u1EDFi \u0111\u1EA7u, m\u1ED7i string l\xE0 "T\xEAn K\u1EF9 N\u0103ng: M\xF4 t\u1EA3 (Lo\u1EA1i: [m\u1ED9t trong: ${skillCategoriesString}], Icon: [font awesome class])")
  )
- "entities_raw": array of objects (t\u1EA1o ${params.numEntities} th\u1EF1c th\u1EC3, m\u1ED7i object c\xF3 d\u1EA1ng {"name": string, "type": string (m\u1ED9t trong: "${entityTypesString}"), "description": string}. M\xF4 t\u1EA3 th\u1EF1c th\u1EC3 chi ti\u1EBFt, th\xFA v\u1ECB).

L\u01AFU \xDD C\u1EF0C K\u1EF2 QUAN TR\u1ECCNG:
- T\u1EA5t c\u1EA3 c\xE1c tr\u01B0\u1EDDng ph\u1EA3i \u0111\u01B0\u1EE3c \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7, s\xE1ng t\u1EA1o, v\xE0 c\xF3 ch\u1EA5t l\u01B0\u1EE3ng cao.
- "world_setup.advanced_prompt" ph\u1EA3i th\u1EADt s\u1EF1 "n\xE2ng cao", cung c\u1EA5p nhi\u1EC1u chi ti\u1EBFt l\xE0m n\u1EC1n t\u1EA3ng cho th\u1EBF gi\u1EDBi.
- M\xF4 t\u1EA3 cho "character_setup.summary" v\xE0 c\xE1c "entities_raw.description" ph\u1EA3i chi ti\u1EBFt, kh\xF4ng h\u1EDDi h\u1EE3t.
- V\u1EDBi "traits_raw", m\u1ED7i ph\u1EA7n t\u1EED PH\u1EA2I l\xE0 m\u1ED9t chu\u1ED7i c\xF3 \u0111\u1ECBnh d\u1EA1ng "T\xEAn \u0110\u1EB7c \u0110i\u1EC3m: M\xF4 t\u1EA3".
- V\u1EDBi "initial_skills_raw", m\u1ED7i ph\u1EA7n t\u1EED PH\u1EA2I l\xE0 m\u1ED9t chu\u1ED7i c\xF3 \u0111\u1ECBnh d\u1EA1ng "T\xEAn K\u1EF9 N\u0103ng: M\xF4 t\u1EA3 (Lo\u1EA1i: ..., Icon: ...)".
- \u0110\u1EA3m b\u1EA3o t\u1EA1o \u0111\xFAng ${params.numEntities} th\u1EF1c th\u1EC3 trong "entities_raw".
Ch\u1EC9 tr\u1EA3 v\u1EC1 JSON object. Kh\xF4ng bao g\u1ED3m markdown fences.
`;
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    // Consider a more powerful model if available and needed for complexity
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: { responseMimeType: "application/json", temperature: 0.8 }
    // Slightly higher temp for creativity
  });
  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    return parsedData;
  } catch (e) {
    console.error("Failed to parse JSON for AI random full generation:", e, "\nRaw response:", response.text);
    return {
      story_setup_name: params.userTheme || "L\u1ED7i T\u1EA1o Ng\u1EABu Nhi\xEAn",
      world_setup: { theme: params.userTheme || "L\u1ED7i", context: "AI kh\xF4ng th\u1EC3 t\u1EA1o b\u1ED1i c\u1EA3nh.", tone: "Nghi\xEAm t\xFAc" },
      character_setup: { name: "Nh\xE2n V\u1EADt L\u1ED7i", summary: "AI kh\xF4ng th\u1EC3 t\u1EA1o nh\xE2n v\u1EADt.", goal: "S\u1ED1ng s\xF3t" },
      entities_raw: [{ name: "Th\u1EF1c Th\u1EC3 L\u1ED7i", type: "Kh\xE1c" /* Other */, description: "AI kh\xF4ng th\u1EC3 t\u1EA1o th\u1EF1c th\u1EC3." }]
    };
  }
}

// components/Modal.tsx
import React6, { useEffect as useEffect3, useState as useState3 } from "react";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var Modal = React6.memo(({ isOpen, onClose, title, children, size = "md", footer, containerClass = "" }) => {
  const [isShowing, setIsShowing] = useState3(false);
  useEffect3(() => {
    if (isOpen) {
      setIsShowing(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setIsShowing(false);
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!isShowing && !isOpen) return null;
  let sizeClass = "";
  switch (size) {
    case "sm":
      sizeClass = "max-w-sm";
      break;
    case "md":
      sizeClass = "max-w-md";
      break;
    case "lg":
      sizeClass = "max-w-lg";
      break;
    case "xl":
      sizeClass = "max-w-xl";
      break;
    case "2xl":
      sizeClass = "max-w-2xl";
      break;
    case "3xl":
      sizeClass = "max-w-3xl";
      break;
    case "full":
      sizeClass = "max-w-full h-full";
      break;
    default:
      sizeClass = "max-w-md";
  }
  const animationClass = isOpen ? "animate-fadeIn" : "animate-fadeOut";
  return /* @__PURE__ */ jsx6(
    "div",
    {
      className: `fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`,
      onClick: onClose,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title",
      children: /* @__PURE__ */ jsxs4(
        "div",
        {
          className: `bg-card-light dark:bg-card-dark rounded-xl shadow-xl w-full ${sizeClass} flex flex-col max-h-[90vh] overflow-hidden ${animationClass} ${containerClass}`,
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between p-5 border-b border-border-light dark:border-border-dark flex-shrink-0", children: [
              /* @__PURE__ */ jsx6("h3", { id: "modal-title", className: "text-xl lg:text-2xl font-semibold text-text-light dark:text-text-dark", children: title }),
              /* @__PURE__ */ jsx6(
                "button",
                {
                  onClick: onClose,
                  className: "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "aria-label": "Close modal",
                  children: /* @__PURE__ */ jsx6("i", { className: "fas fa-times fa-lg" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx6("div", { className: "p-5 overflow-y-auto flex-grow custom-scrollbar", children }),
            footer && /* @__PURE__ */ jsx6("div", { className: "p-5 border-t border-border-light dark:border-border-dark flex-shrink-0", children: footer })
          ]
        }
      )
    }
  );
});
var Modal_default = Modal;

// components/MobileActionSheet.tsx
import { useEffect as useEffect4 } from "react";
import { Fragment as Fragment2, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var MobileActionSheet = ({ isOpen, onClose, title = "Th\u1EF1c Hi\u1EC7n H\xE0nh \u0110\u1ED9ng", children }) => {
  useEffect4(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("mobile-action-sheet-open-body");
    } else {
      document.body.classList.remove("mobile-action-sheet-open-body");
      if (!document.querySelector('.fixed.inset-0.z-\\[100\\].opacity-100[role="dialog"]')) {
        document.body.style.overflow = "";
      }
    }
    return () => {
      document.body.classList.remove("mobile-action-sheet-open-body");
      if (!document.querySelector('.fixed.inset-0.z-\\[100\\].opacity-100[role="dialog"]')) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxs5(Fragment2, { children: [
    /* @__PURE__ */ jsx7(
      "div",
      {
        className: `fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] transition-opacity duration-300 ease-out
                    ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`,
        onClick: onClose,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs5(
      "div",
      {
        className: `fixed bottom-0 left-0 right-0 bg-card-light dark:bg-card-dark shadow-top-xlarge rounded-t-2xl z-[160] transition-transform duration-300 ease-out
                    transform ${isOpen ? "translate-y-0" : "translate-y-full"}
                    max-h-[70vh] flex flex-col`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "action-sheet-title",
        children: [
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between p-3.5 border-b border-border-light dark:border-border-dark flex-shrink-0", children: [
            /* @__PURE__ */ jsx7("h3", { id: "action-sheet-title", className: "text-md font-semibold text-text-light dark:text-text-dark", children: title }),
            /* @__PURE__ */ jsx7(
              "button",
              {
                onClick: onClose,
                className: "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors rounded-full p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "aria-label": "\u0110\xF3ng b\u1EA3ng h\xE0nh \u0111\u1ED9ng",
                children: /* @__PURE__ */ jsx7("i", { className: "fas fa-times text-lg" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx7("div", { className: "overflow-y-auto p-3.5 custom-scrollbar flex-grow", children })
        ]
      }
    )
  ] });
};
var MobileActionSheet_default = MobileActionSheet;

// pages/GamePage.tsx
import { Fragment as Fragment3, jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function useMediaQuery(query) {
  const [matches, setMatches] = useState4(false);
  useEffect5(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => {
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
    };
    updateMatch();
    media.addEventListener("change", updateMatch);
    return () => media.removeEventListener("change", updateMatch);
  }, [matches, query]);
  return matches;
}
var INITIAL_MESSAGES_TO_SHOW = 20;
var MESSAGES_TO_LOAD_PER_CLICK = 20;
var KEYWORD_TYPE_COLORS = {
  ["NPC" /* NPC */]: { base: "text-sky-600 dark:text-sky-400", focusRing: "focus:ring-sky-500" },
  ["V\u1EADt ph\u1EA9m" /* Item */]: { base: "text-amber-600 dark:text-amber-400", focusRing: "focus:ring-amber-500" },
  ["\u0110\u1ECBa \u0111i\u1EC3m" /* Location */]: { base: "text-green-600 dark:text-green-400", focusRing: "focus:ring-green-500" },
  ["T\u1ED5 ch\u1EE9c" /* Organization */]: { base: "text-purple-600 dark:text-purple-400", focusRing: "focus:ring-purple-500" },
  "STAT": { base: "text-blue-600 dark:text-blue-400", focusRing: "focus:ring-blue-500" },
  "SKILL": { base: "text-cyan-600 dark:text-cyan-400", focusRing: "focus:ring-cyan-500" },
  "ACH": { base: "text-yellow-500 dark:text-yellow-300", focusRing: "focus:ring-yellow-400" },
  "TRAIT": { base: "text-fuchsia-600 dark:text-fuchsia-400", focusRing: "focus:ring-fuchsia-500" },
  ["Kh\xE1c" /* Other */]: { base: "text-slate-600 dark:text-slate-400", focusRing: "focus:ring-slate-500" },
  "DEFAULT": { base: "text-orange-600 dark:text-orange-400", focusRing: "focus:ring-orange-500" }
  // Default/fallback
};
var calculateEffectiveStats = (baseStats, equippedItems, inventory) => {
  const effectiveStats = JSON.parse(JSON.stringify(baseStats));
  const allBonuses = [];
  Object.values(equippedItems).forEach((itemId) => {
    if (itemId) {
      const item = inventory.find((i) => i.id === itemId);
      if (item && item.equippable && item.statBonuses) {
        allBonuses.push(...item.statBonuses);
      }
    }
  });
  allBonuses.forEach((bonus) => {
    if (!bonus.isPercentage) {
      const stat = effectiveStats[bonus.statId];
      if (stat) {
        if (bonus.appliesToMax && typeof stat.maxValue === "number") {
          stat.maxValue += bonus.value;
        } else if (typeof stat.value === "number") {
          stat.value += bonus.value;
        }
        if (bonus.statId === "hp" && typeof stat.value === "number" && typeof stat.maxValue === "number") {
          stat.value = Math.min(stat.value, stat.maxValue);
        }
      }
    }
  });
  allBonuses.forEach((bonus) => {
    if (bonus.isPercentage) {
      const statToUpdateWithPercentage = effectiveStats[bonus.statId];
      const originalBaseStatForPercentage = baseStats[bonus.statId];
      if (statToUpdateWithPercentage && originalBaseStatForPercentage) {
        const baseValueForCalc = bonus.appliesToMax && typeof originalBaseStatForPercentage.maxValue === "number" ? originalBaseStatForPercentage.maxValue : typeof originalBaseStatForPercentage.value === "number" ? originalBaseStatForPercentage.value : 0;
        if (typeof baseValueForCalc === "number" && baseValueForCalc !== 0) {
          const percentageIncrement = baseValueForCalc * (bonus.value / 100);
          if (bonus.appliesToMax && typeof statToUpdateWithPercentage.maxValue === "number") {
            statToUpdateWithPercentage.maxValue += percentageIncrement;
          } else if (typeof statToUpdateWithPercentage.value === "number") {
            statToUpdateWithPercentage.value += percentageIncrement;
          }
          if (bonus.statId === "hp" && typeof statToUpdateWithPercentage.value === "number" && typeof statToUpdateWithPercentage.maxValue === "number") {
            statToUpdateWithPercentage.value = Math.min(statToUpdateWithPercentage.value, statToUpdateWithPercentage.maxValue);
          }
        }
      }
    }
  });
  if (effectiveStats.hp && typeof effectiveStats.hp.value === "number" && typeof effectiveStats.hp.maxValue === "number") {
    effectiveStats.hp.value = Math.min(effectiveStats.hp.value, effectiveStats.hp.maxValue);
    effectiveStats.hp.value = Math.max(0, effectiveStats.hp.value);
  }
  for (const statId in effectiveStats) {
    const stat = effectiveStats[statId];
    if (typeof stat.value === "number" && typeof stat.maxValue === "number" && stat.id !== "hp" && !stat.isProgressionStat) {
      stat.value = Math.min(stat.value, stat.maxValue);
      if (stat.id === "mp" || stat.id === "spiritual_qi") stat.value = Math.max(0, stat.value);
    }
    if (typeof stat.value === "number" && stat.id !== "attack_speed") stat.value = parseFloat(stat.value.toFixed(1));
    if (typeof stat.maxValue === "number" && stat.id !== "attack_speed") stat.maxValue = parseFloat(stat.maxValue.toFixed(1));
  }
  return effectiveStats;
};
var CharacterStatsPanel = React8.memo(({ baseStats, equippedItems, inventory, characterName }) => {
  const effectiveStats = useMemo(() => calculateEffectiveStats(baseStats, equippedItems, inventory), [baseStats, equippedItems, inventory]);
  if (Object.keys(baseStats).length === 0) {
    return /* @__PURE__ */ jsx8("p", { className: "text-sm text-slate-500 dark:text-slate-400 p-4 text-center", children: "Ch\u01B0a c\xF3 th\xF4ng tin ch\u1EC9 s\u1ED1." });
  }
  const progressionStat = Object.values(effectiveStats).find((stat) => stat.isProgressionStat);
  const coreStatsToDisplay = ["hp", "mp", "spiritual_qi"];
  const primaryAttributes = ["intelligence", "constitution", "agility", "luck"];
  const combatStatOrder = ["damage_output", "defense_value", "attack_speed", "crit_chance", "crit_damage_bonus", "evasion_chance"];
  const otherNonCombatStats = Object.values(effectiveStats).filter(
    (stat) => !stat.isProgressionStat && !coreStatsToDisplay.includes(stat.id) && !primaryAttributes.includes(stat.id) && !combatStatOrder.includes(stat.id)
  );
  const renderStat = useCallback2((stat, isCombatStat = false, isPrimaryAttribute = false, isCore = false) => {
    const valueIsPercentage = ["crit_chance", "crit_damage_bonus", "evasion_chance"].includes(stat.id);
    let displayValue = typeof stat.value === "number" ? parseFloat(stat.value.toFixed(stat.id === "attack_speed" ? 2 : 1)) : String(stat.value);
    if (valueIsPercentage) {
      displayValue = `${displayValue}%`;
    } else if (typeof stat.value === "number" && stat.maxValue !== void 0 && !stat.isProgressionStat) {
      const val = parseFloat(stat.value.toFixed(1));
      const maxVal = parseFloat(stat.maxValue.toFixed(1));
      displayValue = `${val} / ${maxVal}`;
    }
    let bgColor = "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/80";
    let textColor = "text-slate-700 dark:text-slate-200";
    let iconColor = "text-primary dark:text-primary-light";
    let progressBarColor = "bg-primary dark:bg-primary-dark";
    if (isCombatStat) {
      bgColor = "bg-rose-50 dark:bg-rose-900/50 border-rose-200 dark:border-rose-700/70";
      textColor = "text-rose-700 dark:text-rose-200";
      iconColor = "text-rose-500 dark:text-rose-400";
      progressBarColor = "bg-rose-500 dark:bg-rose-400";
    } else if (isPrimaryAttribute) {
      bgColor = "bg-sky-50 dark:bg-sky-900/50 border-sky-200 dark:border-sky-700/70";
      textColor = "text-sky-700 dark:text-sky-200";
      iconColor = "text-sky-500 dark:text-sky-400";
      progressBarColor = "bg-sky-500 dark:bg-sky-400";
    } else if (isCore) {
      if (stat.id === "hp") {
        iconColor = "text-red-500 dark:text-red-400";
        progressBarColor = "bg-red-500 dark:bg-red-400";
      } else if (stat.id === "mp") {
        iconColor = "text-blue-500 dark:text-blue-400";
        progressBarColor = "bg-blue-500 dark:bg-blue-400";
      } else if (stat.id === "spiritual_qi") {
        iconColor = "text-amber-500 dark:text-amber-400";
        progressBarColor = "bg-amber-500 dark:bg-amber-400";
      }
    }
    const originalBaseStatValue = baseStats[stat.id]?.value;
    const originalBaseStatMaxValue = baseStats[stat.id]?.maxValue;
    let bonusDisplay = "";
    if (typeof stat.value === "number" && typeof originalBaseStatValue === "number" && Math.abs(stat.value - originalBaseStatValue) > 0.01) {
      const diff = stat.value - originalBaseStatValue;
      bonusDisplay += ` (G\u1ED1c ${parseFloat(originalBaseStatValue.toFixed(1))}${diff !== 0 ? `, ${diff > 0 ? "+" : ""}${parseFloat(diff.toFixed(1))} t\u1EEB trang b\u1ECB` : ""})`;
    }
    if (typeof stat.maxValue === "number" && typeof originalBaseStatMaxValue === "number" && stat.maxValue !== originalBaseStatMaxValue && (!bonusDisplay.includes("G\u1ED1c") || ["hp", "mp", "spiritual_qi"].includes(stat.id))) {
      const maxDiff = stat.maxValue - originalBaseStatMaxValue;
      if (bonusDisplay.includes("G\u1ED1c")) {
        if (maxDiff !== 0) bonusDisplay += ` / Max G\u1ED1c ${parseFloat(originalBaseStatMaxValue.toFixed(1))}${maxDiff !== 0 ? `, ${maxDiff > 0 ? "+" : ""}${parseFloat(maxDiff.toFixed(1))} t\u1EEB trang b\u1ECB` : ""}`;
      } else {
        bonusDisplay += ` (Max G\u1ED1c ${parseFloat(originalBaseStatMaxValue.toFixed(1))}${maxDiff !== 0 ? `, ${maxDiff > 0 ? "+" : ""}${parseFloat(maxDiff.toFixed(1))} t\u1EEB trang b\u1ECB` : ""})`;
      }
    }
    return /* @__PURE__ */ jsxs6("div", { className: `p-3.5 rounded-xl shadow-interactive dark:shadow-interactive-dark border ${bgColor} transition-all duration-200 hover:shadow-md`, children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center mb-1.5", children: [
        /* @__PURE__ */ jsxs6("span", { className: `font-semibold text-md flex items-center ${textColor}`, children: [
          stat.icon && /* @__PURE__ */ jsx8("i", { className: `${stat.icon} mr-2.5 w-5 text-center ${iconColor} text-xl opacity-90` }),
          stat.name,
          ":"
        ] }),
        /* @__PURE__ */ jsx8("span", { className: `font-bold text-lg ${textColor}`, children: displayValue })
      ] }),
      bonusDisplay && /* @__PURE__ */ jsx8("p", { className: `text-xs mt-0.5 ${textColor} opacity-80 italic`, children: bonusDisplay.trim() }),
      typeof stat.value === "number" && stat.maxValue !== void 0 && !stat.isProgressionStat && !valueIsPercentage && stat.maxValue > 0 && /* @__PURE__ */ jsx8("div", { className: `w-full rounded-full h-3 overflow-hidden mt-2 ${bgColor} bg-opacity-60 shadow-inner`, children: /* @__PURE__ */ jsx8(
        "div",
        {
          className: `${progressBarColor} h-full rounded-full transition-all duration-500 ease-out`,
          style: { width: `${Math.max(0, Math.min(100, stat.value / stat.maxValue * 100))}%` }
        }
      ) }),
      stat.description && /* @__PURE__ */ jsx8("p", { className: `text-xs mt-2 ${textColor} opacity-90 leading-relaxed`, children: stat.description })
    ] }, stat.id);
  }, [baseStats]);
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-4 text-sm", children: [
    /* @__PURE__ */ jsx8("h3", { className: "text-2xl font-bold mb-4 text-center text-primary dark:text-primary-light tracking-wide drop-shadow-sm", children: characterName }),
    progressionStat && /* @__PURE__ */ jsxs6("div", { className: "p-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 dark:from-amber-500 dark:via-yellow-600 dark:to-amber-700 rounded-xl shadow-xl text-white", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center mb-1", children: [
        /* @__PURE__ */ jsxs6("span", { className: "font-bold text-2xl flex items-center", children: [
          progressionStat.icon && /* @__PURE__ */ jsx8("i", { className: `${progressionStat.icon} mr-3 w-7 text-center text-3xl opacity-80` }),
          progressionStat.name,
          ":"
        ] }),
        /* @__PURE__ */ jsx8("span", { className: "font-extrabold text-2xl tracking-tight", children: String(progressionStat.value) })
      ] }),
      progressionStat.description && /* @__PURE__ */ jsx8("p", { className: "text-xs opacity-90 mt-1.5", children: progressionStat.description })
    ] }, progressionStat.id),
    coreStatsToDisplay.map((id) => effectiveStats[id] && renderStat(effectiveStats[id], false, false, true)),
    /* @__PURE__ */ jsx8("h4", { className: "text-xl font-semibold mt-5 pt-4 border-t border-border-light dark:border-border-dark text-sky-600 dark:text-sky-300", children: "Thu\u1ED9c T\xEDnh Ch\xEDnh" }),
    primaryAttributes.map((id) => effectiveStats[id] && renderStat(effectiveStats[id], false, true)),
    /* @__PURE__ */ jsx8("h4", { className: "text-xl font-semibold mt-5 pt-4 border-t border-border-light dark:border-border-dark text-rose-600 dark:text-rose-300", children: "Ch\u1EC9 S\u1ED1 Chi\u1EBFn \u0110\u1EA5u" }),
    combatStatOrder.map((id) => effectiveStats[id] && renderStat(effectiveStats[id], true)),
    otherNonCombatStats.length > 0 && /* @__PURE__ */ jsxs6(Fragment3, { children: [
      /* @__PURE__ */ jsx8("h4", { className: "text-xl font-semibold mt-5 pt-4 border-t border-border-light dark:border-border-dark", children: "Ch\u1EC9 S\u1ED1 Kh\xE1c" }),
      otherNonCombatStats.map((stat) => renderStat(stat))
    ] })
  ] });
});
var InventoryPanel = React8.memo(({ items, equippedItems, onUseItem, onEquipItem, isLoadingAI, currency, currencyEnabled }) => {
  const importantItems = items.filter((item) => item.category === "quan tr\u1ECDng");
  const otherItems = items.filter((item) => item.category !== "quan tr\u1ECDng");
  const renderItemList = useCallback2((itemList, title) => {
    if (itemList.length === 0 && !title) return null;
    if (itemList.length === 0 && title) return /* @__PURE__ */ jsxs6("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md text-center", children: [
      title,
      ": Tr\u1ED1ng."
    ] });
    return /* @__PURE__ */ jsxs6("div", { className: "space-y-3.5", children: [
      title && /* @__PURE__ */ jsx8("h4", { className: "text-lg font-semibold mt-4 pt-3 text-slate-700 dark:text-slate-300", children: title }),
      itemList.map((item) => {
        const isEquipped = Object.values(equippedItems).includes(item.id);
        return /* @__PURE__ */ jsxs6("div", { className: `p-3.5 border rounded-xl bg-white dark:bg-slate-800/80 shadow-interactive dark:shadow-interactive-dark hover:shadow-lg transition-all duration-200 ease-in-out ${isEquipped ? "border-primary dark:border-primary-dark ring-2 ring-primary/60 dark:ring-primary-dark/60" : "border-border-light dark:border-border-dark"}`, children: [
          /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-start gap-3", children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex-grow flex items-start gap-3.5", children: [
              /* @__PURE__ */ jsx8("div", { className: `w-14 h-14 flex-shrink-0 rounded-lg ${item.category === "quan tr\u1ECDng" ? "bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-700 dark:to-amber-800" : "bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-700 dark:to-gray-800"} flex items-center justify-center shadow-inner`, children: /* @__PURE__ */ jsx8("i", { className: `${item.icon || (item.category === "quan tr\u1ECDng" ? "fas fa-star" : "fas fa-box-open")} ${item.category === "quan tr\u1ECDng" ? "text-yellow-500 dark:text-yellow-300" : "text-secondary dark:text-secondary-light"} text-3xl opacity-80` }) }),
              /* @__PURE__ */ jsxs6("div", { className: "flex-grow", children: [
                /* @__PURE__ */ jsxs6("span", { className: "font-semibold text-md text-slate-800 dark:text-slate-100 flex items-center flex-wrap", children: [
                  item.name,
                  " ",
                  /* @__PURE__ */ jsxs6("span", { className: "text-xs text-slate-500 dark:text-slate-400 ml-1.5 mr-2", children: [
                    "(SL: ",
                    item.quantity,
                    ")"
                  ] }),
                  isEquipped && /* @__PURE__ */ jsx8("span", { className: "text-xs px-2.5 py-1 bg-primary text-white dark:bg-primary-dark dark:text-black rounded-full font-medium shadow-sm", children: "\u0110ang Trang B\u1ECB" })
                ] }),
                item.description && /* @__PURE__ */ jsx8("p", { className: "text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed", children: item.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxs6("div", { className: "flex flex-col sm:flex-row gap-2 flex-shrink-0 items-center mt-1", children: [
              item.equippable && !isEquipped && /* @__PURE__ */ jsxs6(Button_default, { size: "sm", variant: "outline", onClick: () => onEquipItem(item), className: "px-3 py-1.5 text-xs font-semibold min-w-[75px] border-green-500 text-green-600 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-300 dark:hover:bg-green-500 dark:hover:text-white", title: `Trang b\u1ECB ${item.name}`, children: [
                /* @__PURE__ */ jsx8("i", { className: "fas fa-shield-alt sm:mr-1.5" }),
                /* @__PURE__ */ jsx8("span", { className: "hidden sm:inline", children: "Trang B\u1ECB" })
              ] }),
              item.usable && /* @__PURE__ */ jsxs6(Button_default, { size: "sm", variant: "primary", onClick: () => onUseItem(item), className: "px-3 py-1.5 text-xs font-semibold min-w-[75px]", disabled: isLoadingAI, title: `S\u1EED d\u1EE5ng ${item.name}`, children: [
                /* @__PURE__ */ jsx8("i", { className: "fas fa-hand-sparkles sm:mr-1.5" }),
                /* @__PURE__ */ jsx8("span", { className: "hidden sm:inline", children: "D\xF9ng" })
              ] })
            ] })
          ] }),
          item.effects && item.effects.length > 0 && /* @__PURE__ */ jsx8("ul", { className: "text-xs mt-2.5 list-disc list-inside pl-4 text-sky-700 dark:text-sky-300 space-y-1", children: item.effects.map((eff, i) => /* @__PURE__ */ jsxs6("li", { className: "italic", children: [
            eff.statId,
            ": ",
            eff.changeValue > 0 ? "+" : "",
            eff.changeValue,
            eff.duration ? ` (trong ${eff.duration} l\u01B0\u1EE3t)` : ""
          ] }, i)) }),
          item.statBonuses && item.statBonuses.length > 0 && /* @__PURE__ */ jsxs6("div", { className: "text-xs mt-2.5 pl-1 text-purple-700 dark:text-purple-300 space-y-0.5", children: [
            /* @__PURE__ */ jsx8("strong", { className: "font-medium block mb-0.5", children: "Bonus Trang B\u1ECB: " }),
            item.statBonuses.map((bonus, i) => /* @__PURE__ */ jsxs6("span", { className: "italic mr-3 inline-flex items-center", children: [
              /* @__PURE__ */ jsx8("i", { className: "fas fa-arrow-up text-[10px] mr-1 opacity-70" }),
              bonus.statId,
              ": ",
              bonus.value > 0 ? "+" : "",
              bonus.value,
              bonus.isPercentage ? "%" : "",
              bonus.appliesToMax ? " (T\u1ED1i \u0111a)" : ""
            ] }, i))
          ] })
        ] }, item.id);
      })
    ] });
  }, [equippedItems, isLoadingAI, onEquipItem, onUseItem]);
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-4 text-sm", children: [
    /* @__PURE__ */ jsx8("h3", { className: "text-2xl font-bold mb-4 text-center text-primary dark:text-primary-light tracking-wide", children: "Ba L\xF4 V\u1EADt Ph\u1EA9m" }),
    currencyEnabled && currency && /* @__PURE__ */ jsxs6("div", { className: "mb-4 p-3.5 border rounded-xl bg-amber-50 dark:bg-amber-900/50 shadow-md border-amber-300 dark:border-amber-600 flex items-center justify-between sticky top-0 bg-opacity-90 backdrop-blur-sm z-10", children: [
      /* @__PURE__ */ jsxs6("span", { className: "font-semibold text-md text-amber-700 dark:text-amber-200 flex items-center", children: [
        /* @__PURE__ */ jsx8("i", { className: `${currency.icon || "fas fa-coins"} mr-2.5 text-xl text-amber-500 dark:text-amber-300` }),
        "Ti\u1EC1n t\u1EC7 (",
        currency.name,
        "):"
      ] }),
      /* @__PURE__ */ jsx8("span", { className: "font-bold text-lg text-amber-800 dark:text-amber-100", children: currency.amount.toLocaleString() })
    ] }),
    renderItemList(importantItems, "V\u1EADt Ph\u1EA9m Quan Tr\u1ECDng"),
    renderItemList(otherItems, otherItems.length > 0 && importantItems.length > 0 ? "V\u1EADt Ph\u1EA9m Kh\xE1c" : items.length > 0 && importantItems.length === 0 ? "" : void 0),
    items.length === 0 && /* @__PURE__ */ jsx8("p", { className: "text-sm text-slate-500 dark:text-slate-400 p-4 text-center", children: "Ba l\xF4 c\u1EE7a b\u1EA1n hi\u1EC7n \u0111ang tr\u1ED1ng r\u1ED7ng." })
  ] });
});
var EquipmentPanel = React8.memo(({ equippedItems, inventory, onUnequipItem }) => {
  const slotsInOrder = [
    "V\u0169 Kh\xED Ch\xEDnh" /* Weapon */,
    "Tay Ph\u1EE5" /* OffHand */,
    "M\u0169" /* Helmet */,
    "Gi\xE1p" /* Armor */,
    "Gi\xE0y" /* Boots */,
    "D\xE2y Chuy\u1EC1n" /* Amulet */,
    "Nh\u1EABn 1" /* Ring1 */,
    "Nh\u1EABn 2" /* Ring2 */
  ];
  const getSlotIcon = (slot) => {
    switch (slot) {
      case "V\u0169 Kh\xED Ch\xEDnh" /* Weapon */:
        return "fas fa-gavel";
      case "Tay Ph\u1EE5" /* OffHand */:
        return "fas fa-shield-halved";
      case "M\u0169" /* Helmet */:
        return "fas fa-hard-hat";
      case "Gi\xE1p" /* Armor */:
        return "fas fa-shirt";
      case "Gi\xE0y" /* Boots */:
        return "fas fa-shoe-prints";
      case "D\xE2y Chuy\u1EC1n" /* Amulet */:
        return "fas fa-gem";
      case "Nh\u1EABn 1" /* Ring1 */:
        return "fas fa-ring";
      case "Nh\u1EABn 2" /* Ring2 */:
        return "fas fa-ring";
      default:
        return "fas fa-question-circle";
    }
  };
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-3.5 text-sm", children: [
    /* @__PURE__ */ jsxs6("h3", { className: "text-2xl font-bold mb-4 text-center text-orange-600 dark:text-orange-400 tracking-wide", children: [
      /* @__PURE__ */ jsx8("i", { className: "fas fa-user-shield mr-2.5" }),
      "Trang B\u1ECB Nh\xE2n V\u1EADt"
    ] }),
    slotsInOrder.map((slot) => {
      const itemId = equippedItems[slot];
      const item = itemId ? inventory.find((i) => i.id === itemId) : null;
      return /* @__PURE__ */ jsxs6("div", { className: `p-3.5 bg-white dark:bg-orange-900/40 rounded-xl shadow-interactive dark:shadow-interactive-dark border border-orange-200 dark:border-orange-700/70 transition-all duration-200 hover:shadow-md`, children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs6("span", { className: "font-semibold text-md flex items-center text-orange-700 dark:text-orange-200", children: [
            /* @__PURE__ */ jsx8("i", { className: `${getSlotIcon(slot)} mr-3 w-5 text-center text-xl opacity-80` }),
            slot,
            ":"
          ] }),
          item ? /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxs6("span", { className: "font-medium text-orange-800 dark:text-orange-100 flex items-center", children: [
              /* @__PURE__ */ jsx8("i", { className: `${item.icon || getSlotIcon(slot)} mr-2 opacity-70` }),
              item.name
            ] }),
            /* @__PURE__ */ jsxs6(Button_default, { size: "xs", variant: "outline", onClick: () => onUnequipItem(slot), className: "px-2.5 py-1 text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-300 dark:hover:bg-red-500 dark:hover:text-white", children: [
              /* @__PURE__ */ jsx8("i", { className: "fas fa-times sm:mr-1" }),
              /* @__PURE__ */ jsx8("span", { className: "hidden sm:inline", children: "Th\xE1o" })
            ] })
          ] }) : /* @__PURE__ */ jsx8("span", { className: "text-sm italic text-orange-500 dark:text-orange-400", children: "-- Tr\u1ED1ng --" })
        ] }),
        item && item.statBonuses && item.statBonuses.length > 0 && /* @__PURE__ */ jsxs6("div", { className: "text-xs mt-2.5 pl-1 text-purple-700 dark:text-purple-300 space-y-0.5", children: [
          /* @__PURE__ */ jsx8("strong", { className: "font-medium block mb-0.5", children: "Bonus: " }),
          item.statBonuses.map((bonus, i) => /* @__PURE__ */ jsxs6("span", { className: "italic mr-3 inline-flex items-center", children: [
            /* @__PURE__ */ jsx8("i", { className: "fas fa-arrow-up text-[10px] mr-1 opacity-70" }),
            bonus.statId,
            ": ",
            bonus.value > 0 ? "+" : "",
            bonus.value,
            bonus.isPercentage ? "%" : "",
            bonus.appliesToMax ? " (T\u1ED1i \u0111a)" : ""
          ] }, i))
        ] })
      ] }, slot);
    })
  ] });
});
var CharacterSkillsPanel = React8.memo(({ skills, isLoadingAI }) => {
  if (skills.length === 0) {
    return /* @__PURE__ */ jsx8("p", { className: "text-sm text-center p-4 text-slate-500 dark:text-slate-400", children: "Ch\u01B0a h\u1ECDc \u0111\u01B0\u1EE3c k\u1EF9 n\u0103ng n\xE0o." });
  }
  const proficiencyStyles = {
    "S\u01A1 Nh\u1EADp M\xF4n": { text: "text-sky-700 dark:text-sky-200", bg: "bg-sky-100 dark:bg-sky-800", border: "border-sky-300 dark:border-sky-600" },
    "Ti\u1EC3u Th\xE0nh": { text: "text-lime-700 dark:text-lime-200", bg: "bg-lime-100 dark:bg-lime-800", border: "border-lime-300 dark:border-lime-600" },
    "\u0110\u1EA1i Th\xE0nh": { text: "text-green-700 dark:text-green-200", bg: "bg-green-100 dark:bg-green-800", border: "border-green-300 dark:border-green-600" },
    "Vi\xEAn M\xE3n": { text: "text-yellow-700 dark:text-yellow-200", bg: "bg-yellow-100 dark:bg-yellow-700", border: "border-yellow-400 dark:border-yellow-500" },
    "L\xF4 Ho\u1EA3 Thu\u1EA7n Thanh": { text: "text-orange-700 dark:text-orange-200", bg: "bg-orange-100 dark:bg-orange-700", border: "border-orange-400 dark:border-orange-500" },
    "\u0110\u0103ng Phong T\u1EA1o C\u1EF1c": { text: "text-red-700 dark:text-red-100", bg: "bg-gradient-to-r from-red-400 to-rose-500 dark:from-red-600 dark:to-rose-700", border: "border-red-500 dark:border-rose-500", shadow: "shadow-lg" }
  };
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-4 text-sm", children: [
    /* @__PURE__ */ jsx8("h3", { className: "text-2xl font-bold mb-4 text-center text-purple-600 dark:text-purple-400 tracking-wide", children: "K\u1EF9 N\u0103ng \u0110\xE3 H\u1ECDc" }),
    skills.sort((a, b) => b.xp - a.xp).map((skill) => {
      const currentProfStyle = proficiencyStyles[skill.proficiency] || proficiencyStyles["S\u01A1 Nh\u1EADp M\xF4n"];
      return /* @__PURE__ */ jsxs6("div", { className: `p-4 bg-white dark:bg-purple-900/50 rounded-xl shadow-interactive dark:shadow-interactive-dark border border-purple-200 dark:border-purple-700/70 transition-all duration-200 hover:shadow-lg`, children: [
        /* @__PURE__ */ jsx8("div", { className: "flex justify-between items-start mb-2", children: /* @__PURE__ */ jsxs6("div", { className: "flex items-start gap-3.5 flex-grow", children: [
          /* @__PURE__ */ jsx8("div", { className: `w-14 h-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-700 dark:to-pink-800 flex items-center justify-center shadow-inner`, children: /* @__PURE__ */ jsx8("i", { className: `${skill.icon || "fas fa-book-sparkles"} text-purple-500 dark:text-purple-300 text-3xl opacity-80` }) }),
          /* @__PURE__ */ jsxs6("div", { className: "flex-grow", children: [
            /* @__PURE__ */ jsx8("span", { className: "font-semibold text-lg text-purple-700 dark:text-purple-200", children: skill.name }),
            /* @__PURE__ */ jsx8("span", { className: `ml-2 text-xs px-3 py-1 rounded-full font-bold shadow ${currentProfStyle.bg} ${currentProfStyle.text} ${currentProfStyle.border} ${currentProfStyle.shadow || ""}`, children: skill.proficiency })
          ] })
        ] }) }),
        skill.description && /* @__PURE__ */ jsx8("p", { className: "text-sm text-purple-600 dark:text-purple-300 mt-1.5 mb-2.5 whitespace-pre-line leading-relaxed", children: skill.description }),
        skill.xpToNextLevel > 0 && /* @__PURE__ */ jsxs6("div", { title: `${skill.xp} / ${skill.xpToNextLevel} XP`, className: `w-full bg-purple-200 dark:bg-purple-800/80 rounded-full h-4 overflow-hidden text-xs font-medium text-white flex items-center justify-center relative shadow-inner`, children: [
          /* @__PURE__ */ jsx8(
            "div",
            {
              className: "bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 dark:from-purple-500 dark:via-pink-600 dark:to-rose-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-center shadow",
              style: { width: `${Math.max(0, Math.min(100, skill.xp / skill.xpToNextLevel * 100))}%` }
            }
          ),
          /* @__PURE__ */ jsxs6("span", { className: "absolute inset-0 flex items-center justify-center text-[11px] text-white font-bold tracking-tight", style: { textShadow: "0 0 3px rgba(0,0,0,0.6)" }, children: [
            skill.xp,
            " / ",
            skill.xpToNextLevel,
            " XP"
          ] })
        ] }),
        skill.effects && skill.effects.length > 0 && /* @__PURE__ */ jsxs6("div", { className: "mt-3 text-xs", children: [
          /* @__PURE__ */ jsx8("strong", { className: "text-purple-600 dark:text-purple-400 font-medium", children: "Hi\u1EC7u \u1EE9ng:" }),
          /* @__PURE__ */ jsx8("ul", { className: "list-disc list-inside pl-4 text-purple-500 dark:text-purple-300 italic space-y-1 mt-1", children: skill.effects.map((effect, idx) => /* @__PURE__ */ jsx8("li", { children: effect.description }, idx)) })
        ] })
      ] }, skill.id);
    })
  ] });
});
var AchievementsPanel = React8.memo(({ achievements }) => {
  if (achievements.length === 0) {
    return /* @__PURE__ */ jsx8("p", { className: "text-sm text-center p-4 text-slate-500 dark:text-slate-400", children: "Ch\u01B0a m\u1EDF kh\xF3a th\xE0nh t\u1EF1u n\xE0o." });
  }
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-3.5 text-sm", children: [
    /* @__PURE__ */ jsx8("h3", { className: "text-2xl font-bold mb-4 text-center text-yellow-500 dark:text-yellow-400 tracking-wide", children: "Th\xE0nh T\u1EF1u" }),
    achievements.slice().reverse().map((ach) => /* @__PURE__ */ jsxs6("div", { className: `p-4 border rounded-xl shadow-interactive dark:shadow-interactive-dark flex items-start gap-4 ${ach.isSecret ? "bg-indigo-50 dark:bg-indigo-900/60 border-indigo-300 dark:border-indigo-600/70" : "bg-yellow-50 dark:bg-yellow-800/60 border-yellow-300 dark:border-yellow-600/70"}`, children: [
      /* @__PURE__ */ jsx8("i", { className: `${ach.icon || "fas fa-trophy"} ${ach.isSecret ? "text-indigo-500 dark:text-indigo-300" : "text-yellow-500 dark:text-yellow-300"} text-4xl w-10 text-center mt-1 opacity-80` }),
      /* @__PURE__ */ jsxs6("div", { className: "flex-grow", children: [
        /* @__PURE__ */ jsxs6("span", { className: `font-semibold text-lg ${ach.isSecret ? "text-indigo-700 dark:text-indigo-200" : "text-yellow-700 dark:text-yellow-200"}`, children: [
          ach.name,
          " ",
          ach.isSecret && /* @__PURE__ */ jsx8("span", { className: "text-xs font-normal opacity-80", children: "(B\xED M\u1EADt)" })
        ] }),
        /* @__PURE__ */ jsx8("p", { className: `text-sm ${ach.isSecret ? "text-indigo-600 dark:text-indigo-400" : "text-yellow-600 dark:text-yellow-400"} mt-1 leading-relaxed`, children: ach.description }),
        /* @__PURE__ */ jsxs6("p", { className: "text-xs text-slate-400 dark:text-slate-500 mt-2", children: [
          "M\u1EDF kh\xF3a: ",
          new Date(ach.unlockedAt).toLocaleString()
        ] })
      ] })
    ] }, ach.id))
  ] });
});
var RelationshipsPanel = React8.memo(({ relationships }) => {
  const knownNpcs = Object.values(relationships).filter((npc) => npc.known);
  if (knownNpcs.length === 0) {
    return /* @__PURE__ */ jsx8("p", { className: "text-sm text-center p-4 text-slate-500 dark:text-slate-400", children: "Ch\u01B0a c\xF3 m\u1ED1i quan h\u1EC7 n\xE0o \u0111\xE1ng ch\xFA \xFD." });
  }
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-4 text-sm", children: [
    /* @__PURE__ */ jsxs6("h3", { className: "text-2xl font-bold mb-4 text-center text-pink-600 dark:text-pink-400 tracking-wide", children: [
      /* @__PURE__ */ jsx8("i", { className: "fas fa-users mr-2.5" }),
      "M\u1ED1i Quan H\u1EC7 NPC"
    ] }),
    knownNpcs.sort((a, b) => b.score - a.score).map((npc) => {
      let statusColorClass = "bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100";
      let borderColorClass = "border-slate-300 dark:border-slate-500";
      if (npc.status === "Ng\u01B0\u1EE1ng M\u1ED9" /* Adored */ || npc.status === "Trung Th\xE0nh" /* Loyal */) {
        statusColorClass = "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100";
        borderColorClass = "border-red-300 dark:border-red-500";
      } else if (npc.status === "Th\xE2n Thi\u1EC7n" /* Friendly */) {
        statusColorClass = "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
        borderColorClass = "border-green-300 dark:border-green-500";
      } else if (npc.status === "H\xF2a H\u1EA3o" /* Amicable */) {
        statusColorClass = "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100";
        borderColorClass = "border-sky-300 dark:border-sky-500";
      } else if (npc.status === "Th\xF9 \u0110\u1ECBch" /* Hostile */) {
        statusColorClass = "bg-rose-700 text-white dark:bg-rose-500 dark:text-white";
        borderColorClass = "border-rose-500 dark:border-rose-300";
      } else if (npc.status === "Kh\xF4ng Tin T\u01B0\u1EDFng" /* Mistrustful */) {
        statusColorClass = "bg-amber-100 text-amber-700 dark:bg-amber-700 dark:text-amber-100";
        borderColorClass = "border-amber-300 dark:border-amber-500";
      }
      return /* @__PURE__ */ jsxs6("div", { className: `p-4 bg-white dark:bg-pink-900/50 rounded-xl shadow-interactive dark:shadow-interactive-dark border border-pink-200 dark:border-pink-700/70 transition-all duration-200 hover:shadow-lg`, children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center mb-2", children: [
          /* @__PURE__ */ jsxs6("span", { className: "font-semibold text-lg flex items-center text-pink-700 dark:text-pink-200", children: [
            /* @__PURE__ */ jsx8("i", { className: "fas fa-user-friends mr-3 w-5 text-center text-xl opacity-80" }),
            npc.name
          ] }),
          /* @__PURE__ */ jsxs6("span", { className: `text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${statusColorClass} border ${borderColorClass}`, children: [
            npc.status,
            " (",
            npc.score,
            ")"
          ] })
        ] }),
        npc.description && /* @__PURE__ */ jsx8("p", { className: "text-sm text-pink-600 dark:text-pink-300 mt-1 italic whitespace-pre-line leading-relaxed", children: npc.description })
      ] }, npc.id);
    })
  ] });
});
var ObjectivesPanel = React8.memo(({ objectives, characterGoal }) => {
  const activeObjectives = objectives.filter((obj) => obj.status === "active");
  const completedObjectives = objectives.filter((obj) => obj.status === "completed");
  const failedObjectives = objectives.filter((obj) => obj.status === "failed");
  const mainGoal = objectives.find((obj) => obj.isPlayerGoal && obj.status === "active") || { title: characterGoal || "Ch\u01B0a x\xE1c \u0111\u1ECBnh", description: "M\u1EE5c ti\xEAu ch\xEDnh c\u1EE7a nh\xE2n v\u1EADt.", status: "active", isPlayerGoal: true, id: "main-player-goal" };
  const renderObjectiveList = (list, title, iconClass, baseColorClass, isCompleted = false, isFailed = false) => {
    if (list.length === 0) return null;
    let textColor = isFailed ? "text-red-700 dark:text-red-200" : isCompleted ? "text-green-700 dark:text-green-200" : baseColorClass;
    let bgColor = isFailed ? "bg-red-50 dark:bg-red-900/60 border-red-200 dark:border-red-700/70" : isCompleted ? "bg-green-50 dark:bg-green-900/60 border-green-200 dark:border-green-700/70 opacity-90" : "bg-teal-50 dark:bg-teal-900/60 border-teal-200 dark:border-teal-700/70";
    return /* @__PURE__ */ jsxs6("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxs6("h4", { className: `text-lg font-semibold mb-2.5 ${textColor}`, children: [
        /* @__PURE__ */ jsx8("i", { className: `${iconClass} mr-2` }),
        title,
        " (",
        list.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx8("div", { className: "space-y-3", children: list.map((obj) => /* @__PURE__ */ jsxs6("div", { className: `p-3.5 rounded-xl shadow-sm border ${bgColor} ${isCompleted ? "line-through decoration-green-500/70 dark:decoration-green-400/70" : ""} ${isFailed ? "opacity-80" : ""}`, children: [
        /* @__PURE__ */ jsxs6("p", { className: `font-semibold text-md ${textColor}`, children: [
          obj.isPlayerGoal && !isCompleted && !isFailed && /* @__PURE__ */ jsx8("i", { className: "fas fa-bullseye text-error-DEFAULT mr-2", title: "M\u1EE5c ti\xEAu ch\xEDnh" }),
          obj.title
        ] }),
        /* @__PURE__ */ jsx8("p", { className: `text-sm mt-1 ${textColor} opacity-90 whitespace-pre-line leading-relaxed`, children: obj.description }),
        obj.subObjectives && obj.subObjectives.length > 0 && /* @__PURE__ */ jsx8("ul", { className: "list-disc list-inside text-sm pl-3 mt-2 text-slate-500 dark:text-slate-400 space-y-1", children: obj.subObjectives.map((sub, i) => /* @__PURE__ */ jsx8("li", { children: sub }, i)) }),
        obj.rewardPreview && /* @__PURE__ */ jsxs6("p", { className: "text-xs mt-2 italic text-amber-600 dark:text-amber-400", children: [
          "Ph\u1EA7n th\u01B0\u1EDFng (d\u1EF1 ki\u1EBFn): ",
          obj.rewardPreview
        ] })
      ] }, obj.id)) })
    ] });
  };
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-4 text-sm", children: [
    /* @__PURE__ */ jsxs6("h3", { className: "text-2xl font-bold mb-4 text-center text-teal-600 dark:text-teal-400 tracking-wide", children: [
      /* @__PURE__ */ jsx8("i", { className: "fas fa-tasks mr-2.5" }),
      "M\u1EE5c Ti\xEAu H\xE0nh Tr\xECnh"
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "p-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 dark:from-teal-600 dark:via-cyan-600 dark:to-sky-700 rounded-xl shadow-xl text-white", children: [
      /* @__PURE__ */ jsxs6("h4", { className: "font-bold text-xl mb-1 flex items-center", children: [
        /* @__PURE__ */ jsx8("i", { className: "fas fa-bullseye mr-3 text-2xl opacity-90" }),
        "M\u1EE5c Ti\xEAu Ch\xEDnh:"
      ] }),
      /* @__PURE__ */ jsx8("p", { className: "text-lg font-semibold", children: mainGoal.title }),
      /* @__PURE__ */ jsx8("p", { className: "text-xs mt-1 opacity-90", children: mainGoal.description })
    ] }),
    renderObjectiveList(activeObjectives.filter((obj) => !obj.isPlayerGoal), "Nhi\u1EC7m V\u1EE5 Ph\u1EE5 \u0110ang Th\u1EF1c Hi\u1EC7n", "fas fa-spinner fa-spin", "text-teal-600 dark:text-teal-300"),
    renderObjectiveList(completedObjectives, "\u0110\xE3 Ho\xE0n Th\xE0nh", "fas fa-check-circle", "text-green-600 dark:text-green-300", true),
    renderObjectiveList(failedObjectives, "\u0110\xE3 Th\u1EA5t B\u1EA1i", "fas fa-times-circle", "text-red-600 dark:text-red-300", false, true),
    activeObjectives.length === 0 && completedObjectives.length === 0 && failedObjectives.length === 0 && !characterGoal && /* @__PURE__ */ jsx8("p", { className: "text-sm text-center p-4 text-slate-500 dark:text-slate-400", children: "Kh\xF4ng c\xF3 m\u1EE5c ti\xEAu n\xE0o \u0111\u01B0\u1EE3c AI t\u1EA1o." })
  ] });
});
var CultivationPanel = React8.memo(({ progressionStat, qiStat, onAdvance, onCultivate, isLoadingAI }) => {
  if (!progressionStat || !qiStat) {
    return /* @__PURE__ */ jsx8("p", { className: "text-sm text-center p-4 text-slate-500 dark:text-slate-400", children: 'H\u1EC7 th\u1ED1ng tu luy\u1EC7n ch\u01B0a \u0111\u01B0\u1EE3c kh\u1EDFi t\u1EA1o. Vui l\xF2ng \u0111\u1EA3m b\u1EA3o AI \u0111\xE3 cung c\u1EA5p ch\u1EC9 s\u1ED1 "C\u1EA5p \u0110\u1ED9" (ID: "progression_level") v\xE0 "\u0110i\u1EC3m Kinh Nghi\u1EC7m" (ID: "spiritual_qi").' });
  }
  let canAdvance = false;
  const qiValue = qiStat.value;
  const qiMaxValue = qiStat.maxValue;
  if (typeof qiValue === "number" && typeof qiMaxValue === "number") {
    if (qiValue >= qiMaxValue && qiMaxValue > 0) {
      canAdvance = true;
    }
  }
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-5 text-sm", children: [
    /* @__PURE__ */ jsxs6("h3", { className: "text-2xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-400 tracking-wide", children: [
      /* @__PURE__ */ jsx8("i", { className: "fas fa-hat-wizard mr-2.5" }),
      "Ti\u1EBFn Tri\u1EC3n Tu Luy\u1EC7n"
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800/70 dark:to-purple-800/70 rounded-xl shadow-xl border border-indigo-200 dark:border-indigo-700", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center mb-1.5", children: [
        /* @__PURE__ */ jsxs6("span", { className: "font-bold text-xl flex items-center text-indigo-700 dark:text-indigo-200", children: [
          progressionStat.icon && /* @__PURE__ */ jsx8("i", { className: `${progressionStat.icon} mr-3 w-6 text-center text-2xl opacity-90` }),
          progressionStat.name,
          ":"
        ] }),
        /* @__PURE__ */ jsx8("span", { className: "font-extrabold text-xl text-indigo-800 dark:text-indigo-100 tracking-tight", children: String(progressionStat.value) })
      ] }),
      progressionStat.description && /* @__PURE__ */ jsx8("p", { className: "text-sm text-indigo-600 dark:text-indigo-300 mt-1.5 opacity-90 leading-relaxed", children: progressionStat.description })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "p-4 bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-800/70 dark:to-cyan-800/70 rounded-xl shadow-xl border border-sky-200 dark:border-sky-700", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center mb-1.5", children: [
        /* @__PURE__ */ jsxs6("span", { className: "font-semibold text-lg flex items-center text-sky-700 dark:text-sky-200", children: [
          qiStat.icon && /* @__PURE__ */ jsx8("i", { className: `${qiStat.icon} mr-3 w-5 text-center text-xl opacity-90` }),
          qiStat.name,
          ":"
        ] }),
        /* @__PURE__ */ jsx8("span", { className: "font-bold text-lg text-sky-800 dark:text-sky-100", children: typeof qiStat.value === "number" && qiStat.maxValue ? `${parseFloat(qiStat.value.toFixed(1))} / ${parseFloat(qiStat.maxValue.toFixed(1))}` : String(qiStat.value) })
      ] }),
      typeof qiStat.value === "number" && typeof qiStat.maxValue === "number" && qiStat.maxValue > 0 && /* @__PURE__ */ jsx8("div", { className: "w-full bg-sky-200 dark:bg-sky-800/80 rounded-full h-4 mt-2 overflow-hidden shadow-inner", children: /* @__PURE__ */ jsx8(
        "div",
        {
          className: "bg-gradient-to-r from-sky-400 to-cyan-500 dark:from-sky-500 to-cyan-600 h-full rounded-full transition-all duration-500 ease-out shadow-sm",
          style: { width: `${Math.max(0, Math.min(100, qiStat.value / qiStat.maxValue * 100))}%` }
        }
      ) }),
      qiStat.description && /* @__PURE__ */ jsx8("p", { className: "text-sm text-sky-600 dark:text-sky-300 mt-2 opacity-90 leading-relaxed", children: qiStat.description })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5", children: [
      /* @__PURE__ */ jsxs6(
        Button_default,
        {
          onClick: onCultivate,
          isLoading: isLoadingAI,
          disabled: isLoadingAI,
          fullWidth: true,
          variant: "outline",
          className: "border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-500 dark:hover:text-white !py-3 !text-base",
          children: [
            /* @__PURE__ */ jsx8("i", { className: "fas fa-praying-hands mr-2" }),
            "T\u1EADp Trung N\xE2ng C\u1EA5p"
          ]
        }
      ),
      /* @__PURE__ */ jsxs6(
        Button_default,
        {
          onClick: onAdvance,
          isLoading: isLoadingAI,
          disabled: !canAdvance || isLoadingAI,
          fullWidth: true,
          variant: "primary",
          className: "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 !py-3 !text-base",
          children: [
            /* @__PURE__ */ jsx8("i", { className: "fas fa-level-up-alt mr-2" }),
            "Th\u1EED Th\xE1ch Th\u0103ng Ti\u1EBFn"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx8("p", { className: `text-sm text-center mt-2 ${canAdvance ? "text-green-600 dark:text-green-400 font-semibold" : "text-slate-500 dark:text-slate-400"}`, children: canAdvance ? `\u0110\xE3 \u0111\u1EE7 ${qiStat.name} \u0111\u1EC3 th\u0103ng ti\u1EBFn!` : `C\u1EA7n th\xEAm ${typeof qiStat.value === "number" && typeof qiStat.maxValue === "number" && qiStat.maxValue > qiStat.value ? (qiStat.maxValue - qiStat.value).toFixed(1) : "?"} ${qiStat.name} \u0111\u1EC3 th\u0103ng ti\u1EBFn.` })
  ] });
});
var ActionPanelContent = React8.memo(({
  choices,
  onChooseAction,
  isLoadingAI,
  isRoleplayModeActive,
  isAuthorInterventionModeActive,
  toggleRoleplayMode,
  toggleAuthorInterventionMode,
  isMobile
}) => {
  const [customAction, setCustomAction] = useState4("");
  const handleCustomActionSubmit = (e) => {
    e.preventDefault();
    if (customAction.trim() && !isLoadingAI) {
      onChooseAction(customAction.trim());
      setCustomAction("");
    }
  };
  const handleAiContinue = () => {
    if (!isLoadingAI) {
      onChooseAction("AI_AUTO_CONTINUE_STORY");
    }
  };
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-3 flex flex-col h-full", children: [
    " ",
    /* @__PURE__ */ jsxs6("div", { className: `flex items-center gap-2 mb-3 pt-1 ${isMobile ? "justify-around" : "sm:border-t-0 border-t border-slate-200 dark:border-slate-700/60"}`, children: [
      /* @__PURE__ */ jsxs6(
        Button_default,
        {
          size: "sm",
          variant: isRoleplayModeActive ? "primary" : "outline",
          onClick: toggleRoleplayMode,
          disabled: isLoadingAI,
          className: `flex-1 !text-xs !py-2 ${isMobile ? "!px-2" : ""}`,
          title: isRoleplayModeActive ? "Chuy\u1EC3n sang Ch\u1EBF \u0111\u1ED9 AI H\u1ED7 Tr\u1EE3 (G\u1EE3i \xFD)" : "Chuy\u1EC3n sang Ch\u1EBF \u0111\u1ED9 Nh\u1EADp Vai (T\u1EF1 do)",
          children: [
            /* @__PURE__ */ jsx8("i", { className: `mr-1.5 ${isRoleplayModeActive ? "fas fa-theater-masks text-yellow-300 dark:text-yellow-400" : "fas fa-brain"}` }),
            " ",
            isRoleplayModeActive ? "Nh\u1EADp Vai" : "AI H\u1ED7 Tr\u1EE3"
          ]
        }
      ),
      /* @__PURE__ */ jsxs6(
        Button_default,
        {
          size: "sm",
          variant: isAuthorInterventionModeActive ? "primary" : "outline",
          onClick: toggleAuthorInterventionMode,
          disabled: isLoadingAI,
          className: `flex-1 !text-xs !py-2 ${isMobile ? "!px-2" : ""}`,
          title: isAuthorInterventionModeActive ? "T\u1EAFt Ch\u1EBF \u0111\u1ED9 Can Thi\u1EC7p T\xE1c Gi\u1EA3" : "B\u1EADt Ch\u1EBF \u0111\u1ED9 Can Thi\u1EC7p T\xE1c Gi\u1EA3",
          children: [
            /* @__PURE__ */ jsx8("i", { className: `mr-1.5 ${isAuthorInterventionModeActive ? "fas fa-feather-alt text-red-300 dark:text-red-400" : "fas fa-feather"}` }),
            " T\xE1c Gi\u1EA3"
          ]
        }
      )
    ] }),
    !isRoleplayModeActive && !isAuthorInterventionModeActive && choices.length > 0 && /* @__PURE__ */ jsxs6("div", { className: `space-y-2.5 ${isMobile ? "max-h-48" : "max-h-40 sm:max-h-60"} overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex-grow`, children: [
      " ",
      choices.map((choice, index) => /* @__PURE__ */ jsx8(
        Button_default,
        {
          onClick: () => onChooseAction(choice.text),
          fullWidth: true,
          className: "bg-gray-700 dark:bg-gray-800 border-2 border-primary dark:border-primary-light text-slate-100 dark:text-slate-50 hover:bg-gray-600 dark:hover:bg-gray-700 hover:border-primary-light dark:hover:border-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-primary-light text-left px-3 py-2.5 !text-sm !font-normal !rounded-xl transition-all duration-150 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] w-full flex items-center",
          disabled: isLoadingAI,
          title: choice.tooltip || choice.text,
          children: /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between w-full", children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex items-start min-w-0", children: [
              /* @__PURE__ */ jsx8(
                "span",
                {
                  className: "bg-primary text-white dark:bg-primary-dark dark:text-gray-900 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold mr-2 sm:mr-3 flex-shrink-0",
                  children: index + 1
                }
              ),
              /* @__PURE__ */ jsx8("span", { className: "whitespace-normal break-words", children: choice.text })
            ] }),
            /* @__PURE__ */ jsx8("i", { className: "fas fa-chevron-right text-slate-400 dark:text-slate-500 text-xs ml-2 flex-shrink-0" })
          ] })
        },
        choice.id
      ))
    ] }),
    (isRoleplayModeActive || isAuthorInterventionModeActive || choices.length === 0) && !isLoadingAI && /* @__PURE__ */ jsx8("p", { className: "text-sm text-slate-500 dark:text-slate-400 italic p-3 bg-slate-100 dark:bg-slate-800/60 rounded-md text-center", children: isAuthorInterventionModeActive ? "Ch\u1EBF \u0111\u1ED9 Can Thi\u1EC7p T\xE1c Gi\u1EA3 \u0111ang B\u1EACT. Nh\u1EADp l\u1EC7nh c\u1EE7a b\u1EA1n." : isRoleplayModeActive ? "Ch\u1EBF \u0111\u1ED9 Nh\u1EADp Vai \u0111ang b\u1EADt. H\xE3y t\u1EF1 do nh\u1EADp h\xE0nh \u0111\u1ED9ng c\u1EE7a b\u1EA1n." : "AI kh\xF4ng \u0111\u01B0a ra l\u1EF1a ch\u1ECDn n\xE0o. H\xE3y t\u1EF1 quy\u1EBFt \u0111\u1ECBnh h\xE0nh \u0111\u1ED9ng ti\u1EBFp theo." }),
    /* @__PURE__ */ jsxs6("form", { onSubmit: handleCustomActionSubmit, className: "space-y-3 pt-1 mt-auto", children: [
      " ",
      /* @__PURE__ */ jsx8(
        Textarea_default,
        {
          value: customAction,
          onChange: (e) => setCustomAction(e.target.value),
          placeholder: isAuthorInterventionModeActive ? "Nh\u1EADp l\u1EC7nh c\u1EE7a T\xE1c Gi\u1EA3 (VD: Cho L\xFD Ph\xE0m 1000 v\xE0ng)..." : isRoleplayModeActive ? "Nh\u1EADp l\u1EDDi n\xF3i, h\xE0nh \u0111\u1ED9ng, suy ngh\u0129 c\u1EE7a b\u1EA1n..." : "Ho\u1EB7c nh\u1EADp h\xE0nh \u0111\u1ED9ng t\xF9y ch\u1EC9nh c\u1EE7a b\u1EA1n...",
          rows: isMobile ? 2 : 3,
          className: "text-sm bg-white dark:bg-slate-700/60 !rounded-lg focus:ring-primary-dark dark:focus:ring-primary-light",
          disabled: isLoadingAI,
          "aria-label": "Custom action input"
        }
      ),
      /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxs6(Button_default, { type: "submit", isLoading: isLoadingAI, disabled: isLoadingAI || !customAction.trim(), variant: "success", className: `!text-base ${isMobile ? "!py-2.5" : "!py-3"} !rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700`, children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-paper-plane mr-2" }),
          "G\u1EEDi"
        ] }),
        /* @__PURE__ */ jsxs6(Button_default, { type: "button", onClick: handleAiContinue, isLoading: isLoadingAI, disabled: isLoadingAI, variant: "secondary", className: `!text-base ${isMobile ? "!py-2.5" : "!py-3"} !rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700`, children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-wand-magic-sparkles mr-2" }),
          "AI Vi\u1EBFt Ti\u1EBFp"
        ] })
      ] })
    ] })
  ] });
});
var generateStableId = (text, prefix = "id") => {
  if (!text) return `${prefix}_unknown_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
  return `${prefix}-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
};
var updateInventory = (currentInventory, gained, lost) => {
  let newInventory = [...currentInventory];
  const fullyLostItemIds = [];
  if (gained) {
    gained.forEach((newItem) => {
      if (!newItem.name || typeof newItem.quantity !== "number" || newItem.quantity <= 0) return;
      const existingItemIndex = newInventory.findIndex((item) => item.name === newItem.name);
      if (existingItemIndex > -1) {
        newInventory[existingItemIndex].quantity += newItem.quantity;
      } else {
        newInventory.push({ ...newItem, id: newItem.id || generateStableId(newItem.name, "item") });
      }
    });
  }
  if (lost) {
    lost.forEach((itemToRemove) => {
      if (typeof itemToRemove.quantity !== "number" || itemToRemove.quantity <= 0) return;
      let itemIndex = -1;
      if ("id" in itemToRemove && itemToRemove.id) {
        itemIndex = newInventory.findIndex((item) => item.id === itemToRemove.id);
      } else if ("name" in itemToRemove && itemToRemove.name) {
        itemIndex = newInventory.findIndex((item) => item.name === itemToRemove.name);
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
var GamePage = ({
  gameState,
  setGameState,
  openModal,
  quitGame,
  nsfwSettings,
  autosaveCurrentStory
}) => {
  const { settings } = useSettings();
  const { addToast } = usePublicToast();
  const [isLoadingAI, setIsLoadingAI] = useState4(false);
  const storyLogRef = useRef2(null);
  const [activePanelModal, setActivePanelModal] = useState4(null);
  const [numMessagesToShow, setNumMessagesToShow] = useState4(INITIAL_MESSAGES_TO_SHOW);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState4(false);
  const headerDropdownRef = useRef2(null);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [tooltip, setTooltip] = useState4(null);
  const hideTooltipTimeoutRef = useRef2(null);
  const tooltipElementRef = useRef2(null);
  const effectiveCharacterStats = useMemo(() => {
    return calculateEffectiveStats(gameState.characterStats, gameState.equippedItems, gameState.inventory);
  }, [gameState.characterStats, gameState.equippedItems, gameState.inventory]);
  const [isDesktopPanelsDropdownOpen, setIsDesktopPanelsDropdownOpen] = useState4(false);
  const desktopPanelsDropdownRef = useRef2(null);
  const prevIsLoadingAIRef = useRef2(isLoadingAI);
  const prevCurrentWorldEventIdRef = useRef2(null);
  useEffect5(() => {
    const handleClickOutside = (event) => {
      if (headerDropdownRef.current && !headerDropdownRef.current.contains(event.target)) {
        setIsHeaderDropdownOpen(false);
      }
      if (desktopPanelsDropdownRef.current && !desktopPanelsDropdownRef.current.contains(event.target)) {
        setIsDesktopPanelsDropdownOpen(false);
      }
    };
    if (isHeaderDropdownOpen || isDesktopPanelsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHeaderDropdownOpen, isDesktopPanelsDropdownOpen]);
  useEffect5(() => {
    if (gameState) {
      autosaveCurrentStory(gameState);
    }
  }, [gameState, autosaveCurrentStory]);
  useEffect5(() => {
    setNumMessagesToShow(INITIAL_MESSAGES_TO_SHOW);
  }, [gameState.setup.id]);
  useEffect5(() => {
    if (storyLogRef.current && gameState.storyLog.length > 0) {
      const lastMessage = gameState.storyLog[gameState.storyLog.length - 1];
      const secondLastMessage = gameState.storyLog.length > 1 ? gameState.storyLog[gameState.storyLog.length - 2] : null;
      const isNewAIMessage = (lastMessage.type === "narration" || lastMessage.type === "event" || lastMessage.type === "author") && (secondLastMessage && secondLastMessage.type === "system" && secondLastMessage.content.includes("quy\u1EBFt \u0111\u1ECBnh:") || gameState.storyLog.length === 1 && (lastMessage.type === "narration" || lastMessage.type === "author"));
      if (isNewAIMessage) {
        const newMessageElement = document.getElementById(lastMessage.id);
        if (newMessageElement) {
          newMessageElement.scrollIntoView({ behavior: "smooth", block: "start" });
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
  useEffect5(() => {
    const hpStat = effectiveCharacterStats.hp;
    if (hpStat && typeof hpStat.value === "number" && hpStat.value <= 0) {
      const isAlreadyDeadOrModalOpen = gameState.storyLog.some((msg) => msg.type === "system" && msg.content.includes("qua \u0111\u1EDDi")) || gameState.currentChoices.length === 0 && gameState.isInitialStoryGenerated && gameState.storyLog.length > 1;
      if (!isAlreadyDeadOrModalOpen) {
        addToast({ message: `${gameState.setup.character.name} \u0111\xE3 tr\xFAt h\u01A1i th\u1EDF cu\u1ED1i c\xF9ng...`, type: "error", icon: "fas fa-skull-crossbones", duration: 1e4 });
        setActivePanelModal(null);
        setGameState((prev) => {
          if (!prev) return null;
          const deathMessage = {
            id: `system-death-${Date.now()}`,
            type: "system",
            content: `${prev.setup.character.name} \u0111\xE3 t\u1EED vong. S\u1ED1 m\u1EC7nh \u0111\xE3 \u0111\u1ECBnh, kh\xF4ng th\u1EC3 xoay chuy\u1EC3n.`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          return { ...prev, storyLog: [...prev.storyLog, deathMessage], currentChoices: [] };
        });
        openModal(10 /* DeathConfirmation */);
      }
    }
  }, [effectiveCharacterStats.hp, gameState.setup.character.name, gameState.storyLog, gameState.currentChoices.length, gameState.isInitialStoryGenerated, openModal, setGameState, addToast]);
  const processAndAddNewEntries = useCallback2((currentEntries, newEntriesRaw) => {
    if (!newEntriesRaw || newEntriesRaw.length === 0) return currentEntries;
    let updatedEntries = [...currentEntries];
    newEntriesRaw.forEach((newEntryRaw) => {
      if (!newEntryRaw.name || !newEntryRaw.type) return;
      const existingIndex = updatedEntries.findIndex((e) => e.name === newEntryRaw.name && e.type === newEntryRaw.type);
      if (existingIndex > -1) {
        if (newEntryRaw.description && newEntryRaw.description !== updatedEntries[existingIndex].description) {
          addToast({ message: `B\xE1ch khoa c\u1EADp nh\u1EADt: ${newEntryRaw.name}`, type: "info", icon: "fas fa-book-medical" });
          updatedEntries[existingIndex] = { ...updatedEntries[existingIndex], description: newEntryRaw.description };
        }
      } else {
        addToast({ message: `Kh\xE1m ph\xE1 m\u1EDBi: ${newEntryRaw.name} (${newEntryRaw.type})`, type: "info", icon: "fas fa-map-marked-alt" });
        updatedEntries.push({
          id: newEntryRaw.id || generateStableId(newEntryRaw.name, `encyclopedia-${newEntryRaw.type}`),
          name: newEntryRaw.name,
          type: newEntryRaw.type,
          description: newEntryRaw.description || "Ch\u01B0a c\xF3 m\xF4 t\u1EA3 chi ti\u1EBFt."
        });
      }
    });
    return updatedEntries;
  }, [addToast]);
  const handleAction = useCallback2(async (actionText) => {
    if (isLoadingAI) return;
    setIsLoadingAI(true);
    const playerActionMessage = {
      id: `msg-action-${Date.now()}`,
      type: "system",
      content: actionText === "AI_AUTO_CONTINUE_STORY" ? `${gameState.setup.character.name} \u0111\u1EC3 AI t\u1EF1 vi\u1EBFt ti\u1EBFp t\xECnh ti\u1EBFt...` : `${gameState.setup.character.name} ${gameState.isAuthorInterventionModeActive ? " (T\xE1c Gi\u1EA3)" : ""} quy\u1EBFt \u0111\u1ECBnh: "${actionText}"`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
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
      currentTime: gameState.currentTime
    };
    let previousGameState = null;
    setGameState((prev) => {
      if (!prev) return null;
      previousGameState = prev;
      const limitedHistory = prev.history.slice(-9);
      return {
        ...prev,
        storyLog: [...prev.storyLog, playerActionMessage],
        history: [...limitedHistory, currentStateSnapshot]
      };
    });
    const apiKey = settings.useDefaultAPI ? process.env.API_KEY || "" : localStorage.getItem(LOCAL_STORAGE_API_KEY) || "";
    try {
      const stateForAI = { ...gameState, storyLog: [...gameState.storyLog, playerActionMessage] };
      const nextSegmentData = await generateNextStorySegment(
        apiKey,
        settings.useDefaultAPI,
        stateForAI,
        actionText,
        nsfwSettings,
        { currencyEnabled: settings.currencyEnabled, timeSystemEnabled: settings.timeSystemEnabled, reputationSystemEnabled: settings.reputationSystemEnabled }
      );
      setGameState((prev) => {
        if (!prev) return null;
        let updatedGameState = { ...prev };
        updatedGameState.storyLog = [...updatedGameState.storyLog, nextSegmentData.story];
        updatedGameState.currentChoices = nextSegmentData.choices;
        if (nextSegmentData.updatedSummary) updatedGameState.currentSummary = nextSegmentData.updatedSummary;
        updatedGameState.encyclopedia = processAndAddNewEntries(updatedGameState.encyclopedia, nextSegmentData.newEntries);
        if (nextSegmentData.statChanges) {
          nextSegmentData.statChanges.forEach((change) => {
            const statToUpdate = updatedGameState.characterStats[change.attribute_id];
            if (statToUpdate) {
              let changeDescription = "";
              const originalValue = statToUpdate.value;
              if (change.new_value !== void 0) {
                statToUpdate.value = change.new_value;
                changeDescription = `${statToUpdate.name}: ${originalValue} -> ${change.new_value}`;
              } else if (change.change_value !== void 0 && typeof statToUpdate.value === "number") {
                statToUpdate.value += change.change_value;
                changeDescription = `${statToUpdate.name}: ${originalValue} ${change.change_value >= 0 ? "+" : ""}${change.change_value} -> ${statToUpdate.value}`;
              }
              if (change.new_max_value !== void 0 && typeof statToUpdate.maxValue === "number") {
                statToUpdate.maxValue = change.new_max_value;
                changeDescription += ` (Max: ${statToUpdate.maxValue})`;
              }
              if (change.reason) changeDescription += ` (L\xFD do: ${change.reason})`;
              if (changeDescription) addToast({ message: changeDescription, type: "info", icon: "fas fa-chart-line" });
            }
          });
        }
        const { updatedInventory, lostItemIds } = updateInventory(updatedGameState.inventory, nextSegmentData.itemChanges?.gained, nextSegmentData.itemChanges?.lost);
        updatedGameState.inventory = updatedInventory;
        if (lostItemIds.length > 0) {
          for (const slot in updatedGameState.equippedItems) {
            const typedSlot = slot;
            if (updatedGameState.equippedItems[typedSlot] && lostItemIds.includes(updatedGameState.equippedItems[typedSlot])) {
              const lostItemName = previousGameState?.inventory.find((i) => i.id === updatedGameState.equippedItems[typedSlot])?.name || "M\u1ED9t v\u1EADt ph\u1EA9m";
              delete updatedGameState.equippedItems[typedSlot];
              addToast({ message: `${lostItemName} \u0111\xE3 b\u1ECB m\u1EA5t v\xE0 t\u1EF1 \u0111\u1ED9ng th\xE1o ra.`, type: "warning", icon: "fas fa-box-tissue" });
            }
          }
        }
        if (nextSegmentData.itemChanges?.gained) {
          nextSegmentData.itemChanges.gained.forEach((item) => addToast({ message: `Nh\u1EADn \u0111\u01B0\u1EE3c: ${item.name} (x${item.quantity})`, type: "success", icon: item.icon || "fas fa-gift" }));
        }
        if (nextSegmentData.itemChanges?.lost) {
          nextSegmentData.itemChanges.lost.forEach((itemLost) => {
            const name = "name" in itemLost ? itemLost.name : previousGameState?.inventory.find((i) => i.id === itemLost.id)?.name || "M\u1ED9t v\u1EADt ph\u1EA9m";
            addToast({ message: `M\u1EA5t: ${name} (x${itemLost.quantity})`, type: "warning", icon: "fas fa-minus-circle" });
          });
        }
        if (nextSegmentData.newSkillsUnlocked) {
          nextSegmentData.newSkillsUnlocked.forEach((newSkill) => {
            if (!updatedGameState.characterSkills.find((s) => s.id === newSkill.id || s.name === newSkill.name)) {
              const skillToAdd = {
                id: newSkill.id || generateStableId(newSkill.name, "skill"),
                name: newSkill.name,
                description: newSkill.description || "Ch\u01B0a c\xF3 m\xF4 t\u1EA3.",
                icon: newSkill.icon || "fas fa-book-sparkles",
                category: newSkill.category || "kh\xE1c",
                proficiency: newSkill.proficiency || "S\u01A1 Nh\u1EADp M\xF4n",
                xp: newSkill.xp || 0,
                xpToNextLevel: newSkill.xpToNextLevel || 100,
                effects: newSkill.effects || []
              };
              updatedGameState.characterSkills.push(skillToAdd);
              addToast({ message: `H\u1ECDc \u0111\u01B0\u1EE3c k\u1EF9 n\u0103ng m\u1EDBi: ${skillToAdd.name}!`, type: "success", icon: skillToAdd.icon || "fas fa-brain" });
            }
          });
        }
        if (nextSegmentData.skillChanges && Array.isArray(nextSegmentData.skillChanges)) {
          nextSegmentData.skillChanges.forEach((change) => {
            const skillIndex = updatedGameState.characterSkills.findIndex((s) => s.id === change.skill_id || s.name === change.skill_id);
            if (skillIndex > -1) {
              const skillToUpdate = { ...updatedGameState.characterSkills[skillIndex] };
              let toastMessage = `K\u1EF9 n\u0103ng ${skillToUpdate.name}: `;
              let changesMade = false;
              if (change.xp_gained !== void 0) {
                skillToUpdate.xp += change.xp_gained;
                toastMessage += `+${change.xp_gained} XP. `;
                changesMade = true;
              }
              if (change.new_proficiency) {
                toastMessage += `Th\xE0nh th\u1EA1o -> ${change.new_proficiency}. `;
                skillToUpdate.proficiency = change.new_proficiency;
                skillToUpdate.xp = 0;
                changesMade = true;
              }
              if (change.new_xp_to_next_level !== void 0) skillToUpdate.xpToNextLevel = change.new_xp_to_next_level;
              if (change.new_description) {
                skillToUpdate.description = change.new_description;
                if (!changesMade) toastMessage += `M\xF4 t\u1EA3 c\u1EADp nh\u1EADt. `;
                changesMade = true;
              }
              if (change.reason) toastMessage += `(L\xFD do: ${change.reason})`;
              if (changesMade) addToast({ message: toastMessage, type: "info", icon: skillToUpdate.icon || "fas fa-graduation-cap" });
              if (skillToUpdate.xp >= skillToUpdate.xpToNextLevel && skillToUpdate.xpToNextLevel > 0) {
                const proficiencies = ["S\u01A1 Nh\u1EADp M\xF4n", "Ti\u1EC3u Th\xE0nh", "\u0110\u1EA1i Th\xE0nh", "Vi\xEAn M\xE3n", "L\xF4 Ho\u1EA3 Thu\u1EA7n Thanh", "\u0110\u0103ng Phong T\u1EA1o C\u1EF1c"];
                const currentProfIndex = proficiencies.indexOf(skillToUpdate.proficiency);
                if (currentProfIndex < proficiencies.length - 1) {
                  skillToUpdate.proficiency = proficiencies[currentProfIndex + 1];
                  skillToUpdate.xp -= skillToUpdate.xpToNextLevel;
                  skillToUpdate.xpToNextLevel = Math.floor(skillToUpdate.xpToNextLevel * (1.5 + Math.random() * 0.5));
                  addToast({ message: `K\u1EF9 n\u0103ng ${skillToUpdate.name} \u0111\xE3 th\u0103ng c\u1EA5p th\xE0nh th\u1EA1o l\xEAn ${skillToUpdate.proficiency}!`, type: "success", icon: "fas fa-angle-double-up" });
                } else if (skillToUpdate.proficiency === "\u0110\u0103ng Phong T\u1EA1o C\u1EF1c") {
                  skillToUpdate.xp = skillToUpdate.xpToNextLevel;
                }
              }
              updatedGameState.characterSkills[skillIndex] = skillToUpdate;
            }
          });
        }
        if (nextSegmentData.newlyUnlockedAchievements) {
          nextSegmentData.newlyUnlockedAchievements.forEach((ach) => {
            if (!updatedGameState.unlockedAchievements.find((ua) => ua.name === ach.name)) {
              const newAch = { ...ach, id: generateStableId(ach.name, "ach"), unlockedAt: (/* @__PURE__ */ new Date()).toISOString() };
              updatedGameState.unlockedAchievements = [...updatedGameState.unlockedAchievements, newAch];
              addToast({ message: `Th\xE0nh t\u1EF1u m\u1EDBi: ${newAch.name}!`, type: "success", icon: newAch.icon || "fas fa-trophy" });
            }
          });
        }
        if (nextSegmentData.relationshipChanges) {
          nextSegmentData.relationshipChanges.forEach((change) => {
            let npcProfile = Object.values(updatedGameState.npcRelationships).find((p) => p.name === change.npc_name);
            if (!npcProfile && updatedGameState.encyclopedia.find((e) => e.name === change.npc_name && e.type === "NPC" /* NPC */)) {
              const newNpcEntry = updatedGameState.encyclopedia.find((e) => e.name === change.npc_name && e.type === "NPC" /* NPC */);
              if (newNpcEntry) {
                const newNpcId = newNpcEntry.id;
                updatedGameState.npcRelationships[newNpcId] = {
                  id: newNpcId,
                  name: newNpcEntry.name,
                  status: "Trung L\u1EADp" /* Neutral */,
                  score: 0,
                  description: newNpcEntry.description,
                  known: true
                };
                npcProfile = updatedGameState.npcRelationships[newNpcId];
                addToast({ message: `G\u1EB7p g\u1EE1 ${newNpcEntry.name}.`, type: "info", icon: "fas fa-user-plus" });
              }
            }
            if (npcProfile) {
              let oldStatus = npcProfile.status;
              let oldScore = npcProfile.score;
              if (change.score_change !== void 0) npcProfile.score = Math.max(-100, Math.min(100, npcProfile.score + change.score_change));
              if (change.new_status) npcProfile.status = change.new_status;
              else {
                if (npcProfile.score <= -80) npcProfile.status = "Th\xF9 \u0110\u1ECBch" /* Hostile */;
                else if (npcProfile.score <= -30) npcProfile.status = "Kh\xF4ng Tin T\u01B0\u1EDFng" /* Mistrustful */;
                else if (npcProfile.score < 30) npcProfile.status = "Trung L\u1EADp" /* Neutral */;
                else if (npcProfile.score < 60) npcProfile.status = "H\xF2a H\u1EA3o" /* Amicable */;
                else if (npcProfile.score < 80) npcProfile.status = "Th\xE2n Thi\u1EC7n" /* Friendly */;
                else if (npcProfile.score < 100) npcProfile.status = "Trung Th\xE0nh" /* Loyal */;
                else npcProfile.status = "Ng\u01B0\u1EE1ng M\u1ED9" /* Adored */;
              }
              if (change.reason) npcProfile.description = change.reason;
              if (oldStatus !== npcProfile.status || oldScore !== npcProfile.score) {
                addToast({ message: `Quan h\u1EC7 v\u1EDBi ${npcProfile.name}: ${oldStatus} (${oldScore}) -> ${npcProfile.status} (${npcProfile.score}). ${change.reason ? `L\xFD do: ${change.reason}` : ""}`.trim(), type: "info", icon: "fas fa-heartbeat", duration: 7e3 });
              }
              updatedGameState.npcRelationships[npcProfile.id] = npcProfile;
            }
          });
        }
        if (nextSegmentData.newObjectivesSuggested) {
          nextSegmentData.newObjectivesSuggested.forEach((objSugg) => {
            if (!updatedGameState.objectives.find((o) => o.title === objSugg.title && o.status === "active")) {
              const newObjective = { ...objSugg, id: generateStableId(objSugg.title, "obj"), status: "active", isPlayerGoal: false };
              updatedGameState.objectives.push(newObjective);
              addToast({ message: `M\u1EE5c ti\xEAu m\u1EDBi \u0111\u01B0\u1EE3c g\u1EE3i \xFD: ${newObjective.title}`, type: "info", icon: "fas fa-lightbulb" });
            }
          });
        }
        if (nextSegmentData.objectiveUpdates) {
          nextSegmentData.objectiveUpdates.forEach((update) => {
            const objIndex = updatedGameState.objectives.findIndex((o) => (o.id === update.objective_id_or_title || o.title === update.objective_id_or_title) && o.status === "active");
            if (objIndex > -1) {
              updatedGameState.objectives[objIndex].status = update.new_status;
              let toastIcon = update.new_status === "completed" ? "fas fa-flag-checkered" : "fas fa-times-circle";
              let toastTypeVal = update.new_status === "completed" ? "success" : "error";
              addToast({ message: `M\u1EE5c ti\xEAu "${updatedGameState.objectives[objIndex].title}" \u0111\xE3 ${update.new_status === "completed" ? "ho\xE0n th\xE0nh" : "th\u1EA5t b\u1EA1i"}! ${update.reason ? `L\xFD do: ${update.reason}` : ""}`, type: toastTypeVal, icon: toastIcon, duration: 8e3 });
            }
          });
        }
        if (settings.currencyEnabled && nextSegmentData.currencyChanges) {
          const change = nextSegmentData.currencyChanges;
          if (updatedGameState.currency) {
            const oldAmount = updatedGameState.currency.amount;
            updatedGameState.currency.amount = change.new_amount !== void 0 ? change.new_amount : updatedGameState.currency.amount + (change.change_value || 0);
            updatedGameState.currency.amount = Math.max(0, updatedGameState.currency.amount);
            if (oldAmount !== updatedGameState.currency.amount) {
              addToast({ message: `Ti\u1EC1n t\u1EC7 (${updatedGameState.currency.name}): ${change.change_value ? (change.change_value > 0 ? "+" : "") + change.change_value.toLocaleString() : `-> ${updatedGameState.currency.amount.toLocaleString()}`} ${change.reason ? `(${change.reason})` : ""}`, type: "info", icon: updatedGameState.currency.icon || "fas fa-coins" });
            }
          }
        }
        if (settings.timeSystemEnabled && nextSegmentData.timeUpdate) {
          updatedGameState.currentTime = nextSegmentData.timeUpdate;
        }
        return updatedGameState;
      });
    } catch (error) {
      console.error("Error generating next story segment:", error);
      addToast({ message: `L\u1ED7i AI: ${error.message}. H\xE3y th\u1EED l\u1EA1i.`, type: "error" });
    } finally {
      setIsLoadingAI(false);
    }
  }, [gameState, setGameState, nsfwSettings, settings, isLoadingAI, addToast, processAndAddNewEntries, activePanelModal]);
  useEffect5(() => {
    const aiJustFinishedLoading = prevIsLoadingAIRef.current === true && !isLoadingAI;
    if (aiJustFinishedLoading) {
      if (gameState && !gameState.isRoleplayModeActive && !gameState.isAuthorInterventionModeActive && gameState.currentChoices.length === 0 && gameState.isInitialStoryGenerated && gameState.history.length > 0 && !gameState.storyLog.some((msg) => msg.type === "system" && msg.content.includes("t\u1EED vong"))) {
        handleAction("Nh\xE2n v\u1EADt ch\xEDnh quan s\xE1t xung quanh v\xE0 c\xE2n nh\u1EAFc b\u01B0\u1EDBc ti\u1EBFp theo.");
      }
    }
    prevIsLoadingAIRef.current = isLoadingAI;
  }, [
    isLoadingAI,
    gameState,
    handleAction
  ]);
  useEffect5(() => {
    if (gameState && gameState.currentWorldEvent && gameState.currentWorldEvent.id !== prevCurrentWorldEventIdRef.current) {
      const lastMessage = gameState.storyLog[gameState.storyLog.length - 1];
      if (lastMessage && lastMessage.type === "event" && lastMessage.content.includes(gameState.currentWorldEvent.name) && !isLoadingAI) {
        setTimeout(() => {
          if (!isLoadingAI) {
            handleAction("AI_AUTO_CONTINUE_STORY");
          }
        }, 100);
      }
    }
    prevCurrentWorldEventIdRef.current = gameState?.currentWorldEvent?.id;
  }, [gameState?.currentWorldEvent, gameState?.storyLog, isLoadingAI, handleAction]);
  const handleUseItem = useCallback2((itemToUse) => {
    if (!itemToUse.usable || itemToUse.quantity <= 0) {
      addToast({ message: "Kh\xF4ng th\u1EC3 s\u1EED d\u1EE5ng v\u1EADt ph\u1EA9m n\xE0y.", type: "warning" });
      return;
    }
    let tempInventory = [...gameState.inventory];
    if (itemToUse.consumable) {
      const itemIndex = tempInventory.findIndex((i) => i.id === itemToUse.id);
      if (itemIndex > -1) {
        tempInventory[itemIndex].quantity -= 1;
        if (tempInventory[itemIndex].quantity <= 0) {
          tempInventory.splice(itemIndex, 1);
          let tempEquipped = { ...gameState.equippedItems };
          let unequipped = false;
          for (const slot in tempEquipped) {
            if (tempEquipped[slot] === itemToUse.id) {
              delete tempEquipped[slot];
              unequipped = true;
              break;
            }
          }
          if (unequipped) setGameState((prev) => prev ? { ...prev, equippedItems: tempEquipped } : null);
        }
      }
      setGameState((prev) => prev ? { ...prev, inventory: tempInventory } : null);
    }
    let newCharacterStats = { ...gameState.characterStats };
    if (itemToUse.effects) {
      itemToUse.effects.forEach((effect) => {
        const stat = newCharacterStats[effect.statId];
        if (stat && typeof stat.value === "number") {
          const oldValue = stat.value;
          stat.value += effect.changeValue;
          if (stat.maxValue !== void 0) stat.value = Math.min(stat.value, stat.maxValue);
          if (stat.id === "hp") stat.value = Math.max(0, stat.value);
          addToast({ message: `${itemToUse.name} \u0111\xE3 s\u1EED d\u1EE5ng. ${stat.name}: ${parseFloat(oldValue.toFixed(1))} -> ${parseFloat(stat.value.toFixed(1))}.`, type: "success", icon: itemToUse.icon || "fas fa-magic-wand-sparkles" });
        }
      });
      setGameState((prev) => prev ? { ...prev, characterStats: newCharacterStats } : null);
    }
    handleAction(`S\u1EED d\u1EE5ng v\u1EADt ph\u1EA9m ${itemToUse.name}.`);
  }, [gameState.inventory, gameState.characterStats, gameState.equippedItems, setGameState, handleAction, addToast]);
  const handleEquipItem = useCallback2((itemToEquip) => {
    if (!itemToEquip.equippable || !itemToEquip.slot) {
      addToast({ message: "V\u1EADt ph\u1EA9m n\xE0y kh\xF4ng th\u1EC3 trang b\u1ECB.", type: "warning" });
      return;
    }
    setGameState((prev) => {
      if (!prev) return null;
      const newEquippedItems = { ...prev.equippedItems };
      newEquippedItems[itemToEquip.slot] = itemToEquip.id;
      addToast({ message: `\u0110\xE3 trang b\u1ECB: ${itemToEquip.name} v\xE0o \xF4 ${itemToEquip.slot}.`, type: "success", icon: itemToEquip.icon || "fas fa-user-shield" });
      return { ...prev, equippedItems: newEquippedItems };
    });
  }, [setGameState, addToast]);
  const handleUnequipItem = useCallback2((slot) => {
    setGameState((prev) => {
      if (!prev) return null;
      const itemId = prev.equippedItems[slot];
      if (!itemId) return prev;
      const item = prev.inventory.find((i) => i.id === itemId);
      const newEquippedItems = { ...prev.equippedItems };
      delete newEquippedItems[slot];
      addToast({ message: `\u0110\xE3 th\xE1o: ${item?.name || "V\u1EADt ph\u1EA9m"} t\u1EEB \xF4 ${slot}.`, type: "info", icon: item?.icon || "fas fa-hand-paper" });
      return { ...prev, equippedItems: newEquippedItems };
    });
  }, [setGameState, addToast]);
  const handleCultivate = useCallback2(() => handleAction("T\u1EADp Trung N\xE2ng C\u1EA5p"), [handleAction]);
  const handleAdvance = useCallback2(() => {
    const qiStat = effectiveCharacterStats.spiritual_qi;
    if (qiStat && typeof qiStat.value === "number" && typeof qiStat.maxValue === "number" && qiStat.value >= qiStat.maxValue && qiStat.maxValue > 0) {
      handleAction("Th\u1EED Th\xE1ch Th\u0103ng Ti\u1EBFn");
    } else {
      addToast({ message: "Ch\u01B0a \u0111\u1EE7 \u0111i\u1EC3m kinh nghi\u1EC7m \u0111\u1EC3 \u0111\u1ED9t ph\xE1.", type: "warning" });
    }
  }, [handleAction, effectiveCharacterStats.spiritual_qi, addToast]);
  const toggleRoleplayMode = useCallback2(() => {
    setGameState((prev) => {
      if (!prev) return null;
      const newRoleplayMode = !prev.isRoleplayModeActive;
      addToast({ message: `Ch\u1EBF \u0111\u1ED9 ${newRoleplayMode ? "Nh\u1EADp Vai (T\u1EF1 do)" : "AI H\u1ED7 Tr\u1EE3 (G\u1EE3i \xFD)"} \u0111\xE3 ${newRoleplayMode ? "B\u1EACT" : "T\u1EAET"}.`, type: "info", icon: newRoleplayMode ? "fas fa-theater-masks" : "fas fa-brain" });
      const newAuthorMode = newRoleplayMode ? false : prev.isAuthorInterventionModeActive;
      return { ...prev, isRoleplayModeActive: newRoleplayMode, isAuthorInterventionModeActive: newAuthorMode, currentChoices: newRoleplayMode || newAuthorMode ? [] : prev.currentChoices };
    });
  }, [setGameState, addToast]);
  const toggleAuthorInterventionMode = useCallback2(() => {
    setGameState((prev) => {
      if (!prev) return null;
      const newAuthorMode = !prev.isAuthorInterventionModeActive;
      addToast({
        message: `Ch\u1EBF \u0111\u1ED9 Can Thi\u1EC7p T\xE1c Gi\u1EA3 ${newAuthorMode ? "B\u1EACT" : "T\u1EAET"}.`,
        type: "info",
        icon: newAuthorMode ? "fas fa-feather-alt" : "fas fa-feather"
      });
      const newRoleplayMode = newAuthorMode ? false : prev.isRoleplayModeActive;
      return {
        ...prev,
        isAuthorInterventionModeActive: newAuthorMode,
        isRoleplayModeActive: newRoleplayMode,
        currentChoices: newAuthorMode || newRoleplayMode ? [] : prev.currentChoices
      };
    });
  }, [setGameState, addToast]);
  const handleUndoLastAction = useCallback2(() => {
    setGameState((prev) => {
      if (!prev || prev.history.length === 0) {
        addToast({ message: "Kh\xF4ng c\xF3 h\xE0nh \u0111\u1ED9ng n\xE0o \u0111\u1EC3 ho\xE0n t\xE1c.", type: "warning" });
        return prev;
      }
      const previousStateSnapshot = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);
      addToast({ message: "\u0110\xE3 ho\xE0n t\xE1c h\xE0nh \u0111\u1ED9ng tr\u01B0\u1EDBc \u0111\xF3.", type: "info", icon: "fas fa-undo" });
      const restoredGameState = {
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
        history: newHistory
      };
      return restoredGameState;
    });
  }, [setGameState, addToast]);
  const handleRerollInitialStory = useCallback2(async () => {
    if (isLoadingAI || !gameState || gameState.history.length > 0) return;
    setIsLoadingAI(true);
    addToast({ message: "\u0110ang y\xEAu c\u1EA7u AI t\u1EA1o l\u1EA1i m\u1EDF \u0111\u1EA7u m\u1EDBi...", type: "info", icon: "fas fa-dice-d6 fa-spin" });
    setNumMessagesToShow(INITIAL_MESSAGES_TO_SHOW);
    const apiKey = settings.useDefaultAPI ? process.env.API_KEY || "" : localStorage.getItem(LOCAL_STORAGE_API_KEY) || "";
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
      setGameState((prev) => {
        if (!prev) return null;
        const newMessages = [data.story];
        let updatedEncyclopedia = [...prev.setup.entities];
        updatedEncyclopedia = processAndAddNewEntries(updatedEncyclopedia, data.newEntries);
        let updatedStats = data.initialStats || prev.characterStats;
        let updatedInventory = data.initialInventory || [];
        let updatedSkills = data.initialSkills || [];
        let updatedAchievements = [];
        if (data.newlyUnlockedAchievements) {
          updatedAchievements = data.newlyUnlockedAchievements.map((ach) => ({
            ...ach,
            id: generateStableId(ach.name, "ach"),
            unlockedAt: (/* @__PURE__ */ new Date()).toISOString()
          }));
          data.newlyUnlockedAchievements.forEach((ach) => addToast({ message: `Th\xE0nh t\u1EF1u m\u1EDBi: ${ach.name}!`, type: "success", icon: ach.icon || "fas fa-trophy" }));
        }
        let updatedRelationships = {};
        if (data.initialRelationships) {
          data.initialRelationships.forEach((rel) => {
            if (rel.name) {
              const npcId = rel.id || generateStableId(rel.name, "npc");
              updatedRelationships[npcId] = {
                id: npcId,
                name: rel.name,
                status: rel.status || "Trung L\u1EADp" /* Neutral */,
                score: rel.score || 0,
                description: rel.description,
                known: rel.known !== void 0 ? rel.known : true
              };
            }
          });
        }
        let updatedObjectives = [];
        if (data.initialObjectives) {
          updatedObjectives = data.initialObjectives.map((obj) => ({
            ...obj,
            id: generateStableId(obj.title, "obj"),
            status: "active",
            isPlayerGoal: obj.isPlayerGoal !== void 0 ? obj.isPlayerGoal : obj.title.toLowerCase().includes(prev.setup.character.goal.toLowerCase()) && prev.setup.character.goal.length > 5
          }));
          data.initialObjectives.forEach((obj) => addToast({ message: `M\u1EE5c ti\xEAu m\u1EDBi: ${obj.title}`, type: "info", icon: "fas fa-flag-checkered" }));
        }
        const initialCurrency = settings.currencyEnabled && data.initialCurrency ? data.initialCurrency : settings.currencyEnabled ? { name: "\u0110\u1ED3ng", amount: 100, icon: "fas fa-coins" } : void 0;
        const initialTime = settings.timeSystemEnabled && data.initialTime ? data.initialTime : settings.timeSystemEnabled ? "08:00 Ng\xE0y 1, Th\xE1ng 1, N\u0103m 1 (S\xE1ng s\u1EDBm)" : void 0;
        addToast({ message: "\u0110\xE3 t\u1EA1o l\u1EA1i m\u1EDF \u0111\u1EA7u c\xE2u chuy\u1EC7n!", type: "success", icon: "fas fa-dice-d6" });
        const newState = {
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
          currentTime: initialTime
        };
        return newState;
      });
    } catch (error) {
      console.error("Error rerolling initial story:", error);
      addToast({ message: `L\u1ED7i AI khi t\u1EA1o l\u1EA1i m\u1EDF \u0111\u1EA7u: ${error.message}.`, type: "error", duration: 1e4 });
    } finally {
      setIsLoadingAI(false);
    }
  }, [isLoadingAI, gameState, nsfwSettings, settings, setGameState, addToast, processAndAddNewEntries]);
  const handleKeywordMouseEnter = useCallback2((event, entryId, entryType) => {
    if (hideTooltipTimeoutRef.current) clearTimeout(hideTooltipTimeoutRef.current);
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    let contentNode = null;
    if (entryType === "STAT") {
      const stat = effectiveCharacterStats[entryId];
      if (stat) contentNode = /* @__PURE__ */ jsxs6("div", { className: "p-2 text-xs", children: [
        /* @__PURE__ */ jsx8("strong", { className: "font-semibold", children: stat.name }),
        ": ",
        String(stat.value),
        stat.maxValue ? `/${stat.maxValue}` : "",
        /* @__PURE__ */ jsx8("br", {}),
        stat.description
      ] });
    } else if (entryType === "SKILL") {
      const skill = gameState.characterSkills.find((s) => s.id === entryId || s.name === entryId);
      if (skill) contentNode = /* @__PURE__ */ jsxs6("div", { className: "p-2 text-xs", children: [
        /* @__PURE__ */ jsx8("strong", { className: "font-semibold", children: skill.name }),
        " (",
        skill.proficiency,
        ")",
        /* @__PURE__ */ jsx8("br", {}),
        skill.description
      ] });
    } else {
      const entry = entryType === "ACH" ? gameState.unlockedAchievements.find((a) => a.id === entryId || a.name === entryId) : entryType === "TRAIT" ? gameState.setup.character.traits.find((t) => t.id === entryId || t.name === entryId) : gameState.encyclopedia.find((e) => (e.id === entryId || e.name === entryId) && e.type === entryType);
      if (entry) contentNode = /* @__PURE__ */ jsxs6("div", { className: "p-2 text-xs", children: [
        /* @__PURE__ */ jsx8("strong", { className: "font-semibold", children: entry.name }),
        " ",
        entryType !== "ACH" && entryType !== "TRAIT" ? `(${entry.type})` : "",
        /* @__PURE__ */ jsx8("br", {}),
        entry.description
      ] });
    }
    if (contentNode) {
      setTooltip({ content: contentNode, x: rect.left + rect.width / 2, y: rect.top, width: rect.width });
    }
  }, [gameState, effectiveCharacterStats]);
  const handleKeywordMouseLeave = useCallback2(() => {
    hideTooltipTimeoutRef.current = setTimeout(() => {
      setTooltip(null);
    }, 200);
  }, []);
  const handleKeywordFocus = useCallback2((event, entryId, entryType) => {
    handleKeywordMouseEnter(event, entryId, entryType);
  }, [handleKeywordMouseEnter]);
  const handleKeywordBlur = useCallback2(() => {
    handleKeywordMouseLeave();
  }, [handleKeywordMouseLeave]);
  const KeywordTooltipWrapper = React8.memo(({ keyword, id, type, children, textColorClass, focusRingClass }) => {
    return /* @__PURE__ */ jsx8(
      "span",
      {
        className: `keyword-tooltip-trigger font-semibold cursor-pointer ${textColorClass} hover:underline focus:outline-none focus:ring-1 ${focusRingClass} rounded-sm px-0.5 -mx-0.5`,
        onMouseEnter: (e) => handleKeywordMouseEnter(e, id, type),
        onMouseLeave: handleKeywordMouseLeave,
        onFocus: (e) => handleKeywordFocus(e, id, type),
        onBlur: handleKeywordBlur,
        tabIndex: 0,
        role: "button",
        "aria-describedby": "keyword-tooltip",
        children
      }
    );
  });
  const parseAndRenderMessageContent = useCallback2((content) => {
    const allPotentialKeywords = [];
    gameState.encyclopedia.forEach((e) => {
      if (e.name) allPotentialKeywords.push({ name: e.name, id: e.id, type: e.type });
    });
    Object.values(effectiveCharacterStats).forEach((s) => {
      if (s.name) allPotentialKeywords.push({ name: s.name, id: s.id, type: "STAT" });
    });
    gameState.characterSkills.forEach((s) => {
      if (s.name) allPotentialKeywords.push({ name: s.name, id: s.id, type: "SKILL" });
    });
    gameState.unlockedAchievements.forEach((a) => {
      if (a.name) allPotentialKeywords.push({ name: a.name, id: a.id, type: "ACH" });
    });
    gameState.setup.character.traits.forEach((t) => {
      if (t.name) allPotentialKeywords.push({ name: t.name, id: t.id, type: "TRAIT" });
    });
    const uniqueKeywordsForRegex = Array.from(new Set(allPotentialKeywords.map((kw) => kw.name))).filter((name) => name.trim().length > 1).sort((a, b) => b.length - a.length);
    if (uniqueKeywordsForRegex.length === 0) {
      return [content];
    }
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regexPattern = uniqueKeywordsForRegex.map((kw) => escapeRegExp(kw)).join("|");
    const regex = new RegExp(`(?<=\\W|^)(${regexPattern})(?=\\W|$)`, "giu");
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const matchedText = match[1];
      const matchedKeywordInfo = allPotentialKeywords.filter((kw) => kw.name.toLowerCase() === matchedText.toLowerCase()).sort((a, b) => b.name.length - a.name.length)[0];
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      if (matchedKeywordInfo) {
        const colorConfig = KEYWORD_TYPE_COLORS[matchedKeywordInfo.type] || KEYWORD_TYPE_COLORS["DEFAULT"];
        parts.push(
          /* @__PURE__ */ jsx8(
            KeywordTooltipWrapper,
            {
              keyword: matchedKeywordInfo.name,
              id: matchedKeywordInfo.id,
              type: matchedKeywordInfo.type,
              textColorClass: colorConfig.base,
              focusRingClass: colorConfig.focusRing,
              children: match[0]
            },
            `${match.index}-${matchedKeywordInfo.name}`
          )
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
  const allPanelButtons = [
    { id: "actions", label: "H\xE0nh \u0110\u1ED9ng", icon: "fas fa-hand-pointer" },
    { id: "stats", label: "Ch\u1EC9 S\u1ED1", icon: "fas fa-chart-line", component: /* @__PURE__ */ jsx8(CharacterStatsPanel, { baseStats: gameState.characterStats, equippedItems: gameState.equippedItems, inventory: gameState.inventory, characterName: gameState.setup.character.name }) },
    { id: "inventory", label: "Ba L\xF4", icon: "fas fa-briefcase", component: /* @__PURE__ */ jsx8(InventoryPanel, { items: gameState.inventory, equippedItems: gameState.equippedItems, onUseItem: handleUseItem, onEquipItem: handleEquipItem, isLoadingAI, currency: gameState.currency, currencyEnabled: settings.currencyEnabled }) },
    { id: "equipment", label: "Trang B\u1ECB", icon: "fas fa-user-shield", component: /* @__PURE__ */ jsx8(EquipmentPanel, { equippedItems: gameState.equippedItems, inventory: gameState.inventory, onUnequipItem: handleUnequipItem }) },
    { id: "cultivation", label: "Tu Luy\u1EC7n", icon: "fas fa-hat-wizard", component: /* @__PURE__ */ jsx8(CultivationPanel, { progressionStat: effectiveCharacterStats.progression_level, qiStat: effectiveCharacterStats.spiritual_qi, onAdvance: handleAdvance, onCultivate: handleCultivate, isLoadingAI }) },
    { id: "skills", label: "K\u1EF9 N\u0103ng", icon: "fas fa-book-sparkles", component: /* @__PURE__ */ jsx8(CharacterSkillsPanel, { skills: gameState.characterSkills, isLoadingAI }) },
    { id: "achievements", label: "Th\xE0nh T\u1EF1u", icon: "fas fa-trophy", component: /* @__PURE__ */ jsx8(AchievementsPanel, { achievements: gameState.unlockedAchievements }) },
    { id: "relationships", label: "Quan H\u1EC7", icon: "fas fa-users", component: /* @__PURE__ */ jsx8(RelationshipsPanel, { relationships: gameState.npcRelationships }) },
    { id: "objectives", label: "M\u1EE5c Ti\xEAu", icon: "fas fa-tasks", component: /* @__PURE__ */ jsx8(ObjectivesPanel, { objectives: gameState.objectives, characterGoal: gameState.setup.character.goal }) }
  ];
  const desktopPanelDropdownButtons = allPanelButtons.filter((p) => p.id !== "actions");
  if (!gameState) {
    return /* @__PURE__ */ jsx8("div", { className: "flex items-center justify-center h-screen", children: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u game..." });
  }
  const headerActionButtons = [
    { id: 9 /* Encyclopedia */, icon: "fas fa-book-open", title: "B\xE1ch Khoa To\xE0n Th\u01B0", mobileHidden: false },
    { id: 8 /* StorySummary */, icon: "fas fa-scroll", title: "T\xF3m T\u1EAFt C\u1ED1t Truy\u1EC7n", mobileHidden: true },
    { id: 7 /* WorldEventCreator */, icon: "fas fa-meteor", title: "T\u1EA1o S\u1EF1 Ki\u1EC7n Th\u1EBF Gi\u1EDBi", mobileHidden: true },
    { id: "undo", icon: "fas fa-undo", title: "Ho\xE0n T\xE1c", action: handleUndoLastAction, disabled: gameState.history.length === 0, mobileHidden: true }
  ];
  const visibleHeaderButtons = isMobile ? headerActionButtons.filter((b) => !b.mobileHidden) : headerActionButtons;
  const dropdownHeaderButtons = isMobile ? headerActionButtons.filter((b) => b.mobileHidden) : [];
  if (!gameState.isInitialStoryGenerated && isMobile) {
    dropdownHeaderButtons.push({ id: "reroll", icon: "fas fa-dice-d6", title: "T\u1EA1o L\u1EA1i M\u1EDF \u0110\u1EA7u", action: handleRerollInitialStory, disabled: isLoadingAI || gameState.history.length > 0, mobileHidden: false });
  }
  return /* @__PURE__ */ jsxs6("div", { className: `flex flex-col h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-background-dark dark:to-slate-800 text-text-light dark:text-text-dark overflow-hidden transition-colors duration-300 ${isMobile && activePanelModal === "actions" ? "mobile-action-sheet-body-padding" : ""}`, children: [
    /* @__PURE__ */ jsx8("header", { className: "flex-shrink-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg p-2.5 border-b border-border-light dark:border-border-dark z-20", children: /* @__PURE__ */ jsxs6("div", { className: "container mx-auto flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex-grow min-w-0", children: [
        /* @__PURE__ */ jsx8("h1", { className: "text-base sm:text-lg md:text-xl font-bold text-primary dark:text-primary-light truncate sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg", title: gameState.setup.name || "Cu\u1ED9c Phi\xEAu L\u01B0u Ch\u01B0a \u0110\u1EB7t T\xEAn", children: gameState.setup.name || "Cu\u1ED9c Phi\xEAu L\u01B0u Ch\u01B0a \u0110\u1EB7t T\xEAn" }),
        settings.timeSystemEnabled && gameState.currentTime && /* @__PURE__ */ jsxs6("div", { className: "text-xs text-slate-500 dark:text-slate-400 flex items-center mt-0.5", children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-clock mr-1.5 opacity-80" }),
          /* @__PURE__ */ jsx8("span", { title: `Th\u1EDDi gian trong game: ${gameState.currentTime}`, children: gameState.currentTime })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "flex-shrink-0 flex items-center space-x-1 sm:space-x-1.5", children: [
        /* @__PURE__ */ jsxs6(Button_default, { size: "xs", variant: "ghost", onClick: () => openModal(11 /* SaveGame */), title: "L\u01B0u Game", children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-save" }),
          /* @__PURE__ */ jsx8("span", { className: "hidden sm:inline ml-1.5", children: "L\u01B0u" })
        ] }),
        !isMobile && !gameState.isInitialStoryGenerated && /* @__PURE__ */ jsxs6(
          Button_default,
          {
            size: "xs",
            variant: "ghost",
            onClick: handleRerollInitialStory,
            disabled: isLoadingAI || gameState.history.length > 0,
            title: "T\u1EA1o L\u1EA1i M\u1EDF \u0110\u1EA7u",
            className: "text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-700/50",
            children: [
              /* @__PURE__ */ jsx8("i", { className: "fas fa-dice-d6" }),
              /* @__PURE__ */ jsx8("span", { className: "hidden sm:inline ml-1.5", children: "T\u1EA1o L\u1EA1i M\u1EDF \u0110\u1EA7u" })
            ]
          }
        ),
        !isMobile && /* @__PURE__ */ jsxs6("div", { className: "relative", ref: desktopPanelsDropdownRef, children: [
          /* @__PURE__ */ jsxs6(Button_default, { size: "xs", variant: "ghost", onClick: () => setIsDesktopPanelsDropdownOpen((o) => !o), title: "M\u1EDF B\u1EA3ng \u0110i\u1EC1u Khi\u1EC3n", children: [
            /* @__PURE__ */ jsx8("i", { className: "fas fa-th-large" }),
            /* @__PURE__ */ jsx8("span", { className: "hidden sm:inline ml-1.5", children: "B\u1EA3ng \u0110i\u1EC1u Khi\u1EC3n" })
          ] }),
          isDesktopPanelsDropdownOpen && /* @__PURE__ */ jsx8("div", { className: "absolute right-0 sm:left-0 mt-2 w-56 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-border-light dark:border-border-dark", children: desktopPanelDropdownButtons.map((panel) => /* @__PURE__ */ jsxs6(
            "button",
            {
              onClick: () => {
                setActivePanelModal(panel.id);
                setIsDesktopPanelsDropdownOpen(false);
              },
              className: "w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center",
              title: panel.label,
              children: [
                /* @__PURE__ */ jsx8("i", { className: `${panel.icon} mr-2.5 w-4 text-center` }),
                panel.label
              ]
            },
            panel.id
          )) })
        ] }),
        visibleHeaderButtons.map((btn) => /* @__PURE__ */ jsx8(Button_default, { size: "xs", variant: "ghost", onClick: () => btn.action ? btn.action() : openModal(btn.id), disabled: btn.disabled, title: btn.title, children: /* @__PURE__ */ jsx8("i", { className: btn.icon }) }, btn.title)),
        isMobile && dropdownHeaderButtons.length > 0 && /* @__PURE__ */ jsxs6("div", { className: "relative", ref: headerDropdownRef, children: [
          /* @__PURE__ */ jsx8(Button_default, { size: "xs", variant: "ghost", onClick: () => setIsHeaderDropdownOpen((o) => !o), title: "Th\xEAm t\xF9y ch\u1ECDn", children: /* @__PURE__ */ jsx8("i", { className: "fas fa-ellipsis-v" }) }),
          isHeaderDropdownOpen && /* @__PURE__ */ jsx8("div", { className: "absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-border-light dark:border-border-dark", children: dropdownHeaderButtons.map((btn) => /* @__PURE__ */ jsxs6(
            "button",
            {
              onClick: () => {
                btn.action ? btn.action() : openModal(btn.id);
                setIsHeaderDropdownOpen(false);
              },
              disabled: btn.disabled,
              className: "w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 flex items-center",
              title: btn.title,
              children: [
                /* @__PURE__ */ jsx8("i", { className: `${btn.icon} mr-2.5 w-4 text-center` }),
                btn.title
              ]
            },
            btn.title
          )) })
        ] }),
        /* @__PURE__ */ jsxs6(Button_default, { size: "xs", variant: "danger", onClick: quitGame, title: "Tho\xE1t Game", children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-door-open" }),
          /* @__PURE__ */ jsx8("span", { className: "hidden sm:inline ml-1.5", children: "Tho\xE1t" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs6("main", { className: `flex-grow flex flex-col sm:flex-row overflow-hidden p-2 sm:p-3 gap-2 sm:gap-3 ${isMobile ? "pb-[60px]" : ""}`, children: [
      " ",
      /* @__PURE__ */ jsxs6("div", { ref: storyLogRef, className: "flex-grow w-full sm:w-3/5 xl:w-2/3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 overflow-y-auto custom-scrollbar relative flex flex-col", children: [
        gameState.storyLog.length > numMessagesToShow && /* @__PURE__ */ jsxs6(Button_default, { onClick: () => setNumMessagesToShow((prev) => prev + MESSAGES_TO_LOAD_PER_CLICK), variant: "outline", size: "sm", className: "mx-auto mb-3 text-xs", children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-history mr-2" }),
          "T\u1EA3i Th\xEAm Tin Nh\u1EAFn C\u0169"
        ] }),
        /* @__PURE__ */ jsx8("div", { className: "space-y-3 sm:space-y-4 flex-grow", children: gameState.storyLog.slice(Math.max(0, gameState.storyLog.length - numMessagesToShow)).map((msg) => {
          let msgStyle = "bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100";
          let align = "self-start";
          let icon = null;
          switch (msg.type) {
            case "narration":
              msgStyle = "bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-600/50";
              icon = /* @__PURE__ */ jsx8("i", { className: "fas fa-feather-alt mr-2 sm:mr-2.5 text-slate-400 dark:text-slate-500 opacity-80" });
              break;
            case "dialogue":
              msgStyle = "bg-primary-light/30 dark:bg-primary-dark/40 text-primary-dark dark:text-primary-light border border-primary/40 dark:border-primary-dark/50 shadow-sm";
              icon = /* @__PURE__ */ jsx8("i", { className: "fas fa-comments mr-2 sm:mr-2.5 text-primary dark:text-primary-light opacity-90" });
              break;
            case "system":
              msgStyle = "bg-amber-50 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200 border border-amber-300 dark:border-amber-600/70 text-xs italic shadow-sm";
              align = "self-center w-full sm:w-auto max-w-xl text-center";
              icon = /* @__PURE__ */ jsx8("i", { className: "fas fa-info-circle mr-1.5 sm:mr-2 text-amber-500 dark:text-amber-400" });
              break;
            case "event":
              msgStyle = "bg-gradient-to-r from-purple-500 to-pink-500 text-white dark:from-purple-600 dark:to-pink-600 dark:text-white p-3 sm:p-3.5 shadow-md border-purple-300 dark:border-pink-400";
              icon = /* @__PURE__ */ jsx8("i", { className: "fas fa-star-of-life mr-2 sm:mr-2.5 opacity-90" });
              break;
            case "author":
              msgStyle = "bg-red-100 dark:bg-red-800/70 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-600/70 shadow-sm";
              icon = /* @__PURE__ */ jsx8("i", { className: "fas fa-crown mr-2 sm:mr-2.5 text-red-500 dark:text-red-400 opacity-90" });
              break;
            case "loading":
              return /* @__PURE__ */ jsxs6("div", { className: "p-3 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse text-center", children: [
                /* @__PURE__ */ jsx8("i", { className: "fas fa-spinner fa-spin mr-2" }),
                msg.content
              ] }, msg.id);
          }
          return /* @__PURE__ */ jsx8("div", { id: msg.id, className: `p-2.5 sm:p-3 rounded-xl text-sm leading-relaxed ${msgStyle} ${align} transition-opacity duration-500 animate-fadeInUp`, children: /* @__PURE__ */ jsxs6("div", { className: "flex items-start", children: [
            icon,
            /* @__PURE__ */ jsxs6("div", { className: "flex-grow min-w-0", children: [
              msg.characterName && /* @__PURE__ */ jsxs6("strong", { className: "block mb-0.5", children: [
                msg.characterName,
                ":"
              ] }),
              /* @__PURE__ */ jsx8("div", { className: "whitespace-pre-wrap break-words", children: parseAndRenderMessageContent(msg.content) })
            ] })
          ] }) }, msg.id);
        }) }),
        isLoadingAI && !gameState.isInitialStoryGenerated && /* @__PURE__ */ jsxs6("div", { className: "sticky bottom-0 left-0 right-0 p-3 bg-slate-200/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-b-xl text-center text-sm font-semibold", children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-brain fa-spin mr-2" }),
          "AI \u0111ang kh\u1EDFi t\u1EA1o th\u1EBF gi\u1EDBi... Xin ch\u1EDD trong gi\xE2y l\xE1t..."
        ] })
      ] }),
      !isMobile && /* @__PURE__ */ jsxs6("div", { className: "flex-shrink-0 w-full sm:w-2/5 xl:w-1/3 p-3 sm:p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg flex flex-col overflow-y-auto custom-scrollbar", children: [
        /* @__PURE__ */ jsx8(
          ActionPanelContent,
          {
            choices: gameState.currentChoices,
            onChooseAction: handleAction,
            isLoadingAI,
            isRoleplayModeActive: gameState.isRoleplayModeActive,
            isAuthorInterventionModeActive: gameState.isAuthorInterventionModeActive,
            toggleRoleplayMode,
            toggleAuthorInterventionMode,
            isMobile: false
          }
        ),
        isLoadingAI && gameState.isInitialStoryGenerated && /* @__PURE__ */ jsxs6("div", { className: "flex-shrink-0 p-2.5 bg-slate-200/80 dark:bg-slate-700/80 backdrop-blur-sm text-center text-xs font-semibold border-t border-border-light dark:border-border-dark mt-auto", children: [
          /* @__PURE__ */ jsx8("i", { className: "fas fa-spinner fa-spin mr-2" }),
          "AI \u0111ang x\u1EED l\xFD..."
        ] })
      ] })
    ] }),
    isMobile && /* @__PURE__ */ jsx8("footer", { className: `fixed bottom-0 left-0 right-0 flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-top-strong p-1 border-t border-border-light dark:border-border-dark z-30`, children: /* @__PURE__ */ jsx8("div", { className: "mx-auto flex justify-around items-center flex-nowrap overflow-x-auto no-scrollbar", children: allPanelButtons.map((panel) => /* @__PURE__ */ jsxs6(
      Button_default,
      {
        onClick: () => setActivePanelModal(panel.id),
        variant: activePanelModal === panel.id ? "primary" : "ghost",
        size: "sm",
        className: `!px-1.5 !py-2 !text-xs whitespace-nowrap flex flex-col items-center h-14 min-w-[55px] flex-1 relative`,
        title: panel.label,
        children: [
          /* @__PURE__ */ jsx8("i", { className: `${panel.icon} text-lg mb-0.5` }),
          /* @__PURE__ */ jsx8("span", { className: `text-[10px]`, children: panel.label })
        ]
      },
      panel.id
    )) }) }),
    activePanelModal && activePanelModal !== "actions" && /* @__PURE__ */ jsx8(
      Modal_default,
      {
        isOpen: !!activePanelModal,
        onClose: () => setActivePanelModal(null),
        title: allPanelButtons.find((p) => p.id === activePanelModal)?.label || "B\u1EA3ng Th\xF4ng Tin",
        size: isMobile ? "full" : "xl",
        children: /* @__PURE__ */ jsxs6("div", { className: `${isMobile ? "pb-16" : ""}`, children: [
          " ",
          allPanelButtons.find((p) => p.id === activePanelModal)?.component
        ] })
      }
    ),
    isMobile && /* @__PURE__ */ jsxs6(
      MobileActionSheet_default,
      {
        isOpen: activePanelModal === "actions",
        onClose: () => setActivePanelModal(null),
        title: "H\xE0nh \u0110\u1ED9ng C\u1EE7a B\u1EA1n",
        children: [
          /* @__PURE__ */ jsx8(
            ActionPanelContent,
            {
              choices: gameState.currentChoices,
              onChooseAction: (action) => {
                handleAction(action);
                setActivePanelModal(null);
              },
              isLoadingAI,
              isRoleplayModeActive: gameState.isRoleplayModeActive,
              isAuthorInterventionModeActive: gameState.isAuthorInterventionModeActive,
              toggleRoleplayMode,
              toggleAuthorInterventionMode,
              isMobile: true
            }
          ),
          isLoadingAI && gameState.isInitialStoryGenerated && /* @__PURE__ */ jsxs6("div", { className: "flex-shrink-0 p-2 bg-slate-200/80 dark:bg-slate-700/80 text-center text-xs font-semibold mt-2 rounded", children: [
            /* @__PURE__ */ jsx8("i", { className: "fas fa-spinner fa-spin mr-2" }),
            "AI \u0111ang x\u1EED l\xFD..."
          ] })
        ]
      }
    ),
    tooltip && /* @__PURE__ */ jsxs6(
      "div",
      {
        ref: tooltipElementRef,
        id: "keyword-tooltip",
        role: "tooltip",
        className: "fixed z-[250] p-2 text-xs text-white bg-slate-800/90 dark:bg-slate-900/95 rounded-md shadow-xl max-w-xs transition-opacity duration-100 backdrop-blur-sm animate-tooltipFadeIn",
        style: {
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          transform: `translate(-50%, -100%) translateY(-8px)`,
          opacity: 1
        },
        onMouseEnter: () => {
          if (hideTooltipTimeoutRef.current) clearTimeout(hideTooltipTimeoutRef.current);
        },
        onMouseLeave: handleKeywordMouseLeave,
        children: [
          tooltip.content,
          /* @__PURE__ */ jsx8(
            "div",
            {
              className: "absolute left-1/2 bottom-0 w-2 h-2 bg-slate-800/90 dark:bg-slate-900/95 transform -translate-x-1/2 translate-y-1/2 rotate-45"
            }
          )
        ]
      }
    )
  ] });
};

// components/modals/ApiSettingsModal.tsx
import { useState as useState5, useEffect as useEffect6 } from "react";

// components/Input.tsx
import React9 from "react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var Input = React9.memo(({ label, id, error, className = "", wrapperClass = "", leftIcon, rightIcon, ...props }) => {
  const baseStyle = `block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none sm:text-sm 
                     transition-colors duration-200 ease-in-out bg-transparent`;
  const normalStyle = `border-gray-300 dark:border-gray-600 
                       text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-primary/60 focus:border-primary 
                       dark:focus:ring-primary-light/60 dark:focus:border-primary-light 
                       placeholder-gray-400 dark:placeholder-gray-500`;
  const errorStyle = `border-red-500 text-red-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                      placeholder-red-400 dark:placeholder-red-500`;
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);
  return /* @__PURE__ */ jsxs7("div", { className: `mb-4 ${wrapperClass}`, children: [
    label && /* @__PURE__ */ jsx9("label", { htmlFor: id, className: "block text-sm font-medium text-text-light dark:text-text-dark mb-1.5", children: label }),
    /* @__PURE__ */ jsxs7("div", { className: "relative", children: [
      hasLeftIcon && /* @__PURE__ */ jsx9("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500", children: leftIcon }),
      /* @__PURE__ */ jsx9(
        "input",
        {
          id,
          className: `${baseStyle} ${error ? errorStyle : normalStyle} ${hasLeftIcon ? "pl-10" : ""} ${hasRightIcon ? "pr-10" : ""} ${className}`,
          ...props
        }
      ),
      hasRightIcon && /* @__PURE__ */ jsx9("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500", children: rightIcon })
    ] }),
    error && /* @__PURE__ */ jsx9("p", { className: "mt-1.5 text-xs text-red-500 dark:text-red-400", children: error })
  ] });
});
var Input_default = Input;

// components/Checkbox.tsx
import React10 from "react";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
var Checkbox = React10.memo(({ label, id, checked, onChange, className = "", wrapperClass = "", description, ...props }) => {
  return /* @__PURE__ */ jsx10("div", { className: `mb-3 ${wrapperClass}`, children: /* @__PURE__ */ jsxs8("div", { className: "flex items-start", children: [
    /* @__PURE__ */ jsx10("div", { className: "flex items-center h-5 mt-0.5", children: /* @__PURE__ */ jsx10(
      "input",
      {
        id,
        type: "checkbox",
        checked,
        onChange,
        className: `h-5 w-5 text-primary dark:text-primary-light border-gray-300 dark:border-gray-600 rounded 
                        focus:ring-2 focus:ring-offset-0 focus:ring-primary dark:focus:ring-primary-light 
                        transition duration-150 ease-in-out cursor-pointer ${className}`,
        ...props
      }
    ) }),
    /* @__PURE__ */ jsxs8("div", { className: "ml-2.5 text-sm", children: [
      /* @__PURE__ */ jsx10("label", { htmlFor: id, className: "font-medium text-text-light dark:text-text-dark cursor-pointer", children: label }),
      description && /* @__PURE__ */ jsx10("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: description })
    ] })
  ] }) });
});
var Checkbox_default = Checkbox;

// components/modals/ApiSettingsModal.tsx
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var ApiSettingsModal = ({ onClose }) => {
  const { settings, setSettings, userApiKey, setUserApiKey, validateAndSaveApiKey } = useSettings();
  const [currentApiKey, setCurrentApiKey] = useState5(userApiKey);
  const [isTestingKey, setIsTestingKey] = useState5(false);
  const [testStatus, setTestStatus] = useState5("idle");
  useEffect6(() => {
    setCurrentApiKey(userApiKey);
  }, [userApiKey]);
  const handleTestAndSaveKey = async () => {
    if (settings.useDefaultAPI) {
      onClose();
      return;
    }
    if (!currentApiKey.trim()) {
      setTestStatus("error");
      setSettings((s) => ({ ...s, apiKeyStatus: "invalid" }));
      return;
    }
    setIsTestingKey(true);
    setTestStatus("idle");
    const isValid = await validateApiKey(currentApiKey);
    if (isValid) {
      await validateAndSaveApiKey(currentApiKey);
      setTestStatus("success");
      setTimeout(onClose, 1200);
    } else {
      setTestStatus("error");
      setSettings((s) => ({ ...s, apiKeyStatus: "invalid" }));
    }
    setIsTestingKey(false);
  };
  const handleUseDefaultToggle = (useDefault) => {
    setSettings((prev) => ({ ...prev, useDefaultAPI: useDefault, apiKeyStatus: useDefault ? "default" : userApiKey ? prev.apiKeyStatus : "unknown" }));
    if (useDefault) {
      setTestStatus("idle");
      setCurrentApiKey("");
    }
  };
  return /* @__PURE__ */ jsxs9(Modal_default, { isOpen: true, onClose, title: "Thi\u1EBFt L\u1EADp API Key Gemini", children: [
    /* @__PURE__ */ jsxs9("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsx11("div", { className: `p-4 rounded-lg border transition-all duration-200 ease-in-out ${settings.useDefaultAPI ? "bg-primary/10 border-primary/50 dark:bg-primary-dark/20 dark:border-primary-dark/60" : "bg-slate-50 dark:bg-slate-800/30 border-border-light dark:border-border-dark"}`, children: /* @__PURE__ */ jsx11(
        Checkbox_default,
        {
          label: "S\u1EED d\u1EE5ng API Key m\u1EB7c \u0111\u1ECBnh c\u1EE7a \u1EE9ng d\u1EE5ng",
          description: "Gemini Flash, kh\xF4ng gi\u1EDBi h\u1EA1n. Khuy\u1EBFn ngh\u1ECB cho ng\u01B0\u1EDDi m\u1EDBi.",
          checked: settings.useDefaultAPI,
          onChange: (e) => handleUseDefaultToggle(e.target.checked)
        }
      ) }),
      /* @__PURE__ */ jsxs9("div", { className: `transition-all duration-300 ease-in-out ${settings.useDefaultAPI ? "opacity-50 max-h-0 overflow-hidden pointer-events-none" : "opacity-100 max-h-[500px]"}`, children: [
        /* @__PURE__ */ jsx11("h4", { className: "text-sm font-medium text-text-light dark:text-text-dark mb-2", children: "Ho\u1EB7c s\u1EED d\u1EE5ng API Key Gemini c\u1EE7a ri\xEAng b\u1EA1n:" }),
        /* @__PURE__ */ jsx11(
          Input_default,
          {
            label: "API Key Gemini:",
            type: "password",
            value: currentApiKey,
            onChange: (e) => {
              setCurrentApiKey(e.target.value);
              setTestStatus("idle");
              if (settings.apiKeyStatus !== "unknown" && settings.apiKeyStatus !== "default") {
                setSettings((s) => ({ ...s, apiKeyStatus: "unknown" }));
              }
            },
            placeholder: "D\xE1n API Key c\u1EE7a b\u1EA1n t\u1EA1i \u0111\xE2y (v\xED d\u1EE5: AIza...)",
            disabled: isTestingKey || settings.useDefaultAPI,
            leftIcon: /* @__PURE__ */ jsx11("i", { className: "fas fa-key text-gray-400" })
          }
        ),
        testStatus === "success" && /* @__PURE__ */ jsxs9("p", { className: "text-sm text-green-600 dark:text-green-400 mt-1", children: [
          /* @__PURE__ */ jsx11("i", { className: "fas fa-check-circle mr-1" }),
          "Key h\u1EE3p l\u1EC7 v\xE0 \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u!"
        ] }),
        testStatus === "error" && /* @__PURE__ */ jsxs9("p", { className: "text-sm text-red-600 dark:text-red-400 mt-1", children: [
          /* @__PURE__ */ jsx11("i", { className: "fas fa-times-circle mr-1" }),
          "Key kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c c\xF3 l\u1ED7i. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i."
        ] }),
        settings.apiKeyStatus === "valid" && !currentApiKey && !settings.useDefaultAPI && testStatus === "idle" && /* @__PURE__ */ jsxs9("p", { className: "text-sm text-yellow-600 dark:text-yellow-400 mt-1", children: [
          /* @__PURE__ */ jsx11("i", { className: "fas fa-exclamation-triangle mr-1" }),
          "B\u1EA1n \u0111\xE3 x\xF3a API key \u0111\xE3 l\u01B0u. Nh\u1EADp key m\u1EDBi ho\u1EB7c ch\u1ECDn s\u1EED d\u1EE5ng key m\u1EB7c \u0111\u1ECBnh."
        ] }),
        /* @__PURE__ */ jsxs9("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: [
          "L\u1EA5y API Key c\u1EE7a b\u1EA1n t\u1EA1i: ",
          /* @__PURE__ */ jsx11("a", { href: GEMINI_API_KEY_URL, target: "_blank", rel: "noopener noreferrer", className: "text-primary hover:underline font-medium", children: GEMINI_API_KEY_URL })
        ] })
      ] }),
      settings.useDefaultAPI && /* @__PURE__ */ jsx11("div", { className: "p-3 bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700/60 rounded-lg", children: /* @__PURE__ */ jsxs9("p", { className: "text-sm text-green-700 dark:text-green-200", children: [
        /* @__PURE__ */ jsx11("i", { className: "fas fa-info-circle mr-1.5" }),
        "API Key m\u1EB7c \u0111\u1ECBnh \u0111ang \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng. B\u1EA1n kh\xF4ng c\u1EA7n nh\u1EADp key ri\xEAng."
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "mt-8 flex justify-end space-x-3", children: [
      /* @__PURE__ */ jsx11(Button_default, { variant: "outline", onClick: onClose, size: "md", children: "H\u1EE7y" }),
      /* @__PURE__ */ jsx11(
        Button_default,
        {
          onClick: handleTestAndSaveKey,
          isLoading: isTestingKey,
          disabled: isTestingKey || !settings.useDefaultAPI && !currentApiKey.trim(),
          size: "md",
          variant: "primary",
          children: settings.useDefaultAPI ? "L\u01B0u & \u0110\xF3ng" : isTestingKey ? "\u0110ang ki\u1EC3m tra..." : "Ki\u1EC3m tra & L\u01B0u Key"
        }
      )
    ] })
  ] });
};
var ApiSettingsModal_default = ApiSettingsModal;

// components/modals/NsfwSettingsModal.tsx
import { useState as useState6 } from "react";

// components/RadioGroup.tsx
import React12 from "react";
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
var RadioGroup = React12.memo(({ name, options, selectedValue, onChange, label, inline = false, wrapperClass = "" }) => {
  return /* @__PURE__ */ jsxs10("div", { className: `mb-4 ${wrapperClass}`, children: [
    label && /* @__PURE__ */ jsx12("legend", { className: "block text-sm font-medium text-text-light dark:text-text-dark mb-1.5", children: label }),
    /* @__PURE__ */ jsx12("div", { className: `${inline ? "flex flex-wrap items-center gap-x-4 gap-y-2" : "space-y-2"}`, children: options.map((option) => /* @__PURE__ */ jsxs10("div", { className: `flex items-start ${inline ? "" : ""}`, children: [
      /* @__PURE__ */ jsx12("div", { className: "flex items-center h-5 mt-0.5", children: /* @__PURE__ */ jsx12(
        "input",
        {
          id: `${name}-${option.value}`,
          name,
          type: "radio",
          value: option.value,
          checked: selectedValue === option.value,
          onChange: (e) => onChange(e.target.value),
          className: "h-5 w-5 text-primary dark:text-primary-light border-gray-300 dark:border-gray-600 \n                            focus:ring-2 focus:ring-offset-0 focus:ring-primary dark:focus:ring-primary-light \n                            transition duration-150 ease-in-out cursor-pointer"
        }
      ) }),
      /* @__PURE__ */ jsxs10("div", { className: "ml-2.5 text-sm", children: [
        /* @__PURE__ */ jsx12("label", { htmlFor: `${name}-${option.value}`, className: "font-medium text-text-light dark:text-text-dark cursor-pointer", children: option.label }),
        option.description && /* @__PURE__ */ jsx12("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: option.description })
      ] })
    ] }, option.value)) })
  ] });
});
var RadioGroup_default = RadioGroup;

// components/modals/NsfwSettingsModal.tsx
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
var NsfwSettingsModal = ({ onClose }) => {
  const { nsfwSettings, setNsfwSettings } = useSettings();
  const [showWarning, setShowWarning] = useState6(!nsfwSettings.enabled);
  const [tempNsfwPrefs, setTempNsfwPrefs] = useState6({
    ...nsfwSettings,
    customPrompt: nsfwSettings.customPrompt || ""
  });
  const handleSave = () => {
    setNsfwSettings(tempNsfwPrefs);
    onClose();
  };
  const handleAgreeWarning = () => {
    setShowWarning(false);
    if (!tempNsfwPrefs.enabled) {
      setTempNsfwPrefs((prev) => ({
        ...prev,
        enabled: true,
        eroticaLevel: prev.eroticaLevel === "none" ? "medium" : prev.eroticaLevel,
        violenceLevel: prev.violenceLevel === "none" ? "medium" : prev.violenceLevel,
        darkContentLevel: prev.darkContentLevel === "none" ? "medium" : prev.darkContentLevel,
        customPrompt: prev.customPrompt || ""
      }));
    }
  };
  const levelOptions = [
    { value: "none", label: "T\u1EAFt Ho\xE0n To\xE0n", description: "Kh\xF4ng c\xF3 n\u1ED9i dung nh\u1EA1y c\u1EA3m." },
    { value: "medium", label: "Trung B\xECnh", description: "M\xF4 t\u1EA3 g\u1EE3i \xFD, kh\xF4ng \u0111i s\xE2u chi ti\u1EBFt." },
    { value: "high", label: "Cao", description: "M\xF4 t\u1EA3 chi ti\u1EBFt h\u01A1n, c\xF3 th\u1EC3 bao g\u1ED3m h\xE0nh \u0111\u1ED9ng." },
    { value: "extreme", label: "C\u1EF1c \u0110oan", description: "M\xF4 t\u1EA3 r\u1EA5t chi ti\u1EBFt, kh\xF4ng gi\u1EDBi h\u1EA1n (c\u1EA9n tr\u1ECDng khi s\u1EED d\u1EE5ng)." }
  ];
  if (showWarning && !nsfwSettings.enabled) {
    return /* @__PURE__ */ jsxs11(Modal_default, { isOpen: true, onClose, title: "C\u1EA3nh B\xE1o N\u1ED9i Dung Nh\u1EA1y C\u1EA3m", size: "lg", children: [
      /* @__PURE__ */ jsxs11("div", { className: "text-center p-4", children: [
        /* @__PURE__ */ jsx13("i", { className: "fas fa-exclamation-triangle text-5xl text-yellow-500 dark:text-yellow-400 mb-5" }),
        /* @__PURE__ */ jsx13("p", { className: "text-lg font-semibold mb-3 text-text-light dark:text-text-dark", children: "N\u1ED9i dung b\u1EA1n s\u1EAFp t\xF9y ch\u1EC9nh c\xF3 th\u1EC3 kh\xF4ng ph\xF9 h\u1EE3p v\u1EDBi m\u1ECDi l\u1EE9a tu\u1ED5i ho\u1EB7c ch\u1EE9a c\xE1c y\u1EBFu t\u1ED1 nh\u1EA1y c\u1EA3m, g\xE2y kh\xF3 ch\u1ECBu." }),
        /* @__PURE__ */ jsx13("p", { className: "mb-6 text-slate-600 dark:text-slate-300", children: "B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c v\xE0 c\u1EA5u h\xECnh c\xE1c t\xF9y ch\u1ECDn n\u1ED9i dung ng\u01B0\u1EDDi l\u1EDBn (NSFW) kh\xF4ng? H\xE3y c\xE2n nh\u1EAFc k\u1EF9 tr\u01B0\u1EDBc khi quy\u1EBFt \u0111\u1ECBnh." })
      ] }),
      /* @__PURE__ */ jsxs11("div", { className: "mt-6 flex justify-center space-x-4", children: [
        /* @__PURE__ */ jsx13(Button_default, { variant: "outline", onClick: onClose, size: "lg", children: "H\u1EE7y B\u1ECF" }),
        /* @__PURE__ */ jsx13(Button_default, { variant: "danger", onClick: handleAgreeWarning, size: "lg", children: "T\xF4i Hi\u1EC3u & \u0110\u1ED3ng \xDD Ti\u1EBFp T\u1EE5c" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs11(Modal_default, { isOpen: true, onClose, title: "Thi\u1EBFt L\u1EADp Ch\u1EBF \u0110\u1ED9 N\u1ED9i Dung Ng\u01B0\u1EDDi L\u1EDBn (NSFW)", size: "xl", children: [
    /* @__PURE__ */ jsxs11("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx13("div", { className: `p-4 rounded-lg border transition-all duration-200 ease-in-out ${tempNsfwPrefs.enabled ? "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600" : "bg-slate-50 dark:bg-slate-800/30 border-border-light dark:border-border-dark"}`, children: /* @__PURE__ */ jsx13(
        Checkbox_default,
        {
          label: "B\u1EADt Ch\u1EBF \u0110\u1ED9 NSFW T\u1ED5ng Th\u1EC3",
          description: "Cho ph\xE9p AI t\u1EA1o ra n\u1ED9i dung nh\u1EA1y c\u1EA3m khi ph\xF9 h\u1EE3p v\u1EDBi di\u1EC5n bi\u1EBFn truy\u1EC7n.",
          checked: tempNsfwPrefs.enabled,
          onChange: (e) => setTempNsfwPrefs((prev) => ({ ...prev, enabled: e.target.checked }))
        }
      ) }),
      tempNsfwPrefs.enabled && /* @__PURE__ */ jsxs11("div", { className: "space-y-5 pl-2 border-l-2 border-red-300 dark:border-red-600 ml-2", children: [
        /* @__PURE__ */ jsx13(
          RadioGroup_default,
          {
            label: "M\u1EE9c \u0111\u1ED9 Khi\xEAu D\xE2m:",
            name: "eroticaLevel",
            options: levelOptions,
            selectedValue: tempNsfwPrefs.eroticaLevel,
            onChange: (value) => setTempNsfwPrefs((prev) => ({ ...prev, eroticaLevel: value })),
            wrapperClass: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md"
          }
        ),
        /* @__PURE__ */ jsx13(
          RadioGroup_default,
          {
            label: "M\u1EE9c \u0111\u1ED9 B\u1EA1o L\u1EF1c:",
            name: "violenceLevel",
            options: levelOptions,
            selectedValue: tempNsfwPrefs.violenceLevel,
            onChange: (value) => setTempNsfwPrefs((prev) => ({ ...prev, violenceLevel: value })),
            wrapperClass: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md"
          }
        ),
        /* @__PURE__ */ jsx13(
          RadioGroup_default,
          {
            label: "M\u1EE9c \u0111\u1ED9 N\u1ED9i Dung \u0110en T\u1ED1i (Ch\u1EE7 \u0111\u1EC1 nh\u1EA1y c\u1EA3m, t\xE2m l\xFD n\u1EB7ng n\u1EC1):",
            name: "darkContentLevel",
            options: levelOptions,
            selectedValue: tempNsfwPrefs.darkContentLevel,
            onChange: (value) => setTempNsfwPrefs((prev) => ({ ...prev, darkContentLevel: value })),
            wrapperClass: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md"
          }
        ),
        /* @__PURE__ */ jsx13(
          Textarea_default,
          {
            label: "Phong c\xE1ch NSFW t\xF9y ch\u1EC9nh (T\xF9y ch\u1ECDn):",
            value: tempNsfwPrefs.customPrompt || "",
            onChange: (e) => setTempNsfwPrefs((prev) => ({ ...prev, customPrompt: e.target.value })),
            placeholder: "V\xED d\u1EE5: T\u1EADp trung v\xE0o m\xF4 t\u1EA3 chi ti\u1EBFt c\u1EA3m x\xFAc v\xE0 b\u1EA7u kh\xF4ng kh\xED c\u0103ng th\u1EB3ng, s\u1EED d\u1EE5ng ng\xF4n ng\u1EEF g\u1EE3i h\xECnh nh\u01B0ng kh\xF4ng dung t\u1EE5c...",
            rows: 3,
            wrapperClass: "mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md"
          }
        )
      ] }),
      /* @__PURE__ */ jsx13("div", { className: "mt-5 p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg text-yellow-700 dark:text-yellow-200", children: /* @__PURE__ */ jsxs11("p", { className: "text-xs", children: [
        /* @__PURE__ */ jsxs11("strong", { className: "font-semibold", children: [
          /* @__PURE__ */ jsx13("i", { className: "fas fa-exclamation-circle mr-1" }),
          "L\u01B0u \xFD quan tr\u1ECDng:"
        ] }),
        " Vi\u1EC7c b\u1EADt c\xE1c t\xF9y ch\u1ECDn n\xE0y cho ph\xE9p AI t\u1EA1o ra n\u1ED9i dung li\xEAn quan KHI PH\xD9 H\u1EE2P v\u1EDBi di\u1EC5n bi\u1EBFn truy\u1EC7n. AI s\u1EBD kh\xF4ng c\u1ED1 t\xECnh l\xE1i truy\u1EC7n theo h\u01B0\u1EDBng NSFW m\u1ED9t c\xE1ch g\u01B0\u1EE3ng \xE9p. Ch\u1EA5t l\u01B0\u1EE3ng v\xE0 s\u1EF1 ph\xF9 h\u1EE3p c\u1EE7a n\u1ED9i dung NSFW ph\u1EE5 thu\u1ED9c v\xE0o kh\u1EA3 n\u0103ng c\u1EE7a m\xF4 h\xECnh AI v\xE0 c\xF3 th\u1EC3 kh\xF4ng ph\u1EA3i l\xFAc n\xE0o c\u0169ng nh\u01B0 mong \u0111\u1EE3i. S\u1EED d\u1EE5ng c\xF3 tr\xE1ch nhi\u1EC7m."
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "mt-8 flex justify-end space-x-3", children: [
      /* @__PURE__ */ jsx13(Button_default, { variant: "outline", onClick: onClose, size: "lg", children: "H\u1EE7y" }),
      /* @__PURE__ */ jsx13(Button_default, { onClick: handleSave, size: "lg", variant: "primary", children: "L\u01B0u Thi\u1EBFt L\u1EADp NSFW" })
    ] })
  ] });
};
var NsfwSettingsModal_default = NsfwSettingsModal;

// components/modals/GeneralSettingsModal.tsx
import { useState as useState7 } from "react";

// components/Dropdown.tsx
import React14 from "react";
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
var Dropdown = React14.memo(({ label, id, options, error, className = "", wrapperClass = "", ...props }) => {
  const baseStyle = `block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none sm:text-sm 
                     appearance-none bg-no-repeat bg-right 
                     transition-colors duration-200 ease-in-out bg-transparent`;
  const normalStyle = `border-gray-300 dark:border-gray-600 
                       text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-primary/60 focus:border-primary 
                       dark:focus:ring-primary-light/60 dark:focus:border-primary-light
                       placeholder-gray-400 dark:placeholder-gray-500`;
  const errorStyle = `border-red-500 text-red-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                      placeholder-red-400 dark:placeholder-red-500`;
  const customArrow = `bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%2012.586l-4.293-4.293a1%201%200%2010-1.414%201.414l5%205a1%201%200%20001.414%200l5-5a1%201%200%2000-1.414-1.414L10%2012.586z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23f3f4f6%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%2012.586l-4.293-4.293a1%201%200%2010-1.414%201.414l5%205a1%201%200%20001.414%200l5-5a1%201%200%2000-1.414-1.414L10%2012.586z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[center_right_0.75rem] pr-8`;
  return /* @__PURE__ */ jsxs12("div", { className: `mb-4 ${wrapperClass}`, children: [
    label && /* @__PURE__ */ jsx14("label", { htmlFor: id, className: "block text-sm font-medium text-text-light dark:text-text-dark mb-1.5", children: label }),
    /* @__PURE__ */ jsxs12(
      "select",
      {
        id,
        className: `${baseStyle} ${customArrow} ${error ? errorStyle : normalStyle} ${className}`,
        ...props,
        children: [
          props.placeholder && /* @__PURE__ */ jsx14("option", { value: "", disabled: true, className: "text-gray-400 dark:text-gray-500", children: props.placeholder }),
          options.map((option) => /* @__PURE__ */ jsx14("option", { value: option.value, className: "text-text-light dark:text-text-dark bg-card-light dark:bg-card-dark", children: option.label }, option.value))
        ]
      }
    ),
    error && /* @__PURE__ */ jsx14("p", { className: "mt-1.5 text-xs text-red-500 dark:text-red-400", children: error })
  ] });
});
var Dropdown_default = Dropdown;

// components/modals/GeneralSettingsModal.tsx
import { jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
var GeneralSettingsModal = ({ onClose }) => {
  const { settings, setSettings } = useSettings();
  const [tempSettings, setTempSettings] = useState7(settings);
  const handleSave = () => {
    setSettings(tempSettings);
    onClose();
  };
  const themeOptions = [
    { value: "light" /* Light */, label: "S\xE1ng (Light Mode)" },
    { value: "dark" /* Dark */, label: "T\u1ED1i (Dark Mode)" }
  ];
  const languageOptions = [
    { value: "vi", label: "Ti\u1EBFng Vi\u1EC7t (M\u1EB7c \u0111\u1ECBnh)" }
    // { value: 'en', label: 'English (Coming Soon)' }, // Keep disabled for now
  ];
  const fontSizeOptions = [
    { value: 12, label: "Nh\u1ECF (12px)" },
    { value: 14, label: "V\u1EEBa (14px)" },
    { value: 16, label: "M\u1EB7c \u0111\u1ECBnh (16px)" },
    { value: 18, label: "L\u1EDBn (18px)" },
    { value: 20, label: "R\u1EA5t L\u1EDBn (20px)" }
  ];
  return /* @__PURE__ */ jsxs13(Modal_default, { isOpen: true, onClose, title: "C\xE0i \u0110\u1EB7t Chung", size: "lg", children: [
    /* @__PURE__ */ jsxs13("div", { className: "space-y-6 pt-2", children: [
      /* @__PURE__ */ jsx15(
        Dropdown_default,
        {
          label: "Ch\u1EE7 \u0111\u1EC1 giao di\u1EC7n (Theme):",
          options: themeOptions,
          value: tempSettings.theme,
          onChange: (e) => setTempSettings((prev) => ({ ...prev, theme: e.target.value })),
          wrapperClass: "mb-5"
        }
      ),
      /* @__PURE__ */ jsx15(
        Dropdown_default,
        {
          label: "Ng\xF4n ng\u1EEF (Language):",
          options: languageOptions,
          value: tempSettings.language,
          onChange: (e) => setTempSettings((prev) => ({ ...prev, language: e.target.value })),
          disabled: true,
          wrapperClass: "mb-5 opacity-70"
        }
      ),
      /* @__PURE__ */ jsx15(
        Dropdown_default,
        {
          label: "K\xEDch th\u01B0\u1EDBc font ch\u1EEF m\u1EB7c \u0111\u1ECBnh:",
          options: fontSizeOptions,
          value: tempSettings.fontSize.toString(),
          onChange: (e) => setTempSettings((prev) => ({ ...prev, fontSize: parseInt(e.target.value, 10) })),
          wrapperClass: "mb-2"
        }
      ),
      /* @__PURE__ */ jsx15("p", { className: "text-xs text-slate-500 dark:text-slate-400 px-1", children: "Thay \u0111\u1ED5i k\xEDch th\u01B0\u1EDBc font s\u1EBD \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn to\xE0n b\u1ED9 \u1EE9ng d\u1EE5ng. M\u1ED9t s\u1ED1 thay \u0111\u1ED5i c\xF3 th\u1EC3 c\u1EA7n t\u1EA3i l\u1EA1i trang \u0111\u1EC3 \xE1p d\u1EE5ng ho\xE0n to\xE0n." }),
      /* @__PURE__ */ jsx15("hr", { className: "my-5 border-border-light dark:border-border-dark" }),
      /* @__PURE__ */ jsx15("h4", { className: "text-md font-semibold text-text-light dark:text-text-dark -mb-3", children: "H\u1EC7 Th\u1ED1ng Gameplay T\xF9y Ch\u1ECDn:" }),
      /* @__PURE__ */ jsx15(
        Checkbox_default,
        {
          label: "B\u1EADt H\u1EC7 Th\u1ED1ng Ti\u1EC1n T\u1EC7",
          description: "Qu\u1EA3n l\xFD ti\u1EC1n t\u1EC7 trong game (v\xED d\u1EE5: v\xE0ng, linh th\u1EA1ch). AI s\u1EBD t\u1EA1o v\xE0 theo d\xF5i.",
          checked: tempSettings.currencyEnabled,
          onChange: (e) => setTempSettings((prev) => ({ ...prev, currencyEnabled: e.target.checked })),
          wrapperClass: "py-2.5"
        }
      ),
      /* @__PURE__ */ jsx15(
        Checkbox_default,
        {
          label: "B\u1EADt H\u1EC7 Th\u1ED1ng Th\u1EDDi Gian",
          description: "Theo d\xF5i th\u1EDDi gian trong game (ng\xE0y, gi\u1EDD, bu\u1ED5i). AI s\u1EBD c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn h\xE0nh \u0111\u1ED9ng.",
          checked: tempSettings.timeSystemEnabled,
          onChange: (e) => setTempSettings((prev) => ({ ...prev, timeSystemEnabled: e.target.checked })),
          wrapperClass: "py-2.5"
        }
      ),
      /* @__PURE__ */ jsx15(
        Checkbox_default,
        {
          label: "B\u1EADt H\u1EC7 Th\u1ED1ng Danh Ti\u1EBFng (Ng\u1EA7m)",
          description: "AI s\u1EBD ng\u1EA7m theo d\xF5i danh ti\u1EBFng c\u1EE7a b\u1EA1n, \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn c\xE1ch NPC ph\u1EA3n \u1EE9ng v\xE0 di\u1EC5n bi\u1EBFn truy\u1EC7n.",
          checked: tempSettings.reputationSystemEnabled,
          onChange: (e) => setTempSettings((prev) => ({ ...prev, reputationSystemEnabled: e.target.checked })),
          wrapperClass: "py-2.5"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "mt-8 flex justify-end space-x-3", children: [
      /* @__PURE__ */ jsx15(Button_default, { variant: "outline", onClick: onClose, size: "lg", children: "H\u1EE7y" }),
      /* @__PURE__ */ jsx15(Button_default, { onClick: handleSave, size: "lg", variant: "primary", children: "L\u01B0u C\xE0i \u0110\u1EB7t" })
    ] })
  ] });
};
var GeneralSettingsModal_default = GeneralSettingsModal;

// components/modals/GuideModal.tsx
import { jsx as jsx16, jsxs as jsxs14 } from "react/jsx-runtime";
var GuideSection = ({ title, icon, children }) => /* @__PURE__ */ jsxs14("section", { className: "py-3", children: [
  /* @__PURE__ */ jsxs14("h4", { className: "font-semibold text-xl lg:text-2xl border-b border-border-light dark:border-border-dark pb-2 mb-4 text-primary dark:text-primary-light flex items-center", children: [
    /* @__PURE__ */ jsx16("i", { className: `${icon} mr-3 text-2xl opacity-80` }),
    title
  ] }),
  /* @__PURE__ */ jsx16("div", { className: "space-y-3 prose prose-sm sm:prose-base dark:prose-invert max-w-none text-text-light dark:text-text-dark leading-relaxed", children })
] });
var GuideModal = ({ onClose }) => {
  return /* @__PURE__ */ jsxs14(Modal_default, { isOpen: true, onClose, title: "H\u01B0\u1EDBng D\u1EABn S\u1EED D\u1EE5ng Nh\u1EADp Vai A.I Simulator", size: "2xl", containerClass: "custom-scrollbar", children: [
    /* @__PURE__ */ jsxs14("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs14("p", { className: "text-lg text-center text-slate-700 dark:text-slate-300", children: [
        "Ch\xE0o m\u1EEBng b\u1EA1n \u0111\u1EBFn v\u1EDBi ",
        /* @__PURE__ */ jsx16("strong", { children: "Nh\u1EADp Vai A.I Simulator" }),
        "! H\xE3y c\xF9ng kh\xE1m ph\xE1 c\xE1ch t\u1EA1o n\xEAn nh\u1EEFng cu\u1ED9c phi\xEAu l\u01B0u k\u1EF3 th\xFA kh\xF4ng gi\u1EDBi h\u1EA1n:"
      ] }),
      /* @__PURE__ */ jsxs14(GuideSection, { title: "1. Chu\u1EA9n B\u1ECB API Key (R\u1EA5t Quan Tr\u1ECDng!)", icon: "fas fa-key", children: [
        /* @__PURE__ */ jsx16("p", { children: '\u0110\u1EC3 AI c\xF3 th\u1EC3 "th\u1ED5i h\u1ED3n" v\xE0o c\xE2u chuy\u1EC7n, b\u1EA1n c\u1EA7n m\u1ED9t API Key t\u1EEB Google Gemini.' }),
        /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-2 space-y-2", children: [
          /* @__PURE__ */ jsxs14("li", { children: [
            "Tr\xEAn trang ch\u1EE7, ch\u1ECDn ",
            /* @__PURE__ */ jsx16("strong", { className: "text-secondary dark:text-secondary-light", children: '"Thi\u1EBFt L\u1EADp API Key"' }),
            "."
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsx16("strong", { children: "L\u1EF1a ch\u1ECDn t\u1ED1t nh\u1EA5t cho ng\u01B0\u1EDDi m\u1EDBi:" }),
            " \u0110\xE1nh d\u1EA5u v\xE0o \xF4 ",
            /* @__PURE__ */ jsx16("strong", { className: "text-green-600 dark:text-green-400", children: '"S\u1EED d\u1EE5ng API Key m\u1EB7c \u0111\u1ECBnh c\u1EE7a \u1EE9ng d\u1EE5ng"' }),
            '. T\xF9y ch\u1ECDn n\xE0y s\u1EED d\u1EE5ng m\xF4 h\xECnh Gemini Flash m\u1EA1nh m\u1EBD v\xE0 kh\xF4ng gi\u1EDBi h\u1EA1n, do \u1EE9ng d\u1EE5ng cung c\u1EA5p. Nh\u1EA5n "L\u01B0u & \u0110\xF3ng".'
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsx16("strong", { children: "N\u1EBFu b\u1EA1n c\xF3 API Key ri\xEAng:" }),
            " B\u1ECF ch\u1ECDn \xF4 m\u1EB7c \u0111\u1ECBnh, d\xE1n Key c\u1EE7a b\u1EA1n v\xE0o \xF4 nh\u1EADp li\u1EC7u v\xE0 nh\u1EA5n ",
            /* @__PURE__ */ jsx16("strong", { className: "text-blue-600 dark:text-blue-400", children: '"Ki\u1EC3m tra & L\u01B0u Key"' }),
            ". B\u1EA1n c\xF3 th\u1EC3 l\u1EA5y Key t\u1EA1i ",
            /* @__PURE__ */ jsx16("a", { href: GEMINI_API_KEY_URL, target: "_blank", rel: "noopener noreferrer", className: "text-secondary dark:text-secondary-light hover:underline font-medium", children: "Google AI Studio" }),
            "."
          ] }),
          /* @__PURE__ */ jsx16("li", { children: "Key h\u1EE3p l\u1EC7 s\u1EBD \u0111\u01B0\u1EE3c l\u01B0u, v\xE0 b\u1EA1n \u0111\xE3 s\u1EB5n s\xE0ng!" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs14(GuideSection, { title: "2. Kh\u1EDFi T\u1EA1o Cu\u1ED9c Phi\xEAu L\u01B0u M\u1EDBi", icon: "fas fa-feather-alt", children: [
        /* @__PURE__ */ jsxs14("p", { children: [
          "Ch\u1ECDn ",
          /* @__PURE__ */ jsx16("strong", { className: "text-secondary dark:text-secondary-light", children: '"B\u1EAFt \u0110\u1EA7u Kh\u1EDFi T\u1EA1o M\u1EDBi"' }),
          " tr\xEAn trang ch\u1EE7. B\u1EA1n s\u1EBD th\u1EA5y 3 c\xE1ch ch\xEDnh \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u:"
        ] }),
        /* @__PURE__ */ jsxs14("div", { className: "space-y-4 pl-2", children: [
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("h5", { className: "font-semibold text-lg text-purple-600 dark:text-purple-400 flex items-center", children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-dice-d20 mr-2 opacity-80" }),
              "A.I Kh\u1EDFi T\u1EA1o Ng\u1EABu Nhi\xEAn (Nhanh & \u0110\u1ED3 S\u1ED9)"
            ] }),
            /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-5 space-y-1.5 mt-1", children: [
              /* @__PURE__ */ jsxs14("li", { children: [
                "Nh\u1EADp m\u1ED9t ",
                /* @__PURE__ */ jsx16("code", { className: "font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-md text-sm", children: "Ch\u1EE7 \u0111\u1EC1 g\u1EE3i \xFD" }),
                ' (v\xED d\u1EE5: "Ti\xEAn hi\u1EC7p b\xE1o th\xF9", "V\xF5ng du d\u1ECB gi\u1EDBi").'
              ] }),
              /* @__PURE__ */ jsxs14("li", { children: [
                "Th\xEAm m\u1ED9t ",
                /* @__PURE__ */ jsx16("code", { className: "font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-md text-sm", children: "M\xF4 t\u1EA3 ng\u1EAFn" }),
                " v\u1EC1 \xFD t\u01B0\u1EDFng ch\xEDnh c\u1EE7a b\u1EA1n (t\xF9y ch\u1ECDn)."
              ] }),
              /* @__PURE__ */ jsxs14("li", { children: [
                "Ch\u1ECDn ",
                /* @__PURE__ */ jsx16("code", { className: "font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-md text-sm", children: "S\u1ED1 l\u01B0\u1EE3ng th\u1EF1c th\u1EC3" }),
                " AI c\u1EA7n t\u1EA1o (NPC, \u0111\u1ECBa \u0111i\u1EC3m, v\u1EADt ph\u1EA9m...)."
              ] }),
              /* @__PURE__ */ jsxs14("li", { children: [
                "Nh\u1EA5n ",
                /* @__PURE__ */ jsx16("strong", { className: "text-blue-600 dark:text-blue-400", children: '"\u0110\u1EC3 AI Kh\u1EDFi T\u1EA1o To\xE0n B\u1ED9 Th\u1EBF Gi\u1EDBi"' }),
                ". AI s\u1EBD t\u1EA1o ra m\u1ED9t thi\u1EBFt l\u1EADp truy\u1EC7n C\u1EF0C K\u1EF2 chi ti\u1EBFt, \u0111\u1ED3 s\u1ED9 v\u1EDBi th\u1EBF gi\u1EDBi quan r\u1ED9ng l\u1EDBn."
              ] }),
              /* @__PURE__ */ jsx16("li", { children: 'Sau khi AI ho\xE0n t\u1EA5t, h\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 chuy\u1EC3n b\u1EA1n sang tab "Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh" \u0111\u1EC3 b\u1EA1n xem l\u1EA1i v\xE0 s\u1EEDa \u0111\u1ED5i n\u1EBFu mu\u1ED1n.' })
            ] })
          ] }),
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("h5", { className: "font-semibold text-lg text-orange-600 dark:text-orange-400 flex items-center", children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-wand-magic-sparkles mr-2 opacity-80" }),
              "AI Tr\xEDch Xu\u1EA5t T\u1EEB V\u0103n B\u1EA3n (Linh Ho\u1EA1t)"
            ] }),
            /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-5 space-y-1.5 mt-1", children: [
              /* @__PURE__ */ jsx16("li", { children: "D\xE1n ho\u1EB7c vi\u1EBFt m\u1ED9t \u0111o\u1EA1n v\u0103n m\xF4 t\u1EA3 \xFD t\u01B0\u1EDFng t\u1ED5ng th\u1EC3 v\u1EC1 th\u1EBF gi\u1EDBi, nh\xE2n v\u1EADt, v\xE0 c\xE1c y\u1EBFu t\u1ED1 ban \u0111\u1EA7u v\xE0o \xF4 l\u1EDBn." }),
              /* @__PURE__ */ jsxs14("li", { children: [
                "Nh\u1EA5n n\xFAt ",
                /* @__PURE__ */ jsx16("strong", { className: "text-blue-600 dark:text-blue-400", children: '"\u0110\u1EC3 AI Tr\xEDch Xu\u1EA5t Thi\u1EBFt L\u1EADp T\u1EEB M\xF4 T\u1EA3 Tr\xEAn"' }),
                '. AI s\u1EBD c\u1ED1 g\u1EAFng \u0111i\u1EC1n c\xE1c m\u1EE5c trong tab "Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh".'
              ] }),
              /* @__PURE__ */ jsx16("li", { children: 'Ki\u1EC3m tra v\xE0 ch\u1EC9nh s\u1EEDa l\u1EA1i theo \xFD b\u1EA1n trong tab "Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh".' })
            ] })
          ] }),
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("h5", { className: "font-semibold text-lg text-teal-600 dark:text-teal-400 flex items-center", children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-tools mr-2 opacity-80" }),
              "Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh (To\xE0n Quy\u1EC1n Ki\u1EC3m So\xE1t)"
            ] }),
            /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-5 space-y-1.5 mt-1", children: [
              /* @__PURE__ */ jsx16("li", { children: "\u0110\xE2y l\xE0 n\u01A1i b\u1EA1n c\xF3 th\u1EC3 t\u1EF1 tay x\xE2y d\u1EF1ng t\u1EEBng chi ti\u1EBFt ho\u1EB7c tinh ch\u1EC9nh nh\u1EEFng g\xEC AI \u0111\xE3 t\u1EA1o." }),
              /* @__PURE__ */ jsxs14("li", { children: [
                /* @__PURE__ */ jsx16("strong", { children: "B\u01B0\u1EDBc 1: Thi\u1EBFt L\u1EADp Th\u1EBF Gi\u1EDBi:" }),
                " Nh\u1EADp ",
                /* @__PURE__ */ jsx16("em", { children: "Ch\u1EE7 \u0111\u1EC1, B\u1ED1i c\u1EA3nh, Phong c\xE1ch" }),
                ". S\u1EED d\u1EE5ng n\xFAt ",
                /* @__PURE__ */ jsx16("strong", { className: "text-blue-500", children: "AI" }),
                " b\xEAn c\u1EA1nh m\u1ED7i tr\u01B0\u1EDDng \u0111\u1EC3 AI g\u1EE3i \xFD n\u1EBFu b\u1EA1n b\xED \xFD t\u01B0\u1EDFng. ",
                /* @__PURE__ */ jsx16("em", { children: "Prompt N\xE2ng Cao" }),
                " cho ph\xE9p b\u1EA1n th\xEAm c\xE1c quy t\u1EAFc, l\u1ECBch s\u1EED, ho\u1EB7c \u0111\u1EB7c \u0111i\u1EC3m ri\xEAng c\u1EE7a th\u1EBF gi\u1EDBi."
              ] }),
              /* @__PURE__ */ jsxs14("li", { children: [
                /* @__PURE__ */ jsx16("strong", { children: "B\u01B0\u1EDBc 2: Thi\u1EBFt L\u1EADp Nh\xE2n V\u1EADt Ch\xEDnh:" }),
                " T\u01B0\u01A1ng t\u1EF1, nh\u1EADp ",
                /* @__PURE__ */ jsx16("em", { children: "T\xEAn, Gi\u1EDBi t\xEDnh, S\u01A1 l\u01B0\u1EE3c, \u0110\u1EB7c \u0111i\u1EC3m, M\u1EE5c ti\xEAu" }),
                ". N\xFAt ",
                /* @__PURE__ */ jsx16("strong", { className: "text-blue-500", children: "AI" }),
                " c\u0169ng c\xF3 s\u1EB5n."
              ] }),
              /* @__PURE__ */ jsxs14("li", { children: [
                /* @__PURE__ */ jsx16("strong", { children: "B\u01B0\u1EDBc 3: Th\u1EF1c Th\u1EC3 & K\u1EF9 N\u0103ng Ban \u0110\u1EA7u (T\xF9y ch\u1ECDn):" }),
                " Th\xEAm NPC, v\u1EADt ph\u1EA9m, \u0111\u1ECBa \u0111i\u1EC3m, ho\u1EB7c k\u1EF9 n\u0103ng kh\u1EDFi \u0111\u1EA7u \u0111\u1EC3 l\xE0m phong ph\xFA th\xEAm cho c\xE2u chuy\u1EC7n. B\u1EA1n c\xF3 th\u1EC3 th\xEAm th\u1EE7 c\xF4ng ho\u1EB7c d\xF9ng AI g\u1EE3i \xFD."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs14("p", { className: "mt-3 pl-2", children: [
          "Sau khi ho\xE0n t\u1EA5t thi\u1EBFt l\u1EADp (d\xF9 b\u1EB1ng c\xE1ch n\xE0o), \u0111\u1EB7t ",
          /* @__PURE__ */ jsx16("strong", { children: "T\xEAn Cu\u1ED9c Phi\xEAu L\u01B0u" }),
          ' (v\xED d\u1EE5: "H\xE0nh Tr\xECnh Tu Ti\xEAn C\u1EE7a A") v\xE0 nh\u1EA5n ',
          /* @__PURE__ */ jsx16("strong", { className: "text-green-600 dark:text-green-400", children: '"Kh\u1EDFi T\u1EA1o Cu\u1ED9c Phi\xEAu L\u01B0u"' }),
          ". AI s\u1EBD c\u1EA7n m\u1ED9t ch\xFAt th\u1EDDi gian \u0111\u1EC3 t\u1EA1o ra nh\u1EEFng d\xF2ng truy\u1EC7n \u0111\u1EA7u ti\xEAn."
        ] })
      ] }),
      /* @__PURE__ */ jsxs14(GuideSection, { title: "3. Trong Game - Kh\xE1m Ph\xE1 & T\u01B0\u01A1ng T\xE1c", icon: "fas fa-gamepad", children: [
        /* @__PURE__ */ jsxs14("div", { className: "grid md:grid-cols-2 gap-x-8 gap-y-4", children: [
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("h5", { className: "font-semibold text-lg mb-1.5 flex items-center", children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-scroll mr-2 opacity-70" }),
              "Khu V\u1EF1c Ch\xEDnh (B\xEAn Tr\xE1i):"
            ] }),
            /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-2 space-y-1.5", children: [
              /* @__PURE__ */ jsxs14("li", { children: [
                /* @__PURE__ */ jsx16("strong", { children: "N\u1ED9i Dung Truy\u1EC7n:" }),
                " AI s\u1EBD k\u1EC3 chuy\u1EC7n, m\xF4 t\u1EA3 b\u1ED1i c\u1EA3nh, h\xE0nh \u0111\u1ED9ng NPC t\u1EA1i \u0111\xE2y. C\xE1c lo\u1EA1i tin nh\u1EAFn (h\u1EC7 th\u1ED1ng, l\u1EDDi tho\u1EA1i, t\u01B0\u1EDDng thu\u1EADt) s\u1EBD c\xF3 m\xE0u s\u1EAFc v\xE0 \u0111\u1ECBnh d\u1EA1ng kh\xE1c nhau \u0111\u1EC3 d\u1EC5 ph\xE2n bi\u1EC7t."
              ] }),
              /* @__PURE__ */ jsxs14("li", { children: [
                /* @__PURE__ */ jsx16("strong", { children: "T\u01B0\u01A1ng t\xE1c v\u1EDBi t\u1EEB kh\xF3a (Tooltips):" }),
                " Di chu\u1ED9t (ho\u1EB7c ch\u1EA1m v\xE0 gi\u1EEF tr\xEAn di \u0111\u1ED9ng, ho\u1EB7c d\xF9ng ph\xEDm ",
                /* @__PURE__ */ jsx16("kbd", { children: "Tab" }),
                " \u0111\u1EC3 focus v\xE0 ",
                /* @__PURE__ */ jsx16("kbd", { children: "Enter" }),
                "/",
                /* @__PURE__ */ jsx16("kbd", { children: "Space" }),
                ") v\xE0o c\xE1c t\u1EEB \u0111\u01B0\u1EE3c ",
                /* @__PURE__ */ jsx16("strong", { className: "text-primary dark:text-primary-light", children: "\u0111\xE1nh d\u1EA5u m\xE0u" }),
                " (v\xED d\u1EE5: ",
                /* @__PURE__ */ jsx16("span", { className: "text-teal-600 dark:text-teal-400 font-semibold", children: "[NPC:T\xEAn NPC]" }),
                ", ",
                /* @__PURE__ */ jsx16("span", { className: "text-orange-600 dark:text-orange-400 font-semibold", children: "[ITEM:T\xEAn V\u1EADt Ph\u1EA9m]" }),
                ") \u0111\u1EC3 xem th\xF4ng tin chi ti\u1EBFt nhanh ch\xF3ng. Tooltip s\u1EBD t\u1EF1 \u0111\u1ED9ng \u1EA9n khi b\u1EA1n cu\u1ED9n ho\u1EB7c di chu\u1ED9t ra ngo\xE0i."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("h5", { className: "font-semibold text-lg mb-1.5 flex items-center", children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-columns mr-2 opacity-70" }),
              "B\u1EA3ng \u0110i\u1EC1u Khi\u1EC3n (B\xEAn Ph\u1EA3i):"
            ] }),
            /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-2 space-y-1.5", children: [
              /* @__PURE__ */ jsxs14("li", { children: [
                /* @__PURE__ */ jsx16("strong", { children: 'Tab "H\xE0nh \u0110\u1ED9ng":' }),
                /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-4 space-y-1 mt-1", children: [
                  /* @__PURE__ */ jsxs14("li", { children: [
                    "Ch\u1ECDn m\u1ED9t trong c\xE1c ",
                    /* @__PURE__ */ jsx16("em", { children: "L\u1EF1a Ch\u1ECDn Do AI T\u1EA1o" }),
                    " (n\xFAt b\u1EA5m). Di chu\u1ED9t qua \u0111\u1EC3 xem gi\u1EA3i th\xEDch th\xEAm n\u1EBFu c\xF3."
                  ] }),
                  /* @__PURE__ */ jsxs14("li", { children: [
                    "Ho\u1EB7c, ",
                    /* @__PURE__ */ jsx16("em", { children: "Nh\u1EADp H\xE0nh \u0110\u1ED9ng T\xF9y Ch\u1EC9nh" }),
                    ' c\u1EE7a b\u1EA1n v\xE0o \xF4 v\u0103n b\u1EA3n v\xE0 nh\u1EA5n "G\u1EEDi" (ho\u1EB7c Enter).'
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs14("li", { children: [
                /* @__PURE__ */ jsx16("strong", { children: "C\xE1c Tab Kh\xE1c:" }),
                " ",
                /* @__PURE__ */ jsx16("em", { children: "Ch\u1EC9 S\u1ED1, Trang B\u1ECB, Ba L\xF4, Tu Luy\u1EC7n, K\u1EF9 N\u0103ng, Th\xE0nh T\u1EF1u, Quan H\u1EC7" }),
                " gi\xFAp b\u1EA1n theo d\xF5i v\xE0 qu\u1EA3n l\xFD nh\xE2n v\u1EADt. N\u1ED9i dung \u1EDF \u0111\xE2y s\u1EBD t\u1EF1 \u0111\u1ED9ng c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn di\u1EC5n bi\u1EBFn truy\u1EC7n v\xE0 h\xE0nh \u0111\u1ED9ng c\u1EE7a b\u1EA1n."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs14("h5", { className: "font-semibold text-lg mb-1.5 mt-4 flex items-center", children: [
          /* @__PURE__ */ jsx16("i", { className: "fas fa-bars mr-2 opacity-70" }),
          "Thanh Menu \u0110i\u1EC1u Khi\u1EC3n (Ph\xEDa tr\xEAn c\xF9ng):"
        ] }),
        /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-2 space-y-1.5", children: [
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsxs14("strong", { children: [
              "N\xFAt Ch\u1EBF \u0111\u1ED9 ",
              /* @__PURE__ */ jsx16("i", { className: "fas fa-theater-masks" }),
              " Nh\u1EADp Vai/",
              /* @__PURE__ */ jsx16("i", { className: "fas fa-brain" }),
              " AI H\u1ED7 Tr\u1EE3:"
            ] }),
            " Chuy\u1EC3n \u0111\u1ED5i gi\u1EEFa vi\u1EC7c b\u1EA1n t\u1EF1 do nh\u1EADp h\xE0nh \u0111\u1ED9ng ho\u1EB7c AI \u0111\u01B0a ra l\u1EF1a ch\u1ECDn. Trong ch\u1EBF \u0111\u1ED9 Nh\u1EADp Vai, AI s\u1EBD kh\xF4ng t\u1EA1o l\u1EF1a ch\u1ECDn."
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsxs14("strong", { children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-save" }),
              " L\u01B0u:"
            ] }),
            " L\u01B0u ti\u1EBFn tr\xECnh game hi\u1EC7n t\u1EA1i ra file JSON tr\xEAn m\xE1y c\u1EE7a b\u1EA1n."
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsxs14("strong", { children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-book-open" }),
              " B.Khoa:"
            ] }),
            " M\u1EDF B\xE1ch Khoa To\xE0n Th\u01B0, n\u01A1i l\u01B0u tr\u1EEF th\xF4ng tin v\u1EC1 c\xE1c NPC, v\u1EADt ph\u1EA9m, \u0111\u1ECBa \u0111i\u1EC3m... b\u1EA1n \u0111\xE3 kh\xE1m ph\xE1. Th\xF4ng tin n\xE0y \u0111\u01B0\u1EE3c AI t\u1EF1 \u0111\u1ED9ng c\u1EADp nh\u1EADt."
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsxs14("strong", { children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-scroll" }),
              " T.T\u1EAFt:"
            ] }),
            " Xem l\u1EA1i t\xF3m t\u1EAFt c\u1ED1t truy\u1EC7n do AI t\u1EA1o. B\u1EA1n c\xF3 th\u1EC3 y\xEAu c\u1EA7u AI l\xE0m m\u1EDBi t\xF3m t\u1EAFt."
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsxs14("strong", { children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-meteor" }),
              " S.Ki\u1EC7n:"
            ] }),
            " T\u1EF1 t\u1EA1o ho\u1EB7c \u0111\u1EC3 AI t\u1EA1o m\u1ED9t s\u1EF1 ki\u1EC7n th\u1EBF gi\u1EDBi m\u1EDBi (v\xED d\u1EE5: k\u1EF3 ng\u1ED9, tai h\u1ECDa) \u0111\u1EC3 l\xE0m phong ph\xFA th\xEAm c\xE2u chuy\u1EC7n."
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsxs14("strong", { children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-undo" }),
              " H.T\xE1c:"
            ] }),
            " Quay l\u1EA1i h\xE0nh \u0111\u1ED9ng tr\u01B0\u1EDBc \u0111\xF3 (gi\u1EDBi h\u1EA1n 10 l\u1EA7n, h\u1EEFu \xEDch khi ch\u1ECDn nh\u1EA7m ho\u1EB7c mu\u1ED1n th\u1EED h\u01B0\u1EDBng kh\xE1c)."
          ] }),
          /* @__PURE__ */ jsxs14("li", { children: [
            /* @__PURE__ */ jsxs14("strong", { children: [
              /* @__PURE__ */ jsx16("i", { className: "fas fa-door-open" }),
              " Tho\xE1t:"
            ] }),
            " K\u1EBFt th\xFAc phi\xEAn ch\u01A1i hi\u1EC7n t\u1EA1i v\xE0 quay v\u1EC1 trang ch\u1EE7."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx16(GuideSection, { title: "4. C\xE1c Ch\u1EE9c N\u0103ng Kh\xE1c Tr\xEAn Trang Ch\u1EE7", icon: "fas fa-home", children: /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-2 space-y-1.5", children: [
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsxs14("strong", { children: [
            /* @__PURE__ */ jsx16("i", { className: "fas fa-upload mr-1" }),
            " T\u1EA3i Truy\u1EC7n \u0110\xE3 L\u01B0u:"
          ] }),
          " Ti\u1EBFp t\u1EE5c c\xE1c cu\u1ED9c phi\xEAu l\u01B0u t\u1EEB file .json \u0111\xE3 l\u01B0u."
        ] }),
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsxs14("strong", { children: [
            /* @__PURE__ */ jsx16("i", { className: "fas fa-fire-alt mr-1" }),
            " Ch\u1EBF \u0110\u1ED9 NSFW:"
          ] }),
          " T\xF9y ch\u1EC9nh m\u1EE9c \u0111\u1ED9 n\u1ED9i dung ng\u01B0\u1EDDi l\u1EDBn (s\u1EED d\u1EE5ng c\xF3 tr\xE1ch nhi\u1EC7m v\xE0 theo quy \u0111\u1ECBnh c\u1EE7a Google Gemini)."
        ] }),
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsxs14("strong", { children: [
            /* @__PURE__ */ jsx16("i", { className: "fas fa-cogs mr-1" }),
            " C\xE0i \u0110\u1EB7t Chung:"
          ] }),
          " Thay \u0111\u1ED5i giao di\u1EC7n S\xE1ng/T\u1ED1i, k\xEDch th\u01B0\u1EDBc ch\u1EEF."
        ] })
      ] }) }),
      /* @__PURE__ */ jsx16(GuideSection, { title: "M\u1EB9o Nh\u1ECF Cho \u0110\u1EA1i Hi\u1EC7p", icon: "fas fa-lightbulb", children: /* @__PURE__ */ jsxs14("ul", { className: "list-disc list-inside ml-2 space-y-1.5", children: [
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsx16("strong", { children: "S\xE1ng t\u1EA1o kh\xF4ng gi\u1EDBi h\u1EA1n:" }),
          ' \u0110\u1EEBng ng\u1EA1i th\u1EED nh\u1EEFng h\xE0nh \u0111\u1ED9ng "\u0111i\xEAn r\u1ED3" ho\u1EB7c kh\xE1c bi\u1EC7t. AI r\u1EA5t gi\u1ECFi trong vi\u1EC7c \u1EE9ng bi\u1EBFn!'
        ] }),
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsx16("strong", { children: "M\xF4 t\u1EA3 chi ti\u1EBFt:" }),
          " Khi nh\u1EADp h\xE0nh \u0111\u1ED9ng t\xF9y ch\u1EC9nh, c\xE0ng chi ti\u1EBFt, AI c\xE0ng d\u1EC5 hi\u1EC3u v\xE0 ph\u1EA3n h\u1ED3i t\u1ED1t h\u01A1n."
        ] }),
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsx16("strong", { children: 'N\u1EBFu AI "b\xED" ho\u1EB7c l\u1EB7p l\u1EA1i:' }),
          ' Th\u1EED m\u1ED9t h\xE0nh \u0111\u1ED9ng kh\xE1c, \u0111\u01A1n gi\u1EA3n h\u01A1n, ho\u1EB7c d\xF9ng ch\u1EE9c n\u0103ng "Ho\xE0n T\xE1c" v\xE0 ch\u1ECDn m\u1ED9t l\u1EF1a ch\u1ECDn kh\xE1c. \u0110\xF4i khi, vi\u1EC7c t\u1EA1o m\u1ED9t "S\u1EF1 Ki\u1EC7n Th\u1EBF Gi\u1EDBi" m\u1EDBi c\u0169ng c\xF3 th\u1EC3 gi\xFAp thay \u0111\u1ED5i m\u1EA1ch truy\u1EC7n.'
        ] }),
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsx16("strong", { children: "Kh\xE1m ph\xE1 c\xE1c tab:" }),
          " Th\u01B0\u1EDDng xuy\xEAn ki\u1EC3m tra ch\u1EC9 s\u1ED1, v\u1EADt ph\u1EA9m, k\u1EF9 n\u0103ng \u0111\u1EC3 \u0111\u01B0a ra quy\u1EBFt \u0111\u1ECBnh t\u1ED1t nh\u1EA5t. C\xE1c ch\u1EC9 s\u1ED1 n\xE0y th\u1EF1c s\u1EF1 \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn c\xE1ch AI x\xE2y d\u1EF1ng c\xE2u chuy\u1EC7n v\xE0 k\u1EBFt qu\u1EA3 h\xE0nh \u0111\u1ED9ng c\u1EE7a b\u1EA1n."
        ] }),
        /* @__PURE__ */ jsxs14("li", { children: [
          /* @__PURE__ */ jsx16("strong", { children: "L\u01B0u game th\u01B0\u1EDDng xuy\xEAn:" }),
          " \u0110\u1EB7c bi\u1EC7t l\xE0 tr\u01B0\u1EDBc nh\u1EEFng quy\u1EBFt \u0111\u1ECBnh quan tr\u1ECDng!"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx16("p", { className: "mt-8 text-center text-lg font-semibold text-primary dark:text-primary-light", children: "Ch\xFAc b\u1EA1n c\xF3 nh\u1EEFng cu\u1ED9c phi\xEAu l\u01B0u nh\u1EADp vai \u0111\u1EA7y k\u1EF3 th\xFA v\xE0 s\u1EA3ng v\u0103n!" })
    ] }),
    /* @__PURE__ */ jsx16("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsxs14(Button_default, { onClick: onClose, size: "lg", variant: "primary", className: "px-8 py-3", children: [
      /* @__PURE__ */ jsx16("i", { className: "fas fa-play-circle mr-2" }),
      "\u0110\xE3 Hi\u1EC3u, B\u1EAFt \u0110\u1EA7u Th\xF4i!"
    ] }) })
  ] });
};
var GuideModal_default = GuideModal;

// components/modals/NewStorySetupModal.tsx
import { useState as useState8, useCallback as useCallback3 } from "react";
import { Fragment as Fragment4, jsx as jsx17, jsxs as jsxs15 } from "react/jsx-runtime";
var generateId = (prefix, name) => {
  const randomPart = Math.random().toString(36).substring(2, 7);
  if (name) {
    const namePart = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").substring(0, 15);
    return `${prefix}-${namePart}-${randomPart}`;
  }
  return `${prefix}-${Date.now()}-${randomPart}`;
};
var NewStorySetupModal = ({ onClose, onStartStory }) => {
  const { settings } = useSettings();
  const { addToast } = usePublicToast();
  const [isLoadingAI, setIsLoadingAI] = useState8(false);
  const [activeSetupMode, setActiveSetupMode] = useState8("manualTabs");
  const [currentManualStep, setCurrentManualStep] = useState8(1);
  const [setupName, setSetupName] = useState8(`Thi\u1EBFt l\u1EADp ${(/* @__PURE__ */ new Date()).toLocaleDateString()} ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`);
  const [world, setWorld] = useState8({ theme: "", context: "", tone: "K\u1EF3 \u1EA3o" /* Fantasy */, advancedPrompt: "" });
  const [character, setCharacter] = useState8({ name: "", gender: "AI quy\u1EBFt \u0111\u1ECBnh" /* AIDecides */, summary: "", traits: [], goal: "", initialSkills: [] });
  const [entities, setEntities] = useState8([]);
  const [newEntity, setNewEntity] = useState8({ type: "NPC" /* NPC */, name: "", description: "" });
  const [newSkill, setNewSkill] = useState8({ name: "", description: "", category: "kh\xE1c", proficiency: "S\u01A1 Nh\u1EADp M\xF4n", xp: 0, xpToNextLevel: 100 });
  const [aiSuggestions, setAiSuggestions] = useState8([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState8(null);
  const [bulkEntityText, setBulkEntityText] = useState8("");
  const [selectedEntityForViewing, setSelectedEntityForViewing] = useState8(null);
  const [fullSetupText, setFullSetupText] = useState8("");
  const [aiRandomParams, setAiRandomParams] = useState8({
    userTheme: "",
    userDescription: "",
    numEntities: 5
  });
  const getApiKey = useCallback3(() => {
    return settings.useDefaultAPI ? process.env.API_KEY || "" : localStorage.getItem(LOCAL_STORAGE_API_KEY) || "";
  }, [settings.useDefaultAPI]);
  const handleAIGenerate = async (fieldType, currentContext) => {
    setIsLoadingAI(true);
    setActiveSuggestionField(fieldType);
    setAiSuggestions([]);
    try {
      const apiKey = getApiKey();
      const result = await generateRandomWithAI(apiKey, settings.useDefaultAPI, fieldType, currentContext);
      if (fieldType === "traitSuggestion") {
        const traitObjects = result;
        if (Array.isArray(traitObjects)) {
          const suggestions = traitObjects.map((item) => item.name ? `${item.name} - ${item.description}` : JSON.stringify(item));
          setAiSuggestions(suggestions);
        }
      } else if (fieldType === "skillSuggestion") {
        const skillObject = result;
        if (skillObject && skillObject.name) {
          setNewSkill((prev) => ({
            ...prev,
            name: skillObject.name || "",
            description: skillObject.description || "",
            category: skillObject.category || "kh\xE1c",
            icon: skillObject.icon || prev.icon,
            id: skillObject.id || prev.id || generateId("skill", skillObject.name)
          }));
          addToast({ message: `AI g\u1EE3i \xFD k\u1EF9 n\u0103ng: ${skillObject.name}`, type: "info" });
        }
      } else if (Array.isArray(result)) {
        setAiSuggestions(result);
      } else if (typeof result === "string") {
        if (fieldType === "charSummary") setCharacter((c) => ({ ...c, summary: result }));
        else if (fieldType === "entitySuggestion") {
          try {
            const parsedEntity = JSON.parse(result);
            setNewEntity((e) => ({ ...e, name: parsedEntity.name, description: parsedEntity.description }));
          } catch (e) {
            console.error("Error parsing entity suggestion", e);
            addToast({ message: "L\u1ED7i khi ph\xE2n t\xEDch g\u1EE3i \xFD th\u1EF1c th\u1EC3 t\u1EEB AI.", type: "error" });
          }
        } else setAiSuggestions([result]);
      }
    } catch (error) {
      console.error(`Error generating ${fieldType}:`, error);
      addToast({ message: `L\u1ED7i t\u1EA1o g\u1EE3i \xFD cho ${fieldType}: ${error instanceof Error ? error.message : "Kh\xF4ng th\u1EC3 t\u1EA1o g\u1EE3i \xFD"}`, type: "error" });
      setAiSuggestions([`L\u1ED7i: ${error instanceof Error ? error.message : "Kh\xF4ng th\u1EC3 t\u1EA1o g\u1EE3i \xFD"}`]);
    } finally {
      setIsLoadingAI(false);
    }
  };
  const applySuggestion = (suggestion, fieldType) => {
    if (!fieldType) return;
    switch (fieldType) {
      case "theme":
        setWorld((w) => ({ ...w, theme: suggestion }));
        break;
      case "context":
        setWorld((w) => ({ ...w, context: suggestion }));
        break;
      case "tone":
        setWorld((w) => ({ ...w, tone: suggestion }));
        break;
      case "charName":
        setCharacter((c) => ({ ...c, name: suggestion }));
        break;
      case "charGoal":
        setCharacter((c) => ({ ...c, goal: suggestion }));
        break;
    }
    setAiSuggestions([]);
    setActiveSuggestionField(null);
  };
  const addTrait = () => {
    setCharacter((c) => ({ ...c, traits: [...c.traits, { id: generateId("trait"), name: "", description: "" }] }));
  };
  const updateTrait = (index, field, value) => {
    setCharacter((c) => ({ ...c, traits: c.traits.map((t, i) => i === index ? { ...t, [field]: value } : t) }));
  };
  const removeTrait = (index) => {
    setCharacter((c) => ({ ...c, traits: c.traits.filter((_, i) => i !== index) }));
  };
  const handleAIGenerateTrait = async () => {
    setIsLoadingAI(true);
    setActiveSuggestionField("traitSuggestion");
    try {
      const apiKey = getApiKey();
      const result = await generateRandomWithAI(apiKey, settings.useDefaultAPI, "traitSuggestion", {
        charName: character.name,
        charSummary: character.summary,
        worldTheme: world.theme
      });
      const suggestedTraits = result;
      if (Array.isArray(suggestedTraits) && suggestedTraits.length > 0) {
        const suggestedTrait = suggestedTraits[0];
        if (suggestedTrait && typeof suggestedTrait === "object" && suggestedTrait.name && suggestedTrait.description) {
          setCharacter((c) => ({ ...c, traits: [...c.traits, { id: generateId("trait", suggestedTrait.name), name: suggestedTrait.name, description: suggestedTrait.description }] }));
          addToast({ message: `\u0110\xE3 th\xEAm g\u1EE3i \xFD \u0111\u1EB7c \u0111i\u1EC3m: ${suggestedTrait.name}`, type: "success" });
        } else {
          console.warn("Suggested trait format incorrect:", suggestedTrait);
          addToast({ message: "\u0110\u1ECBnh d\u1EA1ng \u0111\u1EB7c \u0111i\u1EC3m g\u1EE3i \xFD kh\xF4ng \u0111\xFAng.", type: "warning" });
        }
      } else {
        addToast({ message: "AI kh\xF4ng t\xECm th\u1EA5y g\u1EE3i \xFD \u0111\u1EB7c \u0111i\u1EC3m n\xE0o.", type: "info" });
      }
    } catch (error) {
      console.error("Error generating trait:", error);
      addToast({ message: `L\u1ED7i t\u1EA1o \u0111\u1EB7c \u0111i\u1EC3m: ${error instanceof Error ? error.message : "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"}`, type: "error" });
    } finally {
      setIsLoadingAI(false);
      setActiveSuggestionField(null);
    }
  };
  const addEntity = () => {
    if (newEntity.name && newEntity.description && newEntity.type) {
      setEntities((es) => [...es, { ...newEntity, id: generateId("entity", newEntity.name) }]);
      setNewEntity({ type: "NPC" /* NPC */, name: "", description: "" });
      addToast({ message: `\u0110\xE3 th\xEAm th\u1EF1c th\u1EC3: ${newEntity.name}`, type: "success" });
    } else {
      addToast({ message: "Vui l\xF2ng nh\u1EADp \u0111\u1EE7 T\xEAn, M\xF4 t\u1EA3 v\xE0 Lo\u1EA1i cho th\u1EF1c th\u1EC3.", type: "warning" });
    }
  };
  const removeEntity = (id) => {
    const entityToRemove = entities.find((e) => e.id === id);
    setEntities((es) => es.filter((e) => e.id !== id));
    if (selectedEntityForViewing?.id === id) {
      setSelectedEntityForViewing(null);
    }
    if (entityToRemove) {
      addToast({ message: `\u0110\xE3 x\xF3a th\u1EF1c th\u1EC3: ${entityToRemove.name}`, type: "info" });
    }
  };
  const handleBulkAddEntities = async () => {
    if (!bulkEntityText.trim()) {
      addToast({ message: "Vui l\xF2ng nh\u1EADp v\u0103n b\u1EA3n \u0111\u1EC3 AI ph\xE2n t\xEDch.", type: "warning" });
      return;
    }
    setIsLoadingAI(true);
    setActiveSuggestionField("bulkEntities");
    try {
      const apiKey = getApiKey();
      const extractedEntities = await generateEntitiesFromText(apiKey, settings.useDefaultAPI, bulkEntityText, world.theme);
      if (extractedEntities && extractedEntities.length > 0) {
        const newEntitiesToAdd = extractedEntities.map((e) => ({
          ...e,
          id: generateId("entity", e.name)
        }));
        setEntities((prev) => [...prev, ...newEntitiesToAdd]);
        setBulkEntityText("");
        addToast({ message: `${newEntitiesToAdd.length} th\u1EF1c th\u1EC3 \u0111\xE3 \u0111\u01B0\u1EE3c th\xEAm t\u1EEB v\u0103n b\u1EA3n.`, type: "success" });
      } else {
        addToast({ message: "Kh\xF4ng t\xECm th\u1EA5y th\u1EF1c th\u1EC3 n\xE0o trong v\u0103n b\u1EA3n ho\u1EB7c c\xF3 l\u1ED7i x\u1EA3y ra.", type: "info" });
      }
    } catch (error) {
      console.error("Error processing bulk entities:", error);
      addToast({ message: `L\u1ED7i khi x\u1EED l\xFD th\u1EF1c th\u1EC3 t\u1EEB v\u0103n b\u1EA3n: ${error instanceof Error ? error.message : "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"}`, type: "error" });
    } finally {
      setIsLoadingAI(false);
      setActiveSuggestionField(null);
    }
  };
  const addSkill = () => {
    if (newSkill.name && newSkill.description) {
      const skillToAdd = {
        id: newSkill.id || generateId("skill", newSkill.name),
        name: newSkill.name,
        description: newSkill.description,
        icon: newSkill.icon || "fas fa-star",
        category: newSkill.category || "kh\xE1c",
        proficiency: newSkill.proficiency || "S\u01A1 Nh\u1EADp M\xF4n",
        xp: newSkill.xp || 0,
        xpToNextLevel: newSkill.xpToNextLevel || 100,
        effects: newSkill.effects || []
      };
      setCharacter((c) => ({ ...c, initialSkills: [...c.initialSkills || [], skillToAdd] }));
      setNewSkill({ name: "", description: "", category: "kh\xE1c", proficiency: "S\u01A1 Nh\u1EADp M\xF4n", xp: 0, xpToNextLevel: 100 });
      addToast({ message: `\u0110\xE3 th\xEAm k\u1EF9 n\u0103ng: ${skillToAdd.name}`, type: "success" });
    } else {
      addToast({ message: "Vui l\xF2ng nh\u1EADp T\xEAn v\xE0 M\xF4 t\u1EA3 cho k\u1EF9 n\u0103ng.", type: "warning" });
    }
  };
  const removeSkill = (id) => {
    const skillToRemove = character.initialSkills?.find((s) => s.id === id);
    setCharacter((c) => ({ ...c, initialSkills: (c.initialSkills || []).filter((s) => s.id !== id) }));
    if (skillToRemove) {
      addToast({ message: `\u0110\xE3 x\xF3a k\u1EF9 n\u0103ng: ${skillToRemove.name}`, type: "info" });
    }
  };
  const parseRawTraits = (rawTraits) => {
    if (!rawTraits) return [];
    return rawTraits.map((rt) => {
      const parts = rt.split(/: (.+)/s);
      const name = parts[0]?.trim();
      const description = parts[1]?.trim();
      return { id: generateId("trait", name), name: name || "\u0110\u1EB7c \u0111i\u1EC3m kh\xF4ng t\xEAn", description: description || "Ch\u01B0a c\xF3 m\xF4 t\u1EA3" };
    }).filter((t) => t.name !== "\u0110\u1EB7c \u0111i\u1EC3m kh\xF4ng t\xEAn");
  };
  const parseRawSkills = (rawSkills) => {
    if (!rawSkills) return [];
    return rawSkills.map((rs) => {
      const mainParts = rs.split(/: (.+)/s);
      const name = mainParts[0]?.trim();
      let descriptionAndMeta = mainParts[1]?.trim() || "";
      let description = descriptionAndMeta;
      let category = "kh\xE1c";
      let icon = "fas fa-book-sparkles";
      const metaMatch = descriptionAndMeta.match(/\(([^)]+)\)$/);
      if (metaMatch && metaMatch[1]) {
        const metaContent = metaMatch[1];
        description = descriptionAndMeta.substring(0, metaMatch.index).trim();
        const categoryMatch = metaContent.match(/Loại:\s*([^,)]+)/i);
        if (categoryMatch && categoryMatch[1]) {
          const parsedCategory = categoryMatch[1].trim().toLowerCase();
          if (["chi\u1EBFn \u0111\u1EA5u", "ch\u1EBF t\u1EA1o", "sinh t\u1ED3n", "ph\xE9p thu\u1EADt", "h\u1ED7 tr\u1EE3", "kh\xE1c"].includes(parsedCategory)) {
            category = parsedCategory;
          }
        }
        const iconMatch = metaContent.match(/Icon:\s*([^,)]+)/i);
        if (iconMatch && iconMatch[1]) {
          icon = iconMatch[1].trim();
        }
      }
      return {
        id: generateId("skill", name),
        name: name || "K\u1EF9 n\u0103ng kh\xF4ng t\xEAn",
        description: description || "Ch\u01B0a c\xF3 m\xF4 t\u1EA3 chi ti\u1EBFt.",
        category,
        icon,
        proficiency: "S\u01A1 Nh\u1EADp M\xF4n",
        xp: 0,
        xpToNextLevel: 100,
        effects: []
      };
    }).filter((s) => s.name !== "K\u1EF9 n\u0103ng kh\xF4ng t\xEAn");
  };
  const parseRawEntities = (rawEntities) => {
    if (!rawEntities) return [];
    return rawEntities.map((re) => {
      const typeString = re.type || "Kh\xE1c" /* Other */;
      const entityType = Object.values(EntityType).find((et) => et.toLowerCase() === typeString.toLowerCase()) || "Kh\xE1c" /* Other */;
      return {
        id: generateId("entity", re.name),
        name: re.name || "Th\u1EF1c th\u1EC3 kh\xF4ng t\xEAn",
        type: entityType,
        description: re.description || "Ch\u01B0a c\xF3 m\xF4 t\u1EA3."
      };
    }).filter((e) => e.name !== "Th\u1EF1c th\u1EC3 kh\xF4ng t\xEAn");
  };
  const populateSetupFromAIExtraction = (extractedData, sourceTextForAdvancedPrompt) => {
    let extractionMessages = [];
    if (extractedData.story_setup_name) {
      setSetupName(extractedData.story_setup_name);
      extractionMessages.push("T\xEAn thi\u1EBFt l\u1EADp");
    }
    let worldAdvancedPromptUpdate = sourceTextForAdvancedPrompt ? sourceTextForAdvancedPrompt.trim() : world.advancedPrompt;
    if (extractedData.world_setup) {
      const ws = extractedData.world_setup;
      setWorld((prev) => ({
        ...prev,
        theme: ws.theme || prev.theme,
        context: ws.context || prev.context,
        tone: Object.values(WorldTone).find((wt) => wt.toLowerCase() === ws.tone?.toLowerCase()) || ws.tone || prev.tone,
        advancedPrompt: sourceTextForAdvancedPrompt ? worldAdvancedPromptUpdate : ws.advanced_prompt || prev.advancedPrompt
      }));
      extractionMessages.push("Th\xF4ng tin th\u1EBF gi\u1EDBi");
    } else if (sourceTextForAdvancedPrompt && worldAdvancedPromptUpdate) {
      setWorld((prev) => ({ ...prev, advancedPrompt: worldAdvancedPromptUpdate }));
      extractionMessages.push("Prompt n\xE2ng cao (t\u1EEB m\xF4 t\u1EA3)");
    }
    if (extractedData.character_setup) {
      const cs = extractedData.character_setup;
      const parsedTraits = parseRawTraits(cs.traits_raw);
      const parsedSkills = parseRawSkills(cs.initial_skills_raw);
      setCharacter((prev) => ({
        ...prev,
        name: cs.name || prev.name,
        gender: Object.values(CharacterGender).find((cg) => cg.toLowerCase() === cs.gender?.toLowerCase()) || cs.gender || prev.gender,
        summary: cs.summary || prev.summary,
        goal: cs.goal || prev.goal,
        traits: parsedTraits.length > 0 ? parsedTraits : prev.traits,
        initialSkills: parsedSkills.length > 0 ? parsedSkills : prev.initialSkills
      }));
      extractionMessages.push("Th\xF4ng tin nh\xE2n v\u1EADt" + (parsedTraits.length > 0 ? ", \u0111\u1EB7c \u0111i\u1EC3m" : "") + (parsedSkills.length > 0 ? ", k\u1EF9 n\u0103ng ban \u0111\u1EA7u" : ""));
    }
    if (extractedData.entities_raw) {
      const parsedEntities = parseRawEntities(extractedData.entities_raw);
      if (parsedEntities.length > 0) {
        setEntities(parsedEntities);
        extractionMessages.push(`${parsedEntities.length} th\u1EF1c th\u1EC3 ban \u0111\u1EA7u`);
      }
    }
    if (extractionMessages.length > 0) {
      addToast({ message: `AI \u0111\xE3 tr\xEDch xu\u1EA5t: ${extractionMessages.join(", ")}. H\xE3y ki\u1EC3m tra v\xE0 ch\u1EC9nh s\u1EEDa n\u1EBFu c\u1EA7n.`, type: "success", duration: 1e4 });
      setActiveSetupMode("manualTabs");
      setCurrentManualStep(1);
    } else {
      addToast({ message: "AI kh\xF4ng tr\xEDch xu\u1EA5t \u0111\u01B0\u1EE3c nhi\u1EC1u th\xF4ng tin t\u1EEB m\xF4 t\u1EA3. Vui l\xF2ng th\u1EED m\xF4 t\u1EA3 chi ti\u1EBFt h\u01A1n ho\u1EB7c \u0111i\u1EC1n th\u1EE7 c\xF4ng.", type: "info", duration: 8e3 });
    }
  };
  const handleExtractAllFromAI = async () => {
    if (!fullSetupText.trim()) {
      addToast({ message: "Vui l\xF2ng nh\u1EADp m\xF4 t\u1EA3 v\xE0o \xF4 b\xEAn tr\xEAn \u0111\u1EC3 AI tr\xEDch xu\u1EA5t.", type: "warning" });
      return;
    }
    setIsLoadingAI(true);
    setActiveSuggestionField("extractAll");
    try {
      const apiKey = getApiKey();
      const extractedData = await extractFullStorySetupFromText(apiKey, settings.useDefaultAPI, fullSetupText);
      populateSetupFromAIExtraction(extractedData, fullSetupText);
    } catch (error) {
      console.error("Error extracting all settings from AI:", error);
      addToast({ message: `L\u1ED7i khi AI tr\xEDch xu\u1EA5t thi\u1EBFt l\u1EADp: ${error instanceof Error ? error.message : "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"}`, type: "error" });
    } finally {
      setIsLoadingAI(false);
      setActiveSuggestionField(null);
    }
  };
  const handleRandomCreateAllFromAI = async () => {
    if (!aiRandomParams.userTheme && !aiRandomParams.userDescription) {
      addToast({ message: "Vui l\xF2ng nh\u1EADp \xEDt nh\u1EA5t Ch\u1EE7 \u0111\u1EC1 ho\u1EB7c M\xF4 t\u1EA3 ng\u1EAFn \u0111\u1EC3 AI c\xF3 c\u01A1 s\u1EDF t\u1EA1o ng\u1EABu nhi\xEAn.", type: "warning", duration: 7e3 });
      return;
    }
    if (aiRandomParams.numEntities <= 0 || aiRandomParams.numEntities > 500) {
      addToast({ message: "S\u1ED1 l\u01B0\u1EE3ng th\u1EF1c th\u1EC3 ph\u1EA3i t\u1EEB 1 \u0111\u1EBFn 500.", type: "warning" });
      return;
    }
    setIsLoadingAI(true);
    setActiveSuggestionField("randomCreateAll");
    try {
      const apiKey = getApiKey();
      const extractedData = await generateFullRandomStorySetup(apiKey, settings.useDefaultAPI, aiRandomParams);
      populateSetupFromAIExtraction(extractedData);
      addToast({ message: "AI \u0111\xE3 ho\xE0n t\u1EA5t kh\u1EDFi t\u1EA1o ng\u1EABu nhi\xEAn! H\xE3y chuy\u1EC3n qua tab 'Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh' \u0111\u1EC3 xem v\xE0 s\u1EEDa \u0111\u1ED5i.", type: "success", duration: 12e3 });
    } catch (error) {
      console.error("Error with AI random full generation:", error);
      addToast({ message: `L\u1ED7i khi AI kh\u1EDFi t\u1EA1o ng\u1EABu nhi\xEAn: ${error instanceof Error ? error.message : "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh"}`, type: "error" });
    } finally {
      setIsLoadingAI(false);
      setActiveSuggestionField(null);
    }
  };
  const handleStartAdventure = () => {
    if (!world.theme || !world.context || !character.name || !character.summary || !character.goal) {
      addToast({ message: "Vui l\xF2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7 c\xE1c tr\u01B0\u1EDDng th\xF4ng tin b\u1EAFt bu\u1ED9c cho Th\u1EBF Gi\u1EDBi v\xE0 Nh\xE2n V\u1EADt trong tab 'Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh'.", type: "warning", duration: 7e3 });
      setActiveSetupMode("manualTabs");
      if (!world.theme || !world.context) setCurrentManualStep(1);
      else if (!character.name || !character.summary || !character.goal) setCurrentManualStep(2);
      return;
    }
    const finalSetup = {
      id: generateId("setup"),
      name: setupName.trim() || `Cu\u1ED9c phi\xEAu l\u01B0u c\u1EE7a ${character.name || "Nh\xE2n v\u1EADt kh\xF4ng t\xEAn"}`,
      world,
      character,
      entities,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      initialSkills: character.initialSkills
    };
    onStartStory(finalSetup);
  };
  const worldToneOptions = Object.values(WorldTone).map((tone) => ({ value: tone, label: tone }));
  const genderOptions = Object.values(CharacterGender).map((gender) => ({ value: gender, label: gender }));
  const entityTypeOptions = Object.values(EntityType).map((type) => ({ value: type, label: type }));
  const skillCategoryOptions = ["chi\u1EBFn \u0111\u1EA5u", "ch\u1EBF t\u1EA1o", "sinh t\u1ED3n", "ph\xE9p thu\u1EADt", "h\u1ED7 tr\u1EE3", "kh\xE1c"].map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
  const renderSuggestions = () => {
    if (aiSuggestions.length === 0 || !activeSuggestionField) return null;
    return /* @__PURE__ */ jsxs15("div", { className: "mt-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow", children: [
      /* @__PURE__ */ jsxs15("h4", { className: "text-sm font-semibold mb-1", children: [
        'G\u1EE3i \xFD t\u1EEB AI cho "',
        activeSuggestionField,
        '":'
      ] }),
      /* @__PURE__ */ jsx17("ul", { className: "list-disc list-inside max-h-32 overflow-y-auto", children: aiSuggestions.map((s, i) => /* @__PURE__ */ jsx17(
        "li",
        {
          className: "text-xs p-1 hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark rounded cursor-pointer",
          onClick: () => applySuggestion(s, activeSuggestionField),
          children: s
        },
        i
      )) }),
      /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "ghost", onClick: () => {
        setAiSuggestions([]);
        setActiveSuggestionField(null);
      }, className: "mt-1 text-xs", children: "\u0110\xF3ng g\u1EE3i \xFD" })
    ] });
  };
  const totalManualSteps = 3;
  const getTabClass = (mode) => {
    return `px-4 py-2.5 text-sm font-medium rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary dark:focus:ring-primary-light transition-colors duration-150
            ${activeSetupMode === mode ? "bg-card-light dark:bg-card-dark border-t border-x border-border-light dark:border-border-dark text-primary dark:text-primary-light shadow-sm" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-b border-border-light dark:border-border-dark"}`;
  };
  return /* @__PURE__ */ jsxs15(Modal_default, { isOpen: true, onClose, title: `Kh\u1EDFi T\u1EA1o M\u1EDBi - ${setupName || "Ch\u01B0a \u0111\u1EB7t t\xEAn"}`, size: "xl", children: [
    /* @__PURE__ */ jsxs15("div", { className: "flex mb-0 -mx-6 px-2 border-b border-border-light dark:border-border-dark", children: [
      /* @__PURE__ */ jsxs15("button", { className: getTabClass("aiRandomCreate"), onClick: () => setActiveSetupMode("aiRandomCreate"), children: [
        /* @__PURE__ */ jsx17("i", { className: "fas fa-random mr-2" }),
        "A.I Kh\u1EDFi T\u1EA1o Ng\u1EABu Nhi\xEAn"
      ] }),
      /* @__PURE__ */ jsxs15("button", { className: getTabClass("aiFullExtract"), onClick: () => setActiveSetupMode("aiFullExtract"), children: [
        /* @__PURE__ */ jsx17("i", { className: "fas fa-magic-sparkles mr-2" }),
        "AI Tr\xEDch Xu\u1EA5t T\u1EEB V\u0103n B\u1EA3n"
      ] }),
      /* @__PURE__ */ jsxs15("button", { className: getTabClass("manualTabs"), onClick: () => setActiveSetupMode("manualTabs"), children: [
        /* @__PURE__ */ jsx17("i", { className: "fas fa-tools mr-2" }),
        "Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh ",
        activeSetupMode === "manualTabs" && `(${currentManualStep}/${totalManualSteps})`
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("div", { className: "pt-5", children: [
      " ",
      activeSetupMode === "aiFullExtract" && /* @__PURE__ */ jsxs15("div", { className: "p-3 border-dashed border-primary/50 dark:border-primary-light/50 rounded-lg bg-primary/5 dark:bg-primary-dark/10", children: [
        /* @__PURE__ */ jsxs15("h3", { className: "text-md font-semibold text-primary dark:text-primary-light mb-2", children: [
          /* @__PURE__ */ jsx17("i", { className: "fas fa-file-alt mr-2" }),
          "Tr\xEDch Xu\u1EA5t To\xE0n B\u1ED9 Thi\u1EBFt L\u1EADp T\u1EEB V\u0103n B\u1EA3n"
        ] }),
        /* @__PURE__ */ jsx17(
          Textarea_default,
          {
            label: "D\xE1n ho\u1EB7c vi\u1EBFt m\xF4 t\u1EA3 to\xE0n b\u1ED9 thi\u1EBFt l\u1EADp mong mu\u1ED1n c\u1EE7a b\u1EA1n t\u1EA1i \u0111\xE2y (th\u1EBF gi\u1EDBi, nh\xE2n v\u1EADt, th\u1EF1c th\u1EC3 ban \u0111\u1EA7u, k\u1EF9 n\u0103ng ban \u0111\u1EA7u...):",
            value: fullSetupText,
            onChange: (e) => setFullSetupText(e.target.value),
            rows: 8,
            placeholder: "V\xED d\u1EE5: T\u1EA1o m\u1ED9t th\u1EBF gi\u1EDBi ti\xEAn hi\u1EC7p t\xEAn 'C\u1EEDu Ch\xE2u L\u1EE5c'. Nh\xE2n v\u1EADt ch\xEDnh t\xEAn L\xFD Phi D\u01B0\u01A1ng, nam, m\u1ED9t thi\u1EBFu ni\xEAn b\xECnh th\u01B0\u1EDDng t\xECnh c\u1EDD nh\u1EB7t \u0111\u01B0\u1EE3c b\xED k\xEDp v\xF5 c\xF4ng 'H\u1ED7n Nguy\xEAn C\xF4ng'. M\u1EE5c ti\xEAu c\u1EE7a c\u1EADu l\xE0 tr\u1EDF th\xE0nh c\u01B0\u1EDDng gi\u1EA3 m\u1EA1nh nh\u1EA5t. \u0110\u1EB7c \u0111i\u1EC3m: 'Thi\xEAn Sinh Th\u1EA7n L\u1EF1c: S\u1EE9c m\u1EA1nh h\u01A1n ng\u01B0\u1EDDi th\u01B0\u1EDDng'. K\u1EF9 n\u0103ng ban \u0111\u1EA7u: 'H\u1ED7n Nguy\xEAn C\xF4ng: C\xF4ng ph\xE1p tu luy\u1EC7n n\u1ED9i l\u1EF1c c\u01A1 b\u1EA3n (Lo\u1EA1i: Ph\xE9p thu\u1EADt, Icon: fas fa-fire)'. NPC ban \u0111\u1EA7u: 'L\xE3o \u0102n M\xE0y: m\u1ED9t ng\u01B0\u1EDDi b\xED \u1EA9n, hay gi\xFAp \u0111\u1EE1 L\xFD Phi D\u01B0\u01A1ng (NPC)'. ...",
            wrapperClass: "mb-2"
          }
        ),
        /* @__PURE__ */ jsxs15(
          Button_default,
          {
            onClick: handleExtractAllFromAI,
            isLoading: isLoadingAI && activeSuggestionField === "extractAll",
            disabled: isLoadingAI || !fullSetupText.trim(),
            className: "w-full",
            variant: "secondary",
            children: [
              /* @__PURE__ */ jsx17("i", { className: "fas fa-wand-magic-sparkles mr-2" }),
              "\u0110\u1EC3 AI Tr\xEDch Xu\u1EA5t Thi\u1EBFt L\u1EADp T\u1EEB M\xF4 T\u1EA3 Tr\xEAn"
            ]
          }
        ),
        /* @__PURE__ */ jsx17("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: "AI s\u1EBD c\u1ED1 g\u1EAFng \u0111i\u1EC1n c\xE1c th\xF4ng tin v\xE0o tab 'Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh'. B\u1EA1n c\xF3 th\u1EC3 ki\u1EC3m tra v\xE0 ch\u1EC9nh s\u1EEDa sau." })
      ] }),
      activeSetupMode === "aiRandomCreate" && /* @__PURE__ */ jsxs15("div", { className: "p-3 border-dashed border-blue-500/50 dark:border-blue-400/50 rounded-lg bg-blue-500/5 dark:bg-blue-400/10 space-y-4", children: [
        /* @__PURE__ */ jsxs15("h3", { className: "text-md font-semibold text-blue-600 dark:text-blue-300 mb-2", children: [
          /* @__PURE__ */ jsx17("i", { className: "fas fa-dice-d20 mr-2" }),
          "\u0110\u1EC3 AI S\xE1ng T\u1EA1o To\xE0n B\u1ED9 Th\u1EBF Gi\u1EDBi Ng\u1EABu Nhi\xEAn"
        ] }),
        /* @__PURE__ */ jsx17(
          Input_default,
          {
            label: "Ch\u1EE7 \u0111\u1EC1 g\u1EE3i \xFD cho AI (T\xF9y ch\u1ECDn):",
            value: aiRandomParams.userTheme,
            onChange: (e) => setAiRandomParams((p) => ({ ...p, userTheme: e.target.value })),
            placeholder: "V\xED d\u1EE5: Ti\xEAn hi\u1EC7p b\xE1o th\xF9, \u0110\xF4 th\u1ECB d\u1ECB n\u0103ng, C\u1ED5 \u0111\u1EA1i cung \u0111\u1EA5u..."
          }
        ),
        /* @__PURE__ */ jsx17(
          Textarea_default,
          {
            label: "M\xF4 t\u1EA3 ng\u1EAFn g\u1ECDn v\u1EC1 \xFD t\u01B0\u1EDFng ch\xEDnh (T\xF9y ch\u1ECDn):",
            value: aiRandomParams.userDescription,
            onChange: (e) => setAiRandomParams((p) => ({ ...p, userDescription: e.target.value })),
            rows: 3,
            placeholder: "V\xED d\u1EE5: M\u1ED9t th\u1EBF gi\u1EDBi tu ti\xEAn n\u01A1i k\u1EBB y\u1EBFu b\u1ECB ch\xE0 \u0111\u1EA1p, nh\xE2n v\u1EADt ch\xEDnh t\u1EEB \u0111\xE1y v\u1EF1c v\u01B0\u01A1n l\xEAn. Ho\u1EB7c m\u1ED9t c\xE2u chuy\u1EC7n t\xECnh y\xEAu v\u01B0\u1EE3t th\u1EDDi gian..."
          }
        ),
        /* @__PURE__ */ jsx17(
          Input_default,
          {
            label: "S\u1ED1 l\u01B0\u1EE3ng th\u1EF1c th\u1EC3 AI c\u1EA7n t\u1EA1o (NPC, \u0111\u1ECBa \u0111i\u1EC3m, v\u1EADt ph\u1EA9m...):",
            type: "number",
            value: aiRandomParams.numEntities.toString(),
            min: "1",
            max: "500",
            onChange: (e) => setAiRandomParams((p) => ({ ...p, numEntities: parseInt(e.target.value, 10) || 5 }))
          }
        ),
        /* @__PURE__ */ jsxs15(
          Button_default,
          {
            onClick: handleRandomCreateAllFromAI,
            isLoading: isLoadingAI && activeSuggestionField === "randomCreateAll",
            disabled: isLoadingAI || !aiRandomParams.userTheme.trim() && !aiRandomParams.userDescription.trim(),
            className: "w-full",
            variant: "primary",
            children: [
              /* @__PURE__ */ jsx17("i", { className: "fas fa-brain mr-2" }),
              "\u0110\u1EC3 AI Kh\u1EDFi T\u1EA1o To\xE0n B\u1ED9 Th\u1EBF Gi\u1EDBi"
            ]
          }
        ),
        /* @__PURE__ */ jsx17("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: "AI s\u1EBD t\u1EA1o ra m\u1ED9t thi\u1EBFt l\u1EADp \u0111\u1ED3 s\u1ED9, chi ti\u1EBFt d\u1EF1a tr\xEAn g\u1EE3i \xFD c\u1EE7a b\u1EA1n (n\u1EBFu c\xF3). Sau \u0111\xF3, b\u1EA1n c\xF3 th\u1EC3 xem v\xE0 tinh ch\u1EC9nh trong tab 'Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng & Tinh Ch\u1EC9nh'." })
      ] }),
      activeSetupMode === "manualTabs" && /* @__PURE__ */ jsxs15(Fragment4, { children: [
        /* @__PURE__ */ jsx17(Input_default, { label: "T\xEAn Cu\u1ED9c Phi\xEAu L\u01B0u / C\u1EA5u H\xECnh:", value: setupName, onChange: (e) => setSetupName(e.target.value), placeholder: "V\xED d\u1EE5: Th\u1EBF gi\u1EDBi Ti\xEAn hi\u1EC7p c\u1EE7a t\xF4i" }),
        /* @__PURE__ */ jsx17("hr", { className: "my-4" }),
        currentManualStep === 1 && /* @__PURE__ */ jsxs15("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs15("h3", { className: "text-lg font-semibold mb-2 text-primary dark:text-primary-light", children: [
            "1. Thi\u1EBFt L\u1EADp Th\u1EBF Gi\u1EDBi ",
            /* @__PURE__ */ jsx17("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsx17(Input_default, { wrapperClass: "flex-grow", label: "Ch\u1EE7 \u0111\u1EC1 (*):", value: world.theme, onChange: (e) => setWorld({ ...world, theme: e.target.value }) }),
            /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("theme"), isLoading: isLoadingAI && activeSuggestionField === "theme", children: "AI" })
          ] }),
          activeSuggestionField === "theme" && renderSuggestions(),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsx17(Textarea_default, { wrapperClass: "flex-grow", label: "B\u1ED1i c\u1EA3nh (*):", value: world.context, onChange: (e) => setWorld({ ...world, context: e.target.value }) }),
            /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("context", { theme: world.theme }), isLoading: isLoadingAI && activeSuggestionField === "context", children: "AI" })
          ] }),
          activeSuggestionField === "context" && renderSuggestions(),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsx17(Dropdown_default, { wrapperClass: "flex-grow", label: "Phong c\xE1ch/Gi\u1ECDng v\u0103n (*):", options: worldToneOptions, value: world.tone, onChange: (e) => setWorld({ ...world, tone: e.target.value }) }),
            /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("tone", { theme: world.theme }), isLoading: isLoadingAI && activeSuggestionField === "tone", children: "AI" })
          ] }),
          activeSuggestionField === "tone" && renderSuggestions(),
          /* @__PURE__ */ jsx17(Textarea_default, { label: "Prompt N\xE2ng Cao (T\xF9y ch\u1ECDn):", value: world.advancedPrompt || "", onChange: (e) => setWorld({ ...world, advancedPrompt: e.target.value }), placeholder: "Lu\u1EADt l\u1EC7 th\u1EBF gi\u1EDBi, phe ph\xE1i, l\u1ECBch s\u1EED t\xF3m t\u1EAFt...", rows: 4 }),
          /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "ghost", onClick: () => addToast({ message: "V\xED d\u1EE5 Prompt n\xE2ng cao:\n- Th\u1EBF gi\u1EDBi n\xE0y c\xF3 3 m\u1EB7t tr\u0103ng, m\u1ED7i m\u1EB7t tr\u0103ng mang m\u1ED9t lo\u1EA1i n\u0103ng l\u01B0\u1EE3ng kh\xE1c nhau.\n- C\xE1c tu s\u0129 h\u1EA5p th\u1EE5 n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u0103ng \u0111\u1EC3 tu luy\u1EC7n, chia th\xE0nh 3 tr\u01B0\u1EDDng ph\xE1i ch\xEDnh.\n- C\xF3 m\u1ED9t l\u1EDDi ti\xEAn tri c\u1ED5 v\u1EC1 ng\xE0y 3 m\u1EB7t tr\u0103ng th\u1EB3ng h\xE0ng...", type: "info", duration: 1e4 }), children: "Xem g\u1EE3i \xFD prompt" })
        ] }),
        currentManualStep === 2 && /* @__PURE__ */ jsxs15("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs15("h3", { className: "text-lg font-semibold mb-2 text-primary dark:text-primary-light", children: [
            "2. Thi\u1EBFt L\u1EADp Nh\xE2n V\u1EADt Ch\xEDnh ",
            /* @__PURE__ */ jsx17("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsx17(Input_default, { wrapperClass: "flex-grow", label: "T\xEAn nh\xE2n v\u1EADt (*):", value: character.name, onChange: (e) => setCharacter({ ...character, name: e.target.value }) }),
            /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("charName", { worldTheme: world.theme, worldContext: world.context }), isLoading: isLoadingAI && activeSuggestionField === "charName", children: "AI" })
          ] }),
          activeSuggestionField === "charName" && renderSuggestions(),
          /* @__PURE__ */ jsx17(Dropdown_default, { label: "Gi\u1EDBi t\xEDnh (*):", options: genderOptions, value: character.gender, onChange: (e) => setCharacter({ ...character, gender: e.target.value }) }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsx17(Textarea_default, { wrapperClass: "flex-grow", label: "S\u01A1 l\u01B0\u1EE3c (Ngo\u1EA1i h\xECnh, T\xEDnh c\xE1ch, Ngu\u1ED3n g\u1ED1c) (*):", value: character.summary, onChange: (e) => setCharacter({ ...character, summary: e.target.value }) }),
            /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("charSummary", { charName: character.name, charGender: character.gender, worldTheme: world.theme }), isLoading: isLoadingAI && activeSuggestionField === "charSummary", children: "AI T\u1EA1o S\u01A1 L\u01B0\u1EE3c" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsx17(Input_default, { wrapperClass: "flex-grow", label: "M\u1EE5c ti\xEAu/\u0110\u1ED9ng l\u1EF1c c\u1EE7a nh\xE2n v\u1EADt (*):", value: character.goal, onChange: (e) => setCharacter({ ...character, goal: e.target.value }) }),
            /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("charGoal", { charName: character.name, charSummary: character.summary }), isLoading: isLoadingAI && activeSuggestionField === "charGoal", children: "AI" })
          ] }),
          activeSuggestionField === "charGoal" && renderSuggestions(),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx17("label", { className: "block text-sm font-medium text-text-light dark:text-text-dark mb-1", children: "\u0110\u1EB7c \u0111i\u1EC3m (Thi\xEAn ph\xFA/K\u1EF9 n\u0103ng \u0111\u1EB7c bi\u1EC7t/V\u1EADt ph\u1EA9m kh\u1EDFi \u0111\u1EA7u...):" }),
            character.traits.map((trait, index) => /* @__PURE__ */ jsxs15("div", { className: "flex gap-2 mb-2 items-center p-2 border rounded-md border-border-light dark:border-border-dark", children: [
              /* @__PURE__ */ jsx17(Input_default, { wrapperClass: "flex-grow !mb-0", placeholder: "T\xEAn \u0111\u1EB7c \u0111i\u1EC3m", value: trait.name, onChange: (e) => updateTrait(index, "name", e.target.value) }),
              /* @__PURE__ */ jsx17(Textarea_default, { wrapperClass: "flex-grow !mb-0", placeholder: "M\xF4 t\u1EA3 ng\u1EAFn", value: trait.description, rows: 1, onChange: (e) => updateTrait(index, "description", e.target.value) }),
              /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "danger", onClick: () => removeTrait(index), children: /* @__PURE__ */ jsx17("i", { className: "fas fa-trash" }) })
            ] }, trait.id)),
            /* @__PURE__ */ jsxs15("div", { className: "flex gap-2 mt-1", children: [
              /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "outline", onClick: addTrait, children: "Th\xEAm \u0110\u1EB7c \u0110i\u1EC3m" }),
              /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "outline", onClick: handleAIGenerateTrait, isLoading: isLoadingAI && activeSuggestionField === "traitSuggestion", children: "AI G\u1EE3i \xDD \u0110\u1EB7c \u0110i\u1EC3m" })
            ] })
          ] })
        ] }),
        currentManualStep === 3 && /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs15("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx17("h3", { className: "text-lg font-semibold mb-2 text-primary dark:text-primary-light", children: "3a. Th\xEAm Th\u1EF1c Th\u1EC3/\u0110\u1ED1i T\u01B0\u1EE3ng (T\xF9y ch\u1ECDn)" }),
            /* @__PURE__ */ jsxs15("div", { className: "p-3 border rounded-md border-border-light dark:border-border-dark space-y-2", children: [
              /* @__PURE__ */ jsx17("h4", { className: "text-md font-medium", children: "Th\xEAm m\u1EDBi th\u1EE7 c\xF4ng:" }),
              /* @__PURE__ */ jsx17(Dropdown_default, { label: "Lo\u1EA1i th\u1EF1c th\u1EC3:", options: entityTypeOptions, value: newEntity.type || "NPC" /* NPC */, onChange: (e) => setNewEntity({ ...newEntity, type: e.target.value }) }),
              /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
                /* @__PURE__ */ jsx17(Input_default, { wrapperClass: "flex-grow", label: "T\u1EEB kh\xF3a/T\xEAn th\u1EF1c th\u1EC3:", value: newEntity.name || "", onChange: (e) => setNewEntity({ ...newEntity, name: e.target.value }) }),
                /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("entitySuggestion", { worldTheme: world.theme, entityType: newEntity.type }), isLoading: isLoadingAI && activeSuggestionField === "entitySuggestion", children: "AI" })
              ] }),
              /* @__PURE__ */ jsx17(Textarea_default, { label: "M\xF4 t\u1EA3 chi ti\u1EBFt:", value: newEntity.description || "", onChange: (e) => setNewEntity({ ...newEntity, description: e.target.value }) }),
              /* @__PURE__ */ jsx17(Button_default, { onClick: addEntity, disabled: !newEntity.name || !newEntity.description, children: "Th\xEAm Th\u1EF1c Th\u1EC3 Th\u1EE7 C\xF4ng" })
            ] }),
            /* @__PURE__ */ jsxs15("div", { className: "mt-4 pt-3 border-t border-border-light dark:border-border-dark", children: [
              /* @__PURE__ */ jsx17("h4", { className: "text-md font-medium mb-2", children: "Ho\u1EB7c Th\xEAm Nhi\u1EC1u Th\u1EF1c Th\u1EC3 T\u1EEB V\u0103n B\u1EA3n:" }),
              /* @__PURE__ */ jsx17(
                Textarea_default,
                {
                  label: "Nh\u1EADp \u0111o\u1EA1n v\u0103n b\u1EA3n m\xF4 t\u1EA3 c\xE1c th\u1EF1c th\u1EC3:",
                  value: bulkEntityText,
                  onChange: (e) => setBulkEntityText(e.target.value),
                  rows: 4,
                  placeholder: "V\xED d\u1EE5: L\xE3o Tr\u01B0\u01A1ng l\xE0 m\u1ED9t th\u1EE3 r\xE8n gi\xE0 \u1EDF l\xE0ng Ho\xE0 B\xECnh, \xF4ng ta gi\u1EEF m\u1ED9t thanh b\u1EA3o ki\u1EBFm t\xEAn l\xE0 H\u1ECFa Long. Ng\u1ECDn n\xFAi ph\xEDa b\u1EAFc l\xE0ng, T\u1EED Vong S\u01A1n, l\xE0 n\u01A1i \u1EDF c\u1EE7a H\u1EAFc Phong H\u1ED9i..."
                }
              ),
              /* @__PURE__ */ jsx17(
                Button_default,
                {
                  onClick: handleBulkAddEntities,
                  isLoading: isLoadingAI && activeSuggestionField === "bulkEntities",
                  disabled: isLoadingAI || !bulkEntityText.trim(),
                  className: "w-full mt-2",
                  children: "AI Tr\xEDch Xu\u1EA5t Th\u1EF1c Th\u1EC3 T\u1EEB V\u0103n B\u1EA3n"
                }
              )
            ] }),
            entities.length > 0 && /* @__PURE__ */ jsxs15("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsxs15("h4", { className: "text-md font-medium mb-1", children: [
                "Danh s\xE1ch th\u1EF1c th\u1EC3 \u0111\xE3 th\xEAm (",
                entities.length,
                "):"
              ] }),
              /* @__PURE__ */ jsx17("ul", { className: "max-h-32 overflow-y-auto space-y-1.5 pr-1", children: entities.map((entity) => /* @__PURE__ */ jsxs15(
                "li",
                {
                  className: `p-2 border rounded-md cursor-pointer flex justify-between items-center ${selectedEntityForViewing?.id === entity.id ? "bg-primary-light/20 dark:bg-primary-dark/30 ring-1 ring-primary" : "bg-gray-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
                  onClick: () => setSelectedEntityForViewing(entity),
                  title: "Nh\u1EA5n \u0111\u1EC3 xem chi ti\u1EBFt",
                  children: [
                    /* @__PURE__ */ jsxs15("div", { className: "flex-grow", children: [
                      /* @__PURE__ */ jsx17("strong", { className: "text-sm", children: entity.name }),
                      " ",
                      /* @__PURE__ */ jsxs15("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                        "(",
                        entity.type,
                        ")"
                      ] }),
                      /* @__PURE__ */ jsx17("p", { className: "text-xs text-gray-600 dark:text-gray-300 truncate", children: entity.description })
                    ] }),
                    /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "danger", onClick: (e) => {
                      e.stopPropagation();
                      removeEntity(entity.id);
                    }, className: "ml-2 flex-shrink-0", children: /* @__PURE__ */ jsx17("i", { className: "fas fa-trash" }) })
                  ]
                },
                entity.id
              )) }),
              selectedEntityForViewing && /* @__PURE__ */ jsxs15("div", { className: "mt-3 p-3 border rounded-md bg-white dark:bg-gray-900 shadow-lg", children: [
                /* @__PURE__ */ jsxs15("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsxs15("h5", { className: "font-semibold text-primary dark:text-primary-light", children: [
                    selectedEntityForViewing.name,
                    " ",
                    /* @__PURE__ */ jsxs15("span", { className: "text-xs font-normal text-gray-500 dark:text-gray-400", children: [
                      "(",
                      selectedEntityForViewing.type,
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "ghost", onClick: () => setSelectedEntityForViewing(null), className: "text-xs -mt-1 -mr-1", children: "\xD7 \u0110\xF3ng" })
                ] }),
                /* @__PURE__ */ jsx17("p", { className: "text-sm whitespace-pre-wrap mt-1 max-h-24 overflow-y-auto", children: selectedEntityForViewing.description })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx17("h3", { className: "text-lg font-semibold mb-2 text-primary dark:text-primary-light", children: "3b. K\u1EF9 N\u0103ng Kh\u1EDFi \u0110\u1EA7u (T\xF9y ch\u1ECDn)" }),
            /* @__PURE__ */ jsxs15("div", { className: "p-3 border rounded-md border-border-light dark:border-border-dark space-y-2", children: [
              /* @__PURE__ */ jsxs15("div", { className: "flex items-end gap-2", children: [
                /* @__PURE__ */ jsx17(Input_default, { wrapperClass: "flex-grow", label: "T\xEAn K\u1EF9 N\u0103ng:", value: newSkill.name || "", onChange: (e) => setNewSkill({ ...newSkill, name: e.target.value }) }),
                /* @__PURE__ */ jsx17(Button_default, { size: "sm", onClick: () => handleAIGenerate("skillSuggestion", { worldTheme: world.theme, charName: character.name }), isLoading: isLoadingAI && activeSuggestionField === "skillSuggestion", children: "AI" })
              ] }),
              /* @__PURE__ */ jsx17(Textarea_default, { label: "M\xF4 T\u1EA3 K\u1EF9 N\u0103ng:", value: newSkill.description || "", rows: 2, onChange: (e) => setNewSkill({ ...newSkill, description: e.target.value }) }),
              /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsx17(Dropdown_default, { label: "Lo\u1EA1i K\u1EF9 N\u0103ng:", options: skillCategoryOptions, value: newSkill.category, onChange: (e) => setNewSkill({ ...newSkill, category: e.target.value }) }),
                /* @__PURE__ */ jsx17(Input_default, { label: "Icon (Font Awesome):", value: newSkill.icon || "", onChange: (e) => setNewSkill({ ...newSkill, icon: e.target.value }), placeholder: "fas fa-sword" })
              ] }),
              /* @__PURE__ */ jsx17(Button_default, { onClick: addSkill, disabled: !newSkill.name || !newSkill.description, children: "Th\xEAm K\u1EF9 N\u0103ng" })
            ] }),
            character.initialSkills && character.initialSkills.length > 0 && /* @__PURE__ */ jsxs15("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsxs15("h4", { className: "text-md font-medium mb-1", children: [
                "K\u1EF9 n\u0103ng \u0111\xE3 th\xEAm (",
                character.initialSkills.length,
                "):"
              ] }),
              /* @__PURE__ */ jsx17("ul", { className: "max-h-32 overflow-y-auto space-y-1.5 pr-1", children: character.initialSkills.map((skill) => /* @__PURE__ */ jsxs15("li", { className: "p-2 border rounded-md bg-gray-50 dark:bg-gray-800 flex justify-between items-center", children: [
                /* @__PURE__ */ jsxs15("div", { children: [
                  /* @__PURE__ */ jsx17("strong", { className: "text-sm", children: skill.name }),
                  " ",
                  /* @__PURE__ */ jsxs15("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                    "(",
                    skill.category,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx17("p", { className: "text-xs text-gray-600 dark:text-gray-300 truncate", children: skill.description })
                ] }),
                /* @__PURE__ */ jsx17(Button_default, { size: "sm", variant: "danger", onClick: () => removeSkill(skill.id), className: "ml-2 flex-shrink-0", children: /* @__PURE__ */ jsx17("i", { className: "fas fa-trash" }) })
              ] }, skill.id)) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("div", { className: "mt-8 pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center", children: [
      /* @__PURE__ */ jsx17("div", { children: activeSetupMode === "manualTabs" && currentManualStep > 1 && /* @__PURE__ */ jsx17(Button_default, { variant: "outline", onClick: () => setCurrentManualStep((s) => s - 1), children: "Quay L\u1EA1i" }) }),
      /* @__PURE__ */ jsxs15("div", { className: "flex gap-3 items-center", children: [
        activeSetupMode === "manualTabs" && currentManualStep < totalManualSteps && /* @__PURE__ */ jsx17(Button_default, { onClick: () => setCurrentManualStep((s) => s + 1), children: "Ti\u1EBFp Theo" }),
        /* @__PURE__ */ jsxs15(
          Button_default,
          {
            variant: "primary",
            onClick: handleStartAdventure,
            isLoading: isLoadingAI && activeSuggestionField !== "bulkEntities" && activeSuggestionField !== "skillSuggestion" && activeSuggestionField !== "entitySuggestion" && activeSuggestionField !== "extractAll" && activeSuggestionField !== "randomCreateAll",
            children: [
              /* @__PURE__ */ jsx17("i", { className: "fas fa-wand-sparkles mr-2" }),
              "Kh\u1EDFi T\u1EA1o Cu\u1ED9c Phi\xEAu L\u01B0u"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx17("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: 'L\u01B0u \xFD: \u0110\u1EC3 kh\u1EDFi t\u1EA1o, c\xE1c tr\u01B0\u1EDDng c\xF3 d\u1EA5u (*) trong tab "Thi\u1EBFt L\u1EADp Th\u1EE7 C\xF4ng" ph\u1EA3i \u0111\u01B0\u1EE3c \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7.' })
  ] });
};
var NewStorySetupModal_default = NewStorySetupModal;

// components/modals/LoadStoryModal.tsx
import { useState as useState9, useEffect as useEffect8, useCallback as useCallback4 } from "react";
import { jsx as jsx18, jsxs as jsxs16 } from "react/jsx-runtime";
var getAvailableLoadSlots = () => {
  const slots = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX)) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed.gameState && parsed.savedAt) {
            const slotNamePart = key.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length);
            slots.push({
              key,
              displayName: parsed.gameState.setup?.name || slotNamePart.replace(/_/g, " "),
              savedAt: parsed.savedAt
            });
          }
        }
      } catch (e) {
        console.warn(`Could not parse autosave slot ${key}:`, e);
      }
    }
  }
  return slots.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
};
var LoadStoryModal = ({ isOpen, onClose, onLoadStoryFromFile, onLoadStoryFromSlot }) => {
  const [selectedFile, setSelectedFile] = useState9(null);
  const [isLoadingFile, setIsLoadingFile] = useState9(false);
  const [existingSlots, setExistingSlots] = useState9([]);
  const { addToast } = usePublicToast();
  const refreshSlots = useCallback4(() => {
    setExistingSlots(getAvailableLoadSlots());
  }, []);
  useEffect8(() => {
    if (isOpen) {
      refreshSlots();
    }
  }, [isOpen, refreshSlots]);
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/json") {
        setSelectedFile(file);
      } else {
        addToast({ message: "Vui l\xF2ng ch\u1ECDn m\u1ED9t file .json h\u1EE3p l\u1EC7.", type: "error" });
        setSelectedFile(null);
        event.target.value = "";
      }
    } else {
      setSelectedFile(null);
    }
  };
  const handleLoadFromFile = () => {
    if (!selectedFile) {
      addToast({ message: "Vui l\xF2ng ch\u1ECDn m\u1ED9t file \u0111\u1EC3 t\u1EA3i.", type: "warning" });
      return;
    }
    setIsLoadingFile(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === "string") {
          const parsedGameState = JSON.parse(text);
          if (parsedGameState && parsedGameState.setup && parsedGameState.storyLog) {
            onLoadStoryFromFile(parsedGameState);
          } else {
            throw new Error("C\u1EA5u tr\xFAc file save kh\xF4ng h\u1EE3p l\u1EC7.");
          }
        } else {
          throw new Error("Kh\xF4ng th\u1EC3 \u0111\u1ECDc n\u1ED9i dung file.");
        }
      } catch (error) {
        console.error("Error loading or parsing game file:", error);
        addToast({ message: `L\u1ED7i khi t\u1EA3i file: ${error instanceof Error ? error.message : "N\u1ED9i dung file kh\xF4ng h\u1EE3p l\u1EC7."}`, type: "error", duration: 7e3 });
      } finally {
        setIsLoadingFile(false);
      }
    };
    reader.onerror = () => {
      addToast({ message: "L\u1ED7i khi \u0111\u1ECDc file.", type: "error" });
      setIsLoadingFile(false);
    };
    reader.readAsText(selectedFile);
  };
  const handleDeleteSlot = (slotKey, displayName) => {
    localStorage.removeItem(slotKey);
    refreshSlots();
    addToast({ message: `\u0110\xE3 x\xF3a slot l\u01B0u tr\u1EEF: "${displayName}"`, type: "info", icon: "fas fa-trash-alt" });
  };
  return /* @__PURE__ */ jsxs16(Modal_default, { isOpen, onClose, title: "T\u1EA3i Game \u0110\xE3 L\u01B0u", size: "lg", children: [
    /* @__PURE__ */ jsxs16("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs16("div", { className: "p-4 border rounded-lg bg-primary/5 dark:bg-primary-dark/10 border-primary/30 dark:border-primary-dark/40", children: [
        /* @__PURE__ */ jsxs16("h3", { className: "text-lg font-semibold text-primary dark:text-primary-light mb-2 flex items-center", children: [
          /* @__PURE__ */ jsx18("i", { className: "fas fa-history mr-2" }),
          "T\u1EA3i T\u1EEB C\xE1c Slot \u0110\xE3 L\u01B0u Trong Tr\xECnh Duy\u1EC7t"
        ] }),
        existingSlots.length > 0 ? /* @__PURE__ */ jsx18("div", { className: "max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-2", children: existingSlots.map((slot) => /* @__PURE__ */ jsxs16("div", { className: "p-3 border rounded-md bg-white dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2", children: [
          /* @__PURE__ */ jsxs16("div", { children: [
            /* @__PURE__ */ jsx18("strong", { className: "block text-sm text-slate-800 dark:text-slate-100", children: slot.displayName }),
            /* @__PURE__ */ jsxs16("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
              "L\u01B0u l\xFAc: ",
              new Date(slot.savedAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs16("div", { className: "flex gap-2 mt-2 sm:mt-0", children: [
            /* @__PURE__ */ jsx18(Button_default, { onClick: () => {
              onLoadStoryFromSlot(slot.key);
            }, variant: "primary", size: "xs", className: "!px-2.5 !py-1", leftIcon: /* @__PURE__ */ jsx18("i", { className: "fas fa-play-circle" }), children: "T\u1EA3i Slot N\xE0y" }),
            /* @__PURE__ */ jsx18(Button_default, { onClick: () => handleDeleteSlot(slot.key, slot.displayName), variant: "danger", size: "xs", className: "!px-2 !py-1", title: `X\xF3a slot: ${slot.displayName}`, children: /* @__PURE__ */ jsx18("i", { className: "fas fa-trash-alt" }) })
          ] })
        ] }, slot.key)) }) : /* @__PURE__ */ jsx18("p", { className: "text-sm text-slate-500 dark:text-slate-400 italic", children: "Kh\xF4ng t\xECm th\u1EA5y slot n\xE0o \u0111\u01B0\u1EE3c l\u01B0u trong tr\xECnh duy\u1EC7t." })
      ] }),
      /* @__PURE__ */ jsx18("hr", { className: "border-border-light dark:border-border-dark my-4" }),
      /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsxs16("h3", { className: "text-lg font-semibold text-text-light dark:text-text-dark mb-2 flex items-center", children: [
          /* @__PURE__ */ jsx18("i", { className: "fas fa-file-upload mr-2" }),
          "Ho\u1EB7c T\u1EA3i Game T\u1EEB File JSON"
        ] }),
        /* @__PURE__ */ jsx18("p", { className: "text-sm text-text-light dark:text-text-dark mb-2", children: "Ch\u1ECDn file JSON (.json) \u0111\xE3 l\u01B0u th\u1EE7 c\xF4ng tr\u01B0\u1EDBc \u0111\xF3." }),
        /* @__PURE__ */ jsxs16("div", { children: [
          /* @__PURE__ */ jsx18("label", { htmlFor: "file-upload-load", className: "block text-xs font-medium text-text-light dark:text-text-dark mb-1 sr-only", children: "Ch\u1ECDn file save game:" }),
          /* @__PURE__ */ jsx18(
            "input",
            {
              id: "file-upload-load",
              type: "file",
              accept: ".json",
              onChange: handleFileChange,
              className: "block w-full text-sm text-slate-500 dark:text-slate-400\n                         file:mr-4 file:py-2 file:px-3\n                         file:rounded-md file:border-0\n                         file:text-sm file:font-semibold\n                         file:bg-primary-light/20 file:text-primary dark:file:bg-primary-dark/30 dark:file:text-primary-light\n                         hover:file:bg-primary-light/30 dark:hover:file:bg-primary-dark/40\n                         focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary dark:focus:ring-primary-dark"
            }
          )
        ] }),
        selectedFile && /* @__PURE__ */ jsxs16("p", { className: "text-xs text-gray-600 dark:text-gray-300 mt-1.5", children: [
          "\u0110\xE3 ch\u1ECDn: ",
          /* @__PURE__ */ jsx18("span", { className: "font-medium", children: selectedFile.name })
        ] }),
        /* @__PURE__ */ jsx18(
          Button_default,
          {
            onClick: handleLoadFromFile,
            disabled: !selectedFile || isLoadingFile,
            isLoading: isLoadingFile,
            className: "mt-3 w-full sm:w-auto",
            variant: "outline",
            leftIcon: /* @__PURE__ */ jsx18("i", { className: "fas fa-upload" }),
            children: isLoadingFile ? "\u0110ang T\u1EA3i T\u1EEB File..." : "T\u1EA3i T\u1EEB File"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx18("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsx18(Button_default, { variant: "ghost", onClick: onClose, disabled: isLoadingFile, size: "lg", children: "\u0110\xF3ng" }) })
  ] });
};
var LoadStoryModal_default = LoadStoryModal;

// components/modals/WorldEventCreatorModal.tsx
import { useState as useState10, useCallback as useCallback5 } from "react";
import { jsx as jsx19, jsxs as jsxs17 } from "react/jsx-runtime";
var WorldEventCreatorModal = ({ onClose, gameState, setGameState }) => {
  const { settings } = useSettings();
  const [eventType, setEventType] = useState10("Ng\u1EABu Nhi\xEAn" /* Random */);
  const [eventScope, setEventScope] = useState10("Khu V\u1EF1c" /* Regional */);
  const [keywords, setKeywords] = useState10("");
  const [isLoadingAI, setIsLoadingAI] = useState10(false);
  const [generatedEventPreview, setGeneratedEventPreview] = useState10(null);
  const getApiKey = useCallback5(() => {
    return settings.useDefaultAPI ? process.env.API_KEY || "" : localStorage.getItem(LOCAL_STORAGE_API_KEY) || "";
  }, [settings.useDefaultAPI]);
  const handleGenerateEvent = async () => {
    setIsLoadingAI(true);
    setGeneratedEventPreview(null);
    try {
      const apiKey = getApiKey();
      const storyContext = {
        worldTheme: gameState.setup.world.theme,
        characterName: gameState.setup.character.name,
        recentStory: gameState.storyLog.slice(-5).map((msg) => msg.content).join(" ")
      };
      const result = await generateRandomWithAI(apiKey, settings.useDefaultAPI, "worldEvent", {
        storyContext,
        eventType,
        eventScope,
        keywords
      });
      if (typeof result === "string") {
        const parsedEvent = JSON.parse(result);
        setGeneratedEventPreview({
          name: parsedEvent.name,
          description: parsedEvent.description,
          keyElements: parsedEvent.keyElements,
          type: eventType,
          // ensure type/scope from selection are used
          scope: eventScope,
          status: "active"
        });
      }
    } catch (error) {
      console.error("Error generating world event:", error);
      alert(`L\u1ED7i t\u1EA1o s\u1EF1 ki\u1EC7n: ${error instanceof Error ? error.message : "Kh\xF4ng th\u1EC3 t\u1EA1o s\u1EF1 ki\u1EC7n"}`);
    } finally {
      setIsLoadingAI(false);
    }
  };
  const handleAcceptEvent = () => {
    if (!generatedEventPreview || !generatedEventPreview.name || !generatedEventPreview.description) {
      alert("S\u1EF1 ki\u1EC7n kh\xF4ng h\u1EE3p l\u1EC7 \u0111\u1EC3 th\xEAm v\xE0o truy\u1EC7n.");
      return;
    }
    const newWorldEvent = {
      id: `event-${Date.now()}`,
      name: generatedEventPreview.name,
      type: generatedEventPreview.type || eventType,
      scope: generatedEventPreview.scope || eventScope,
      description: generatedEventPreview.description,
      keyElements: generatedEventPreview.keyElements || [],
      status: "active",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const eventMessage = {
      id: `msg-event-${Date.now()}`,
      type: "event",
      content: `S\u1EF0 KI\u1EC6N TH\u1EBE GI\u1EDAI M\u1EDAI: ${newWorldEvent.name}
${newWorldEvent.description}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentWorldEvent: newWorldEvent,
        storyLog: [...prev.storyLog, eventMessage]
      };
    });
    onClose();
  };
  const eventTypeOptions = Object.values(WorldEventType).map((et) => ({ value: et, label: et }));
  const eventScopeOptions = Object.values(WorldEventScope).map((es) => ({ value: es, label: es }));
  return /* @__PURE__ */ jsxs17(Modal_default, { isOpen: true, onClose, title: "T\u1EA1o S\u1EF1 Ki\u1EC7n Th\u1EBF Gi\u1EDBi", size: "lg", children: [
    /* @__PURE__ */ jsxs17("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx19(
        Dropdown_default,
        {
          label: "Lo\u1EA1i S\u1EF1 Ki\u1EC7n:",
          options: eventTypeOptions,
          value: eventType,
          onChange: (e) => setEventType(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx19(
        Dropdown_default,
        {
          label: "Ph\u1EA1m Vi \u1EA2nh H\u01B0\u1EDFng:",
          options: eventScopeOptions,
          value: eventScope,
          onChange: (e) => setEventScope(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx19(
        Input_default,
        {
          label: "T\u1EEB Kh\xF3a G\u1EE3i \xDD (T\xF9y ch\u1ECDn):",
          value: keywords,
          onChange: (e) => setKeywords(e.target.value),
          placeholder: "V\xED d\u1EE5: ma t\u1ED9c, c\u1ED5 ki\u1EBFm, huy\u1EBFt th\xF9..."
        }
      ),
      /* @__PURE__ */ jsx19(Button_default, { onClick: handleGenerateEvent, isLoading: isLoadingAI, className: "w-full", children: isLoadingAI ? "AI \u0110ang T\u1EA1o..." : "Kh\u1EDFi T\u1EA1o S\u1EF1 Ki\u1EC7n B\u1EB1ng AI" }),
      generatedEventPreview && /* @__PURE__ */ jsxs17("div", { className: "mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-700", children: [
        /* @__PURE__ */ jsx19("h4", { className: "font-semibold text-lg mb-2", children: "Xem Tr\u01B0\u1EDBc S\u1EF1 Ki\u1EC7n:" }),
        /* @__PURE__ */ jsxs17("p", { children: [
          /* @__PURE__ */ jsx19("strong", { children: "T\xEAn:" }),
          " ",
          generatedEventPreview.name
        ] }),
        /* @__PURE__ */ jsxs17("p", { children: [
          /* @__PURE__ */ jsx19("strong", { children: "M\xF4 t\u1EA3:" }),
          " ",
          generatedEventPreview.description
        ] }),
        generatedEventPreview.keyElements && generatedEventPreview.keyElements.length > 0 && /* @__PURE__ */ jsxs17("p", { children: [
          /* @__PURE__ */ jsx19("strong", { children: "Y\u1EBFu t\u1ED1 ch\xEDnh:" }),
          " ",
          generatedEventPreview.keyElements.join(", ")
        ] }),
        /* @__PURE__ */ jsxs17("p", { children: [
          /* @__PURE__ */ jsx19("strong", { children: "Lo\u1EA1i:" }),
          " ",
          generatedEventPreview.type,
          ", ",
          /* @__PURE__ */ jsx19("strong", { children: "Ph\u1EA1m vi:" }),
          " ",
          generatedEventPreview.scope
        ] }),
        /* @__PURE__ */ jsxs17("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ jsx19(Button_default, { onClick: handleAcceptEvent, variant: "primary", children: "Ch\u1EA5p Nh\u1EADn v\xE0 \u0110\u01B0a V\xE0o Truy\u1EC7n" }),
          /* @__PURE__ */ jsx19(Button_default, { onClick: handleGenerateEvent, variant: "outline", isLoading: isLoadingAI, children: "T\u1EA1o L\u1EA1i" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx19("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx19(Button_default, { variant: "ghost", onClick: onClose, children: "\u0110\xF3ng" }) })
  ] });
};
var WorldEventCreatorModal_default = WorldEventCreatorModal;

// components/modals/StorySummaryModal.tsx
import { useState as useState11, useEffect as useEffect9, useCallback as useCallback6 } from "react";
import { jsx as jsx20, jsxs as jsxs18 } from "react/jsx-runtime";
var StorySummaryModal = ({ onClose, storyLog, currentSummary, setGameState, apiKey, useDefaultAPI }) => {
  const [summaryText, setSummaryText] = useState11(currentSummary);
  const [isLoading, setIsLoading] = useState11(false);
  const fetchSummary = useCallback6(async () => {
    if (storyLog.length < 5) {
      setSummaryText("C\xE2u chuy\u1EC7n c\xF2n qu\xE1 ng\u1EAFn \u0111\u1EC3 AI t\xF3m t\u1EAFt hi\u1EC7u qu\u1EA3. H\xE3y ti\u1EBFp t\u1EE5c phi\xEAu l\u01B0u!");
      return;
    }
    setIsLoading(true);
    try {
      const newSummary = await generateStorySummary(apiKey, useDefaultAPI, storyLog);
      setSummaryText(newSummary);
      setGameState((prev) => prev ? { ...prev, currentSummary: newSummary } : null);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummaryText(`L\u1ED7i khi t\u1EA1o t\xF3m t\u1EAFt: ${error instanceof Error ? error.message : "Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i v\u1EDBi AI."}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, useDefaultAPI, storyLog]);
  useEffect9(() => {
    if (!currentSummary && storyLog.length > 0) {
      fetchSummary();
    } else {
      setSummaryText(currentSummary || "Ch\u01B0a c\xF3 t\xF3m t\u1EAFt n\xE0o \u0111\u01B0\u1EE3c t\u1EA1o.");
    }
  }, [currentSummary, storyLog, fetchSummary]);
  return /* @__PURE__ */ jsxs18(Modal_default, { isOpen: true, onClose, title: "T\xF3m T\u1EAFt C\u1ED1t Truy\u1EC7n", size: "lg", children: [
    /* @__PURE__ */ jsx20("div", { className: "max-h-[60vh] overflow-y-auto p-1 mb-4 prose prose-sm sm:prose dark:prose-invert max-w-none text-text-light dark:text-text-dark", children: isLoading ? /* @__PURE__ */ jsxs18("div", { className: "flex items-center justify-center", children: [
      /* @__PURE__ */ jsxs18("svg", { className: "animate-spin h-5 w-5 mr-3", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx20("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx20("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      "AI \u0111ang t\xF3m t\u1EAFt..."
    ] }) : /* @__PURE__ */ jsx20("p", { className: "whitespace-pre-wrap", children: summaryText }) }),
    /* @__PURE__ */ jsxs18("div", { className: "mt-6 flex justify-between items-center", children: [
      /* @__PURE__ */ jsx20(Button_default, { onClick: fetchSummary, isLoading, variant: "outline", children: isLoading ? "\u0110ang T\u1EA3i L\u1EA1i..." : "T\u1EA1o/L\xE0m M\u1EDBi T\xF3m T\u1EAFt" }),
      /* @__PURE__ */ jsx20(Button_default, { onClick: onClose, children: "\u0110\xF3ng" })
    ] })
  ] });
};
var StorySummaryModal_default = StorySummaryModal;

// components/modals/EncyclopediaModal.tsx
import { useState as useState12, useEffect as useEffect10 } from "react";
import { jsx as jsx21, jsxs as jsxs19 } from "react/jsx-runtime";
var EncyclopediaModal = ({ onClose, entries }) => {
  const [selectedCategory, setSelectedCategory] = useState12("NPC" /* NPC */);
  const [selectedEntry, setSelectedEntry] = useState12(null);
  const categories = ["NPC" /* NPC */, "V\u1EADt ph\u1EA9m" /* Item */, "\u0110\u1ECBa \u0111i\u1EC3m" /* Location */, "T\u1ED5 ch\u1EE9c" /* Organization */, "Kh\xE1c" /* Other */];
  useEffect10(() => {
    const initialEntriesInCurrentCategory = entries.filter((entry) => entry.type === selectedCategory);
    if (initialEntriesInCurrentCategory.length > 0) {
      if (!selectedEntry || selectedEntry.type !== selectedCategory) {
        setSelectedEntry(initialEntriesInCurrentCategory[0]);
      }
    } else {
      setSelectedEntry(null);
    }
  }, [selectedCategory, entries, selectedEntry]);
  const filteredEntries = entries.filter((entry) => entry.type === selectedCategory);
  const getCategoryButtonClass = (category) => {
    const base = "px-4 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-card-light dark:focus:ring-offset-card-dark";
    if (selectedCategory === category) {
      return `${base} bg-primary text-white dark:bg-primary-dark dark:text-card-dark shadow-md focus:ring-primary`;
    }
    return `${base} bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-primary/50`;
  };
  return /* @__PURE__ */ jsxs19(Modal_default, { isOpen: true, onClose, title: "B\xE1ch Khoa To\xE0n Th\u01B0", size: "xl", children: [
    /* @__PURE__ */ jsxs19("div", { className: "flex flex-col md:flex-row gap-4 md:gap-x-6 max-h-[70vh]", children: [
      /* @__PURE__ */ jsxs19("div", { className: "w-full md:w-2/5 lg:w-1/3 flex flex-col md:border-r md:border-border-light md:dark:border-border-dark md:pr-4", children: [
        /* @__PURE__ */ jsx21("div", { className: "flex flex-nowrap overflow-x-auto items-center gap-2 mb-3 pb-3 border-b border-border-light dark:border-border-dark", children: categories.map((category) => /* @__PURE__ */ jsxs19(
          "button",
          {
            onClick: () => setSelectedCategory(category),
            className: getCategoryButtonClass(category),
            children: [
              category,
              " (",
              entries.filter((e) => e.type === category).length,
              ")"
            ]
          },
          category
        )) }),
        /* @__PURE__ */ jsxs19("div", { className: "overflow-y-auto space-y-1.5 flex-grow pr-0.5", children: [
          " ",
          filteredEntries.length > 0 ? filteredEntries.map((entry) => /* @__PURE__ */ jsx21(
            "div",
            {
              className: `p-2.5 rounded-md cursor-pointer text-sm transition-colors duration-150 break-words
                    ${selectedEntry?.id === entry.id ? "bg-primary dark:bg-primary-dark text-white dark:text-card-dark font-semibold shadow-md" : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60"}`,
              onClick: () => setSelectedEntry(entry),
              children: entry.name
            },
            entry.id
          )) : /* @__PURE__ */ jsxs19("p", { className: "text-sm text-slate-500 dark:text-slate-400 p-3 italic text-center", children: [
            'Kh\xF4ng c\xF3 m\u1EE5c n\xE0o trong danh m\u1EE5c "',
            selectedCategory,
            '".'
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx21("div", { className: "w-full md:w-3/5 lg:w-2/3 flex flex-col pt-4 md:pt-0", children: selectedEntry ? /* @__PURE__ */ jsxs19("div", { className: "overflow-y-auto h-full p-1 pr-0 text-text-light dark:text-text-dark space-y-2", children: [
        /* @__PURE__ */ jsx21("h3", { className: "text-xl sm:text-2xl font-bold text-primary dark:text-primary-light", children: selectedEntry.name }),
        /* @__PURE__ */ jsxs19("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2 pb-2 border-b border-border-light dark:border-border-dark", children: [
          "Lo\u1EA1i: ",
          /* @__PURE__ */ jsx21("span", { className: "font-medium", children: selectedEntry.type })
        ] }),
        /* @__PURE__ */ jsx21("div", { className: "prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-text-light dark:text-text-dark whitespace-pre-wrap", children: selectedEntry.description || /* @__PURE__ */ jsx21("span", { className: "italic", children: "Kh\xF4ng c\xF3 m\xF4 t\u1EA3 chi ti\u1EBFt." }) })
      ] }) : /* @__PURE__ */ jsxs19("div", { className: "flex flex-col items-center justify-center h-full text-center p-4 md:p-6 text-slate-500 dark:text-slate-400", children: [
        /* @__PURE__ */ jsx21("i", { className: "fas fa-book-reader fa-3x mb-4 opacity-60" }),
        /* @__PURE__ */ jsx21("p", { className: "text-lg mb-1", children: entries.length > 0 ? "Ch\u1ECDn m\u1ED9t m\u1EE5c \u0111\u1EC3 xem chi ti\u1EBFt" : "B\xE1ch khoa to\xE0n th\u01B0 hi\u1EC7n \u0111ang tr\u1ED1ng." }),
        /* @__PURE__ */ jsx21("p", { className: "text-sm", children: entries.length > 0 ? "C\xE1c m\u1EE5c s\u1EBD \u0111\u01B0\u1EE3c li\u1EC7t k\xEA \u1EDF b\u1EA3ng b\xEAn tr\xE1i." : "C\xE1c th\u1EF1c th\u1EC3 s\u1EBD xu\u1EA5t hi\u1EC7n \u1EDF \u0111\xE2y khi \u0111\u01B0\u1EE3c t\u1EA1o trong truy\u1EC7n." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx21("div", { className: "mt-6 flex justify-end border-t border-border-light dark:border-border-dark pt-4", children: /* @__PURE__ */ jsx21(Button_default, { onClick: onClose, children: "\u0110\xF3ng" }) })
  ] });
};
var EncyclopediaModal_default = EncyclopediaModal;

// components/Toast.tsx
import React21, { useEffect as useEffect11, useState as useState13 } from "react";
import { jsx as jsx22, jsxs as jsxs20 } from "react/jsx-runtime";
var Toast = React21.memo(({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState13(false);
  useEffect11(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 350);
  };
  let bgColor = "bg-info-bgLight dark:bg-info-bgDark";
  let textColor = "text-info-textLight dark:text-info-textDark";
  let borderColor = "border-info-borderLight dark:border-info-borderDark";
  let iconColor = "text-info-DEFAULT dark:text-info-light";
  switch (toast.type) {
    case "success":
      bgColor = "bg-success-bgLight dark:bg-success-bgDark";
      textColor = "text-success-textLight dark:text-success-textDark";
      borderColor = "border-success-borderLight dark:border-success-borderDark";
      iconColor = "text-success-DEFAULT dark:text-success-light";
      break;
    case "error":
      bgColor = "bg-error-bgLight dark:bg-error-bgDark";
      textColor = "text-error-textLight dark:text-error-textDark";
      borderColor = "border-error-borderLight dark:border-error-borderDark";
      iconColor = "text-error-DEFAULT dark:text-error-light";
      break;
    case "warning":
      bgColor = "bg-warning-bgLight dark:bg-warning-bgDark";
      textColor = "text-warning-textLight dark:text-warning-textDark";
      borderColor = "border-warning-borderLight dark:border-warning-borderDark";
      iconColor = "text-warning-DEFAULT dark:text-warning-light";
      break;
  }
  const defaultIcon = toast.type === "success" ? "fas fa-check-circle" : toast.type === "error" ? "fas fa-times-circle" : toast.type === "warning" ? "fas fa-exclamation-triangle" : toast.type === "info" ? "fas fa-info-circle" : "fas fa-bell";
  return /* @__PURE__ */ jsxs20(
    "div",
    {
      className: `
        p-4 rounded-xl shadow-2xl border-l-4 
        ${bgColor} ${textColor} ${borderColor}
        flex items-start space-x-3
        transform transition-all duration-300 ease-out
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[110%]"}
      `,
      role: "alert",
      "aria-live": toast.type === "error" ? "assertive" : "polite",
      children: [
        /* @__PURE__ */ jsx22("div", { className: `flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full ${iconColor} ${bgColor === "bg-info-bgLight dark:bg-info-bgDark" ? "" : "bg-opacity-20"} mt-0.5`, children: /* @__PURE__ */ jsx22("i", { className: `${toast.icon || defaultIcon} ${iconColor} text-sm fa-fw` }) }),
        /* @__PURE__ */ jsx22("div", { className: "flex-1 text-sm", children: /* @__PURE__ */ jsx22("p", { className: `font-semibold ${textColor}`, children: toast.message }) }),
        /* @__PURE__ */ jsx22(
          "button",
          {
            onClick: handleClose,
            className: `ml-auto -mr-1 -mt-1 rounded-full p-1.5 hover:bg-black/10 dark:hover:bg-white/10
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-current
                   transition-colors duration-150`,
            "aria-label": "\u0110\xF3ng th\xF4ng b\xE1o",
            children: /* @__PURE__ */ jsx22("i", { className: `fas fa-times text-sm ${textColor} opacity-70 hover:opacity-100` })
          }
        )
      ]
    }
  );
});
var Toast_default = Toast;

// components/ToastContainer.tsx
import { jsx as jsx23, jsxs as jsxs21 } from "react/jsx-runtime";
var ToastContainer = () => {
  const { toasts, removeToast } = useInternalToast();
  if (toasts.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx23("div", { className: "fixed top-5 right-5 z-[200] w-full max-w-sm sm:max-w-md space-y-3 pointer-events-none", children: toasts.map((toast) => /* @__PURE__ */ jsxs21("div", { className: "pointer-events-auto", children: [
    " ",
    /* @__PURE__ */ jsx23(Toast_default, { toast, onClose: () => removeToast(toast.id) })
  ] }, toast.id)) });
};
var ToastContainer_default = ToastContainer;

// components/modals/DeathConfirmationModal.tsx
import { jsx as jsx24, jsxs as jsxs22 } from "react/jsx-runtime";
var DeathConfirmationModal = ({ onClose, onReincarnate }) => {
  return /* @__PURE__ */ jsxs22(Modal_default, { isOpen: true, onClose, title: "Th\xE2n T\u1EED \u0110\u1EA1o Ti\xEAu", size: "md", children: [
    /* @__PURE__ */ jsxs22("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ jsx24("i", { className: "fas fa-skull-crossbones text-6xl text-red-500 dark:text-red-400 mb-6 animate-pulse" }),
      /* @__PURE__ */ jsx24("h4", { className: "text-2xl font-bold text-text-light dark:text-text-dark mb-3", children: "Ng\u01B0\u01A1i \u0111\xE3 k\u1EBFt th\xFAc h\xE0nh tr\xECnh t\u1EA1i \u0111\xE2y." }),
      /* @__PURE__ */ jsx24("p", { className: "text-md text-slate-600 dark:text-slate-300 mb-8 leading-relaxed", children: "Th\xE2n x\xE1c tan bi\u1EBFn, h\u1ED3n ph\xE1ch phi\xEAu t\xE1n n\u01A1i c\u1EEDu tuy\u1EC1n. Li\u1EC7u c\xF3 mu\u1ED1n n\u1EAFm b\u1EAFt m\u1ED9t tia hy v\u1ECDng, b\u1EAFt \u0111\u1EA7u m\u1ED9t ki\u1EBFp lu\xE2n h\u1ED3i m\u1EDBi, vi\u1EBFt n\xEAn m\u1ED9t trang s\u1EED kh\xE1c kh\xF4ng?" })
    ] }),
    /* @__PURE__ */ jsxs22("div", { className: "mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4", children: [
      /* @__PURE__ */ jsxs22(Button_default, { variant: "outline", onClick: onClose, size: "lg", className: "w-full sm:w-auto border-slate-400 text-slate-600 hover:bg-slate-100 dark:border-slate-500 dark:text-slate-300 dark:hover:bg-slate-700", children: [
        /* @__PURE__ */ jsx24("i", { className: "fas fa-bed mr-2" }),
        "An Ngh\u1EC9 C\xF5i \xC2m Ty"
      ] }),
      /* @__PURE__ */ jsxs22(Button_default, { variant: "primary", onClick: onReincarnate, size: "lg", className: "w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700", children: [
        /* @__PURE__ */ jsx24("i", { className: "fas fa-sync-alt mr-2" }),
        "B\u1EAFt \u0110\u1EA7u Lu\xE2n H\u1ED3i"
      ] })
    ] })
  ] });
};
var DeathConfirmationModal_default = DeathConfirmationModal;

// components/modals/SaveGameModal.tsx
import { useState as useState14, useEffect as useEffect12, useCallback as useCallback7 } from "react";
import { jsx as jsx25, jsxs as jsxs23 } from "react/jsx-runtime";
var getAvailableSaveSlots = () => {
  const slots = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX)) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed.gameState && parsed.savedAt) {
            const slotNamePart = key.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length);
            slots.push({
              key,
              displayName: parsed.gameState.setup?.name || slotNamePart.replace(/_/g, " "),
              savedAt: parsed.savedAt
            });
          }
        }
      } catch (e) {
        console.warn(`Could not parse autosave slot ${key}:`, e);
      }
    }
  }
  return slots.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
};
var SaveGameModal = ({
  isOpen,
  onClose,
  gameState,
  onSaveToJsonFile,
  onSaveToLocalStorageSlot
}) => {
  const { addToast } = usePublicToast();
  const [slotName, setSlotName] = useState14("");
  const [existingSlots, setExistingSlots] = useState14([]);
  const refreshSlots = useCallback7(() => {
    setExistingSlots(getAvailableSaveSlots());
  }, []);
  useEffect12(() => {
    if (isOpen) {
      refreshSlots();
      if (gameState && gameState.setup.name) {
        setSlotName(gameState.setup.name);
      } else if (gameState && gameState.setup.id) {
        const storyIdSlotName = gameState.setup.id.startsWith(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX) ? gameState.setup.id.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length) : gameState.setup.id;
        setSlotName(storyIdSlotName.replace(/_/g, " "));
      } else {
        setSlotName(`Game_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`);
      }
    }
  }, [isOpen, gameState, refreshSlots]);
  const handleSaveToSlot = () => {
    if (!gameState) {
      addToast({ message: "Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u game \u0111\u1EC3 l\u01B0u.", type: "error" });
      return;
    }
    const trimmedSlotName = slotName.trim();
    if (!trimmedSlotName) {
      addToast({ message: "Vui l\xF2ng nh\u1EADp t\xEAn cho slot l\u01B0u tr\u1EEF.", type: "warning" });
      return;
    }
    const normalizedSlotIdentifier = trimmedSlotName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
    const fullSlotKey = LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX + normalizedSlotIdentifier;
    const isOverwriting = existingSlots.some((s) => s.key === fullSlotKey);
    onSaveToLocalStorageSlot(gameState, normalizedSlotIdentifier);
    if (isOverwriting) {
      addToast({ message: `\u0110\xE3 ghi \u0111\xE8 slot: "${trimmedSlotName}"`, type: "success", icon: "fas fa-hdd" });
    } else {
      addToast({ message: `Game \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u v\xE0o slot m\u1EDBi: "${trimmedSlotName}"`, type: "success", icon: "fas fa-save" });
    }
    refreshSlots();
  };
  const handleDeleteSlot = (slotKey, displayName) => {
    localStorage.removeItem(slotKey);
    refreshSlots();
    addToast({ message: `\u0110\xE3 x\xF3a slot l\u01B0u tr\u1EEF: "${displayName}"`, type: "info", icon: "fas fa-trash-alt" });
  };
  const handleSelectSlotForOverwrite = (slotInfo) => {
    setSlotName(slotInfo.displayName);
    addToast({ message: `T\xEAn slot "${slotInfo.displayName}" \u0111\xE3 \u0111\u01B0\u1EE3c \u0111i\u1EC1n. Nh\u1EA5n "L\u01B0u V\xE0o Slot N\xE0y" \u0111\u1EC3 ghi \u0111\xE8.`, type: "info", icon: "fas fa-edit" });
  };
  if (!gameState) return null;
  return /* @__PURE__ */ jsxs23(Modal_default, { isOpen, onClose, title: "L\u01B0u Ti\u1EBFn Tr\xECnh Game", size: "lg", children: [
    /* @__PURE__ */ jsxs23("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs23("div", { className: "p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700", children: [
        /* @__PURE__ */ jsxs23("h3", { className: "text-md font-semibold text-text-light dark:text-text-dark mb-2", children: [
          /* @__PURE__ */ jsx25("i", { className: "fas fa-file-download mr-2 text-primary dark:text-primary-light" }),
          "L\u01B0u D\u01B0\u1EDBi D\u1EA1ng File (.json)"
        ] }),
        /* @__PURE__ */ jsx25("p", { className: "text-sm text-slate-600 dark:text-slate-300 mb-3", children: "T\u1EA3i v\u1EC1 m\u1ED9t b\u1EA3n sao c\u1EE7a ti\u1EBFn tr\xECnh game hi\u1EC7n t\u1EA1i. File n\xE0y c\xF3 th\u1EC3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng \u0111\u1EC3 t\u1EA3i l\u1EA1i game sau n\xE0y." }),
        /* @__PURE__ */ jsx25(
          Button_default,
          {
            onClick: () => onSaveToJsonFile(gameState),
            variant: "primary",
            className: "w-full sm:w-auto",
            leftIcon: /* @__PURE__ */ jsx25("i", { className: "fas fa-download" }),
            children: "T\u1EA3i File JSON Xu\u1ED1ng"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs23("div", { className: "p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/60 border-blue-200 dark:border-blue-700", children: [
        /* @__PURE__ */ jsxs23("h3", { className: "text-md font-semibold text-text-light dark:text-text-dark mb-2", children: [
          /* @__PURE__ */ jsx25("i", { className: "fas fa-database mr-2 text-blue-500 dark:text-blue-400" }),
          "L\u01B0u V\xE0o Slot Trong Tr\xECnh Duy\u1EC7t"
        ] }),
        /* @__PURE__ */ jsx25("p", { className: "text-sm text-slate-600 dark:text-slate-300 mb-3", children: "L\u01B0u game v\xE0o m\u1ED9t slot trong b\u1ED9 nh\u1EDB c\u1EE7a tr\xECnh duy\u1EC7t. B\u1EA1n c\xF3 th\u1EC3 \u0111\u1EB7t t\xEAn cho slot n\xE0y. L\u01B0u \xFD: D\u1EEF li\u1EC7u n\xE0y c\xF3 th\u1EC3 b\u1ECB m\u1EA5t n\u1EBFu b\u1EA1n x\xF3a cache tr\xECnh duy\u1EC7t." }),
        /* @__PURE__ */ jsxs23("div", { className: "flex flex-col sm:flex-row gap-2 items-end mb-4", children: [
          /* @__PURE__ */ jsx25(
            Input_default,
            {
              label: "T\xEAn Slot L\u01B0u Tr\u1EEF:",
              value: slotName,
              onChange: (e) => setSlotName(e.target.value),
              placeholder: "V\xED d\u1EE5: Cu\u1ED9c phi\xEAu l\u01B0u c\u1EE7a L\xFD Ti\u1EC3u Long",
              wrapperClass: "flex-grow !mb-0"
            }
          ),
          /* @__PURE__ */ jsx25(
            Button_default,
            {
              onClick: handleSaveToSlot,
              variant: "secondary",
              className: "w-full sm:w-auto mt-2 sm:mt-0",
              disabled: !slotName.trim(),
              leftIcon: /* @__PURE__ */ jsx25("i", { className: "fas fa-save" }),
              children: "L\u01B0u V\xE0o Slot N\xE0y"
            }
          )
        ] }),
        existingSlots.length > 0 && /* @__PURE__ */ jsxs23("div", { children: [
          /* @__PURE__ */ jsx25("h4", { className: "text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5", children: "C\xE1c slot \u0111\xE3 l\u01B0u (nh\u1EA5n \u0111\u1EC3 \u0111i\u1EC1n t\xEAn v\xE0 ghi \u0111\xE8):" }),
          /* @__PURE__ */ jsx25("div", { className: "max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar pr-2", children: existingSlots.map((slot) => /* @__PURE__ */ jsxs23(
            "div",
            {
              className: "p-2.5 border rounded-md bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 flex justify-between items-center text-xs hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors",
              children: [
                /* @__PURE__ */ jsxs23("div", { className: "cursor-pointer flex-grow mr-2", onClick: () => handleSelectSlotForOverwrite(slot), title: `Ch\u1ECDn \u0111\u1EC3 ghi \u0111\xE8 slot: ${slot.displayName}`, children: [
                  /* @__PURE__ */ jsx25("strong", { className: "block text-slate-800 dark:text-slate-100", children: slot.displayName }),
                  /* @__PURE__ */ jsxs23("span", { className: "text-slate-500 dark:text-slate-400", children: [
                    "L\u01B0u l\xFAc: ",
                    new Date(slot.savedAt).toLocaleString("vi-VN")
                  ] })
                ] }),
                /* @__PURE__ */ jsx25(
                  Button_default,
                  {
                    size: "xs",
                    variant: "danger",
                    onClick: () => handleDeleteSlot(slot.key, slot.displayName),
                    className: "!p-1.5 ml-2 flex-shrink-0",
                    title: `X\xF3a slot: ${slot.displayName}`,
                    children: /* @__PURE__ */ jsx25("i", { className: "fas fa-trash-alt" })
                  }
                )
              ]
            },
            slot.key
          )) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx25("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsx25(Button_default, { variant: "outline", onClick: onClose, size: "lg", children: "\u0110\xF3ng" }) })
  ] });
};
var SaveGameModal_default = SaveGameModal;

// App.tsx
import { jsx as jsx26, jsxs as jsxs24 } from "react/jsx-runtime";
var App = () => {
  const { settings, nsfwSettings, userApiKey } = useSettings();
  const { addToast } = usePublicToast();
  const [activeModal, setActiveModal] = useState15(0 /* None */);
  const [gameState, setGameState] = useState15(null);
  const [isLoading, setIsLoading] = useState15(true);
  const saveGameStateToLocalStorage = useCallback8((currentGameState, slotIdentifier) => {
    if (currentGameState && slotIdentifier) {
      const normalizedSlotIdentifier = slotIdentifier.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
      if (!normalizedSlotIdentifier) {
        addToast({ message: "T\xEAn slot kh\xF4ng h\u1EE3p l\u1EC7 sau khi chu\u1EA9n h\xF3a.", type: "error" });
        return;
      }
      const autosaveData = {
        gameState: currentGameState,
        savedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const key = LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX + normalizedSlotIdentifier;
      try {
        localStorage.setItem(key, JSON.stringify(autosaveData));
        console.log(`Game saved to slot "${normalizedSlotIdentifier}" (key: "${key}") at:`, autosaveData.savedAt);
      } catch (error) {
        console.error(`Error saving game to localStorage slot "${normalizedSlotIdentifier}":`, error);
        addToast({ message: `L\u1ED7i khi l\u01B0u v\xE0o slot "${slotIdentifier}". C\xF3 th\u1EC3 b\u1ED9 nh\u1EDB \u0111\u1EA7y.`, type: "error" });
      }
    }
  }, [addToast]);
  const autosaveCurrentStoryCallback = useCallback8((gs) => {
    if (gs.setup?.id) {
      saveGameStateToLocalStorage(gs, gs.setup.id);
    }
  }, [saveGameStateToLocalStorage]);
  const getDefaultStats = useCallback8(() => ({
    hp: { id: "hp", name: "HP", value: 100, maxValue: 100, description: "Sinh l\u1EF1c c\u1EE7a b\u1EA1n. Khi v\u1EC1 0, b\u1EA1n s\u1EBD t\u1EED vong.", icon: "fas fa-heartbeat" },
    mp: { id: "mp", name: "MP", value: 50, maxValue: 50, description: "N\u0103ng l\u01B0\u1EE3ng/Linh l\u1EF1c/N\u1ED9i n\u0103ng \u0111\u1EC3 s\u1EED d\u1EE5ng k\u1EF9 n\u0103ng.", icon: "fas fa-bolt" },
    progression_level: { id: "progression_level", name: "C\u1EA5p \u0110\u1ED9/C\u1EA3nh Gi\u1EDBi", value: "T\xE2n Th\u1EE7", isProgressionStat: true, description: "C\u1EA5p b\u1EADc hi\u1EC7n t\u1EA1i c\u1EE7a b\u1EA1n trong h\u1EC7 th\u1ED1ng tu luy\u1EC7n/ph\xE1t tri\u1EC3n.", icon: "fas fa-star" },
    spiritual_qi: { id: "spiritual_qi", name: "\u0110i\u1EC3m Kinh Nghi\u1EC7m/Linh Kh\xED", value: 0, maxValue: 100, description: "T\xE0i nguy\xEAn c\u1EA7n \u0111\u1EC3 th\u0103ng c\u1EA5p ho\u1EB7c n\xE2ng cao c\u1EA3nh gi\u1EDBi.", icon: "fas fa-arrow-up" },
    intelligence: { id: "intelligence", name: "Tr\xED L\u1EF1c", value: 10, description: "\u1EA2nh h\u01B0\u1EDFng \u0111\u1EBFn kh\u1EA3 n\u0103ng h\u1ECDc h\u1ECFi, t\u1ED1c \u0111\u1ED9 l\u0129nh ng\u1ED9, v\xE0 s\u1EE9c m\u1EA1nh c\u1EE7a m\u1ED9t s\u1ED1 k\u1EF9 n\u0103ng ph\xE9p thu\u1EADt.", icon: "fas fa-brain" },
    constitution: { id: "constitution", name: "Th\u1EC3 Ch\u1EA5t", value: 7, description: "\u1EA2nh h\u01B0\u1EDFng \u0111\u1EBFn HP t\u1ED1i \u0111a, kh\u1EA3 n\u0103ng ch\u1ECBu \u0111\u1EF1ng, v\xE0 kh\xE1ng c\xE1c hi\u1EC7u \u1EE9ng ti\xEAu c\u1EF1c.", icon: "fas fa-heart-circle-bolt" },
    agility: { id: "agility", name: "Nhanh Nh\u1EB9n", value: 7, description: "\u1EA2nh h\u01B0\u1EDFng \u0111\u1EBFn t\u1ED1c \u0111\u1ED9 h\xE0nh \u0111\u1ED9ng, kh\u1EA3 n\u0103ng n\xE9 tr\xE1nh, v\xE0 th\u1EE9 t\u1EF1 ra \u0111\xF2n trong chi\u1EBFn \u0111\u1EA5u.", icon: "fas fa-shoe-prints" },
    luck: { id: "luck", name: "May M\u1EAFn", value: 5, description: "\u1EA2nh h\u01B0\u1EDFng \u0111\u1EBFn t\u1EC9 l\u1EC7 r\u01A1i v\u1EADt ph\u1EA9m qu\xFD hi\u1EBFm, x\xE1c su\u1EA5t th\xE0nh c\xF4ng c\u1EE7a m\u1ED9t s\u1ED1 h\xE0nh \u0111\u1ED9ng, v\xE0 t\u1EA7n su\u1EA5t g\u1EB7p k\u1EF3 ng\u1ED9.", icon: "fas fa-dice-five" },
    damage_output: { id: "damage_output", name: "S\xE1t Th\u01B0\u01A1ng C\u01A1 B\u1EA3n", value: 10, description: "S\u1EE9c m\u1EA1nh \u0111\xF2n \u0111\xE1nh v\u1EADt l\xFD/ph\xE9p thu\u1EADt c\u01A1 b\u1EA3n c\u1EE7a b\u1EA1n.", icon: "fas fa-fist-raised" },
    attack_speed: { id: "attack_speed", name: "T\u1ED1c \u0110\u1ED9 \u0110\xE1nh", value: 1, description: "T\u1EA7n su\u1EA5t ra \u0111\xF2n ho\u1EB7c s\u1ED1 h\xE0nh \u0111\u1ED9ng c\xF3 th\u1EC3 th\u1EF1c hi\u1EC7n trong m\u1ED9t l\u01B0\u1EE3t/kho\u1EA3ng th\u1EDDi gian.", icon: "fas fa-wind" },
    crit_chance: { id: "crit_chance", name: "T\u1EF7 L\u1EC7 Ch\xED M\u1EA1ng", value: 5, maxValue: 100, description: "% c\u01A1 h\u1ED9i g\xE2y s\xE1t th\u01B0\u01A1ng ch\xED m\u1EA1ng (g\u1EA5p b\u1ED9i).", icon: "fas fa-bullseye" },
    crit_damage_bonus: { id: "crit_damage_bonus", name: "Th\u01B0\u1EDFng S\xE1t Th\u01B0\u01A1ng Ch\xED M\u1EA1ng", value: 50, description: "% s\xE1t th\u01B0\u01A1ng \u0111\u01B0\u1EE3c c\u1ED9ng th\xEAm khi g\xE2y ch\xED m\u1EA1ng (VD: 50% ngh\u0129a l\xE0 ST x1.5).", icon: "fas fa-percentage" },
    defense_value: { id: "defense_value", name: "Ph\xF2ng Th\u1EE7", value: 5, description: "Gi\u1EA3m s\xE1t th\u01B0\u01A1ng nh\u1EADn v\xE0o t\u1EEB c\xE1c \u0111\xF2n t\u1EA5n c\xF4ng.", icon: "fas fa-shield-alt" },
    evasion_chance: { id: "evasion_chance", name: "T\u1EF7 L\u1EC7 N\xE9 Tr\xE1nh", value: 5, maxValue: 100, description: "% c\u01A1 h\u1ED9i n\xE9 ho\xE0n to\xE0n m\u1ED9t \u0111\xF2n t\u1EA5n c\xF4ng c\u1EE7a \u0111\u1ED1i th\u1EE7.", icon: "fas fa-running" }
  }), []);
  useEffect13(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.body.style.fontSize = `${settings.fontSize}px`;
  }, [settings.theme, settings.fontSize]);
  useEffect13(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const handleStartNewStory = useCallback8((setupData) => {
    const initialStats = setupData.initialCharacterStats || getDefaultStats();
    if (!initialStats.progression_level) initialStats.progression_level = getDefaultStats().progression_level;
    if (!initialStats.spiritual_qi) initialStats.spiritual_qi = getDefaultStats().spiritual_qi;
    if (!initialStats.intelligence) initialStats.intelligence = getDefaultStats().intelligence;
    if (!initialStats.constitution) initialStats.constitution = getDefaultStats().constitution;
    if (!initialStats.agility) initialStats.agility = getDefaultStats().agility;
    if (!initialStats.luck) initialStats.luck = getDefaultStats().luck;
    const defaultCombatStats = getDefaultStats();
    for (const key in defaultCombatStats) {
      if (["hp", "mp", "progression_level", "spiritual_qi", "intelligence", "constitution", "agility", "luck"].includes(key)) continue;
      if (!initialStats[key]) initialStats[key] = defaultCombatStats[key];
    }
    const initialInventory = setupData.initialInventory || [];
    const newEquippedItems = {};
    if (initialInventory) {
      for (const item of initialInventory) {
        if (item.equippable && item.slot) {
          if (Object.values(EquipmentSlot).includes(item.slot) && !newEquippedItems[item.slot]) {
            newEquippedItems[item.slot] = item.id;
          }
        }
      }
    }
    const newGameState = {
      setup: setupData,
      storyLog: [],
      currentChoices: [],
      currentSummary: "",
      currentWorldEvent: null,
      history: [],
      encyclopedia: [...setupData.entities],
      characterStats: initialStats,
      inventory: initialInventory,
      equippedItems: newEquippedItems,
      unlockedAchievements: [],
      characterSkills: setupData.initialSkills || [],
      isInitialStoryGenerated: false,
      isRoleplayModeActive: false,
      isAuthorInterventionModeActive: false,
      npcRelationships: {},
      objectives: [],
      activeSidebarTab: "stats",
      currency: settings.currencyEnabled ? { name: "\u0110\u1ED3ng", amount: 100, icon: "fas fa-coins" } : void 0,
      currentTime: settings.timeSystemEnabled ? "08:00 Ng\xE0y 1, Th\xE1ng 1, N\u0103m 1 (S\xE1ng s\u1EDBm)" : void 0
    };
    setGameState(newGameState);
    setActiveModal(0 /* None */);
    addToast({ message: `B\u1EAFt \u0111\u1EA7u cu\u1ED9c phi\xEAu l\u01B0u m\u1EDBi: "${setupData.name || "Kh\xF4ng t\xEAn"}"!`, type: "success", icon: "fas fa-play-circle" });
  }, [addToast, getDefaultStats, settings.currencyEnabled, settings.timeSystemEnabled]);
  const processLoadedGameState = useCallback8((loadedGameState) => {
    const defaultBaseStats = getDefaultStats();
    const completeGameToLoad = {
      ...loadedGameState,
      setup: loadedGameState.setup || {
        id: `loaded-${Date.now()}`,
        world: { theme: "Unknown", context: "Unknown", tone: "Unknown" },
        character: { name: "Unknown", gender: "Unknown", summary: "", traits: [], goal: "" },
        entities: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      storyLog: loadedGameState.storyLog || [],
      currentChoices: loadedGameState.currentChoices || [],
      currentSummary: loadedGameState.currentSummary || "",
      currentWorldEvent: loadedGameState.currentWorldEvent || null,
      history: loadedGameState.history || [],
      encyclopedia: loadedGameState.encyclopedia || loadedGameState.setup?.entities || [],
      characterStats: loadedGameState.characterStats || defaultBaseStats,
      inventory: loadedGameState.inventory || [],
      equippedItems: loadedGameState.equippedItems || {},
      unlockedAchievements: loadedGameState.unlockedAchievements || [],
      characterSkills: loadedGameState.characterSkills || [],
      isInitialStoryGenerated: loadedGameState.isInitialStoryGenerated !== void 0 ? loadedGameState.isInitialStoryGenerated : loadedGameState.storyLog && loadedGameState.storyLog.length > 0,
      isRoleplayModeActive: loadedGameState.isRoleplayModeActive || false,
      isAuthorInterventionModeActive: loadedGameState.isAuthorInterventionModeActive || false,
      npcRelationships: loadedGameState.npcRelationships || {},
      objectives: loadedGameState.objectives || [],
      activeSidebarTab: loadedGameState.activeSidebarTab && loadedGameState.activeSidebarTab !== "actions" ? loadedGameState.activeSidebarTab : "stats",
      currency: settings.currencyEnabled && loadedGameState.currency ? loadedGameState.currency : settings.currencyEnabled ? { name: "\u0110\u1ED3ng", amount: 0, icon: "fas fa-coins" } : void 0,
      currentTime: settings.timeSystemEnabled && loadedGameState.currentTime ? loadedGameState.currentTime : settings.timeSystemEnabled ? "Th\u1EDDi gian kh\xF4ng x\xE1c \u0111\u1ECBnh" : void 0
    };
    if (!completeGameToLoad.characterStats.progression_level) {
      completeGameToLoad.characterStats.progression_level = defaultBaseStats.progression_level;
    }
    if (!completeGameToLoad.characterStats.spiritual_qi) {
      completeGameToLoad.characterStats.spiritual_qi = defaultBaseStats.spiritual_qi;
    }
    if (!completeGameToLoad.characterStats.intelligence) {
      completeGameToLoad.characterStats.intelligence = defaultBaseStats.intelligence;
    }
    if (!completeGameToLoad.characterStats.constitution) {
      completeGameToLoad.characterStats.constitution = defaultBaseStats.constitution;
    }
    if (!completeGameToLoad.characterStats.agility) {
      completeGameToLoad.characterStats.agility = defaultBaseStats.agility;
    }
    if (!completeGameToLoad.characterStats.luck) {
      completeGameToLoad.characterStats.luck = defaultBaseStats.luck;
    }
    const combatStatKeys = ["damage_output", "attack_speed", "crit_chance", "crit_damage_bonus", "defense_value", "evasion_chance"];
    combatStatKeys.forEach((key) => {
      if (!completeGameToLoad.characterStats[key]) {
        const defaultStat = defaultBaseStats[key];
        if (defaultStat) {
          completeGameToLoad.characterStats[key] = defaultStat;
        }
      }
    });
    return completeGameToLoad;
  }, [getDefaultStats, settings.currencyEnabled, settings.timeSystemEnabled]);
  const handleLoadStory = useCallback8((loadedGameState, source = "file") => {
    const processedGameState = processLoadedGameState(loadedGameState);
    setGameState(processedGameState);
    setActiveModal(0 /* None */);
    const sourceText = source === "file" ? "t\u1EEB file" : "t\u1EEB slot l\u01B0u tr\u1EEF";
    addToast({ message: `\u0110\xE3 t\u1EA3i game "${processedGameState.setup.name || "Game \u0111\xE3 l\u01B0u"}" ${sourceText}!`, type: "success", icon: "fas fa-upload" });
  }, [addToast, processLoadedGameState]);
  const handleLoadStoryFromSlot = useCallback8((slotKey) => {
    const slotJson = localStorage.getItem(slotKey);
    if (slotJson) {
      try {
        const slotInfo = JSON.parse(slotJson);
        if (slotInfo && slotInfo.gameState) {
          handleLoadStory(slotInfo.gameState, "autosave_slot");
        } else {
          addToast({ message: `D\u1EEF li\u1EC7u trong slot "${slotKey.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length).replace(/_/g, " ")}" kh\xF4ng h\u1EE3p l\u1EC7.`, type: "error" });
        }
      } catch (error) {
        addToast({ message: `L\u1ED7i khi \u0111\u1ECDc slot "${slotKey.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length).replace(/_/g, " ")}".`, type: "error" });
        console.error(`Error parsing slot ${slotKey}:`, error);
      }
    } else {
      addToast({ message: `Kh\xF4ng t\xECm th\u1EA5y slot "${slotKey.substring(LOCAL_STORAGE_AUTOSAVE_KEY_PREFIX.length).replace(/_/g, " ")}".`, type: "warning" });
    }
  }, [handleLoadStory, addToast]);
  const quitGame = useCallback8(() => {
    if (gameState && gameState.setup.id) {
      saveGameStateToLocalStorage(gameState, gameState.setup.id);
      addToast({ message: `\u0110\xE3 t\u1EF1 \u0111\u1ED9ng l\u01B0u ti\u1EBFn tr\xECnh game "${gameState.setup.name || gameState.setup.id}". H\u1EB9n g\u1EB7p l\u1EA1i!`, type: "info", icon: "fas fa-save" });
    } else {
      addToast({ message: "\u0110\xE3 tho\xE1t game. H\u1EB9n g\u1EB7p l\u1EA1i!", type: "info", icon: "fas fa-door-open" });
    }
    setGameState(null);
    setActiveModal(0 /* None */);
  }, [gameState, saveGameStateToLocalStorage, addToast]);
  const handleSaveToJsonFile = useCallback8((gs) => {
    if (!gs) {
      addToast({ message: "Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u game \u0111\u1EC3 l\u01B0u.", type: "error" });
      return;
    }
    try {
      const gameJson = JSON.stringify(gs, null, 2);
      const blob = new Blob([gameJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const setupNameNormalized = gs.setup.name?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "aisim_save";
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/:/g, "-");
      a.href = url;
      a.download = `${setupNameNormalized}_${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast({ message: "Game \u0111\xE3 b\u1EAFt \u0111\u1EA7u t\u1EA3i xu\u1ED1ng d\u01B0\u1EDBi d\u1EA1ng file JSON!", type: "success", icon: "fas fa-file-download" });
    } catch (error) {
      console.error("Error saving game to JSON:", error);
      addToast({ message: "L\u1ED7i khi l\u01B0u game ra file JSON.", type: "error" });
    }
  }, [addToast]);
  if (isLoading) {
    return /* @__PURE__ */ jsxs24("div", { className: "flex flex-col items-center justify-center min-h-screen text-xl text-primary dark:text-primary-light bg-background-light dark:bg-background-dark p-4", children: [
      /* @__PURE__ */ jsxs24("svg", { className: "animate-spin h-12 w-12 text-primary dark:text-primary-light mb-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx26("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx26("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      /* @__PURE__ */ jsx26("p", { className: "font-semibold", children: "\u0110ang t\u1EA3i \u1EE9ng d\u1EE5ng..." }),
      /* @__PURE__ */ jsx26("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Chu\u1EA9n b\u1ECB b\u01B0\u1EDBc v\xE0o th\u1EBF gi\u1EDBi huy\u1EC1n \u1EA3o!" })
    ] });
  }
  const renderModal = () => {
    switch (activeModal) {
      case 1 /* APISettings */:
        return /* @__PURE__ */ jsx26(ApiSettingsModal_default, { onClose: () => setActiveModal(0 /* None */) });
      case 2 /* NSFWSettings */:
        return /* @__PURE__ */ jsx26(NsfwSettingsModal_default, { onClose: () => setActiveModal(0 /* None */) });
      case 3 /* GeneralSettings */:
        return /* @__PURE__ */ jsx26(GeneralSettingsModal_default, { onClose: () => setActiveModal(0 /* None */) });
      case 4 /* Guide */:
        return /* @__PURE__ */ jsx26(GuideModal_default, { onClose: () => setActiveModal(0 /* None */) });
      case 5 /* NewStorySetup */:
        return /* @__PURE__ */ jsx26(
          NewStorySetupModal_default,
          {
            onClose: () => setActiveModal(0 /* None */),
            onStartStory: handleStartNewStory
          }
        );
      case 6 /* LoadStory */:
        return /* @__PURE__ */ jsx26(
          LoadStoryModal_default,
          {
            isOpen: activeModal === 6 /* LoadStory */,
            onClose: () => setActiveModal(0 /* None */),
            onLoadStoryFromFile: (loadedState) => handleLoadStory(loadedState, "file"),
            onLoadStoryFromSlot: handleLoadStoryFromSlot
          }
        );
      case 7 /* WorldEventCreator */:
        return gameState ? /* @__PURE__ */ jsx26(
          WorldEventCreatorModal_default,
          {
            onClose: () => setActiveModal(0 /* None */),
            gameState,
            setGameState
          }
        ) : null;
      case 8 /* StorySummary */:
        return gameState ? /* @__PURE__ */ jsx26(
          StorySummaryModal_default,
          {
            onClose: () => setActiveModal(0 /* None */),
            storyLog: gameState.storyLog,
            currentSummary: gameState.currentSummary,
            setGameState,
            apiKey: userApiKey,
            useDefaultAPI: settings.useDefaultAPI
          }
        ) : null;
      case 9 /* Encyclopedia */:
        return gameState ? /* @__PURE__ */ jsx26(
          EncyclopediaModal_default,
          {
            onClose: () => setActiveModal(0 /* None */),
            entries: gameState.encyclopedia
          }
        ) : null;
      case 10 /* DeathConfirmation */:
        return /* @__PURE__ */ jsx26(
          DeathConfirmationModal_default,
          {
            onClose: () => setActiveModal(0 /* None */),
            onReincarnate: quitGame
          }
        );
      case 11 /* SaveGame */:
        return /* @__PURE__ */ jsx26(
          SaveGameModal_default,
          {
            isOpen: activeModal === 11 /* SaveGame */,
            onClose: () => setActiveModal(0 /* None */),
            gameState,
            onSaveToJsonFile: handleSaveToJsonFile,
            onSaveToLocalStorageSlot: saveGameStateToLocalStorage
          }
        );
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs24("div", { className: `min-h-screen flex flex-col transition-colors duration-300 ease-in-out ${settings.theme === "dark" ? "dark bg-background-dark text-text-dark" : "bg-background-light text-text-light"}`, children: [
    /* @__PURE__ */ jsx26(ToastContainer_default, {}),
    renderModal(),
    gameState ? /* @__PURE__ */ jsx26(
      GamePage,
      {
        gameState,
        setGameState,
        openModal: setActiveModal,
        quitGame,
        nsfwSettings,
        autosaveCurrentStory: autosaveCurrentStoryCallback
      }
    ) : /* @__PURE__ */ jsx26(HomePage_default, { openModal: setActiveModal })
  ] });
};
var App_default = App;

// index.tsx
import { jsx as jsx27, jsxs as jsxs25 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
var root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsx27(React24.StrictMode, { children: /* @__PURE__ */ jsx27(SettingsProvider, { children: /* @__PURE__ */ jsxs25(InternalToastProvider, { children: [
    " ",
    /* @__PURE__ */ jsx27(App_default, {})
  ] }) }) })
);
