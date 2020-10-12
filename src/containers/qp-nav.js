import { create, linkToCSS } from "/src/helpers.js";

customElements.define("qp-nav", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-nav.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(
      this.constructor.stylesheet,
      create("nav", {}, [
        create("div", {}, [
          create("slot", { name: "link" }),
        ]),
        create("div", {}, [
          create("slot"),
        ]),
      ])
    );
  }

  connectedCallback() {
    for (const child of this.children) {
      console.log("CHILD", child);
      if (child.tagName.toLowerCase() === "qp-nav-link") {
        child.setAttribute("slot", "link");
      }
    }
  }
});

customElements.define("qp-nav-link", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-nav.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);
  }

  connectedCallback() {
    const active = window.location.hash.endsWith(this.getAttribute("to"));
    console.log(window.location.hash, this.getAttribute("to"), active);
    this.shadowRoot.append(
      create("a", { class: `${active ? "active" : ""}`, href: `#/${this.getAttribute("to")}` }, [
        create("slot")
      ])
    );
  }
});
