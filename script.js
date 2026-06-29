/* ============================================================
   Charles Barber — configuration + logic
   Edit the CONFIG block to make this site your own.
   ============================================================ */

const CONFIG = {
  // ---- Your business ----
  businessName: "Charles Barber",
  tagline: "Fresh fades, classic cuts and clean beard work — reserve your chair online and we'll confirm by email.",
  estYear: 2015,

  // ---- Where requests are sent ----
  ownerEmail: "soybarbers1@gmail.com",
  phone: "",                    // optional, e.g. "(250) 123-4567" — leave "" to hide
  address: "2785 Strathmore Rd, Victoria, BC V9B 3X4, Canada",

  /*  HOW REQUESTS ARE SENT  (no email app ever opens)
   *  Default uses Web3Forms (key below) → emails you silently from the
   *  browser. Leave web3formsKey "" to fall back to FormSubmit instead.
   */
  web3formsKey: "be9d7c4a-10c5-4814-96d2-49cee5c0988d",

  /*  CUSTOMER CONFIRMATION EMAIL  (optional, free via EmailJS)
   *  When these are filled in, the customer automatically gets a
   *  "we received your booking" email. Leave all three "" to skip it —
   *  you (the owner) still get the booking email either way.
   *  Step-by-step setup guide is at the very bottom of this file.
   */
  emailjs: {
    publicKey:  "",   // EmailJS → Account → General → Public Key
    serviceId:  "",   // EmailJS → Email Services → Service ID
    templateId: "",   // EmailJS → Email Templates → Template ID
  },

  // ---- Services offered ----
  services: [
    { icon: "✂️", name: "Regular Haircut", desc: "A clean, classic cut tailored to your style.",        price: "$25", duration: "30 min" },
    { icon: "💈", name: "Skin Fade",       desc: "A sharp fade blended down to the skin.",               price: "$30", duration: "45 min" },
    { icon: "🧔", name: "Beard Trim",      desc: "Shape-up and tidy to keep your beard looking crisp.", price: "$10", duration: "15 min" },
  ],

  // ---- Opening hours (use "Closed" for days off) ----
  hours: {
    Monday:    "7:00 PM – 10:00 PM",
    Tuesday:   "7:00 PM – 10:00 PM",
    Wednesday: "7:00 PM – 10:00 PM",
    Thursday:  "7:00 PM – 10:00 PM",
    Friday:    "7:00 PM – 10:00 PM",
    Saturday:  "8:00 AM – 9:00 PM",
    Sunday:    "8:00 AM – 9:00 PM",
  },

  // ---- Note shown under the opening hours (leave "" to hide) ----
  hoursNote: "Monday to Friday I'll be at Brothers Barbershop in Downtown Victoria.",
  hoursNoteName: "Brothers Barbershop",
  hoursNoteAddress: "770 Fort St, Victoria, BC V8W 1H2, Canada",

  // ---- Appointments already booked (shown on the availability calendar) ----
  //  Add one line each time you take a booking so customers see the slot as taken.
  //  date = "YYYY-MM-DD"  ·  time = "HH:MM" in 24-hour format (time is optional).
  //  Replace the examples below with your real bookings, or empty it:  bookedSlots: [],
  bookedSlots: [
    { date: "2026-06-30", time: "19:30" },
    { date: "2026-06-30", time: "20:30" },
    { date: "2026-07-01", time: "20:00" },
    { date: "2026-07-05", time: "10:00" },
    { date: "2026-07-05", time: "14:30" },
    { date: "2026-07-05", time: "16:00" },
  ],

  // ---- Headline stats ----
  stats: [
    { value: 12,   suffix: "+", label: "Years in the chair" },
    { value: 8000, suffix: "+", label: "Cuts & fades" },
    { value: 4.9,  suffix: "★", label: "Average rating", decimals: 1 },
    { value: 100,  suffix: "%", label: "Satisfaction goal" },
  ],

  // ---- About ----
  about: "Charles Barber is a Victoria, BC neighbourhood shop built on sharp fades, classic cuts and honest service. Walk in a regular, leave looking your best — no fuss, no upsell, just a clean cut and good conversation.",
  aboutFeatures: ["Skin fades & classic cuts", "Beard shaping & line-ups", "Friendly, on-time service", "Simple cash pricing"],

  // ---- Reviews ----
  reviewRating: 4.9,
  reviews: [
    { name: "Mike R.",   meta: "Regular since 2019", rating: 5, text: "Best fade in Victoria, hands down. Always on time and the line-up is razor sharp." },
    { name: "Daniel K.", meta: "Skin fade",          rating: 5, text: "Booked online in under a minute and got exactly the cut I asked for. Highly recommend." },
    { name: "Sam T.",    meta: "Beard trim",         rating: 5, text: "Great attention to detail on the beard. Friendly chat and a clean finish every visit." },
  ],

  // ---- FAQ ----
  faqs: [
    { q: "How do I book an appointment?", a: "Fill out the booking form with your service, date and time. We'll email you back to confirm your spot — usually within 24 hours." },
    { q: "What payment methods do you accept?", a: "Cash only, please." },
    { q: "Do you take walk-ins?", a: "When a chair is free, absolutely — but booking ahead guarantees your time." },
    { q: "What if I need to reschedule or cancel?", a: "Just reply to your confirmation email or give us a call and we'll find you a new time." },
  ],

  // ---- Social links (leave "" to hide) ----
  socials: { instagram: "", facebook: "", tiktok: "" },
};

