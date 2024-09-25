import axios from 'axios';
import create from 'zustand';
import { mapDrinkType } from '@/data/drinkTypes';

interface specialtyDrink {
  id: number;
  region_id: number;
  name: string;
  type: string;
  degree: number;
  sweetness: number;
  cost: number;
  description: string;
  image_url: string;
  create_at: string;
}

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
    try {
      const response = await axios.get<specialtyDrink[]>('/src/mocks/data/specialtyDrink.json');
      const drinksType = Array.from(new Set(response.data.map(item => mapDrinkType(item.type))));
      console.log(drinksType);
      if (Array.isArray(drinksType)) {
        set({
          alldrinks: drinksType,
        });
      } else {
        console.error('error: ', drinksType);
        set({ alldrinks: [] });
      }
    } catch (err) {
      console.error('Error fetching array: ', err);
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
