import styled from '@emotion/styled';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PlusIcon from '@/assets/icons/PlusIcon';
import { Textarea } from '@/components/ui/textarea';
import ReactStars from 'react-stars';
import { useEffect, useRef, useState } from 'react';
import { Drink } from './PostStep2';
import { alcoholsData } from '@/data/alcoholsData';
// import useMemberStore from '@/store/useMemberStore';
// import useNotificationStore from '@/store/useNotificationStore';
import CloseIcon from './../../../assets/icons/CloseIcon';
import { Badge } from '@/components/ui/badge';

interface PostStep3Props {
  category: string;
  drinkData: Drink;
  prevStep: () => void;
  nextStep: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setImageName: React.Dispatch<React.SetStateAction<string>>;
  setFormattedContent: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  submitPost: () => void;
  initialContent: string; // 추가: 초기 콘텐츠
  initialImageUrl: string; // 추가: 초기 이미지 URL
  initialTags: string[]; // 추가: 초기 태그
  initialRating: number; // 추가: 초기 평점
}

const PostStep3 = ({
  category,
  drinkData,
  setFormData,
  setImageName,
  setFormattedContent,
  tags,
  setTags,
  rating,
  setRating,
  submitPost,
  initialContent,
  initialImageUrl,
  initialTags,
  initialRating,
}: PostStep3Props) => {
  const alcohols = alcoholsData;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const ratingChanged = (newRating: number) => {
    if (category === 'AD') {
      setRating(0);
    }
    setRating(newRating);
  };

  const level = Math.round(drinkData.sweetness / 2);

  const [tagValue, setTagValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tags.length < 3) {
      e.preventDefault();
      const newTag = tagValue.trim();
      if (newTag && !tags.includes(`#${newTag}`)) {
        setTags(prevTags => [...prevTags, `#${newTag}`]);
        setTagValue('');
      }
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToDelete));
  };

  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl);

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      const newFormData = new FormData();
      newFormData.append('multipartFile', file);
      setFormData(newFormData);
    }
  };
  const handleDeleteImage = () => {
    setImagePreview(null);
    setImageName('');
  };

  const [postContent, setPostContent] = useState(initialContent || '');
  // const [formattedContent, setFormattedContent] = useState('');
  const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  useEffect(() => {
    const formatted = postContent.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />');
    setFormattedContent(formatted);
  }, [postContent]);

  /** msw서버용 알림 발송 */
  // const { currentUser, followTags } = useMemberStore();
  // const { addNewNotification } = useNotificationStore();

  // const handlePostSubmit = async () => {
  //   await submitPost();

  //   tags.forEach(tag => {
  //     if (followTags.some(followTag => followTag.tagName === tag.slice(1))) {
  //       addNewNotification({
  //         id: Date.now(), // 임시 ID
  //         memberId: currentUser?.id!,
  //         postId: 10, // 임시 postId
  //         type: 'FOLLOW',
  //         content: `새로운 포스팅이 있습니다: ${tag}`,
  //         createdAt: new Date().toISOString(),
  //         isNew: true,
  //       });
  //     }
  //     console.log('success');
  //   });
  // };

  // 수정
  useEffect(() => {
    const formattedTags = initialTags.map(tag => (tag.startsWith('#') ? tag : `#${tag}`));
    if (JSON.stringify(formattedTags) !== JSON.stringify(tags)) {
      setTags(formattedTags);
    }

    if (initialRating !== rating) {
      setRating(initialRating);
    }
  }, [initialTags, initialRating, tags, rating]);

  return (
    <>
      <PostTitle>
        <span>{category === 'REVIEW' ? '리뷰' : '광고'}</span>
        {drinkData.name}
      </PostTitle>
      <PostContent>
        <ImgSelect>
          {/* <input type="file" accept="image/*" ref={fileInputRef} />
          <Button onClick={handleBtnClick}>
            <PlusIcon />
          </Button> */}
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="미리보기 이미지"></img>
              <DeleteImageButton onClick={handleDeleteImage}>
                <CloseIcon />
              </DeleteImageButton>
            </>
          ) : (
            <>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
              <Button onClick={handleBtnClick}>
                <PlusIcon />
              </Button>
            </>
          )}
        </ImgSelect>
        <div>
          <Label htmlFor="alcoholType">주종</Label>
          <Input type="text" id="alcoholType" placeholder={alcohols[drinkData.type]} disabled />
        </div>
        <div>
          <Label htmlFor="degree">도수</Label>
          <Input type="text" id="degree" placeholder={`${drinkData.degree}%`} disabled />
        </div>
        <div>
          <Label htmlFor="sweetness">당도</Label>
          <SweetContainer>
            <div id="sweetness">
              {[...Array(5)].map((_, idx) => (
                <>
                  {idx > 0 && <Line />}
                  <Circle isActive={level === idx + 1}>
                    {idx === 0 && <span>쓰다</span>}
                    {idx === 4 && <span>달다</span>}
                  </Circle>
                </>
              ))}
            </div>
          </SweetContainer>
        </div>
        {category !== 'AD' && (
          <RatingContainer>
            <Label htmlFor="rating">평점</Label>
            <div id="rating">
              <ReactStars
                count={5}
                value={rating}
                onChange={ratingChanged}
                size={25}
                half={true}
                color1={'white'}
              />
              <span>{rating}점</span>
            </div>
          </RatingContainer>
        )}
        <TextareaStyled
          placeholder="포스팅 내용을 작성해주세요."
          value={postContent || ''}
          onChange={handlePostContentChange}
        />
        <TagsContainer>
          <BadgeWrapper>
            {tags.map((tag, index) => (
              <BadgeStyled key={index}>
                {tag}
                <DeleteButton onClick={() => handleDeleteTag(tag)}>
                  <CloseIcon />
                </DeleteButton>
              </BadgeStyled>
            ))}
          </BadgeWrapper>
          <Input
            value={tagValue}
            onChange={e => setTagValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              tags.length >= 3 ? '태그는 최대 3개까지 작성할 수 있습니다.' : '태그 입력하기'
            }
            disabled={tags.length >= 3}
          />
        </TagsContainer>
        <ButtonStyled onClick={submitPost}>완료</ButtonStyled>
      </PostContent>
    </>
  );
};

