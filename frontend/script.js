/* ==========================================================
   UH Sugar Land Student Center — shared JavaScript
   Author: Godgiven Tikouzou (CIS 2336, Fall 2026)

   Sections:
     1. Site data (menu items, hours, rooms)
     2. Dynamic navigation menu
     3. Footer + back-to-top
     4. Homepage: live open/closed status + hours table
     5. FAQ page: collapsible accordion
     6. Room booking page: form validation + availability check
   ========================================================== */

"use strict";

/* ---------- 1. Site data ---------- */

// The navigation menu is generated from this array, so adding a page
// only requires adding one object here.
const NAV_ITEMS = [
  { label: "Home", href: "index.html" },
  { label: "FAQ", href: "FAQ.html" },
  { label: "Book a Room", href: "roombooking.html" },
  { label: "References", href: "reference.html" },
];

// Student Center hours. Index 0 = Sunday ... 6 = Saturday (matches Date.getDay()).
// open/close are 24-hour numbers; null = closed all day.
const HOURS = [
  { day: "Sunday", open: null, close: null },
  { day: "Monday", open: 8, close: 21 },
  { day: "Tuesday", open: 8, close: 21 },
  { day: "Wednesday", open: 8, close: 21 },
  { day: "Thursday", open: 8, close: 21 },
  { day: "Friday", open: 8, close: 21 },
  { day: "Saturday", open: 9, close: 16 },
];

// The five bookable rooms.
const ROOMS = [
  { id: "brazos", name: "Brazos Study Room", capacity: 4, features: "Whiteboard wall, 55\" display" },
  { id: "collab", name: "Cougar Collab Room", capacity: 8, features: "Round table, wireless screen sharing" },
  { id: "riverbend", name: "Riverbend Conference Room", capacity: 16, features: "Projector, conference phone" },
  { id: "studio", name: "Media & Podcast Studio", capacity: 3, features: "Mics, sound panels, green screen" },
  { id: "esports", name: "Esports & Game Lounge", capacity: 12, features: "Gaming PCs, consoles, big screen" },
];

/* ---------- 2. Dynamic navigation menu ---------- */

function buildNavigation() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  // Work out which page we are on so its link can be highlighted.
  let current = window.location.pathname.split("/").pop();
  if (current === "") current = "index.html";

  const ul = document.createElement("ul");
  ul.className = "nav-list";
  ul.id = "nav-list";

  NAV_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;
    if (item.href.toLowerCase() === current.toLowerCase()) {
      a.setAttribute("aria-current", "page");
    }
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // Mobile hamburger toggle
  const toggle = document.getElementById("nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "✕ Close" : "☰ Menu";
    });

    // Close the menu with Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰ Menu";
        toggle.focus();
      }
    });
  }
}

/* ---------- 3. Footer + back-to-top ---------- */

function initFooterAndScroll() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.textContent = "↑";
  btn.addEventListener("click", () => window.scrollTo({ top: 0 }));
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });
}

/* ---------- 4. Homepage: live status + hours ---------- */

function formatHour(h) {
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${suffix}`;
}

function initHours() {
  const tbody = document.getElementById("hours-body");
  const status = document.getElementById("open-status");
  if (!tbody || !status) return;

  const now = new Date();
  const today = now.getDay();
  const hourNow = now.getHours() + now.getMinutes() / 60;

  // Build the hours table, Monday first
  const order = [1, 2, 3, 4, 5, 6, 0];
  order.forEach((i) => {
    const h = HOURS[i];
    const tr = document.createElement("tr");
    if (i === today) tr.className = "today";
    const time = h.open === null ? "Closed" : `${formatHour(h.open)} – ${formatHour(h.close)}`;
    tr.innerHTML = `<td>${h.day}${i === today ? " (today)" : ""}</td><td>${time}</td>`;
    tbody.appendChild(tr);
  });

  // Live open/closed indicator
  const t = HOURS[today];
  const isOpen = t.open !== null && hourNow >= t.open && hourNow < t.close;
  status.className = "status-pill " + (isOpen ? "status-open" : "status-closed");
  status.textContent = isOpen
    ? `Open now · closes at ${formatHour(t.close)}`
    : "Closed right now";
}

function initRoomCards() {
  const list = document.getElementById("room-cards");
  if (!list) return;

  // Remote images (Lorem Picsum) used as placeholders until campus photos are available
  const pics = [0, 20, 60, 96, 119];

  ROOMS.forEach((room, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="https://picsum.photos/id/${pics[i]}/640/400" alt="Placeholder photo for the ${room.name}" loading="lazy" width="640" height="400">
      <div class="card-body">
        <span class="tag">Up to ${room.capacity} people</span>
        <h3>${room.name}</h3>
        <p>${room.features}</p>
      </div>`;
    list.appendChild(card);
  });
}

/* ---------- 5. FAQ accordion ---------- */

