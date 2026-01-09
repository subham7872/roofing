'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { useLeads } from '../../../hooks/useLeads';
import { leadAPI } from '../../../lib/api';

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const { user, loading: authLoading } = useAuth();
  const { leads, loading, updateLeadStatus } = useLeads(businessId);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  const filteredLeads = leads.filter(lead => {
    const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
    const sourceMatch = sourceFilter === 'all' || lead.source === sourceFilter;
    return statusMatch && sourceMatch;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

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
                ← Back to Dashboard
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-medium text-white tracking-tight">
                Leads
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-medium text-slate-900">All Leads</h2>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value="all">All Sources</option>
              <option value="chatbot">Chatbot</option>
              <option value="form">Form</option>
              <option value="api">API</option>
              <option value="manual">Manual</option>
              <option value="discount_modal">Discount Modal</option>
            </select>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-slate-600">No leads found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-slate-900">{lead.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      {lead.source && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {lead.source}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{lead.serviceName}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>{lead.email}</span>
                      <span>{lead.phone}</span>
                      <span>Pincode: {lead.pincode}</span>
                    </div>
                    {lead.description && (
                      <p className="text-sm text-slate-600 mt-2">{lead.description}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-medium text-slate-900">Lead Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const result = await updateLeadStatus(selectedLead._id, newStatus);
                      if (result.success) {
                        setSelectedLead({ ...selectedLead, status: newStatus });
                      }
                    }}
                    className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    <p className="text-slate-900">{selectedLead.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <p className="text-slate-900">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <p className="text-slate-900">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Pincode</label>
                    <p className="text-slate-900">{selectedLead.pincode}</p>
                  </div>
                </div>

                {selectedLead.description && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <p className="text-slate-900">{selectedLead.description}</p>
                  </div>
                )}

                {selectedLead.source && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Source</label>
                    <p className="text-slate-900 capitalize">{selectedLead.source}</p>
                  </div>
                )}

                {selectedLead.aiAnalysis && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">AI Analysis</label>
                    <p className="text-slate-900 text-sm">{selectedLead.aiAnalysis}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

