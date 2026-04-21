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

## 📂 Folder Structure & Documentation (v1.0.7)
- **`src/components/`**: 
    * `TaskItem.tsx`: Theme-aware quest card with streak XP multiplier visibility (`x1.2 XP`).
    * `Sidebar.tsx`: Glitch-animated navigation menu with real-time rank-based glows.
    * `ParticleEffect.tsx`: Reanimated-based "dissolve" effect for quest deletion.
    * `RadarChart.tsx`: Stability-first placeholder (SVG-free to prevent runtime crashes).
- **`src/screens/`**: 
    * `HomeScreen.tsx`: Core logic for daily protocol resets, streak tracking, and XP gain.
    * `SkillTreeScreen.tsx`: Player status window with manual Attribute allocation (STR/INT/etc.).
    * `HunterReportScreen.tsx`: Growth analytics using a custom high-performance View-based bar chart.
    * `TestingScreen.tsx`: Developer console for time-travel (day resets) and XP injection.
- **`src/utils/`**:
    * `theme.ts`: Dynamic theme engine supporting `SYSTEM: DARK` and `SYSTEM: WHITE`.
    * `feedback.ts`: Centralized haptics and "System" audio notification manager.

## ✅ Build Status (April 21, 2026 - v1.0.7) - **STABLE**

### Core Features Implemented
1. ✅ **Dual-Theme Protocol**: Full support for Dark and White themes across all system windows.
2. ✅ **Shadow Streak System**: Automated tracking of daily protocols with cumulative XP multipliers.
3. ✅ **Manual Stats**: 3 Attribute Points per level-up to be distributed into STR, AGI, INT, SEN, or VIT.
4. ✅ **Growth Analytics**: A 100% crash-proof Hunter's Report with 30-day XP visualization.
5. ✅ **Stability Engine**: Total removal of unstable SVG libraries; replaced with native View-based rendering for 100% uptime on Android 14/15.

## 🎯 Future Protocol (Planned Enhancements)
1. ☁️ **Supabase Cloud Sync**: Real-time cross-device synchronization and player progress backup.
2. 🎒 **System Inventory**: "Item" drops for completing S-Rank quests (e.g., "Reset Scroll" to clear a penalty).
3. 🗺️ **Dungeon Map**: A visual progression path representing different life categories as "Gates."
4. ⚔️ **Shadow Extraction 2.0**: Interactive animations when unlocking new Shadow Soldiers.
5. 📊 **Advanced Radar**: Implementation of a custom-coded SVG radar chart for real-time stat visualization.


