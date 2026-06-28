/* ============================================================
   Appointment Booking — configuration + logic
   Edit the CONFIG block below to make this site your own.
   ============================================================ */

const CONFIG = {
  // ---- Your business ----
  businessName: "Charles Barber",
  tagline: "Pick a service, choose a time that works for you, and we'll confirm your appointment by email.",

  // ---- Where requests are sent ----
  ownerEmail: "soybarbers1@gmail.com",
  phone: "",                    // optional, e.g. "(555) 123-4567" — leave "" to hide
  address: "2785 Strathmore Rd, Victoria, BC V9B 3X4, Canada",  // optional — leave "" to hide

  /*  HOW REQUESTS ARE SENT  (no email app ever opens)
   *  ─────────────────────────────────────────────────
   *  The form sends the booking request straight to your inbox in the
   *  background — the customer just sees a "thank you" message and never
   *  leaves the page.
   *
   *  Default: FormSubmit — no signup, no key needed. Requests go to the
   *  ownerEmail set above. ONE-TIME STEP: the very first request triggers
   *  an activation email from FormSubmit to that inbox; open it and click
   *  "Activate Form" once. Every request after that is delivered silently.
   *
   *  Optional alternative: prefer Web3Forms instead? Grab a free key at
   *  https://web3forms.com and paste it below — the site will use it.
   */
  web3formsKey: "be9d7c4a-10c5-4814-96d2-49cee5c0988d",

  // ---- Services offered ----
  services: [
    { icon: "✂️", name: "Regular Haircut", desc: "A clean, classic cut tailored to your style.",        price: "$25", duration: "30 min" },
    { icon: "💈", name: "Skin Fade",       desc: "A sharp fade blended down to the skin.",               price: "$30", duration: "45 min" },
    { icon: "🧔", name: "Beard Trim",      desc: "Shape-up and tidy to keep your beard looking crisp.", price: "$10", duration: "15 min" },
  ],

  // ---- Opening hours (use "Closed" for days off) ----
  hours: {
    Monday:    "Closed",
    Tuesday:   "Closed",
    Wednesday: "Closed",
    Thursday:  "Closed",
    Friday:    "9:00 AM – 7:00 PM",
    Saturday:  "9:00 AM – 5:00 PM",
    Sunday:    "10:00 AM – 4:00 PM",
  },
};

/* ============================================================
   Below here you normally don't need to edit anything.
   ============================================================ */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", () => {
  applyBranding();
  renderServices();
  renderServiceOptions();
  renderHours();
  renderContact();
  setupDateConstraints();
  wireForm();
  $("#year").textContent = String(new Date().getFullYear());
});

