import './App.css';
import { Global } from '@emotion/react';
import { ThemeProvider } from '@emotion/react';
import resetStyles from './styles/resetStyles';
import { globalStyles } from './styles/globalStyles';
import Router from './router/Router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styles/theme';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Global styles={[resetStyles, globalStyles]} />
        <BrowserRouter>
          <ScrollToTop />
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
