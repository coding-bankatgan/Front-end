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
import useMemberStore from '@/store/useMemberStore';
import useNotificationStore from '@/store/useNotificationStore';

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
}: PostStep3Props) => {
  const alcohols = alcoholsData;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // const [rating, setRating] = useState(0);
  const ratingChanged = (newRating: number) => {
    setRating(newRating);
  };

  const level = Math.round(drinkData.sweetness / 2);

  const [tagValue, setTagValue] = useState('');
  // const [tags, setTags] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && tags.length < 3) {
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      const newFormData = new FormData();
      newFormData.append('image', file);
      setFormData(newFormData);
    }
  };
  const handleDeleteImage = () => {
    setImagePreview(null);
    setImageName('');
  };

  const [postContent, setPostContent] = useState('');
  // const [formattedContent, setFormattedContent] = useState('');
  const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  useEffect(() => {
    const formatted = postContent.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />');
    setFormattedContent(formatted);
  }, [postContent]);

  /** 알림 발송 */
  const { currentUser, followTags } = useMemberStore();
  const { addNewNotification } = useNotificationStore();

  const handlePostSubmit = async () => {
    await submitPost();

    tags.forEach(tag => {
      if (followTags.some(followTag => followTag.tagName === tag.slice(1))) {
        addNewNotification({
          id: Date.now(), // 임시 ID
          memberId: currentUser?.id!,
          postId: 10, // 임시 postId
          type: 'FOLLOW',
          content: `새로운 포스팅이 있습니다: ${tag}`,
          createdAt: new Date().toISOString(),
          isNew: true,
        });
      }
      console.log('success');
    });
  };

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
              <DeleteImageButton onClick={handleDeleteImage}>✖</DeleteImageButton>
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
          <Input
            type="text"
            id="alcoholType"
            placeholder={alcohols[drinkData.drinkType]}
            disabled
          />
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
        <div>
          <Label htmlFor="rating">평점</Label>
          <div id="rating">
            <ReactStars
              count={5}
              value={rating}
              onChange={ratingChanged}
              size={30}
              half={true}
              color1={'white'}
            />
            <span>( {rating} 점 )</span>
          </div>
        </div>
        <Textarea
          placeholder="포스팅 내용을 작성해주세요."
          value={postContent}
          onChange={handlePostContentChange}
        />
        <TagsContainer>
          {tags.map((tag, index) => (
            <Tag key={index}>
              {tag}
              <DeleteButton onClick={() => handleDeleteTag(tag)}>✖</DeleteButton>
            </Tag>
          ))}
          <Input
            value={tagValue}
            onChange={e => setTagValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length >= 3 ? '태그는 최대 3개까지 입니다!' : '태그 입력하기'}
            disabled={tags.length >= 3}
          />
        </TagsContainer>
      </PostContent>
      <ButtonStyled onClick={handlePostSubmit}>완료</ButtonStyled>
    </>
  );
};

const DeleteImageButton = styled.div`
  text-align: center;
  width: 33px;
  height: 33px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  background: none;
  z-index: 10;
`;

const DeleteButton = styled.button`
  color: ${({ theme }) => theme.colors.white};
  margin-left: 5px;
  font-size: 16px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 5px;

  input {
    margin-top: 5px;
    &::placeholder {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50px;
  padding: 4px 10px;
  margin: 5px;
  font-size: 14px;
  letter-spacing: 1.5px;
`;
const SweetContainer = styled.div`
  width: 100%;
`;

interface CircleProps {
  isActive: boolean;
}
const Circle = styled.span<CircleProps>`
  width: 28px;
  height: 28px;
  border: 4px solid white;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.secondary : theme.colors.white};
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

  transform: translateY(11.9px);
`;

const PostTitle = styled.b`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: ${({ theme }) => theme.fontSizes.medium};

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
  background-color: ${({ theme }) => theme.colors.brightGray};
  overflow: hidden;
  img {
    overflow: hidden;
    z-index: 9;
  }

  input {
    display: none;
  }

  button {
    background-color: ${({ theme }) => theme.colors.gray};
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
  }

  input {
    width: 100%;
    background-color: ${({ theme }) => theme.colors.brightGray};
    color: ${({ theme }) => theme.colors.darkGray};
    border: 1px solid ${({ theme }) => theme.colors.gray};

    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.black};
    }
  }

  textarea {
    min-height: 200px;
    height: auto;
    background-color: ${({ theme }) => theme.colors.brightGray};
    resize: none;

    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
  #rating {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 10px;
    > span {
      padding-left: 10px;
    }
  }

  #sweetness {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 40px 0 20px 0;
  }
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 45px;
  margin-top: 30px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-radius: 30px;

  &:active,
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export default PostStep3;
