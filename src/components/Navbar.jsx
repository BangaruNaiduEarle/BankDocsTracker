import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, Eye } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center h-16 space-y-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Report Management System
            </h1>


          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Create Report</span>
            </Link>
            
            <Link
              to="/view-reports"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/view-reports'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar