import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import styled from '@emotion/styled';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface WithDrawProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const WithDraw = ({ showAlert }: WithDrawProps) => {
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const navigate = useNavigate();

  /** 탈퇴 */
  const handleWithdraw = async () => {
    console.log('회원 탈퇴 처리 중...');

    try {
      await api.delete('/members');
      showAlert('success', '회원탈퇴가 완료되었습니다.');
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setIsWithdrawDialogOpen(false);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      showAlert('error', '잠시 후 다시 시도해 주세요.');
      setIsWithdrawDialogOpen(false);
    }
  };

  return (
    <WithdrawWrapper>
      <AlertDialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <AlertDialogTrigger asChild>
          <p onClick={() => setIsWithdrawDialogOpen(true)} aria-label="회원 탈퇴 하기">
            회원탈퇴
          </p>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>회원 탈퇴 시 주의사항 안내</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                회원 탈퇴 시 작성하신 게시글의 경우 삭제되지 않으니
                <br /> 공개를 원하지 않는 게시글은 직접 삭제 요청드립니다.
                <br />
                <br />
                회원 가입 시 입력하신 개인정보는 <br />
                즉시 파기되며 복구하실 수 없습니다.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancelStyled
              onClick={() => setIsWithdrawDialogOpen(false)}
              aria-label="취소"
            >
              취소
            </AlertDialogCancelStyled>
            <AlertDialogActionStyled onClick={handleWithdraw} aria-label="회원 탈퇴 하기">
              탈퇴
            </AlertDialogActionStyled>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WithdrawWrapper>
  );
};

const WithdrawWrapper = styled.div`
  display: flex;
  margin-top: 20px;

  p {
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.error};
  }
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

export default WithDraw;
