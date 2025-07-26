import React from "react";

export default function TeamMemberModal({ form, setForm, formOpen, setFormOpen, handleFormSubmit, formLoading, editId }) {
  if (!formOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-lg relative" onSubmit={handleFormSubmit}>
        <h4 className="text-xl sm:text-2xl font-bold text-pink-700 dark:text-pink-400 mb-4 sm:mb-6">{editId ? "Edit" : "Add"} Team Member</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
          <input type="text" className="col-span-1 sm:col-span-2 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="text" className="col-span-1 sm:col-span-2 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Role" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          <input type="text" className="col-span-1 sm:col-span-2 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <input type="text" className="col-span-1 sm:col-span-2 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Facebook" value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} />
          <input type="text" className="col-span-1 sm:col-span-2 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Twitter" value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })} />
          <input type="text" className="col-span-1 sm:col-span-2 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Instagram" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
          <input type="number" className="col-span-1 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Year" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
          <input type="number" className="col-span-1 border rounded px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" placeholder="Order" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
        </div>
        <textarea className="border rounded px-3 sm:px-4 py-2 w-full mb-4 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base" rows={3} placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          <button type="button" className="px-4 sm:px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold" onClick={() => setFormOpen(false)}>
            Cancel
          </button>
          <button type="submit" className="px-4 sm:px-6 py-2 rounded-lg bg-pink-600 dark:bg-pink-700 text-white font-semibold shadow hover:bg-pink-700 dark:hover:bg-pink-800 transition" >
            {formLoading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

