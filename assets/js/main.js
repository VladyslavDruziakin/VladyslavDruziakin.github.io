const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const accessGrantedEl = document.getElementById('access-granted');
const heroNameEl = document.getElementById('hero-name');
const heroRoleEl = document.getElementById('hero-role');
const summaryTextEl = document.getElementById('summary-text');
const splashEl = document.getElementById('splash-screen');
const splashProgressEl = document.getElementById('splash-progress');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const returningToastEl = document.getElementById('returning-toast');
const multiTabsToastEl = document.getElementById('multi-tabs-toast');
const lowBatteryToastEl = document.getElementById('low-battery-toast');
const resizeToastEl = document.getElementById('resize-toast');
const leaveModalEl = document.getElementById('leave-modal');
const leaveModalDialogEl = document.getElementById('leave-modal-dialog');
const leaveStayBtn = document.getElementById('leave-stay-btn');
const leaveConfirmBtn = document.getElementById('leave-confirm-btn');
const shareCvBtn = document.getElementById('share-cv-btn');
const speakIntroBtn = document.getElementById('speak-intro-btn');
const musicAudioEl = document.getElementById('site-music');
const musicToggleBtn = document.getElementById('music-toggle');
const musicVolumeEl = document.getElementById('music-volume');
const voiceToggleBtn = document.getElementById('voice-toggle');
const voiceToastEl = document.getElementById('voice-toast');
const voiceToastTextEl = document.getElementById('voice-toast-text');
const multiWindowBadgeEl = document.getElementById('multi-window-badge');
const multiWindowCountEl = document.querySelector('[data-multi-count]');
const multiSyncInfoEl = document.getElementById('multi-sync-info');
const easterHintSectionEl = document.getElementById('easter-hint-section');
const asciiMirrorSectionEl = document.getElementById('ascii-mirror-section');
const asciiRewardAnchorEl = document.getElementById('ascii-reward-anchor');
const asciiDefaultAnchorEl = document.getElementById('ascii-default-anchor');
const asciiToggleBtn = document.getElementById('ascii-toggle');
const asciiStatusEl = document.getElementById('ascii-status');
const asciiOutputCanvasEl = document.getElementById('ascii-output-canvas');
const asciiVideoEl = document.getElementById('ascii-video-source');
const asciiCanvasEl = document.getElementById('ascii-video-canvas');
const pipOfferVideoEl = document.getElementById('pip-offer-video');
const visitCountEl = document.querySelector('[data-visit-count]');
const fpsEl = document.querySelector('[data-perf="fps"]');
const scrollSpeedEl = document.querySelector('[data-perf="scroll-speed"]');
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label';
const TYPING_SPEED = {
    access: 55,
    name: 70,
    role: 40,
    summaryWords: 24,
};
const METRIC_INTERVAL = 4200;
const FPS_UPDATE_INTERVAL = 600;
const RETURNING_VISITOR_KEY = 'vd_portfolio_visited';
const VISIT_COUNT_KEY = 'vd_portfolio_visit_count';
const LOW_BATTERY_THRESHOLD = 20;
const LEAVE_WARNING_TEXT = 'I hope you copied the link. Have a great day.';
const ENABLE_NATIVE_LEAVE_WARNING = true;
const AWAY_TITLE_TEXT = 'Ready to discuss your project? 💼';
const TAB_BLINK_INTERVAL = 900;
const RESIZE_TOAST_DEBOUNCE = 260;
const RESIZE_TOAST_COOLDOWN = 7000;
const RESIZE_WIDTH_THRESHOLD = 16;
const VOICE_TOAST_DURATION = 4800;
const THEME_STORAGE_KEY = 'theme';
const MULTI_SYNC_CHANNEL = 'vd_portfolio_multi_sync';
const WINDOW_REGISTRY_KEY = 'vd_window_registry';
const WINDOW_PRESENCE_TTL = 7000;
const WINDOW_PRESENCE_HEARTBEAT = 2200;
const EASTER_MIN_WINDOWS = 3;
const EASTER_TOAST_DURATION = 4200;
const EASTER_CONFETTI_DURATION = 5200;
const EASTER_UNLOCKED_KEY = 'vd_easter_unlocked';
const DEFAULT_TOAST_DURATION = 4200;
const LOW_BATTERY_TOAST_DURATION = 4800;
const RESIZE_TOAST_DURATION = 2600;
const CV_FILE_PATH = 'assets/Vladyslav_Druziakin_CV.pdf';
const MUSIC_STATE_KEY = 'vd_music_enabled';
const MUSIC_VOLUME_KEY = 'vd_music_volume';
const DEFAULT_MUSIC_VOLUME = 0.3;
const PIP_OFFER_TEXT = 'I am still waiting for my offer )';
const ASCII_FOREGROUND_CHARSET = ' .,:;i1tfLCG08@ANGULARRXJSNGRXTS';
const ASCII_BACKGROUND_CHARSET = '   ..::';
const ASCII_EDGE_WEIGHT = 0.5;
const ASCII_LUMA_WEIGHT = 0.35;
const ASCII_CENTER_WEIGHT = 0.25;
const ASCII_HUMAN_THRESHOLD = 0.3;
const ASCII_TARGET_FPS = 16;
const ASCII_CHAR_WIDTH_FACTOR = 0.62;
const ASCII_LINE_HEIGHT_FACTOR = 1.05;
const ASCII_MOBILE_COLS = 58;
const ASCII_DESKTOP_COLS = 92;
const ASCII_OUTPUT_SIZE_MOBILE = 300;
const ASCII_OUTPUT_SIZE_DESKTOP = 512;
let batteryText = 'n/a';
let allowPageLeave = false;
let pendingLeaveHref = '';
let tabBlinkIntervalId = null;
let resizeDebounceId = null;
let resizeToastCooldownId = null;
let canShowResizeToast = true;
let lastResizeWidth = window.innerWidth;
let lastResizeHeight = window.innerHeight;
let lowBatteryToastShown = false;
let shouldResumeMusicOnFocus = false;
let asciiStream = null;
let asciiRafId = null;
let asciiLastFrameTime = 0;
let asciiRunning = false;
let asciiOutputCtx = null;
let pipRenderRafId = null;
let pipUserActivated = false;
let introUtterance = null;
let asciiLastLines = ['ASCII mirror standby...'];
let multiSyncChannel = null;
let applyingRemoteSync = false;
let windowPresenceTimer = null;
let multiTabsWasActive = false;
const toastTimers = new WeakMap();
let easterConfettiRafId = null;
let easterConfettiCanvas = null;
let lastFocusedBeforeModal = null;
let easterUnlocked = false;
let applyMusicEnabledState = null;
const WINDOW_TAB_ID =
    (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : `tab-${ Date.now() }-${ Math.random().toString(16).slice(2) }`;
const initialTitle = document.title;
const initialFaviconHref =
    document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
    document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
    '';

const buildEmojiFavicon = (emoji) =>
    `data:image/svg+xml,${ encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text y="50" x="8" font-size="52">${ emoji }</text></svg>`
    ) }`;

const setFavicon = (href) => {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', href);
};

const frames = [
    '  [░░░░░░░░░░] 0%',
    '  [▓▓░░░░░░░░] 20%',
    '  [▓▓▓▓░░░░░░] 40%',
    '  [▓▓▓▓▓▓░░░░] 60%',
    '  [▓▓▓▓▓▓▓▓░░] 80%',
    '  [▓▓▓▓▓▓▓▓▓▓] 100%'
];

let i = 0;
const interval = setInterval(() => {
    console.log(`%c${ frames[i] }`, 'color: #00ff41; font-family: monospace;');
    i++;
    if (i === frames.length) {
        clearInterval(interval);
        console.log('%cInspecting? Guess I’ve caught your eye. 😎 Instead of digging through the DOM tree, let’s talk about how I can bring value to your team.', 'color: #00ff00; font-size: 20px; font-weight: bold;');
        console.log(`
