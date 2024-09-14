import axios from 'axios';
import { create } from 'zustand';

export interface Member {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  currentPassword: string;
  newPassword: null;
  favorDrinkType: string[];
  role: 'USER' | 'MANAGER';
  alarmEnabled: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

export interface MemberState {
  members: Member[];
  setMembers: (members: Member[]) => void;
  fetchMembers: () => Promise<void>;
}

export const useMemberStore = create<MemberState>(set => ({
  members: [],
  setMembers: (members: Member[]) => set({ members }),
  fetchMembers: async () => {
    try {
      const response = await axios.get('/member.json');
      console.log(response.data);
      set({ members: response.data });
    } catch (err) {
      console.log('Error', err);
    }
  },
}));