const TextareaStyled = styled(Textarea)`
  margin-bottom: 10px;
`;

const RatingContainer = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

export const DeleteImageButton = styled.div`
  padding: 7px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;

  svg {
    color: ${({ theme }) => theme.colors.error};
    width: 20px;
    height: 20px;
  }
`;

export const DeleteButton = styled.button`
  color: ${({ theme }) => theme.colors.white};
  margin-left: 5px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  overflow-x: scroll;
  overflow-y: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-color: ${({ theme }) => theme.colors.white} !important;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const BadgeStyled = styled(Badge)`
  flex-shrink: 0;
  width: auto;
  height: 100%;
  margin-right: 8px;
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.secondary} !important;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: normal;
  border-radius: 20px !important;

  :nth-last-of-type(1) {
    margin-right: 0;
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
  }

  span:nth-of-type(1) {
    margin-right: 5px;
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span:nth-of-type(2) {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const SweetContainer = styled.div`
  width: 100%;
`;

interface CircleProps {
  isActive: boolean;
}

const Circle = styled.span<CircleProps>`
  width: 25px;
  height: 25px;
  border: 4px solid white;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.point : theme.colors.white};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: ${({ theme }) => theme.fontSizes.small};
    min-width: 25px;
    transform: translateY(-32px);
  }
`;

const Line = styled.span`
  width: 30px;
  height: 4px;
  background-color: white;

  transform: translateY(11px);
`;

const PostTitle = styled.b`
  display: flex;
  align-items: center;
  padding: 0 20px 20px 20px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};

  span {
    display: inline-block;
    margin-right: 5px;
    padding: 2px 10px;
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: normal;
    border-radius: 20px;
  }
`;

const ImgSelect = styled.div`
  position: relative;
  min-width: 316px;
  width: auto;
  height: 316px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.brightGray};
  border-radius: 10px;
  overflow: hidden;

  img {
    overflow: hidden;
    object-fit: contain;
    z-index: 9;
  }

  input {
    display: none;
  }

  button {
    background-color: ${({ theme }) => theme.colors.tertiary};
    color: ${({ theme }) => theme.colors.white};
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 30px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const PostContent = styled.section`
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.white};

  img {
    min-width: 316px;
    width: auto;
    min-height: 316px;
    height: auto;
  }

  > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    div {
      background-color: ${({ theme }) => theme.colors.brightGray};
      border-radius: 5px;
    }
  }

  label {
    width: 30px;
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.black};
  }

  input {
    width: 100%;
    background-color: ${({ theme }) => theme.colors.brightGray};
    color: ${({ theme }) => theme.colors.darkGray};
    border: 1px solid ${({ theme }) => theme.colors.gray};

    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.black};
    }
  }

  textarea {
    min-height: 200px;
    height: auto;
    background-color: ${({ theme }) => theme.colors.brightGray};
    color: ${({ theme }) => theme.colors.black};
    resize: none;

    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }

  #rating {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 10px;
    color: ${({ theme }) => theme.colors.black};

    > span {
      padding-left: 10px;
    }
  }

  #sweetness {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 40px 0 20px 0;
    color: ${({ theme }) => theme.colors.black};
  }
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 45px;
  margin: 10px 0 20px 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-radius: 30px;

  &:active,
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${({ theme }) => theme.colors.black};

  input {
    border: 0 !important;

    ::placeholder {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

export default PostStep3;
