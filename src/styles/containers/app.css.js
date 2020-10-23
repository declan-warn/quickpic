import { css } from "/src/helpers.js";

import { mobileBreakpoint } from "/src/styles/base.css.js";

export default css`

@keyframes fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.app__container {
  display: grid;
  grid-template-rows: auto 1fr;
}

.app__page-title {
  color: var(--col-N0);
  margin: 0px;
}

.app__page-title.fade {
  animation: fade 200ms ease-out;
}

@media (min-width: ${mobileBreakpoint}) {
  .app__container {
    grid-template-rows: none;
    grid-template-columns: auto 1fr;
  }

  .app__page-title {
    writing-mode: vertical-lr;
    transform: rotate(180deg);
  }
}

`;
