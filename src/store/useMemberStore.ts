import axios from 'axios';
import { create } from 'zustand';

interface Tag {
  id?: number;
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
  fetchMembers: () => Promise<void>;

  currentUser: Member | null;
  setCurrentUser: (userId: number) => void;

  followTags: Tag[];
  addFollowTag: (tag: Tag) => Promise<void>;
  removeFollowTag: (tagId: number) => void;
  fetchFollowTags: () => Promise<void>;
}

export const useMemberStore = create<MemberState>(set => ({
  members: [],
  followTags: [],
  currentUser: null,
  setMembers: (members: Member[]) => set({ members }),
  fetchMembers: async () => {
    try {
      const response = await axios.get('/member.json');
      const members = response.data as Member[];
      set({ members });

      const currentUser = members.find(member => member.id === 2) || null;
      set({ currentUser });
    } catch (err) {
      console.log('Error', err);
    }
  },
  setCurrentUser: (userId: number) =>
    set(state => {
      const user = state.members.find(member => member.id === userId);
      return { currentUser: user || null };
    }),

  fetchFollowTags: async () => {
    try {
      const response = await axios.get('/tag.json');
      set({ followTags: response.data });
    } catch (err) {
      console.log('Error', err);
    }
  },
  addFollowTag: async (tag: Tag) => {
    set(state => {
      const currentUser = state.currentUser;
      if (currentUser && Array.isArray(currentUser.followTags)) {
        if (!currentUser.followTags.find(t => t.tagId === tag.tagId)) {
          return {
            ...state,
            currentUser: {
              ...currentUser,
              followTags: [...currentUser.followTags, tag],
            },
          };
        }
      }
      return state;
    });
    console.log('success');
  },
  removeFollowTag: (tagId: number) => {
    set(state => {
      const currentUser = state.currentUser;

      if (currentUser && currentUser.followTags) {
        return {
          ...state,
          currentUser: {
            ...currentUser,
            followTags: currentUser.followTags.filter(tag => tag.tagId !== tagId),
          },
        };
      }

      return state;
    });
  },
}));
