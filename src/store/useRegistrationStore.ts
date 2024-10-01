import { create } from 'zustand';
import { fetchRegistrationsApi, fetchRegistrationsDetailApi } from '@/api/postApi';
import useMemberStore from '@/store/useMemberStore';
import useNotificationStore from '@/store/useNotificationStore';

interface Registration {
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
  approved: 'true' | 'false' | null;
}

interface RegistrationState {
  registrations: Registration[];
  registrationsDetail: Registration[];

  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  setPagination: (pagination: RegistrationState['pagination']) => void;

  setRegistrations: (registrations: Registration[]) => void;
  addRegistration: (
    registration: Omit<Registration, 'id' | 'memberId' | 'memberName' | 'createdAt' | 'approved'>,
  ) => void;

  updateApprovalStatus: (id: number, approved: 'true' | 'false') => void;

  fetchRegistrations: (page: number, size: number) => Promise<void>;
  fetchRegistrationsDetail: (id: number) => Promise<void>;
}

const useRegistrationStore = create<RegistrationState>(set => ({
  registrations: [],
  registrationsDetail: [],
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  setRegistrations: registrations => set({ registrations }),
  setPagination: pagination => set({ pagination }),
  fetchRegistrations: async (page: number, size: number) => {
    try {
      const data = await fetchRegistrationsApi(page, size);
      if (data) {
        set({ registrations: data.content });
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
        registrations: [],
        pagination: { totalElements: 0, totalPages: 0, size: 10, number: 0 },
      });
    }
  },
  fetchRegistrationsDetail: async id => {
    try {
      const data = await fetchRegistrationsDetailApi(id);
      set({ registrationsDetail: data });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ registrationsDetail: [] });
    }
  },

  addRegistration: registration => {
    let newRegistId;
    set(state => {
      const newRegistration: Registration = {
        memberId: 1,
        memberName: 'test',
        id: state.registrations.length + 1, // 임시 ID 생성, 실제 구현에서는 서버에서 반환된 ID 사용
        createdAt: new Date().toISOString(), // 현재 시간 설정
        approved: null, // 초기 승인 상태는 null
        ...registration,
      };

      newRegistId = newRegistration.id;

      return {
        registrations: [...state.registrations, newRegistration],
      };
    });

    return newRegistId;
  },

  updateApprovalStatus: (registId: number, approved: 'true' | 'false') =>
    set(state => {
      const updatedRegistrations = state.registrations.map(registration =>
        registration.id === registId ? { ...registration, approved } : registration,
      );
      const updatedRegistration = updatedRegistrations.find(reg => reg.id === registId);

      if (updatedRegistration) {
        const { memberId, drinkName } = updatedRegistration;
        const { currentUser } = useMemberStore.getState();

        // 신청자의 memberId와 현재 사용자의 id가 일치하는 경우에만 알림 발송
        if (currentUser && currentUser.id === memberId) {
          const notification = {
            id: Date.now(), // Temporary ID, normally this should come from the backend
            memberId, // 신청한 사용자에게 알림 발송
            postId: registId,
            type: 'REGISTRATION',
            content:
              approved === 'true'
                ? `전달주신 ${drinkName} 특산주 정보 확인되어 등록 완료되었습니다! :D`
                : `전달주신 ${drinkName} 정보가 확인되지 않습니다. 재등록 또는 반려 사유의 경우 매니저에게 문의 바랍니다.`,
            createdAt: new Date().toISOString(),
            readStatus: true,
          };

          useNotificationStore.getState().addNewNotification(notification);
        }
      }

      return { registrations: updatedRegistrations };
    }),
}));

export default useRegistrationStore;
