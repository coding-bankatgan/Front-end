export type Announcement = {
  id: number;
  memberId: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export interface AnnouncementRequestBody {
  title: string;
  content: string;
}
