// Query Crossref for each title, check if "Tong Zhu" is among authors.
// Run: node scripts/check-crossref.mjs
import { readFileSync } from "node:fs";

const titles = JSON.parse(readFileSync(process.argv[2] || "/dev/stdin", "utf8"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function crossrefSearch(title) {
  const q = encodeURIComponent(title.slice(0, 200));
  const url = `https://api.crossref.org/works?query.bibliographic=${q}&rows=3&select=DOI,title,author,published,container-title`;
  const res = await fetch(url, {
    headers: { "User-Agent": "tongzhugroup-site/1.0 (mailto:zhu@example.com)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  return j.message.items;
}

function titleMatch(a, b) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  // one contains the other (handles trailing subtitle differences)
  return na.includes(nb.slice(0, 60)) || nb.includes(na.slice(0, 60));
}

function authorNames(item) {
  return (item.author || []).map((a) => [a.given, a.family].filter(Boolean).join(" ").trim());
}

for (const t of titles) {
  try {
    const items = await crossrefSearch(t.title);
    const match = items.find((it) => {
      const ct = Array.isArray(it.title) ? it.title[0] : it.title;
      return ct && titleMatch(ct, t.title);
    }) || items[0];
    if (!match) {
      console.log(`❓ NO MATCH | ${t.key} | ${t.title.slice(0, 70)}`);
      continue;
    }
    const ct = Array.isArray(match.title) ? match.title[0] : match.title;
    const auth = authorNames(match);
    const me = auth.some((a) => /Tong/i.test(a) && /Zhu/i.test(a));
    const doi = match.DOI || "";
    const journal = (match["container-title"] || [])[0] || "";
    console.log(
      `${me ? "✅ YES" : "❌ NO "} | ${t.key} | ${doi} | ${auth.length} authors | ${t.title.slice(0, 55)}`
    );
    if (me) {
      console.log(`         authors: ${auth.join(" | ")}`);
    }
  } catch (e) {
    console.log(`⚠️ ERR | ${t.key} | ${e.message}`);
  }
  await sleep(1500); // respect crossref rate limit
}