function initFAQ() {
  const questions = document.querySelectorAll(".faq-question");
  if (questions.length === 0) return;

  function setOpen(btn, open) {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
  }

  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      setOpen(btn, !isOpen);
    });
  });

  const expandAll = document.getElementById("faq-expand");
  const collapseAll = document.getElementById("faq-collapse");
  if (expandAll) expandAll.addEventListener("click", () => questions.forEach((b) => setOpen(b, true)));
  if (collapseAll) collapseAll.addEventListener("click", () => questions.forEach((b) => setOpen(b, false)));
}

/* ---------- 6. Room booking form ---------- */

/*
  Availability check.
  Phase 2 (front-end): uses the sample bookings below so the page can be tested.
  Phase 3 (back-end): replace the body of checkAvailability() with a fetch() call
  to the Express server, e.g.
      const res = await fetch(`/api/availability?room=${roomId}&date=${date}&start=${start}&hours=${hours}`);
      return await res.json();   // { available: true/false, message: "..." }
*/
const SAMPLE_BOOKINGS = [
  // Each booking: room id, YYYY-MM-DD date, start hour, end hour (24h)
  { room: "riverbend", date: nextWeekday(1), start: 10, end: 12 },
  { room: "brazos", date: nextWeekday(1), start: 14, end: 16 },
  { room: "esports", date: nextWeekday(2), start: 17, end: 20 },
];

function nextWeekday(offsetDays) {
  // Returns a YYYY-MM-DD string for a date `offsetDays` ahead, skipping Sundays.
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return toISODate(d);
}

