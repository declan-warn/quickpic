import { css } from "/src/helpers.js";

export default css`

:root {
  color: var(--col-N800);
  line-height: 24px;
  font-size: 14px;
}

* {
  font-family: "Segoe UI";
}

li {
  line-height: 24px;
}

li + li {
  margin-top: 4px;
}

.h800 {
  font-size: 29px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--col-N800);
  line-height: 32px;
  margin-top: 40px;
}

.h700 {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--col-N800);
  line-height: 28px;
  margin: 40px 0px 0px;
}

.h600 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.008em;
  color: var(--col-N800);
  line-height: 24px;
  margin-top: 28px;
}

.h400 {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.003em;
  color: var(--col-N800);
  line-height: 16px;
  margin-top: 16px;
}

.h300 {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--col-N800);
  text-transform: uppercase;
  line-height: 16px;
  margin-top: 20px;
}

.h200 {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--col-N200);
  line-height: 16px;
  margin-top: 16px;
}

.h100 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--col-N200);
  line-height: 16px;
  margin-top: 16px;
}

`;
