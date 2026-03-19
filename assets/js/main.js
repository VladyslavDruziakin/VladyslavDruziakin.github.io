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
const lowBatteryToastEl = document.getElementById('low-battery-toast');
const resizeToastEl = document.getElementById('resize-toast');
const leaveModalEl = document.getElementById('leave-modal');
const leaveStayBtn = document.getElementById('leave-stay-btn');
const leaveConfirmBtn = document.getElementById('leave-confirm-btn');
const musicAudioEl = document.getElementById('site-music');
const musicToggleBtn = document.getElementById('music-toggle');
const musicVolumeEl = document.getElementById('music-volume');
const voiceToggleBtn = document.getElementById('voice-toggle');
const voiceToastEl = document.getElementById('voice-toast');
const voiceToastTextEl = document.getElementById('voice-toast-text');
const asciiToggleBtn = document.getElementById('ascii-toggle');
const asciiStatusEl = document.getElementById('ascii-status');
const asciiOutputCanvasEl = document.getElementById('ascii-output-canvas');
const asciiVideoEl = document.getElementById('ascii-video-source');
const asciiCanvasEl = document.getElementById('ascii-video-canvas');
const visitCountEl = document.querySelector('[data-visit-count]');
const fpsEl = document.querySelector('[data-perf="fps"]');
const scrollSpeedEl = document.querySelector('[data-perf="scroll-speed"]');
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label';
const TYPING_SPEED = {
    access: 55,
    name: 70,
    role: 40,
    summaryWords: 48,
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
const MUSIC_STATE_KEY = 'vd_music_enabled';
const MUSIC_VOLUME_KEY = 'vd_music_volume';
const DEFAULT_MUSIC_VOLUME = 0.3;
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
        console.log('%cИнспектируете? Значит, я вас заинтересовал. 😎 Вместо того чтобы копаться в DOM-дереве, давайте обсудим, как я могу усилить вашу команду.', 'color: #00ff00; font-size: 20px; font-weight: bold;');
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
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clientDataLabels = document.querySelectorAll('[data-client]');

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const drawAsciiOutput = (lines) => {
    if (!asciiOutputCanvasEl) return;
    if (!asciiOutputCtx) {
        asciiOutputCtx = asciiOutputCanvasEl.getContext('2d');
    }
    if (!asciiOutputCtx) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const outputSize = isMobile ? ASCII_OUTPUT_SIZE_MOBILE : ASCII_OUTPUT_SIZE_DESKTOP;
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const realWidth = Math.floor(outputSize * dpr);
    const realHeight = Math.floor(outputSize * dpr);
    if (asciiOutputCanvasEl.width !== realWidth || asciiOutputCanvasEl.height !== realHeight) {
        asciiOutputCanvasEl.width = realWidth;
        asciiOutputCanvasEl.height = realHeight;
        asciiOutputCanvasEl.style.width = `${ outputSize }px`;
        asciiOutputCanvasEl.style.height = `${ outputSize }px`;
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
};

const initBackgroundMusic = () => {
    if (!musicAudioEl || !musicToggleBtn || !musicVolumeEl) return;

    const syncMusicButton = () => {
        musicToggleBtn.textContent = musicAudioEl.paused ? 'Play' : 'Stop';
    };

    const persistMusicState = (isPlaying) => {
        try {
            localStorage.setItem(MUSIC_STATE_KEY, isPlaying ? '1' : '0');
        } catch (_error) {
            // Ignore storage limits/privacy restrictions.
        }
    };

    const playMusic = async () => {
        try {
            await musicAudioEl.play();
            persistMusicState(true);
        } catch (_error) {
            // Autoplay may be blocked by browser policy until user interaction.
        } finally {
            syncMusicButton();
        }
    };

    let initialVolume = DEFAULT_MUSIC_VOLUME;
    try {
        const storedVolume = Number.parseFloat(localStorage.getItem(MUSIC_VOLUME_KEY) ?? '');
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
        shouldAutoPlay = localStorage.getItem(MUSIC_STATE_KEY) !== '0';
    } catch (_error) {
        shouldAutoPlay = true;
    }

    if (shouldAutoPlay) {
        playMusic();
    } else {
        musicAudioEl.pause();
        syncMusicButton();
    }

    musicToggleBtn.addEventListener('click', () => {
        if (musicAudioEl.paused) {
            playMusic();
            return;
        }
        musicAudioEl.pause();
        persistMusicState(false);
        syncMusicButton();
    });

    musicVolumeEl.addEventListener('input', () => {
        const volume = clamp(Number.parseInt(musicVolumeEl.value, 10) / 100, 0, 1);
        musicAudioEl.volume = volume;
        try {
            localStorage.setItem(MUSIC_VOLUME_KEY, `${ volume }`);
        } catch (_error) {
            // Ignore storage limits/privacy restrictions.
        }
    });

    musicAudioEl.addEventListener('play', syncMusicButton);
    musicAudioEl.addEventListener('pause', syncMusicButton);
    syncMusicButton();
};

const applyThemeMode = (mode) => {
    if (mode === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    renderThemeButton();
};

const initVoiceControl = () => {
    if (!voiceToggleBtn) return;
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

    const setVoiceUi = (isActive, isSupported = true) => {
        if (!isSupported) {
            voiceToggleBtn.textContent = 'Voice N/A';
            voiceToggleBtn.disabled = true;
            voiceToggleBtn.classList.add('opacity-60', 'cursor-not-allowed');
            return;
        }
        voiceToggleBtn.textContent = isActive ? 'Voice On' : 'Voice Off';
        voiceToggleBtn.classList.toggle('bg-cyan-500/15', isActive);
        voiceToggleBtn.classList.toggle('dark:bg-green-500/15', isActive);
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
    let voiceToastTimer = null;

    const showVoiceToast = (message, heardText = '') => {
        if (!voiceToastEl || !voiceToastTextEl) return;
        const normalizedHeardText = (heardText || '').trim();
        voiceToastTextEl.textContent = normalizedHeardText
            ? `${ message } You said: "${ normalizedHeardText }".`
            : message;
        voiceToastEl.classList.remove('hidden');
        requestAnimationFrame(() => {
            voiceToastEl.classList.remove('opacity-0', 'translate-y-2');
            voiceToastEl.classList.add('opacity-100', 'translate-y-0');
        });

        if (voiceToastTimer) clearTimeout(voiceToastTimer);
        voiceToastTimer = setTimeout(() => {
            voiceToastEl.classList.remove('opacity-100', 'translate-y-0');
            voiceToastEl.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                voiceToastEl.classList.add('hidden');
            }, 520);
        }, VOICE_TOAST_DURATION);
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
    if (!returningToastEl) return;
    returningToastEl.classList.remove('hidden');
    requestAnimationFrame(() => {
        returningToastEl.classList.remove('opacity-0', 'translate-y-2');
        returningToastEl.classList.add('opacity-100', 'translate-y-0');
    });

    setTimeout(() => {
        returningToastEl.classList.remove('opacity-100', 'translate-y-0');
        returningToastEl.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
            returningToastEl.classList.add('hidden');
        }, 520);
    }, 4200);
};

const showLowBatteryToast = () => {
    if (!lowBatteryToastEl) return;
    lowBatteryToastEl.classList.remove('hidden');
    requestAnimationFrame(() => {
        lowBatteryToastEl.classList.remove('opacity-0', 'translate-y-2');
        lowBatteryToastEl.classList.add('opacity-100', 'translate-y-0');
    });

    setTimeout(() => {
        lowBatteryToastEl.classList.remove('opacity-100', 'translate-y-0');
        lowBatteryToastEl.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
            lowBatteryToastEl.classList.add('hidden');
        }, 520);
    }, 4800);
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
        const previousCount = Number.parseInt(localStorage.getItem(VISIT_COUNT_KEY) ?? '0', 10);
        const safeCount = Number.isFinite(previousCount) && previousCount > 0 ? previousCount : 0;
        const nextCount = safeCount + 1;
        const visited = localStorage.getItem(RETURNING_VISITOR_KEY) === '1' || safeCount > 0;
        if (visitCountEl) {
            visitCountEl.textContent = `${ nextCount }`;
        }
        localStorage.setItem(VISIT_COUNT_KEY, `${ nextCount }`);
        localStorage.setItem(RETURNING_VISITOR_KEY, '1');
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
  leaveModalEl.classList.remove('hidden');
  leaveModalEl.classList.add('flex');
  requestAnimationFrame(() => {
    leaveModalEl.classList.remove('opacity-0');
    leaveModalEl.classList.add('opacity-100');
  });
};

