import create from 'zustand';

import { alcoholsData } from '@/data/alcoholsData';

interface SpecialtyState {
  alldrinks: string[];
  selectedDrinks: string[];
  setSelectedDrinks: (selectedDrinks: string[]) => void;
  fetchDrinks: () => Promise<void>;
  toggleDrinkSelection: (drink: string) => void;
}

export const useSpecialtyStore = create<SpecialtyState>((set, get) => ({
  alldrinks: [],
  selectedDrinks: [],
  fetchDrinks: async () => {
    const alcoholNames = Object.values(alcoholsData);

    if (Array.isArray(alcoholNames)) {
      set({
        alldrinks: alcoholNames,
      });
    } else {
      console.error('Error with alcohol data');
      set({ alldrinks: [] });
    }
  },

  toggleDrinkSelection: (drink: string) => {
    const { selectedDrinks } = get();

    if (selectedDrinks.includes(drink)) {
      set({
        selectedDrinks: selectedDrinks.filter(item => item !== drink),
      });
    } else {
      set({
        selectedDrinks: [...selectedDrinks, drink],
      });
    }
  },

  setSelectedDrinks: selectedDrinks => set({ selectedDrinks }),
}));
