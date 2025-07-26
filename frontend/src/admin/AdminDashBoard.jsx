import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./admin-comp/AdminSidebar";
import TeamManagement from "./admin-comp/TeamManagement";

const SIDEBAR_OPTIONS = [
  { name: "Team Management", icon: faUsers },
  { name: "User Management", icon: faUser },
  { name: "Event Management", icon: faUsers },
  { name: "Workshop Management", icon: faUsers },
];

export default function AdminDashBoard() {
  const [activeSection, setActiveSection] = useState("Team Management");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      <AdminSidebar
        options={SIDEBAR_OPTIONS}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      />
      <main className="flex-1 p-4 md:p-10 transition-all duration-300">
        {activeSection === "Team Management" && <TeamManagement />}
        {activeSection !== "Team Management" && (
          <div className="text-xl md:text-2xl text-gray-400 dark:text-gray-500 font-bold text-center py-10">
            {activeSection} (Coming Soon)
          </div>
        )}
      </main>
    </div>
  );
}

