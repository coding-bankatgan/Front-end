import axios from 'axios';
import create from 'zustand';

interface regions {
  region_id: number;
  place_name: string;
  latitude: number;
  longitude: number;
  create_at: string;
}

interface regionsState {
  allRegions: string[];
  fetchRegions: () => Promise<void>;
}

export const useRegionStore = create<regionsState>(set => ({
  allRegions: [],
  fetchRegions: async () => {
    try {
      const response = await axios.get<regions[]>('/regions.json');
      const regionsName = Array.from(new Set(response.data.map(item => item.place_name)));
      console.log(regionsName);
      if (Array.isArray(regionsName)) {
        set({
          allRegions: regionsName,
        });
      } else {
        console.error('error: ', regionsName);
        set({ allRegions: [] });
      }
    } catch (err) {
      console.error('Error fetching array: ', err);
    }
  },
}));
