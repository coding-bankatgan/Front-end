import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import styled from '@emotion/styled';
import PrevBtn from '../layout/PrevBtn';

const Announcement = () => {
  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <PrevBtn />
        <TitleStyled>공지사항</TitleStyled>
        <AccordionStyled type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTriggerSub>
              <PostingTitle>
                [공지] 오늘 한 잔? 앱이 출시되었습니다🎉
                <PostingDate>2024.09.04</PostingDate>
              </PostingTitle>
            </AccordionTriggerSub>
            <AccordionContentSub>
              오늘 한 잔? 앱이 금일 앱스토어에 출시되었습니다🎉<br></br>
              오늘 한 잔 앱을 통해 지역 특산주에 대한 정보를 얻고 취향에 맞는 술을 찾아보세요:D
              <br></br>
            </AccordionContentSub>
          </AccordionItem>
        </AccordionStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const TitleStyled = styled.h1`
  width: 100%;
  height: auto;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  text-align: center;
`;

export const AccordionStyled = styled(Accordion)`
  button {
    padding: 15px 10px;
  }
`;

const AccordionTriggerSub = styled(AccordionTrigger)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const PostingTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PostingDate = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const AccordionContentSub = styled(AccordionContent)`
  padding: 12px 8px 12px 8px;
  background-color: ${({ theme }) => theme.colors.brightGray};
`;

export default Announcement;