function toISODate(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function parseLocalDate(str) {
  // new Date("YYYY-MM-DD") is parsed as UTC; build a local date instead.
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function checkAvailability(roomId, date, start, hours) {
  const end = start + hours;
  const clash = SAMPLE_BOOKINGS.find(
    (b) => b.room === roomId && b.date === date && start < b.end && end > b.start
  );
  return Promise.resolve(
    clash
      ? { available: false, message: `Already booked ${formatHour(clash.start)} – ${formatHour(clash.end)} that day.` }
      : { available: true, message: "This room is available for that time." }
  );
}

function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const els = {
    name: form.elements["fullName"],
    email: form.elements["email"],
    phone: form.elements["phone"],
    room: form.elements["room"],
    date: form.elements["date"],
    start: form.elements["startTime"],
    hours: form.elements["duration"],
    people: form.elements["attendees"],
    purpose: form.elements["purpose"],
    agree: form.elements["agree"],
  };
  const roomInfo = document.getElementById("room-info");
  const availability = document.getElementById("availability");
  const result = document.getElementById("form-result");

  // Fill the room dropdown and the room table from the ROOMS data
  ROOMS.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.id;
    opt.textContent = `${r.name} (max ${r.capacity})`;
    els.room.appendChild(opt);
  });
  const roomTable = document.getElementById("room-table-body");
  if (roomTable) {
    ROOMS.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.name}</td><td>${r.capacity}</td><td>${r.features}</td>`;
      roomTable.appendChild(tr);
    });
  }

  // Date limits: today through 60 days out
  const today = new Date();
  const max = new Date();
  max.setDate(today.getDate() + 60);
  els.date.min = toISODate(today);
  els.date.max = toISODate(max);

  // ----- validators: each returns "" when valid, or an error message -----
  const validators = {
    name(v) {
      if (!v.trim()) return "Please enter your full name.";
      if (!/^[A-Za-zÀ-ÿ' -]{2,60}$/.test(v.trim())) return "Use letters, spaces, hyphens or apostrophes only (2–60 characters).";
      if (v.trim().split(/\s+/).length < 2) return "Please enter both first and last name.";
      return "";
    },
    email(v) {
      if (!v.trim()) return "Please enter your UH email address.";
      if (!/^[A-Za-z0-9._%+-]+@(cougarnet\.)?uh\.edu$/i.test(v.trim())) return "Use your UH email (ending in @uh.edu or @cougarnet.uh.edu).";
      return "";
    },
    phone(v) {
      if (!v.trim()) return ""; // optional
      if (!/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(v.trim())) return "Enter a 10-digit phone number, e.g. 281-555-0123.";
      return "";
    },
    room(v) {
      return v ? "" : "Please choose a room.";
    },
    date(v) {
      if (!v) return "Please pick a date.";
      const d = parseLocalDate(v);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      if (d < startOfToday) return "The date can't be in the past.";
      if (d > max) return "Bookings can be made up to 60 days ahead.";
      if (HOURS[d.getDay()].open === null) return "The Student Center is closed on Sundays.";
      return "";
    },
    start(v) {
      if (!v) return "Please choose a start time.";
      if (!els.date.value || validators.date(els.date.value)) return "";
      const d = parseLocalDate(els.date.value);
      const h = HOURS[d.getDay()];
      const startHour = Number(v);
      if (startHour < h.open || startHour >= h.close) {
        return `On ${h.day}s rooms are bookable ${formatHour(h.open)} – ${formatHour(h.close)}.`;
      }
      // Can't book a time that has already passed today
      if (els.date.value === toISODate(new Date()) && startHour <= new Date().getHours()) {
        return "That time has already passed today.";
      }
      return "";
    },
    hours(v) {
      if (!v) return "Please choose how long you need the room.";
      if (els.date.value && els.start.value && !validators.date(els.date.value)) {
        const close = HOURS[parseLocalDate(els.date.value).getDay()].close;
        if (Number(els.start.value) + Number(v) > close) return `The booking must end by closing time (${formatHour(close)}).`;
      }
      return "";
    },
    people(v) {
      if (!v) return "Please enter the number of attendees.";
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1) return "Enter a whole number of at least 1.";
      const room = ROOMS.find((r) => r.id === els.room.value);
      if (room && n > room.capacity) return `${room.name} holds at most ${room.capacity} people.`;
      return "";
    },
    purpose(v) {
      if (v.trim().length < 10) return "Briefly describe the purpose (at least 10 characters).";
      if (v.length > 300) return "Keep it under 300 characters.";
      return "";
    },
    agree(_v, el) {
      return el.checked ? "" : "Please agree to the room-use policy.";
    },
  };

  function showError(key) {
    const el = els[key];
    const msg = validators[key](el.value, el);
    const field = el.closest(".field");
    const errorEl = document.getElementById(`${el.id}-error`);
    field.classList.toggle("invalid", Boolean(msg));
    field.classList.toggle("valid", !msg && (el.type === "checkbox" ? el.checked : el.value !== ""));
    el.setAttribute("aria-invalid", String(Boolean(msg)));
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  }

  // Validate a field when the user leaves it, then live while they fix it
  Object.keys(els).forEach((key) => {
    const el = els[key];
    el.addEventListener("blur", () => showError(key));
    el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => {
      if (el.closest(".field").classList.contains("invalid")) showError(key);
    });
  });

  // Fields that depend on each other
  els.room.addEventListener("change", () => {
    const room = ROOMS.find((r) => r.id === els.room.value);
    roomInfo.innerHTML = room
      ? `<strong>${room.name}</strong> · seats up to ${room.capacity} · ${room.features}`
      : "Choose a room to see its details.";
    els.people.max = room ? room.capacity : "";
    if (els.people.value) showError("people");
    updateAvailability();
  });
  ["date", "start", "hours"].forEach((k) => els[k].addEventListener("change", () => {
    if (els.start.value) showError("start");
    if (els.hours.value) showError("hours");
    updateAvailability();
  }));

  // Live availability preview once room + date + time + duration are set
  async function updateAvailability() {
    availability.className = "availability";
    if (!els.room.value || !els.date.value || !els.start.value || !els.hours.value) {
      availability.textContent = "Pick a room, date, start time and duration to check availability.";
      return null;
    }
    if (validators.date(els.date.value) || validators.start(els.start.value) || validators.hours(els.hours.value)) {
      availability.textContent = "Fix the date/time errors above to check availability.";
      return null;
    }
    const res = await checkAvailability(els.room.value, els.date.value, Number(els.start.value), Number(els.hours.value));
    availability.textContent = (res.available ? "✓ " : "✕ ") + res.message;
    availability.classList.add(res.available ? "ok" : "bad");
    return res;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    result.className = "form-result";

    const allValid = Object.keys(els).map(showError).every(Boolean);
    if (!allValid) {
      const firstBad = form.querySelector("[aria-invalid='true']");
      if (firstBad) firstBad.focus();
      result.className = "form-result show fail";
      result.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    const res = await updateAvailability();
    const room = ROOMS.find((r) => r.id === els.room.value);
    if (!res || !res.available) {
      result.className = "form-result show fail";
      result.textContent = `Sorry, ${room.name} isn't available then. ${res ? res.message : ""} Try another time or room.`;
      return;
    }

    // Phase 3: this is where the form data will be POSTed to the Express backend.
    const start = Number(els.start.value);
    const end = start + Number(els.hours.value);
    SAMPLE_BOOKINGS.push({ room: room.id, date: els.date.value, start, end });

    const niceDate = parseLocalDate(els.date.value).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
    result.className = "form-result show success";
    result.innerHTML = `<strong>Request received!</strong> ${escapeHTML(els.name.value.trim())}, you're booked in
      <strong>${room.name}</strong> on ${niceDate}, ${formatHour(start)} – ${formatHour(end)}
      for ${els.people.value} ${els.people.value === "1" ? "person" : "people"}.
      A confirmation will go to ${escapeHTML(els.email.value.trim())}.`;
    result.focus();

    form.reset();
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
    roomInfo.textContent = "Choose a room to see its details.";
    availability.className = "availability";
    availability.textContent = "Pick a room, date, start time and duration to check availability.";
  });

  form.addEventListener("reset", () => {
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
    form.querySelectorAll(".error-msg").forEach((p) => (p.textContent = ""));
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Start everything once the page has loaded ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildNavigation();
  initFooterAndScroll();
  initHours();
  initRoomCards();
  initFAQ();
  initBookingForm();
});
