# TodoApp: Solo Leveling Quest Log

A production-quality To-Do List mobile application built with **React Native CLI**, themed after the "Solo Leveling" anime "System" interface.

## 🚀 Project Overview
- **Framework:** React Native 0.76.1
- **Engine:** Hermes
- **Architecture:** **Stable Bridge Mode**. All "New Architecture" (Fabric) code has been removed for maximum stability on Android 14/15. (Note: `newArchEnabled=false` enforced in `gradle.properties` to prevent Reanimated initialization crashes).
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

## ✅ Build Status (April 21, 2026 - v1.0.7) - **STABLE**

### Core Features Implemented
1. ✅ **System Navigation**: Animated Sidebar (Glitch Effect).
2. ✅ **Quest Log**: Fully scrollable, sectioned list for Daily, One-Time, and Long-Term Quests.
3. ✅ **Player Registration**: Initial, one-time setup for user personalization.
4. ✅ **Skill & XP System**: 5 Skill Trees with functional XP gain and Leveling logic.
5. ✅ **Status Window**: Manual Attribute Point allocation (STR, AGI, INT, SEN, VIT) with real-time Radar Chart.
6. ✅ **Shadow Streak System**: Tracks daily quest protocols with XP multipliers (up to 2x) and Shadow Army extractions (Igris, Tank, Iron, Beru).
7. ✅ **Hunter's Report**: Advanced Growth Analytics with a custom-built SVG XP chart (30-day view).
8. ✅ **Memo Pad**: Dedicated screen for non-RPG, real-world tasks with search and archive.
9. ✅ **System Chronicles**: Calendar view for tracking completion history.
10. ✅ **Penalty System**: Auto-detects missed daily quests and issues penalties.

### Recent Enhancements & UI/UX
1. ✅ **Dual-Theme Protocol**: Integrated "System: Dark" and "System: White" modes for environmental visibility.
2. ✅ **Manual Stats**: 3 Stat Points granted per level for customized player builds.
3. ✅ **Achievement System**: Behavior-based titles (e.g., "Early Riser", "Iron Body") with UI badges.
4. ✅ **Visual Evolution**: Rank-based dynamic theme (colors/glows evolve from E-Rank Blue to S-Rank Gold).
5. ✅ **Tactile Feedback**: Haptic feedback and System-themed SFX for Quest Completion and Level Up events.
6. ✅ **Advanced Task Management**: Sub-Quests, Smart Patterns (Weekly/Custom), and real-time Search/Filter.
7. ✅ **Particle System**: High-end "shatter" particle effect using Reanimated on quest deletion.
8. ✅ **System Stability**: 
    *   **Removed** redundant `react-native-svg` and `react-native-svg-charts` libraries to fix "undefined property" crashes on React Native 0.76.
    *   **Implemented** a custom, 100% crash-proof Growth Analytics engine using standard View components.
    *   **Applied** robust data fallbacks for legacy player stats to prevent startup failures.
9. ✅ **Global State Synchronization**: Centralized stats management ensures real-time XP/Level updates across all screens.

## 🎯 Next Steps (Optional Enhancements)
1. Build a detailed quest view for task logs and descriptions.
2. Enhance the Radar Chart with more dynamic animations.
3. Implement a Sub-Quest (Checklist) system for Long-Term goals.
4. Add cloud sync or manual JSON export/import for user data.


