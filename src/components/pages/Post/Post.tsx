import { PageLayout } from '@/styles/CommonStyles';
import styled from '@emotion/styled';
import { Line } from '../Home/Home';
import ExProfileImg from '@/assets/ExProfileImg';
import ViewIcon from './../../../assets/icons/ViewIcon';
import AlertDialogTag from '@/components/layout/AlertDialogTag';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SendIcon from '@/assets/icons/SendIcon';
import WarningIcon from '@/assets/icons/WarningIcon';

const Post = () => {
  return (
    <PageLayoutStyled>
      <PostWrapper>
        <UserPost>
          <span>#리뷰</span>
          <Nickname>
            <ExProfileImg />
            닉네임
          </Nickname>
          <img src="https://picsum.photos/seed/picsum/320/270" alt="주류 이름" />
          <Desc>
            가나다라 마바사 아자차카 타파하 가나다라 마바사 아자차카 타파하. 이 텍스트는 한국어
            레이아웃을 테스트하기 위한 샘플 텍스트입니다.디자인 작업을 할 때 글꼴, 문단, 간격 등을
            확인하기 위해 사용됩니다. 가나다라 마바사 아자차카 타파하.
          </Desc>
          <Info>
            <b>특산주 정보</b>
            <li>이름 : OOO</li>
            <li>주종 : OOO</li>
            <li>맛 : OOO</li>
            <li>도수 : OOO</li>
            <li>평점 : OOO</li>
            <li>평균 평점 : OOO</li>
          </Info>
          <MetaData>
            <span>2000.01.01</span>
            <span>
              <ViewIcon /> 1,000
            </span>
          </MetaData>
          <TagWrapper>
            {Array.from({ length: 5 }, (_, idx) => (
              <AlertDialogTag key={idx} />
            ))}
          </TagWrapper>
        </UserPost>
        <Line />
        <CommentWrapper>
          <Write>
            <div>
              <Textarea placeholder="댓글을 작성해주세요." />
              <Button>
                <SendIcon />
              </Button>
            </div>
          </Write>
          <Comments>
            {Array.from({ length: 3 }, (_, idx) => (
              <Comment key={idx}>
                <ExProfileImg />
                <CommentInfoWrapper>
                  <span>
                    <CommentNickname>닉네임</CommentNickname>
                    <CommentDate>2000.01.01</CommentDate>
                  </span>
                  <p>가나다라 마바사 아자차카 타파하 가나다라 마바사 아자차카 타파하.</p>
                </CommentInfoWrapper>
              </Comment>
            ))}
          </Comments>
          <ReportBtn>
            <WarningIcon /> 신고하기
          </ReportBtn>
        </CommentWrapper>
      </PostWrapper>
    </PageLayoutStyled>
  );
};

const PageLayoutStyled = styled(PageLayout)`
  background-color: ${({ theme }) => theme.colors.brightGray};
`;

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 320px;
  width: 100%;
  min-height: calc(100vh - 180px);
  height: auto;
  margin: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px;
  box-shadow:
    rgba(17, 17, 26, 0.05) 0px 1px 0px,
    rgba(17, 17, 26, 0.05) 0px 0px 8px;
`;

const UserPost = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  > span:nth-of-type(1) {
    margin: 10px 0 5px 10px;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  img {
    width: 100%;
    min-height: 270px;
    height: auto;
  }
`;

const Nickname = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin: 10px 0 10px 10px;

  svg {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
`;

const Desc = styled.p`
  padding: 10px;
  line-height: 21px;
`;

const Info = styled.ul`
  width: 100%;
  height: auto;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  font-size: ${({ theme }) => theme.fontSizes.base};

  li {
    line-height: 20px;
  }
`;

const MetaData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  padding: 0 10px;

  span {
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }

  span:nth-of-type(2) {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    svg {
      width: 16px;
      height: 16px;
      margin-right: 3px;
    }
  }
`;

const TagWrapper = styled.div`
  margin-top: 15px;
  padding: 0 10px;
`;

const CommentWrapper = styled.section`
  width: 100%;
  min-height: 200px;
  height: auto;
`;

const Write = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  textarea {
    min-width: 230px;
    width: 100%;
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.clearGray};
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 10px;
    resize: none;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    margin-left: 5px;
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.primary};

    &:active,
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }

    svg {
      width: 18px;
      height: 18px;
      margin: 0;
    }
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 20px;
  }
`;

const Comments = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 150px;
  height: auto;
  margin: 20px 0;
`;

const Comment = styled.div`
  display: flex;
  width: 90%;
  min-height: 30px;
  height: auto;
  padding: 10px;
  background: ${({ theme }) => theme.colors.clearGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};

  &:first-of-type {
    border-radius: 10px 10px 0 0;
  }

  &:last-of-type {
    border-bottom: 0;
    border-radius: 0 0 10px 10px;
  }

  svg {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

const CommentInfoWrapper = styled.div`
  > span {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const CommentNickname = styled.span`
  margin-right: 10px;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const CommentDate = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const ReportBtn = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 40px 15px 15px 0;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export default Post;
