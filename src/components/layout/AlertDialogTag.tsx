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

const AlertDialogTag = () => {
  return (
    <AlertDialog>
      <AlertDialogTriggerStyled>#달달한</AlertDialogTriggerStyled>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>팔로우 태그</AlertDialogTitle>
          <AlertDialogDescription>'#달달한' 태그를 팔로우 하시겠습니까?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>아니오</AlertDialogCancel>
          <AlertDialogAction>네</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AlertDialogTriggerStyled = styled(AlertDialogTrigger)`
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 3px 10px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
`;

export default AlertDialogTag;