/* ============================================================
   Below here you normally don't need to edit anything.
   ============================================================ */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

document.documentElement.classList.add("js");
initTheme();

document.addEventListener("DOMContentLoaded", () => {
  applyBranding();
  renderServices();
  renderServiceOptions();
  renderHours();
  renderContact();
  renderMap();
  renderFaqs();
  renderSocials();
  renderFooter();
  updateStatus();
  setInterval(updateStatus, 60000);
  setupDateConstraints();
  renderCalendar();
  wireForm();
  wireSummary();
  wireScroll();
  wireReveal();
  $("#year").textContent = String(new Date().getFullYear());
});

/* ---------- Theme ---------- */
function initTheme() {
  let saved;
  try { saved = localStorage.getItem("cb-theme"); } catch (e) {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  document.addEventListener("DOMContentLoaded", () => {
    const btn = $("#themeToggle");
    if (!btn) return;
    syncThemeIcon(btn);
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("cb-theme", next); } catch (e) {}
      syncThemeIcon(btn);
    });
  });
}
function syncThemeIcon(btn) {
  btn.textContent = document.documentElement.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
}

/* ---------- Branding ---------- */
function applyBranding() {
  $$("[data-bind='businessName']").forEach(el => (el.textContent = CONFIG.businessName));
  const tag = $("[data-bind='tagline']");
  if (tag && CONFIG.tagline) tag.textContent = CONFIG.tagline;
  const est = $("#estYear");
  if (est) est.textContent = String(CONFIG.estYear);
}

/* ---------- Stats (with count-up) ---------- */
function renderStats() {
  const grid = $("#statsGrid");
  grid.innerHTML = CONFIG.stats.map(s => `
    <div class="stat">
      <div class="stat-num" data-target="${s.value}" data-suffix="${esc(s.suffix || "")}" data-decimals="${s.decimals || 0}">0</div>
      <div class="stat-label">${esc(s.label)}</div>
    </div>`).join("");

  const animate = () => $$(".stat-num", grid).forEach(el => countUp(el));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { animate(); obs.disconnect(); } });
    }, { threshold: .4 });
    io.observe(grid);
  } else { animate(); }
}
function countUp(el) {
  const target = parseFloat(el.dataset.target) || 0;
  const dec = parseInt(el.dataset.decimals, 10) || 0;
  const suffix = el.dataset.suffix || "";
  const dur = 1400; let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = (target * eased).toFixed(dec);
    el.textContent = formatNum(val, dec) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = formatNum(target.toFixed(dec), dec) + suffix;
  };
  requestAnimationFrame(step);
}
function formatNum(n, dec) {
  const num = Number(n);
  return dec > 0 ? num.toFixed(dec) : Math.round(num).toLocaleString();
}

/* ---------- Services ---------- */
function renderServices() {
  const grid = $("#servicesGrid");
  grid.innerHTML = CONFIG.services.map(s => `
    <article class="service-card">
      <div class="service-icon" aria-hidden="true">${s.icon || "•"}</div>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.desc || "")}</p>
      <div class="service-meta">
        <span class="service-price">${esc(s.price || "")}</span>
        <span class="service-dur">${esc(s.duration || "")}</span>
      </div>
      <button type="button" class="service-pick" data-service="${esc(s.name)}">Book this</button>
    </article>`).join("");

  $$(".service-pick", grid).forEach(btn =>
    btn.addEventListener("click", () => {
      $("#service").value = btn.dataset.service;
      updateSummary();
      document.getElementById("book").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => $("#name").focus(), 500);
    }));
}
function renderServiceOptions() {
  const sel = $("#service");
  CONFIG.services.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = s.price ? `${s.name} — ${s.price}` : s.name;
    sel.appendChild(opt);
  });
}

