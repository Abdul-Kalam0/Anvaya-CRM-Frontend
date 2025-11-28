import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LeadList from "./components/LeadList";
import LeadForm from "./components/LeadForm.jsx";
import LeadDetails from "./components/LeadDetails";
import LeadStatusView from "./components/LeadStatusView";
import SalesAgentView from "./components/SalesAgentView";
import Reports from "./components/Reports";
import Navbar from "./components/Navbar";
import AgentForm from "./components/AgentForm.jsx"; // Added import for AgentForm

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
            <Route path="/create-agent" element={<AgentForm />} />{" "}
            {/* Added route for AgentForm */}
            <Route path="/status" element={<LeadStatusView />} />
            <Route path="/agents" element={<SalesAgentView />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
