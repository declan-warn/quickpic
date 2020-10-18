import { css } from "/src/helpers.js";

export default css`

:host {
  position: sticky;
  top: 0px;
  z-index: 1000;
}

nav {
  height: 64px;
  width: 100%;
  background: var(--col-B500);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 24px;
  position: sticky;
  top: 0px;
  z-index: 100;
}

nav > div {
  display: flex;
  flex-direction: row;
  align-items: center;
}

button {
  background: none;
  border: none;
  color: var(--col-N0);
  outline: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

button:hover {
  background-color: var(--col-N800);
  cursor: pointer;
}

button:active {
  background-color: var(--col-B200);
}

:host([slot="logo"]) {
  margin-bottom: 16px;
}

button ::slotted(a) {
  color: inherit;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  nav {
    height: 100vh;
    width: 64px;
    flex-direction: column;
    padding: 24px 0;
  }

  nav > div {
    flex-direction: column;
  }
}

`;
