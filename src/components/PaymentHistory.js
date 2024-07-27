import React from 'react';

const PaymentHistory = ({ filter, setFilter, filteredTransactions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-black">Payment History</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Filter by payment method"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-grow bg-gray-200 text-gray-900 py-2 px-4 rounded-md shadow-md"
        />
      </div>
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
            <div>
              <p className="text-gray-800">{transaction.date}</p>
              <p className="text-gray-500">{transaction.method}</p>
            </div>
            <p className="text-gray-800">{transaction.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
