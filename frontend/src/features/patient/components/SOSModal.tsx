import React, { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/features/auth/api/auth.api';
import {
  EmergencyContact,
  EmergencyRelationship,
} from '@/features/auth/types/auth.types';
import {
  validateEmergencyContact,
  hasErrors,
  EmergencyContactErrors,
} from '../utils/validation';

import { doctorApi } from '@/features/doctor/api/doctor.api';
import { VerifiedDoctor } from '@/features/doctor/types/doctor.types';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RELATIONSHIPS: EmergencyRelationship[] = [
  'Parent',
  'Husband / Spouse',
  'Partner',
  'Family Member',
  'Friend',
  'Other',
];

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [primaryDoctor, setPrimaryDoctor] = useState<VerifiedDoctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<EmergencyContactErrors>({});

  // Form State for Add / Edit
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [relationship, setRelationship] = useState<EmergencyRelationship>('Husband / Spouse');

  const fetchContacts = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    try {
      const [res, docRes] = await Promise.allSettled([
        authApi.getEmergencyContacts(),
        doctorApi.getPatientPrimaryDoctor(),
      ]);
      if (res.status === 'fulfilled') {
        setContacts(res.value.emergencyContacts || []);
      }
      if (docRes.status === 'fulfilled' && docRes.value?.data?.primaryDoctor) {
        setPrimaryDoctor(docRes.value.data.primaryDoctor);
      }
    } catch (err: unknown) {
      console.error('Failed to load emergency contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
      setIsFormOpen(false);
      setEditingContactId(null);
    }
  }, [isOpen, fetchContacts]);

  const handleOpenAddForm = () => {
    setEditingContactId(null);
    setName('');
    setPhoneNumber('');
    setRelationship('Husband / Spouse');
    setError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (contact: EmergencyContact) => {
    setEditingContactId(contact.id);
    setName(contact.name);
    setPhoneNumber(contact.phoneNumber);
    setRelationship(contact.relationship);
    setError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEmergencyContact({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      relationship,
    });

    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setSaving(true);
    setError(null);

    try {
      if (editingContactId) {
        const res = await authApi.updateEmergencyContact(editingContactId, {
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          relationship,
        });
        setContacts(res.emergencyContacts || []);
      } else {
        const res = await authApi.addEmergencyContact({
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          relationship,
        });
        setContacts(res.emergencyContacts || []);
      }
      setIsFormOpen(false);
      setEditingContactId(null);
      setName('');
      setPhoneNumber('');
    } catch (err: any) {
      const msg =
        err?.userFriendlyMessage ||
        err?.response?.data?.message ||
        'Failed to save emergency contact.';
      setError(msg);
      if (err?.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to remove this emergency contact?')) return;
    try {
      const res = await authApi.deleteEmergencyContact(contactId);
      setContacts(res.emergencyContacts || []);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to remove contact.';
      setError(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[var(--bg-card)] border-2 border-rose-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Alert */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-200 dark:border-rose-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-600/30 animate-pulse">
              🚨
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
                Emergency Help
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Immediate medical contacts and emergency assistance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── 0. Primary Doctor Emergency Contact ─────────── */}
        {primaryDoctor && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-lg font-black shrink-0">
                👩‍⚕️
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-emerald-700 dark:text-emerald-300 tracking-wider block">
                  Your Primary Doctor
                </span>
                <h4 className="text-xs font-black text-[var(--text-primary)]">
                  {primaryDoctor.fullName || primaryDoctor.name}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {primaryDoctor.clinicName || 'Clinic'} {primaryDoctor.clinicAddress ? `• ${primaryDoctor.clinicAddress}` : ''}
                </p>
              </div>
            </div>
            {primaryDoctor.phone && (
              <a
                href={`tel:${primaryDoctor.phone}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <span>📞</span>
                <span>Call Doctor</span>
              </a>
            )}
          </div>
        )}

        {/* ── 1. Your Emergency Contacts ───────────────────── */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span>👥</span> Your Emergency Contacts
            </h3>
            {!isFormOpen && (
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>+</span> Add Contact
              </button>
            )}
          </div>

          {/* Add / Edit Form */}
          {isFormOpen && (
            <form
              onSubmit={handleSaveContact}
              className="p-4 rounded-2xl bg-[var(--bg-surface)] border-2 border-rose-300 dark:border-rose-800 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {editingContactId ? '✏️ Edit Emergency Contact' : '➕ Add Emergency Contact'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-xs text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Name
                </label>
                {fieldErrors.name && (
                  <p className="text-rose-500 text-[11px] mb-1 font-medium">{fieldErrors.name}</p>
                )}
                <input
                  type="text"
                  placeholder="e.g. John Doe / Mother"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full px-3 py-2 rounded-xl border bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-medium focus:outline-none focus:ring-2 ${
                    fieldErrors.name
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-[var(--border-primary)] focus:ring-rose-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Phone Number
                  </label>
                  {fieldErrors.phoneNumber && (
                    <p className="text-rose-500 text-[11px] mb-1 font-medium">{fieldErrors.phoneNumber}</p>
                  )}
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (fieldErrors.phoneNumber) setFieldErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                    }}
                    className={`w-full px-3 py-2 rounded-xl border bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-medium focus:outline-none focus:ring-2 ${
                      fieldErrors.phoneNumber
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-[var(--border-primary)] focus:ring-rose-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Relationship
                  </label>
                  {fieldErrors.relationship && (
                    <p className="text-rose-500 text-[11px] mb-1 font-medium">{fieldErrors.relationship}</p>
                  )}
                  <select
                    value={relationship}
                    onChange={(e) => {
                      setRelationship(e.target.value as EmergencyRelationship);
                      if (fieldErrors.relationship) setFieldErrors((prev) => ({ ...prev, relationship: undefined }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </form>
          )}

          {/* Contact List / Empty State */}
          {loading ? (
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] animate-pulse text-xs text-[var(--text-muted)] text-center">
              Loading emergency contacts...
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-primary)] text-center space-y-2.5">
              <span className="text-3xl block">👤</span>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Add someone you trust so they can be contacted quickly when you need help.
              </p>
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>+</span> Add Emergency Contact
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-between gap-3 shadow-xs hover:border-rose-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 font-bold flex items-center justify-center text-lg shrink-0">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm text-[var(--text-primary)]">
                          {contact.name}
                        </strong>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                          {contact.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                        📞 {contact.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                      title={`Call ${contact.name}`}
                    >
                      <span>📞</span>
                      <span className="hidden sm:inline">Call</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenEditForm(contact)}
                      className="p-1.5 rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] text-xs transition cursor-pointer"
                      title="Edit Contact"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs transition cursor-pointer"
                      title="Remove Contact"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 2. National & Maternal Emergency Call Actions ── */}
        <div className="space-y-2.5 my-5 pt-3 border-t border-[var(--border-primary)]">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            🚨 Immediate 24/7 Medical Lines
          </h3>

          <a
            href="tel:911"
            className="w-full p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-center flex items-center justify-center gap-3 shadow-lg shadow-rose-600/30 transition text-sm sm:text-base cursor-pointer"
          >
            <span>📞</span>
            <span>Call National Emergency (911 / 112)</span>
          </a>

          <a
            href="tel:18007734622"
            className="w-full p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-center flex items-center justify-center gap-2 transition text-xs sm:text-sm cursor-pointer"
          >
            <span>🏥</span>
            <span>24/7 Maternal Urgent Line (1-800-PREGNA-CARE)</span>
          </a>
        </div>

        {/* ── 3. Warning Signs Section ────────────────────── */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-2.5">
          <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span>⚠️</span> Seek Immediate Hospital Care For:
          </h3>
          <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside">
            <li><strong>Heavy bleeding</strong> or sudden leakage of fluid</li>
            <li><strong>Severe abdominal</strong> or sharp pelvic pain</li>
            <li><strong>Sudden severe swelling</strong> in hands/face or blurred vision</li>
            <li><strong>High fever</strong> above 38.5°C (101.3°F) or chills</li>
            <li><strong>Noticeable decrease</strong> in baby movements (after 24 weeks)</li>
            <li><strong>Chest pain</strong> or difficulty breathing</li>
          </ul>
        </div>

        {/* Disclaimer & Close */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] text-[var(--text-muted)]">
            If you are experiencing severe symptoms, do not wait. Visit the nearest emergency room.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition cursor-pointer shrink-0"
          >
            I'm Safe • Close
          </button>
        </div>
      </div>
    </div>
  );
};