▒▒▒▒▒▒▒▒▄▄▄▄▄▄▄▄▒▒▒▒▒▒▒▒
▒▒▒▒▒▄█▀▀░░░░░░▀▀█▄▒▒▒▒▒
▒▒▒▄█▀▄██▄░░░░░░░░▀█▄▒▒▒
▒▒█▀░▀░░▄▀░░░░▄▀▀▀▀░▀█▒▒
▒█▀░░░░███░░░░▄█▄░░░░▀█▒
▒█░░░░░░▀░░░░░▀█▀░░░░░█▒
▒█░░░░░░░░░░░░░░░░░░░░█▒
▒█░░██▄░░▀▀▀▀▄▄░░░░░░░█▒
▒▀█░█░█░░░▄▄▄▄▄░░░░░░█▀▒
▒▒▀█▀░▀▀▀▀░▄▄▄▀░░░░▄█▀▒▒
▒▒▒█░░░░░░▀█░░░░░▄█▀▒▒▒▒
▒▒▒█▄░░░░░▀█▄▄▄█▀▀▒▒▒▒▒▒
▒▒▒▒▀▀▀▀▀▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒
    `);
    }
}, 200);

const renderThemeButton = () => {
    if (!themeToggle) return;
    const isDark = root.classList.contains('dark');
    themeToggle.textContent = isDark ? 'Switch To Light' : 'Switch To Dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clientDataLabels = document.querySelectorAll('[data-client]');

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const setButtonPressed = (button, isPressed) => {
    if (!button) return;
    button.setAttribute('aria-pressed', String(Boolean(isPressed)));
};
const storageGet = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (_error) {
        return null;
    }
};
const storageSet = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (_error) {
        // Ignore storage restrictions and private-mode exceptions.
    }
};
easterUnlocked = storageGet(EASTER_UNLOCKED_KEY) === '1';

const showToast = (toastEl, duration = DEFAULT_TOAST_DURATION) => {
    if (!toastEl) return;

    const existingTimer = toastTimers.get(toastEl);
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    toastEl.classList.remove('hidden');
    requestAnimationFrame(() => {
        toastEl.classList.remove('opacity-0', 'translate-y-2');
        toastEl.classList.add('opacity-100', 'translate-y-0');
    });

    const timerId = setTimeout(() => {
        toastEl.classList.remove('opacity-100', 'translate-y-0');
        toastEl.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
            toastEl.classList.add('hidden');
        }, 520);
        toastTimers.delete(toastEl);
    }, duration);

    toastTimers.set(toastEl, timerId);
};

const broadcastSync = (payload) => {
    if (applyingRemoteSync) return;
    if (!multiSyncChannel) return;
    try {
        multiSyncChannel.postMessage(payload);
    } catch (_error) {
        // Ignore cross-window sync errors.
    }
};

const readWindowRegistry = () => {
    try {
        const raw = storageGet(WINDOW_REGISTRY_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_error) {
        return {};
    }
};

const writeWindowRegistry = (registry) => {
    try {
        storageSet(WINDOW_REGISTRY_KEY, JSON.stringify(registry));
    } catch (_error) {
        // Ignore storage write errors.
    }
};

const getActiveWindowCount = () => {
    const now = Date.now();
    const registry = readWindowRegistry();
    let mutated = false;
    Object.keys(registry).forEach((key) => {
        if (now - Number(registry[key]) > WINDOW_PRESENCE_TTL) {
            delete registry[key];
            mutated = true;
        }
    });
    if (mutated) writeWindowRegistry(registry);
    return Object.keys(registry).length;
};

const renderMultiWindowState = () => {
    const activeCount = getActiveWindowCount();
    const isLinked = activeCount >= 2;
    const easterActive = activeCount >= EASTER_MIN_WINDOWS;
    const easterVisible = easterActive || easterUnlocked;
    if (multiWindowBadgeEl) {
        multiWindowBadgeEl.classList.toggle('hidden', !isLinked);
    }
    if (multiWindowCountEl) {
        multiWindowCountEl.textContent = `${ activeCount }`;
    }
    if (multiSyncInfoEl) {
        multiSyncInfoEl.classList.toggle('hidden', !isLinked);
    }
    if (easterHintSectionEl) {
        easterHintSectionEl.classList.toggle('hidden', easterVisible);
    }
    if (isLinked && !multiTabsWasActive) {
        showMultiTabsToast();
    }
    multiTabsWasActive = isLinked;
    syncAsciiRewardPlacement(easterVisible);
    if (easterActive && !easterUnlocked) {
        easterUnlocked = true;
        storageSet(EASTER_UNLOCKED_KEY, '1');
        showEasterToast();
        launchEasterConfetti();
    }
};

const syncAsciiRewardPlacement = (easterActive) => {
    if (!asciiMirrorSectionEl || !asciiRewardAnchorEl || !asciiDefaultAnchorEl) return;
    if (easterActive) {
        asciiRewardAnchorEl.classList.remove('hidden');
        if (asciiMirrorSectionEl.parentElement !== asciiRewardAnchorEl) {
            asciiRewardAnchorEl.appendChild(asciiMirrorSectionEl);
        }
        asciiMirrorSectionEl.classList.remove('hidden');
        drawAsciiOutput(asciiLastLines);
        return;
    }

    asciiRewardAnchorEl.classList.add('hidden');
    asciiMirrorSectionEl.classList.add('hidden');
    if (asciiRunning) {
        stopAsciiMirror();
    }
    if (asciiMirrorSectionEl.parentElement !== asciiDefaultAnchorEl.parentElement) {
        asciiDefaultAnchorEl.insertAdjacentElement('afterend', asciiMirrorSectionEl);
    }
};

const showMultiTabsToast = () => {
    showToast(multiTabsToastEl, DEFAULT_TOAST_DURATION);
};

const showEasterToast = () => {
    const toast = document.getElementById('easter-toast');
    showToast(toast, EASTER_TOAST_DURATION);
};

const launchEasterConfetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (easterConfettiRafId) {
        cancelAnimationFrame(easterConfettiRafId);
        easterConfettiRafId = null;
    }
    if (easterConfettiCanvas) {
        easterConfettiCanvas.remove();
        easterConfettiCanvas = null;
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'pointer-events-none fixed inset-0 z-[9970]';
    document.body.appendChild(canvas);
    easterConfettiCanvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ['#22d3ee', '#06b6d4', '#4ade80', '#22c55e', '#e879f9'];
    const particles = Array.from({ length: 110 }, () => ({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.24,
        size: 3 + Math.random() * 5,
        vy: 2 + Math.random() * 4.2,
        vx: -2 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        spin: -0.16 + Math.random() * 0.32,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.75 + Math.random() * 0.25,
    }));

    const start = performance.now();
    const tick = (now) => {
        const elapsed = now - start;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const particle of particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rot += particle.spin;
            particle.vy += 0.014;

            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rot);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.alpha;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.72);
            ctx.restore();
        }
        ctx.globalAlpha = 1;

        if (elapsed < EASTER_CONFETTI_DURATION) {
            easterConfettiRafId = requestAnimationFrame(tick);
            return;
        }

        if (easterConfettiCanvas) {
            easterConfettiCanvas.remove();
            easterConfettiCanvas = null;
        }
        easterConfettiRafId = null;
    };

    easterConfettiRafId = requestAnimationFrame(tick);
    setTimeout(() => {
        if (!easterConfettiCanvas) return;
        easterConfettiCanvas.remove();
        easterConfettiCanvas = null;
        if (easterConfettiRafId) {
            cancelAnimationFrame(easterConfettiRafId);
            easterConfettiRafId = null;
        }
    }, EASTER_CONFETTI_DURATION + 220);
};

const touchWindowPresence = () => {
    const now = Date.now();
    const registry = readWindowRegistry();
    registry[WINDOW_TAB_ID] = now;
    writeWindowRegistry(registry);
    renderMultiWindowState();
    broadcastSync({ type: 'presencePing', tabId: WINDOW_TAB_ID, at: now });
};

const removeWindowPresence = () => {
    const registry = readWindowRegistry();
    if (WINDOW_TAB_ID in registry) {
        delete registry[WINDOW_TAB_ID];
        writeWindowRegistry(registry);
    }
    renderMultiWindowState();
    broadcastSync({ type: 'presencePing', tabId: WINDOW_TAB_ID, at: Date.now() });
};

const initMultiWindowPresence = () => {
    touchWindowPresence();
    if (windowPresenceTimer) clearInterval(windowPresenceTimer);
    windowPresenceTimer = setInterval(() => {
        touchWindowPresence();
    }, WINDOW_PRESENCE_HEARTBEAT);

    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            touchWindowPresence();
            return;
        }
        renderMultiWindowState();
    });

    window.addEventListener('storage', (event) => {
        if (event.key !== WINDOW_REGISTRY_KEY) return;
        renderMultiWindowState();
    });

    window.addEventListener('beforeunload', () => {
        if (windowPresenceTimer) {
            clearInterval(windowPresenceTimer);
            windowPresenceTimer = null;
        }
        removeWindowPresence();
    });
};

const initOfferPictureInPicture = () => {
    if (!pipOfferVideoEl) return;
    if (!document.pictureInPictureEnabled) return;

    const markActivated = () => {
        pipUserActivated = true;
        window.removeEventListener('pointerdown', markActivated);
        window.removeEventListener('keydown', markActivated);
    };
    window.addEventListener('pointerdown', markActivated, { once: true });
    window.addEventListener('keydown', markActivated, { once: true });

    const pipCanvas = document.createElement('canvas');
    pipCanvas.width = 640;
    pipCanvas.height = 360;
    const pipCtx = pipCanvas.getContext('2d');
    if (!pipCtx) return;

    const renderPipFrame = (time = 0) => {
        const dark = root.classList.contains('dark');
        const bg = dark ? '#020617' : '#020617';
        const accent = dark ? '#86efac' : '#22d3ee';
        const accentAlt = dark ? '#4ade80' : '#06b6d4';

        pipCtx.fillStyle = bg;
        pipCtx.fillRect(0, 0, pipCanvas.width, pipCanvas.height);

        pipCtx.strokeStyle = `${ accent }aa`;
        pipCtx.lineWidth = 3;
        pipCtx.strokeRect(12, 12, pipCanvas.width - 24, pipCanvas.height - 24);

        const pulse = 0.6 + 0.4 * Math.sin(time / 420);
        pipCtx.fillStyle = `${ accentAlt }`;
        pipCtx.font = '700 20px JetBrains Mono, monospace';
        pipCtx.textAlign = 'center';
        pipCtx.fillText('STILL ONLINE', pipCanvas.width / 2, 92);

        pipCtx.fillStyle = dark ? `rgba(134,239,172,${ pulse })` : `rgba(34,211,238,${ pulse })`;
        pipCtx.font = '700 28px JetBrains Mono, monospace';
        const offerLines = PIP_OFFER_TEXT.split(' ');
        const firstLine = offerLines.slice(0, 4).join(' ');
        const secondLine = offerLines.slice(4).join(' ');
        pipCtx.fillText(firstLine, pipCanvas.width / 2, 182);
        pipCtx.fillText(secondLine, pipCanvas.width / 2, 224);

        pipCtx.fillStyle = dark ? '#dcfce7' : '#cffafe';
        pipCtx.font = '500 14px JetBrains Mono, monospace';
        pipCtx.fillText('Return to tab any time', pipCanvas.width / 2, 292);

        pipRenderRafId = requestAnimationFrame(renderPipFrame);
    };

    renderPipFrame();
    const stream = pipCanvas.captureStream(12);
    pipOfferVideoEl.srcObject = stream;
    pipOfferVideoEl.play().catch(() => {
        // Ignore autoplay restrictions; PiP may still work after user gesture.
    });

    const startPip = async () => {
        if (!pipUserActivated) return;
        if (document.pictureInPictureElement) return;
        try {
            await pipOfferVideoEl.requestPictureInPicture();
        } catch (_error) {
            // Browser can reject PiP without explicit user gesture/context.
        }
    };

    const stopPip = async () => {
        if (document.pictureInPictureElement !== pipOfferVideoEl) return;
        try {
            await document.exitPictureInPicture();
        } catch (_error) {
            // Ignore exit errors.
        }
    };

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            startPip();
            return;
        }
        stopPip();
    });
};

const initShareCv = () => {
    if (!shareCvBtn) return;

    shareCvBtn.addEventListener('click', async () => {
        const cvUrl = new URL(CV_FILE_PATH, window.location.href).href;
        const sharePayload = {
            title: 'Vladyslav Druziakin CV - Senior Angular Frontend Developer',
            text: 'https://vladyslavdruziakin.github.io/',
            url: cvUrl,
        };

        if (!navigator.share) {
            window.open(cvUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        try {
            const response = await fetch(cvUrl);
            if (response.ok) {
                const blob = await response.blob();
                const file = new File([blob], 'Vladyslav_Druziakin_CV.pdf', { type: 'application/pdf' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: sharePayload.title,
                        text: sharePayload.text,
                        files: [file],
                    });
                    return;
                }
            }
            await navigator.share(sharePayload);
        } catch (_error) {
            window.open(cvUrl, '_blank', 'noopener,noreferrer');
        }
    });
};

const initIntroSpeech = () => {
    if (!speakIntroBtn) return;
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
        speakIntroBtn.textContent = 'Speech N/A';
        speakIntroBtn.disabled = true;
        speakIntroBtn.classList.add('opacity-60', 'cursor-not-allowed');
        return;
    }

    const buildIntroText = () => {
        const name = heroNameEl?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        const role = heroRoleEl?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        const summary = summaryTextEl?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        return [name, role, summary].filter(Boolean).join('. ');
    };

    const syncIntroButton = () => {
        const speaking = window.speechSynthesis.speaking || window.speechSynthesis.pending;
        speakIntroBtn.textContent = speaking ? 'Stop Reading' : 'Read Intro';
        setButtonPressed(speakIntroBtn, speaking);
    };

    const stopIntroSpeech = () => {
        window.speechSynthesis.cancel();
        introUtterance = null;
        syncIntroButton();
    };

    speakIntroBtn.addEventListener('click', () => {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            stopIntroSpeech();
            return;
        }

        const text = buildIntroText();
        if (!text) return;
        introUtterance = new SpeechSynthesisUtterance(text);
        introUtterance.lang = 'en-US';
        introUtterance.rate = 1;
        introUtterance.pitch = 1;
        introUtterance.onend = () => {
            introUtterance = null;
            syncIntroButton();
        };
        introUtterance.onerror = () => {
            introUtterance = null;
            syncIntroButton();
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(introUtterance);
        syncIntroButton();
    });

    window.addEventListener('beforeunload', () => {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
        }
    });

    syncIntroButton();
};

const drawAsciiOutput = (lines) => {
    if (!asciiOutputCanvasEl) return;
    asciiLastLines = lines;
    if (!asciiOutputCtx) {
        asciiOutputCtx = asciiOutputCanvasEl.getContext('2d');
    }
    if (!asciiOutputCtx) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const fallbackSize = isMobile ? ASCII_OUTPUT_SIZE_MOBILE : ASCII_OUTPUT_SIZE_DESKTOP;
    const measuredWidth = Math.floor(asciiOutputCanvasEl.getBoundingClientRect().width || 0);
    const outputSize = Math.max(220, measuredWidth || fallbackSize);
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const realWidth = Math.floor(outputSize * dpr);
    const realHeight = Math.floor(outputSize * dpr);
    if (asciiOutputCanvasEl.width !== realWidth || asciiOutputCanvasEl.height !== realHeight) {
        asciiOutputCanvasEl.width = realWidth;
        asciiOutputCanvasEl.height = realHeight;
    }
    asciiOutputCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    asciiOutputCtx.imageSmoothingEnabled = false;

    const maxLineLen = Math.max(1, ...(lines.map((line) => line.length)));
    const maxRows = Math.max(1, lines.length);
    const padding = isMobile ? 6 : 8;
    const drawableWidth = outputSize - padding * 2;
    const drawableHeight = outputSize - padding * 2;
    const widthLimitedFont = drawableWidth / (maxLineLen * ASCII_CHAR_WIDTH_FACTOR);
    const heightLimitedFont = drawableHeight / (maxRows * ASCII_LINE_HEIGHT_FACTOR);
    const fontSize = clamp(Math.min(widthLimitedFont, heightLimitedFont), isMobile ? 4 : 5, isMobile ? 9 : 11);
    const lineHeight = fontSize * ASCII_LINE_HEIGHT_FACTOR;
    const offsetX = padding;
    const offsetY = padding;

    const ctx = asciiOutputCtx;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, outputSize, outputSize);
    ctx.font = `${ fontSize.toFixed(2) }px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = root.classList.contains('dark') ? '#86efac' : '#16a34a';

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        ctx.fillText(lines[lineIndex], offsetX, offsetY + lineIndex * lineHeight);
    }
};

