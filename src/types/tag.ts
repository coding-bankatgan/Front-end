export type Tag = {
  id: number;
  memberId: number;
  memberName: string;
  tagId: number;
  tagName: string;
};

export interface TagRequestBody {
  tagId: number;
  tagName: string;
}
