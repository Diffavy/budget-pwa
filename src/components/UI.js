import styled, { css } from "styled-components";

export const THEME = {
  colors: {
    background: "rgb(221, 221, 221)",
    text: "rgb(50, 50, 50)",
    buttonBackground: "rgb(189, 189, 189)",
    buttonFocus: "rgb(90, 90, 90)",
    buttonHover: "rgb(180, 180, 180)",
    income: "green",
    expense: "red",
  },
};

export const baseTextStyle = css`
  color: ${THEME.colors.text};
  font-weight: 500;
  font-size: 1.1rem;
`;

export const baseButtonStyle = css`
  all: unset;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 8px;
  margin: 0px;
`;

export const EditButton = styled.button`
  ${baseButtonStyle}
  font-size: 1rem;
  padding: 2px 5px;
  border-radius: 5px;
  color: ${THEME.colors.buttonFocus};
  font-weight: 550;
  margin-left: 10px;

  &:hover {
    transform: scale(1.1);
    color: ${THEME.colors.text};
`;

export const CancelEditButton = styled(EditButton)`
  &:hover {
    color: ${THEME.colors.expense};
  }
`;

export const SaveEditButton = styled(EditButton)`
  &:hover {
    color: ${THEME.colors.income};
  }
`;
