import { create, clear } from "/src/helpers.js";

export const navigateTo = route => {
  if (!route.startsWith("/")) {
    route = `/${route}`;
  }
  window.location.hash = route;
}

export const getRoute = () =>
  window.location.hash.replace(/^#/, "");

const tail = route =>
  route.replace(/^\/[^\/]*/, "");

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
    this.clear();
    const route = window.location.hash.replace(/^#/, "");
    for (const child of this.children) {
      if (child.matches("qp-route") && child.matchesRoute(route)) {
        this.append(child.render(route));
        break;
      }
    }
  }

  clear() {
    for (const child of [...this.childNodes]) {
      if (!child.matches?.("qp-route")) {
        child.remove();
      }
    }
  }
});

customElements.define("qp-route", class extends HTMLElement {
  constructor() {
    super();
  }

  render(route) {
    if (this.hasAttribute("redirect")) {
      return navigateTo(this.getAttribute("redirect"));
    }

    const path = this.getAttribute("path");
    const tail = route.slice(path.length);

    const component = this.getAttribute("component");
    const child = [...this.children].find(child => child.matchesRoute(tail))?.render(tail) ?? "";

    return (
      component
        ? create(component, {}, [child])
        : child
    );
  }

  matchesRoute(route) {
    const path = this.getAttribute("path");
    const isDefault = this.isDefault();
    const isExact = path === route;
    const isPartial = route.startsWith(path) && this.childMatchesRoute(route.slice(path.length));

    return isDefault || isExact || isPartial;
  }

  childMatchesRoute(route) {
    return [...this.children].some(child => child?.matchesRoute(route));
  }

  isDefault() {
    return this.getAttribute("default") === "true";
  }
});
