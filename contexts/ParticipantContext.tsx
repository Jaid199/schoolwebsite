"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Participant {
  fullName: string;
  email: string;
  phoneNumber: string;
  tshirtSize: string;
}

interface RegistrationData {
  id?: string;
  category: string;
  participant: Participant;
  includeTshirt: boolean;
  totalPrice: number;
}

interface ParticipantContextType {
  currentParticipant: RegistrationData | null;
  setCurrentParticipant: (participant: RegistrationData | null) => void;
  updateCurrentParticipant: (updates: Partial<RegistrationData>) => void;
  resetCurrentParticipant: () => void;
  participants: RegistrationData[];
  addParticipant: (participant: RegistrationData) => void;
  updateParticipant: (id: string, updates: Partial<RegistrationData>) => void;
  removeParticipant: (id: string) => void;
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(undefined);

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [currentParticipant, setCurrentParticipant] = useState<RegistrationData | null>(null);
  const [participants, setParticipants] = useState<RegistrationData[]>([]);

  const updateCurrentParticipant = (updates: Partial<RegistrationData>) => {
    if (currentParticipant) {
      setCurrentParticipant({
        ...currentParticipant,
        ...updates,
      });
    }
  };

  const resetCurrentParticipant = () => {
    setCurrentParticipant(null);
  };

  const addParticipant = (participant: RegistrationData) => {
    const newParticipant = {
      ...participant,
      id: participant.id || Date.now().toString(),
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const updateParticipant = (id: string, updates: Partial<RegistrationData>) => {
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const value = {
    currentParticipant,
    setCurrentParticipant,
    updateCurrentParticipant,
    resetCurrentParticipant,
    participants,
    addParticipant,
    updateParticipant,
    removeParticipant,
  };

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  );
}

export function useParticipant() {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error('useParticipant must be used within a ParticipantProvider');
  }
  return context;
} 