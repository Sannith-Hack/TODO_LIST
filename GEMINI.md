# TodoApp: Solo Leveling Quest Log

A production-quality To-Do List mobile application built with **React Native CLI**, themed after the "Solo Leveling" anime "System" interface.

## 🚀 Project Overview
- **Framework:** React Native 0.76.1
- **Engine:** JSCore (Stable, no New Architecture)
- **Architecture:** **Stable Bridge Mode**. All "New Architecture" (Fabric) code has been removed for maximum stability on Android 14/15.
- **Styling:** Vanilla StyleSheet with a dark mode "System" aesthetic (Neon Blue/Glows).
- **Persistence:** Local data storage via `@react-native-async-storage/async-storage`.
- **JS Executor:** JSCore (via jsc-android) - replaced Hermes due to native library packaging issues with React Native 0.76.1

## 🛠️ Building and Running

### Prerequisites
- **Node.js:** >= 18
- **Java JDK:** **Exactly 17** (Critical: Higher versions like 21/26 cause `IBM_SEMERU` and Kotlin metadata errors).
- **Android SDK:** Platform 35, Build Tools 35.0.0.
- **Gradle:** 8.10.2 (Wrapper forced to this version for plugin compatibility).

### Key Commands
- **Install Dependencies:** `npm install`
- **Start Metro Bundler:** `npm start`
- **Run Android:** `npx react-native run-android`
- **Nuclear Clean:** `Get-Process | Where-Object { $_.Name -match "java" -or $_.Name -match "gradle" } | Stop-Process -Force; Remove-Item -Recurse -Force android/.gradle, android/app/build`

## 📂 Native Configuration (Fixes Applied - Updated April 14, 2026)

### MainApplication.kt (Fixed)
Location: `android/app/src/main/java/com/todoapp/MainApplication.kt`

**Issue:** App was crashing with `UnsatisfiedLinkError: dlopen failed: library "libreact_featureflagsjni.so" not found`
**Fix:** Removed `reactHost` property override that was calling `getDefaultReactHost()`, which attempted to load New Architecture entry point.

**Status:** ✅ Resolved - Removed problematic New Architecture initialization

### build.gradle Configuration (Updated)
Location: `android/app/build.gradle`

**Changes:**
1. Set `hermesEnabled = false` (was `true`) - Hermes prefab library had packaging issues with RN 0.76.1
2. Using JSCore engine instead (default when Hermes disabled)
3. `useLegacyPackaging = true` enabled for native library inclusion
4. Universal APK generation enabled (all ABIs: arm64-v8a, armeabi-v7a, x86, x86_64)

### package.json (Updated)
Location: `package.json`

**Added Dependency:**
```json
"jsc-android": "^250231.0.0"
```
This provides JavaScriptCore native executor library for proper JS execution on Android devices.

### Key Android Configuration
1. **Package Name:** `com.todoapp`
2. **Target SDK:** 35 (Android 15)
3. **Manifest Fixes:** 
   - `extractNativeLibs="true"` enabled for Samsung M-series compatibility
   - `usesCleartextTraffic` placeholder defined in `build.gradle`
4. **Packaging Logic:** 
   - `useLegacyPackaging = true` set in `app/build.gradle` for universal APK
   - `splits` disabled to ensure **Universal APK** containing all engines
5. **Code Stripping:** `MainApplication.kt` stripped of all `DefaultNewArchitectureEntryPoint` calls

## 📂 Folder Structure
- **`src/components/`**: `TaskItem.tsx` (Handles its own editing state)
- **`src/screens/`**: `LoadingScreen.tsx` (Custom Quote) and `HomeScreen.tsx` (Quest Log)
- **`src/storage/`**: `taskStorage.ts` (AsyncStorage JSON handling)
- **`src/utils/`**: `theme.ts` (Neon Blue palette) and `types.ts` (Task interface)

## 📏 Development Conventions
- **Hooks Only:** Use `useState` and `useEffect` for all logic
- **Stable Engine:** Maintain `isNewArchEnabled: false` and `isHermesEnabled: false` in `MainApplication.kt`
- **Styling:** Always use `SHADOWS.glow` from the theme for the "System" feel
- **JS Executor:** JSCore via jsc-android (reliable native library support on Android 14/15)

## ✅ Build Status (April 14, 2026)

### Issues Found & Fixed
1. ❌ **New Architecture Entry Point Crash** → ✅ Removed reactHost property override
2. ❌ **Hermes Library Not Found (libhermes.so)** → ✅ Disabled Hermes, switched to JSCore
3. ❌ **JSC Executor Not Found (libjscexecutor.so)** → ✅ Added jsc-android dependency

### Current Build Output
```
BUILD SUCCESSFUL in 30s
83 actionable tasks: 13 executed, 70 up-to-date
✅ Installed on Samsung device (SM-M315F - 15)
✅ App launched successfully
```

### Deployment Status
- ✅ **APK built successfully** (app-debug.apk)
- ✅ **Installed on physical device**
- ✅ **App running without crashes**
- ✅ **No native library errors**

## 🔧 Code Context Summary

### MainApplication.kt (Current State)
```kotlin
package com.todoapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = false
        override val isHermesEnabled: Boolean = false
      }

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    // No more New Architecture hooks here
  }
}
```

### MainActivity.kt (Current State)
```kotlin
package com.todoapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "TodoApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, false)
}
```

### build.gradle (React Configuration)
```gradle
/**
 * Hermes temporarily disabled - library packaging issue
 * Using JSCore (default) engine until Hermes prefab is resolved
 */
react {
    autolinkLibrariesWithApp()
    hermesEnabled = false
}
```

### package.json (Dependencies Added)
```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-native": "0.76.1",
    "@react-native-async-storage/async-storage": "2.1.0",
    "jsc-android": "^250231.0.0"
  }
}
```

## 🎯 Next Steps
1. Test task creation, editing, and deletion on device
2. Verify theme (neon blue glow) renders correctly
3. Test AsyncStorage persistence (tasks saved across app restarts)
4. Optional: Re-enable Hermes after React Native releases a fix for prefab library packaging

