import styled from "styled-components";

export const InputContainer = styled.div`
  width: 100%;
  display: block;
  margin: 0 auto;

  input {
    margin-top: 3rem;
    width: 100%;
    height: 45px;
    padding: 0 20px;
    font-size: 1rem;
    border: 1px solid #1effbc;
    outline: none;
    border-radius: 0.5rem;
    background-color: #032541;

    &:focus {
      border: 1px solid #0089bf;
      transition: 0.35s ease;
      color: white;
      &::-webkit-input-placeholder {
        transition: opacity 0.45s ease;
        opacity: 0;
      }
      &::-moz-placeholder {
        transition: opacity 0.45s ease;
        opacity: 0;
      }
      &:-ms-placeholder {
        transition: opacity 0.45s ease;
        opacity: 0;
      }
    }
  }
`;
