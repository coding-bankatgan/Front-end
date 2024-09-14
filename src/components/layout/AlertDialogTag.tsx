import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import styled from '@emotion/styled';

interface AlertDialogTagProps {
  children: React.ReactNode;
}

const AlertDialogTag = ({ children }: AlertDialogTagProps) => {
  return (
    <AlertDialog>
      <AlertDialogTriggerStyled>#{children}</AlertDialogTriggerStyled>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>팔로우 태그</AlertDialogTitle>
          <AlertDialogDescription>'#{children}' 태그를 팔로우 하시겠습니까?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancelStyled>아니오</AlertDialogCancelStyled>
          <AlertDialogActionStyled>네</AlertDialogActionStyled>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AlertDialogTriggerStyled = styled(AlertDialogTrigger)`
  margin-right: 5px;
  padding: 3px 10px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;

  &:nth-last-of-type(1) {
    margin-right: 0;
  }
`;

const AlertDialogActionStyled = styled(AlertDialogAction)`
  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const AlertDialogCancelStyled = styled(AlertDialogCancel)`
  background-color: ${({ theme }) => theme.colors.brightGray};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

export default AlertDialogTag;
