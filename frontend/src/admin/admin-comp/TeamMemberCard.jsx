import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function TeamMemberCard({ member, onEdit, onDelete, onOrderChange, onOrderUpdate }) {
  const [order, setOrder] = useState(member.order);
  const [orderChanged, setOrderChanged] = useState(false);

  const handleOrderInput = (e) => {
    setOrder(Number(e.target.value));
    setOrderChanged(true);
  };

  const handleOrderUpdate = () => {
    onOrderUpdate(member._id, order);
    setOrderChanged(false);
  };

  return (
    <tr className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-2 sm:px-4 py-2 font-bold text-pink-700 dark:text-pink-400 text-xs sm:text-base">{member.name}</td>
      <td className="px-2 sm:px-4 py-2 text-pink-600 dark:text-pink-300 text-xs sm:text-base">{member.role}</td>
      <td className="px-2 sm:px-4 py-2">
        <img src={member.image} alt={member.name} className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover mx-auto" />
      </td>
      <td className="px-2 sm:px-4 py-2 text-gray-600 dark:text-gray-300 text-xs sm:text-base">{member.desc}</td>
      <td className="px-2 sm:px-4 py-2">
        <div className="flex gap-1 sm:gap-2 justify-center">
          <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </td>
      <td className="px-2 sm:px-4 py-2">
        <input
          type="number"
          min={1}
          className="w-12 sm:w-16 border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 text-xs sm:text-base"
          value={order}
          onChange={handleOrderInput}
        />
        {orderChanged && (
          <button
            className="ml-1 sm:ml-2 px-2 py-1 bg-green-500 dark:bg-green-700 text-white rounded hover:bg-green-600 dark:hover:bg-green-800"
            onClick={handleOrderUpdate}
            title="Update Order"
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
        )}
      </td>
      <td className="px-2 sm:px-4 py-2 flex gap-1 sm:gap-2 justify-center">
        <button className="bg-yellow-400 dark:bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded shadow hover:bg-yellow-500 dark:hover:bg-yellow-700" onClick={() => onEdit(member)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="bg-red-500 dark:bg-red-700 text-white px-2 sm:px-3 py-1 rounded shadow hover:bg-red-600 dark:hover:bg-red-800" onClick={() => onDelete(member._id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}

