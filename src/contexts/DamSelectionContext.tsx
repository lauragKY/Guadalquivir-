import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Dam } from '../types';

interface DamSelectionContextType {
  selectedDam: Dam | null;
  selectDam: (dam: Dam) => void;
  clearSelection: () => void;
}

const DamSelectionContext = createContext<DamSelectionContextType | undefined>(undefined);

export function DamSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedDam, setSelectedDam] = useState<Dam | null>(null);

  useEffect(() => {
    const storedDam = localStorage.getItem('selectedDam');
    if (storedDam) {
      try {
        const dam = JSON.parse(storedDam);
        // Validate that the dam has a UUID format (basic check)
        if (dam.id && dam.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          setSelectedDam(dam);
        } else {
          console.warn('Invalid dam ID format, clearing selection');
          localStorage.removeItem('selectedDam');
        }
      } catch (error) {
        console.error('Error parsing stored dam:', error);
        localStorage.removeItem('selectedDam');
      }
    }
  }, []);

  const selectDam = (dam: Dam) => {
    setSelectedDam(dam);
    localStorage.setItem('selectedDam', JSON.stringify(dam));
  };

  const clearSelection = () => {
    setSelectedDam(null);
    localStorage.removeItem('selectedDam');
  };

  const value = {
    selectedDam,
    selectDam,
    clearSelection,
  };

  return (
    <DamSelectionContext.Provider value={value}>
      {children}
    </DamSelectionContext.Provider>
  );
}

export function useDamSelection() {
  const context = useContext(DamSelectionContext);
  if (context === undefined) {
    throw new Error('useDamSelection must be used within a DamSelectionProvider');
  }
  return context;
}
