import { useState } from "react";
import { api } from "../../api/api";

export default function DoctorApply() {
  const [form, setForm] = useState({
    specialization: "",
    experience: "",
    hospital: "",
    licenseNumber: "",
    documentUrl: "",
  });

  const handleSubmit = async () => {
    await api.post("/doctor/apply", form);
    alert("Application submitted");
  };

  return (
    <div>
      <h2>Doctor Verification</h2>

      <input placeholder="Specialization" onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
      <input placeholder="Experience" onChange={(e) => setForm({ ...form, experience: e.target.value })} />
      <input placeholder="Hospital" onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
      <input placeholder="License Number" onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
      <input placeholder="Document URL" onChange={(e) => setForm({ ...form, documentUrl: e.target.value })} />

      <button onClick={handleSubmit}>Apply</button>
    </div>
  );
}