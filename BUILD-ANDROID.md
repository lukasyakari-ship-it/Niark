# Niark Android build

This repository is now structured as an Android app wrapper around the Niark web runtime.

## Current target
- Android app id: `com.niark.app`
- Version: `0.1.0`
- compile/target SDK: 36
- WebView asset origin: `https://appassets.androidplatform.net/assets/`
- AndroidX WebKit: 1.17.1
- AGP: 8.13.2 / Gradle 8.13

The wrapper keeps the web app local inside the APK and gives it a secure HTTPS-like asset origin. Network access is still required for the current first-run WebLLM import and model download. The next step is to vendor WebLLM/runtime assets into the APK so first-run dependency loading is fully self-contained.

## Build
Open the `android/` directory in a current Android Studio, allow it to install the required SDK/Gradle components, then run the `app` debug configuration. The resulting debug APK is under `android/app/build/outputs/apk/debug/`.

For a release APK, configure a signing key in Android Studio and build a signed APK. Do not ship a debug-signed APK as the release artifact.

## Important testing target
The first real device test should be a Samsung Galaxy S23 with current Samsung Internet/Android System WebView/Chrome components. Verify WebGPU availability, 1.5B initialization, generation speed, renderer stability, storage persistence, and resume-after-background before attempting 3B/7B.
