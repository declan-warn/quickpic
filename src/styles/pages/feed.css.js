import { css } from "/src/helpers.js";

import { postLayout } from "/src/styles/components/post.css.js";

export default css`

.feed {
  display: flex;
  flex-direction: row;
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

.side-bar {
  top: 64px;
}

@media (min-width: 768px) {
  .side-bar {
    top: 0px;
    height: 100vh;
  }

  .feed__posts {
    // justify-content: start;
  }
}

`;
