export type Member = {
  id: number;
  placeName: string;
  name: string;
  email: string;
  birthDate: string;
  favorDrinkType: string[];
  role: string;
  alarmEnabled: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export interface MemberRequestBody {
  id: number;
  name: string;
  favorDrink: string[];
  alarmEnabled: false;
}
