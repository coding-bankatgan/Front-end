import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
  Home,
  Login,
  NotFound,
  AnnouncementBoard,
  AnnouncementDetail,
  AnnouncementForm,
  FAQ,
  Search,
  MyPage,
  EditMyPage,
  FollowTagList,
  MyPosts,
  Post,
  CreatePost,
  ReportBoard,
  ReportedPost,
  ReportForm,
  SignUp,
  SpecialtyDrinkBoard,
  SpecialtyDrinkDetail,
  SpecialtyDrinkForm,
} from '../components/pages';
import { getRoleFromToken } from '@/auth';

interface RouterProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const Router = ({ showAlert }: RouterProps) => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/signup', '/search'];
  const hideFooterPaths = [
    '/login',
    '/signup',
    '/search',
    '/specialty-drink',
    '/create-post',
    '/mypage/edit',
    '/announcement',
    'faq',
    '/report',
  ];

  const isHideHeader = hideHeaderPaths.some(path => location.pathname.startsWith(path));
  const isHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path));

  const role = getRoleFromToken();

  return (
    <>
      {!isHideHeader && <Header showAlert={showAlert} role={role} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/announcement" element={<AnnouncementBoard />} />
        <Route path="/announcement/:id" element={<AnnouncementDetail showAlert={showAlert} />} />
        <Route path="/announcement/form" element={<AnnouncementForm />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditMyPage showAlert={showAlert} />} />
        <Route path="/mypage/follow-tag-list" element={<FollowTagList />} />
        <Route path="/mypage/my-posts" element={<MyPosts />} />

        <Route path="/post/:id" element={<Post showAlert={showAlert} />} />
        <Route path="/create-post" element={<CreatePost />} />

        <Route path="/report" element={<ReportBoard showAlert={showAlert} />} />
        <Route path="/report/reported-post/:id" element={<ReportedPost />} />
        <Route path="/report/form" element={<ReportForm showAlert={showAlert} />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/specialty-drink" element={<SpecialtyDrinkBoard />} />
        <Route path="/specialty-drink/:id" element={<SpecialtyDrinkDetail />} />
        <Route
          path="/specialty-drink/form"
          element={<SpecialtyDrinkForm showAlert={showAlert} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isHideFooter && <Footer />}
    </>
  );
};

export default Router;
