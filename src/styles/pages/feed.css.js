import { css } from "/src/helpers.js";

import { postLayout } from "/src/styles/components/post.css.js";

export default css`

.feed {
  display: flex;
  flex-direction: row;
}

.feed__loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.feed__main {
  width: 100%;
  padding: 32px 64px;
}

.feed__heading {
  margin: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

${postLayout(".feed__posts")}

.feed__posts:empty::before {
  content: "Nothing here yet...";
}

`;
