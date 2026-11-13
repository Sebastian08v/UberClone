import React, { useContext, createContext, useState } from 'react';

export const TripContext = createContext(null);

export function TripProvider({ children }) {
  // null = sin viaje activo | objeto con { ..., status: 'requested' | 'accepted' | ... }
  const [activeTrip, setActiveTrip] = useState(null);

  return (
    <TripContext.Provider value={{ activeTrip, setActiveTrip }}>
      {children}
    </TripContext.Provider>
  );
}