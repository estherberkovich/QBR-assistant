import React, { useState, useMemo, useEffect } from "react";
import { FileText, Sparkles, Loader2, TrendingUp, AlertTriangle, ArrowRight, Target, Eraser, RotateCcw, Plus, Trash2, X } from "lucide-react";

// ---------------------------------------------------------------------------
// DESIGN TOKENS — "executive report" direction: the QBR is literally a
// formal document, so the design leans into that — a warm paper background,
// a serif display face for an editorial/cover-page feel, and a deep-ink
// header band, rather than a generic SaaS dashboard look.
// Paper #FAF8F4 / Panel #FFFFFF / Ink #1B2340 / Text #2A2E3A / Muted #7C8091
// Fintech (Cobalt) #3454D1 / SaaS (Jade) #0F9B8E / IT (Ember) #C2540C
// Healthy #1E8E5A / Watch #C2790C / Risk #C23B3B
// Display: Fraunces. Body: Inter. Data: JetBrains Mono.
// ---------------------------------------------------------------------------

const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";

const INK = "#1B2340";
const TEXT = "#2A2E3A";
const MUTED = "#7C8091";
const BORDER = "#E7E2D8";
const PAPER = "#FAF8F4";
const HEALTHY = "#1E8E5A";
const WATCH = "#C2790C";
const RISK = "#C23B3B";

const TIER_OPTIONS = ["SMB", "Team", "Mid-Market", "Business", "Enterprise"];

