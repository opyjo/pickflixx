import styled from "styled-components";

export const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 85%;
  }

  @media (max-width: 780px) {
    margin-top: 40%;
    height: 20rem;
  }
`;
