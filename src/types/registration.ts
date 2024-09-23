export type Registration = {
  id: number;
  memberId: number;
  memberName: string;
  placeName: string;
  drinkName: string;
  type: string;
  degree: number;
  sweetness: number;
  cost: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  approved: boolean | null;
};

export interface RegistrationRequestBody {
  regionId: number;
  drinkName: string;
  type: string;
  degree: number;
  sweetness: number;
  cost: number;
  description: string;
  imageUrl: string;
}
