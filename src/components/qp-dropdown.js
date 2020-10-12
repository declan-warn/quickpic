import { create, linkToCSS } from "/src/helpers.js";

customElements.define("qp-dropdown", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.close = this.close.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.append(
      linkToCSS("/styles/qp-dropdown.css"),
      create("span", { id: "container" }, [
        create("slot", { name: "entry" }),
        create("div", { id: "menu" }, [
          create("slot", { name: "item" }),
        ])
      ])
    );

    this.container = this.shadowRoot.querySelector("#container");
    this.menu = this.shadowRoot.querySelector("#menu");

    this.container.addEventListener("click", event => {
      event.stopPropagation();
      this.toggle();
    });

    this.menu.addEventListener("click", event => {
      event.stopPropagation();
    });

    window.addEventListener("click", this.close);
  }

  disconnectedCallback() {
    window.removeEventListener("click", this.close);
  }

  open() {
    this.container.classList.add("active");

    const rect = this.menu.getBoundingClientRect();
    if (rect.x + rect.width > window.innerWidth) {
      this.menu.classList.add("right");
    } else if (rect.x < 0) {
      this.menu.classList.add("left");
    }

  }

  close() {
    this.container.classList.remove("active");
    this.menu.classList.remove("left", "right");
  }

  toggle() {
    if (this.container.classList.contains("active")) {
      this.close();
    } else {
      this.open();
    }
  }
});
