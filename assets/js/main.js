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
const visitCountEl = document.querySelector('[data-visit-count]');
const fpsEl = document.querySelector('[data-perf="fps"]');
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
const LOW_BATTERY_TOAST_KEY = 'vd_low_battery_toast_shown';
const LOW_BATTERY_THRESHOLD = 20;
const LEAVE_WARNING_TEXT = 'I hope you copied the link. Have a great day.';
const ENABLE_NATIVE_LEAVE_WARNING = true;
const AWAY_TITLE_TEXT = 'Ready to discuss your project? 💼';
const TAB_BLINK_INTERVAL = 900;
const RESIZE_TOAST_DEBOUNCE = 260;
const RESIZE_TOAST_COOLDOWN = 7000;
let batteryText = 'n/a';
let allowPageLeave = false;
let pendingLeaveHref = '';
let tabBlinkIntervalId = null;
let resizeDebounceId = null;
let resizeToastCooldownId = null;
let canShowResizeToast = true;
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
    if (charging) return false;
    if (level > LOW_BATTERY_THRESHOLD) return false;
    try {
        if (sessionStorage.getItem(LOW_BATTERY_TOAST_KEY) === '1') return false;
        sessionStorage.setItem(LOW_BATTERY_TOAST_KEY, '1');
    } catch (_error) {
        // Ignore storage restrictions; still allow one notification attempt.
    }
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
