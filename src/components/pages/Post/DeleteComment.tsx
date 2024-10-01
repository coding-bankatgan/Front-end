import { fetchCommentsDeleteApi } from '@/api/postApi';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

interface DeletePostProps {
  commentId: number;
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const DeleteComment = ({ commentId, showAlert }: DeletePostProps) => {
  const navigate = useNavigate();

  /** 삭제 */
  const handleDelete = async () => {
    try {
      await fetchCommentsDeleteApi(commentId);
      showAlert('success', '댓글이 정상적으로 삭제되었습니다.');
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (error) {
      showAlert('error', '댓글 삭제에 실패하였습니다.');
    }
  };

  return (
    <div>
      <DropdownMenuItemStyled onClick={handleDelete}>삭제</DropdownMenuItemStyled>
    </div>
  );
};

const DropdownMenuItemStyled = styled(DropdownMenuItem)`
  color: ${({ theme }) => theme.colors.error};
`;

export default DeleteComment;
