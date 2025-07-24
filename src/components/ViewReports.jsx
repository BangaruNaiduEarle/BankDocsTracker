import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw, Calendar, User, Building2, Filter, X, Search, FileText, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Edit, Save } from 'lucide-react'
import { API_Base_URL } from '../constants'
import ReportDetailModal from './ReportDetailModal';
import { Send, Trash2 } from 'lucide-react';

// Loan Number Editor Component
const LoanNumberEditor = ({ reportId, initialValue, onSave, isMobile = false }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialValue)
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        if (value === initialValue) {
            setIsEditing(false)
            return
        }

        setIsLoading(true)
        try {
            await onSave(value)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save loan number:', error)
            setValue(initialValue) // Reset on error
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setValue(initialValue)
        setIsEditing(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSave()
        }
        if (e.key === 'Escape') {
            handleCancel()
        }
    }

    if (isEditing) {
        return (
            <div className={`space-y-2 ${isMobile ? 'w-full' : 'min-w-48'}`}>
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter loan number or notes..."
                    className={`w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${isMobile ? 'text-sm p-2 h-20' : 'text-xs p-2 h-16'
                        }`}
                    autoFocus
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50 ${isMobile ? 'px-3 py-1.5' : ''
                            }`}
                    >
                        <Save className="w-3 h-3" />
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className={`px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 ${isMobile ? 'px-3 py-1.5' : ''
                            }`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={`group cursor-pointer ${isMobile ? 'w-full' : 'min-w-48'}`} onClick={() => setIsEditing(true)}>
            <div className={`flex items-start gap-2 p-2 rounded border border-transparent hover:border-gray-300 transition-colors ${isMobile ? 'bg-white border border-gray-200' : 'hover:bg-gray-50'
                }`}>
                <div className="flex-1 min-w-0">
                    {value ? (
                        <div className={`whitespace-pre-wrap break-words ${isMobile ? 'text-sm' : 'text-xs'} text-gray-900`}>
                            {value}
                        </div>
                    ) : (
                        <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-400 italic`}>
                            Click to add loan number...
                        </div>
                    )}
                </div>
                <Edit className={`w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${isMobile ? 'opacity-100' : ''
                    }`} />
            </div>
        </div>
    )
}


