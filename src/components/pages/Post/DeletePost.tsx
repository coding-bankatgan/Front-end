import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import styled from '@emotion/styled';
import { fetchPostsDelete } from '@/api/postApi';
import { useNavigate } from 'react-router-dom';

interface DeletePostProps {
  postId: number;
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const DeletePost = ({ postId, showAlert }: DeletePostProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  /** 삭제 */
  const handleDelete = async () => {
    try {
      console.log('게시글 삭제 중...');
      await fetchPostsDelete(postId);
      showAlert('success', '게시글이 정상적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      showAlert('error', '게시글 삭제에 실패하였습니다.');
      setIsDialogOpen(false);
    }
  };

  return (
    <DeleteWrapper>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTriggerStyled asChild>
          <p onClick={e => e.stopPropagation()}>삭제</p>
        </AlertDialogTriggerStyled>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span>정말로 이 게시글을 삭제하시겠습니까?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancelStyled onClick={() => setIsDialogOpen(false)}>
              취소
            </AlertDialogCancelStyled>
            <AlertDialogActionStyled onClick={handleDelete}>삭제</AlertDialogActionStyled>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteWrapper>
  );
};

const DeleteWrapper = styled.div`
  display: flex;
`;

const AlertDialogTriggerStyled = styled(AlertDialogTrigger)`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.error};
`;

const AlertDialogActionStyled = styled(AlertDialogAction)`
  background-color: ${({ theme }) => theme.colors.error};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
  }
`;

const AlertDialogCancelStyled = styled(AlertDialogCancel)`
  background-color: ${({ theme }) => theme.colors.brightGray};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

export default DeletePost;
