// script.js
// Advanced interactive JS for your portfolio

(() => {
  "use strict";

  /* --------------------
     Helpers
  ---------------------*/
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const create = (tag, attrs = {}) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else el.setAttribute(k, v);
    });
    return el;
  };

  /* --------------------
     Typed.js intro
  ---------------------*/
  try {
    if (window.Typed) {
      new Typed(".text", {
        strings: [
          "Front-End Developer",
          "Content Writer",
          "Video Editor",
          "Data Entry Clerk",
          "Cold Caller",
        ],
        typeSpeed: 60,
        backSpeed: 40,
        loop: true,
        backDelay: 1600,
      });
    }
  } catch (err) {
    console.error("Typed.js init error:", err);
  }

  /* --------------------
     Smooth Scroll + Active nav
  ---------------------*/
  const navMap = {
    Home: ".home",
    About: ".s2",
    Experience: ".s3",
    Education: ".s4",
    Skillset: ".s5",
    Projects: ".s6",
    Contact: "#contact",
  };

  const navLinks = $$(".navbar a");
  navLinks.forEach((a) => {
    on(a, "click", (e) => {
      e.preventDefault();
      const text = a.textContent.trim();
      const target = document.querySelector(navMap[text] || "body");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      closeMobileMenu();
    });
  });

  const sections = Object.entries(navMap).map(([name, sel]) => ({
    name,
    el: document.querySelector(sel),
  }));

  const setActiveNav = () => {
    const top = window.scrollY + window.innerHeight / 3;
    let active = "Home";
    for (const s of sections) {
      if (!s.el) continue;
      const pos = s.el.offsetTop;
      if (pos <= top) active = s.name;
    }
    navLinks.forEach((a) =>
      a.classList.toggle("active", a.textContent.trim() === active)
    );
  };
  on(window, "scroll", throttle(setActiveNav, 150));

  /* --------------------
     Mobile Hamburger Menu
  ---------------------*/
  function setupMobileMenu() {
    const header = $(".header");
    if (!header) return;
    const burger = create("button", { class: "burger", "aria-label": "Menu" });
    burger.innerHTML = `<span></span><span></span><span></span>`;
    header.insertBefore(burger, header.firstChild);

    on(burger, "click", () => {
      header.classList.toggle("menu-open");
      burger.classList.toggle("open");
    });
  }
  function closeMobileMenu() {
    $(".header")?.classList.remove("menu-open");
    $(".burger")?.classList.remove("open");
  }

  /* --------------------
     Header hide/show on scroll
  ---------------------*/
  const header = $(".header");
  let lastScroll = window.scrollY;
  on(window, "scroll", throttle(() => {
    const st = window.scrollY;
    if (st > lastScroll && st > 120) {
      header.style.transform = "translateY(-110%)";
    } else {
      header.style.transform = "translateY(0)";
    }
    lastScroll = st;
  }, 100));

  /* --------------------
     Reveal animations
  ---------------------*/
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          ent.target.classList.add("in-view");
          revealObserver.unobserve(ent.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  [
    ".home-content",
    ".aboutme",
    ".experience-card",
    ".skill-box",
    ".project-card",
    ".contact-container",
  ].forEach((sel) => $$(sel).forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  }));

  /* --------------------
     Skill bars
  ---------------------*/
  const skills = {
    "HTML / CSS": 95,
    "JavaScript (Learning)": 65,
    Figma: 80,
    "Graphic Design": 78,
    "SEO Writing": 88,
    "Microsoft Office": 92,
  };
  function setupSkillBars() {
    $$(".skill-box").forEach((box) => {
      const title = box.querySelector("h3")?.textContent.trim();
      const pct = skills[title] || 70;
      const wrap = create("div", { class: "skill-bar-wrap" });
      const bar = create("div", { class: "skill-bar" });
      const lbl = create("span", { class: "skill-label", text: "0%" });
      wrap.appendChild(bar);
      wrap.appendChild(lbl);
      box.appendChild(wrap);

      const obs = new IntersectionObserver((ents) => {
        if (ents[0].isIntersecting) {
          animateBar(bar, lbl, pct);
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      obs.observe(box);
    });
  }
  function animateBar(bar, lbl, pct) {
    let start = null;
    const dur = 1200;
    const step = (t) => {
      if (!start) start = t;
      const prog = Math.min((t - start) / dur, 1);
      const val = Math.round(pct * prog);
      bar.style.width = val + "%";
      lbl.textContent = val + "%";
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* --------------------
     Counters
  ---------------------*/
  function setupCounters() {
    const stats = [
      { label: "Years Experience", value: 4 },
      { label: "Completed Projects", value: 12 },
      { label: "Happy Clients", value: 8 },
    ];
    const row = create("div", { class: "stat-row" });
    stats.forEach((s) => {
      const c = create("div", { class: "stat-item" });
      c.innerHTML = `<div class="num">0</div><div>${s.label}</div>`;
      row.appendChild(c);
      const obs = new IntersectionObserver((ents) => {
        if (ents[0].isIntersecting) {
          animateCount(c.querySelector(".num"), s.value);
          obs.disconnect();
        }
      });
      obs.observe(c);
    });
    $(".home-content")?.appendChild(row);
  }
  function animateCount(el, to, dur = 1500) {
    let start = null;
    const step = (t) => {
      if (!start) start = t;
      const prog = Math.min((t - start) / dur, 1);
      el.textContent = Math.floor(to * prog);
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* --------------------
     Project Lightbox Carousel
  ---------------------*/
  function setupProjectLightbox() {
    const modal = create("div", { class: "project-modal" });
    modal.innerHTML = `
      <div class="proj-inner">
        <button class="proj-close">✕</button>
        <div class="proj-media"></div>
        <button class="prev">‹</button>
        <button class="next">›</button>
        <h3 class="proj-title"></h3>
        <p class="proj-desc"></p>
      </div>`;
    document.body.appendChild(modal);

    let mediaList = [], current = 0;
    function show(idx) {
      current = (idx + mediaList.length) % mediaList.length;
      $(".proj-media", modal).innerHTML = "";
      $(".proj-media", modal).appendChild(mediaList[current]);
    }

    $$(".project-card").forEach((card) => {
      on(card, "click", () => {
        const imgs = $$("img, video", card);
        mediaList = imgs.map((m) => m.cloneNode(true));
        $(".proj-title", modal).textContent = card.querySelector("h3")?.textContent || "";
        $(".proj-desc", modal).textContent = card.querySelector("p")?.textContent || "";
        show(0);
        modal.classList.add("open");
      });
    });

    on($(".proj-close", modal), "click", () => modal.classList.remove("open"));
    on($(".prev", modal), "click", () => show(current - 1));
    on($(".next", modal), "click", () => show(current + 1));
  }

  /* --------------------
     Contact Form (Formspree)
  ---------------------*/
  function setupContactForm() {
    const form = $(".contact-form");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch("https://formspree.io/f/yourID", {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          showToast("Message sent!", "success");
          form.reset();
        } else {
          showToast("Failed to send. Try again.", "error");
        }
      } catch {
        showToast("Network error", "error");
      }
    });
  }

  /* --------------------
 
  /* --------------------
     Toast
  ---------------------*/
  function showToast(msg, type = "info") {
    const t = create("div", { class: `toast ${type}`, text: msg });
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("show"), 10);
    setTimeout(() => t.remove(), 3000);
  }

  /* --------------------
     Utils
  ---------------------*/
  function throttle(fn, wait) {
    let last = 0;
    return (...a) => {
      const now = Date.now();
      if (now - last > wait) {
        last = now;
        fn(...a);
      }
    };
  }

  /* --------------------
     Init
  ---------------------*/
  document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupSkillBars();
    setupCounters();
    setupProjectLightbox();
    setupContactForm();
    setupBackToTop();
    setActiveNav();
  });
})();


