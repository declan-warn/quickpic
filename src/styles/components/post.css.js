import { css } from "/src/helpers.js";

const gap = "8px";

import { mobileBreakpoint } from "/src/styles/base.css.js";

export const postLayout = selector =>
  /* css */`
  ${selector} {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 250px));
    width: 100%;
    gap: 24px;
    justify-content: space-evenly;
    align-content: start;
  }

  @media (min-width: ${mobileBreakpoint}) {
    ${selector} {
      gap: 48px;
    }
  }
  `;

export default css`

@keyframes post--grow {
  from {
    transform: scale(0, 0);
    opacity: 0;
  }

  to {
    transform: scale(1, 1);
    opacity: 1;
  }
}

.post__container {
  display: flex;
  flex-direction: column;
  animation: post--grow 200ms ease-in-out;
  padding: ${gap};
}

.post__frame {
  position: relative;
  width: 100%;
  background: var(--col-N10);
  border-radius: 1.5px;
  border: 1px solid var(--col-B50);
  overflow: hidden;
  margin-bottom: ${gap};
}

/*
Response square using technique from:
<https://spin.atomicobject.com/2015/07/14/css-responsive-square/>
*/
.post__frame::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.post__image {
  object-fit: contain;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.post__action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post__action {
  border-radius: 50%;
  padding: 8px;
}

.post__action[aria-label=like] .post__action__icon,
.post__action[aria-label=unlike] .post__action__icon {
  display: none;
}

.post__action[aria-label=unlike] {
  color: var(--col-R400);
}

.post__action[aria-label=like]:hover,
.post__action[aria-label=unlike]:hover {
  background: var(--col-R50);
}

.post__action[aria-label=like]:active,
.post__action[aria-label=unlike]:active {
  background: var(--col-R75);
  color: var(--col-R400);
}

.post__action[aria-label=like] .post__action__icon[name="heart-outline"] {
  display: inline-block;
}

.post__action[aria-label=unlike] .post__action__icon[name="heart"] {
  display: inline-block;
}

.post__action-separator {
  font-size: 4px;
  margin: 0 4px 0px 8px;
  color: var(--col-N200);
}

.post__description {
  // white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: ${gap};
}

.post__footer {
  display: flex;
  justify-content: space-between;
  margin: 0px calc(${gap} - 2px);
  margin-bottom: 0px;
}

.post__author {
  font-weight: 500;
  color: var(--col-N800);
}

.post__author:hover {
  color: var(--col-B400);
}

.post__avatar {
  margin-right: 8px;
}

.post__published {
  display: flex;
  align-items: center;
}

.post__no-likes {
  color: var(--col-N200);
  margin-top: 8px;
}

.comment-list + .help-text {
  display: none;
  margin: 0px;
}

.comment-list:empty + .help-text {
  display: flex;
}

.comment {
  display: flex;
  padding: 0;
  margin-top: 16px;
}

.comment__body {
  display: flex;
  flex-direction: column;
}

.comment__body__meta {
  display: flex;
  align-items: center;
}

.comment__body__meta * + * {
  margin-left: 8px;
}

.comment__avatar {
  margin-right: 8px;
}

.comment__content {
  margin: 4px 0 0 0;
}

.comment__form {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.comment__form .button-group {
  margin-left: 4px;
}

#new-comment {
  height: 32px;
}

`;
