'use client';

import { useState, useEffect } from 'react';
import type { AlertLog } from '@/types';
import { LoaderFour } from '@/components/ui/loader';

export default function AdminDashboard() {
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    phishing: 0,
    account_compromise: 0,
    malware: 0,
    scam: 0,
    other: 0,
  });

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/alerts' 
        : `/api/alerts?type=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAlerts(data.alerts);
        calculateStats(data.alerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (alertList: AlertLog[]) => {
    const newStats = {
      total: alertList.length,
      phishing: 0,
      account_compromise: 0,
      malware: 0,
      scam: 0,
      other: 0,
    };

    alertList.forEach((alert) => {
      if (alert.type in newStats) {
        // @ts-ignore - Dynamic key access
        newStats[alert.type as keyof typeof newStats]++;
      } else {
        newStats.other++;
      }
    });

    setStats(newStats);
  };

  const getThreatTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      phishing: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
      account_compromise: 'bg-red-500/20 text-red-200 border-red-500/30',
      malware: 'bg-orange-500/20 text-orange-200 border-orange-500/30',
      scam: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
      other: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg mb-8">
            <h1 className="text-3xl font-bold text-white">
            🛡️ Security Alerts Dashboard
            </h1>
            <p className="text-blue-100 mt-2">
              Monitor and manage security alerts from the community
            </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-black/30 transition-colors">
            <div className="text-sm text-neutral-400">Total Alerts</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-black/30 transition-colors">
            <div className="text-sm text-neutral-400">Phishing</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.phishing}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-black/30 transition-colors">
            <div className="text-sm text-neutral-400">Account</div>
            <div className="text-2xl font-bold text-red-400">{stats.account_compromise}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-black/30 transition-colors">
            <div className="text-sm text-neutral-400">Malware</div>
            <div className="text-2xl font-bold text-orange-400">{stats.malware}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-black/30 transition-colors">
            <div className="text-sm text-neutral-400">Scams</div>
            <div className="text-2xl font-bold text-purple-400">{stats.scam}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-black/30 transition-colors">
            <div className="text-sm text-neutral-400">Other</div>
            <div className="text-2xl font-bold text-blue-400">{stats.other}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-white/10 rounded-lg px-4 py-2 bg-black/40 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all" className="bg-zinc-900">All Alerts</option>
            <option value="phishing" className="bg-zinc-900">Phishing</option>
            <option value="account_compromise" className="bg-zinc-900">Account Compromise</option>
            <option value="malware" className="bg-zinc-900">Malware</option>
            <option value="scam" className="bg-zinc-900">Scams</option>
            <option value="other" className="bg-zinc-900">Other</option>
          </select>
        </div>

        {/* Alerts Table */}
        <div className="bg-black/20 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden shadow-xl">
          {loading ? (
             <div className="flex justify-center py-12">
               <LoaderFour text="Loading Alerts..." />
             </div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              No alerts found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 text-neutral-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      User Message
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Email Sent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {alerts.map((alert) => (
                    <tr key={alert.$id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded border ${getThreatTypeColor(
                            alert.type
                          )}`}
                        >
                          {alert.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        alert.confidence > 0.8 ? 'bg-red-500' : 
                                        alert.confidence > 0.5 ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${alert.confidence * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-sm text-neutral-300">
                                {Math.round(alert.confidence * 100)}%
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-300 max-w-md truncate" title={alert.userMessage}>
                          {alert.userMessage}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded border ${
                            alert.emailSent
                              ? 'bg-green-500/20 text-green-200 border-green-500/30'
                              : 'bg-red-500/20 text-red-200 border-red-500/30'
                          }`}
                        >
                          {alert.emailSent ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {new Date(alert.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
