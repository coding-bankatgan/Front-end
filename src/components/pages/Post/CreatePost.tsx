import { NoFooterLayout } from '@/styles/CommonStyles';
import styled from '@emotion/styled';
import PostStep1 from './PostStep1';
import PostStep2, { Drink } from './PostStep2';
import PostStep3 from './PostStep3';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChangePage from './ChangePage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [step, setStep] = useState(1);
  const [isNext, setIsNext] = useState(true);
  const [category, setCategory] = useState('');
  const [imageName, setImageName] = useState('');
  const [formData, setFormData] = useState(new FormData());
  const [formattedContent, setFormattedContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const tagsWithoutHash = tags.map(tag => tag.replace('#', ''));
    console.log(tagsWithoutHash);

    const data = {
      drinkId: drinkData.id,
      type: category,
      content: formattedContent,
      rating: rating,
      tag: tagsWithoutHash,
      imageUrl: 'url',
    };
    console.log(data);
  }, [tags]);

  const submitPost = async () => {
    const tagsWithoutHash = tags.map(tag => tag.replace('#', ''));
    try {
      if (imageName !== '') {
        const imageUrl = await axios.post('/api/image', formData);

        await axios.post('/api/post', {
          drinkId: drinkData.id,
          type: category,
          content: formattedContent,
          rating: rating,
          tag: tagsWithoutHash,
          imageUrl: imageUrl.data,
        });

        console.log({
          drinkId: drinkData.id,
          type: category,
          content: formattedContent,
          rating: rating,
          tag: tagsWithoutHash,
          imageUrl: imageUrl.data,
        });
      } else {
        await axios.post('/api/post', {
          drinkId: drinkData.id,
          type: category,
          content: formattedContent,
          rating: rating,
          tag: tagsWithoutHash,
          imageUrl: drinkData.imageUrl,
        });
      }
    } catch {
      console.error('post error');
    }
  };

  useEffect(() => {
    for (let [key, value] of formData.entries()) {
      console.log(key);
      if (value instanceof File) {
        setImageName(value.name);
      } else {
        console.log(value); // 문자열 값
      }
    }
  }, [formData]);

  useEffect(() => {
    console.log(imageName);
  }, [imageName]);
  const [drinkData, setDrinkData] = useState<Drink>({
    averageRating: 0,
    cost: 0,
    createdAt: '',
    degree: 0,
    description: '',
    drinkType: '',
    id: 0,
    imageUrl: '',
    name: '',
    placeName: '',
    sweetness: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log(category);
  }, [category]);

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
    setStep(prevStep => prevStep - 1);
  };

  const nextStep = () => {
    setIsNext(true);
    setStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };

  return (
    <NoFooterLayout>
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
