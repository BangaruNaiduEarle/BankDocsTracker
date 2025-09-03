import React, { useState } from 'react';
import { X, User, Building2, Calendar, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ReportDetailModal = ({ report, onClose, onChange, onUpdate }) => {


  const [localStatus, setLocalStatus] = useState(report.Status);
  const [localCheque, setLocalCheque] = useState(report.Cheque_Status);
  const [localDocument, setLocalDocument] = useState(report.Document_Status);


  const handleFieldChange = (field, value) => {
    console.log("Select field", report.ID, field, value);
    onChange(report.ID, field, value);
  };

  if (!report) return null;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
        text: 'Pending'
      },
      'in-progress': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: AlertCircle,
        text: 'In Progress'
      },
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        text: 'Completed'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: X,
        text: 'Cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  const getSubmissionBadge = (status) => {
    const badges = {
      yes: 'bg-green-100 text-green-800 border-green-200',
      no: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-xl font-bold text-slate-900">Report Details</h2>
                <p className="text-sm text-slate-600">{report.SRO  ? "SRO" : "BT"} #{report.SRO || report.BT}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Current Status</h3>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.text}
                </span>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Transaction Parties</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Seller</label>
                      <p className="text-sm font-medium text-slate-900">{report.Seller_Name}</p>
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <div className="w-full h-px bg-slate-200"></div>
                      <span className="px-2 text-xs text-slate-500">→</span>
                      <div className="w-full h-px bg-slate-200"></div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Applicant/Borrower Name</label>
                      <p className="text-sm font-medium text-slate-900">{report.Applicant_Borrower_Name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Bank Information</h3>
                  </div>
                  <p className="text-sm text-slate-700">{report.Bank_Name}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Timeline</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Created</label>
                      <p className="text-sm text-slate-700">{formatDate(report.Date)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Last Updated</label>
                      <p className="text-sm text-slate-700">{formatDate(report.Update_Time)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-4">Update Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    // value={report.status}
                    value={localStatus}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setLocalStatus(newValue);
                      handleFieldChange('Status', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cheque Submitted</label>
                  <select
                    // value={report.Cheque_Status}
                    value={localCheque}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setLocalCheque(newValue);
                      handleFieldChange('Cheque_Status', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Documents Submitted</label>
                  <select
                    // value={report.Document_Status}
                    value={localDocument}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setLocalDocument(newValue);
                      handleFieldChange('Document_Status', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-4">Submission Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Cheque Submitted</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSubmissionBadge(report.Cheque_Status)}`}>
                    {report.Cheque_Status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Documents Submitted</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSubmissionBadge(report.Document_Status)}`}>
                    {report.Document_Status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Last updated {formatDate(report.Update_Time)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onUpdate}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;