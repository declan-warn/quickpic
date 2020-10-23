import { css } from "/src/helpers.js";

import { mobileBreakpoint } from "/src/styles/base.css.js";

export default css`

@keyframes flag--slide {
  from {
    transform: var(--fromTransform);
    opacity: var(--fromOpacity);
  }

  to {
    transform: var(--toTransform);
    opacity: var(--toOpacity);
  }
}

.flag.closing {
  --fromTransform: translateX(0%);
  --fromOpacity: 1;
  --toTransform: translateX(-100%);
  --toOpacity: 0;
  animation: flag--slide 150ms ease-in;
}

.flag.opening {
  --fromTransform: translateX(-100%);
  --fromOpacity: 0;
  --toTransform: translateX(0%);
  --toOpacity: 1;
  animation: flag--slide 300ms ease-out;
}

.flag {

  margin: 0;
  position: fixed;
  bottom: 16px;
  left: 16px;
  box-shadow: rgba(9, 30, 66, 0.31) 0px 0px 1px, rgba(9, 30, 66, 0.25) 0px 20px 32px -8px;
  padding: 16px;
  border-radius: 3px;
  border: none;
  line-height: 20px;

  width: 400px;

  z-index: 9999;
}

.flag__header {
  display: flex;
  align-items: center;
  height: 32px;
}

.flag__icon {
  font-size: 24px;
  color: var(--col-P300);
}

.flag__heading {
  font-size: inherit;
  color: var(--col-N500);
  font-weight: 600;
  margin: 0px 0px 0px 16px;
  flex-grow: 1;
}

.flag__close {
  font-size: 16px;
  padding: 8px;
  background: transparent;
}

.flag__body {
  margin-left: 40px;
}

.flag__footer {
  margin: 8px 0px 0px 40px;
}

.flag__action:hover {
  text-decoration: underline;
}

.flag[appearance=info] {
  background-color: var(--col-N500);
}

.flag[appearance=info] .flag__icon,
.flag[appearance=info] .flag__heading,
.flag[appearance=info] .flag__body,
.flag[appearance=info] .flag__action,
.flag[appearance=info] .flag__close {
  color: var(--col-N0);
}

.flag[appearance=info] .flag__action {
  background-color: var(--col-N400);
}

.flag[appearance=info] .flag__action:hover {
  background-color: var(--col-N300);
}

.flag[appearance=info] .flag__action:active {
  background-color: var(--col-N600);
}



@media (min-width: ${mobileBreakpoint}) {
  .flag {
    left: 80px;
  }
}

`;
