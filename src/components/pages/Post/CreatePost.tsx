import { NoFooterLayout } from '@/styles/CommonStyles';
import styled from '@emotion/styled';
import PostStep1 from './PostStep1';
import PostStep2 from './PostStep2';
import PostStep3 from './PostStep3';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChangePage from './ChangePage';

const CreatePost = () => {
  const [step, setStep] = useState(1);
  const [isNext, setIsNext] = useState(true);

  const prevStep = () => {
    setIsNext(false);
    setStep(prevStep => prevStep - 1);
  };
  const nextStep = () => {
    setIsNext(true);
    setStep(prevStep => prevStep + 1);
  };

  return (
    <NoFooterLayout>
      <CreatePostWrapper>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <>
              <ChangePage prevStep={prevStep} progressValue={33} />
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: isNext ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isNext ? -100 : 100 }}
                transition={{ duration: 0.4 }}
              >
                <PostStep1 nextStep={nextStep} />
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
                <PostStep2 nextStep={nextStep} />
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
                <PostStep3 prevStep={prevStep} nextStep={nextStep} />
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
  min-width: 320px;
  width: 100%;
  min-height: calc(100vh - 100px);
  height: auto;
  margin: 20px;
`;

export default CreatePost;
