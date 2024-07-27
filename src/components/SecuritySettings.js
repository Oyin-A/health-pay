import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const SecuritySettings = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-black">Security Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLock} className="w-8 h-8 mr-4 text-yellow-600" />
            <div>
              <p className="text-gray-800">Secure Payments Enabled</p>
              <p className="text-gray-500">Extra security with two-factor authentication</p>
            </div>
          </div>
          <button className="text-white bg-blue-500 py-1 px-3 rounded-md shadow-md hover:bg-blue-600">Disable</button>
        </div>
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLock} className="w-8 h-8 mr-4 text-red-600" />
            <div>
              <p className="text-gray-800">Payment Notifications</p>
              <p className="text-gray-500">Receive notifications for all payment actions</p>
            </div>
          </div>
          <button className="text-white bg-blue-500 py-1 px-3 rounded-md shadow-md hover:bg-blue-600">Enable</button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
