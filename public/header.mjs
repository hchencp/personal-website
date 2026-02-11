// header.mjs

const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "portfolio.html", label: "Portfolio" },
  { href: "green_thai_tea.html", label: "Thai Tea" },
  { href: "contact.html", label: "Contact" },
];

const DARK_MODE_KEY = "darkMode"; // stores "true" or "false"

function makeNavLinks() {
  const ul = document.createElement("ul");
  ul.className = "nav-links";

  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  for (const { href, label } of NAV_LINKS) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;

    if (currentFile === href) a.classList.add("active");

    li.append(a);
    ul.append(li);
  }

  return ul;
}

function setMenuOpen(navbar, menuBtn, isOpen) {
  navbar.classList.toggle("mobile-open", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
}

function createHeader() {
  const header = document.createElement("header");

  const navbar = document.createElement("div");
  navbar.className = "navbar";

  const left = document.createElement("div");
  left.className = "nav-left";

  const name = document.createElement("div");
  name.className = "nav-name";
  name.textContent = "Henry";

  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.id = "site-nav";
  nav.setAttribute("aria-label", "Main Navigation");
  nav.append(makeNavLinks());

  left.append(name, nav);

  const right = document.createElement("div");
  right.className = "nav-right";

  const darkLabel = document.createElement("label");
  darkLabel.className = "dark-toggle";
  darkLabel.innerHTML = `
    <input type="checkbox" autocomplete="off" />
    Dark mode
  `;

  const menuBtn = document.createElement("button");
  menuBtn.type = "button";
  menuBtn.className = "menu-btn";
  menuBtn.setAttribute("aria-controls", "site-nav");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "Menu";

  right.append(darkLabel, menuBtn);
  navbar.append(left, right);
  header.append(navbar);

  // ====== Menu toggle behavior ======
  menuBtn.addEventListener("click", () => {
    const currentlyOpen = navbar.classList.contains("mobile-open");
    setMenuOpen(navbar, menuBtn, !currentlyOpen);
  });

  // Clicks outside the header close the menu (NO stopPropagation)
  document.body.addEventListener("click", (e) => {
    const isOpen = navbar.classList.contains("mobile-open");
    if (!isOpen) return;

    // If click is inside header, do nothing
    if (header.contains(e.target)) return;

    // Otherwise close
    setMenuOpen(navbar, menuBtn, false);
  });

  // ====== Dark mode behavior + persistence ======
  const checkbox = darkLabel.querySelector("input");

  // On load, apply saved state
  const saved = localStorage.getItem(DARK_MODE_KEY); // "true" / "false" / null
  const isDark = saved === "true";
  checkbox.checked = isDark;
  document.body.classList.toggle("dark-mode", isDark);

  // On change, update body class + save
  checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", checkbox.checked);
    localStorage.setItem(DARK_MODE_KEY, String(checkbox.checked));
  });

  return header;
}

// Insert header
const placeholder = document.getElementById("site-header");
const oldHeader = document.querySelector("header");
const newHeader = createHeader();

if (placeholder) {
  placeholder.replaceWith(newHeader);
} else if (oldHeader) {
  oldHeader.replaceWith(newHeader);
} else {
  document.body.prepend(newHeader);
}
