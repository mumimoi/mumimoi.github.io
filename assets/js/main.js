(() => {
  const STORAGE_THEME = "nr_theme_pref";        // 'dark' | 'light' | 'system'
  const STORAGE_FONT = "nr_reader_font_px";    // number

  const root = document.documentElement;
  const mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  let systemListenerInstalled = false;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getThemePref() {
    const pref = localStorage.getItem(STORAGE_THEME);
    if (pref === "dark" || pref === "light" || pref === "system") return pref;
    // Default sesuai permintaan: dark AMOLED
    return "dark";
  }

  function effectiveTheme(pref) {
    if (pref === "system") {
      if (!mql) return "dark";
      return mql.matches ? "dark" : "light";
    }
    return pref;
  }

  function applyTheme(pref) {
    const eff = effectiveTheme(pref);
    root.dataset.theme = eff;
    root.dataset.themePref = pref;

    // Update icon (moon/sun/auto)
    const icon = document.querySelector("[data-theme-icon]");
    if (icon) {
      if (pref === "system") icon.textContent = "⟐"; // auto
      else if (eff === "dark") icon.textContent = "☾";
      else icon.textContent = "☀";
    }

    // listen to system changes only if pref === 'system'
    if (pref === "system" && mql && !systemListenerInstalled) {
      if (mql.addEventListener) mql.addEventListener("change", handleSystemThemeChange); else if (mql.addListener) mql.addListener(handleSystemThemeChange);
      systemListenerInstalled = true;
    }
    if (pref !== "system" && mql && systemListenerInstalled) {
      if (mql.removeEventListener) mql.removeEventListener("change", handleSystemThemeChange); else if (mql.removeListener) mql.removeListener(handleSystemThemeChange);
      systemListenerInstalled = false;
    }
  }

  function handleSystemThemeChange() {
    const pref = getThemePref();
    if (pref === "system") applyTheme(pref);
  }

  function setThemePref(pref) {
    localStorage.setItem(STORAGE_THEME, pref);
    applyTheme(pref);
  }

  function initThemeMenu() {
    const wrapper = document.querySelector("[data-theme-switcher]");
    if (!wrapper) return;

    const btn = wrapper.querySelector("[data-theme-button]");
    const menu = wrapper.querySelector("[data-theme-menu]");
    if (!btn || !menu) return;

    function close() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    function open() {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (menu.hidden) open(); else close();
    });

    // click outside
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) close();
    });

    // escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    menu.querySelectorAll("[data-theme-set]").forEach((b) => {
      b.addEventListener("click", () => {
        const pref = b.getAttribute("data-theme-set");
        if (pref === "dark" || pref === "light" || pref === "system") {
          setThemePref(pref);
        }
        close();
      });
    });
  }

  function getFontSizePx() {
    const raw = localStorage.getItem(STORAGE_FONT);
    const n = raw ? Number(raw) : NaN;
    if (!Number.isFinite(n)) return 18;
    return clamp(Math.round(n), 14, 28);
  }

  function applyFontSize(px) {
    const size = clamp(Math.round(px), 14, 28);
    root.style.setProperty("--reader-font-size", `${size}px`);
    localStorage.setItem(STORAGE_FONT, String(size));

    const slider = document.querySelector("[data-font-slider]");
    if (slider) slider.value = String(size);
  }

  function initReaderControls() {
    const reader = document.querySelector("[data-reader]");
    if (!reader) return; // hanya di halaman chapter

    // set awal
    applyFontSize(getFontSizePx());

    const slider = document.querySelector("[data-font-slider]");
    if (slider) {
      slider.addEventListener("input", () => applyFontSize(Number(slider.value)));
    }

    document.querySelectorAll("[data-font-action]").forEach((b) => {
      b.addEventListener("click", () => {
        const action = b.getAttribute("data-font-action");
        const cur = getFontSizePx();
        if (action === "inc") applyFontSize(cur + 1);
        if (action === "dec") applyFontSize(cur - 1);
      });
    });
  }

  function initChapterMore() {
    const box = document.querySelector("[data-chapter-list]");
    const btn = document.querySelector("[data-chapter-toggle]");
    if (!box || !btn) return;

    const updateText = () => {
      btn.textContent = box.classList.contains("is-expanded") ? "Less" : "More";
    };

    btn.addEventListener("click", () => {
      box.classList.toggle("is-expanded");
      updateText();
    });

    updateText();
  }

  // Boot
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getThemePref());
    initThemeMenu();
    initReaderControls();
    initChapterMore();
  });
})();

(() => {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  let lastY = window.scrollY || 0;
  let offset = 0; // 0 = tampil penuh, height = hilang penuh
  let height = topbar.offsetHeight;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const update = () => {
    height = topbar.offsetHeight;
    topbar.style.transform = `translateY(${-offset}px)`;
  };

  // update awal
  update();

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const dy = y - lastY;

      // dy > 0: scroll turun => sembunyikan pelan-pelan
      // dy < 0: scroll naik => munculkan pelan-pelan
      offset = clamp(offset + dy, 0, height);

      // kalau sudah di paling atas, paksa tampil penuh
      if (y <= 0) offset = 0;

      topbar.style.transform = `translateY(${-offset}px)`;

      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", update);
})();
