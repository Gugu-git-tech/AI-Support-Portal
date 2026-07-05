import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";

export default function AdminAI() {
  const [enabled, setEnabled] = useState(true);
  const [style, setStyle] = useState("Professional");
  const [escalation, setEscalation] = useState(0.7);
  const [fallback, setFallback] = useState("I'm transferring this to a human agent for help.");

  return (
    <DashboardShell title="AI Brain Control Panel" navItems={adminNav} requiredRole="admin">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">AI Toggle & Style</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <span>AI Enabled</span>
          </label>

          <select value={style} onChange={(e) => setStyle(e.target.value)} className="px-2 py-1">
            <option>Professional</option>
            <option>Friendly</option>
            <option>Technical</option>
          </select>
        </div>

        <h2 className="text-lg font-semibold">Escalation Threshold</h2>
        <div>
          <input type="range" min={0} max={1} step={0.01} value={escalation} onChange={(e) => setEscalation(parseFloat(e.target.value))} />
          <div className="text-sm">Current: {Math.round(escalation * 100)}%</div>
        </div>

        <h2 className="text-lg font-semibold">Fallback Message</h2>
        <textarea value={fallback} onChange={(e) => setFallback(e.target.value)} className="w-full p-2 border rounded" rows={3} />

        <div className="mt-4">
          <button className="px-4 py-2 rounded bg-gradient-neon text-white">Save AI Settings</button>
        </div>
      </div>
    </DashboardShell>
  );
}
