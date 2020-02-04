import styled from 'styled-components';
import './Button.css';

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.button`
  padding: 5px 20px;
  min-width: 200px;
  background: papayawhip;
  border: 1px solid red;
`;

export default ({ children }) => (
  <Wrapper>
    <span className="Button__label">Hello World!</span>
  </Wrapper>
);
