# Niark next steps

## v0.2 groundwork
- Local profile with editable picture and account name.
- Character creator now has intro, scenario, personality/backstory, greeting, example dialogue and source link.
- Character search.
- CHAI source links are stored as links; Niark does not scrape or copy another creator's private content.
- GitHub Actions debug APK build.

## Authentication
The current APK intentionally does not pretend to provide real Gmail/password accounts.
A production multi-device account system needs a backend (OAuth for Google plus secure password auth/session storage). The local profile is the first mobile UI layer.

## Local AI
The WebLLM runtime is still loaded from esm.run on first launch. Fully offline/self-contained WebGPU packaging requires bundling and testing the runtime/model artifacts separately.
