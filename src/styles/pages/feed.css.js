import { css } from "/src/helpers.js";

export default css`

@keyframes pulsate {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

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

.feed__posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 250px));
  width: 100%;
  gap: 48px;
  justify-content: space-evenly;
  align-content: start;
}

.feed__posts:empty::before,
.feed__posts:empty::after {
  content: "";
  height: 364px;
  background: var(--col-N20);
  border-radius: 1.5px;
  animation: pulsate 1s ease-in-out infinite alternate;
}

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
