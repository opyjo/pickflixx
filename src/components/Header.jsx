import React from "react";
import { Link } from "react-router-dom";
import { StyledHeader } from "./styles/Header.styled";
import { Flex, Wrapper } from "./styles/Global.styled";

const Header = () => {
  return (
    <StyledHeader>
      <Wrapper>
        <Flex>
          <Flex width="100%" justifyContent="space-between">
            <div>
              <Link to="/">Home</Link>
            </div>

            <ul>
              <li>
                <Link to="/search">ADD MORE</Link>
              </li>
              <li>
                <Link to="/watchlist">WatchList</Link>
              </li>

              <li>
                <Link to="/watched">Watched</Link>
              </li>
            </ul>
          </Flex>
        </Flex>
      </Wrapper>
    </StyledHeader>
  );
};

export default Header;
