# Vladyslav Druziakin Portfolio

Interactive hacker-style portfolio website with multi-window sync, ASCII mirror easter egg, system scan panel, audio controls, voice commands, and dark/light theme support.

## Live
- [vladyslavdruziakin.github.io](https://vladyslavdruziakin.github.io/)

## Tech Stack
- `HTML5`
- `Tailwind CSS` (CDN config via `assets/js/head.js`)
- `Vanilla JavaScript` (`assets/js/main.js`)
- Browser APIs: `Web Share API`, `Web Speech API`, `BroadcastChannel`, `Battery Status`, `Picture-in-Picture`, `getUserMedia`, `localStorage`

## Highlights
- Hacker-style UI with dark/light theme toggle
- Typing intro animation for hero content
- Real-time system scan metrics (browser, viewport, network, timezone, battery)
- FPS and scroll-speed HUD
- Background audio with tab-to-tab sync (play/stop + volume)
- Voice control (`Dark Mode`, `Light Mode`, `Play Music`, `Stop Music`)
- Toast notification system (stacked, animated, reusable)
- Multi-window synchronization:
  - Theme sync across tabs
  - Audio state sync across tabs
  - Volume sync across tabs
  - Presence sync (active tab count)
- Easter mode for 3+ tabs:
  - Unlock persistence in `localStorage`
  - Confetti celebration (first unlock)
  - Persistent access to ASCII Mirror after unlock
- ASCII Mirror bonus section (camera + canvas rendering)
- Share CV + Download CV actions
- Custom leave dialog and return-visitor messaging

## Accessibility & Semantics
- `main` landmark and skip-link (`Skip to main content`)
- Improved ARIA usage:
  - `aria-live` status regions for dynamic blocks
  - `aria-pressed` for toggle buttons
  - Dialog semantics for custom leave modal (`role="dialog"`, `aria-modal`)
  - Focus management and focus-trap in modal
  - Tooltip semantics for voice command hint

## Project Structure
```text
.
├── index.html
├── README.md
└── assets
    ├── Vladyslav_Druziakin_CV.pdf
    ├── photo.webp
    ├── site-music.mp3
    ├── certificates
    │   ├── angular-forms-in-depth.jpg
    │   ├── easy-code.png
    │   ├── ionic.jpg
    │   └── ngrx.jpg
    └── js
        ├── head.js
        └── main.js
```

## Run Locally
Because the site uses browser APIs (camera/audio/share), run it from a local server (not `file://`).

### Option 1: Python
```bash
python3 -m http.server 8080
```
Open: `http://localhost:8080`

### Option 2: Node
```bash
npx serve .
```

## Customization
- Main content and sections: `index.html`
- Tailwind theme, keyframes, animations: `assets/js/head.js`
- Interactive logic and API integrations: `assets/js/main.js`
- CV file: `assets/Vladyslav_Druziakin_CV.pdf`
- Music file: `assets/site-music.mp3`

## Notes
- Some APIs are browser-dependent (Battery, Web Speech, PiP, Share, camera permissions).
- Audio autoplay can be restricted until user interaction.
- Multi-window sync uses both `BroadcastChannel` and `localStorage` events.

---
Built and maintained by **Vladyslav Druziakin**.
