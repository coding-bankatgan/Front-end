import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
  Home,
  Login,
  NotFound,
  Announcement,
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

const Router = () => {
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

  return (
    <>
      {!isHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditMyPage />} />
        <Route path="/mypage/follow-tag-list" element={<FollowTagList />} />
        <Route path="/mypage/my-posts" element={<MyPosts />} />

        <Route path="/post/:id" element={<Post />} />
        <Route path="/create-post" element={<CreatePost />} />

        <Route path="/report" element={<ReportBoard />} />
        <Route path="/report/reported-post/:id" element={<ReportedPost />} />
        <Route path="/report/form" element={<ReportForm />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/specialty-drink" element={<SpecialtyDrinkBoard />} />
        <Route path="/specialty-drink/:registId" element={<SpecialtyDrinkDetail />} />
        <Route path="/specialty-drink/form" element={<SpecialtyDrinkForm />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isHideFooter && <Footer />}
    </>
  );
};

export default Router;
