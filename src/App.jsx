import { useState, useEffect } from "react";
import { Mountain, Plane, Car, Home, Moon, Sun, Check, AlertTriangle, Cloud, Package, MapPin, ExternalLink, BookOpen, Navigation } from "lucide-react";
import LONGS_PHOTO  from './assets/longs_peak.webp';
import STANLEY_PHOTO  from './assets/stanley.jpg';
import BEAR_LAKE_PHOTO  from './assets/bear_lake.jpg';

function PhotoCard({ src, alt, caption }) {
  return (
    <div style={{ borderRadius: 2, overflow: "hidden", marginBottom: 16, backgroundColor: "#1f2a22" }}>
      <img src={src} alt={alt} style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 240 }} />
      {caption && <div style={{ padding: "6px 12px", fontFamily: "monospace", fontSize: 10, opacity: 0.5, color: "#ece4d4" }}>{caption}</div>}
    </div>
  );
}

const days = [
  { id: "fri", label: "Fri", date: "4", title: "Prep", subtitle: "Dallas · Final Prep", color: "#3d5a4a" },
  { id: "sat", label: "Sat", date: "5", title: "Fly & Acclimate", subtitle: "DAL → Estes Park · Altitude Prep", color: "#8c5a3c" },
  { id: "sun", label: "Sun", date: "6", title: "Summit & Home", subtitle: "Longs Peak · 14,259 ft · 15 mi · 5,100 ft gain · Fly Home", color: "#6b4a8c" },
];

const schedules = {
  fri: [
    { time: "PM", warn: false, title: "Pack gear bag", note: "Layers, headlamp w/ fresh batteries, helmet, poles — see gear list below" },
    { time: "PM", warn: false, title: "Verify all bookings", note: "SW flight, Stanley, rental car — confirmations in one place" },
    { time: "PM", warn: false, title: "Check extended weather forecast", note: "mountain-forecast.com + NOAA point forecast for Longs summit" },
    { time: "PM", warn: true,  title: "Verify RMNP permit for September 5th", note: "recreation.gov — needed for Bear Lake on Saturday" },
    { time: "PM", warn: false, title: "Share trip plan with someone at home", note: "Route, trailhead, expected summit time, when to call SAR" },
    { time: "PM", warn: false, title: "Charge everything", note: "Phone, headlamp, watch, inReach (if you have one)" },
    { time: "9 PM", warn: false, title: "Early to bed", note: "5:00 AM alarm for Love Field" },
  ],
  sat: [
    { time: "5:00 AM",    warn: false, title: "Wake · leave for Love Field", note: "Target arrival 5:45 AM for 7:15 SW flight" },
    { time: "7:15 AM",    warn: false, title: "SW DAL → DEN depart" },
    { time: "~8:30 AM",   warn: false, title: "Land DEN" },
    { time: "8:45–9:30",  warn: false, title: "Rental car pickup + coffee", note: "SUV preferred" },
    { time: "9:30–11:00", warn: false, title: "Drive to Estes Park (~1.5 hr)" },
    { time: "11:00–12:00",warn: false, title: "Grocery stop — Safeway Estes Park", note: "Tomorrow's breakfast · trail food · 3+ L water · LMNT/electrolytes" },
    { time: "12:00–3:00", warn: false, title: "Easy acclimatization + lunch", note: "Bear Lake flat walk OR downtown Estes wander. KEEP IT LIGHT. Hydrate aggressively." },
    { time: "3:00 PM",    warn: false, title: "Check in at The Stanley", note: "Organize summit pack. Lay out clothes for 12:45 AM." },
    { time: "5:30–6:30",  warn: false, title: "Early carb dinner", note: "Pasta / rice / potatoes. Bird & Jim or Cascades at Stanley." },
    { time: "7:30 PM",    warn: false, title: "Lights out · Alarm 12:45 AM" },
  ],
  sun: [
    { time: "12:45 AM",   warn: false, title: "Wake · coffee · oatmeal · banana" },
    { time: "1:30 AM",    warn: false, title: "Check out of Stanley · depart to trailhead", note: "All bags in car — you're not coming back" },
    { time: "2:00 AM",    warn: false, title: "START CLIMB", note: "Headlamp on. Pace aerobic — save legs for the scramble." },
    { time: "~4:00 AM",   warn: false, title: "Chasm Lake junction" },
    { time: "~5:30–6 AM", warn: false, title: "Boulder Field · sunrise", note: "Eat. Hydrate. Assess conditions above." },
    { time: "~6:30–7 AM", warn: true,  title: "THE KEYHOLE — HARD TURNAROUND GATE", note: "Commit or turn back. If weather is building, if you're slow, if anything feels off — DO NOT go above the Keyhole. No bailout above here." },
    { time: "~8:30–9:30", warn: false, title: "SUMMIT — 14,259 ft", note: "Photos, eat, water. Do NOT linger past 10:00 AM." },
    { time: "~11:00 AM",  warn: false, title: "Back below the Keyhole", note: "Exposure is behind you. Should be on the non-technical descent." },
    { time: "1:00–2:30 PM",warn: false,title: "Back at trailhead", note: "Change clothes. Restock water. Caffeine for the drive." },
    { time: "2:30 PM",    warn: false, title: "Drive to DEN (~1.5 hr)", note: "I-70 heavy Sun afternoon. Stop if drowsy — no ego." },
    { time: "4:30–5:30",  warn: false, title: "Return rental · SW check-in", note: "Through security by 6:30 target" },
    { time: "6:00–8:30",  warn: false, title: "Airside meal + decompress" },
    { time: "8:30 PM",    warn: false, title: "SW DEN → DAL depart" },
    { time: "11:30 PM",   warn: false, title: "Land Love Field" },
  ],
};

const gear = [
  { id: "g-1",  item: "Headlamp + spare batteries",    critical: true },
  { id: "g-2",  item: "Climbing helmet",               critical: true },
  { id: "g-3",  item: "Trail runners or light hikers", critical: false },
  { id: "g-4",  item: "Trekking poles (collapsible)",  critical: false },
  { id: "g-5",  item: "Insulated jacket (puffy)",      critical: false },
  { id: "g-6",  item: "Wind/rain shell (OR Foray)",    critical: false },
  { id: "g-7",  item: "Base + mid layer",              critical: false },
  { id: "g-8",  item: "Warm hat + gloves",             critical: false },
  { id: "g-9",  item: "Sun hat + sunglasses",          critical: false },
  { id: "g-10", item: "Sunscreen + lip balm (SPF)",    critical: false },
  { id: "g-11", item: "3+ L water capacity",           critical: true },
  { id: "g-12", item: "Electrolytes (LMNT/Liquid IV)", critical: false },
  { id: "g-13", item: "Trail food — 2,500+ cal",       critical: false },
  { id: "g-14", item: "First aid kit (blister care)",  critical: false },
  { id: "g-15", item: "Offline map — Gaia or AllTrails",critical: false },
  { id: "g-16", item: "Phone charged + battery pack",  critical: false },
  { id: "g-17", item: "Satellite comm (inReach)",      critical: true },
  { id: "g-18", item: "Emergency bivvy / space blanket",critical: false },
  { id: "g-19", item: "Fresh clothes for flight home", critical: false },
];

const costs = [
  { item: "SW flight DAL ↔ DEN",          value: "$280" },
  { item: "Rental car (2 days, per person)",value: "$70" },
  { item: "Fuel (~250 mi)",                value: "$25" },
  { item: "Stanley · Sat night (1 night, per person)",           value: "~$280" },
  { item: "RMNP entry (7-day)",            value: "$35" },
];

const C = {
  bg: "#ece4d4", card: "#f5ecd8", warm: "#dfd4bc",
  dark: "#1f2a22", border: "#d4c8ae", borderMid: "#c4b89e",
  text: "#1f2a22", sub: "#5a5540", muted: "#6b6550",
  red: "#8c3a2e", orange: "#c65d2e", cream: "#ece4d4",
};

const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', monospace" };
const display = { fontFamily: "'Fraunces', Georgia, serif", fontVariationSettings: '"opsz" 144' };

