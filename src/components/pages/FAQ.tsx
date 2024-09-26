import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import styled from '@emotion/styled';
import PrevBtn from '../layout/PrevBtn';

const FAQ = () => {
  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <PrevBtn />
        <TitleStyled>FAQ</TitleStyled>
        <AccordionStyled type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTriggerSub>Q. 오늘 한 잔 이란?</AccordionTriggerSub>
            <AccordionContentSub>
              다양한 지역 특산주를 홍보하거나 리뷰하며 국내 지역특산주 소비를 촉진하는 플랫폼입니다.
            </AccordionContentSub>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTriggerSub>Q. 특잔주 등록은 어떻게 하나요?</AccordionTriggerSub>
            <AccordionContentSub>
              상단 메뉴 {'>'} 특산주 신청 리스트 {'>'} + 버튼을 통해 특산주를 등록할 수 있습니다.{' '}
              <br></br>
              특산주 신청에는 특산주 이미지, 이름, 지역정보, 기타정보(당도, 가격 등)가 필요합니다.{' '}
              <br></br>
              해당 정보를 입력하고 게시글을 등록하면 매니저의 확인 후 특산주가 등록됩니다.
            </AccordionContentSub>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTriggerSub>Q. 게시글 신고는 어떻게 하나요?</AccordionTriggerSub>
            <AccordionContentSub>
              부적절한 게시글, 부정확한 정보에 기재된 게시글의 경우 게시글 하단 신고하기 버튼을 통해
              신고 가능합니다. <br></br>
              신고가 접수된 경우 매니저가 신고 사유 적합 여부에 따라 게시글을 비공개 처리할 수
              있습니다.
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

const AccordionStyled = styled(Accordion)`
  color: ${({ theme }) => theme.colors.black};

  button {
    padding: 15px 10px;
  }
`;

const AccordionTriggerSub = styled(AccordionTrigger)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const AccordionContentSub = styled(AccordionContent)`
  padding: 12px 8px 12px 8px;
  background-color: ${({ theme }) => theme.colors.brightGray};
`;

export default FAQ;
