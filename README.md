# SAND Timer for Windows

Let distractions settle. Let focus flow.

An hourglass focus timer with Dark, Warm Light and Premium Ambient themes. Built with HTML, CSS, vanilla JavaScript and Tauri 2.

## Features

- Timestamp-based Focus / Short break / Long break sessions.
- Start, Pause, Resume, Reset and mode-switch confirmation.
- Sand animation follows real timer progress.
- Completion dialog and optional chime.
- Custom durations from 1–180 minutes, saved in Settings.
- Running and paused sessions survive refresh and app restart.
- Windows tray with Open SAND and Quit SAND.
- Closing the window hides it in the tray. Quit from the tray to exit.
- Native completion scheduler and Windows notification, including while hidden.
- A second launch opens the existing app window.

Windows notifications depend on Windows notification settings. During computer sleep, completion is processed after the computer wakes. A saved expired session shows completion when reopened. Audio in a newly reopened window may require another user interaction. Session statistics are planned and currently show zero.

## Download a Windows installer

The GitHub Actions workflow **Build Windows installer** produces `SAND-Timer-Windows`, containing the `-setup.exe` installer. Open the repository's Actions tab, select the successful run, and download its artifact while signed in. Extract the ZIP and run the installer.

This development installer is unsigned. A trusted production release requires a Windows code-signing certificate. First installation may download Microsoft's WebView2 runtime if it is missing.

## Develop on Windows

Install Node.js 22 LTS, Rust via rustup using the MSVC toolchain, and Microsoft Visual Studio Build Tools with **Desktop development with C++**, including the Windows SDK. WebView2 is also required.

```powershell
npm ci
npm run desktop:dev
```

Build an installer locally on Windows:

```powershell
npm run desktop:build
```

The installer appears in `src-tauri/target/release/bundle/nsis/`.

Official prerequisites: https://v2.tauri.app/start/prerequisites/

## Browser preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Keep the terminal running. Browser preview uses the same timer and saved settings. The tray and Windows notifications are available in the installed app.

## Project structure

- `index.html`, `css/`, `js/` — shared timer interface.
- `js/timer.js` — timer state, deadlines and validated session restoration.
- `js/desktop.js` — the Tauri bridge for native completion scheduling.
- `src-tauri/src/main.rs` — desktop window lifecycle, tray, native scheduler and notification.
- `src-tauri/tauri.conf.json` — window, security and installer configuration.
- `scripts/build.mjs` — copies only the application assets to `dist/`.
- `.github/workflows/windows.yml` — builds an installer on Windows.

The frontend build deliberately includes only HTML, CSS and JavaScript application assets.

## Checks

```sh
npm test
npm run build
```

On Windows, test a 1-minute session, close the window, and check for a notification. Reopen via the tray and check `00:00`. Test pause/resume, reset, custom duration validation, app restart, sleep/wake, sound mute and all three themes. Use Quit SAND before testing saved-state restoration after a full app restart.
