import { create } from 'zustand';
import { fetchRegionApi } from '@/api/postApi';

interface Region {
  id: number;
  placeName: string;
  latitude: number;
  longitude: number;
  createAt: string;
}

interface regionsState {
  regions: Region[];
  fetchRegions: () => Promise<void>;
}

export const useRegionStore = create<regionsState>(set => ({
  regions: [],
  fetchRegions: async () => {
    try {
      const data = await fetchRegionApi();
      set({ regions: data });
    } catch (err) {
      console.error('Error fetching array: ', err);
    }
  },
}));