/* ---------- Branding & static content ---------- */
function applyBranding() {
  document.title = `Book an Appointment · ${CONFIG.businessName}`;
  $$("[data-bind='businessName']").forEach(el => (el.textContent = CONFIG.businessName));
  const tag = $("[data-bind='tagline']");
  if (tag && CONFIG.tagline) tag.textContent = CONFIG.tagline;
}

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
    </article>
  `).join("");

  $$(".service-pick", grid).forEach(btn =>
    btn.addEventListener("click", () => {
      const sel = $("#service");
      sel.value = btn.dataset.service;
      document.getElementById("book").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => $("#name").focus(), 500);
    })
  );
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

function renderHours() {
  const list = $("#hoursList");
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  list.innerHTML = Object.entries(CONFIG.hours).map(([day, val]) => {
    const closed = /closed/i.test(val);
    const isToday = day === todayName;
    return `<li class="${isToday ? "today" : ""}">
      <span class="day">${day}${isToday ? " · today" : ""}</span>
      <span class="${closed ? "closed" : ""}">${esc(val)}</span>
    </li>`;
  }).join("");
}

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
  if (CONFIG.address) { $("#contactAddr").textContent = CONFIG.address; }
  else { addrWrap.remove(); }
}

function setupDateConstraints() {
  const dateEl = $("#date");
  const today = new Date();
  const tz = today.getTimezoneOffset() * 60000;
  dateEl.min = new Date(today - tz).toISOString().slice(0, 10);
}

/* ---------- Form handling ---------- */
function wireForm() {
  const form = $("#bookingForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(form);

    // Honeypot: real users never fill this.
    if ($("#company").value.trim() !== "") return;

    const data = collect(form);
    const problems = validate(data);
    if (problems.length) {
      problems.forEach(id => $("#" + id)?.classList.add("invalid"));
      note("Please fill in the highlighted fields.", "err");
      $("#" + problems[0])?.focus();
      return;
    }

    await sendRequest(data);
  });

  // clear the red outline as soon as the user fixes a field
  $$("input, select, textarea", form).forEach(el =>
    el.addEventListener("input", () => el.classList.remove("invalid"))
  );
}

function collect(form) {
  const f = new FormData(form);
  return {
    name:    (f.get("name")    || "").toString().trim(),
    email:   (f.get("email")   || "").toString().trim(),
    phone:   (f.get("phone")   || "").toString().trim(),
    service: (f.get("service") || "").toString().trim(),
    date:    (f.get("date")    || "").toString().trim(),
    time:    (f.get("time")    || "").toString().trim(),
    notes:   (f.get("notes")   || "").toString().trim(),
  };
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
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
function prettyTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}

function buildSubject(d) {
  return `Appointment request — ${d.name} (${d.service})`;
}

/* Pick the delivery method, then send in the background. */
async function sendRequest(d) {
  // FormSubmit (and most form services) reject requests from a page opened
  // as a local file. Catch that early with a clear message.
  if (location.protocol === "file:" && !CONFIG.web3formsKey) {
    note("This is the local preview — sending only works on the live website. "
       + "Open your hosted link to send a real request.", "err");
    return;
  }

  const btn = $("#submitBtn");
  btn.disabled = true;
  btn.textContent = "Sending…";
  note("");

  try {
    if (CONFIG.web3formsKey) await sendViaWeb3Forms(d);
    else await sendViaFormSubmit(d);
    note("Thank you! Your request has been sent — we'll confirm by email soon.", "ok");
    toast("Request sent ✓");
    $("#bookingForm").reset();
  } catch (err) {
    if (/activat/i.test(err.message || "")) {
      note("This booking form needs a one-time activation. Please check the "
         + CONFIG.ownerEmail + " inbox for the “Activate Form” email, click the link, "
         + "then submit again.", "err");
    } else {
      note("Sorry, something went wrong sending your request. Please email us directly at "
         + CONFIG.ownerEmail + ".", "err");
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "Send appointment request";
  }
}

/* Default: FormSubmit — emails you in the background, no key or signup. */
async function sendViaFormSubmit(d) {
  const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CONFIG.ownerEmail), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: buildSubject(d),
      _template: "table",
      _captcha: "false",
      Name: d.name,
      email: d.email,          // named "email" → FormSubmit sets it as Reply-To
      Phone: d.phone || "—",
      Service: d.service,
      Date: prettyDate(d.date),
      Time: prettyTime(d.time),
      Notes: d.notes || "—",
    }),
  });
  const out = await res.json().catch(() => ({}));
  if (out.success === true || out.success === "true") return true;
  throw new Error(out.message || "FormSubmit rejected the request");
}

/* Optional: Web3Forms — used instead when CONFIG.web3formsKey is set. */
async function sendViaWeb3Forms(d) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: CONFIG.web3formsKey,
      subject: buildSubject(d),
      from_name: `${CONFIG.businessName} booking`,
      Name: d.name,
      Email: d.email,
      Phone: d.phone || "—",
      Service: d.service,
      Date: prettyDate(d.date),
      Time: prettyTime(d.time),
      Notes: d.notes || "—",
      replyto: d.email,
    }),
  });
  const out = await res.json().catch(() => ({}));
  return !!out.success;
}

/* ---------- small helpers ---------- */
function note(msg, kind) {
  const el = $("#formNote");
  el.textContent = msg;
  el.className = "form-note" + (kind ? " " + kind : "");
}
function clearErrors(form) {
  $$(".invalid", form).forEach(el => el.classList.remove("invalid"));
  note("");
}
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  $("#toastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 4000);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