const setAsciiStatus = (text) => {
    if (asciiStatusEl) asciiStatusEl.textContent = text;
};

const syncAsciiToggle = () => {
    if (!asciiToggleBtn) return;
    asciiToggleBtn.textContent = asciiRunning ? 'Stop' : 'Start';
    setButtonPressed(asciiToggleBtn, asciiRunning);
};

const stopAsciiMirror = () => {
    if (asciiRafId) {
        cancelAnimationFrame(asciiRafId);
        asciiRafId = null;
    }
    if (asciiStream) {
        asciiStream.getTracks().forEach((track) => track.stop());
        asciiStream = null;
    }
    if (asciiVideoEl) {
        asciiVideoEl.srcObject = null;
    }
    asciiRunning = false;
    asciiLastFrameTime = 0;
    drawAsciiOutput(['ASCII mirror standby...']);
    setAsciiStatus('Camera is off. Press Start to launch ASCII mirror.');
    syncAsciiToggle();
};

const renderAsciiFrame = (now) => {
    if (!asciiRunning || !asciiVideoEl || !asciiCanvasEl || !asciiOutputCanvasEl) return;
    const frameInterval = 1000 / ASCII_TARGET_FPS;
    if (asciiLastFrameTime && now - asciiLastFrameTime < frameInterval) {
        asciiRafId = requestAnimationFrame(renderAsciiFrame);
        return;
    }
    asciiLastFrameTime = now;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const cols = window.matchMedia('(max-width: 767px)').matches ? ASCII_MOBILE_COLS : ASCII_DESKTOP_COLS;
    const outputSize = isMobile ? ASCII_OUTPUT_SIZE_MOBILE : ASCII_OUTPUT_SIZE_DESKTOP;
    const rows = Math.max(
        28,
        Math.floor(cols * (ASCII_CHAR_WIDTH_FACTOR / ASCII_LINE_HEIGHT_FACTOR) * (outputSize / outputSize))
    );

    asciiCanvasEl.width = cols;
    asciiCanvasEl.height = rows;
    const ctx = asciiCanvasEl.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        setAsciiStatus('Canvas is unavailable in this browser.');
        asciiRafId = requestAnimationFrame(renderAsciiFrame);
        return;
    }

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(asciiVideoEl, -cols, 0, cols, rows);
    ctx.restore();
    const imageData = ctx.getImageData(0, 0, cols, rows).data;
    const foregroundMaxIndex = ASCII_FOREGROUND_CHARSET.length - 1;
    const backgroundMaxIndex = ASCII_BACKGROUND_CHARSET.length - 1;
    const gray = new Float32Array(cols * rows);

    for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
            const offset = (y * cols + x) * 4;
            const r = imageData[offset];
            const g = imageData[offset + 1];
            const b = imageData[offset + 2];
            gray[y * cols + x] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
    }
    const lines = [];

    for (let y = 0; y < rows; y += 1) {
        let line = '';
        for (let x = 0; x < cols; x += 1) {
            const idx = y * cols + x;
            const current = gray[idx];
            const right = gray[y * cols + Math.min(cols - 1, x + 1)];
            const down = gray[Math.min(rows - 1, y + 1) * cols + x];
            const edge = clamp((Math.abs(current - right) + Math.abs(current - down)) / 255, 0, 1);
            const luma = 1 - current / 255;

            const dx = (x / Math.max(1, cols - 1)) - 0.5;
            const dy = (y / Math.max(1, rows - 1)) - 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const centerBoost = clamp(1 - dist * 2, 0, 1);

            const humanScore = clamp(
                luma * ASCII_LUMA_WEIGHT +
                edge * ASCII_EDGE_WEIGHT +
                centerBoost * ASCII_CENTER_WEIGHT,
                0,
                1
            );

            if (humanScore < ASCII_HUMAN_THRESHOLD) {
                const bgIndex = Math.min(backgroundMaxIndex, Math.floor(luma * backgroundMaxIndex));
                line += ASCII_BACKGROUND_CHARSET[bgIndex] || ' ';
                continue;
            }

            const fgIndex = Math.min(foregroundMaxIndex, Math.floor(humanScore * foregroundMaxIndex));
            line += ASCII_FOREGROUND_CHARSET[fgIndex] || ' ';
        }
        lines.push(line);
    }

    drawAsciiOutput(lines);
    asciiRafId = requestAnimationFrame(renderAsciiFrame);
};

