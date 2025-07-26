import React, { useEffect, useState } from "react";
import YearSelector from "./YearSelector";
import TeamMemberCard from "./TeamMemberCard";
import TeamMemberSkeleton from "./TeamMemberSkeleton";
import TeamMemberModal from "./TeamMemberModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const initialForm = {
  name: "",
  role: "",
  image: "",
  desc: "",
  facebook: "",
  twitter: "",
  instagram: "",
  year: "",
  order: 0,
};

export default function TeamManagement() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [orderUpdating, setOrderUpdating] = useState(null);

  useEffect(() => {
    fetch(API_BASE_URL+"/api/admin/team/years")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setYears(data);
          setSelectedYear(data[0] || "");
        } else {
          setYears([]);
        }
      })
      .catch(() => setYears([]));
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/team?year=${selectedYear}`)
      .then((res) => res.json())
      .then((data) => {
        // Sort by order ascending
        setTeamMembers(data.sort((a, b) => a.order - b.order));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedYear]);

  const openAddForm = () => {
    setForm({ ...initialForm, year: selectedYear });
    setEditId(null);
    setFormOpen(true);
  };

  const openEditForm = (member) => {
    setForm({ ...member });
    setEditId(member._id);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    setLoading(true);
    await fetch(`${API_BASE_URL}/api/admin/team/team/${id}`, { method: "DELETE" });
    setTeamMembers((prev) => prev.filter((m) => m._id !== id));
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_BASE_URL}/api/admin/team/team/${editId}` : `${API_BASE_URL}/api/admin/team/create-team-member`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setFormOpen(false);
      setEditId(null);
      setForm(initialForm);
      // Refresh list
      fetch(`${API_BASE_URL}/api/team?year=${selectedYear}`)
        .then((res) => res.json())
        .then((data) => setTeamMembers(data.sort((a, b) => a.order - b.order)));
    }
    setFormLoading(false);
  };

  const handleOrderUpdate = async (id, newOrder) => {
    setOrderUpdating(id);
    await fetch(`${API_BASE_URL}/api/admin/team/team/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    // Refresh list
    fetch(`${API_BASE_URL}/api/admin/team?year=${selectedYear}`)
      .then((res) => res.json())
      .then((data) => setTeamMembers(data.sort((a, b) => a.order - b.order)));
    setOrderUpdating(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-pink-700 dark:text-pink-400 mb-2">Team Management</h3>
          <p className="text-gray-500 dark:text-gray-300">Manage team members for each year</p>
        </div>
        <button
          className="bg-pink-600 dark:bg-pink-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold shadow hover:bg-pink-700 dark:hover:bg-pink-800 transition w-full sm:w-auto"
          onClick={openAddForm}
        >
          <span className="mr-2"><FontAwesomeIcon icon={faPlus} /></span> Add Member
        </button>
      </div>
      <YearSelector years={years} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow">
          <thead>
            <tr className="bg-pink-100 dark:bg-gray-800">
              <th className="px-2 sm:px-4 py-2 text-xs sm:text-base">Name</th>
              <th className="px-2 sm:px-4 py-2 text-xs sm:text-base">Role</th>
              <th className="px-2 sm:px-4 py-2 text-xs sm:text-base">Image</th>
              <th className="px-2 sm:px-4 py-2 text-xs sm:text-base">Description</th>
              <th className="px-2 sm:px-4 py-2 text-xs sm:text-base">Social</th>
              <th className="px-2 sm:px-4 py-2 text-xs sm:text-base">Order</th>
              <th className="px-2 sm:px-4 py-2 text-xs sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx}><td colSpan={7}><TeamMemberSkeleton /></td></tr>
                ))
              : teamMembers.map((member) => (
                  <TeamMemberCard
                    key={member._id}
                    member={member}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    onOrderUpdate={handleOrderUpdate}
                  />
                ))}
          </tbody>
        </table>
      </div>
      <TeamMemberModal
        form={form}
        setForm={setForm}
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        handleFormSubmit={handleFormSubmit}
        formLoading={formLoading}
        editId={editId}
      />
    </div>
  );
}

