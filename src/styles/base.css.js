import { css, mergeCSS } from "/src/helpers.js";

import typographyStyle from "/src/styles/typography.css.js";
import formStyle from "/src/styles/components/form.css.js";
import buttonStyle from "/src/styles/components/button.css.js";

export const mobileBreakpoint = "768px";

const baseStyle = css`

* {
  box-sizing: border-box;
}

[hidden] {
  display: none!important;
}

.card {
  background: var(--col-N0);
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.31) 0px 0px 1px 0px;
  border-radius: 3px;
}

.floating {
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px;
}

.lozenge {
  background-color: var(--col-N40);
  border-radius: 3px;
  color: var(--col-N500);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px 3px;
  text-transform: uppercase;
}

.side-bar {
  background: var(--col-N20);
  width: 240px;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
}

.side-bar span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.side-bar button[hero] {
  height: 64px;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}

aside button[hero] ion-icon {
  background: var(--col-T300);
  color: var(--col-N0);
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 3px;
  border: 8px solid var(--col-T300);
}

aside button:not(:active):hover {
  background-color: var(--col-N30);
}

.frame {
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  border-radius: 1.5px;
}

.frame:not([no-hover]):hover {
  cursor: pointer;
  background-color: var(--col-N20);
}

label:first-child {
  margin-top: 0px;
}

`;

export default mergeCSS(
  baseStyle,
  typographyStyle,
  formStyle,
  buttonStyle,
);
