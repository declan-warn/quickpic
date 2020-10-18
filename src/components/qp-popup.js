import { create, linkToCSS } from "/src/helpers.js";

import popupStyle from "/src/styles/popup.js";

// Uses techniques mentioned in:
// <https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/>

// if (!customElements.get("qp-popup")) {
customElements.define("qp-popup", class extends HTMLElement {
  stylesheet = linkToCSS("/styles/base.css");

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [popupStyle];
  }

  connectedCallback() {
    this.dialog = create("dialog", { class: "popup card floating slide-in" }, [
      create("div", { class: "popup-body" }, [
        this.hasAttribute("heading") &&
        create("span", { class: "h600 popup-heading" }, [this.getAttribute("heading")]),
        create("slot")
      ])
    ]);

    this.shadowRoot.append(
      this.stylesheet,
      this.dialog,
    );

    this.dialog.addEventListener("mousedown", ({ target, path }) => {
      if (target === this.dialog) {
        this.close();
      }
    });
  }

  showModal() {
    this.dialog.showModal();
    this.scrollOffset = window.scrollY;
    document.body.style.setProperty("--modalTop", `-${this.scrollOffset}px`);
    document.body.classList.add("modal-open");
  }

  close() {
    this.dialog.classList.remove("slide-in");
    this.dialog.classList.add("slide-out");
    this.dialog.addEventListener("animationend", () => {
      this.dialog.close();
      this.remove();
    }, true);
  }

  disconnectedCallback() {
    document.body.classList.remove("modal-open");
    window.scrollTo(0, this.scrollOffset);
    document.body.style.removeProperty("--modalTop");
  }
});
// }
