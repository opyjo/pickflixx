import styled from "styled-components";

export const StyledHeader = styled.header`
  background-color: #032541;

  a {
    color: white;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;

    @media (max-width: 575.98px) {
      font-size: 0.7rem;
    }

    &:hover {
      opacity: 0.7;
    }
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    display: inline-block;
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }
  }
`;