/* ---------- About ---------- */
function renderAbout() {
  $("#aboutText").textContent = CONFIG.about;
  $("#aboutFeatures").innerHTML = CONFIG.aboutFeatures.map(f => `<li>${esc(f)}</li>`).join("");
}

/* ---------- Reviews ---------- */
function renderReviews() {
  const colors = ["var(--accent)", "var(--accent2)", "var(--gold)", "var(--purple)", "var(--coral)"];
  $("#reviewsSub").textContent = `Rated ${CONFIG.reviewRating} / 5 by our customers`;
  $("#reviewsGrid").innerHTML = CONFIG.reviews.map((r, i) => `
    <article class="review-card">
      <div class="review-stars" aria-label="${r.rating} out of 5">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <p class="review-text">“${esc(r.text)}”</p>
      <div class="review-by">
        <span class="review-avatar" style="background:${colors[i % colors.length]}">${esc(initials(r.name))}</span>
        <span>
          <span class="review-name">${esc(r.name)}</span><br />
          <span class="review-meta">${esc(r.meta || "")}</span>
        </span>
      </div>
    </article>`).join("");
}
function initials(name) {
  return name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

/* ---------- Hours ---------- */
function renderHours() {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  $("#hoursList").innerHTML = Object.entries(CONFIG.hours).map(([day, val]) => {
    const closed = /closed/i.test(val);
    const isToday = day === todayName;
    return `<li class="${isToday ? "today" : ""}">
      <span class="day">${day}${isToday ? " · today" : ""}</span>
      <span class="${closed ? "closed" : ""}">${esc(val)}</span>
    </li>`;
  }).join("");

  const noteEl = $("#hoursNote");
  if (noteEl) {
    if (CONFIG.hoursNote) {
      let html = `<span class="hn-icon" aria-hidden="true">📍</span><span class="hn-body">${esc(CONFIG.hoursNote)}`;
      if (CONFIG.hoursNoteAddress) {
        const q = encodeURIComponent([CONFIG.hoursNoteName, CONFIG.hoursNoteAddress].filter(Boolean).join(", "));
        html += `<br /><a href="https://www.google.com/maps?q=${q}" target="_blank" rel="noopener">${esc(CONFIG.hoursNoteAddress)} · View on map ↗</a>`;
      }
      html += `</span>`;
      noteEl.innerHTML = html;
    } else noteEl.remove();
  }
}

/* ---------- Contact ---------- */
function renderContact() {
  const mail = $("#contactEmail");
  mail.textContent = CONFIG.ownerEmail;
  mail.href = `mailto:${CONFIG.ownerEmail}`;

  const phoneWrap = $("#contactPhoneWrap");
  if (CONFIG.phone) {
    const p = $("#contactPhone");
    p.textContent = CONFIG.phone;
    p.href = `tel:${CONFIG.phone.replace(/[^0-9+]/g, "")}`;
  } else { phoneWrap.remove(); }

  const addrWrap = $("#contactAddrWrap");
  if (CONFIG.address) {
    const a = $("#contactAddr");
    a.textContent = CONFIG.address;
    a.href = mapsLink();
  } else { addrWrap.remove(); }
}

/* ---------- Map ---------- */
function mapsLink() { return `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.address)}`; }
function renderMap() {
  const wrap = $("#mapWrap");
  if (!wrap) return;
  if (!CONFIG.address) { wrap.remove(); return; }
  const iframe = document.createElement("iframe");
  iframe.setAttribute("loading", "lazy");
  iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
  iframe.setAttribute("title", "Shop location map");
  iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.address)}&output=embed`;
  wrap.appendChild(iframe);
}

/* ---------- FAQ ---------- */
function renderFaqs() {
  $("#faqList").innerHTML = CONFIG.faqs.map(f => `
    <details class="faq-item">
      <summary>${esc(f.q)}</summary>
      <p class="faq-a">${esc(f.a)}</p>
    </details>`).join("");
}

/* ---------- Socials ---------- */
function renderSocials() {
  const el = $("#socials");
  const items = [];
  const s = CONFIG.socials || {};
  if (s.instagram) items.push(`<a href="${esc(s.instagram)}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">IG</a>`);
  if (s.facebook)  items.push(`<a href="${esc(s.facebook)}" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">f</a>`);
  if (s.tiktok)    items.push(`<a href="${esc(s.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok" title="TikTok">TT</a>`);
  if (CONFIG.address) items.push(`<a href="${mapsLink()}" target="_blank" rel="noopener" aria-label="Directions" title="Directions">⌖</a>`);
  items.push(`<a href="mailto:${CONFIG.ownerEmail}" aria-label="Email" title="Email">✉</a>`);
  el.innerHTML = items.join("");
}

