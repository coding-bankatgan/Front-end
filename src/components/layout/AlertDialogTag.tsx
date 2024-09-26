import { useState } from 'react';
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
import { useMemberStore } from '@/store/useMemberStore';

interface AlertDialogTagProps {
  children: React.ReactNode;
  tagId: number;
}

const AlertDialogTag = ({ children, tagId }: AlertDialogTagProps) => {
  const { currentUser, addFollowTag } = useMemberStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tagName = typeof children === 'string' ? children : '';
  console.log(currentUser);

  const handleAddTagToFollow = async () => {
    if (currentUser) {
      const followTag = {
        memberId: currentUser.id,
        memberName: currentUser.name,
        tagId,
        tagName,
      };
      await addFollowTag(followTag);
      setIsDialogOpen(false);
    } else {
      console.error('no user');
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTriggerStyled>#{children}</AlertDialogTriggerStyled>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitleStyled>팔로우 태그</AlertDialogTitleStyled>
          <AlertDialogDescription>'#{children}' 태그를 팔로우 하시겠습니까?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancelStyled onClick={() => setIsDialogOpen(false)}>
            아니오
          </AlertDialogCancelStyled>
          <AlertDialogActionStyled onClick={handleAddTagToFollow}>네</AlertDialogActionStyled>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AlertDialogTitleStyled = styled(AlertDialogTitle)`
  color: ${({ theme }) => theme.colors.black};
`;

const AlertDialogTriggerStyled = styled(AlertDialogTrigger)`
  margin-right: 5px;
  padding: 3px 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    border: 1px solid ${({ theme }) => theme.colors.secondary};
  }

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
  color: ${({ theme }) => theme.colors.darkGray};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

export default AlertDialogTag;
