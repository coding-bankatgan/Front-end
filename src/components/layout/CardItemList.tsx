import styled from '@emotion/styled';
import CardItem from './CardItem';

const CardItemList = () => {
  return (
    <CardItemListLayout>
      {Array.from({ length: 8 }, (_, idx) => (
        <CardItem key={idx} />
      ))}
    </CardItemListLayout>
  );
};

const CardItemListLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export default CardItemList;
