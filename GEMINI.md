# TodoApp: Solo Leveling Quest Log

A production-quality To-Do List mobile application built with **React Native CLI**, themed after the "Solo Leveling" anime "System" interface.

## 🚀 Project Overview
- **Framework:** React Native 0.76.1
- **Engine:** Hermes
- **Architecture:** **Stable Bridge Mode**. All "New Architecture" (Fabric) code has been removed for maximum stability on Android 14/15.
- **Styling:** Vanilla StyleSheet with a dark mode "System" aesthetic (Neon Blue/Glows).
- **Persistence:** Local data storage via `@react-native-async-storage/async-storage`.
- **System Features:** Quest Categories (Regular, One-Time, LongTerm), 5 Skill Trees (Coding, Workout, Cultural, Sports, Mental), Rep counters for physical quests, XP/Leveling system, Attribute Points, Penalty Quests, Player Registration, and Calendar History.

## 🛠️ Building and Running

### Prerequisites
- **Node.js:** >= 18
- **Java JDK:** **Exactly 17** 
- **Android SDK:** Platform 35, Build Tools 35.0.0.
- **Gradle:** 8.10.2

### Key Commands
- **Install Dependencies:** `npm install`
- **Start Metro Bundler:** `npm start`
- **Run Android:** `npx react-native run-android --mode=release --no-packager`

## 📂 Native Configuration (Fixes Applied - Updated April 15, 2026)

### Key Android Configuration
- **Custom Icons:** Integrated via `generate-icons.js` (Resized from source to all densities).
- **Safe Area Fix:** Global `paddingTop` added in `App.tsx` for notch/status bar compatibility.
- **MainApplication.kt:** Initialized `SoLoader` with `OpenSourceMergedSoMapping`.

## 📂 Folder Structure
- **`src/components/`**: `TaskItem.tsx`, `Sidebar.tsx` (System Menu), `LevelUpModal.tsx`, `BottomTabBar.tsx` (Depreciated)
- **`src/screens/`**: `HomeScreen.tsx`, `SkillTreeScreen.tsx`, `CalendarScreen.tsx` (Chronicles), `RegistrationScreen.tsx`, `SettingsScreen.tsx`, `TestingScreen.tsx` (Console)
- **`src/storage/`**: `taskStorage.ts` (Includes last-used settings logic and data clearing)
- **`src/utils/`**: `templates.ts` (Quick Quest Presets), `theme.ts` (Updated palette), `types.ts` (Updated schema)

## ✅ Build Status (April 15, 2026)

### Major Features Implemented
1. ✅ **System Navigation**: Animated Sidebar (Glitch Effect) replacing bottom tabs.
2. ✅ **Input Efficiency**: Preset Dropdown integrated into Quest Name input.
3. ✅ **Rapid Tracking**: Multi-increment buttons (`+10`, `+25`) for workouts.
4. ✅ **Smart Categorization**: Sectioned list for Daily/One-Time/Long-Term quests.
5. ✅ **Recency Logic**: App remembers last used skill/category.
6. ✅ **Penalty System**: Auto-detects missed daily quests and issues "Physical Conditioning" penalties.
7. ✅ **Player Registration**: Authorization screen for initial setup.
8. ✅ **System Chronicles**: Calendar view for tracking completion history.
9. ✅ **Visual Feedback**: Level-Up modal, improved layout responsiveness, and Hexagon Radar Stats Chart.
10. ✅ **Memo Pad**: Dedicated screen for non-RPG tasks.

## 🎯 Next Steps (Post-Implementation)
1. Add native push notification integration via `@notifee/react-native`.
2. Implement custom "System" sound effects for actions.
3. Add detailed quest view for task logs.


