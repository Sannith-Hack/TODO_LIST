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
- **Gradle Fixes:** Applied `react-native-svg` build.gradle override for compatibility with modern Gradle.

## 📂 Folder Structure
- **`src/components/`**: `TaskItem.tsx`, `Sidebar.tsx` (System Menu), `LevelUpModal.tsx`, `BottomTabBar.tsx` (Depreciated)
- **`src/screens/`**: `HomeScreen.tsx`, `SkillTreeScreen.tsx`, `CalendarScreen.tsx` (Chronicles), `RegistrationScreen.tsx`, `SettingsScreen.tsx`, `TestingScreen.tsx` (Console)
- **`src/storage/`**: `taskStorage.ts` (Includes last-used settings logic and data clearing)
- **`src/utils/`**: `templates.ts` (Quick Quest Presets), `theme.ts` (Updated palette), `types.ts` (Updated schema)

## ✅ Build Status (April 15, 2026) - **STABLE**

### Core Features Implemented
1. ✅ **System Navigation**: Animated Sidebar (Glitch Effect).
2. ✅ **Quest Log**: Fully scrollable, sectioned list for Daily, One-Time, and Long-Term Quests.
3. ✅ **Player Registration**: Initial, one-time setup for user personalization.
4. ✅ **Skill & XP System**: 5 Skill Trees with XP gain, leveling, and attribute point allocation.
5. ✅ **Status Window**: Visual "System" UI with a crash-proof Stats Radar Chart.
6. ✅ **Memo Pad**: Dedicated screen for non-RPG, real-world tasks.
7. ✅ **System Chronicles**: Calendar view for tracking completion history.
8. ✅ **Penalty System**: Auto-detects missed daily quests and issues penalties.

### Input & UX Fixes
1. ✅ **Keyboard Stability**: Input fields are now stable and do not lose focus.
2. ✅ **Quest Presets**: One-tap quest creation is fully functional.
3. ✅ **Future Scheduling**: Date-offset selector for One-Time/Long-Term quests is integrated.
4. ✅ **Rapid Rep Tracking**: `+10`/`+25` buttons are fully operational.
5. ✅ **Layout Engine**: `HomeScreen` rebuilt for performance and scrolling.

## 🎯 Next Steps (Optional Enhancements)
1. Implement native push notification triggers via `@notifee/react-native`.
2. Add custom "System" sound effects for key actions.
3. Build a detailed quest view for task logs and descriptions.
4. Enhance the Radar Chart with more dynamic animations.


