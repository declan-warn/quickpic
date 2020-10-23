import { css } from "/src/helpers.js";

export default css`

@keyframes spinner--rotate {
  from {
    transform: rotate(50deg);
    opacity: 0;
    stroke-dashoffset: 60;
  }

  to {
    transform: rotate(230deg);
    opacity: 1;
    stroke-dashoffset: 50;
  }
}

@keyframes spinner__dot--rotate {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  display: block;
  width: 96px;
  height: 96px;
  animation: 1s ease-in-out 0ms 1 normal forwards running spinner--rotate;
}

.spinner__dot {
  fill: none;
  cx: 8;
  cy: 8;
  r: 7;
  stroke-width: 1.5;
  stroke: rgb(66, 82, 110);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 60;
  stroke-dashoffset: inherit;
  animation: 0.86s cubic-bezier(0.4, 0.15, 0.6, 0.85) 0ms infinite normal none running spinner__dot--rotate;
  transform-origin: 50%;
}

`;