const startAsciiMirror = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
        setAsciiStatus('Camera API is unavailable in this browser.');
        return;
    }
    if (!asciiVideoEl || !asciiOutputCanvasEl) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 },
            },
            audio: false,
        });
        asciiStream = stream;
        asciiVideoEl.srcObject = stream;
        await asciiVideoEl.play();
        asciiRunning = true;
        setAsciiStatus('Camera active. Rendering real-time ASCII mirror.');
        syncAsciiToggle();
        asciiRafId = requestAnimationFrame(renderAsciiFrame);
    } catch (_error) {
        asciiRunning = false;
        setAsciiStatus('Camera access denied or unavailable.');
        syncAsciiToggle();
    }
};

const initAsciiMirror = () => {
    if (!asciiToggleBtn) return;
    syncAsciiToggle();
    drawAsciiOutput(['ASCII mirror standby...']);
    asciiToggleBtn.addEventListener('click', () => {
        if (asciiRunning) {
            stopAsciiMirror();
            return;
        }
        startAsciiMirror();
    });
    window.addEventListener('beforeunload', () => {
        if (asciiStream) stopAsciiMirror();
    });
    window.addEventListener('resize', () => {
        drawAsciiOutput(asciiLastLines);
    });
};

const initBackgroundMusic = () => {
    if (!musicAudioEl || !musicToggleBtn || !musicVolumeEl) return;

    const syncMusicButton = () => {
        musicToggleBtn.textContent = musicAudioEl.paused ? 'Play' : 'Stop';
        setButtonPressed(musicToggleBtn, !musicAudioEl.paused);
    };

    const persistMusicState = (isPlaying) => {
        storageSet(MUSIC_STATE_KEY, isPlaying ? '1' : '0');
    };

    const playMusic = async ({ broadcast = true, persist = true } = {}) => {
        try {
            await musicAudioEl.play();
            if (persist) persistMusicState(true);
            if (broadcast) broadcastSync({ type: 'musicEnabled', value: true });
        } catch (_error) {
            // Autoplay may be blocked by browser policy until user interaction.
        } finally {
            syncMusicButton();
        }
    };
    const stopMusic = ({ broadcast = true, persist = true } = {}) => {
        musicAudioEl.pause();
        if (persist) persistMusicState(false);
        if (broadcast) broadcastSync({ type: 'musicEnabled', value: false });
        shouldResumeMusicOnFocus = false;
        syncMusicButton();
    };
    applyMusicEnabledState = (enabled, options = {}) => {
        if (enabled) {
            void playMusic(options);
            return;
        }
        stopMusic(options);
    };

    let initialVolume = DEFAULT_MUSIC_VOLUME;
    try {
        const storedVolume = Number.parseFloat(storageGet(MUSIC_VOLUME_KEY) ?? '');
        if (Number.isFinite(storedVolume)) {
            initialVolume = clamp(storedVolume, 0, 1);
        }
    } catch (_error) {
        // Keep default volume.
    }

    musicAudioEl.volume = initialVolume;
    musicVolumeEl.value = `${ Math.round(initialVolume * 100) }`;

    let shouldAutoPlay = true;
    try {
        shouldAutoPlay = storageGet(MUSIC_STATE_KEY) !== '0';
    } catch (_error) {
        shouldAutoPlay = true;
    }

    if (shouldAutoPlay) {
        void playMusic();
    } else {
        stopMusic({ broadcast: false, persist: false });
    }

    musicToggleBtn.addEventListener('click', () => {
        if (musicAudioEl.paused) {
            void playMusic();
            return;
        }
        stopMusic();
    });

    musicVolumeEl.addEventListener('input', () => {
        const volume = clamp(Number.parseInt(musicVolumeEl.value, 10) / 100, 0, 1);
        musicAudioEl.volume = volume;
        storageSet(MUSIC_VOLUME_KEY, `${ volume }`);
        broadcastSync({ type: 'musicVolume', value: volume });
    });

    musicAudioEl.addEventListener('play', syncMusicButton);
    musicAudioEl.addEventListener('pause', syncMusicButton);
    syncMusicButton();
};

