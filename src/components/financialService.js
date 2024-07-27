// Mock implementation of financial service

export const getAccountBalance = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1250.75);
    }, 500);
  });
};

export const getRecentTransactions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { date: '2023-10-13', description: "Doctor's Visit", amount: -120.00 },
        { date: '2023-10-10', description: 'Prescription', amount: -45.00 },
        { date: '2023-10-07', description: 'Lab Tests', amount: -200.00 },
        { date: '2023-10-05', description: 'Insurance Claim', amount: 500.00 },
        { date: '2023-10-02', description: 'Consultation Fee', amount: -75.00 },
      ]);
    }, 500);
  });
};

export const getInsuranceClaims = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { description: 'Claim for Lab Tests', status: 'Pending' },
        { description: 'Claim for Prescription', status: 'Approved' },
        { description: 'Claim for Consultation Fee', status: 'Rejected' },
      ]);
    }, 500);
  });
};

export const getHSA = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        balance: 800.50,
        contributions: [
          { date: '2023-09-30', amount: 100.00 },
          { date: '2023-08-31', amount: 150.00 },
        ],
        withdrawals: [
          { date: '2023-09-15', amount: 50.00 },
          { date: '2023-08-10', amount: 200.00 },
        ],
      });
    }, 500);
  });
};

export const getPaymentHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { date: '2023-10-15', description: 'Payment to Hospital', amount: 150.00 },
        { date: '2023-10-08', description: 'Payment to Pharmacy', amount: 50.00 },
        { date: '2023-10-03', description: 'Payment to Lab', amount: 200.00 },
      ]);
    }, 500);
  });
};