const SECTORS = {
  fintech: {
    label: "Fintech / Payments",
    accent: "#3454D1",
    accounts: [
      {
        id: "fx1", name: "Northgate Retail Group", tier: "Enterprise", value: 480000,
        metricsLine: "Authorization rate 91% · Txn volume -12% (90d) · Integration health 78% · 2 open incidents",
        rawNotes: "call w/ their eng lead + ops mgr. they're annoyed about 3DS2 migration, said ticket volume went up a lot since. auth rate still ok but volume down. asked about our fraud tooling roadmap. mentioned competitor reached out to them last month (didn't say which one). renewal isn't until Q3 next year but they want a technical deep dive session in the next 2 weeks.",
      },
      {
        id: "fx2", name: "Bloom & Co Marketplace", tier: "Mid-Market", value: 156000,
        metricsLine: "Authorization rate 96% · Txn volume +18% (90d) · Integration health 95% · 0 open incidents",
        rawNotes: "great call, very positive energy. they're expanding into EU next month, want to know what we need from them for EU checkout flow / local payment methods. CFO was on the call, seemed impressed with our authorization rates vs their old provider. no complaints at all. asked if there's a loyalty/referral program.",
      },
      {
        id: "fx3", name: "Verdant Mobility", tier: "Enterprise", value: 610000,
        metricsLine: "Authorization rate 79% · Txn volume -24% (90d) · Integration health 52% · 4 open incidents",
        rawNotes: "rough call. CTO escalated twice this month about failed payout batches, second time in front of his VP of finance. very frustrated tone. said if this happens again in Q3 they will start evaluating other providers formally, this is a direct quote basically. volume down a lot too, not sure if related to the incidents or something else on their end. need eng team to jump on this asap, this is our biggest account by contract value.",
      },
      {
        id: "fx4", name: "Solace Subscriptions", tier: "SMB", value: 42000,
        metricsLine: "Authorization rate 93% · Txn volume +4% (90d) · Integration health 88% · 0 open incidents",
        rawNotes: "quick 15 min check-in, nothing major. everything stable, they're happy. mentioned maybe adding a second product line next year but very early stage thinking, nothing concrete. low touch account, no action needed right now.",
      },
      {
        id: "fx5", name: "Ferro Industrial Supply", tier: "Mid-Market", value: 210000,
        metricsLine: "Authorization rate 84% · Txn volume -9% (90d) · Integration health 61% · 3 open incidents",
        rawNotes: "found out their Head of Payments (our main champion) left the company, nobody told us. talked to someone from procurement instead who didn't seem to know much about the account history. renewal is in 45 days. need to figure out who the new decision maker is fast. auth rate and integration health both declining but nobody flagged why on their side.",
      },
    ],
  },
  saas: {
    label: "SaaS Product",
    accent: "#0F9B8E",
    accounts: [
      {
        id: "sa1", name: "Wavelength Studios", tier: "Team", value: 18000,
        metricsLine: "Feature adoption 82% · Weekly active 76% · NPS 62 · Seat utilization 88%",
        rawNotes: "super happy customer, they love the new AI editing suite, said it cut their post-production time in half. asked if we have an enterprise tier since they might grow their team. want to be considered for case study / customer spotlight. no complaints. good candidate for expansion conversation next quarter.",
      },
      {
        id: "sa2", name: "Anchor Point Media", tier: "Business", value: 54000,
        metricsLine: "Feature adoption 34% · Weekly active 40% · NPS 12 · Seat utilization 45%",
        rawNotes: "hard to get this call scheduled, took 3 reschedules. only 2 people showed up out of the usual 4. said they've been 'busy' and haven't had time to fully roll it out to the team. seemed lukewarm on the product overall, didn't really engage when I walked through new features. 9 of 12 seats basically unused. worried about this one honestly.",
      },
      {
        id: "sa3", name: "Kepler Podcast Network", tier: "Team", value: 22000,
        metricsLine: "Feature adoption 71% · Weekly active 68% · NPS 45 · Seat utilization 79%",
        rawNotes: "good engaged call. they asked specifically about API access to plug our tool into their internal publishing pipeline — sounded like a real technical need, not just curiosity. usage trending up steadily. mentioned they're hiring 2 more producers next quarter which could mean more seats.",
      },
      {
        id: "sa4", name: "Fernway Learning", tier: "Business", value: 61000,
        metricsLine: "Feature adoption 28% · Weekly active 22% · NPS -8 · Seat utilization 31%",
        rawNotes: "tense call. they brought up 2 support tickets about export quality that have been open for 3+ weeks with no resolution, very frustrated about it. renewal is in 30 days and they were pretty direct that they're 'not sure yet' if they're renewing. need to get those tickets fixed immediately and probably loop in a manager for a save conversation before the renewal date.",
      },
      {
        id: "sa5", name: "Mosaic Creator Collective", tier: "Team", value: 15000,
        metricsLine: "Feature adoption 74% · Weekly active 70% · NPS 51 · Seat utilization 82%",
        rawNotes: "easy, pleasant call. steady usage, no issues raised. they mentioned liking the recent UI update. good potential case study candidate, said they'd be open to a short testimonial video.",
      },
    ],
  },
  it: {
    label: "Enterprise IT / ITSM",
    accent: "#C2540C",
    accounts: [
      {
        id: "it1", name: "Cardinal Health Systems", tier: "Enterprise", value: 320000,
        metricsLine: "SLA compliance 97% · Automation adoption 64% · CSAT 92% · 8 open tickets",
        rawNotes: "great strategic call with their IT director. they're rolling out our AI agent for L1 ticket triage across 3 more departments next quarter. very engaged, asked good questions about governance/audit trail for the AI actions. this feels like a strong expansion + potential reference customer.",
      },
      {
        id: "it2", name: "Union Freight Logistics", tier: "Mid-Market", value: 98000,
        metricsLine: "SLA compliance 81% · Automation adoption 22% · CSAT 68% · 41 open tickets",
        rawNotes: "their sysadmin who managed our platform left back in Q2 and was never replaced. whoever is covering now is clearly overwhelmed, backlog has piled up (41 tickets open, was ~15 a few months ago). automation adoption very low, they never got proper onboarding on it. this is becoming a churn risk if nothing changes before renewal.",
      },
      {
        id: "it3", name: "Greystone Municipal Services", tier: "Enterprise", value: 275000,
        metricsLine: "SLA compliance 92% · Automation adoption 48% · CSAT 85% · 15 open tickets",
        rawNotes: "solid, professional call. mentioned their procurement cycle for renewal starts next quarter and it involves a formal review committee, not just their day-to-day contact. asked for materials/documentation we can provide ahead of that process. nothing urgent, just need to prep the right documentation in advance.",
      },
      {
        id: "it4", name: "Bramwell School District", tier: "Mid-Market", value: 64000,
        metricsLine: "SLA compliance 71% · Automation adoption 9% · CSAT 54% · 57 open tickets",
        rawNotes: "no-show on the call, second one in a row. IT director hasn't responded to email or calls in over 2 months. ticket backlog is the worst in the portfolio. this account is going dark, need to try a different contact or escalate before we just lose them silently.",
      },
      {
        id: "it5", name: "Palisade Financial Group", tier: "Enterprise", value: 410000,
        metricsLine: "SLA compliance 98% · Automation adoption 71% · CSAT 94% · 4 open tickets",
        rawNotes: "excellent call, no issues at all. they mentioned being open to being a reference customer or speaking at an upcoming user conference. strongest account in the book right now, worth nominating for the customer advisory board.",
      },
    ],
  },
};

