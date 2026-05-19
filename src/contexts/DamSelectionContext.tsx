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
        if (dam.id && dam.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          setSelectedDam(dam);
        } else {
          localStorage.removeItem('selectedDam');
          setDefaultDam();
        }
      } catch (error) {
        localStorage.removeItem('selectedDam');
        setDefaultDam();
      }
    } else {
      setDefaultDam();
    }
  }, []);

  const setDefaultDam = () => {
    const demo: Dam = {
      id: '0bbf880c-2745-40e7-828b-a798fd9636f3',
      name: 'Presa de Bembézar',
      code: 'GQ-009',
      dam_type: 'Arco',
      province: 'Córdoba',
      operational_status: 'warning',
    } as unknown as Dam;
    setSelectedDam(demo);
    localStorage.setItem('selectedDam', JSON.stringify(demo));
  };

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
