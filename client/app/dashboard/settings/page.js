'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { businessAPI } from '../../../lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    website: '',
    ownerEmail: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await businessAPI.getAll();
        setBusinesses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBusinesses();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await businessAPI.update(editing, formData);
      } else {
        await businessAPI.create(formData);
      }
      // Refresh businesses
      const response = await businessAPI.getAll();
      setBusinesses(response.data.data || []);
      setFormData({ name: '', email: '', phone: '', industry: '', website: '', ownerEmail: '' });
      setEditing(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving business');
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-medium text-white tracking-tight">
                Business Settings
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-medium text-slate-900 mb-4">
            {editing ? 'Edit Business' : 'Create New Business'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner Email (for notifications)</label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                {editing ? 'Update' : 'Create'} Business
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setFormData({ name: '', email: '', phone: '', industry: '', website: '', ownerEmail: '' });
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-medium text-slate-900 mb-4">Your Businesses ({businesses.length}/3)</h2>
          {businesses.length === 0 ? (
            <p className="text-slate-600">No businesses created yet.</p>
          ) : (
            <div className="space-y-4">
              {businesses.map((business) => (
                <div key={business._id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-900">{business.name}</h3>
                      <p className="text-sm text-slate-600">{business.email}</p>
                      {business.industry && <p className="text-sm text-slate-500">{business.industry}</p>}
                    </div>
                    <button
                      onClick={() => {
                        setEditing(business._id);
                        setFormData({
                          name: business.name,
                          email: business.email,
                          phone: business.phone || '',
                          industry: business.industry || '',
                          website: business.website || '',
                          ownerEmail: business.settings?.ownerEmail || ''
                        });
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

