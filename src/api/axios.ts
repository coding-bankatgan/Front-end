import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api', // API 주소 설정 필요
});

/**요청 인터셉터: 모든 요청에 Access Token 자동 추가*/
api.interceptors.request.use(
  config => {
    console.log(config.url);

    if (
      config.url &&
      (config.url.startsWith('/members/signin') ||
        config.url.startsWith('/members/signup') ||
        config.url.startsWith('/google/join') ||
        config.url.startsWith('/google/login-uri') ||
        config.url.startsWith('/members/email') ||
        config.url.startsWith('/members/request-password-reset'))
    ) {
      console.log('토큰 헤더 생략 성공');

      return config;
    }

    const accessToken = Cookies.get('access_token');

    if (accessToken) {
      config.headers['Access-Token'] = accessToken;
    } else {
      // window.location.href = '/login';
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/**응답 인터셉터: 401 에러 처리 및 토큰 갱신*/
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refresh_token');

        const refreshResponse = await api.post(
          '/members',
          {},
          { headers: { 'Refresh-Token': refreshToken } },
        );
        console.log('access token 재발급');

        const newAccessToken = refreshResponse.headers['Access-Token'];

        Cookies.set('access_token', newAccessToken);

        originalRequest.headers['Access-Token'] = newAccessToken;
        return api(originalRequest);
      } catch (error) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