const ViewReports = () => {
    const [reports, setReports] = useState([])
    const [filteredReports, setFilteredReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)
    const [expandedMobileFilters, setExpandedMobileFilters] = useState(false)

    // Filter states
    const [filters, setFilters] = useState({
        Date: '',
        "Bank_Name": '',
        "Status": '',
        "Cheque_Status": '',
        "Document_Status": '',
        searchText: ''
    })

    // Filter options
    const dateRangeOptions = [
        { value: '', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'last30days', label: 'Last 30 Days' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' }
    ]

    const bankOptions = [
        'Tata Capital Housing Finance',
        'PNB Housing Finance Ltd',
        'ICICI Bank Limited',
        'Bajaj Housing Finance Ltd',
        'Aditya Birla Housing',

    ]

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const submissionOptions = [
        { value: '', label: 'All' },
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'pending', label: 'Pending' }
    ]

    // const generateWhatsAppMessage = () => {
    //     const messageLines = filteredReports.map(report => {
    //         return `SRO: ${report.sro}, Status: ${report.status}`;
    //     });

    //     return messageLines.join('\n\n');
    // };

    const generateWhatsAppMessage = (reports) => {
        const groupedByBank = {};


        reports.forEach((report) => {
            if (!groupedByBank[report.Bank_Name]) {
                groupedByBank[report.Bank_Name] = [];
            }
            groupedByBank[report.Bank_Name].push(report);
        });

        const messageLines = [];

        Object.keys(groupedByBank).forEach((bankName) => {
            messageLines.push(`🏦 *${bankName}*`);
            groupedByBank[bankName].forEach((report, index) => {
                messageLines.push(
                    `${index + 1}) Applicant: ${report.Applicant_Borrower_Name || "N/A"}\n` +
                    `    Date: ${report.Date},\n` +
                    `    SRO/BT: ${report.SRO || "N/A"}\n` +
                    `    Loan Number: ${report.Loan_number || "--"}`
                );

            });
            messageLines.push("");
        });

        messageLines.push(`Total Files -- ${reports.length}`);

        return messageLines.join("\n");
    };


    const shareViaWhatsApp = () => {
        const message = generateWhatsAppMessage(filteredReports || reports);
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    };

    // Call this to open
    const openModal = (report) => setSelectedReport(report);

    // Call this to close
    const closeModal = () => setSelectedReport(null);

    const fetchReports = async () => {
        try {
            setLoading(true);

            const response = await fetch('https://sheetdb.io/api/v1/ov7cl6dzqq037');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Google Sheets Data", data);

            setReports(data || []);
            setFilteredReports(data || []);

        } catch (err) {
            console.error('Fetch error:', err);
            setError(`Network error: ${err.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports()
    }, [])

    // Filter reports based on current filters
    useEffect(() => {
        let filtered = [...reports]

        // Date range filter
        console.log("FFFFF", filters)
        if (filters.Date) {
            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            filtered = filtered.filter(report => {
                const reportDate = new Date(report.Date)
                const reportDateOnly = new Date(reportDate.getFullYear(), reportDate.getMonth(), reportDate.getDate())

                switch (filters.Date) {
                    case 'today':
                        return reportDateOnly.getTime() === today.getTime()
                    case 'yesterday':
                        const yesterday = new Date(today)
                        yesterday.setDate(yesterday.getDate() - 1)
                        return reportDateOnly.getTime() === yesterday.getTime()
                    case 'last7days':
                        const last7Days = new Date(today)
                        last7Days.setDate(last7Days.getDate() - 7)
                        return reportDateOnly >= last7Days
                    case 'last30days':
                        const last30Days = new Date(today)
                        last30Days.setDate(last30Days.getDate() - 30)
                        return reportDateOnly >= last30Days
                    case 'thisMonth':
                        return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
                    case 'lastMonth':
                        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
                        return reportDate >= lastMonth && reportDate <= lastMonthEnd
                    default:
                        return true
                }
            })
        }

        // Bank name filter
        if (filters.Bank_Name) {
            filtered = filtered.filter(report =>
                report.Bank_Name === filters.Bank_Name
            )
        }

        // Status filter
        if (filters.Status) {
            console.log("Entered status")
            console.log(filtered)

            filtered = filtered.filter(report =>
                report.Status.toLowerCase() === filters.Status
            )
        }

        // Cheque submitted filter
        if (filters.Cheque_Status) {
            filtered = filtered.filter(report =>
                report.Cheque_Status.toLowerCase() === filters.Cheque_Status
            )
        }

        // Documents submitted filter
        if (filters.Document_Status) {
            filtered = filtered.filter(report =>
                report.Document_Status.toLowerCase() === filters.Document_Status
            )
        }

        // Search text filter
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase()
            filtered = filtered.filter(report =>
                report.Seller_Name.toLowerCase().includes(searchLower) ||
                report.Applicant_Borrower_Name.toLowerCase().includes(searchLower) ||
                report.Bank_Name.toLowerCase().includes(searchLower) ||
                report.SRO?.toString().includes(searchLower)
            )
        }

        setFilteredReports(filtered)
    }, [reports, filters]);

    const handleViewReport = (report) => {
        setSelectedReport(report)
    }

    const handleFilterChange = (filterType, value) => {
        console.log("filter", filterType, value)
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }))
    }

    const clearFilters = () => {
        setFilters({
            Date: '',
            "Bank_Name": '',
            "Status": '',
            "Cheque_Status": '',
            "Document_Status": '',
            searchText: ''
        })
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== '')

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', icon: RefreshCw },
            completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
        }

        const config = statusConfig[status] || statusConfig.pending
        const Icon = config.icon

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
            </span>
        )
    }

    const getSubmissionBadge = (submitted) => {
        const config = {
            yes: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            no: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock }
        }

        const selectedConfig = config[submitted] || config.pending
        const Icon = selectedConfig.icon

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedConfig.bg} ${selectedConfig.text}`}>
                <Icon className="w-3 h-3 mr-1" />
                {submitted ? submitted.charAt(0).toUpperCase() + submitted.slice(1) : 'Pending'}
            </span>
        )
    }

    const updateField = async (id, field, value) => {
        try {
            const res = await fetch(`https://sheetdb.io/api/v1/ov7cl6dzqq037/ID/${id}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: { [field]: value }  // <--- FIXED
                })
            });

            const data = await res.json();
            console.log("Update response:", data);

            if (res.ok) {
                setReports(prev =>
                    prev.map(r => (r.ID === id ? { ...r, [field]: value } : r))
                );
            } else {
                alert(data.message || 'Failed to update report');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        }
    };

    const handledelete = async (report) => {
        const { SRO, Seller_Name, Applicant_Borrower_Name, ID } = report;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete the report?\n\nSRO: ${SRO}\nSeller: ${Seller_Name}\nApplicant: ${Applicant_Borrower_Name}\n\nID: ${ID}`
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://sheetdb.io/api/v1/ov7cl6dzqq037/ID/${report.ID}`, {
                method: 'DELETE',
            });

            console.log(response)
            if (response.ok) {
                alert("Report deleted successfully.");
                setReports(prev => prev.filter(item => item.ID !== report.ID));
                setFilteredReports(prev => prev.filter(item => item.ID !== report.ID));
            } else {
                alert("Failed to delete report.");
            }
        } catch (error) {
            console.error("Delete Error", error);
            alert("Network error while deleting. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        {/* Title Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
                            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900">
                                All Reports
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-0 lg:mt-1">
                                {loading ? 'Loading...' : `Showing ${filteredReports.length} of ${reports.length} reports`}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {/* WhatsApp Share Button */}
                            <button
                                onClick={shareViaWhatsApp}
                                className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors min-w-0 flex-shrink-0"
                                aria-label="Share via WhatsApp"
                            >
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="ml-2 hidden sm:inline">Share</span>
                            </button>

                            {/* Filters Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors min-w-0 flex-shrink-0 ${hasActiveFilters
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                aria-label={showFilters ? 'Hide filters' : 'Show filters'}
                            >
                                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Filters</span>
                                {hasActiveFilters && (
                                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                                        !
                                    </span>
                                )}
                            </button>

                            {/* Refresh Button */}
                            <button
                                onClick={fetchReports}
                                disabled={loading}
                                className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 min-w-0 flex-shrink-0"
                                aria-label="Refresh reports"
                            >
                                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>

                            {/* Create New Report Button */}
                            <Link
                                to="/"
                                className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-w-0 flex-shrink-0"
                                aria-label="Create new report"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline whitespace-nowrap">Create New</span>
                                <span className="hidden lg:inline ml-1">Report</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Optimized Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                        {/* Desktop Filters */}
                        <div className="hidden lg:block p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                <div className="flex items-center space-x-3">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Clear All</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search reports..."
                                            value={filters.searchText}
                                            onChange={(e) => handleFilterChange('searchText', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date Range
                                    </label>
                                    <select
                                        value={filters.Date}
                                        onChange={(e) => handleFilterChange('Date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {dateRangeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Bank Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bank Name
                                    </label>
                                    <select
                                        value={filters.Bank_Name}
                                        onChange={(e) => handleFilterChange('Bank_Name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Banks</option>
                                        {bankOptions.map(bank => (
                                            <option key={bank} value={bank}>
                                                {bank}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={filters.Status}
                                        onChange={(e) => handleFilterChange('Status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Cheque Submitted */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cheque Submitted
                                    </label>
                                    <select
                                        value={filters.Cheque_Status}
                                        onChange={(e) => handleFilterChange('Cheque_Status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {submissionOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Documents Submitted */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Documents Submitted
                                    </label>
                                    <select
                                        value={filters.Document_Status}
                                        onChange={(e) => handleFilterChange('Document_Status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {submissionOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters - Compact Design */}
                        <div className="lg:hidden">
                            {/* Filter Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                    {hasActiveFilters && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                            {Object.values(filters).filter(v => v !== '').length}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Search Bar - Always Visible */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search reports..."
                                        value={filters.searchText}
                                        onChange={(e) => handleFilterChange('searchText', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Quick Filter Chips */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    {/* Date Filter Chip */}
                                    <div className="relative">
                                        <select
                                            value={filters.Date}
                                            onChange={(e) => handleFilterChange('Date', e.target.value)}
                                            className={`appearance-none px-3 py-2 pr-8 rounded-full text-xs font-medium border transition-colors ${filters.Date
                                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                                : 'bg-gray-100 border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <option value="">Date</option>
                                            {dateRangeOptions.slice(1).map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                                    </div>

                                    {/* Status Filter Chip */}
                                    <div className="relative">
                                        <select
                                            value={filters.Status}
                                            onChange={(e) => handleFilterChange('Status', e.target.value)}
                                            className={`appearance-none px-3 py-2 pr-8 rounded-full text-xs font-medium border transition-colors ${filters.Status
                                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                                : 'bg-gray-100 border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <option value="">Status</option>
                                            {statusOptions.slice(1).map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                                    </div>

                                    {/* Bank Filter Chip */}
                                    <div className="relative">
                                        <select
                                            value={filters.Bank_Name}
                                            onChange={(e) => handleFilterChange('Bank_Name', e.target.value)}
                                            className={`appearance-none px-3 py-2 pr-8 rounded-full text-xs font-medium border transition-colors ${filters.Bank_Name
                                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                                : 'bg-gray-100 border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <option value="">Bank</option>
                                            {bankOptions.map(bank => (
                                                <option key={bank} value={bank}>
                                                    {bank.replace(' Home Loans', '')}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                                    </div>

                                    {/* More Filters Toggle */}
                                    <button
                                        onClick={() => setExpandedMobileFilters(!expandedMobileFilters)}
                                        className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium border transition-colors ${(filters.Cheque_Status || filters.Document_Status)
                                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                                            : 'bg-gray-100 border-gray-300 text-gray-700'
                                            }`}
                                    >
                                        More
                                        {expandedMobileFilters ? (
                                            <ChevronUp className="w-3 h-3" />
                                        ) : (
                                            <ChevronDown className="w-3 h-3" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Mobile Filters */}
                            {expandedMobileFilters && (
                                <div className="p-4 bg-gray-50 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Cheque Status */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Cheque Status
                                            </label>
                                            <select
                                                value={filters.Cheque_Status}
                                                onChange={(e) => handleFilterChange('Cheque_Status', e.target.value)}
                                                className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {submissionOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Document Status */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Document Status
                                            </label>
                                            <select
                                                value={filters.Document_Status}
                                                onChange={(e) => handleFilterChange('Document_Status', e.target.value)}
                                                className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {submissionOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                            <p className="text-gray-600">Loading reports...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchReports}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                        <div className="text-center">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {hasActiveFilters ? 'No reports match your filters' : 'No reports found'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {hasActiveFilters
                                    ? 'Try adjusting your filters to see more results.'
                                    : 'Get started by creating your first report.'
                                }
                            </p>
                            {hasActiveFilters ? (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            ) : (
                                <Link
                                    to="/"
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Report</span>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SRO.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Seller Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applicant/Borrower Name

                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bank Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cheque
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Documents
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Updated At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Loan Number
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReports.map((report) => (
                                        <tr key={report.ID} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    #{report.SRO}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {report.Seller_Name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {report.Applicant_Borrower_Name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {report.Bank_Name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(report.Status)}
                                            </td>


                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getSubmissionBadge(report.Cheque_Status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getSubmissionBadge(report.Document_Status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(report.Date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(report.Update_Time)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <LoanNumberEditor
                                                    reportId={report.ID}
                                                    initialValue={report.Loan_number || ''}
                                                    onSave={(value) => updateField(report.ID, 'Loan_number', value)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => openModal(report)}
                                                    className="text-sm  hover:underline  px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    View
                                                </button>

                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button

                                                    className="text-sm  hover:cursor-pointer bg-black/20  px-4 py-2 text-white rounded-lg"
                                                    onClick={() => handledelete(report)}
                                                >
                                                    <Trash2 />
                                                </button>

                                            </td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden">
                            {filteredReports.map((report) => (

                                <div key={report.ID} className="p-4 ">
                                    <div className="max-w-sm mx-auto bg-white">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            {/* Header */}
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white">
                                                        #{report.SRO}
                                                    </span>
                                                    {getStatusBadge(report.Status)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 space-y-4">
                                                {/* Dates */}
                                                <div className="grid grid-cols-2 gap-3 text-xs">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="w-3 h-3" />
                                                        <div>
                                                            <div className="font-medium">Created</div>
                                                            <div className="text-gray-500">{formatDate(report.Date)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-2 text-gray-600">
                                                        <Calendar className="w-3 h-3" />
                                                        <div>
                                                            <div className="font-medium">Updated</div>
                                                            <div className="text-gray-500">{formatDate(report.Update_Time)}</div>
                                                        </div>

                                                        <button

                                                            className="text-sm  hover:cursor-pointer bg-black/20  px-2 py-2 text-white rounded-lg"
                                                            onClick={() => handledelete(report)}
                                                        >
                                                            <Trash2 />
                                                        </button>
                                                    </div>

                                                </div>

                                                {/* Parties */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Transaction</div>
                                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                                {report.Seller_Name} → {report.Applicant_Borrower_Name}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bank</div>
                                                            <div className="text-sm text-gray-900 truncate">{report.Bank_Name}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Submission Status */}
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Submissions</div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="text-center">
                                                            <div className="text-xs text-gray-600 mb-1">Cheque</div>
                                                            {getSubmissionBadge(report.Cheque_Status)}
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-xs text-gray-600 mb-1">Documents</div>
                                                            {getSubmissionBadge(report.Document_Status)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Loan Number Editor */}
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Loan Number</div>
                                                    <LoanNumberEditor
                                                        reportId={report.ID}
                                                        initialValue={report.Loan_number || ''}
                                                        onSave={(value) => updateField(report.ID, 'Loan_number', value)}
                                                        isMobile={true}
                                                    />
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                                <button
                                                    onClick={() => openModal(report)}
                                                    className="w-full bg-blue-500 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                >
                                                    View Details
                                                </button>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedReport && (
                            <ReportDetailModal
                                report={selectedReport}
                                onClose={closeModal}
                                onChange={updateField}
                                onUpdate={() => closeModal()} // or pass actual update logic
                            />
                        )}

                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewReports