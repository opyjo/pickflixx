import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.gridTemplateColumns};
  grid-gap: 0.8rem;
  padding-top: 5rem;
  @media (max-width: 576px) {
    object-fit: contain;
  }
`;
