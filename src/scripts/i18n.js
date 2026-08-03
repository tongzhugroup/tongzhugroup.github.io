// Client-side bilingual toggle. Elements with data-en / data-zh attributes
// have their textContent swapped. Persists choice in localStorage.
const STORAGE_KEY = "site-lang";
const langs = ["en", "zh"];
let current = localStorage.getItem(STORAGE_KEY) || "en";

function apply(lang) {
  current = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-en]").forEach((el) => {
    const val = el.getAttribute(`data-${lang}`);
    if (val != null) el.textContent = val;
  });
  // update toggle label to show the *other* language
  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    const other = lang === "en" ? "中文" : "EN";
    toggle.textContent = other;
  }
  localStorage.setItem(STORAGE_KEY, lang);
}

function toggle() {
  apply(current === "en" ? "zh" : "en");
}

// apply on first paint to avoid flash of wrong language
apply(current);

document.addEventListener("DOMContentLoaded", () => {
  apply(current);
  const toggleEl = document.getElementById("lang-toggle");
  if (toggleEl) toggleEl.addEventListener("click", toggle);
});
