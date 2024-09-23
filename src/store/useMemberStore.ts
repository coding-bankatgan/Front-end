import axios from 'axios';
import { create } from 'zustand';
import { fetchMemberApi } from '@/api/postApi';

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
  currentUser: Member | null;
  // setCurrentUser: (userId: number) => void;
  fetchMembers: () => Promise<void>;

  isNotificationChecked: boolean;
  toggleNotification: () => void;

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
  // currentUser: null,
  // setCurrentUser: (userId: number) =>
  //   set(user => ({
  //     currentUser: user.members.find(member => member.id === userId) || null,
  //   })),
  fetchMembers: async () => {
    try {
      const response = await fetchMemberApi();
      set({ members: response });

      const currentUser = response.find((member: Member) => member.id === 2) || null;
      set({ currentUser }); // currentUser Manager
    } catch (err) {
      console.log('Error', err);
    }
  },

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

  isNotificationChecked: true,
  toggleNotification: () => set(state => ({ isNotificationChecked: !state.isNotificationChecked })),
}));

export default useMemberStore;
