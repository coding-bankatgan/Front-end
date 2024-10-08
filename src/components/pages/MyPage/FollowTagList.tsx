import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMemberStore } from '@/store/useMemberStore';
import styled from '@emotion/styled';
import MinusIcon from '@/assets/icons/MinusIcon';
import CustomAlert from '@/components/layout/CustomAlert';
import { fetchTagDeleteApi } from '@/api/postApi';

const FollowTagList = () => {
  const { members, followTags, fetchFollowTags } = useMemberStore();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchFollowTags();
  }, [fetchFollowTags]);

  const myFollowTags = Array.isArray(followTags)
    ? followTags.filter(followTags => followTags.memberId === members[0].id)
    : [];

  const removeFollowTag = async (followId: number, tagName: string) => {
    try {
      const response = await fetchTagDeleteApi(followId);

      if (response) {
        setAlert({ type: 'success', message: `${tagName} 태그가 삭제되었습니다.` });
        fetchFollowTags();
      }
    } catch (error) {
      setAlert({ type: 'error', message: '태그 삭제에 실패했습니다.' });
      console.error('error: ', error);
    }
  };

  return (
    <>
      <ul>내가 팔로우한 태그 목록</ul>
      <Line />
      {myFollowTags.length === 0 ? (
        <NoTagsMessage>팔로우한 태그가 없습니다.</NoTagsMessage>
      ) : (
        <FollowTagListStyled>
          {myFollowTags.map(tag => (
            <li key={tag.tagId}>
              #{tag.tagName}
              <Button onClick={() => removeFollowTag(tag.id, tag.tagName)}>
                <MinusIcon />
              </Button>
              {alert && (
                <CustomAlert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              )}
            </li>
          ))}
        </FollowTagListStyled>
      )}
    </>
  );
};

const NoTagsMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 10px;
`;

const FollowTagListStyled = styled.div`
  color: ${({ theme }) => theme.colors.black};
  list-style: none;
  font-weight: bold;

  ul {
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.large};
  }

  li {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    padding: 0 10px;
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.small};

    button {
      height: 24px;
      padding: 0;
      margin: 0;
      background-color: ${({ theme }) => theme.colors.white};
      :focus {
        background-color: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.focusShadowOrange};
        border-radius: 50%;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
      }
    }

    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.gray};
      border-radius: 12px;
    }
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

export default FollowTagList;
