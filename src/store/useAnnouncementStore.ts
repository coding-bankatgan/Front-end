import { create } from 'zustand';
import { fetchAnnouncementApi, fetchAnnouncementDetailApi } from '@/api/postApi';

export interface Announcement {
  id: number;
  memberId: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementState {
  announcements: Announcement[];
  announcementsDetail: Announcement[];
  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  setPagination: (pagination: AnnouncementState['pagination']) => void;

  setAnnouncements: (announcements: Announcement[]) => void;
  fetchAnnouncements: (page: number, size: number) => Promise<void>;
  fetchAnnouncementsDetail: (id: number) => Promise<void>;
}

const useAnnouncementStore = create<AnnouncementState>(set => ({
  announcements: [],
  announcementsDetail: [],
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  setPagination: pagination => set({ pagination }),
  setAnnouncements: (announcements: Announcement[]) => set({ announcements }),
  fetchAnnouncements: async (page: number, size: number) => {
    try {
      const data = await fetchAnnouncementApi(page, size);
      if (data) {
        set({ announcements: data.content });
        set({
          pagination: {
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            size: size,
            number: page,
          },
        });
      }
    } catch (err) {
      set({
        announcements: [],
        pagination: { totalElements: 0, totalPages: 0, size: 10, number: 0 },
      });
    }
  },
  fetchAnnouncementsDetail: async id => {
    try {
      const data = await fetchAnnouncementDetailApi(id);
      set({ announcementsDetail: data });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ announcementsDetail: [] });
    }
  },
}));

export default useAnnouncementStore;
