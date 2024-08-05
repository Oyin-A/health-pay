import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Notification = ({ notifications, onClose }) => {
  return (
    <div className="absolute top-16 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button onClick={onClose} className="text-white">
          <AiOutlineClose />
        </button>
      </div>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification, index) => (
          <li key={index} className="px-4 py-3 hover:bg-gray-100 transition text-black">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
