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