export type Declaration = {
  id: number;
  memberId: number;
  memberName: string;
  link: string;
  type: string;
  content: string;
  approved: boolean | null;
  createdAt: string;
};

export interface DeclarationRequestBody {
  link: string;
  type: string;
  content: string;
}
