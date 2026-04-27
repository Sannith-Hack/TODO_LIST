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

## 📂 Folder Structure & Documentation (v1.1.0)
- **`src/components/`**: 
    * `TaskItem.tsx`: Theme-aware quest card with Rank Badges and dynamic XP values.
    * `Sidebar.tsx`: Glitch-animated navigation menu with real-time rank-based glows.
    * `ParticleEffect.tsx`: Reanimated-based "dissolve" effect for quest deletion.
    * `RadarChart.tsx`: Mathematically centered native View-based pentagon for attribute visualization.
- **`src/screens/`**: 
    * `HomeScreen.tsx`: Core logic for daily protocol resets and quest lifecycle management.
    * `SkillTreeScreen.tsx`: Player status window with manual Attribute allocation and Shadow Assignments.
    * `DungeonScreen.tsx`: Visual "Gate" exploration map with floor-based progression.
    * `HunterReportScreen.tsx`: Growth analytics using a custom high-performance View-based bar chart.
- **`src/utils/`**:
    * `engine.ts`: Centralized completion logic (XP, Dungeons, Level-ups).
    * `complexityModel.ts`: Heuristic semantic analysis for dynamic XP allocation.
    * `sovereign.ts`: "The Sovereign's Voice" Text-to-Speech (TTS) manager.
    * `theme.ts`: Dynamic theme engine supporting `SYSTEM: DARK` and `SYSTEM: WHITE`.

## ✅ Build Status (April 27, 2026 - v1.1.0) - **STABLE**

### Core Features Implemented
1. ✅ **The Sovereign's Voice**: Authoritative Text-to-Speech (TTS) for system announcements.
2. ✅ **Gate Exploration**: Comprehensive Dungeon Map with floor-based descent mechanics.
3. ✅ **Semantic Intelligence**: Heuristic model for dynamic XP/Rank allocation based on quest complexity.
4. ✅ **Shadow Soldiers 2.0**: Interactive assignment system providing strategic XP boosts.
5. ✅ **Stability Visuals**: 100% crash-proof mathematically centered Radar Chart (SVG-free).
6. ✅ **Notification Sync**: Proactive clearing of penalty alerts upon daily protocol completion.

## 🎯 Future Protocol (Planned Enhancements)
1. 🎒 **System Inventory**: "Item" drops for completing S-Rank quests (e.g., "Reset Scroll" to clear a penalty).
2. ☁️ **Supabase Cloud Sync**: Real-time cross-device synchronization and player progress backup.
3. ⚔️ **Shadow Extraction 3.0**: Advanced interactive animations and level-up paths for shadow soldiers.
4. 🗺️ **Job Change Protocol**: Visual progression paths and specialized hunter classes.


