import styled from "styled-components";

export const Card = styled.div`
  border-radius: 10px;
  overflow: hidden;
  -webkit-box-shadow: 0px 10px 13px -7px #000000,
    5px 5px 15px 5px rgba(0, 0, 0, 0);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  background-color: #a07178;
  color: black;
  &:hover {
    border: 1px solid #1effbc;
  }
`;
