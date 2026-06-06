import { useState } from "react";
import { applyDoctor } from "../api/doctor.api";
import { ApplyDoctorPayload } from "../types/doctor.types";

interface NavItem {
  icon: string;
  label: string;
  badge?: "pro" | "new";
  notifCount?: number;
  active?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Main Overview",
    items: [
      { icon: "🏠", label: "Dashboard", active: true },
      { icon: "👨‍⚕️", label: "Doctors" },
      { icon: "📅", label: "Appointments" },
    ],
  },
  {
    label: "Health Tracking",
    items: [
      { icon: "🩸", label: "Menstrual Tracking" },
      { icon: "🩺", label: "Symptoms" },
    ],
  },
  {
    label: "Medical Hub",
    items: [
      { icon: "📋", label: "Medical Records" },
      { icon: "🔬", label: "Tests & Scans" },
      { icon: "💊", label: "Care" },
    ],
  },
  {
    label: "Premium Tools",
    items: [
      { icon: "🤖", label: "AI Assistant", badge: "pro" },
      { icon: "🗓️", label: "Daily Schedule", badge: "pro" },
      { icon: "🔔", label: "Notifications", notifCount: 3 },
    ],
  },
];

const quickStats = [
  { icon: "🏥", label: "Current Status", value: "Week 24", color: "bg-emerald-50 text-emerald-600" },
  { icon: "📅", label: "Next Appointment", value: "General Checkup", color: "bg-blue-50 text-blue-600" },
  { icon: "💊", label: "Today's Meds", value: "2 Pending", color: "bg-orange-50 text-orange-500" },
  { icon: "❤️", label: "Kick Count", value: "8 / 10", color: "bg-rose-50 text-rose-500" },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function SidebarNavItem({ item }: { item: NavItem }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
        ${item.active
          ? "bg-emerald-50 text-emerald-600 font-semibold"
          : "text-slate-500 hover:bg-emerald-50 hover:text-slate-800"
        }`}
    >
      <span className="text-base w-5 text-center">{item.icon}</span>
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge === "pro" && (
        <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full tracking-wide uppercase">
          PRO
        </span>
      )}
      {item.notifCount !== undefined && (
        <span className="text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">
          {item.notifCount}
        </span>
      )}
    </button>
  );
}

function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-56 bg-white border-r border-slate-100 flex flex-col z-10 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 bg-emerald-500 rounded-xl grid place-items-center text-white text-lg shadow-md shadow-emerald-200">
          🤱
        </div>
        <span className="font-bold text-slate-800 tracking-tight text-[15px]">
          Pregna<span className="text-emerald-500">Care</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[9.5px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 pt-3 pb-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center text-white text-xs font-bold flex-shrink-0">
            SJ
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-800 leading-tight">Sarah Jenkins</p>
            <p className="text-[11px] text-slate-400">Premium Member</p>
          </div>
        </div>
        <div className="space-y-0.5">
          <button className="w-full flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            ⚙️ <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-2 text-xs text-rose-500 hover:text-rose-700 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
            🚪 <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
function ApplyModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: ApplyDoctorPayload) => void;
}) {
  const [form, setForm] = useState<ApplyDoctorPayload>({
    specialization: "",
    experience: 0,
    hospital: "",
    licenseNumber: "",
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-lg font-bold">Apply as Doctor</h2>

        <input
          placeholder="Specialization"
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Experience"
          onChange={(e) =>
            setForm({ ...form, experience: Number(e.target.value) })
          }
        />

        <input
          placeholder="Hospital"
          onChange={(e) =>
            setForm({ ...form, hospital: e.target.value })
          }
        />

        <input
          placeholder="License Number"
          onChange={(e) =>
            setForm({ ...form, licenseNumber: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button onClick={onClose}>Cancel</button>

          <button onClick={() => onSubmit(form)}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

 const handleSubmit = async (data: ApplyDoctorPayload) => {
  try {
    await applyDoctor(data); 

    setShowModal(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 5000);
  } catch (error) {
    alert("Application failed");
  }
};

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />

      {/* Main content */}
      <main className="ml-56 flex-1 flex flex-col items-center justify-center px-10 py-12">
        <div className="w-full max-w-lg flex flex-col gap-6">

          {/* Quick stat cards */}
          <div className="grid grid-cols-2 gap-3.5">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl grid place-items-center text-xl flex-shrink-0 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-[13.5px] font-semibold text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Apply card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-50 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-emerald-50/60 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl grid place-items-center text-3xl mb-4 shadow-inner">
                🩺
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                Join as a Doctor
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-7 max-w-xs">
                Are you a certified healthcare professional? Apply to join PregnaCare's expert network
                and support mothers through their journey.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
              >
                <span>➕</span> Apply as Doctor
              </button>
            </div>
          </div>

          {/* Success banner */}
          {showSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-sm text-emerald-800 font-medium text-center animate-[fadeIn_0.4s_ease]">
              ✅ Application submitted! Our team will reach out within 2–3 business days.
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <ApplyModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
      )}

      {/* Tailwind keyframes (injected via style tag for custom animations) */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}