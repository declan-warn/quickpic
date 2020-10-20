import { css } from "/src/helpers.js";

const height = "48px";

export default css`

@keyframes banner--slide-in {
  from {
    top: -${height};
    height: 0px;
  }

  to {
    top: 0px;
    height: ${height};
  }
}

.banner {
  width: 100vw;
  height: ${height};
  background: blue;
  font-weight: 500;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: banner--slide-in ease 100ms;
}

.banner ion-icon {
  font-size: 24px;
  margin-right: 4px;
}

.banner[appearance=error] {
  background: var(--col-R400);
  color: var(--col-N0);
}

`;
