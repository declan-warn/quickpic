import { create } from "/src/helpers.js";

import baseStyle from "/src/styles/base.css.js";
import popupStyle from "/src/styles/components/popup.css.js";

// Uses techniques mentioned in:
// <https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/>

customElements.define("qp-popup", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, popupStyle];

    this.close = this.close.bind(this);
  }

  connectedCallback() {
    const appearance = this.getAttribute("appearance");

    if (this.hasAttribute("no-chrome")) {
      this.dialog =
        this.shadowRoot.appendChild(
          create("dialog", { class: "popup frame floating slide-in", "no-chrome": true, "no-hover": true }, [
            create("div", { class: "popup__body" }, [
              create("slot")
            ]),
          ])
        )
    } else {
      this.dialog =
        this.shadowRoot.appendChild(
          create("dialog", {
            class: "popup card floating slide-in",
            appearance
          }, [
            create("header", { class: "popup__header" }, [
              create("ion-icon", { name: "alert-circle", class: "popup__icon" }),
              this.hasAttribute("heading") &&
              create(this.getAttribute("headingElement") ?? "h2", { class: "h600 popup__heading" }, [
                this.getAttribute("heading")
              ]),
              this.hasAttribute("description") &&
              create("span", { class: "popup__description" }, [this.getAttribute("description")]),
            ]),
            create("div", { class: "popup__body" }, [
              create("slot")
            ]),
            create("div", { class: "popup__footer" }, [
              create("slot", { name: "footer" }),
              create("div", { class: "button-group" }, [
                ...(this.actions || []).map(({ content, onClick }, i) =>
                  create("button", {
                    onClick: onClick || this.close,
                    appearance: i === 0 ? (appearance ?? "primary") : "subtle"
                  }, [content])
                )
              ])
            ]),
          ])
        );
    }

    this.dialog.addEventListener("mousedown", ({ target, path }) => {
      if (target === this.dialog) {
        this.close();
      }
    });
  }

  scrollTo(...args) {
    this.shadowRoot.querySelector(".popup__body").scrollTo(...args);
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
