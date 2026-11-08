# SAND Timer

Let distractions settle. Let focus flow.

A minimalist hourglass focus timer built incrementally with HTML, CSS, vanilla JavaScript, and SVG. No build tools or dependencies.

## Stage 1: interface foundation

Implemented:
- Responsive main screen and custom SVG hourglass.
- Focus, short break, and long break previews.
- Dark, Warm Light, and Premium Ambient themes.
- Accessible Settings dialog and saved theme preference.
- Keyboard focus styles and reduced-motion support.

Start and Reset are intentionally disabled. The timer and statistics are not implemented yet. Statistics start at zero rather than showing fabricated sessions.

## Run locally

From the project folder:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser. Stop the server with Ctrl+C.

## Files

- `index.html`: semantic page, controls, dialog, and custom hourglass artwork.
- `css/styles.css`: shared layout, theme tokens, responsive styles, and interaction states.
- `js/app.js`: theme persistence, Settings behavior, and mode previews.

## Check this stage

1. Open Settings and try each theme. Refresh: the selected theme should remain.
2. Use Tab and Enter to navigate and choose controls. Escape should close Settings and return focus to its opener.
3. Switch modes: the preview should show 25:00, 05:00, or 15:00.
4. Narrow the browser to 360px: controls should fit, with statistics below the main screen.
5. Confirm Start and Reset are disabled, clearly marked as a design preview.

## Next stage

Implement timestamp-based timer logic, pause/resume/reset, synchronized sand progress, session completion, customizable durations, and saved timer state. Deployment follows timer testing.
