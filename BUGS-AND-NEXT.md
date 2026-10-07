# Niark — first engineering pass

## Fixed in this pass

- **Sage overwrite bug:** startup no longer replaces Sage's saved image/persona/greeting on every launch. Missing Sage fields are filled only when absent.
- **State migration:** state is now stored under `niark:state:v3`, while the previous `steep:v2` state is still readable for migration.
- **Stop-generation bug:** the send button now aborts an active local generation instead of doing nothing while `busy` is true.
- **Model selection bug:** selecting the already-active model no longer unnecessarily clears the current engine.
- **Missing worker reference:** the service worker no longer lists `local-ai-worker.js`, which was absent from the ZIP.
- **WebLLM startup error:** failure to import WebLLM now produces a clear first-run/network message instead of silently looking like a model initialization problem.
- **Android packaging:** added an Android Studio project that wraps the local web app in a native APK shell using AndroidX WebKit's asset loader.

## Confirmed prototype limitations

1. The current ZIP has no bundled WebLLM runtime. It imports `@mlc-ai/web-llm@0.2.85` from `esm.run`, so the first setup still needs network access.
2. Model binaries are downloaded by WebLLM on first use and cached by its runtime; the APK does not contain multi-GB model weights.
3. A true offline-first APK therefore still needs the WebLLM JS/runtime and model metadata to be vendored locally. Model weights should remain optional downloads.
4. 7B should be treated as experimental on the S23 until real device tests establish usable memory and speed.
5. Character/chat state is still localStorage-based. For a larger character library and many photos, IndexedDB should replace or supplement localStorage.
6. The Android wrapper is build-ready source, not a signed APK yet. This environment does not have Android SDK/build tools installed.

## First S23 test matrix

- Install debug APK.
- Open Niark with network available.
- Verify WebGPU says `yes`.
- Load Fast 1.5B.
- Send 10 short messages and record TTFT/tok/s.
- Background the app and resume it.
- Force-close/reopen and verify Sage + chat + memory persist.
- Add a custom character with an image; restart; verify image persists.
- Switch Quick/Standard/Deep without model reload.
- Switch model and verify only the model change triggers initialization.
- Try 3B.
- Try 7B only after 3B is stable.
- Test with network disabled after the model is cached.

## Next engineering priority

1. Get the first debug APK onto the S23.
2. Test WebGPU/WebLLM in the actual Android WebView.
3. Vendor WebLLM/runtime assets so the application shell itself has no remote JS dependency.
4. Move character/image storage to IndexedDB.
5. Add a model manager with storage size, cached/not-cached state, delete model, and retry controls.
6. Add structured diagnostics export so device bugs can be reported with WebGPU/model/TTFT/tok/s information.
