import { create } from "/src/helpers.js";

import baseStyle from "/src/styles/base.css.js";
import popupStyle from "/src/styles/components/popup.css.js";

/*
 * A modal component providing transitions, headings and actions
 *
 * Modelled after <https://atlassian.design/components/modal-dialog/examples>
*/

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
      // No chrome variant (no heading or actions)
      // Used to show expanded images from posts
      this.dialog =
        this.shadowRoot.appendChild(
          create("dialog", { class: "popup frame floating slide-in", "no-chrome": true, "no-hover": true }, [
            create("div", { class: "popup__body" }, [
              create("slot")
            ]),
          ])
        )
    } else {
      // Normal variant
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

    // Allow closing by clicking off
    this.dialog.addEventListener("mousedown", ({ target, path }) => {
      if (target === this.dialog) {
        this.close();
      }
    });

    // Allow closing by pressing escape
    const handleEscape = ({ code }) => {
      if (code === "Escape") {
        this.close();
        window.removeEventListener("keydown", handleEscape);
      }
    }
    window.addEventListener("keydown", handleEscape);
  }

  // This component wraps an HTML5 dialog element, so these methods pass information down
  // to the underlying dialog
  scrollTo(...args) {
    this.shadowRoot.querySelector(".popup__body").scrollTo(...args);
  }

  // Shows the modal
  // Will also make the document non-scrollable while the modal is open, saving
  // the scroll position for when it is closed
  showModal() {
    this.dialog.showModal();
    this.scrollOffset = window.scrollY;
    document.body.style.setProperty("--modalTop", `-${this.scrollOffset}px`);
    document.body.classList.add("modal-open");
  }

  // Closes the modal, playing a closing animation
  close() {
    this.dialog.classList.remove("slide-in");
    this.dialog.classList.add("slide-out");
    this.dialog.addEventListener("animationend", () => {
      this.dialog.close();
      this.remove();
    }, true);
  }

  // When the component is removed from the DOM, re-allow scrolling
  disconnectedCallback() {
    document.body.classList.remove("modal-open");
    window.scrollTo(0, this.scrollOffset);
    document.body.style.removeProperty("--modalTop");
  }
});
