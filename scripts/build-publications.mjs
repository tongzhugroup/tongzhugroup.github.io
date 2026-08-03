// Build-time script: parse tong.bib → src/data/publications.json
// Run with: node scripts/build-publications.js
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import bibtexParse from "bibtex-parse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BIB_PATH = resolve(__dirname, "../../files/tong.bib");
const OUT_PATH = resolve(__dirname, "../src/data/publications.json");

/** Split "Hu, Guo-Dong and Zhu, Tong and ..." into [{family,given}, ...] */
function parseAuthors(raw) {
  if (!raw) return [];
  return raw
    .split(/\s+and\s+/i)
    .map((a) => a.trim())
    .filter(Boolean)
    .filter((a) => !/^others?$/i.test(a))
    .map((full) => {
      const idx = full.lastIndexOf(",");
      if (idx > 0) {
        return { family: full.slice(0, idx).trim(), given: full.slice(idx + 1).trim() };
      }
      // "Tong Zhu" style — last token is family
      const parts = full.split(/\s+/);
      if (parts.length >= 2) {
        return { family: parts[parts.length - 1], given: parts.slice(0, -1).join(" ") };
      }
      return { family: full, given: "" };
    });
}

/** "Zhu, Tong" → "Tong Zhu"; "Hu, Guo-Dong" → "Guo-Dong Hu" */
function authorDisplay({ family, given }) {
  return given ? `${given} ${family}` : family;
}

/** Is this author "me" (Tong Zhu, in either name order)? */
const isMe = (a) => /Zhu/i.test(a.family) && /Tong/i.test(a.given || "");

/** Bold the matching author (Tong Zhu) within an author list string. */
function formatAuthorList(authors) {
  const list = authors.map(authorDisplay);
  return list.map((name, i) => (isMe(authors[i]) ? `**${name}**` : name)).join(", ");
}

function field(entry, ...names) {
  for (const n of names) {
    if (entry[n] != null && entry[n] !== "") return entry[n];
    const lower = n.toLowerCase();
    if (entry[lower] != null && entry[lower] !== "") return entry[lower];
  }
  return undefined;
}

const text = readFileSync(BIB_PATH, "utf8");
const entries = bibtexParse.entries(text);

const pubs = entries
  .map((e) => {
    const rawAuthor = field(e, "AUTHOR") || "";
    const authors = parseAuthors(rawAuthor);
    // Drop entries whose author list is truncated with "and others" AND
    // "me" is not among the named authors (i.e. hidden behind the ellipsis).
    const hasOthers = /\band\s+others\b/i.test(rawAuthor);
    if (hasOthers && !authors.some(isMe)) return null;

    const yearRaw = field(e, "YEAR", "DATE");
    const year = yearRaw ? Number.parseInt(String(yearRaw), 10) : null;
    return {
      key: e.key,
      type: e.type,
      title: field(e, "TITLE"),
      authors,
      authorsDisplay: formatAuthorList(authors),
      journal: field(e, "JOURNAL", "BOOKTITLE", "JOURNALTITLE"),
      year,
      volume: field(e, "VOLUME"),
      number: field(e, "NUMBER", "ISSUE"),
      pages: field(e, "PAGES"),
      publisher: field(e, "PUBLISHER"),
      doi: field(e, "DOI"),
      url: field(e, "URL"),
    };
  })
  .filter((p) => p && p.title && p.year && p.authors.length > 0)
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(pubs, null, 2));

console.log(`✓ wrote ${pubs.length} publications → ${OUT_PATH}`);
console.log(`  year range: ${pubs[0]?.year}–${pubs[pubs.length - 1]?.year}`);
