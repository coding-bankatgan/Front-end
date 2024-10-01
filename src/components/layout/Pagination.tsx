import {
  Pagination as PaginationLayout,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import styled from '@emotion/styled';

interface PaginationProps {
  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { totalPages, number } = pagination;

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, idx) => (
      <PaginationItemStyled key={idx} isActive={idx === number}>
        <PaginationLink href="#" onClick={() => handlePageChange(idx)}>
          {idx + 1}
        </PaginationLink>
      </PaginationItemStyled>
    ));
  };

  return (
    <PaginationLayoutStyled>
      <PaginationContent>
        <PaginationItem>
          <PaginationPreviousStyled
            href="#"
            disabled={number === 0}
            onClick={() => {
              handlePageChange(number - 1);
            }}
          />
        </PaginationItem>
        {renderPageNumbers()}
        {totalPages > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNextStyled
            href="#"
            disabled={number === totalPages - 1}
            onClick={() => {
              handlePageChange(number + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationLayoutStyled>
  );
};

const PaginationLayoutStyled = styled(PaginationLayout)`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;

  ul {
    width: 100%;

    li {
      display: flex;
      justify-content: center;
      width: 24px;
    }
  }
`;

const PaginationPreviousStyled = styled(PaginationPrevious)<{
  disabled: boolean;
}>`
  padding: 12px;
  color: ${({ disabled }) => (disabled ? '#ccc' : '#000')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  span {
    display: none;
  }
`;

const PaginationNextStyled = styled(PaginationNext)<{ disabled: boolean }>`
  padding: 12px;
  color: ${({ disabled }) => (disabled ? '#ccc' : '#000')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  span {
    display: none;
  }
`;

const PaginationItemStyled = styled(PaginationItem, {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive: boolean }>`
  color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.darkGray)};
`;

export default Pagination;
