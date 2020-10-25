import { css } from "/src/helpers.js";

export default css`

:host(qp-avatar) {
  display: flex;
}

.avatar.xsmall {
  --dim: 16px;
}

.avatar.small {
  --dim: 24px;
}

.avatar.medium {
  --dim: 32px;
}

.avatar.xlarge {
  --dim: 96px;
}

.avatar.xxlarge {
  --dim: 128px;
}

.avatar {
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

.avatar img {
  width: 100%;
}

:host([outline="false"]) .avatar {
  box-shadow: none;
}

`;
