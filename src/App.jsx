import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LeadList from "./components/LeadList";
import LeadForm from "./components/LeadForm";
import LeadDetails from "./components/LeadDetails";
import LeadStatusView from "./components/LeadStatusView";

import AgentList from "./components/AgentList"; // NEW
import AgentForm from "./components/AgentForm";

import Reports from "./components/Reports";
import Navbar from "./components/Navbar";
import SalesAgentView from "./components/SalesAgentView";

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
            <Route path="/agents" element={<AgentList />} />
            <Route path="/create-agent" element={<AgentForm />} />
            <Route path="/sales-management" element={<SalesAgentView />} />

            {/* Other Views */}
            <Route path="/status" element={<LeadStatusView />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
