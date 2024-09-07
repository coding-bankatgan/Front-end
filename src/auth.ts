import axios from 'axios';
import Cookies from 'js-cookie';

/** 로그인  */
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('/login', { email, password });
    const token = response.data.token;

    /**  JWT 토큰을 쿠키에 저장  */
    const cookie = Cookies.get('jwt');

    if (cookie === undefined) {
      Cookies.set('jwt', token, { expires: 7 });

      console.log('로그인 성공! 토큰이 저장되었습니다.');
    }

    /** token test용 후에 지우기 */
    // displaySub;
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};

/** JWT 토큰 디코딩 함수 */
export const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('JWT 디코딩 중 오류 발생:', error);
    return null;
  }
};

/** JWT 토큰에서 sub 값을 가져오는 함수 */
export const getSubFromToken = () => {
  const token = Cookies.get('jwt');

  if (!token) {
    console.error('JWT 토큰이 없습니다.');
    return null;
  }

  const decoded = decodeJWT(token);
  return decoded ? decoded.sub : null;
};

/** sub 값 콘솔 출력 */
export const displaySub = () => {
  const sub = getSubFromToken();
  if (sub) {
    console.log('JWT의 sub 값:', sub);
  } else {
    console.log('sub 값을 가져올 수 없습니다.');
  }
};