/* ---------- Footer ---------- */
function renderFooter() {
  const fa = $("#footerAddr");
  if (CONFIG.address) { fa.textContent = CONFIG.address; fa.href = mapsLink(); } else { fa.textContent = "—"; }

  const fe = $("#footerEmail");
  fe.textContent = CONFIG.ownerEmail; fe.href = `mailto:${CONFIG.ownerEmail}`;

  const fpWrap = $("#footerPhoneWrap");
  if (CONFIG.phone) { const fp = $("#footerPhone"); fp.textContent = CONFIG.phone; fp.href = `tel:${CONFIG.phone.replace(/[^0-9+]/g, "")}`; }
  else { fpWrap.remove(); }

  $("#footerHours").innerHTML = Object.entries(CONFIG.hours).map(([day, val]) => {
    const closed = /closed/i.test(val);
    return `<li><span>${day.slice(0,3)}</span><span class="${closed ? "closed" : ""}">${esc(val)}</span></li>`;
  }).join("");
}

/* ---------- Live open / closed status ---------- */
function parseClock(str) {
  const m = str.trim().match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])/);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/p/i.test(m[3])) h += 12;
  return h * 60 + parseInt(m[2], 10);
}
function dayHours(name) {
  const val = CONFIG.hours[name];
  if (!val || /closed/i.test(val)) return null;
  const parts = val.split(/[–-]/);
  if (parts.length < 2) return null;
  const open = parseClock(parts[0]), close = parseClock(parts[1]);
  if (open == null || close == null) return null;
  return { open, close, label: val };
}
function fmtMins(mins) {
  let h = Math.floor(mins / 60), m = mins % 60;
  const ap = h >= 12 ? "PM" : "AM";
  h = ((h + 11) % 12) + 1;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
}
function computeStatus(now) {
  const idx = now.getDay();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const today = dayHours(DAYS[idx]);
  if (today && nowMins >= today.open && nowMins < today.close)
    return { open: true, label: "Open now", detail: `Closes ${fmtMins(today.close)}` };
  if (today && nowMins < today.open)
    return { open: false, label: "Closed", detail: `Opens today ${fmtMins(today.open)}` };
  for (let i = 1; i <= 7; i++) {
    const d = dayHours(DAYS[(idx + i) % 7]);
    if (d) {
      const dayName = DAYS[(idx + i) % 7].slice(0, 3);
      const when = i === 1 ? "tomorrow" : dayName;
      return { open: false, label: "Closed", detail: `Opens ${when} ${fmtMins(d.open)}` };
    }
  }
  return { open: false, label: "Closed", detail: "" };
}
function updateStatus() {
  const st = computeStatus(new Date());
  const text = st.detail ? `${st.label} · ${st.detail}` : st.label;

  const badge = $("#statusBadge");
  if (badge) { badge.classList.toggle("closed", !st.open); badge.innerHTML = `<span class="status-dot"></span> ${esc(text)}`; }

  const line = $("#statusLine"), lineText = $("#statusLineText");
  if (line && lineText) { line.classList.toggle("closed", !st.open); lineText.textContent = text; }

  const ms = $("#mobileStatusText"), mobile = ms && ms.closest(".mobile-status");
  if (ms) { ms.textContent = text; if (mobile) mobile.classList.toggle("closed", !st.open); }
}

/* ---------- Date constraints ---------- */
function setupDateConstraints() {
  const dateEl = $("#date");
  const today = new Date();
  const tz = today.getTimezoneOffset() * 60000;
  dateEl.min = new Date(today - tz).toISOString().slice(0, 10);
}

