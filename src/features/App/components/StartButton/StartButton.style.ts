import styled from 'styled-components';

const Button = styled.button`
  height: 45px;
  width: 190px;
  color: white;
  background-color: black;
  border: none;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export {
    Button
}