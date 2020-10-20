import { css } from "/src/helpers.js";

export default css`

form {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
}

input {
  font-family: inherit;
  font-size: 0.875rem;
  padding: 0.6em 0.4em;
  border: 0px;
  outline: none;
  width: 100%;
  border: 2px solid var(--col-N40);
  background-color: var(--col-N10);
  transition: border-color 200ms ease-in-out
            , background-color 200ms ease-in-out;
  border-radius: 0.2em;
  line-height: 20px;
}

input:not(:focus):hover {
  background-color: var(--col-N30);
}

input:focus {
  background-color: var(--col-N0);
  border-color: var(--col-B100);
}

label {
  display: inline-flex;
  margin-bottom: 4px;
}

label[required]::after {
  content: "*";
  color: var(--col-R400);
  margin-left: 2px;
}

.help-text {
  font-size: 12px;
  color: var(--col-N200);
  margin-top: 4px;
  line-height: 16px;
  display: flex;
  align-items: center;
}

.help-text ion-icon {
  margin-right: 4px;
  font-size: 16px;
}

.help-text[appearance=error] {
  color: var(--col-R400);
}

`;
