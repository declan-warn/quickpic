import { css } from "/src/helpers.js";

export default css`

#container.xsmall {
  --dim: 16px;
}

#container.small {
  --dim: 24px;
}

#container.medium {
  --dim: 32px;
}

#container.xlarge {
  --dim: 96px;
}

#container.xxlarge {
  --dim: 128px;
}

#container {
  --dim: 32px;
  box-sizing: border-box;
  height: var(--dim);
  width: var(--dim);
  padding: calc(0.175 * var(--dim));
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--col-N0);
  background: var(--col-N50);
  display: inline-flex;
}

img {
  width: 100%;
}

:host([outline="false"]) #container {
  box-shadow: none;
}

`;