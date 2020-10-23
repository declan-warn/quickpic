import { css } from "/src/helpers.js";

import { postLayout } from "/src/styles/components/post.css.js";
import { mobileBreakpoint } from "/src/styles/base.css.js";

export default css`

.profile {
  display: flex;
  flex-direction: row;
}

.side-bar {
  max-width: 240px;
}

.profile__main {
  width: 100%;
  padding: 32px;
  display: grid;
  grid-template-columns: minmax(100px, 100%);
  justify-content: center;
  height: fit-content;
}

.profile-card {
  width: fit-content;
  margin: 42px auto 32px;
}

.profile-card__header {
  padding: 0px;
  background: var(--col-P400);
  display: flex;
  justify-content: center;
  height: 64px;
  border-radius: 3px 3px 0px 0px;
}

.profile-card__avatar {
  position: relative;
  top: -48px;
}

.profile-card__body {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  justify-content: center;
  gap: 1em;
}

.profile-card__info {
  display: inline-grid;
  grid-template-areas: "icon field"
                       "icon value";
  grid-template-columns: max-content 1fr;
  border: 1px solid var(--col-N40);
  padding: 1em;
  border-radius: 3px;
  min-width: 20ch;
  max-width: 40ch;
  width: 100%;
}

.profile-card__info__icon {
  grid-area: icon;
  font-size: 2em;
  margin-right: 0.5em;
  align-self: center;
}

.profile-card__info__field {
  grid-area: field;
  justify-self: start;
  font-size: 0.75em;
  text-transform: uppercase;
  font-weight: 800;
}

.profile-card__info__value {
  grid-area: value;
  justify-self: start;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.profile__posts-heading {
  text-align: center;
  margin: 32px auto;
}

${postLayout(".profile__posts")}

@media (min-width: ${mobileBreakpoint}) {
  .profile__main {
    padding: 32px 64px;
  }
}

`;
