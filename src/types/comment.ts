export type Comment = {
  id: number;
  memberId: number;
  memberName: string;
  postId: number;
  content: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export interface CommentRequestBody {
  postId: number;
  content: string;
  anonymous: boolean;
}
