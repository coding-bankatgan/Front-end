import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '@/auth';
import { Input } from '@/components/ui/input';
import Cookies from 'js-cookie';
import symbol from '../../../public/symbol.png';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import api from '@/api/axios';

// 첫 번째 애니메이션
const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

// 두 번째 애니메이션
const slideUpWithFade = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeInOut' } },
};

const Login = () => {
  const [_, setIsVisible] = useState(true);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showSignupComplete, setShowSignupComplete] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [controls]);

  // useEffect(() => {
  //   const dd = async () => {
  //     const gg = await api.get('/google/login-uri');
  //     console.log(gg);
  //   };

  //   dd;
  // }, [showLoginError]);

  /** signup -> login 진입시 */
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('signup') === 'true') {
      setIsVisible(false);
      setShowSignupComplete(true);

      setTimeout(() => {
        setShowSignupComplete(false);
      }, 3000);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('에러 테스트');
      setShowLoginError(true);
      setTimeout(() => {
        setShowLoginError(false);
      }, 5000);
    }
  };

  useEffect(() => {
    const fetchGoogleLoginUri = async () => {
      try {
        const response = await api.get('/google/login-uri');
        console.log(response.data);
      } catch (error) {
        console.error('구글 로그인 URI를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchGoogleLoginUri();
  }, []);

  /** google 로그인 인증 */
  // const sendAuthCode = async (authCode: string) => {
  //   try {
  //     const response = await api.post('/google/join', {
  //       code: authCode,
  //     });
  //     console.log(response);

  //     const { access_token, refresh_token } = response.data;

  //     Cookies.set('access_token', access_token);
  //     Cookies.set('refresh_token', refresh_token);

  //     return { access_token, refresh_token };
  //   } catch (error) {
  //     console.error('Failed to send Auth Code:', error);
  //     throw error;
  //   }
  // };

  const getGoogleLoginUri = async () => {
    try {
      const response = await api.get('/google/login-uri');
      return response.data; // 백엔드에서 반환한 URI를 가져옵니다.
    } catch (error) {
      console.error('Error fetching Google login URI:', error);
      return null;
    }
  };

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const googleLoginUri = await getGoogleLoginUri();
    if (googleLoginUri) {
      window.location.href = googleLoginUri;
    }
  };

  /** 후에 구글 리디렉션 주소에 옮기기 */
  const location = useLocation();
  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(location.search);

      const authCode = params.get('code'); // URL에서 인증 코드 추출

      if (authCode) {
        try {
          const response = await api.post('/google/join', null, {
            params: {
              code: authCode,
            },
          });

          const { accessToken, refreshToken } = response.data;

          Cookies.set('access_token', accessToken);
          Cookies.set('refresh_token', refreshToken);

          navigate('/');
        } catch (error) {
          console.error('Error during Google login:', error);
        }
      }
    };

    fetchToken();
  }, [location]);

  return (
    <AuthLayout>
      {showSignupComplete && <Complete>회원가입이 완료되었습니다.</Complete>}
      {showLoginError && <Error>이메일 또는 패스워드를 확인해주세요.</Error>}
      <AnimatePresence>
        {isLoading ? (
          <Container>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeIn}
              key="loading"
            >
              <LogoImage src={symbol} alt="오늘한잔" />
            </motion.div>
          </Container>
        ) : (
          <LoadFinish>
            {/* <motion.div initial="hidden" animate="visible" variants={fadeIn}> */}
            {/* </motion.div> */}
            <FormContainer onSubmit={handleSubmit}>
              <motion.div initial="hidden" animate="visible" variants={slideUpWithFade} key="form">
                <LogoImage src={symbol} alt="오늘한잔" />
                <Heading>지역 특산주를 위한 플랫폼</Heading>
                <Label htmlFor="email">아이디(이메일)</Label>
                <Input type="email" name="email" id="email" />
                <Label htmlFor="password">패스워드</Label>
                <Input type="password" name="password" id="password" />
                <LoginBtn type="submit">로그인</LoginBtn>
                <Link to={'/signup'}>
                  <SignupBtn>회원가입</SignupBtn>
                </Link>
                <GoogleBtn type="button" onClick={handleLogin}>
                  <GoogleIcon /> Google로 로그인
                </GoogleBtn>
              </motion.div>
            </FormContainer>
          </LoadFinish>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default Login;

const AuthLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
  @media (orientation: landscape) {
    height: auto;
    min-height: 100vh;
  }
`;

const LoadFinish = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const LogoImage = styled.img`
  width: 140px;
  height: 140px;
  margin: 0 auto 0 auto;
`;

// const spin = keyframes`
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// `;

// const Spinner = styled.div`
//   width: 80px;
//   height: 80px;
//   border: 12px solid ${props => props.theme.colors.gray};
//   border-top-color: ${props => props.theme.colors.tertiary};
//   margin-top: 20px;
//   border-radius: 50%;
//   animation: ${spin} 1s linear infinite;
// `;

const Container = styled.div`
  idth: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.form`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};

  input {
    margin-bottom: 16px;
    background-color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    font-size: ${({ theme }) => theme.fontSizes.small};

    &:focus {
      border: 1px solid ${({ theme }) => theme.colors.focusShadowOrange};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
    }
  }

  a {
    width: 100%;
  }
`;

const Heading = styled.p`
  width: 100%;
  margin: 5px auto 25px auto;
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-align: center;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  &::before {
    margin-right: 3px;
    content: '*';
    color: ${({ theme }) => theme.colors.point};
  }
`;

const LoginBtn = styled.button`
  width: 100%;
  height: 45px;
  margin: 12px 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-radius: 30px;
  text-align: center;
`;

const SignupBtn = styled.button`
  width: 100%;
  height: 45px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-radius: 30px;
  text-align: center;
`;

const GoogleBtn = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45px;
  margin-top: 12px;
  background-color: ${({ theme }) => theme.colors.white};
  text-align: center;
  border-radius: 30px;

  svg {
    width: 22px;
    margin-right: 3px;
  }

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 30px;
    padding: 1px;
    background: radial-gradient(circle at top left, #ea4335, #fbbc05, #34a853, #4285f4);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const Complete = styled.button`
  position: absolute;
  width: 310px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.success};
  border: 1px solid;
  border-radius: 10px;
  border-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  top: 30px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`;

const Error = styled.button`
  position: absolute;
  width: 310px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.error};
  border: 1px solid;
  border-radius: 10px;
  border-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  top: 30px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`;