/* ---------- Availability calendar ---------- */
let calSelect = null;                       // set by renderCalendar — lets the date field drive the calendar
function isSlotBooked(date, time) {
  if (!date || !time) return false;
  return (CONFIG.bookedSlots || []).some(s => s && s.date === date && s.time === time);
}
function renderCalendar() {
  const host = $("#calendar");
  if (!host) return;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isoOf = (d) => { const tz = d.getTimezoneOffset() * 60000; return new Date(d - tz).toISOString().slice(0, 10); };
  const todayIso = isoOf(today);

  // group booked times by date
  const byDate = {};
  (CONFIG.bookedSlots || []).forEach(s => {
    if (!s || !s.date) return;
    (byDate[s.date] = byDate[s.date] || []).push(s.time || "");
  });
  Object.values(byDate).forEach(a => a.sort());

  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = null;

  function detailHtml(id) {
    const times = byDate[id] || [];
    let h = `<div class="cal-detail-date">${esc(prettyDate(id))}</div>`;
    if (times.length) {
      h += `<div class="cal-detail-sub">Already booked:</div>
            <div class="cal-times">${times.map(t => `<span class="cal-chip">${t ? esc(prettyTime(t)) : "Booked"}</span>`).join("")}</div>`;
    } else {
      h += `<div class="cal-free">✓ No bookings yet — you're clear to book this day.</div>`;
    }
    return h;
  }

  function draw() {
    const y = view.getFullYear(), m = view.getMonth();
    const monthLabel = view.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const startDow = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const atMin = y < today.getFullYear() || (y === today.getFullYear() && m <= today.getMonth());

    let cells = "";
    for (let i = 0; i < startDow; i++) cells += `<span class="cal-cell cal-empty"></span>`;
    for (let d = 1; d <= total; d++) {
      const date = new Date(y, m, d), id = isoOf(date);
      const closed = !dayHours(DAYS[date.getDay()]);
      const past = id < todayIso;
      const n = (byDate[id] || []).length;
      const cls = ["cal-cell", "cal-day"];
      if (id === todayIso) cls.push("is-today");
      if (past) cls.push("is-past");
      if (closed) cls.push("is-closed");
      if (n) cls.push("has-booked");
      if (id === selected) cls.push("is-selected");
      const dots = n ? `<span class="cal-dots">${'<span class="cal-dot"></span>'.repeat(Math.min(n, 3))}</span>` : "";
      const aria = esc(prettyDate(id)) + (n ? `, ${n} booked` : closed ? ", closed" : "");
      cells += `<button type="button" class="${cls.join(" ")}" data-date="${id}"${past || closed ? " disabled" : ""} aria-label="${aria}"><span class="cal-num">${d}</span>${dots}</button>`;
    }

    host.innerHTML = `
      <div class="cal-head">
        <button type="button" class="cal-nav" data-nav="-1"${atMin ? " disabled" : ""} aria-label="Previous month">‹</button>
        <span class="cal-title">${esc(monthLabel)}</span>
        <button type="button" class="cal-nav" data-nav="1" aria-label="Next month">›</button>
      </div>
      <div class="cal-grid cal-dow">${["Su","Mo","Tu","We","Th","Fr","Sa"].map(x => `<span>${x}</span>`).join("")}</div>
      <div class="cal-grid cal-days">${cells}</div>
      <div class="cal-legend">
        <span><span class="cal-dot"></span> Booked</span>
        <span><span class="cal-swatch is-today"></span> Today</span>
        <span><span class="cal-swatch is-closed"></span> Closed</span>
      </div>
      <div class="cal-detail${selected ? " has" : ""}" id="calDetail">${selected ? detailHtml(selected) : ""}</div>`;
  }

  function pick(id) {
    selected = id;
    const dateEl = $("#date");
    if (dateEl) { dateEl.value = id; dateEl.classList.remove("invalid"); }
    updateSummary();
    draw();
  }

  host.addEventListener("click", (e) => {
    const nav = e.target.closest(".cal-nav");
    if (nav && !nav.disabled) { view = new Date(view.getFullYear(), view.getMonth() + Number(nav.dataset.nav), 1); draw(); return; }
    const day = e.target.closest(".cal-day");
    if (day && !day.disabled) pick(day.dataset.date);
  });

  // when the user types/changes the date field directly, mirror it on the calendar
  calSelect = (id) => {
    if (!id) return;
    selected = id;
    const [yy, mm] = id.split("-").map(Number);
    if (yy && mm) view = new Date(yy, mm - 1, 1);
    draw();
  };

  draw();
}

