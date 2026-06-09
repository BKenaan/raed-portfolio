/* =========================================================
   Raed Kenaan — Portfolio interactions
   Theme toggle · mobile nav · reveal · counters · meters
   · network canvas · contact form
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.body;
  const saved = localStorage.getItem("rk-theme");
  if (saved) root.setAttribute("data-theme", saved);
  $("#themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("rk-theme", next);
  });

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = $("#navBurger");
  const links = $("#navLinks");
  const toggleMenu = (open) => {
    links.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => toggleMenu(!links.classList.contains("open")));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const dur = 1500;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counters = $$(".counter");
  if (prefersReduced) {
    counters.forEach((el) => (el.textContent = parseFloat(el.dataset.target).toLocaleString() + (el.dataset.suffix || "")));
  } else {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Skill meters ---------- */
  const meters = $$(".meter");
  const mio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const bar = $("i", e.target);
          bar.style.width = (e.target.dataset.level || 80) + "%";
          mio.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  meters.forEach((el) => mio.observe(el));

  /* ---------- Hero network canvas ---------- */
  const canvas = $("#networkCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], raf;
    const COUNT = () => Math.min(90, Math.floor((w * h) / 16000));
    const LINK_DIST = 140;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = COUNT();
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const draw = () => {
      const rgb = root.getAttribute("data-theme") === "light" ? "20, 70, 160" : "120, 180, 255";
      ctx.clearRect(0, 0, w, h);
      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const op = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(${rgb}, ${op})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const p of nodes) {
        ctx.fillStyle = `rgba(${rgb}, 0.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
    // pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  }

  /* ---------- Contact form (Formspree-compatible, AJAX) ---------- */
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus");
    const btn = $("#submitBtn");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form__status";
      status.textContent = "";

      // Honeypot: silently drop bots
      if (form._gotcha && form._gotcha.value) return;

      if (!form.checkValidity()) {
        status.classList.add("err");
        status.textContent = "Please complete all fields with a valid email.";
        form.reportValidity();
        return;
      }

      const action = form.getAttribute("action") || "";
      // If the Formspree endpoint hasn't been configured, fall back to mailto.
      if (action.includes("YOUR_FORM_ID")) {
        const data = new FormData(form);
        const subject = encodeURIComponent(data.get("subject") || "Portfolio enquiry");
        const body = encodeURIComponent(
          `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
        );
        window.location.href = `mailto:kanaan5g@gmail.com?subject=${subject}&body=${body}`;
        status.classList.add("ok");
        status.textContent = "Opening your email app…";
        return;
      }

      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = "Sending…";
      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          status.classList.add("ok");
          status.textContent = "Thank you — your message has been sent. I'll reply shortly.";
        } else {
          throw new Error("Server error");
        }
      } catch (err) {
        status.classList.add("err");
        status.textContent = "Something went wrong. Please email kanaan5g@gmail.com directly.";
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  }
})();
