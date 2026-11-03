import React, { createContext, useState } from 'react';

export const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [driver, setDriver] = useState(null);
  // null = sin registro | 'pending' | 'approved'
  const [approvalStatus, setApprovalStatus] = useState(null);

  return (
    <SessionContext.Provider
      value={{ driver, setDriver, approvalStatus, setApprovalStatus }}
    >
      {children}
    </SessionContext.Provider>
  );
}
