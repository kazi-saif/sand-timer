# SAND Timer

Let distractions settle. Let focus flow.

A minimalist hourglass focus timer built incrementally with HTML, CSS, vanilla JavaScript, and SVG. No build tools or dependencies.

## Current stage: timer controls

Implemented:
- Responsive main screen and custom SVG hourglass.
- Focus, short break, and long break previews.
- Dark, Warm Light, and Premium Ambient themes.
- Accessible Settings dialog and saved theme preference.
- Keyboard focus styles and reduced-motion support.

Implemented timer controls: timestamp-based Start, Pause, Resume and Reset; confirmation before discarding a running or paused session; completion dialog and remaining time in the browser tab. Refresh currently resets the session. Sand drains into the lower chamber using timer progress, with a falling stream that pauses and resets with the timer. Session statistics and custom durations are planned for the next steps. Statistics remain zero until that feature is implemented.

## Run locally

From the project folder:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser. Stop the server with Ctrl+C.

## Files

- `index.html`: semantic page, controls, dialog, and custom hourglass artwork.
- `css/styles.css`: shared layout, theme tokens, responsive styles, and interaction states.
- `js/app.js`: theme persistence, Settings behavior, timer UI and mode switching.
- `js/timer.js`: independent deadline-based timer state and time formatting.
- `tests/timer.test.mjs`: timer tests with a controllable clock.

## Check this stage

1. Open Settings and try each theme. Refresh: the selected theme should remain.
2. Use Tab and Enter to navigate and choose controls. Escape should close Settings and return focus to its opener.
3. Switch modes: the preview should show 25:00, 05:00, or 15:00.
4. Narrow the browser to 360px: controls should fit, with statistics below the main screen.
5. Start, wait a few seconds, Pause, then Resume: time must continue from the paused value.
6. Choose another mode while running or paused: Keep session preserves it; Switch mode resets to the new duration.
7. Reset restores the full duration. Refresh currently clears the session.

Run timer checks with `node tests/timer.test.mjs` and sand checks with `node tests/hourglass.test.mjs`.

## Next stage

Add session statistics, customizable durations and saved timer state.