const applyThemeMode = (mode) => {
    if (mode === 'dark') {
        root.classList.add('dark');
        storageSet(THEME_STORAGE_KEY, 'dark');
    } else {
        root.classList.remove('dark');
        storageSet(THEME_STORAGE_KEY, 'light');
    }
    renderThemeButton();
};

const initMultiWindowSync = () => {
    const applyRemotePayload = (payload) => {
        if (!payload || typeof payload !== 'object') return;
        applyingRemoteSync = true;
        try {
            if (payload.type === 'theme') {
                applyThemeMode(payload.value === 'dark' ? 'dark' : 'light');
            }
            if (payload.type === 'musicEnabled' && musicAudioEl && musicToggleBtn) {
                const shouldPlay = Boolean(payload.value);
                if (applyMusicEnabledState) {
                    applyMusicEnabledState(shouldPlay, { broadcast: false, persist: true });
                }
            }
            if (payload.type === 'musicVolume' && musicAudioEl && musicVolumeEl) {
                const volume = clamp(Number(payload.value), 0, 1);
                musicAudioEl.volume = volume;
                musicVolumeEl.value = `${ Math.round(volume * 100) }`;
                storageSet(MUSIC_VOLUME_KEY, `${ volume }`);
            }
            if (payload.type === 'presencePing') {
                renderMultiWindowState();
            }
        } finally {
            applyingRemoteSync = false;
        }
    };

    if ('BroadcastChannel' in window) {
        multiSyncChannel = new BroadcastChannel(MULTI_SYNC_CHANNEL);
        multiSyncChannel.addEventListener('message', (event) => {
            applyRemotePayload(event.data);
        });
    }

    window.addEventListener('storage', (event) => {
        if (event.key === THEME_STORAGE_KEY && event.newValue) {
            applyRemotePayload({ type: 'theme', value: event.newValue });
            return;
        }
        if (event.key === MUSIC_STATE_KEY && event.newValue) {
            applyRemotePayload({ type: 'musicEnabled', value: event.newValue === '1' });
            return;
        }
        if (event.key === MUSIC_VOLUME_KEY && event.newValue) {
            const volume = Number.parseFloat(event.newValue);
            if (Number.isFinite(volume)) {
                applyRemotePayload({ type: 'musicVolume', value: volume });
            }
        }
    });
};

