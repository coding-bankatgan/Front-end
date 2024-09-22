import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const getWeekRange = (): string => {
  // 현재 날짜
  const today = dayjs();

  // 이번 주 월요일과 일요일 계산
  const startOfWeek = today.startOf('isoWeek'); // 월요일
  const endOfWeek = today.endOf('isoWeek'); // 일요일

  // 날짜 포맷팅
  const formatDate = (date: dayjs.Dayjs): string => date.format('MM.DD');

  // 주 범위 문자열 생성
  return `${formatDate(startOfWeek)} ~ ${formatDate(endOfWeek)}`;
};

export default getWeekRange;
