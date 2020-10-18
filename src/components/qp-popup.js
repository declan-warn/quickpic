import { create, linkToCSS } from "/src/helpers.js";

// Uses techniques mentioned in:
// <https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/>

// if (!customElements.get("qp-popup")) {
customElements.define("qp-popup", class extends HTMLElement {
  stylesheet = linkToCSS("/styles/base.css");

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.dialog = create("dialog", { class: "popup card floating" }, [
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
    this.dialog.close();
    this.remove();
  }

  disconnectedCallback() {
    document.body.classList.remove("modal-open");
    window.scrollTo(0, this.scrollOffset);
    document.body.style.removeProperty("--modalTop");
  }
});
// }
