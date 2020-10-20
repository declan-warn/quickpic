import { css, mergeCSS } from "/src/helpers.js";

import typographyStyle from "/src/styles/typography.css.js";
import formStyle from "/src/styles/components/form.css.js";
import buttonStyle from "/src/styles/components/button.css.js";

export const mobileBreakpoint = "768px";

const baseStyle = css`

* {
  box-sizing: border-box;
}

.card {
  background: var(--col-N0);
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.31) 0px 0px 1px 0px;
  border-radius: 3px;
}

.floating {
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px;
}

`;

export default mergeCSS(
  baseStyle,
  typographyStyle,
  formStyle,
  buttonStyle,
);
