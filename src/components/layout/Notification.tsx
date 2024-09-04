import styled from '@emotion/styled';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import BellIcon from '@/assets/icons/BellIcon';
import { Badge } from '@/components/ui/badge';

const Notification = () => {
  return (
    <Sheet>
      <SheetTriggerStyled>
        <span></span>
        <BellIcon />
      </SheetTriggerStyled>
      <SheetContentStyled>
        <SheetHeaderStyled>
          <SheetTitle>
            알림 <span>(새로운 알림 00개)</span>
          </SheetTitle>
          <SheetDescriptionStyled>※ 알림은 최대 20개까지만 보여집니다.</SheetDescriptionStyled>
        </SheetHeaderStyled>
        <NoticeWrapper>
          {Array.from({ length: 10 }, (_, idx) => (
            <NoticeSection key={idx}>
              <NoticeTop>
                <Badge variant="outline">New</Badge>
                <span>2000.01.01</span>
              </NoticeTop>
              <NoticeTitle>🚨 [잘못된 정보] 게시글 수정 건에 대한 알림입니다.</NoticeTitle>
              <NoticeContent>수정이 완료되었습니다. 정보 제공에 감사드립니다.</NoticeContent>
            </NoticeSection>
          ))}
        </NoticeWrapper>
      </SheetContentStyled>
    </Sheet>
  );
};

const SheetTriggerStyled = styled(SheetTrigger)`
  position: relative;
  margin-right: 15px;

  span {
    position: absolute;
    top: -3px;
    right: -2px;
    width: 7px;
    height: 7px;
    background-color: ${({ theme }) => theme.colors.error};
    border-radius: 20px;
  }
`;

const SheetContentStyled = styled(SheetContent)`
  > button {
    &:focus {
      box-shadow: none;
    }
  }
`;

const SheetHeaderStyled = styled(SheetHeader)`
  margin-top: 20px;

  h2 {
    margin-bottom: 10px;
    text-align: left;

    > span {
      color: ${({ theme }) => theme.colors.gray};
      font-size: ${({ theme }) => theme.fontSizes.base};
      font-weight: normal;
    }
  }
`;

const SheetDescriptionStyled = styled(SheetDescription)`
  display: inline-block;
  margin-bottom: 10px !important;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  text-align: left;
`;

const NoticeWrapper = styled.div`
  width: auto;
  height: 84%;
  overflow-y: scroll;
`;

const NoticeSection = styled.div`
  padding: 15px 5px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const NoticeTop = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  > div {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: normal;
  }
`;

const NoticeTitle = styled.b`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 18px;
  text-align: justify;
  letter-spacing: -0.3px;
`;

const NoticeContent = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 15px;
  text-align: justify;
  letter-spacing: -0.3px;
`;

export default Notification;