const initVoiceControl = () => {
    if (!voiceToggleBtn) return;
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

    const setVoiceUi = (isActive, isSupported = true) => {
        if (!isSupported) {
            voiceToggleBtn.textContent = 'Voice N/A';
            voiceToggleBtn.disabled = true;
            voiceToggleBtn.classList.add('opacity-60', 'cursor-not-allowed');
            setButtonPressed(voiceToggleBtn, false);
            return;
        }
        voiceToggleBtn.textContent = isActive ? 'Voice On' : 'Voice Off';
        voiceToggleBtn.classList.toggle('bg-cyan-500/15', isActive);
        voiceToggleBtn.classList.toggle('dark:bg-green-500/15', isActive);
        setButtonPressed(voiceToggleBtn, isActive);
    };

    if (!SpeechRecognitionApi) {
        setVoiceUi(false, false);
        return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    let shouldListen = false;

    const showVoiceToast = (message, heardText = '') => {
        if (!voiceToastEl || !voiceToastTextEl) return;
        const normalizedHeardText = (heardText || '').trim();
        voiceToastTextEl.textContent = normalizedHeardText
            ? `${ message } You said: "${ normalizedHeardText }".`
            : message;
        showToast(voiceToastEl, VOICE_TOAST_DURATION);
    };

    const runCommand = (rawCommand) => {
        const command = rawCommand.toLowerCase().trim();
        console.log('Your command:', command);
        let handled = false;
        if (command.includes('dark mode')) {
            applyThemeMode('dark');
            handled = true;
        }
        if (command.includes('light mode')) {
            applyThemeMode('light');
            handled = true;
        }
        if (command.includes('play music') && musicAudioEl?.paused) {
            musicToggleBtn?.click();
            handled = true;
        }
        if (command.includes('stop music') && musicAudioEl && !musicAudioEl.paused) {
            musicToggleBtn?.click();
            handled = true;
        }
        if (!handled) {
            showVoiceToast('Unknown command. Try: Dark Mode, Light Mode, Play Music, Stop Music.', rawCommand);
        }
    };

    recognition.addEventListener('result', (event) => {
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const result = event.results[index];
            if (!result.isFinal) continue;
            const transcript = result[0]?.transcript ?? '';
            runCommand(transcript);
        }
    });

    recognition.addEventListener('end', () => {
        if (!shouldListen) return;
        try {
            recognition.start();
        } catch (_error) {
            shouldListen = false;
            setVoiceUi(false);
        }
    });

    recognition.addEventListener('error', () => {
        if (!shouldListen) return;
        shouldListen = false;
        setVoiceUi(false);
    });

    voiceToggleBtn.addEventListener('click', () => {
        if (shouldListen) {
            shouldListen = false;
            recognition.stop();
            setVoiceUi(false);
            return;
        }
        shouldListen = true;
        setVoiceUi(true);
        try {
            recognition.start();
        } catch (_error) {
            shouldListen = false;
            setVoiceUi(false);
        }
    });

    setVoiceUi(false);
};

