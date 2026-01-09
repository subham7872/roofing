'use client';

import { useState, useEffect } from 'react';
import { leadAPI } from '../lib/api';

export const useLeads = (businessId, filters = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const params = { businessId, ...filters };
        const response = await leadAPI.getAll(params);
        setLeads(response.data.data || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leads');
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [businessId, JSON.stringify(filters)]);

  const updateLeadStatus = async (leadId, status, notes) => {
    try {
      await leadAPI.updateStatus(leadId, status, notes);
      // Refresh leads
      const params = { businessId, ...filters };
      const response = await leadAPI.getAll(params);
      setLeads(response.data.data || []);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update lead' };
    }
  };

  return { leads, loading, error, updateLeadStatus, setLeads };
};

