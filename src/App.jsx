import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ReportForm from './pages/ReportForm'
import ViewReports from './components/ViewReports'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<ReportForm />} />
        <Route path="/view-reports" element={<ViewReports />} />
      </Routes>
    </div>
  )
}

export default App