export default function App() {
  const [activeDay, setActiveDay] = useState("fri");
  const [checked, setChecked] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("longs-v6");
        if (r?.value) setChecked(JSON.parse(r.value));
      } catch (_) {}
    })();
  }, []);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    window.storage.set("longs-v6", JSON.stringify(next)).catch(() => {});
  };

  const day = days.find(d => d.id === activeDay);
  const events = schedules[activeDay];
  const packedCount = gear.filter(g => checked[g.id]).length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Instrument Sans', -apple-system, sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: up 0.35s ease-out; }
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        a { text-decoration: none; }
        body { margin: 0; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: C.dark, color: C.cream, position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, pointerEvents: "none" }} viewBox="0 0 400 180" preserveAspectRatio="none">
          <path d="M0,160 Q100,100 200,120 T400,80" stroke="#ece4d4" strokeWidth="1" fill="none"/>
          <path d="M0,140 Q100,70 200,90 T400,50" stroke="#ece4d4" strokeWidth="1" fill="none"/>
          <path d="M0,120 Q100,40 200,60 T400,20" stroke="#ece4d4" strokeWidth="1" fill="none"/>
        </svg>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px", position: "relative" }}>
          <div style={{ ...mono, fontSize: 11, letterSpacing: "0.3em", opacity: 0.7, marginBottom: 12, textTransform: "uppercase" }}>Expedition · N 40.2549° W 105.6160°</div>
          <div style={{ ...display, fontSize: 52, fontWeight: 800, lineHeight: 0.95, marginBottom: 6 }}>Longs Peak</div>
          <div style={{ ...display, fontSize: 22, fontWeight: 400, fontStyle: "italic", opacity: 0.8, marginBottom: 20 }}>via the Keyhole Route</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
            {["Sep 4–6, 2026", "14,259 ft", "Class 3"].map(t => (
              <span key={t} style={{ ...mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 8px" }}>
        <PhotoCard src={LONGS_PHOTO} alt="Longs Peak" caption="Longs Peak · Rocky Mountain National Park" />
        <div style={{ ...mono, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.orange, marginBottom: 8 }}>Route Overview</div>
        <div style={{ ...display, fontSize: 30, fontWeight: 700, marginBottom: 16 }}>The Keyhole Route</div>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "#2d3a32", marginBottom: 16 }}>
          The northernmost fourteener in Colorado, Longs Peak is the only 14er in Rocky Mountain National Park. The Keyhole Route covers 15 miles round trip with 5,100 ft of gain. The first 6 miles are non-technical — a sustained grind through Goblins Forest to the Boulder Field at 12,700 ft. Above the Keyhole, a dramatic notch at 13,150 ft, the route turns to exposed Class 3 scrambling: across the Ledges, up the 600-ft Trough, along the narrow Narrows catwalk, and finally up the Homestretch slabs to the flat, football-field summit.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "#2d3a32", marginBottom: 20 }}>
          Route markers are painted bullseyes above the Keyhole. Afternoon thunderstorms are the primary hazard — most parties start at 2–3 AM to summit by 9–10 AM. Approximately 70 people have died on this route since 1915 (roughly 15,000 people attempt per year). It demands respect.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 }}>
          {[["DISTANCE","15 mi","round trip"],["GAIN","5,100 ft","vertical"],["SUMMIT","14,259 ft","15th highest CO"],["GRADE","Class 3","high exposure"]].map(([l,v,s]) => (
            <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, padding: 12 }}>
              <div style={{ ...mono, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8c5a3c", marginBottom: 4 }}>{l}</div>
              <div style={{ ...display, fontSize: 20, fontWeight: 700, lineHeight: 1, marginBottom: 2 }}>{v}</div>
              <div style={{ ...mono, fontSize: 10, color: C.muted }}>{s}</div>
            </div>
          ))}
        </div>

        {/* 14ers link */}
        <a href="https://www.14ers.com/route.php?route=long1" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 2, border: `2px solid ${C.orange}`, background: C.dark, color: C.cream, marginBottom: 20 }}>
          <div>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>Full Route Beta</div>
            <div style={{ ...display, fontSize: 18, fontWeight: 600 }}>14ers.com · Keyhole Route</div>
            <div style={{ ...mono, fontSize: 11, opacity: 0.7, marginTop: 2 }}>Turn-by-turn description + photos</div>
          </div>
          <ExternalLink size={18} color={C.orange} />
        </a>

        {/* 14ers link */}
        <a href="https://www.youtube.com/watch?v=9jnvPvE-1H4" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 2, border: `2px solid ${C.orange}`, background: C.dark, color: C.cream, marginBottom: 20 }}>
          <div>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>Long's Peak Flyover</div>
            <div style={{ ...display, fontSize: 18, fontWeight: 600 }}>Drone Fly Over</div>
            <div style={{ ...mono, fontSize: 11, opacity: 0.7, marginTop: 2 }}>Keyhole Route</div>
          </div>
          <ExternalLink size={18} color={C.orange} />
        </a>

        {/* 14ers link */}
        <a href="https://www.youtube.com/watch?v=HLEzrTDR_To" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 2, border: `2px solid ${C.orange}`, background: C.dark, color: C.cream, marginBottom: 20 }}>
          <div>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>Quick Route Walkthrough</div>
            <div style={{ ...display, fontSize: 18, fontWeight: 600 }}>2 Minute Walkthrough VLOG</div>
            <div style={{ ...mono, fontSize: 11, opacity: 0.7, marginTop: 2 }}>Keyhole Route</div>
          </div>
          <ExternalLink size={18} color={C.orange} />
        </a>
        {/* BUDGET */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ ...display, fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Budget</div>
          <div style={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}`, background: C.card }}>
            {costs.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", borderBottom: `1px solid #e4d9bf` }}>
                <span style={{ fontSize: 14 }}>{c.item}</span>
                <span style={{ ...mono, fontSize: 14, fontWeight: 600, color: "#3d5a4a" }}>{c.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: C.dark, color: C.cream }}>
              <span style={{ ...display, fontSize: 18, fontWeight: 700 }}>Total</span>
              <span style={{ ...mono, fontSize: 18, fontWeight: 600 }}>~$690</span>
            </div>
          </div>
          <a href="https://www.google.com/travel/flights/booking?tfs=CBwQAhpFEgoyMDI2LTA5LTEyIiAKA0RBTBIKMjAyNi0wOS0xMhoDREVOKgJXTjIEMTI2OWoMCAISCC9tLzBmMnJxcgcIARIDREVOGkUSCjIwMjYtMDktMTMiIAoDREVOEgoyMDI2LTA5LTEzGgNEQUwqAldOMgQxNDg2agcIARIDREVOcgwIAhIIL20vMGYycnFAAUgBcAGCAQsI____________AZgBAQ&tfu=CmxDalJJZFVOZmNWSkhPR2hrY0hkQlFuZzNVVkZDUnkwdExTMHRMUzB0TFc5NVlYVXlNMEZCUVVGQlIyNW9hRVl3U0ZsS2JIbEJFZ1pYVGpFME9EWWFDd2lRMVFFUUFob0RWVk5FT0J4d2tOVUISAggAIgYKATAKATE&tcfs=UgRgAXgB" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 15, padding: 16, borderRadius: 2, border: `2px solid ${C.orange}`, background: C.dark, color: C.cream, marginBottom: 20 }}>
          <div>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>Link to flight</div>
            <div style={{ ...display, fontSize: 18, fontWeight: 600 }}>DAL (Love Field on Southwest) to DEN</div>
            <div style={{ ...mono, fontSize: 11, opacity: 0.7, marginTop: 2 }}>Google Flights</div>
          </div>
          <ExternalLink size={18} color={C.orange} />
        </a>
        </div>
      </div>

      {/* TABS */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.bg, borderTop: `1px solid ${C.borderMid}`, borderBottom: `1px solid ${C.borderMid}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {days.map(d => (
            <button key={d.id} onClick={() => setActiveDay(d.id)}
              style={{ padding: "12px 4px", border: "none", background: activeDay === d.id ? C.warm : "transparent", color: activeDay === d.id ? C.text : C.muted, position: "relative" }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6 }}>{d.label}</div>
              <div style={{ ...display, fontSize: 18, fontWeight: 600, marginTop: 2 }}>{d.date}</div>
              {activeDay === d.id && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: d.color }} />}
            </button>
          ))}
        </div>
      </div>

      {/* DAY CONTENT */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
        <div key={activeDay} className="fade-in">
          <div style={{ ...mono, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: day.color, marginBottom: 4 }}>
            Day {days.findIndex(d => d.id === activeDay) + 1} of 3
          </div>
          <div style={{ ...display, fontSize: 30, fontWeight: 700, marginBottom: 4 }}>{day.title}</div>
          <div style={{ ...mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, marginBottom: 24 }}>{day.subtitle}</div>

          {/* TIMELINE */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: C.border }} />
            {events.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16, position: "relative" }}>
                <div style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: "50%", border: `2px solid ${e.warn ? C.red : day.color}`,
                  background: e.warn ? C.red : C.card, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, zIndex: 1
                }}>
                  {e.warn
                    ? <AlertTriangle size={12} color={C.cream} strokeWidth={2.5} />
                    : <Navigation size={12} color={day.color} strokeWidth={2.5} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", fontWeight: 600, color: day.color, marginBottom: 2 }}>{e.time}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: e.warn ? C.red : C.text }}>{e.title}</div>
                  {e.note && <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.4, color: C.sub }}>{e.note}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* FRIDAY: GEAR */}
          {activeDay === "fri" && (
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.borderMid}` }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ ...display, fontSize: 24, fontWeight: 700 }}>Gear</div>
                <div style={{ ...mono, fontSize: 11, color: C.muted }}>{packedCount}/{gear.length} packed</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {gear.map(g => {
                  const isCh = !!checked[g.id];
                  return (
                    <div key={g.id} onClick={() => toggle(g.id)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 2, cursor: "pointer",
                        border: `1px solid ${g.critical ? C.red : C.border}`, background: isCh ? C.warm : C.card, opacity: isCh ? 0.55 : 1 }}>
                      <div style={{ flexShrink: 0, width: 13, height: 13, borderRadius: 2,
                        border: `1.5px solid ${g.critical ? C.red : "#3d5a4a"}`,
                        background: isCh ? (g.critical ? C.red : "#3d5a4a") : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isCh && <Check size={8} color={C.cream} strokeWidth={3} />}
                      </div>
                      <span style={{ ...mono, fontSize: 12, color: C.text, textDecoration: isCh ? "line-through" : "none", fontWeight: g.critical ? 600 : 400, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.item}</span>
                      {g.critical && !isCh && (
                        <span style={{ ...mono, fontSize: 8, padding: "1px 4px", borderRadius: 2, background: C.red, color: C.cream, flexShrink: 0 }}>CRIT</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SATURDAY: STANLEY + BEAR LAKE */}
          {activeDay === "sat" && (
            <>
              {/* STANLEY */}
              <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.borderMid}` }}>
                <div style={{ ...mono, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.red, marginBottom: 8 }}>Tonight's Basecamp</div>
                <div style={{ ...display, fontSize: 30, fontWeight: 700, marginBottom: 16 }}>The Stanley Hotel</div>
                <PhotoCard src={STANLEY_PHOTO} alt="The Stanley Hotel" caption="The Stanley Hotel · Estes Park, CO · Est. 1909" />
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "#2d3a32", marginBottom: 16 }}>
                  Built in 1909 by Freelan Oscar Stanley — inventor of the Stanley Steamer automobile — after Colorado's mountain air helped him recover from tuberculosis. A Georgian Revival grand hotel on the National Register of Historic Places, sitting at 7,522 ft with direct views of Longs Peak. One of the first fully electrified hotels in the country.
                </p>
                <div style={{ padding: 16, borderLeft: `4px solid ${C.red}`, background: "#1f1612", borderRadius: 2, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <BookOpen size={14} color={C.orange} />
                    <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.orange }}>The Shining</div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: C.cream }}>
                    In September 1974, Stephen King and his wife Tabitha checked in as the only guests, the night before the hotel closed for winter. They ate dinner alone in an empty dining room with canned music echoing down the corridors. King went to bed, then woke from a nightmare of his three-year-old son running through the halls screaming — chased by a fire hose. He lit a cigarette, sat looking out at the Rockies, and by morning had the bones of <em>The Shining</em> in his head. Kubrick's 1980 film was shot elsewhere — so in 1997 King produced his own miniseries at the Stanley itself.
                  </p>
                </div>
                <div style={{ ...mono, fontSize: 11, color: C.muted }}>→ Room 217 (Stephen King Suite) is bookable. Ghost tours available nightly.</div>
              </div>

              {/* BEAR LAKE */}
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.borderMid}` }}>
                <div style={{ ...mono, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#3d5a4a", marginBottom: 8 }}>Afternoon Acclimatization</div>
                <div style={{ ...display, fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Bear Lake Loop</div>
                <PhotoCard src={BEAR_LAKE_PHOTO} alt="Bear Lake, RMNP" caption="Bear Lake · RMNP · 9,475 ft · © Wikimedia Commons CC BY-SA" />
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "#2d3a32", marginBottom: 12 }}>
                  Bear Lake is the ideal Saturday afternoon stop — easy, high-altitude, and genuinely beautiful. The lake sits at 9,475 ft inside RMNP, about 25 minutes from the Stanley. The loop trail is just 0.8 miles and completely flat, making it perfect for light acclimatization without burning legs you'll need tomorrow. On a clear September afternoon the reflection of Hallett Peak and Flattop Mountain off the water is one of the better views in the park.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "#2d3a32", marginBottom: 12 }}>
                  If you have energy to spare, the Nymph Lake extension adds 0.9 miles and 225 ft of gain to a quiet alpine lake surrounded by lily pads. From Nymph you can see Longs Peak looming to the south — worth a few minutes to take it in before tomorrow.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                  {[["LOOP","0.8 mi","flat"],["W/ NYMPH","1.7 mi","+225 ft"],["ELEVATION","9,475 ft","at lake"]].map(([l,v,s]) => (
                    <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, padding: 10, textAlign: "center" }}>
                      <div style={{ ...mono, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#3d5a4a", marginBottom: 3 }}>{l}</div>
                      <div style={{ ...display, fontSize: 17, fontWeight: 700 }}>{v}</div>
                      <div style={{ ...mono, fontSize: 10, color: C.muted, marginTop: 1 }}>{s}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: 12, borderLeft: "4px solid #3d5a4a", background: C.card, borderRadius: 2, ...mono, fontSize: 11, lineHeight: 1.6, color: "#2d3a32" }}>
                  Note: Bear Lake Road requires a timed entry permit during peak season — confirm at recreation.gov before driving in. The shuttle from Estes Park is a reliable alternative.
                </div>
              </div>
            </>
          )}

          {/* SUNDAY: WEATHER + RISK */}
          {activeDay === "sun" && (
            <>
              <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.borderMid}` }}>
                <div style={{ ...display, fontSize: 24, fontWeight: 700, marginBottom: 16 }}>If Weather Turns</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    ["Best Plan B", "Chasm Lake — same trailhead, 8.5 mi, stays below the exposed terrain. Genuinely spectacular."],
                    ["Alt 14er",    "Grays & Torreys from Bakerville (~2 hr from Estes). Two summits, less crowded than Bierstadt."],
                    ["RMNP Classic","Sky Pond — 9 mi, from Glacier Gorge TH, 45 min from Stanley."],
                    ["Hard Rule",   "Turnaround at the Keyhole if clouds are building on the ascent. Not a failure — the peak will be there."],
                  ].map(([label, desc]) => (
                    <div key={label} style={{ padding: 16, borderLeft: "4px solid #8c5a3c", background: C.card, borderRadius: 2 }}>
                      <div style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8c5a3c", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 24, padding: 16, borderLeft: `4px solid ${C.orange}`, background: "#3a1f1a", borderRadius: 2, color: C.cream }}>
                <div style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.orange, marginBottom: 8 }}>⚠ Same-Day Fly-Home Risk</div>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>Zero buffer if the climb runs late or I-70 is heavy. If you're still at the Keyhole past 7:30 AM or at the trailhead past 3 PM, rebook Monday and crash at an airport hotel. Don't race the clock on I-70 exhausted. Consider a refundable SW fare.</div>
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", padding: "40px 0 48px", ...mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>
          ⎯ Climb on ⎯
        </div>
      </div>
    </div>
  );
}