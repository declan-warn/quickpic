import { css } from "/src/helpers.js";

export default css`

@keyframes slide-in {
  from {
    transform: translate(-50%, 30px);
    opacity: 0;
  }

  to {
    transform: translate(-50%, 0px);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translate(-50%, 0px);
    opacity: 1;
  }

  to {
    transform: translate(-50%, -30px);
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.popup {
  --top: 60px;
  border: 0px;
  position: fixed;
  top: var(--top);
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
  max-height: calc(100vh - (36px * 2));
  max-width: 80ch;
  width: 100%;
}

.popup.slide-in {
  animation: slide-in 550ms cubic-bezier(0.23, 1, 0.32, 1);
}

.popup.slide-out {
  animation: slide-out 550ms cubic-bezier(0.23, 1, 0.32, 1);
}

.popup::backdrop {
  background-color: rgba(9, 30, 66, 0.54);
  animation: fade-in 200ms ease;
}

.popup.slide-out::backdrop {
  animation: fade-out 200ms ease;
}

.popup-body {
  padding: 36px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.popup-heading {
  margin-top: 0px;
}

`;