const FALLBACK_QBR = {
  fx1: { executiveSummary: "Northgate remains a stable enterprise account, but friction from the 3DS2 migration has raised support volume and a competitor has reportedly made contact. A technical deep dive in the next two weeks is the right move to reinforce the relationship ahead of the Q3 renewal window.", wins: ["Authorization rate holding steady at 91% despite the migration", "Client proactively requesting a technical deep dive rather than escalating externally"], risks: ["Elevated support ticket volume since the 3DS2 migration", "Competitor outreach mentioned, though unconfirmed which vendor"], nextSteps: ["Schedule the requested technical deep dive within two weeks", "Share the fraud tooling roadmap to reinforce platform investment", "Monitor ticket volume trend over the next 30 days"], outlook: "On track, but requires proactive reinforcement before Q3 renewal." },
  fx2: { executiveSummary: "Bloom & Co is a model account: strong metrics across the board, high executive engagement, and an active EU expansion in motion. This is a clear near-term expansion opportunity rather than a retention concern.", wins: ["18% transaction volume growth in 90 days", "CFO directly engaged and impressed with authorization performance"], risks: ["None identified this cycle"], nextSteps: ["Provide EU checkout / local payment method requirements ahead of their expansion", "Explore a referral or loyalty program request", "Position for a case study given the strong metrics"], outlook: "Strong expansion candidate — prioritize a growth conversation." },
  fx3: { executiveSummary: "Verdant Mobility is the highest-risk account in the portfolio. Two escalated payout failures this month, visible to their VP of Finance, combined with a 24% volume decline, put this enterprise relationship at real risk ahead of Q3.", wins: ["None this cycle — call was primarily escalation-driven"], risks: ["Two payout batch failures escalated by the CTO within one month", "24% transaction volume decline, cause not yet confirmed", "Explicit signal that continued incidents will trigger a formal vendor evaluation"], nextSteps: ["Engineering to prioritize root-cause analysis on the payout failures immediately", "Schedule an executive-to-executive call before the next billing cycle", "Investigate the volume decline in parallel with the incident review"], outlook: "At risk. This is the top escalation priority in the book this quarter." },
  fx4: { executiveSummary: "Solace remains a stable, low-maintenance account with no open issues. A possible second product line was mentioned but is early-stage and not yet actionable.", wins: ["Consistent performance with no incidents", "Early signal of a potential second product line next year"], risks: ["None identified this cycle"], nextSteps: ["No immediate action required", "Revisit the second product line conversation next quarter"], outlook: "Healthy, low-touch — maintain standard cadence." },
  fx5: { executiveSummary: "Ferro's primary champion has left the company without notice, and the interim procurement contact lacks account history. With renewal in 45 days and declining authorization and integration metrics, re-establishing a relationship with a decision-maker is urgent.", wins: ["None this cycle"], risks: ["Loss of primary champion ahead of renewal", "Declining authorization rate and integration health with no clear internal owner", "New contact unfamiliar with account history"], nextSteps: ["Identify and engage the new decision-maker within the next two weeks", "Prepare a fresh account summary/value recap for the new contact", "Investigate the cause of declining integration health"], outlook: "At risk due to relationship gap — renewal timeline is tight." },
  sa1: { executiveSummary: "Wavelength Studios is a highly engaged, satisfied account showing strong usage of the new AI editing suite and real interest in growing their footprint. This is a well-positioned expansion opportunity.", wins: ["AI editing suite cut post-production time significantly, per the client", "Client requested consideration for a case study"], risks: ["None identified this cycle"], nextSteps: ["Scope an enterprise tier conversation given their growth signal", "Move forward on the case study / customer spotlight request"], outlook: "Strong expansion candidate for next quarter." },
  sa2: { executiveSummary: "Anchor Point Media shows clear disengagement: low meeting attendance, minimal feature rollout to the wider team, and 9 of 12 seats inactive. This account needs a structured re-engagement plan before it becomes a renewal risk.", wins: ["None this cycle"], risks: ["Scheduling difficulty and low attendance suggest disengagement", "Only 3 of 12 seats actively used", "Lukewarm response to new feature walkthrough"], nextSteps: ["Propose a structured onboarding refresh for the unused seats", "Identify a more engaged internal champion", "Reassess seat count realistically ahead of any renewal conversation"], outlook: "At risk — usage trend needs to reverse before renewal." },
  sa3: { executiveSummary: "Kepler is trending positively, with a concrete technical request for API access that signals deeper product integration, alongside plans to grow their team.", wins: ["Engaged, well-attended call with steady usage growth", "Concrete API access request tied to a real internal use case"], risks: ["None identified this cycle"], nextSteps: ["Follow up on the API access request with the product/eng team", "Track upcoming hiring as a potential seat expansion trigger"], outlook: "Healthy and trending toward expansion." },
  sa4: { executiveSummary: "Fernway Learning is at serious renewal risk. Two unresolved support tickets have created real frustration, and the client was explicit about being undecided on renewal, due in 30 days.", wins: ["None this cycle — call was primarily issue-driven"], risks: ["Two export quality tickets open 3+ weeks with no resolution", "Client explicitly non-committal on renewal", "Usage metrics declining across the board"], nextSteps: ["Escalate and resolve the open support tickets immediately", "Loop in a manager for a dedicated save conversation", "Prepare a renewal-risk brief ahead of the 30-day deadline"], outlook: "High risk — renewal outcome is genuinely uncertain." },
  sa5: { executiveSummary: "Mosaic remains a steady, satisfied account with positive feedback on the recent UI update and openness to a testimonial.", wins: ["Positive reaction to the recent UI update", "Open to providing a testimonial video"], risks: ["None identified this cycle"], nextSteps: ["Follow up to schedule the testimonial", "Maintain standard check-in cadence"], outlook: "Healthy — good advocacy candidate." },
  it1: { executiveSummary: "Cardinal Health Systems is expanding its use of the AI ticket-triage agent to three additional departments, with strong engagement on governance questions. This is a strategic account moving toward reference-customer status.", wins: ["Expansion of the AI agent rollout across additional departments", "High engagement on governance and audit-trail questions signals serious evaluation"], risks: ["None identified this cycle"], nextSteps: ["Support the multi-department rollout with dedicated resources", "Formally propose reference customer / case study participation"], outlook: "Strong expansion and advocacy opportunity." },
  it2: { executiveSummary: "Union Freight's ticket backlog has nearly tripled since their platform administrator departed in Q2 without replacement. Automation adoption remains minimal due to incomplete onboarding, putting this account at growing risk.", wins: ["None this cycle"], risks: ["Backlog grew from ~15 to 41 open tickets since Q2", "No dedicated administrator on the client side", "Automation never properly onboarded, leaving manual workload high"], nextSteps: ["Offer a focused automation onboarding session to reduce manual load", "Help the client identify or train a new platform administrator", "Reassess health closely ahead of renewal"], outlook: "At risk — operational gap on the client side is the root cause." },
  it3: { executiveSummary: "Greystone remains stable and professional, with their upcoming renewal set to go through a formal procurement committee. Preparing documentation in advance is the key action this cycle.", wins: ["Stable metrics and proactive renewal planning from the client"], risks: ["Formal procurement/committee process adds renewal complexity"], nextSteps: ["Prepare ROI and value documentation ahead of the procurement cycle", "Identify committee stakeholders beyond the day-to-day contact"], outlook: "On track, pending a more formal renewal process." },
  it4: { executiveSummary: "Bramwell School District has gone silent, missing two consecutive calls with no response from their IT director in over two months. Combined with the worst ticket backlog in the portfolio, this account is at high risk of silent churn.", wins: ["None this cycle"], risks: ["No client contact in over 60 days", "Largest ticket backlog in the portfolio (57 open)", "Two consecutive missed meetings"], nextSteps: ["Attempt outreach through an alternate contact or escalation path", "Prepare for the possibility this account is already disengaging", "Document outreach attempts for renewal risk tracking"], outlook: "High risk of silent churn — immediate alternate outreach needed." },
  it5: { executiveSummary: "Palisade Financial remains the strongest account in the portfolio, with excellent metrics and openness to a reference or speaking role. This is a clear advocacy opportunity.", wins: ["No issues raised; consistently excellent metrics", "Open to reference customer status and conference speaking"], risks: ["None identified this cycle"], nextSteps: ["Nominate for the customer advisory board", "Coordinate on a potential conference speaking opportunity"], outlook: "Excellent health — prioritize as a flagship advocate." },
};