const initFpsHud = () => {
    if (!fpsEl) return;
    let frames = 0;
    let lastTime = performance.now();

    const tick = (now) => {
        frames += 1;
        const delta = now - lastTime;
        if (delta >= FPS_UPDATE_INTERVAL) {
            const fps = Math.round((frames * 1000) / delta);
            fpsEl.textContent = `${ fps }`;
            frames = 0;
            lastTime = now;
        }
        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

const initScrollSpeedHud = () => {
    if (!scrollSpeedEl) return;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let stopTimer = null;

    window.addEventListener('scroll', () => {
        const now = performance.now();
        const currentY = window.scrollY;
        const dy = Math.abs(currentY - lastY);
        const dt = now - lastTime;
        if (dt > 0) {
            const speed = Math.round((dy * 1000) / dt);
            scrollSpeedEl.textContent = `${ speed }`;
        }
        lastY = currentY;
        lastTime = now;

        if (stopTimer) clearTimeout(stopTimer);
        stopTimer = setTimeout(() => {
            scrollSpeedEl.textContent = '0';
        }, 140);
    }, { passive: true });
};

const initBatteryInfo = async () => {
    if (!('getBattery' in navigator)) {
        batteryText = 'n/a';
        return;
    }
    try {
        const battery = await navigator.getBattery();
        const updateBattery = () => {
            const level = Math.round((battery.level ?? 0) * 100);
            batteryText = `${ level }%${ battery.charging ? ' (charging)' : '' }`;
            if (shouldNotifyLowBattery(level, battery.charging)) {
                showLowBatteryToast();
            }
        };
        updateBattery();
        battery.addEventListener('chargingchange', updateBattery);
        battery.addEventListener('levelchange', updateBattery);
    } catch (_error) {
        batteryText = 'n/a';
    }
};

const showReturningVisitorToast = () => {
    showToast(returningToastEl, DEFAULT_TOAST_DURATION);
};

const showLowBatteryToast = () => {
    showToast(lowBatteryToastEl, LOW_BATTERY_TOAST_DURATION);
};

const shouldNotifyLowBattery = (level, charging) => {
    if (charging) {
        lowBatteryToastShown = false;
        return false;
    }
    if (level > LOW_BATTERY_THRESHOLD) {
        lowBatteryToastShown = false;
        return false;
    }
    if (lowBatteryToastShown) return false;
    lowBatteryToastShown = true;
    return true;
};

const handleReturningVisitor = () => {
    try {
        const previousCount = Number.parseInt(storageGet(VISIT_COUNT_KEY) ?? '0', 10);
        const safeCount = Number.isFinite(previousCount) && previousCount > 0 ? previousCount : 0;
        const nextCount = safeCount + 1;
        const visited = storageGet(RETURNING_VISITOR_KEY) === '1' || safeCount > 0;
        if (visitCountEl) {
            visitCountEl.textContent = `${ nextCount }`;
        }
        storageSet(VISIT_COUNT_KEY, `${ nextCount }`);
        storageSet(RETURNING_VISITOR_KEY, '1');
        if (visited) {
            showReturningVisitorToast();
        }
    } catch (_error) {
        // Ignore storage restrictions in private mode or strict browser policies.
    }
};

const initLeaveWarning = () => {
  if (!ENABLE_NATIVE_LEAVE_WARNING) return;
  window.addEventListener('beforeunload', (event) => {
    if (allowPageLeave) return;
    event.preventDefault();
    event.returnValue = LEAVE_WARNING_TEXT;
    return LEAVE_WARNING_TEXT;
  });
};

const showLeaveModal = (href) => {
  if (!leaveModalEl) return;
  pendingLeaveHref = href;
  lastFocusedBeforeModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  leaveModalEl.setAttribute('aria-hidden', 'false');
  leaveModalEl.classList.remove('hidden');
  leaveModalEl.classList.add('flex');
  requestAnimationFrame(() => {
    leaveModalEl.classList.remove('opacity-0');
    leaveModalEl.classList.add('opacity-100');
    if (leaveStayBtn) {
      leaveStayBtn.focus();
    } else if (leaveModalDialogEl) {
      leaveModalDialogEl.focus();
    }
  });
};

const hideLeaveModal = () => {
  if (!leaveModalEl) return;
  leaveModalEl.classList.remove('opacity-100');
  leaveModalEl.classList.add('opacity-0');
  setTimeout(() => {
    leaveModalEl.classList.add('hidden');
    leaveModalEl.classList.remove('flex');
    leaveModalEl.setAttribute('aria-hidden', 'true');
    if (lastFocusedBeforeModal) {
      lastFocusedBeforeModal.focus();
      lastFocusedBeforeModal = null;
    }
  }, 260);
};

const initCustomLeaveDialog = () => {
  if (!leaveModalEl || !leaveStayBtn || !leaveConfirmBtn || !leaveModalDialogEl) return;
  history.pushState({ guard: true }, '', window.location.href);

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    event.preventDefault();
    showLeaveModal(href);
  });

  leaveStayBtn.addEventListener('click', () => {
    pendingLeaveHref = '';
    hideLeaveModal();
  });

  leaveConfirmBtn.addEventListener('click', () => {
    if (!pendingLeaveHref) return;
    allowPageLeave = true;
    if (pendingLeaveHref === 'history-back') {
      history.back();
      return;
    }
    window.location.href = pendingLeaveHref;
  });

  window.addEventListener('popstate', () => {
    if (allowPageLeave) return;
    history.pushState({ guard: true }, '', window.location.href);
    showLeaveModal('history-back');
  });

  leaveModalEl.addEventListener('click', (event) => {
    if (event.target === leaveModalEl) {
      pendingLeaveHref = '';
      hideLeaveModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && !leaveModalEl.classList.contains('hidden')) {
      const focusable = leaveModalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }
    if (event.key !== 'Escape') return;
    if (leaveModalEl.classList.contains('hidden')) return;
    pendingLeaveHref = '';
    hideLeaveModal();
  });
};

const initAttentionOnTabBlur = () => {
    const blinkFavicons = [buildEmojiFavicon('👀'), buildEmojiFavicon('💬')];
    let index = 0;

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            if (musicAudioEl && !musicAudioEl.paused) {
                shouldResumeMusicOnFocus = true;
                musicAudioEl.pause();
            } else {
                shouldResumeMusicOnFocus = false;
            }
            document.title = AWAY_TITLE_TEXT;
            setFavicon(blinkFavicons[0]);
            if (tabBlinkIntervalId) clearInterval(tabBlinkIntervalId);
            tabBlinkIntervalId = setInterval(() => {
                index = (index + 1) % blinkFavicons.length;
                setFavicon(blinkFavicons[index]);
            }, TAB_BLINK_INTERVAL);
            return;
        }

        document.title = initialTitle;
        if (tabBlinkIntervalId) {
            clearInterval(tabBlinkIntervalId);
            tabBlinkIntervalId = null;
        }
        if (initialFaviconHref) {
            setFavicon(initialFaviconHref);
        } else {
            setFavicon(buildEmojiFavicon('💻'));
        }

        if (musicAudioEl && shouldResumeMusicOnFocus) {
            const shouldPlayAfterFocus = storageGet(MUSIC_STATE_KEY) !== '0';
            if (shouldPlayAfterFocus) {
                musicAudioEl.play().catch(() => {
                    // Ignore autoplay restrictions after tab focus restore.
                });
            }
            shouldResumeMusicOnFocus = false;
        }
    });
};

const showResizeToast = () => {
    if (!resizeToastEl || !canShowResizeToast) return;
    canShowResizeToast = false;
    showToast(resizeToastEl, RESIZE_TOAST_DURATION);

    if (resizeToastCooldownId) clearTimeout(resizeToastCooldownId);
    resizeToastCooldownId = setTimeout(() => {
        canShowResizeToast = true;
    }, RESIZE_TOAST_COOLDOWN);
};

