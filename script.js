/* ═══ LocalStorage helpers ═══ */
const DB = {
  get: (k) => JSON.parse(localStorage.getItem(k) || "[]"),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  obj: (k) => JSON.parse(localStorage.getItem(k) || "null"),
  setObj: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

/* ═══ Seed demo data ═══ */
(function () {
  if (DB.obj("sv3")) return;
  const td = new Date().toISOString().split("T")[0];
  DB.set("bookings", [
    {
      name: "Priya Sharma",
      email: "priya@ex.com",
      phone: "9801234567",
      room: "Superior Suite",
      price: 320,
      date: td,
      status: "confirmed",
    },
    {
      name: "James Miller",
      email: "james@mail.com",
      phone: "+1-555-0100",
      room: "Royal Penthouse",
      price: 850,
      date: td,
      status: "pending",
    },
    {
      name: "Sita Rai",
      email: "sita@np.com",
      phone: "9857654321",
      room: "Deluxe Room",
      price: 180,
      date: td,
      status: "confirmed",
    },
  ]);
  DB.set("reviews", [
    {
      name: "Aarav K.",
      email: "aarav@np.com",
      rating: 5,
      comment: "Absolutely magnificent. Best stay in Kathmandu.",
      stay: "Leisure",
      date: td,
    },
    {
      name: "Mei Lin",
      email: "mei@cn.com",
      rating: 4,
      comment: "Beautiful views, excellent service. Will return!",
      stay: "Business",
      date: td,
    },
  ]);
  DB.set("users", [
    {
      username: "admin",
      name: "Administrator",
      email: "admin@royal.com",
      registered: td,
    },
  ]);
  DB.setObj("sv3", true);
})();

/* ═══ Default dates ═══ */
const today = new Date().toISOString().split("T")[0];
const tmrw = new Date(Date.now() + 86400000).toISOString().split("T")[0];
document.getElementById("ci").value = today;
document.getElementById("co").value = tmrw;
document.getElementById("ci").min = today;
document.getElementById("co").min = tmrw;

/* ═══ Theme ═══ */
function toggleTheme() {
  const t = document.documentElement.getAttribute("data-theme");
  const n = t === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", n);
  document.getElementById("themeIco").textContent = n === "dark" ? "☀️" : "🌙";
}

/* ═══ Mobile menu ═══ */
function openMM() {
  document.getElementById("mm").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeMM() {
  document.getElementById("mm").classList.remove("open");
  document.body.style.overflow = "";
}

/* ═══ Scroll ═══ */
function scrollSm(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ═══ Parallax ═══ */
window.addEventListener(
  "scroll",
  () => {
    const b = document.getElementById("heroBg");
    if (b)
      b.style.transform = `scale(1.06) translateY(${window.scrollY * 0.2}px)`;
  },
  { passive: true },
);

/* ═══ Reveal ═══ */
const ro = new IntersectionObserver(
  (es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        ro.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".rev").forEach((el) => ro.observe(el));

/* ═══ Toast ═══ */
function toast(m) {
  const el = document.getElementById("toast");
  el.textContent = m;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3400);
}

/* ═══ Auth ═══ */
let cUser = null;
function openLogin() {
  if (cUser) {
    if (cUser.username === "admin") {
      openAdmin();
      return;
    }
    toast(`You're signed in as ${cUser.username}`);
    return;
  }
  document.getElementById("loginOv").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLogin() {
  document.getElementById("loginOv").classList.remove("open");
  document.body.style.overflow = "";
}
function swTab(t) {
  document
    .querySelectorAll(".mtab")
    .forEach((b, i) =>
      b.classList.toggle("active", i === (t === "login" ? 0 : 1)),
    );
  document.getElementById("tLogin").classList.toggle("active", t === "login");
  document.getElementById("tReg").classList.toggle("active", t !== "login");
}
function doLogin() {
  const u = document.getElementById("lu").value.trim();
  const p = document.getElementById("lp").value;
  const err = document.getElementById("lerr");
  err.style.display = "none";
  if (u === "admin" && p === "admin123") {
    cUser = { username: "admin", role: "admin" };
    document.getElementById("loginBtn").textContent = "⚙ Admin";
    closeLogin();
    openAdmin();
    return;
  }
  const users = DB.get("users");
  const f = users.find(
    (x) => (x.username === u || x.email === u) && x.password === p,
  );
  if (f) {
    cUser = f;
    document.getElementById("loginBtn").textContent = `Hi, ${f.username}`;
    closeLogin();
    toast(`Welcome back, ${f.name || f.username}! ✨`);
  } else {
    err.style.display = "block";
  }
}
function doReg() {
  const n = document.getElementById("rn").value.trim();
  const u = document.getElementById("ru").value.trim();
  const e = document.getElementById("re").value.trim();
  const p = document.getElementById("rp").value;
  const err = document.getElementById("rerr");
  err.style.display = "none";
  if (!n || !u || !e || !p) {
    err.textContent = "All fields are required.";
    err.style.display = "block";
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(e)) {
    err.textContent = "Invalid email.";
    err.style.display = "block";
    return;
  }
  const users = DB.get("users");
  if (users.find((x) => x.username === u)) {
    err.textContent = "Username already taken.";
    err.style.display = "block";
    return;
  }
  users.push({
    username: u,
    name: n,
    email: e,
    password: p,
    registered: today,
  });
  DB.set("users", users);
  cUser = { username: u, name: n, email: e };
  document.getElementById("loginBtn").textContent = `Hi, ${u}`;
  closeLogin();
  toast(`Welcome to Royal Haven, ${n}! ✨`);
}

/* ═══ Booking ═══ */
let sRoom = null,
  sPrice = null;
function selectRoom(r, p) {
  sRoom = r;
  sPrice = p;
  document.getElementById("bSum").textContent = `${r} — RS${p}/night`;
  document.getElementById("berr").style.display = "none";
  if (cUser) {
    document.getElementById("bn").value = cUser.name || cUser.username || "";
    document.getElementById("be").value = cUser.email || "";
  }
  document.getElementById("bookOv").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeBook() {
  document.getElementById("bookOv").classList.remove("open");
  document.body.style.overflow = "";
}
function handleBooking() {
  const i = document.getElementById("ci").value;
  const o = document.getElementById("co").value;
  if (!i || !o) {
    toast("Please select check-in and check-out dates.");
    return;
  }
  if (new Date(o) <= new Date(i)) {
    toast("Check-out must be after check-in.");
    return;
  }
  const map = {
    "Deluxe Room": 180,
    "Superior Suite": 320,
    "Himalayan Suite": 480,
    "Royal Penthouse": 850,
  };
  const r = document.getElementById("rt").value;
  selectRoom(r, map[r] || 200);
}
function confirmBook() {
  const n = document.getElementById("bn").value.trim();
  const e = document.getElementById("be").value.trim();
  const ph = document.getElementById("bp").value.trim();
  const err = document.getElementById("berr");
  if (!n || !e || !ph) {
    err.style.display = "block";
    return;
  }
  err.style.display = "none";
  const bk = DB.get("bookings");
  bk.push({
    name: n,
    email: e,
    phone: ph,
    room: sRoom,
    price: sPrice,
    date: today,
    status: "pending",
  });
  DB.set("bookings", bk);
  closeBook();
  document.getElementById("sucMsg").textContent =
    `Booking for ${sRoom} confirmed! We'll contact you at ${e} shortly.`;
  openSuc();
}

/* ═══ Stars ═══ */
let sRating = 0;
document.querySelectorAll(".star").forEach((b) => {
  b.addEventListener("click", () => {
    sRating = +b.dataset.v;
    document
      .querySelectorAll(".star")
      .forEach((s) => s.classList.toggle("on", +s.dataset.v <= sRating));
  });
  b.addEventListener("mouseenter", () =>
    document
      .querySelectorAll(".star")
      .forEach((s) => s.classList.toggle("on", +s.dataset.v <= +b.dataset.v)),
  );
});
document
  .getElementById("starRow")
  .addEventListener("mouseleave", () =>
    document
      .querySelectorAll(".star")
      .forEach((s) => s.classList.toggle("on", +s.dataset.v <= sRating)),
  );

/* ═══ Live validation ═══ */
function lv(inputId, groupId, test) {
  document.getElementById(inputId).addEventListener("input", function () {
    const g = document.getElementById(groupId);
    const v = this.value.trim();
    if (!v) {
      g.classList.remove("err", "ok");
      return;
    }
    g.classList.toggle("err", !test(v));
    g.classList.toggle("ok", test(v));
  });
}
lv("fn", "fgN", (v) => v.length >= 2);
lv("fe", "fgE", (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v));
lv("fc", "fgC", (v) => v.length >= 10);

/* ═══ Feedback submit ═══ */
document.getElementById("ffForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const n = document.getElementById("fn").value.trim();
  const em = document.getElementById("fe").value.trim();
  const c = document.getElementById("fc").value.trim();
  let ok = true;
  const se = (id, cond) => {
    document.getElementById(id).classList.toggle("err", !cond);
    if (!cond) ok = false;
  };
  se("fgN", n.length >= 2);
  se("fgE", /^[^@]+@[^@]+\.[^@]+$/.test(em));
  se("fgC", c.length >= 10);
  if (!sRating) {
    toast("Please select a star rating ★");
    ok = false;
  }
  if (!ok) return;
  const rv = DB.get("reviews");
  rv.push({
    name: n,
    email: em,
    rating: sRating,
    comment: c,
    stay: document.getElementById("fs").value,
    date: today,
  });
  DB.set("reviews", rv);
  document.getElementById("sucMsg").textContent =
    "Your review has been submitted. Thank you for staying with us!";
  openSuc();
  this.reset();
  sRating = 0;
  document.querySelectorAll(".star").forEach((b) => b.classList.remove("on"));
  ["fgN", "fgE", "fgC"].forEach((id) =>
    document.getElementById(id).classList.remove("err", "ok"),
  );
});

/* ═══ Success popup ═══ */
function openSuc() {
  document.getElementById("sucOv").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSuc() {
  document.getElementById("sucOv").classList.remove("open");
  document.body.style.overflow = "";
}

/* ═══ Admin ═══ */
function openAdmin() {
  const bk = DB.get("bookings");
  const rv = DB.get("reviews");
  const us = DB.get("users");
  const conf = bk.filter((b) => b.status === "confirmed");
  const rev_sum = conf.reduce((s, b) => s + (b.price || 0), 0);
  const avg = rv.length
    ? (rv.reduce((s, r) => s + r.rating, 0) / rv.length).toFixed(1)
    : "—";
  document.getElementById("kpis").innerHTML = [
    ["Total Bookings", bk.length],
    ["Confirmed", conf.length],
    ["Revenue", "$" + rev_sum.toLocaleString()],
    ["Reviews", rv.length],
    ["Avg Rating", avg + "★"],
    ["Users", us.length],
  ]
    .map(
      ([l, v]) =>
        `<div class="kpi"><div class="kpi-l">${l}</div><div class="kpi-n">${v}</div></div>`,
    )
    .join("");
  document.getElementById("btb").innerHTML = bk.length
    ? bk
        .map(
          (b) =>
            `<tr><td>${b.name}</td><td>${b.email}</td><td>${b.room}</td><td>$${b.price}</td><td>${b.date}</td><td><span class="badge b${b.status[0]}">${b.status}</span></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="6" style="color:var(--txtm);text-align:center;padding:2rem">No bookings yet</td></tr>';
  document.getElementById("rtb").innerHTML = rv.length
    ? rv
        .map(
          (r) =>
            `<tr><td>${r.name}</td><td>${r.email}</td><td style="color:var(--c10)">${"★".repeat(r.rating)}</td><td>${r.comment}</td><td>${r.date}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" style="color:var(--txtm);text-align:center;padding:2rem">No reviews yet</td></tr>';
  const ul = us.filter((u) => u.username !== "admin");
  document.getElementById("utb").innerHTML = ul.length
    ? ul
        .map(
          (u) =>
            `<tr><td>${u.username}</td><td>${u.email}</td><td>${u.registered}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="3" style="color:var(--txtm);text-align:center;padding:2rem">No registered users</td></tr>';
  document.getElementById("adminPanel").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeAdmin() {
  document.getElementById("adminPanel").classList.remove("open");
  document.body.style.overflow = "";
}

/* ═══ Overlay backdrop close ═══ */
["loginOv", "bookOv", "sucOv"].forEach((id) => {
  document.getElementById(id).addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  ["loginOv", "bookOv", "sucOv"].forEach((id) =>
    document.getElementById(id).classList.remove("open"),
  );
  document.body.style.overflow = "";
});