const STORAGE_KEY = "qbr-custom-accounts";

// ---------------------------------------------------------------------------
// UI PIECES
// ---------------------------------------------------------------------------

function Section({ icon: Icon, title, accent, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon size={15} color={accent} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: INK, letterSpacing: 0.6, textTransform: "uppercase" }}>
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, accent }) {
  if (!items || items.length === 0 || (items.length === 1 && /none/i.test(items[0]))) {
    return <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: MUTED, fontStyle: "italic" }}>None this cycle.</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, marginTop: 6, flexShrink: 0 }} />
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function AddAccountForm({ sectorKey, accent, onCancel, onSave }) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState(TIER_OPTIONS[0]);
  const [value, setValue] = useState("");
  const [metricsLine, setMetricsLine] = useState("");
  const [rawNotes, setRawNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const canSave = name.trim() && metricsLine.trim();

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    await onSave({
      id: `custom-${Date.now()}`,
      sectorKey,
      name: name.trim(),
      tier,
      value: Number(value) || 0,
      metricsLine: metricsLine.trim(),
      rawNotes: rawNotes.trim(),
      isCustom: true,
    });
    setSaving(false);
  }

  const fieldStyle = {
    width: "100%", background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 6,
    padding: "9px 10px", color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: 13,
  };
  const labelStyle = { fontFamily: "'Inter', sans-serif", fontSize: 10, color: MUTED, display: "block", marginBottom: 5, letterSpacing: 0.4, textTransform: "uppercase" };

  return (
    <div style={{ background: "#FFFFFF", border: `1px dashed ${accent}`, borderRadius: 10, padding: 18, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: INK }}>New account</div>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <label style={labelStyle}>Account name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Halcyon Freight Co" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Tier</label>
          <select value={tier} onChange={(e) => setTier(e.target.value)} style={fieldStyle}>
            {TIER_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Contract value ($)</label>
          <input value={value} onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))} placeholder="120000" style={fieldStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>Key metrics (free text — this feeds the AI summary)</label>
        <input value={metricsLine} onChange={(e) => setMetricsLine(e.target.value)} placeholder="e.g. SLA compliance 88% · CSAT 76% · 12 open tickets" style={fieldStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Raw meeting notes (optional, can add later)</label>
        <textarea value={rawNotes} onChange={(e) => setRawNotes(e.target.value)} rows={3} placeholder="Paste or type notes from your first call with this account…" style={{ ...fieldStyle, resize: "vertical" }} />
      </div>

      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        style={{
          display: "flex", alignItems: "center", gap: 6, background: canSave ? accent : "#D1D5DB",
          color: "#FFFFFF", border: "none", borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600,
          cursor: canSave && !saving ? "pointer" : "default", fontFamily: "'Inter', sans-serif",
        }}
      >
        {saving ? <Loader2 size={13} className="spin" /> : <Plus size={13} />}
        {saving ? "Saving…" : "Save account"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN APP
// ---------------------------------------------------------------------------

export default function QBRAssistant() {
  const [sectorKey, setSectorKey] = useState("fintech");
  const [customAccounts, setCustomAccounts] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [accountId, setAccountId] = useState(SECTORS.fintech.accounts[0].id);
  const [notes, setNotes] = useState(SECTORS.fintech.accounts[0].rawNotes);
  const [qbr, setQbr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        if (result && result.value) setCustomAccounts(JSON.parse(result.value));
      } catch (e) {
        // key doesn't exist yet — fine, start empty
      } finally {
        setStorageReady(true);
      }
    })();
  }, []);

  const sector = SECTORS[sectorKey];
  const allAccountsInSector = useMemo(
    () => [...sector.accounts, ...customAccounts.filter((a) => a.sectorKey === sectorKey)],
    [sector, customAccounts, sectorKey]
  );
  const account = useMemo(
    () => allAccountsInSector.find((a) => a.id === accountId) || allAccountsInSector[0],
    [allAccountsInSector, accountId]
  );

  function handleSectorChange(key) {
    setSectorKey(key);
    const firstAccount = SECTORS[key].accounts[0];
    setAccountId(firstAccount.id);
    setNotes(firstAccount.rawNotes);
    setQbr(null);
    setError(null);
    setShowAddForm(false);
  }

  function handleAccountChange(id) {
    setAccountId(id);
    const acc = allAccountsInSector.find((a) => a.id === id);
    setNotes(acc.rawNotes || "");
    setQbr(null);
    setError(null);
  }

  function handleClearNotes() {
    setNotes("");
    setQbr(null);
    setError(null);
  }

  function handleRestoreExample() {
    setNotes(account.rawNotes || "");
    setQbr(null);
    setError(null);
  }

  async function handleSaveNewAccount(newAccount) {
    const updated = [...customAccounts, newAccount];
    setCustomAccounts(updated);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated), false);
    } catch (e) {
      // storage failed — the account still exists in this session
    }
    setShowAddForm(false);
    setAccountId(newAccount.id);
    setNotes(newAccount.rawNotes || "");
    setQbr(null);
    setError(null);
  }

  async function handleDeleteAccount(id) {
    const updated = customAccounts.filter((a) => a.id !== id);
    setCustomAccounts(updated);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated), false);
    } catch (e) {}
    const remaining = [...sector.accounts, ...updated.filter((a) => a.sectorKey === sectorKey)];
    const next = remaining[0];
    setAccountId(next.id);
    setNotes(next.rawNotes || "");
    setQbr(null);
  }

  async function generateQBR() {
    if (!notes.trim()) {
      setError("Add some meeting notes first — type your own or restore the example.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const prompt = `You are a customer success operations assistant. Turn the raw, unstructured meeting notes below into a formal quarterly business review (QBR) summary. Respond with ONLY valid JSON (no markdown fences, no preamble) matching this shape:
{
  "executiveSummary": "2-3 sentences, exec tone",
  "wins": ["short bullet", "short bullet"],
  "risks": ["short bullet", "short bullet"],
  "nextSteps": ["short bullet", "short bullet", "short bullet"],
  "outlook": "one sentence on renewal/expansion outlook"
}
If there are no wins or no risks, use a single item stating "None this cycle" for that field rather than omitting it.

Account: ${account.name} (${account.tier} tier, ${sector.label})
Current metrics: ${account.metricsLine}
Raw meeting notes: ${notes}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) throw new Error("API not reachable outside Claude.ai");
      const data = await response.json();
      const text = data.content.map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQbr(parsed);
    } catch (e) {
      const fallback = FALLBACK_QBR[account.id];
      if (fallback && notes.trim() === (account.rawNotes || "").trim()) {
        setQbr({ ...fallback, isFallback: true });
      } else {
        setError("Live generation isn't available outside Claude.ai for custom accounts or edited notes. Open this project inside Claude.ai to see it generated live.");
      }
    } finally {
      setLoading(false);
    }
  }

  const docRef = `QBR-${account.id.toUpperCase()}-2026Q3`;

  return (
    <div style={{ minHeight: "100%", background: PAPER, padding: "0 0 48px", fontFamily: "'Inter', sans-serif" }}>
      <link rel="stylesheet" href={FONT_IMPORT_URL} />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        * { box-sizing: border-box; }
        textarea:focus, select:focus, input:focus { outline: none; }
        textarea::placeholder, input::placeholder { color: #B7BAC4; }
      `}</style>

      <div style={{ background: INK, padding: "26px 24px 22px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
            Account Management Portfolio
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 28, color: "#FFFFFF" }}>
            QBR Assistant
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
            Turns raw meeting notes into a structured quarterly business review
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {Object.entries(SECTORS).map(([key, s]) => (
            <button
              key={key}
              onClick={() => handleSectorChange(key)}
              style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                padding: "9px 16px", borderRadius: 7, cursor: "pointer",
                border: sectorKey === key ? `1px solid ${s.accent}` : `1px solid ${BORDER}`,
                background: sectorKey === key ? `${s.accent}12` : "#FFFFFF",
                color: sectorKey === key ? INK : MUTED,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: "0 1px 3px rgba(27,35,64,0.06)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: MUTED, display: "block", marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" }}>
                Account
              </label>
              <select
                value={account.id}
                onChange={(e) => handleAccountChange(e.target.value)}
                style={{
                  width: "100%", background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 6,
                  padding: "9px 10px", color: INK, fontFamily: "'Inter', sans-serif", fontSize: 14,
                }}
              >
                {allAccountsInSector.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} — {a.tier}{a.isCustom ? " (custom)" : ""}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                display: "flex", alignItems: "center", gap: 6, background: showAddForm ? "#F1F0EC" : sector.accent,
                color: showAddForm ? INK : "#FFFFFF", border: "none", borderRadius: 6, padding: "9px 12px",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
              }}
            >
              <Plus size={14} /> Add account
            </button>
            {account.isCustom && (
              <button
                onClick={() => handleDeleteAccount(account.id)}
                title="Remove this account"
                style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "9px 10px", cursor: "pointer", color: RISK }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {showAddForm && (
            <AddAccountForm sectorKey={sectorKey} accent={sector.accent} onCancel={() => setShowAddForm(false)} onSave={handleSaveNewAccount} />
          )}

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, marginBottom: 14, lineHeight: 1.6 }}>
            {account.metricsLine || "No metrics recorded yet."}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: MUTED, letterSpacing: 0.4, textTransform: "uppercase" }}>
              Raw meeting notes
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleClearNotes} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: 11, padding: 0 }}>
                <Eraser size={12} /> Clear & write your own
              </button>
              <button onClick={handleRestoreExample} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: 11, padding: 0 }}>
                <RotateCcw size={12} /> Restore example
              </button>
            </div>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste or type your raw meeting notes here — messy is fine, that's the point."
            rows={5}
            style={{
              width: "100%", background: "#FBFAF8", border: `1px solid ${BORDER}`, borderRadius: 6,
              padding: 12, color: TEXT, fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.5, resize: "vertical",
            }}
          />

          <button
            onClick={generateQBR}
            disabled={loading}
            style={{
              marginTop: 14, display: "flex", alignItems: "center", gap: 8,
              background: sector.accent, color: "#FFFFFF", border: "none", borderRadius: 6,
              padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: loading ? "default" : "pointer",
              fontFamily: "'Inter', sans-serif", opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
            {loading ? "Generating QBR…" : "Generate QBR summary"}
          </button>
        </div>

        {error && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: RISK, marginBottom: 20 }}>{error}</div>}

        {qbr && (
          <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(27,35,64,0.06)", marginBottom: 24 }}>
            <div style={{ background: `${sector.accent}0D`, borderBottom: `1px solid ${BORDER}`, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={16} color={sector.accent} />
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: INK }}>
                  {account.name}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: MUTED, textAlign: "right", lineHeight: 1.5 }}>
                {docRef}<br />Q3 2026 REVIEW
              </div>
            </div>

            <div style={{ padding: 22 }}>
              {qbr.isFallback && (
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: MUTED, marginBottom: 16, letterSpacing: 0.3, textTransform: "uppercase" }}>
                  Example output — live generation runs inside Claude.ai
                </div>
              )}

              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: TEXT, lineHeight: 1.6, marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
                {qbr.executiveSummary}
              </div>

              <Section icon={TrendingUp} title="Wins" accent={HEALTHY}>
                <BulletList items={qbr.wins} accent={HEALTHY} />
              </Section>

              <Section icon={AlertTriangle} title="Risks & watch-outs" accent={RISK}>
                <BulletList items={qbr.risks} accent={RISK} />
              </Section>

              <Section icon={ArrowRight} title="Recommended next steps" accent={sector.accent}>
                <BulletList items={qbr.nextSteps} accent={sector.accent} />
              </Section>

              <Section icon={Target} title="Renewal / expansion outlook" accent={WATCH}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{qbr.outlook}</div>
              </Section>
            </div>
          </div>
        )}

        {!qbr && !error && (
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: MUTED, textAlign: "center", padding: "24px 0" }}>
            Select an account, review or edit the notes, then generate the QBR summary.
          </div>
        )}
      </div>
    </div>
  );
}
