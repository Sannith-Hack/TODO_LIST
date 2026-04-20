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

## 📂 Native Configuration (Fixes Applied - Updated April 20, 2026)

### Key Android Configuration
- **Custom Icons:** Integrated via `generate-icons.js` (Resized from source to all densities).
- **Safe Area Fix:** Global `paddingTop` added in `App.tsx` for notch/status bar compatibility.
- **MainApplication.kt:** Initialized `SoLoader` with `OpenSourceMergedSoMapping`.
- **Gradle Fixes:** Applied `react-native-svg` build.gradle override for compatibility with modern Gradle.
- **System Audio:** Raw resource directory (`android/app/src/main/res/raw`) initialized for Quest and Level-Up SFX.

## 📂 Folder Structure
- **`src/components/`**: `TaskItem.tsx`, `Sidebar.tsx` (System Menu), `LevelUpModal.tsx`, `RadarChart.tsx`
- **`src/screens/`**: `HomeScreen.tsx`, `SkillTreeScreen.tsx`, `CalendarScreen.tsx` (Chronicles), `RegistrationScreen.tsx`, `SettingsScreen.tsx`, `MemoScreen.tsx`, `LoadingScreen.tsx`
- **`src/storage/`**: `taskStorage.ts` (Includes last-used settings logic and data clearing)
- **`src/utils/`**: `templates.ts`, `theme.ts`, `types.ts`, `notifications.ts`, `feedback.ts` (Haptics/Audio)

## ✅ Build Status (April 20, 2026) - **STABLE**

### Core Features Implemented
1. ✅ **System Navigation**: Animated Sidebar (Glitch Effect).
2. ✅ **Quest Log**: Fully scrollable, sectioned list for Daily, One-Time, and Long-Term Quests.
3. ✅ **Player Registration**: Initial, one-time setup for user personalization.
4. ✅ **Skill & XP System**: 5 Skill Trees with functional XP gain and Leveling logic.
5. ✅ **Status Window**: Visual "System" UI with a crash-proof Stats Radar Chart.
6. ✅ **Memo Pad**: Dedicated screen for non-RPG, real-world tasks.
7. ✅ **System Chronicles**: Calendar view for tracking completion history.
8. ✅ **Penalty System**: Auto-detects missed daily quests and issues penalties.

### Recent Enhancements & UI/UX
1. ✅ **Auto-Sorting**: Completed quests and memos automatically move to the bottom of the list.
2. ✅ **Smooth Transitions**: Integrated `LayoutAnimation` for fluid reordering and state updates.
3. ✅ **Tactile Feedback**: Haptic feedback (Impact/Notification) added to all major system interactions.
4. ✅ **Audio Integration**: System-themed SFX for Quest Completion and Level Up events.
5. ✅ **Level Up Protocol**: Integrated `LevelUpModal` with XP calculations in the Quest Log.
6. ✅ **Keyboard Stability**: Input fields are now stable and do not lose focus.
7. ✅ **Advanced Task Management**:
    *   **Sub-Quests**: Multi-step checklists for Long-Term goals.
    *   **Smart Patterns**: Selection for Daily, Weekly, or Custom recurring cycles.
    *   **Search & Archive**: Real-time filtering and dedicated archive storage for Quest Log and Memo Pad.

## 🎯 Next Steps (Optional Enhancements)
1. Build a detailed quest view for task logs and descriptions.
2. Enhance the Radar Chart with more dynamic animations.
3. Implement a Sub-Quest (Checklist) system for Long-Term goals.
4. Add cloud sync or manual JSON export/import for user data.