const initResizeToast = () => {
    if (!resizeToastEl) return;
    window.addEventListener('resize', () => {
        const isMobileDevice =
            window.matchMedia('(max-width: 1024px)').matches &&
            window.matchMedia('(pointer: coarse)').matches;
        if (isMobileDevice) return;

        if (resizeDebounceId) clearTimeout(resizeDebounceId);
        resizeDebounceId = setTimeout(() => {
            const nextWidth = window.innerWidth;
            const nextHeight = window.innerHeight;
            const widthDelta = Math.abs(nextWidth - lastResizeWidth);
            const heightDelta = Math.abs(nextHeight - lastResizeHeight);
            const isIosToolbarResize = widthDelta < RESIZE_WIDTH_THRESHOLD && heightDelta > 0;
            lastResizeWidth = nextWidth;
            lastResizeHeight = nextHeight;
            if (isIosToolbarResize) return;
            showResizeToast();
        }, RESIZE_TOAST_DEBOUNCE);
    });
};

const clientInfo = () => {
    const ua = navigator.userAgent;
    const { innerWidth, innerHeight } = window;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const platform = navigator.platform || 'unknown';
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const referrerHost = (() => {
        if (!document.referrer) return 'direct';
        try {
            return new URL(document.referrer).hostname || 'direct';
        } catch (_error) {
            return 'unknown';
        }
    })();
    const networkText = connection
        ? `${ connection.effectiveType ?? 'n/a' } ${ connection.downlink ?? '0' }Mbps`
        : 'unknown';
    clientDataLabels.forEach((el) => {
        const key = el.getAttribute('data-client');
        if (key === 'view') {
            el.textContent = `${ innerWidth }×${ innerHeight }`;
        } else if (key === 'user') {
            el.textContent = ua.split(' (')[0];
        } else if (key === 'tz') {
            el.textContent = timezone;
        } else if (key === 'network') {
            el.textContent = networkText;
        } else if (key === 'platform') {
            el.textContent = platform;
        } else if (key === 'scheme') {
            el.textContent = colorScheme;
        } else if (key === 'referrer') {
            el.textContent = referrerHost;
        } else if (key === 'battery') {
            el.textContent = batteryText;
        }
    });
};

initBatteryInfo();
initFpsHud();
initScrollSpeedHud();
clientInfo();
setInterval(clientInfo, METRIC_INTERVAL * 2);

const initCustomCursor = () => {
    const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;
    if (!supportsFinePointer || !cursorDot || !cursorRing) return;

    document.body.classList.add('cursor-none');
    cursorDot.classList.remove('hidden');
    cursorRing.classList.remove('hidden');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };

    const renderRing = () => {
        ring.x += (pointer.x - ring.x) * 0.2;
        ring.y += (pointer.y - ring.y) * 0.2;
        cursorRing.style.left = `${ ring.x }px`;
        cursorRing.style.top = `${ ring.y }px`;
        requestAnimationFrame(renderRing);
    };

    window.addEventListener('pointermove', (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        cursorDot.style.left = `${ pointer.x }px`;
        cursorDot.style.top = `${ pointer.y }px`;
    });

    document.addEventListener('mouseover', (event) => {
        if (!(event.target instanceof Element)) return;
        const isInteractive = event.target.closest(INTERACTIVE_SELECTOR);
        if (!isInteractive) return;
        cursorDot.classList.add('scale-150');
        cursorRing.classList.add('h-12', 'w-12', 'bg-cyan-400/20', 'dark:bg-green-400/20');
    });

    document.addEventListener('mouseout', (event) => {
        if (!(event.target instanceof Element)) return;
        const isInteractive = event.target.closest(INTERACTIVE_SELECTOR);
        if (!isInteractive) return;
        cursorDot.classList.remove('scale-150');
        cursorRing.classList.remove('h-12', 'w-12', 'bg-cyan-400/20', 'dark:bg-green-400/20');
    });

    renderRing();
};

renderThemeButton();
initCustomCursor();
initLeaveWarning();
initCustomLeaveDialog();
initAttentionOnTabBlur();
initResizeToast();
initBackgroundMusic();
initMultiWindowSync();
initMultiWindowPresence();
initVoiceControl();
initAsciiMirror();
initShareCv();
initOfferPictureInPicture();
initIntroSpeech();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextMode = root.classList.contains('dark') ? 'light' : 'dark';
        applyThemeMode(nextMode);
        broadcastSync({ type: 'theme', value: nextMode });
    });
}

const hideSplash = async () => {
    if (!splashEl) return;

    if (splashProgressEl) {
        requestAnimationFrame(() => {
            splashProgressEl.style.width = '100%';
        });
    }

    await wait(420);
    splashEl.style.opacity = '0';
    splashEl.style.transform = 'scale(1.015)';
    await wait(700);
    splashEl.style.display = 'none';
};

const mountCursor = (el) => {
    const textNode = document.createTextNode('');
    const cursor = document.createElement('span');
    cursor.className = 'ml-1 inline-block h-[0.95em] w-[8px] animate-pulse align-baseline bg-current';
    el.textContent = '';
    el.append(textNode, cursor);
    return { textNode, cursor };
};

const typeChars = async (el, text, speed = 35, onStep) => {
    const { textNode, cursor } = mountCursor(el);
    for (const char of text) {
        textNode.nodeValue += char;
        if (onStep) onStep(textNode.nodeValue);
        await wait(speed);
    }
    return { textNode, cursor };
};

const typeWords = async (el, text, speed = 45, onStep) => {
    const { textNode, cursor } = mountCursor(el);
    const words = text.split(' ');
    for (const word of words) {
        textNode.nodeValue += (textNode.nodeValue ? ' ' : '') + word;
        if (onStep) onStep(textNode.nodeValue);
        await wait(speed);
    }
    return { textNode, cursor };
};

const runTypingIntro = async () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const typingElements = [accessGrantedEl, heroNameEl, heroRoleEl, summaryTextEl];
    if (typingElements.some((el) => !el)) return;

    typingElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transition = 'opacity .22s ease';
    });

    if (prefersReduced) return;

    const accessText = accessGrantedEl.textContent.trim();
    const heroNameText = heroNameEl.textContent.trim();
    const heroRoleText = heroRoleEl.textContent.trim();
    const summaryText = summaryTextEl.textContent.trim();

    const typingJobs = [
        typeChars(accessGrantedEl, accessText, TYPING_SPEED.access),
        typeChars(heroNameEl, heroNameText, TYPING_SPEED.name, (typed) => heroNameEl.setAttribute('data-text', typed)),
        typeChars(heroRoleEl, heroRoleText, TYPING_SPEED.role),
        typeWords(summaryTextEl, summaryText, TYPING_SPEED.summaryWords),
    ];

    const completed = await Promise.all(typingJobs);
    completed.forEach(({ cursor }) => {
        if (cursor) {
            cursor.classList.remove('animate-pulse');
            cursor.classList.add('invisible');
        }
    });
    heroNameEl.setAttribute('data-text', heroNameText);
};

window.addEventListener(
    'load',
    async () => {
        await hideSplash();
        handleReturningVisitor();
        runTypingIntro();
    },
    { once: true }
);
