import { create } from 'zustand';
import { fetchMemberApi, fetchTagApi } from '@/api/postApi';

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

export const useMemberStore = create<MemberState>((set, get) => ({
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

      const currentUser = response.find((member: Member) => member.id === 1) || null;
      set({ currentUser }); // currentUser Manager
    } catch (err) {
      console.log('Error', err);
    }
  },
  fetchFollowTags: async () => {
    const state = get();
    const currentUser = state.currentUser;

    if (currentUser) {
      try {
        const response = await fetchTagApi();
        const userFollowTags = response.filter((tag: Tag) => tag.memberId === currentUser.id);
        console.log(userFollowTags);
        set({ followTags: userFollowTags });
      } catch (err) {
        console.log('Error fetching tags:', err);
      }
    }
  },
  addFollowTag: async (tag: Tag) => {
    set(state => {
      const currentUser = state.currentUser;
      if (currentUser && Array.isArray(currentUser.followTags)) {
        return {
          ...state,
          currentUser: {
            ...currentUser,
            followTags: [...currentUser.followTags, tag],
          },
        };
      }
      return state;
    });
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
