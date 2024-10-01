import { NoFooterLayout } from '@/styles/CommonStyles';
import styled from '@emotion/styled';
import PostStep1 from './PostStep1';
import PostStep2, { Drink } from './PostStep2';
import PostStep3 from './PostStep3';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChangePage from './ChangePage';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/api/axios';
import CustomAlert from '@/components/layout/CustomAlert';

const CreatePost = () => {
  const location = useLocation();
  const postToEdit = location.state?.postId ? location.state : null; // 수정 모드인지 확인
  const isEditMode = !!postToEdit; // 수정 모드 여부를 boolean으로 관리

  // 수정 모드일 때 step을 3으로 설정하는 useEffect 추가
  useEffect(() => {
    if (isEditMode && location.state?.step) {
      setStep(location.state.step); // location.state에서 step 값이 있을 경우 설정
    }
  }, [isEditMode, location.state]);

  const [step, setStep] = useState(1);
  const [isNext, setIsNext] = useState(true);
  const [category, setCategory] = useState(postToEdit?.category || '');
  const [imageName, setImageName] = useState('');
  const [formData, setFormData] = useState(new FormData());
  const [formattedContent, setFormattedContent] = useState(postToEdit?.initialContent || '');
  const [tags, setTags] = useState<string[]>(postToEdit?.initialTags || []);
  const [rating, setRating] = useState(postToEdit?.initialRating || 0);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [initialImageUrl] = useState(postToEdit?.initialImageUrl || '');

  const submitPost = async () => {
    if (tags.length < 1) {
      setAlert({ type: 'error', message: '태그는 최소 1개 이상 작성해주세요.' });
      return;
    } else if (!formattedContent || formattedContent.trim() === '') {
      setAlert({ type: 'error', message: '내용을 입력해주세요.' });
      return;
    }

    const tagsWithoutHash = tags.map(tag => tag.replace('#', ''));
    try {
      if (imageName !== '') {
        const imageUrl = await api.post('/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        await api.post('/posts', {
          drinkId: drinkData.id,
          type: category,
          content: formattedContent,
          rating: rating,
          tag: tagsWithoutHash,
          imageUrl: imageUrl.data,
        });
        if (isEditMode) {
          await api.put(`/posts/${postToEdit.postId}`, {
            drinkId: drinkData.id,
            type: category,
            content: formattedContent,
            rating,
            tag: tagsWithoutHash,
            imageUrl: imageUrl.data,
          });
        }
      } else {
        if (isEditMode) {
          await api.put(`/posts/${postToEdit.postId}`, {
            drinkId: drinkData.id,
            type: category,
            content: formattedContent,
            rating,
            tag: tagsWithoutHash,
            imageUrl: initialImageUrl,
          });
        } else {
          await api.post('/posts', {
            drinkId: drinkData.id,
            type: category,
            content: formattedContent,
            rating: rating,
            tag: tagsWithoutHash,
            imageUrl: drinkData.imageUrl,
          });
        }
      }
      navigate('/');
    } catch (error) {
      console.error('post error: ', error);
      setAlert({
        type: 'error',
        message: '게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
      return;
    }
  };

  useEffect(() => {
    for (let [_key, value] of formData.entries()) {
      if (value instanceof File) {
        setImageName(value.name);
      }
    }
  }, [formData]);

  const [drinkData, setDrinkData] = useState<Drink>({
    averageRating: 0,
    cost: 0,
    createdAt: '',
    degree: postToEdit?.degree || 0,
    description: '',
    type: postToEdit?.drinkType || '',
    id: postToEdit?.drinkId || 0,
    imageUrl: '',
    name: postToEdit?.drinkName || '',
    placeName: '',
    sweetness: postToEdit?.sweetness || 0,
  });
  const navigate = useNavigate();

  const prevBtn = () => {
    setIsNext(false);
    navigate(-1);
  };

  const nextBtn = () => {
    setIsNext(false);
    navigate('/');
  };

  const prevStep = () => {
    setIsNext(false);
    if (isEditMode && postToEdit?.postId) {
      navigate(`/post/${postToEdit.postId}`);
    } else {
      setStep(prevStep => prevStep - 1);
    }
  };

  const nextStep = () => {
    setIsNext(true);
    setStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };

  return (
    <NoFooterLayout>
      {alert && (
        <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}
      <CreatePostWrapper>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <>
              <ChangePage prevStep={prevBtn} progressValue={33} />
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: isNext ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isNext ? -100 : 100 }}
                transition={{ duration: 0.4 }}
                aria-label="게시글 작성 진행률 1/3"
              >
                <PostStep1 nextStep={nextStep} setCategory={setCategory} />
              </motion.div>
            </>
          )}
          {step === 2 && (
            <>
              <ChangePage prevStep={prevStep} progressValue={66} />
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: isNext ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isNext ? -100 : 100 }}
                transition={{ duration: 0.4 }}
                aria-label="게시글 작성 진행률 2/3"
              >
                <PostStep2 nextStep={nextStep} setDrinkData={setDrinkData} />
              </motion.div>
            </>
          )}
          {step === 3 && (
            <>
              <ChangePage prevStep={prevStep} progressValue={100} />
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: isNext ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isNext ? -100 : 100 }}
                transition={{ duration: 0.4 }}
                aria-label="게시글 작성 진행률 3/3"
              >
                <PostStep3
                  category={category}
                  drinkData={drinkData}
                  prevStep={prevStep}
                  nextStep={nextBtn}
                  setFormData={setFormData}
                  setImageName={setImageName}
                  setFormattedContent={setFormattedContent}
                  tags={tags}
                  setTags={setTags}
                  rating={rating}
                  setRating={setRating}
                  submitPost={submitPost}
                  initialContent={formattedContent}
                  initialImageUrl={initialImageUrl}
                  initialTags={tags}
                  initialRating={rating}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </CreatePostWrapper>
    </NoFooterLayout>
  );
};

const CreatePostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 60px);
  height: auto;
  background-color: ${({ theme }) => theme.colors.brightGray};
`;

export default CreatePost;