const hideLeaveModal = () => {
  if (!leaveModalEl) return;
  leaveModalEl.classList.remove('opacity-100');
  leaveModalEl.classList.add('opacity-0');
  setTimeout(() => {
    leaveModalEl.classList.add('hidden');
    leaveModalEl.classList.remove('flex');
  }, 260);
};

const initCustomLeaveDialog = () => {
  if (!leaveModalEl || !leaveStayBtn || !leaveConfirmBtn) return;
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
            musicAudioEl.play().catch(() => {
                // Ignore autoplay restrictions after tab focus restore.
            });
            shouldResumeMusicOnFocus = false;
        }
    });
};

const showResizeToast = () => {
    if (!resizeToastEl || !canShowResizeToast) return;
    canShowResizeToast = false;
    resizeToastEl.classList.remove('hidden');
    requestAnimationFrame(() => {
        resizeToastEl.classList.remove('opacity-0', 'translate-y-2');
        resizeToastEl.classList.add('opacity-100', 'translate-y-0');
    });

    setTimeout(() => {
        resizeToastEl.classList.remove('opacity-100', 'translate-y-0');
        resizeToastEl.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
            resizeToastEl.classList.add('hidden');
        }, 520);
    }, 2600);

    if (resizeToastCooldownId) clearTimeout(resizeToastCooldownId);
    resizeToastCooldownId = setTimeout(() => {
        canShowResizeToast = true;
    }, RESIZE_TOAST_COOLDOWN);
};

const initResizeToast = () => {
    if (!resizeToastEl) return;
    window.addEventListener('resize', () => {
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
initVoiceControl();
initAsciiMirror();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        root.classList.toggle('dark');
        const isDark = root.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        renderThemeButton();
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
