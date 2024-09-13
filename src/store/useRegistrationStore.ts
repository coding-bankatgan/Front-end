import axios from 'axios';
import { create } from 'zustand';

interface Registration {
  registId: number;
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
  approved: 'true' | 'false' | null;
}

interface RegistrationState {
  registrations: Registration[];
  setRegistrations: (registration: Registration[]) => void;
  addRegistration: (
    registration: Omit<
      Registration,
      'registId' | 'memberId' | 'memberName' | 'createdAt' | 'approved'
    >,
  ) => void;

  updateApprovalStatus: (registId: number, approved: 'true' | 'false') => void;
  fetchRegistrations: () => Promise<void>;
}

const useRegistrationStore = create<RegistrationState>((set, get) => ({
  registrations: [],
  setRegistrations: registrations => set({ registrations }),
  fetchRegistrations: async () => {
    try {
      const response = await axios.get('/registration.json');
      console.log(response.data);
      if (Array.isArray(response.data)) {
        set({
          registrations: response.data,
        });
      } else {
        console.error('error: ', response);
        set({ registrations: [] });
      }
    } catch (err) {
      set({ registrations: [] });
    }
  },

  addRegistration: registration => {
    let newRegistId;
    set(state => {
      const newRegistration: Registration = {
        memberId: 1,
        memberName: 'test',
        registId: state.registrations.length + 1, // 임시 ID 생성, 실제 구현에서는 서버에서 반환된 ID 사용
        createdAt: new Date().toISOString(), // 현재 시간 설정
        approved: null, // 초기 승인 상태는 null
        ...registration,
      };

      newRegistId = newRegistration.registId;
      console.log('uuuuuuuu', newRegistration);

      return {
        registrations: [...state.registrations, newRegistration],
      };
    });

    return newRegistId;
  },

  updateApprovalStatus: (registId: number, approved: 'true' | 'false') =>
    set(state => {
      const updatedRegistrations = state.registrations.map(registration =>
        registration.registId === registId ? { ...registration, approved } : registration,
      );
      return { registrations: updatedRegistrations };
    }),
}));

export default useRegistrationStore;
