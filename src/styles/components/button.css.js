import { css } from "/src/helpers.js";

export default css`

.button-group {
  display: flex;
  align-items: center;
}

.button-group button + button {
  margin-left: 4px;
}

.button-group[spacing=compact] button + button {
  margin-left: 0px;
}

button {
  padding: 9px 12px;
  border-radius: 3px;
  background: rgba(9, 30, 66, 0.04);
  transition: background-color 100ms ease-out, color 100ms ease-out;
  cursor: pointer;  
  line-height: 1;
  vertical-align: middle;
  color: var(--col-N500);
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

button:hover {
  background: rgba(9, 30, 66, 0.08);
  text-decoration: inherit;
  transition-duration: 0s;
  color: var(--col-N500);
}

button:active {
  background: rgba(179, 212, 255, 0.6);
  transition-duration: 0s;
  color: var(--col-B400);
}

button[spacing=compact] {
  padding: 5px 12px;
}

button[appearance=primary] {
  background: var(--col-B400);
  color: var(--col-N0);
}

button[appearance=primary]:hover {
  background: var(--col-B300);
  color: var(--col-N0);
}

button[appearance=primary]:active {
  background: var(--col-B500);
  color: var(--col-N0);
}

button[appearance=subtle] {
  background: transparent;
}

button[appearance=subtle]:hover {
  background: rgba(9, 30, 66, 0.08);
}

button[appearance=subtle]:active {
  background: rgba(179, 212, 255, 0.6);
}

button[appearance=danger] {
  background: var(--col-R400);
  color: var(--col-N0);
}

button[appearance=danger]:hover {
  background: var(--col-R300);
  color: var(--col-N0);
}

button[appearance=danger]:active {
  background: var(--col-R500);
  color: var(--col-N0);
}

button[appearance=link] {
  background: transparent;
  padding-left: 2px;
  padding-right: 2px;
  color: var(--col-B400);
}

button[appearance=link]:hover {
  color: var(--col-B300);
  text-decoration: underline;
}

button[appearance=link]:active {
  color: var(--col-B500);
}

button[appearance=subtle-link] {
  background: transparent;
  padding-left: 2px;
  padding-right: 2px;
  color: var(--col-N200);
}

button[appearance=subtle-link]:hover {
  text-decoration: underline;
  color: var(--col-N90);
}

button[appearance=subtle-link]:active {
  color: var(--col-N400);
}

`;
