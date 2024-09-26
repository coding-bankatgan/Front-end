import Cookies from 'js-cookie';
import api from './api/axios';

/** 로그인  */
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/members/signin', { email, password });
    console.log(response.data.accessToken);

    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    const cookie = Cookies.get('access_token');
    console.log(cookie);

    if (cookie === undefined) {
      Cookies.set('access_token', accessToken, { expires: 7 });
      Cookies.set('refresh_token', refreshToken, { expires: 7 });

      console.log('로그인 성공! 토큰이 저장되었습니다.');
    }
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
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

/** JWT 토큰에서 역할(role) 값을 가져오는 함수 */
export const getRoleFromToken = (): 'USER' | 'MANAGER' | null => {
  const token = Cookies.get('jwt');

  if (!token) {
    console.error('JWT 토큰이 없습니다.');
    return null;
  }

  const decoded = decodeJWT(token);
  return decoded ? decoded.role : null;
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
