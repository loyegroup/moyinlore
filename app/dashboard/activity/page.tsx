"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LogEntry {
  _id: string;
  user: string;
  action: string;
  createdAt: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterType, setFilterType] = useState<'all' | LogEntry['type']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/activity');
      const data = await res.json();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const getTypeStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Activity Logs', 14, 20);

    const tableData = filteredLogs.map((log) => [
      new Date(log.createdAt).toLocaleString('en-NG'),
      log.user,
      log.action,
      log.type,
    ]);

    autoTable(doc, {
      head: [['Date', 'User', 'Action', 'Type']],
      body: tableData,
      startY: 30,
    });

    doc.save('activity_logs.pdf');
  };

  return (
    <motion.div
      className="max-w-5xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>

          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white w-full sm:w-64"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Export PDF
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No matching logs found.</p>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log._id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <span className={getTypeStyle(log.type)}>● </span>
                  {log.action}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(log.createdAt).toLocaleString('en-NG', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                Performed by <span className="font-medium">{log.user}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
// This code defines a page for viewing activity logs in an admin dashboard.
// It fetches logs from an API, allows filtering by type and searching by user or action