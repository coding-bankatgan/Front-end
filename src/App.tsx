import './App.css';
import { Global } from '@emotion/react';
import { ThemeProvider } from '@emotion/react';
import resetStyles from './styles/resetStyles';
import { globalStyles } from './styles/globalStyles';
import Router from './router/Router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styles/theme';
import ScrollToTop from './utils/ScrollToTop';
import { useState } from 'react';
import CustomAlert from '@/components/layout/CustomAlert';

function App() {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 2000); // 3초 후 알림 자동으로 사라지게 설정
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Global styles={[resetStyles, globalStyles]} />
        <BrowserRouter>
          <ScrollToTop />
          <Router showAlert={showAlert} />
          {alert && (
            <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
