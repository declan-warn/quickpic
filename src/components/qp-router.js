import { create, clear } from "/src/helpers.js";

customElements.define("qp-router", class extends HTMLElement {
  constructor() {
    super();

    this.render = this.render.bind(this);
  }

  connectedCallback() {
    window.addEventListener("hashchange", this.render);
    this.render();
  }

  render() {
    const route = window.location.hash.replace(/^#/, "");
    for (const child of this.children) {
      if (child.matches("qp-route") && child.matchesRoute(route)) {
        this.append(child.render());
        break;
      }
    }
  }

  clear() {
    clear(this);
  }
});

customElements.define("qp-route", class QPRoute extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    return create(this.getAttribute("component"));
  }

  matchesRoute(route) {
    return this.isDefault() || this.getAttribute("path") === route;
  }

  isDefault() {
    return this.getAttribute("default") === "true";
  }
});
