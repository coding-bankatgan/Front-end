import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAnnouncementModify, fetchAnnouncementWriteApi } from '@/api/postApi';
import { fetchImageUploadApi } from '@/api/postApi';
import PlusIcon from '@/assets/icons/PlusIcon';
import useImageStore from '@/store/useImageStore';

const writeAnnouncement = async (title: string, content: string) => {
  try {
    const response = await fetchAnnouncementWriteApi(title, content);
    return response;
  } catch (err) {
    console.error('Error writing announcement: ', err);
  }
};

interface AnnouncementFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImageUrl?: string;
  announcementId?: number;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = () => {
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const location = useLocation();
  const {
    initialTitle = '',
    initialContent = '',
    initialImageUrl = '',
    announcementId,
  } = location.state || {};

  //** 이미지 업로드 */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleBtnClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleAnnouncementSubmit = async () => {
    if (newTitle.trim() === '' || newContent.trim() === '') return;

    try {
      const file = fileInputRef.current?.files?.[0];
      let uploadedImageUrl = '';

      if (file) {
        const imageResponse = await fetchImageUploadApi(file);
        uploadedImageUrl = imageResponse;
      }
      if (announcementId) {
        const response = await fetchAnnouncementModify(announcementId, newTitle, newContent);
        const updatedAnnouncement = {
          ...response,
          imageUrl: uploadedImageUrl,
        };

        const { setImageUrl } = useImageStore.getState();
        setImageUrl(announcementId, uploadedImageUrl);

        navigate(`/announcement/${announcementId}`, { state: updatedAnnouncement });
      } else {
        const response = await writeAnnouncement(newTitle, newContent);
        if (response) {
          const newAnnouncementData = {
            ...response,
            imageUrl: uploadedImageUrl,
          };

          const { setImageUrl } = useImageStore.getState();
          setImageUrl(response.id, uploadedImageUrl);

          setNewTitle('');
          setNewContent('');

          navigate(`/announcement/${newAnnouncementData.id}`, { state: newAnnouncementData });
          // navigate('/announcement', { state: { newAnnouncement: newAnnouncementData } });
        }
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  useEffect(() => {
    if (announcementId) {
      setNewTitle(initialTitle);
      setNewContent(initialContent);
      setImageUrl(initialImageUrl);
    }
  }, [announcementId, initialTitle, initialContent, initialImageUrl]);

  const handleCancelClick = () => {
    navigate('/announcement');
  };

  return (
    <NoFooterLayout>
      <ContentWrapper>
        <TitleStyled>{announcementId ? '공지 수정' : '공지 등록'}</TitleStyled>
        <FormContentWrapper>
          <Label>제목</Label>
          <Input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
          />
          <Label>내용</Label>
          <TextareaStyled
            placeholder="공지 내용 등록"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            required
          />
        </FormContentWrapper>
        <Label>이미지</Label>
        <FormImgWrapper>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="이미지 미리보기"
              onClick={handleBtnClick}
              style={{
                minWidth: '316px',
                height: '316px',
                objectFit: 'contain',
                cursor: 'pointer',
              }}
            />
          ) : (
            <Button onClick={handleBtnClick}>
              <PlusIcon />
            </Button>
          )}
        </FormImgWrapper>
        <FormBottomStyled>
          <Button onClick={handleCancelClick}>취소</Button>
          <Button onClick={handleAnnouncementSubmit}>등록</Button>
        </FormBottomStyled>
      </ContentWrapper>
    </NoFooterLayout>
  );
};

const TitleStyled = styled.span`
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;
  margin-bottom: 10px;
`;

const FormContentWrapper = styled.div`
  input {
    margin-bottom: 10px;
    background-color: ${({ theme }) => theme.colors.brightGray};
  }

  > input,
  textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadowGray};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }
`;

const Label = styled.label`
  margin: 5px 0;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  :not(:last-child)::before {
    content: '*';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.point};
  }
  :last-child {
    font-size: ${({ theme }) => theme.fontSizes.xxsmall};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 100px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  resize: none;
`;

const FormImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 316px;
  margin-top: -3px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
  overflow: hidden;
  object-fit: contain;

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

const FormBottomStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  button {
    width: 48%;
    height: 45px;
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 30px;

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.lightGray};
      color: ${({ theme }) => theme.colors.darkGray};
    }

    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default AnnouncementForm;
