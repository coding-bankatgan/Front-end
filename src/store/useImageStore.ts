import create from 'zustand';

interface ImageStoreState {
  imageUrls: Record<number, string>; // id와 imageUrl 매핑
  setImageUrl: (id: number, url: string) => void; // 이미지 URL 설정 함수
  clearImageUrl: (id: number) => void; // 특정 id의 이미지 URL 삭제 함수
}

const useImageStore = create<ImageStoreState>(set => ({
  imageUrls: {}, // 초기 상태로 빈 객체
  setImageUrl: (id, url) =>
    set(state => ({
      imageUrls: { ...state.imageUrls, [id]: url }, // id에 따른 이미지 URL 저장
    })),
  clearImageUrl: id =>
    set(state => {
      const updatedUrls = { ...state.imageUrls };
      delete updatedUrls[id]; // 특정 id의 이미지 URL 삭제
      return { imageUrls: updatedUrls };
    }),
}));

export default useImageStore;