/* ---------- Live booking summary ---------- */
function wireSummary() {
  ["service", "date", "time"].forEach(id => $("#" + id).addEventListener("change", updateSummary));
  $("#date").addEventListener("change", (e) => { if (calSelect) calSelect(e.target.value); });
  updateSummary();
}
function updateSummary() {
  const body = $("#summaryBody");
  const name = $("#service").value;
  const svc = CONFIG.services.find(s => s.name === name);
  const date = $("#date").value, time = $("#time").value;

  if (!svc) {
    body.className = "summary-empty";
    body.textContent = "Pick a service, date and time to see your summary here.";
    return;
  }
  body.className = "";
  const rows = [
    ["Service", svc.name],
    ["Duration", svc.duration || "—"],
  ];
  if (date) rows.push(["Date", prettyDate(date)]);
  if (time) rows.push(["Time", prettyTime(time)]);
  body.innerHTML = rows.map(([k, v]) =>
    `<div class="summary-row"><span class="sk">${esc(k)}</span><span class="sv">${esc(v)}</span></div>`).join("")
    + `<div class="summary-total"><span>Total</span><span class="sv">${esc(svc.price || "—")}</span></div>`;

  if (isSlotBooked(date, time))
    body.innerHTML += `<div class="summary-warn">⚠ That time is already booked — please pick another.</div>`;
}

/* ---------- Scroll: progress, back-to-top ---------- */
function wireScroll() {
  const bar = $("#scrollProgress"), toTop = $("#toTop");
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    toTop.classList.toggle("show", h.scrollTop > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Reveal on scroll ---------- */
function wireReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: .12 });
  els.forEach(e => io.observe(e));
}

/* ---------- Form handling ---------- */
function wireForm() {
  const form = $("#bookingForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(form);
    if ($("#company").value.trim() !== "") return; // honeypot

    const data = collect(form);
    const problems = validate(data);
    if (problems.length) {
      problems.forEach(id => $("#" + id)?.classList.add("invalid"));
      note("Please fill in the highlighted fields.", "err");
      $("#" + problems[0])?.focus();
      return;
    }
    if (isSlotBooked(data.date, data.time)) {
      $("#time").classList.add("invalid");
      note("That time is already booked — please choose another time.", "err");
      $("#time").focus();
      return;
    }
    await sendRequest(data);
  });

  $$("input, select, textarea", form).forEach(el =>
    el.addEventListener("input", () => el.classList.remove("invalid")));
}

function collect(form) {
  const f = new FormData(form);
  const g = k => (f.get(k) || "").toString().trim();
  return { name: g("name"), email: g("email"), phone: g("phone"), service: g("service"), date: g("date"), time: g("time"), notes: g("notes") };
}
function validate(d) {
  const bad = [];
  if (!d.name) bad.push("name");
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) bad.push("email");
  if (!d.service) bad.push("service");
  if (!d.date) bad.push("date");
  if (!d.time) bad.push("time");
  return bad;
}
function prettyDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
function prettyTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
}
function buildSubject(d) { return `Appointment request — ${d.name} (${d.service})`; }

