import { create } from 'zustand';
import { fetchMemberApi, fetchTagApi } from '@/api/postApi';

interface Tag {
  id: number;
  memberId: number;
  memberName: string;
  tagId: number;
  tagName: string;
}

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
  followTags: Tag[];
}

export interface MemberState {
  members: Member[];
  setMembers: (members: Member[]) => void;
  currentUser: Member | null;
  // setCurrentUser: (userId: number) => void;
  fetchMembers: () => Promise<void>;

  followTags: Tag[];
  fetchFollowTags: () => Promise<void>;
}

export const useMemberStore = create<MemberState>(set => ({
  members: [],
  followTags: [],
  currentUser: null,

  setMembers: (members: Member[]) => set({ members }),
  // currentUser: null,
  // setCurrentUser: (userId: number) =>
  //   set(user => ({
  //     currentUser: user.members.find(member => member.id === userId) || null,
  //   })),
  fetchMembers: async () => {
    try {
      const response = await fetchMemberApi();
      console.log([response]);

      set({ members: [response] });

      const alarmEnabled = [response][0]?.alarmEnabled;
      console.log(alarmEnabled);
      // const currentUser = response.find((member: Member) => member.id === 1) || null;
      // set({ currentUser }); // currentUser Manager
    } catch (err) {
      console.log('Error', err);
    }
  },
  fetchFollowTags: async () => {
    try {
      const response = await fetchTagApi();
      set({ followTags: response });
    } catch (err) {
      console.log('Error fetching tags:', err);
    }
  },
}));

export default useMemberStore;
