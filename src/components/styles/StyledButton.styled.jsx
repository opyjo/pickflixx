import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: ${(props) => props.bg};
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  box-shadow: rgba(213, 217, 217, 0.5) 0 2px 5px 0;
  color: white;
  display: inline-block;
  font-size: 0.7rem;
  font-weight: bold;
  line-height: 29px;
  padding: 0 0.5rem 0 0.5rem;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  margin-left: ${(props) => props.mgLeft};

  &:hover {
    opacity: 0.7;
    cursor: pointer;
  }

  &:focus {
    border-color: #008296;
    box-shadow: rgba(213, 217, 217, 0.5) 0 2px 5px 0;
    outline: 0;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.2;
  }
`;