async function sendRequest(d) {
  if (location.protocol === "file:" && !CONFIG.web3formsKey) {
    note("This is the local preview — sending only works on the live website. Open your hosted link to send a real request.", "err");
    return;
  }
  const btn = $("#submitBtn");
  btn.disabled = true; btn.textContent = "Sending…"; note("");
  try {
    if (CONFIG.web3formsKey) await sendViaWeb3Forms(d);
    else await sendViaFormSubmit(d);

    // Auto-confirmation to the customer (best-effort — the owner email above
    // already went through, so a confirmation hiccup must not fail the booking).
    let confirmed = false;
    try { confirmed = await sendCustomerConfirmation(d); } catch (e2) { confirmed = false; }

    note(confirmed
      ? `Thank you! Your request has been sent — a confirmation email is on its way to ${d.email}.`
      : "Thank you! Your request has been sent — we'll confirm by email soon.", "ok");
    toast("Request sent ✓");
    $("#bookingForm").reset();
    updateSummary();
  } catch (err) {
    if (/activat/i.test(err.message || "")) {
      note("This booking form needs a one-time activation. Please check the " + CONFIG.ownerEmail + " inbox for the “Activate Form” email, click the link, then submit again.", "err");
    } else {
      note("Sorry, something went wrong sending your request. Please email us directly at " + CONFIG.ownerEmail + ".", "err");
    }
  } finally {
    btn.disabled = false; btn.textContent = "Send appointment request";
  }
}
async function sendViaFormSubmit(d) {
  const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CONFIG.ownerEmail), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: buildSubject(d), _template: "table", _captcha: "false",
      Name: d.name, email: d.email, Phone: d.phone || "—", Service: d.service,
      Date: prettyDate(d.date), Time: prettyTime(d.time), Notes: d.notes || "—",
    }),
  });
  const out = await res.json().catch(() => ({}));
  if (out.success === true || out.success === "true") return true;
  throw new Error(out.message || "FormSubmit rejected the request");
}
async function sendViaWeb3Forms(d) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: CONFIG.web3formsKey, subject: buildSubject(d), from_name: `${CONFIG.businessName} booking`,
      Name: d.name, Email: d.email, Phone: d.phone || "—", Service: d.service,
      Date: prettyDate(d.date), Time: prettyTime(d.time), Notes: d.notes || "—", replyto: d.email,
    }),
  });
  const out = await res.json().catch(() => ({}));
  if (out.success) return true;
  throw new Error(out.message || "Web3Forms rejected the request");
}

/* Auto-confirmation email to the customer via EmailJS (free, client-side).
   Returns false (skips quietly) until CONFIG.emailjs is filled in. */
async function sendCustomerConfirmation(d) {
  const e = CONFIG.emailjs || {};
  if (!e.publicKey || !e.serviceId || !e.templateId) return false;
  const svc = CONFIG.services.find(s => s.name === d.service);
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: e.serviceId,
      template_id: e.templateId,
      user_id: e.publicKey,
      template_params: {
        to_email: d.email,
        to_name: d.name,
        business_name: CONFIG.businessName,
        service: d.service,
        appt_date: prettyDate(d.date),
        appt_time: prettyTime(d.time),
        price: svc ? (svc.price || "—") : "—",
        notes: d.notes || "—",
        shop_email: CONFIG.ownerEmail,
        shop_address: CONFIG.address || "",
        reply_to: CONFIG.ownerEmail,
      },
    }),
  });
  if (!res.ok) throw new Error("EmailJS " + res.status + " " + (await res.text().catch(() => "")));
  return true;
}

/* ---------- helpers ---------- */
function note(msg, kind) { const el = $("#formNote"); el.textContent = msg; el.className = "form-note" + (kind ? " " + kind : ""); }
function clearErrors(form) { $$(".invalid", form).forEach(el => el.classList.remove("invalid")); note(""); }
let toastTimer;
function toast(msg) {
  const t = $("#toast"); $("#toastMsg").textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 4000);
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

/* ============================================================
   CUSTOMER CONFIRMATION EMAIL — one-time setup (free, ~5 min)
   ------------------------------------------------------------
   This sends the customer an automatic "we got your booking"
   email. You (the owner) already get the booking email via
   Web3Forms; this is the reply that goes back to the customer.

   1. Go to https://www.emailjs.com and sign up (free: 200/month).
   2. Email Services → Add New Service → connect your Gmail
      (soybarbers1@gmail.com). Copy the SERVICE ID.
   3. Email Templates → Create New Template. Set:
        To Email:   {{to_email}}
        From Name:  {{business_name}}
        Reply To:   {{reply_to}}
        Subject:    Thanks {{to_name}} — we got your booking request
        Content (paste this):
        ------------------------------------------------------
        Hi {{to_name}},

        Thanks for booking with {{business_name}}! We've received
        your request and will confirm your time by reply shortly.

        Your request:
         • Service: {{service}}
         • Date:    {{appt_date}}
         • Time:    {{appt_time}}
         • Price:   {{price}}
         • Notes:   {{notes}}

        Payment is cash only. Need to change something? Just reply
        to this email.

        See you soon,
        {{business_name}}
        {{shop_address}}
        {{shop_email}}
        ------------------------------------------------------
      Save it and copy the TEMPLATE ID.
   4. Account → General → copy your PUBLIC KEY.
   5. Paste all three into the CONFIG.emailjs block at the top
      of this file. Done — confirmations now send automatically.

   (Keep EmailJS's default browser security on; no private key
   is needed since this runs in the visitor's browser.)
   ============================================================ */
