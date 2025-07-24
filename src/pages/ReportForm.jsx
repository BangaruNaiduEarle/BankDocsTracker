import React, { useState } from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { API_Base_URL } from '../constants'

const ReportForm = () => {
  const [formData, setFormData] = useState({
    sro: '',
    sellerName: '',
    ApplicantBorrowerName: '',
    bankName: ''
  });

  // Predefined bank options
  const bankOptions = [
    'HDFC Home Loans',
    'Axis Home Loans',
    'IDFC Life',
    'SBI Home Loans',
    'ICICI Home Loans',
    'Kotak Home Loans',
    'PNB Home Loans',
    'BOI Home Loans',
    'Canara Home Loans',
    'Union Home Loans'
  ];

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.sellerName.trim()) {
      newErrors.sellerName = 'Seller name is required';
    }

    if (!formData.ApplicantBorrowerName.trim()) {
      newErrors.ApplicantBorrowerName = 'Buyer name is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  setMessage({ type: '', text: '' });

const formatDate = (date) => {
  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


  // Create full payload with default values
  const fullFormData = {
    ID: 'INCREMENT', // Let SheetDB or Google Sheet script handle auto-increment
     Date: formatDate(new Date()),
     SRO: formData.sro,
    "Seller_Name": formData.sellerName,
    "Applicant_Borrower_Name": formData.ApplicantBorrowerName,
    "Bank_Name": formData.bankName,
    Status: 'Pending',
    "Cheque_Status": 'Pending',
    "Document_Status": 'Pending',
    "Update_Time": formatDate(new Date()),
    "Loan_number": ''
  };

  console.log(fullFormData)

  try {
    const response = await fetch(`https://sheetdb.io/api/v1/ov7cl6dzqq037`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [fullFormData] }), // SheetDB expects `data` key
    });

    const data = await response.json();
    console.log("RESPOnse post DATA", data);

    if (response.ok) {
      setMessage({
        type: 'success',
        text: `Report created successfully!`,
      });

      setFormData({
        sro: '',
        sellerName: '',
        ApplicantBorrowerName: '',
        bankName: '',
      });
    } else {
      setMessage({
        type: 'error',
        text: data.message || 'Failed to create report',
      });
    }
  } catch (error) {
    setMessage({
      type: 'error',
      text: 'Network error. Please try again.',
    });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-2">
              Create Report
            </h1>
            <p className="text-gray-600">
              Enter the transaction details below
            </p>
          </div>

          {/* Success/Error Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Seller Name */}
            <div>
              <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-2">
                SRO
              </label>
              <input
                type="text"
                id="sro"
                name="sro"
                value={formData.sro}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.sro ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter SRO"
                disabled={loading}
              />
              {errors.sro && (
                <p className="mt-1 text-sm text-red-600">{errors.sro}</p>
              )}
            </div>

            {/* Seller Name */}
            <div>
              <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-2">
                Seller Name
              </label>
              <input
                type="text"
                id="sellerName"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.sellerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter seller name"
                disabled={loading}
              />
              {errors.sellerName && (
                <p className="mt-1 text-sm text-red-600">{errors.sellerName}</p>
              )}
            </div>

            {/* Buyer Name */}
            <div>
              <label htmlFor="ApplicantBorrowerName" className="block text-sm font-medium text-gray-700 mb-2">
                Applicant/Borrower Name
              </label>
              <input
                type="text"
                id="ApplicantBorrowerName"
                name="ApplicantBorrowerName"
                value={formData.ApplicantBorrowerName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.ApplicantBorrowerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter buyer name"
                disabled={loading}
              />
              {errors.ApplicantBorrowerName && (
                <p className="mt-1 text-sm text-red-600">{errors.ApplicantBorrowerName}</p>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <select
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white ${errors.bankName ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={loading}
              >
                <option value="">Select a bank</option>
                {bankOptions.map((bank, index) => (
                  <option key={index} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {errors.bankName && (
                <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Report...</span>
                </div>
              ) : (
                'Create Report'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;