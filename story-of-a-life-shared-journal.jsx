import React, { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  The Story of a Life — a shared family legacy journal              */
/*  Everyone with the link reads and writes the same journal.         */
/*  Original prompts. Photos compressed client-side. Docs attach      */
/*  by link. Native browser spell check on every writing box.         */
/* ------------------------------------------------------------------ */

const C = {
  paper: "#FAF6EC",
  ink: "#3A3226",
  soft: "#6E6353",
  teal: "#2F5D58",
  terra: "#B5654A",
  field: "#FFFEF9",
  line: "#D8CDB4",
  tint: "#F2ECDC",
};
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" };

const SECTIONS = [
  { id: "s1", title: "In the Beginning", prompts: [
    { id: "s1p1", q: "My full name at birth, and the story of how it was chosen for me." },
    { id: "s1p2", q: "I was born on this date, in this place — and here is everything I know about the day I arrived." },
    { id: "s1p3", q: "The family I was born into, and what their life looked like when I joined it." },
    { id: "s1p4", q: "Stories my family always told about me as a baby." },
    { id: "s1p5", q: "My earliest memory, as best I can reach it." },
  ]},
  { id: "s2", title: "The World of My Childhood", prompts: [
    { id: "s2p1", q: "The house (or houses) I grew up in — its rooms, its sounds, its smells." },
    { id: "s2p2", q: "My neighborhood, and the world just outside our door." },
    { id: "s2p3", q: "How I spent my time when no one was telling me what to do." },
    { id: "s2p4", q: "A typical evening at our family table." },
    { id: "s2p5", q: "My childhood best friend, and what the two of us got up to." },
    { id: "s2p6", q: "Something I was afraid of back then." },
    { id: "s2p7", q: "A childhood moment I can still see clearly when I close my eyes." },
  ]},
  { id: "s3", title: "My People", prompts: [
    { id: "s3p1", q: "My mother — who she was, what she was like, and how I see her now." },
    { id: "s3p2", q: "My father — who he was, what he was like, and how I see him now." },
    { id: "s3p7", q: "How my parents met, as the story was told to me." },
    { id: "s3p3", q: "My grandparents, and what I knew (or wish I had asked) about their lives." },
    { id: "s3p8", q: "My grandmother's marriages — how many there were, and what I know of each chapter." },
    { id: "s3p4", q: "My brothers and sisters, and what it was like growing up together." },
    { id: "s3p5", q: "A relative or family friend who shaped who I became." },
    { id: "s3p6", q: "The traditions my family kept, and where they came from." },
    { id: "s3p9", q: "Illnesses or health conditions that ran in our family, and how they touched us." },
  ]},
  { id: "s4", title: "School Days & Growing Up", prompts: [
    { id: "s4p1", q: "My first day of school, as well as I can remember it." },
    { id: "s4p2", q: "A teacher I never forgot, and why." },
    { id: "s4p3", q: "What I was really like as a teenager — honestly." },
    { id: "s4p4", q: "The music, the shows, and the crazes of my young years." },
    { id: "s4p5", q: "My first job, what it paid, and what it taught me." },
    { id: "s4p6", q: "Something I did in those years that took real courage — or real foolishness." },
    { id: "s4p7", q: "What I dreamed my life would look like back then." },
  ]},
  { id: "s5", title: "Out on My Own", prompts: [
    { id: "s5p1", q: "The day I left home, and how it felt to go." },
    { id: "s5p2", q: "My first place of my own." },
    { id: "s5p3", q: "What independence taught me the hard way." },
    { id: "s5p4", q: "A risk I took in those years, and how it turned out." },
    { id: "s5p5", q: "The friends who became my chosen family." },
  ]},
  { id: "s6", title: "Love & Partnership", prompts: [
    { id: "s6p1", q: "How I met the love of my life — or the loves that mattered most." },
    { id: "s6p2", q: "What I noticed about them first." },
    { id: "s6p3", q: "The story of how we decided to build a life together." },
    { id: "s6p4", q: "Our wedding day, or the day that sealed it for us." },
    { id: "s6p5", q: "What we have weathered together, side by side." },
    { id: "s6p6", q: "What I know now about what makes love last." },
  ]},
  { id: "s7", title: "Work & Purpose", prompts: [
    { id: "s7p1", q: "The work I have done with my life, in all its chapters." },
    { id: "s7p2", q: "The job, project, or accomplishment I am proudest of." },
    { id: "s7p3", q: "A mentor who believed in me before I believed in myself." },
    { id: "s7p4", q: "The hardest working day I can remember." },
    { id: "s7p5", q: "What I would tell a young person just starting out in my line of work." },
  ]},
  { id: "s8", title: "A Home of My Own", prompts: [
    { id: "s8p1", q: "Becoming a parent — or the family I built in my own way." },
    { id: "s8p2", q: "What I remember about the day each child came into my life." },
    { id: "s8p3", q: "The everyday chaos and comedy of our household." },
    { id: "s8p4", q: "A family trip or holiday we still talk about." },
    { id: "s8p5", q: "What I hope my children carried with them from the way I raised them." },
    { id: "s8p6", q: "What being a grandparent has meant to me, if life has brought me that gift." },
  ]},
  { id: "s9", title: "Places & Journeys", prompts: [
    { id: "s9p1", q: "Every place I have called home, roughly in order." },
    { id: "s9p2", q: "The one place that shaped me more than any other." },
    { id: "s9p3", q: "The best trip I ever took." },
    { id: "s9p4", q: "A place I still dream of seeing someday." },
    { id: "s9p5", q: "Where I feel most at peace in the world." },
  ]},
  { id: "s10", title: "My Favorite Things", prompts: [
    { id: "qf1", q: "A meal I could eat forever", short: true },
    { id: "qf2", q: "The song I turn up every time", short: true },
    { id: "qf3", q: "A book that stayed with me", short: true },
    { id: "qf4", q: "My favorite holiday of the year", short: true },
    { id: "qf5", q: "The season I wait for", short: true },
    { id: "qf6", q: "A smell that brings back memories", short: true },
    { id: "qf7", q: "My idea of a perfect day off", short: true },
    { id: "qf8", q: "A saying I repeat too often", short: true },
    { id: "qf9", q: "The best gift I ever received", short: true },
    { id: "qf10", q: "A skill I am quietly proud of", short: true },
    { id: "qf11", q: "Something that always makes me laugh", short: true },
    { id: "qf12", q: "Pick one favorite and tell the story behind it." },
  ]},
  { id: "s11", title: "Hard-Won Wisdom", prompts: [
    { id: "s11p1", q: "The hardest season of my life, and how I came through it." },
    { id: "s11p2", q: "A mistake that taught me something I truly needed to know." },
    { id: "s11p3", q: "A belief I held tightly when I was young that I have since let go." },
    { id: "s11p4", q: "What I have come to believe about faith, luck, and the bigger picture." },
    { id: "s11p5", q: "The advice I find myself giving most often." },
    { id: "s11p6", q: "What I no longer waste a single minute worrying about." },
  ]},
  { id: "s12", title: "Looking Back, Looking Forward", prompts: [
    { id: "s12p1", q: "The moments in my life I am proudest of." },
    { id: "s12p2", q: "What I am most grateful for." },
    { id: "s12p3", q: "Something about me that might surprise even the people who love me." },
    { id: "s12p4", q: "How I would like to be remembered." },
    { id: "s12p5", q: "My hopes for the generations that come after me." },
    { id: "s12p6", q: "And finally — a letter to you, the one holding this book." },
  ]},
];

SECTIONS.forEach((s) => s.prompts.push({
  id: s.id + "notes",
  q: "Notes for this chapter — corrections, stray memories, or anything else that belongs here.",
}));

/* ----------------------------- storage ---------------------------- */
const MEM = {};              // session-only fallback for the unpublished preview
let USE_MEM = false;

const probeStorage = async () => {
  if (!window.storage) return { mode: "memory", detail: "no storage API" };
  try {
    const k = "probe:" + Date.now().toString(36);
    const r = await window.storage.set(k, "1", true);
    if (!r) return { mode: "memory", detail: "writes not permitted" };
    try { await window.storage.delete(k, true); } catch (e) {}
    return { mode: "ok", detail: "" };
  } catch (e) {
    return { mode: "memory", detail: (e && e.message) || "writes failed" };
  }
};

const sGet = async (k) => {
  if (USE_MEM) return k in MEM ? MEM[k] : null;
  try { const r = await window.storage.get(k, true); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
};
const sSet = async (k, v) => {
  if (USE_MEM) { MEM[k] = v; return true; }
  try { return await window.storage.set(k, JSON.stringify(v), true); }
  catch { return null; }
};
const sDel = async (k) => {
  if (USE_MEM) { delete MEM[k]; return true; }
  try { return await window.storage.delete(k, true); }
  catch { return null; }
};
const sList = async (p) => {
  if (USE_MEM) return Object.keys(MEM).filter((k) => k.startsWith(p));
  try { const r = await window.storage.list(p, true); return (r && r.keys) || []; }
  catch { return []; }
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const normUrl = (u) => (/^https?:\/\//i.test(u) ? u : "https://" + u);
const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

const escH = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function buildBackupHtml(byPrompt, imgs, meta) {
  const css = "body{font-family:Georgia,serif;color:#3A3226;max-width:620pt;margin:24pt auto;padding:0 12pt}" +
    "h1{color:#2F5D58;text-align:center;font-weight:normal}h2{color:#2F5D58;font-weight:normal;margin:28pt 0 4pt;text-align:center}" +
    ".rule{border-bottom:1pt solid #B5654A;margin:2pt 40pt 12pt}.q{font-style:italic;margin:16pt 0 4pt}" +
    ".en{border:1pt solid #D8CDB4;background:#FFFEF9;padding:8pt 10pt;margin:0 0 8pt}" +
    ".a{color:#2F5D58;font-style:italic}.d{color:#6E6353;font-size:9pt;float:right}" +
    "img{max-width:320pt;height:auto;display:block;margin:6pt 0}a{color:#2F5D58}";
  let h = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">' +
    '<head><meta charset="utf-8"><title>The Story of a Life</title><style>' + css + "</style></head><body>";
  h += '<p style="text-align:center;color:#6E6353;letter-spacing:3pt;font-size:9pt">A GUIDED LEGACY JOURNAL</p>';
  h += "<h1>The Story of a Life</h1>";
  if (meta.subject) h += '<p style="text-align:center;font-style:italic">The life of ' + escH(meta.subject) + "</p>";
  if (meta.dedication) h += '<p style="text-align:center;font-style:italic;color:#6E6353">' + escH(meta.dedication) + "</p>";
  h += '<p style="text-align:center;color:#6E6353;font-size:9pt">Backup made ' + escH(new Date().toLocaleDateString()) + "</p>";
  SECTIONS.forEach((sec) => {
    const withContent = sec.prompts.filter((p) => (byPrompt[p.id] || []).length);
    if (!withContent.length) return;
    h += "<h2>" + escH(sec.title) + '</h2><div class="rule"></div>';
    withContent.forEach((p) => {
      h += '<p class="q">' + escH(p.q) + "</p>";
      (byPrompt[p.id] || []).forEach((en) => {
        h += '<div class="en"><span class="d">' + escH(fmtDate(en.ts)) + '</span><span class="a">' + escH(en.a) + "</span>";
        if (en.t) h += '<p style="margin:6pt 0 0">' + escH(en.t).replace(/\n/g, "<br>") + "</p>";
        (en.imgs || []).forEach((id) => { if (imgs[id]) h += '<img src="' + imgs[id] + '">'; });
        (en.links || []).forEach((l) => { h += '<p style="margin:4pt 0 0"><a href="' + escH(l.u) + '">' + escH(l.l || l.u) + "</a></p>"; });
        (en.docs || []).forEach((d0) => { h += '<p style="margin:4pt 0 0">Document: <a href="' + escH(d0.u) + '">' + escH(d0.l || d0.u) + "</a></p>"; });
        h += "</div>";
      });
    });
  });
  h += '<p style="text-align:center;color:#6E6353;font-style:italic;margin-top:28pt">A life, set down in our own words.</p></body></html>';
  return h;
}

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          const MAX = 1000;
          if (width > MAX || height > MAX) {
            const s = MAX / Math.max(width, height);
            width = Math.round(width * s);
            height = Math.round(height * s);
          }
          const cv = document.createElement("canvas");
          cv.width = width; cv.height = height;
          cv.getContext("2d").drawImage(img, 0, 0, width, height);
          let out = cv.toDataURL("image/jpeg", 0.72);
          if (out.length > 500000) out = cv.toDataURL("image/jpeg", 0.5);
          resolve(out);
        } catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error("Could not read that image."));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });

/* ----------------------------- atoms ------------------------------ */
const Diamond = ({ size = 7, color = C.terra }) => (
  <span aria-hidden="true" style={{ width: size, height: size, backgroundColor: color, transform: "rotate(45deg)", display: "inline-block", flexShrink: 0 }} />
);

const Ornament = () => (
  <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
    <span style={{ height: 1, width: 72, backgroundColor: C.terra, opacity: 0.7 }} />
    <Diamond />
    <span style={{ height: 1, width: 72, backgroundColor: C.terra, opacity: 0.7 }} />
  </div>
);

const TreeEmblem = ({ size = 170, stroke = "#F4EEDD", accent = "#C67B5C" }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true">
    <circle cx="100" cy="100" r="86" stroke={stroke} strokeWidth="1.4" opacity="0.9" />
    <circle cx="100" cy="100" r="79" stroke={stroke} strokeWidth="0.8" opacity="0.55" />
    <line x1="62" y1="122" x2="138" y2="122" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M97 122 L98.5 92 Q100 84 101.5 92 L103 122 Z" fill={stroke} />
    <g stroke={stroke} strokeWidth="2.4" strokeLinecap="round">
      <path d="M100 92 L100 66" />
      <path d="M100 84 L78 62" />
      <path d="M100 84 L122 62" />
      <path d="M100 96 L66 78" />
      <path d="M100 96 L134 78" />
    </g>
    <g fill={stroke}>
      <rect x="-4.5" y="-4.5" width="9" height="9" transform="translate(100 56) rotate(45)" />
      <rect x="-4" y="-4" width="8" height="8" transform="translate(78 56) rotate(45)" />
      <rect x="-4" y="-4" width="8" height="8" transform="translate(122 56) rotate(45)" />
      <rect x="-3.5" y="-3.5" width="7" height="7" transform="translate(60 74) rotate(45)" />
      <rect x="-3.5" y="-3.5" width="7" height="7" transform="translate(140 74) rotate(45)" />
      <rect x="-3" y="-3" width="6" height="6" transform="translate(88 44) rotate(45)" />
      <rect x="-3" y="-3" width="6" height="6" transform="translate(112 44) rotate(45)" />
    </g>
    <g fill={accent}>
      <rect x="-3.5" y="-3.5" width="7" height="7" transform="translate(100 36) rotate(45)" />
      <rect x="-3" y="-3" width="6" height="6" transform="translate(68 62) rotate(45)" />
      <rect x="-3" y="-3" width="6" height="6" transform="translate(132 62) rotate(45)" />
    </g>
    <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
      <path d="M100 122 L100 140" />
      <path d="M99 122 L82 136" />
      <path d="M101 122 L118 136" />
      <path d="M98 122 L70 130" />
      <path d="M102 122 L130 130" />
    </g>
    <g fill={stroke} opacity="0.7">
      <rect x="-2.5" y="-2.5" width="5" height="5" transform="translate(100 144) rotate(45)" />
      <rect x="-2.5" y="-2.5" width="5" height="5" transform="translate(80 139) rotate(45)" />
      <rect x="-2.5" y="-2.5" width="5" height="5" transform="translate(120 139) rotate(45)" />
    </g>
  </svg>
);

const Btn = ({ children, onClick, kind = "ghost", disabled, small }) => {
  const base = { ...sans, letterSpacing: "0.02em" };
  const styles =
    kind === "solid"
      ? { ...base, backgroundColor: C.teal, color: C.paper, border: "1px solid " + C.teal }
      : kind === "line"
      ? { ...base, backgroundColor: "transparent", color: C.teal, border: "1px solid " + C.teal }
      : { ...base, backgroundColor: "transparent", color: C.soft, border: "1px solid transparent" };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={styles}
      className={
        (small ? "px-3 py-1 text-xs " : "px-4 py-2 text-sm ") +
        "rounded-full transition-opacity disabled:opacity-40 hover:opacity-80 focus:outline-none focus-visible:ring-2"
      }
    >
      {children}
    </button>
  );
};

const Chip = ({ label, onRemove }) => (
  <span style={{ ...sans, backgroundColor: C.tint, color: C.ink, border: "1px solid " + C.line }}
    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs max-w-full">
    <span className="truncate">{label}</span>
    <button onClick={onRemove} aria-label={"Remove " + label} className="hover:opacity-60" style={{ color: C.soft }}>✕</button>
  </span>
);

/* ------------------------------ app ------------------------------- */
export default function StoryOfALifeJournal() {
  const [me, setMe] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [namingFor, setNamingFor] = useState(null); // "pill" | promptId | null

  const [meta, setMeta] = useState({ subject: "", dedication: "" });
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaDraft, setMetaDraft] = useState({ subject: "", dedication: "" });

  const [answered, setAnswered] = useState(new Set()); // prompt ids with entries
  const [open, setOpen] = useState(null);              // section id
  const [data, setData] = useState({});                // promptId -> entries[]
  const [images, setImages] = useState({});            // imgId -> dataUrl
  const [loadingSec, setLoadingSec] = useState(null);

  const [composing, setComposing] = useState(null);    // promptId
  const [draft, setDraft] = useState({ text: "", links: [], docs: [], imgs: [] });
  const [attachMode, setAttachMode] = useState(null);  // "link" | "doc" | null
  const [attachDraft, setAttachDraft] = useState({ u: "", l: "" });
  const [busy, setBusy] = useState(false);

  const [view, setView] = useState("cover");           // "cover" | "journal" | "reading"
  const [loadingAll, setLoadingAll] = useState(false);

  const [lightbox, setLightbox] = useState(null);
  const [toast, setToast] = useState("");
  const [booted, setBooted] = useState(false);
  const [storageMode, setStorageMode] = useState({ mode: "checking", detail: "" });

  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };

  /* boot: probe storage, then meta + which prompts have entries */
  useEffect(() => {
    (async () => {
      const probe = await probeStorage();
      USE_MEM = probe.mode === "memory";
      setStorageMode(probe);
      const m = await sGet("journal:meta");
      if (m) setMeta({ subject: m.subject || "", dedication: m.dedication || "" });
      const keys = await sList("e:");
      setAnswered(new Set(keys.map((k) => k.slice(2))));
      setBooted(true);
    })();
  }, []);

  const loadImagesFor = useCallback(async (entries) => {
    const ids = [];
    entries.forEach((en) => (en.imgs || []).forEach((id) => ids.push(id)));
    const missing = [...new Set(ids)].filter((id) => !images[id]);
    if (!missing.length) return;
    const got = await Promise.all(missing.map((id) => sGet("img:" + id)));
    setImages((prev) => {
      const next = { ...prev };
      missing.forEach((id, i) => { if (got[i]) next[id] = got[i]; });
      return next;
    });
  }, [images]);

  const loadSection = useCallback(async (sec, force) => {
    setLoadingSec(sec.id);
    const targets = sec.prompts.filter((p) => answered.has(p.id) && (force || !data[p.id]));
    if (targets.length) {
      const got = await Promise.all(targets.map((p) => sGet("e:" + p.id)));
      const next = {};
      targets.forEach((p, i) => { next[p.id] = got[i] || []; });
      setData((prev) => ({ ...prev, ...next }));
      await loadImagesFor(Object.values(next).flat());
    }
    setLoadingSec(null);
  }, [answered, data, loadImagesFor]);

  const toggleSection = (sec) => {
    if (open === sec.id) { setOpen(null); return; }
    setOpen(sec.id);
    setComposing(null);
    loadSection(sec, false);
  };

  /* ---------- composing ---------- */
  const startCompose = (pid) => {
    if (!me) { setNamingFor(pid); return; }
    setComposing(pid);
    setDraft({ text: "", links: [], docs: [], imgs: [] });
    setAttachMode(null);
  };

  const confirmName = () => {
    const n = nameDraft.trim();
    if (!n) return;
    setMe(n);
    const target = namingFor;
    setNamingFor(null);
    setNameDraft("");
    if (target && target !== "pill") {
      setComposing(target);
      setDraft({ text: "", links: [], docs: [], imgs: [] });
    }
  };

  const onPickPhotos = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4 - draft.imgs.length);
    e.target.value = "";
    for (const f of files) {
      try {
        const dataUrl = await compressImage(f);
        setDraft((d) => (d.imgs.length >= 4 ? d : { ...d, imgs: [...d.imgs, dataUrl] }));
      } catch { say("That photo could not be added."); }
    }
  };

  const addAttachment = () => {
    const u = attachDraft.u.trim();
    if (!u) return;
    const item = { u: normUrl(u), l: attachDraft.l.trim() || u };
    setDraft((d) =>
      attachMode === "link" ? { ...d, links: [...d.links, item] } : { ...d, docs: [...d.docs, item] }
    );
    setAttachDraft({ u: "", l: "" });
    setAttachMode(null);
  };

  const saveEntry = async (pid) => {
    const text = draft.text.trim();
    if (!text && !draft.imgs.length && !draft.links.length && !draft.docs.length) {
      say("Write a memory or attach something first."); return;
    }
    setBusy(true);
    try {
      const imgIds = [];
      for (const dataUrl of draft.imgs) {
        const id = uid();
        const ok = await sSet("img:" + id, dataUrl);
        if (ok) { imgIds.push(id); setImages((p) => ({ ...p, [id]: dataUrl })); }
      }
      const latest = (await sGet("e:" + pid)) || [];
      const entry = { id: uid(), a: me, t: text, ts: Date.now(), imgs: imgIds, links: draft.links, docs: draft.docs };
      const nextArr = [...latest, entry];
      const ok = await sSet("e:" + pid, nextArr);
      if (!ok) { say("Could not save. Check your connection and try again."); setBusy(false); return; }
      setData((p) => ({ ...p, [pid]: nextArr }));
      setAnswered((p) => new Set([...p, pid]));
      setComposing(null);
      setDraft({ text: "", links: [], docs: [], imgs: [] });
      say(USE_MEM ? "Added — test mode only. Publish to keep entries." : "Added to the journal.");
    } catch { say("Could not save. Try again."); }
    setBusy(false);
  };

  const removeEntry = async (pid, entry) => {
    if (!window.confirm("Remove this memory from the journal for everyone?")) return;
    setBusy(true);
    try {
      for (const id of entry.imgs || []) await sDel("img:" + id);
      const latest = (await sGet("e:" + pid)) || [];
      const nextArr = latest.filter((e) => e.id !== entry.id);
      if (nextArr.length) await sSet("e:" + pid, nextArr);
      else { await sDel("e:" + pid); setAnswered((p) => { const n = new Set(p); n.delete(pid); return n; }); }
      setData((p) => ({ ...p, [pid]: nextArr }));
      say("Removed.");
    } catch { say("Could not remove that. Try again."); }
    setBusy(false);
  };

  /* ---------- meta ---------- */
  const saveMeta = async () => {
    const next = { subject: metaDraft.subject.trim(), dedication: metaDraft.dedication.trim() };
    const ok = await sSet("journal:meta", next);
    if (ok) { setMeta(next); setEditingMeta(false); say(USE_MEM ? "Saved for this session (test mode)." : "Saved."); }
    else say("Could not save. Try again.");
  };

  /* ---------- reading view & backup ---------- */
  const [backingUp, setBackingUp] = useState(false);

  const loadEverything = async () => {
    const targets = [...answered].filter((pid) => !data[pid]);
    let merged = data;
    if (targets.length) {
      const got = await Promise.all(targets.map((pid) => sGet("e:" + pid)));
      const next = {};
      targets.forEach((pid, i) => { next[pid] = got[i] || []; });
      merged = { ...data, ...next };
      setData(merged);
    }
    const ids = [...new Set(Object.values(merged).flat().flatMap((en) => en.imgs || []))];
    const missing = ids.filter((id) => !images[id]);
    let imgMap = images;
    if (missing.length) {
      const got = await Promise.all(missing.map((id) => sGet("img:" + id)));
      imgMap = { ...images };
      missing.forEach((id, i) => { if (got[i]) imgMap[id] = got[i]; });
      setImages(imgMap);
    }
    return { entries: merged, imgs: imgMap };
  };

  const enterReading = async () => {
    setView("reading");
    setLoadingAll(true);
    await loadEverything();
    setLoadingAll(false);
  };

  const backup = async () => {
    setBackingUp(true);
    try {
      const { entries, imgs } = await loadEverything();
      const html = buildBackupHtml(entries, imgs, meta);
      const blob = new Blob([html], { type: "application/msword" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "Story-of-a-Life-Backup-" + new Date().toISOString().slice(0, 10) + ".doc";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      say("Backup downloaded. Keep a copy in Google Drive.");
    } catch (e) {
      say("Backup failed — try again.");
    }
    setBackingUp(false);
  };

  const sectionCount = (sec) => sec.prompts.filter((p) => answered.has(p.id)).length;

  /* ------------------------------ UI ------------------------------ */
  const EntryCard = ({ pid, entry, readOnly }) => (
    <div className="rounded-md px-4 py-3 mb-3" style={{ backgroundColor: C.field, border: "1px solid " + C.line }}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span style={{ ...serif, color: C.teal }} className="text-sm italic">{entry.a}</span>
        <span style={{ ...sans, color: C.soft }} className="text-xs">{fmtDate(entry.ts)}</span>
      </div>
      {entry.t ? (
        <p style={{ ...serif, color: C.ink, whiteSpace: "pre-wrap" }} className="text-base leading-relaxed mt-2">{entry.t}</p>
      ) : null}
      {(entry.imgs || []).length ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {entry.imgs.map((id) =>
            images[id] ? (
              <img key={id} src={images[id]} alt="Journal photo"
                onClick={() => setLightbox(images[id])}
                className="h-24 w-24 object-cover rounded cursor-pointer"
                style={{ border: "1px solid " + C.line }} />
            ) : (
              <div key={id} className="h-24 w-24 rounded flex items-center justify-center text-xs"
                style={{ backgroundColor: C.tint, color: C.soft, border: "1px solid " + C.line, ...sans }}>
                loading…
              </div>
            )
          )}
        </div>
      ) : null}
      {(entry.links || []).length ? (
        <div className="mt-3 space-y-1">
          {entry.links.map((l, i) => (
            <div key={i}>
              <a href={l.u} target="_blank" rel="noopener noreferrer"
                style={{ ...sans, color: C.teal }} className="text-sm underline break-all">↗ {l.l}</a>
            </div>
          ))}
        </div>
      ) : null}
      {(entry.docs || []).length ? (
        <div className="mt-2 space-y-1">
          {entry.docs.map((d, i) => (
            <div key={i}>
              <a href={d.u} target="_blank" rel="noopener noreferrer"
                style={{ ...sans, color: C.terra }} className="text-sm underline break-all">Document: {d.l}</a>
            </div>
          ))}
        </div>
      ) : null}
      {!readOnly && (
        <div className="mt-2 text-right">
          <button onClick={() => removeEntry(pid, entry)} disabled={busy}
            style={{ ...sans, color: C.soft }} className="text-xs underline hover:opacity-70 disabled:opacity-40">
            Remove
          </button>
        </div>
      )}
    </div>
  );

  const Composer = ({ prompt }) => (
    <div className="rounded-md p-3 mt-1 mb-3" style={{ backgroundColor: C.tint, border: "1px solid " + C.line }}>
      <textarea
        autoFocus
        spellCheck={true}
        rows={prompt.short ? 2 : 5}
        value={draft.text}
        onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
        placeholder={prompt.short ? "Your answer…" : "Write the memory in your own words…"}
        className="w-full rounded-md p-3 text-base leading-relaxed focus:outline-none focus-visible:ring-2 resize-y"
        style={{ ...serif, backgroundColor: C.field, color: C.ink, border: "1px solid " + C.line }}
      />
      {draft.imgs.length ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {draft.imgs.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt="To attach" className="h-16 w-16 object-cover rounded" style={{ border: "1px solid " + C.line }} />
              <button onClick={() => setDraft((d) => ({ ...d, imgs: d.imgs.filter((_, j) => j !== i) }))}
                aria-label="Remove photo"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs"
                style={{ backgroundColor: C.ink, color: C.paper }}>✕</button>
            </div>
          ))}
        </div>
      ) : null}
      {(draft.links.length || draft.docs.length) ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {draft.links.map((l, i) => (
            <Chip key={"l" + i} label={"↗ " + l.l}
              onRemove={() => setDraft((d) => ({ ...d, links: d.links.filter((_, j) => j !== i) }))} />
          ))}
          {draft.docs.map((d0, i) => (
            <Chip key={"d" + i} label={"Doc: " + d0.l}
              onRemove={() => setDraft((d) => ({ ...d, docs: d.docs.filter((_, j) => j !== i) }))} />
          ))}
        </div>
      ) : null}

      {attachMode ? (
        <div className="mt-3 space-y-2">
          <input
            spellCheck={false}
            value={attachDraft.u}
            onChange={(e) => setAttachDraft((a) => ({ ...a, u: e.target.value }))}
            placeholder={attachMode === "link" ? "Paste a web link (https://…)" : "Paste a document link (Drive, Dropbox, iCloud…)"}
            className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2"
            style={{ ...sans, backgroundColor: C.field, color: C.ink, border: "1px solid " + C.line }}
          />
          <input
            spellCheck={true}
            value={attachDraft.l}
            onChange={(e) => setAttachDraft((a) => ({ ...a, l: e.target.value }))}
            placeholder="What is it? (a short label)"
            className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2"
            style={{ ...sans, backgroundColor: C.field, color: C.ink, border: "1px solid " + C.line }}
          />
          <div className="flex gap-2">
            <Btn kind="line" small onClick={addAttachment}>Attach</Btn>
            <Btn small onClick={() => { setAttachMode(null); setAttachDraft({ u: "", l: "" }); }}>Cancel</Btn>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <label htmlFor={"ph-" + prompt.id}
            className="px-3 py-1 text-xs rounded-full cursor-pointer hover:opacity-80"
            style={{ ...sans, color: C.teal, border: "1px solid " + C.teal }}>
            + Photo{draft.imgs.length ? ` (${draft.imgs.length}/4)` : ""}
          </label>
          <input id={"ph-" + prompt.id} type="file" accept="image/*" multiple onChange={onPickPhotos} className="hidden" />
          <Btn kind="line" small onClick={() => setAttachMode("link")}>+ Link</Btn>
          <Btn kind="line" small onClick={() => setAttachMode("doc")}>+ Document</Btn>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        <Btn kind="solid" onClick={() => saveEntry(prompt.id)} disabled={busy}>
          {busy ? "Saving…" : "Add to the journal"}
        </Btn>
        <Btn onClick={() => setComposing(null)} disabled={busy}>Cancel</Btn>
      </div>
      <p className="text-xs mt-2" style={{ ...sans, color: C.soft }}>
        Spell check is on — misspellings get the squiggly underline as you type.
      </p>
    </div>
  );

  const NameCard = () => (
    <div className="rounded-md p-4 my-3" style={{ backgroundColor: C.tint, border: "1px solid " + C.line }}>
      <p style={{ ...serif, color: C.ink }} className="text-base mb-2">First — who is writing?</p>
      <div className="flex gap-2 flex-wrap">
        <input
          autoFocus
          spellCheck={false}
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") confirmName(); }}
          placeholder="Your name"
          className="flex-1 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2"
          style={{ ...sans, minWidth: 160, backgroundColor: C.field, color: C.ink, border: "1px solid " + C.line }}
        />
        <Btn kind="solid" onClick={confirmName}>That is me</Btn>
        <Btn onClick={() => setNamingFor(null)}>Cancel</Btn>
      </div>
      <p className="text-xs mt-2" style={{ ...sans, color: C.soft }}>
        Your name is signed under each memory you add.
      </p>
    </div>
  );

  /* -------------------------- cover -------------------------- */
  if (view === "cover") {
    const CV = "#F4EEDD";
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: "#22423D" }}>
        <div className="relative w-full max-w-md text-center px-6 py-12"
          style={{ border: "1px solid rgba(244,238,221,0.5)", outline: "1px solid rgba(244,238,221,0.22)", outlineOffset: "-8px" }}>
          <span className="absolute" style={{ top: -5, left: -5 }}><Diamond size={9} color="#C67B5C" /></span>
          <span className="absolute" style={{ top: -5, right: -5 }}><Diamond size={9} color="#C67B5C" /></span>
          <span className="absolute" style={{ bottom: -5, left: -5 }}><Diamond size={9} color="#C67B5C" /></span>
          <span className="absolute" style={{ bottom: -5, right: -5 }}><Diamond size={9} color="#C67B5C" /></span>
          <div className="flex justify-center mb-6"><TreeEmblem /></div>
          <p style={{ ...sans, color: "rgba(244,238,221,0.7)", letterSpacing: "0.3em" }} className="text-xs">
            A GUIDED LEGACY JOURNAL
          </p>
          <h1 style={{ ...serif, color: CV }} className="text-4xl mt-3">The Story of a Life</h1>
          <p style={{ ...serif, color: "rgba(244,238,221,0.85)" }} className="italic mt-3 text-lg">
            {meta.subject ? "The life of " + meta.subject : "One life, many voices"}
          </p>
          <div className="flex items-center justify-center gap-3 my-6" aria-hidden="true">
            <span style={{ height: 1, width: 60, backgroundColor: "#C67B5C" }} />
            <Diamond color="#C67B5C" />
            <span style={{ height: 1, width: 60, backgroundColor: "#C67B5C" }} />
          </div>
          <button
            onClick={() => setView("journal")}
            className="px-6 py-2 rounded-full text-sm hover:opacity-85 focus:outline-none focus-visible:ring-2"
            style={{ ...sans, color: CV, border: "1px solid rgba(244,238,221,0.8)", background: "transparent", letterSpacing: "0.05em", cursor: "pointer" }}
          >
            Open the journal
          </button>
          <p style={{ ...serif, color: "rgba(244,238,221,0.55)" }} className="italic text-xs mt-8">
            Every memory added here is signed and kept.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------- reading view ------------------------- */
  if (view === "reading") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: C.paper }}>
        <div className="max-w-2xl mx-auto px-5 py-10">
          <div className="flex items-center justify-between mb-6">
            <Btn kind="line" small onClick={() => setView("journal")}>← Back to writing</Btn>
            <Btn kind="solid" small onClick={() => window.print()}>Print</Btn>
          </div>
          <div className="text-center mb-2">
            <p style={{ ...sans, color: C.soft, letterSpacing: "0.25em" }} className="text-xs">A GUIDED LEGACY JOURNAL</p>
            <h1 style={{ ...serif, color: C.teal }} className="text-4xl mt-2">The Story of a Life</h1>
            {meta.subject ? (
              <p style={{ ...serif, color: C.ink }} className="italic mt-2">The life of {meta.subject}</p>
            ) : null}
            {meta.dedication ? (
              <p style={{ ...serif, color: C.soft }} className="italic text-sm mt-1">{meta.dedication}</p>
            ) : null}
            <Ornament />
          </div>
          {loadingAll ? (
            <p className="text-center text-sm py-10" style={{ ...sans, color: C.soft }}>Gathering the pages…</p>
          ) : answered.size === 0 ? (
            <p className="text-center py-10" style={{ ...serif, color: C.soft }}>
              Nothing has been written yet. The first memory is waiting for you.
            </p>
          ) : (
            SECTIONS.map((sec) =>
              sectionCount(sec) === 0 ? null : (
                <div key={sec.id} className="mt-10">
                  <div className="text-center">
                    <h2 style={{ ...serif, color: C.teal }} className="text-2xl">{sec.title}</h2>
                    <Ornament />
                  </div>
                  {sec.prompts.map((p) =>
                    !answered.has(p.id) || !(data[p.id] || []).length ? null : (
                      <div key={p.id} className="mt-6">
                        <p style={{ ...serif, color: C.ink }} className="italic mb-2">{p.q}</p>
                        {(data[p.id] || []).map((en) => (
                          <EntryCard key={en.id} pid={p.id} entry={en} readOnly />
                        ))}
                      </div>
                    )
                  )}
                </div>
              )
            )
          )}
          <div className="text-center mt-14 mb-6">
            <Ornament />
            <p style={{ ...serif, color: C.soft }} className="italic text-sm">
              A life, set down in our own words.
            </p>
          </div>
        </div>
        {lightbox && (
          <div onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
            style={{ backgroundColor: "rgba(20,16,10,0.85)" }}>
            <img src={lightbox} alt="Journal photo, enlarged" className="max-h-full max-w-full rounded" />
          </div>
        )}
      </div>
    );
  }

  /* ------------------------- journal view ------------------------- */
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.paper }}>
      <div className="max-w-2xl mx-auto px-5 py-10">
        {/* masthead */}
        <div className="text-center">
          <p style={{ ...sans, color: C.soft, letterSpacing: "0.25em" }} className="text-xs">A GUIDED LEGACY JOURNAL</p>
          <h1 style={{ ...serif, color: C.teal }} className="text-4xl sm:text-5xl mt-2">The Story of a Life</h1>
          {editingMeta ? (
            <div className="max-w-md mx-auto mt-4 space-y-2 text-left">
              <input
                spellCheck={true}
                value={metaDraft.subject}
                onChange={(e) => setMetaDraft((m) => ({ ...m, subject: e.target.value }))}
                placeholder="Whose life is this? (e.g., Grandma June)"
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2"
                style={{ ...sans, backgroundColor: C.field, color: C.ink, border: "1px solid " + C.line }}
              />
              <input
                spellCheck={true}
                value={metaDraft.dedication}
                onChange={(e) => setMetaDraft((m) => ({ ...m, dedication: e.target.value }))}
                placeholder="A dedication line (optional)"
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2"
                style={{ ...sans, backgroundColor: C.field, color: C.ink, border: "1px solid " + C.line }}
              />
              <div className="flex gap-2 justify-center pt-1">
                <Btn kind="solid" small onClick={saveMeta}>Save</Btn>
                <Btn small onClick={() => setEditingMeta(false)}>Cancel</Btn>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setMetaDraft({ subject: meta.subject, dedication: meta.dedication }); setEditingMeta(true); }}
              className="mt-2 hover:opacity-75 focus:outline-none focus-visible:ring-2"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ ...serif, color: C.ink }} className="italic text-lg">
                {meta.subject ? "The life of " + meta.subject : "Tap to name whose life this is"}
              </span>
              {meta.dedication ? (
                <span style={{ ...serif, color: C.soft }} className="block italic text-sm mt-1">{meta.dedication}</span>
              ) : null}
            </button>
          )}
          <Ornament />
          <p style={{ ...serif, color: C.soft }} className="text-sm italic max-w-md mx-auto">
            One life, many voices. Open a chapter, add a memory, a photo, a link — every
            contribution is signed and kept.
          </p>
        </div>

        {/* toolbar */}
        <div className="flex items-center justify-between gap-2 mt-6 mb-4 flex-wrap">
          <button
            onClick={() => { setNameDraft(me); setNamingFor("pill"); }}
            className="text-xs px-3 py-1 rounded-full hover:opacity-80 focus:outline-none focus-visible:ring-2"
            style={{ ...sans, color: C.teal, border: "1px solid " + C.line, backgroundColor: C.field }}
          >
            {me ? "Writing as " + me + " · change" : "Set your name"}
          </button>
          <div className="flex items-center gap-2">
            <Btn kind="line" small onClick={backup} disabled={backingUp}>
              {backingUp ? "Backing up…" : "Back up"}
            </Btn>
            <Btn kind="line" small onClick={enterReading}>Read the whole journal</Btn>
          </div>
        </div>

        {storageMode.mode === "memory" && (
          <div className="rounded-md px-4 py-3 mb-3" style={{ backgroundColor: C.tint, border: "1px solid " + C.terra }}>
            <p style={{ ...sans, color: C.ink }} className="text-xs leading-relaxed">
              <span style={{ color: C.terra }}>Test mode. </span>
              Permanent saving only works on the published version of this artifact, so entries here
              last for this session only. Tap Share, publish it, then open the published link — saving
              turns on there, and that link is the one to send the family.
            </p>
          </div>
        )}

        {namingFor === "pill" && NameCard()}
        {!booted && (
          <p className="text-center text-sm py-8" style={{ ...sans, color: C.soft }}>Opening the journal…</p>
        )}

        {/* chapters */}
        {booted && (
          <div className="mt-2" style={{ borderTop: "1px solid " + C.line }}>
            {SECTIONS.map((sec, si) => {
              const isOpen = open === sec.id;
              const count = sectionCount(sec);
              return (
                <div key={sec.id} style={{ borderBottom: "1px solid " + C.line }}>
                  <button
                    onClick={() => toggleSection(sec)}
                    className="w-full flex items-center gap-3 py-4 text-left hover:opacity-80 focus:outline-none focus-visible:ring-2"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <Diamond color={count ? C.terra : C.line} />
                    <span style={{ ...serif, color: C.teal }} className="text-lg flex-1">{sec.title}</span>
                    <span style={{ ...sans, color: C.soft }} className="text-xs">
                      {count ? count + " answered" : ""}
                    </span>
                    <span style={{ ...sans, color: C.soft }} aria-hidden="true">{isOpen ? "–" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ ...sans, color: C.soft, letterSpacing: "0.2em" }} className="text-xs">
                          {"SECTION " + (si + 1)}
                        </span>
                        <button onClick={() => loadSection(sec, true)}
                          className="text-xs underline hover:opacity-70 focus:outline-none"
                          style={{ ...sans, color: C.soft, background: "none", border: "none", cursor: "pointer" }}>
                          {loadingSec === sec.id ? "Refreshing…" : "Refresh"}
                        </button>
                      </div>

                      {sec.prompts.map((p) => (
                        <div key={p.id} className="mt-5">
                          <p style={{ ...serif, color: C.ink }} className="italic text-base leading-snug">{p.q}</p>
                          <div className="mt-2">
                            {loadingSec === sec.id && answered.has(p.id) && !data[p.id] ? (
                              <p className="text-xs" style={{ ...sans, color: C.soft }}>Loading memories…</p>
                            ) : (
                              (data[p.id] || []).map((en) => <EntryCard key={en.id} pid={p.id} entry={en} />)
                            )}
                            {namingFor === p.id && NameCard()}
                            {composing === p.id ? (
                              Composer({ prompt: p })
                            ) : namingFor === p.id ? null : (
                              <button
                                onClick={() => startCompose(p.id)}
                                className="text-sm underline hover:opacity-70 focus:outline-none"
                                style={{ ...sans, color: C.teal, background: "none", border: "none", cursor: "pointer" }}
                              >
                                {(data[p.id] || []).length ? "+ Add another memory" : "+ Be the first to answer"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs mt-8" style={{ ...sans, color: C.soft }}>
          Shared journal — everyone with this link can read and add to everything here.
          Photos are stored small; attach documents as links from Drive, Dropbox, or iCloud.
          Tap Back up any time to download a Word-ready copy with every photo inside.
        </p>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
          style={{ backgroundColor: "rgba(20,16,10,0.85)" }}>
          <img src={lightbox} alt="Journal photo, enlarged" className="max-h-full max-w-full rounded" />
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm shadow-md"
          style={{ ...sans, backgroundColor: C.ink, color: C.paper }}>
          {toast}
        </div>
      )}
    </div>
  );
}
