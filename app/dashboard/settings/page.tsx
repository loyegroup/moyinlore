"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type SessionData = {
  user?: SessionUser;
};

export default function SettingsPage() {
  const { data: session, status } = useSession() as { data: SessionData | null, status: string };
  const [company, setCompany] = useState({ name: '', email: '', phone: '', address: '' });
  const [invoice, setInvoice] = useState({ footerNote: '', currency: 'NGN' });
  const [theme, setTheme] = useState('system');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setCompany(data.company || {});
        setInvoice(data.invoice || {});
        setTheme(data.theme || 'system');
        setNotifications(data.notifications ?? true);
        setImageUrl(data.imageUrl || '');
      }
    };
    fetchSettings();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Image upload failed.';
      setErrorMessage(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setSuccessMessage('');
      setErrorMessage('❌ Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, invoice, theme, notifications, newPassword, imageUrl }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Failed to update settings');

      setSuccessMessage('✅ Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred.';
      setErrorMessage(message);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p className="text-red-500">You must be logged in to view settings.</p>;
  if (!session.user || session.user.role !== 'superAdmin') return <p className="text-red-500">Access denied. Only superAdmins can manage settings.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl space-y-10"
    >
      <h1 className="text-3xl font-bold">Settings</h1>

      <form onSubmit={handleSave} className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-4">Company Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Company Name" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="input" />
            <input type="email" placeholder="Email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} className="input" />
            <input type="text" placeholder="Phone Number" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} className="input" />
            <input type="text" placeholder="Address" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="input" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Upload Company Logo (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            {imageUrl && (
              <div className="relative w-32 h-20 mt-2">
                <Image src={imageUrl} alt="Company Logo" fill className="object-contain" />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Invoice Preferences</h2>
          <textarea rows={3} placeholder="Invoice footer note..." value={invoice.footerNote} onChange={(e) => setInvoice({ ...invoice, footerNote: e.target.value })} className="textarea" />
          <select value={invoice.currency} onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })} className="input mt-2">
            <option value="NGN">NGN - Nigerian Naira (₦)</option>
            <option value="USD">USD - US Dollar ($)</option>
            <option value="EUR">EUR - Euro (€)</option>
          </select>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Theme Preference</h2>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="input">
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="h-4 w-4" />
            <span>Receive email alerts for activity logs</span>
          </label>
        </section>

        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
          Save Settings
        </button>

        {successMessage && (
          <p className="text-green-600 dark:text-green-400 text-sm mt-2">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errorMessage}</p>
        )}
      </form>

      <div className="mt-10 border-t pt-6 border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">User Management (Super Admin Only)</h2>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>Add or remove admin users</li>
          <li>Assign roles: admin / super admin</li>
          <li>View audit logs and login activity</li>
        </ul>
      </div>
    </motion.div>
  );
}
