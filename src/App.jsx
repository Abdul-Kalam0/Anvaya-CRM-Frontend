import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LeadList from "./components/LeadList";
import LeadForm from "./components/LeadForm";
import LeadDetails from "./components/LeadDetails";
import LeadStatusView from "./components/LeadStatusView";

import SalesAgentManagement from "./components/SalesAgentManagement"; // NEW
import AgentForm from "./components/AgentForm";

import Reports from "./components/Reports";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      <div className="container mt-4">
        <div className="card shadow-sm p-4">
          <Routes>
            <Route path="/" element={<LeadList />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/create-lead" element={<LeadForm />} />

            {/* Sales Agent Screens */}
            <Route path="/agents" element={<SalesAgentManagement />} />
            <Route path="/create-agent" element={<AgentForm />} />

            {/* Other Views  */}
            <Route path="/status" element={<LeadStatusView />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
