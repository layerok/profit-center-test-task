import styled from "styled-components";

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px;
    color: white;
    background: rgba(28, 28, 28, .8);
    width: 150px;
    padding-bottom: 10px;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
`

const Stats = styled.div`
  font-size: 10px;
  margin-top: 8px;
`;

export {
    Title,
    Container,
    Stats
}