import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  padding: 10px 0;
  width: ${(props) => props.width};
`;

export const Wrapper = styled.div`
  max-width: 1200px;
  max-width: 85%;
  margin: 0 auto;
`;

export const Heading = styled.h1`
  color: white;
  text-align: center;
`;
