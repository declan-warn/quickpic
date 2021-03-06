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
  --gap: 60px;
  border: 0px;
  position: fixed;
  top: var(--gap);
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
  max-height: calc(100vh - (var(--gap) * 2));
  max-width: 80ch;
  width: 100%;
  display: flex;
  flex-direction: column;
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

.popup__body {
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  align-items: start;
  overflow-y: auto;
}

.popup__header {
  padding: 24px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.popup__icon {
  font-size: 24px;
  margin-right: 8px;
  display: none;
}

.popup__heading {
  margin: 0px;
}

.popup__description {
  margin-top: 4px;
  width: 100%;
  flex-shrink: 0;
}

.popup__footer {
  padding: 24px;
  display: flex;
}

.popup__footer .button-group {
  margin-left: auto;
}

.popup[appearance=danger] .popup__icon {
  display: inline-block;
  color: var(--col-R400);
}

.popup[no-chrome] {
  --max-width: calc(100vw - var(--gap) * 2);
  --max-height: calc(100vh - var(--gap) * 2);
  --border-width: 8px;
  --test: calc(100vw - var(--gap) * 2 - var(--border-width) * 2);
  --abra: calc(100vh - var(--gap) * 2 - var(--border-width) * 2);

  max-width: var(--max-width);
  max-height: var(--max-height);
  width: max-content;
  height: max-content;
  padding: 0px;
  border: var(--border-width) solid var(--col-N0);
}

.popup[no-chrome] .popup__body {
  --max-width--body: calc(var(--max-width) - 2 * var(--border-width));
  --max-height--body: calc(var(--max-height) - 2 * var(--border-width));

  width: max-content;
  height: max-content;
  overflow: hidden;
  padding: 0px;
  max-width: var(--max-width);
  max-height: var(--max-height);
}

.popup[no-chrome] .popup__body ::slotted(img) {
  display: flex;
  max-width: var(--max-width--body);
  max-height: var(--max-height--body);
  border-radius: 1.5px;
  border: 1px solid var(--col-B50);
}

`;
