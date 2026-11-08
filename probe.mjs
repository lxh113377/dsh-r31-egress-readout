// r31 readout: GH runner GETs deployed diagnostic Worker twice (normal + bad=1).
// Worker fetch handler runs at the CF edge and issues the REAL iLink POST there.
// This runner is ONLY the read channel; it never contacts iLink itself.
const base = process.env.PROBE_URL || "";
const targets = [base + "?probe=1", base + "?bad=1"];
for (const t of targets) {
  const ctrl = new AbortController();
  const timer = setTimeout(function(){ ctrl.abort(); }, 15000);
  const t0 = Date.now();
  try {
    const r = await fetch(t, { signal: ctrl.signal });
    const txt = await r.text();
    console.log("R31-EGRESS-READOUT " + txt);
  } catch (e) {
    console.log("R31-EGRESS-READOUT " + JSON.stringify({ ok:false, err:String(e && e.name), msg:String(e && e.message).slice(0,120), ms: Date.now()-t0 }));
  } finally { clearTimeout(timer); }
}
