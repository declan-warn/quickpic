import { create } from "/src/helpers.js";

import baseStyle from "/src/styles/base.css.js";
import flagStyle from "/src/styles/flag.css.js";

customElements.define("qp-flag", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, flagStyle];

    this.close = this.close.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("dialog", { class: "flag opening", open: true, appearance: this.getAttribute("appearance") }, [
        create("header", { class: "flag__header" }, [
          create("ion-icon", { class: "flag__icon", name: this.getAttribute("icon") }),
          create("h2", { class: "flag__heading" }, [this.getAttribute("heading")]),
          create("button", { onClick: this.close, class: "flag__close", appearance: "link" }, [
            create("ion-icon", { name: "close" })
          ])
        ]),
        create("span", { class: "flag__body" }, [this.getAttribute("description")]),
        create("footer", { class: "flag__footer" }, this.actions?.map(({ content, onClick }) =>
          create("button", { onClick, spacing: "compact", class: "flag__action" }, [content])
        )),
      ])
    );

    this.shadowRoot.querySelector(".flag")
      .addEventListener("animationend", ({ currentTarget }) => {
        currentTarget.classList.remove("opening");
      }, true);
  }

  close() {
    this.shadowRoot.querySelector(".flag").classList.add("closing");
    this.shadowRoot.querySelector(".flag")
      .addEventListener("animationend", () => this.remove(), true);
  }

});
