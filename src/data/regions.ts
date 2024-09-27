export interface Regions {
  id: number;
  value: string;
  name: string;
}

export const regions: Regions[] = [
  { id: 1, value: 'seoul', name: '서울' },
  { id: 2, value: 'busan', name: '부산' },
  { id: 3, value: 'daegu', name: '대구' },
  { id: 4, value: 'incheon', name: '광주' },
  { id: 5, value: 'gwangju', name: '경기' },
  { id: 6, value: 'daejeon', name: '울산' },
  { id: 7, value: 'ulsan', name: '충북' },
  { id: 8, value: 'sejong', name: '충남' },
  { id: 9, value: 'gyeonggi', name: '경북' },
  { id: 10, value: 'gangwon', name: '경남' },
  { id: 11, value: 'chungbuk', name: '전북' },
  { id: 12, value: 'chungnam', name: '전남' },
  { id: 13, value: 'jeonbuk', name: '인천' },
  { id: 14, value: 'jeonnam', name: '세종' },
  { id: 15, value: 'gyeongbuk', name: '강원' },
  { id: 16, value: 'gyeongnam', name: '제주' },
];
