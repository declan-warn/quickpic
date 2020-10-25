import { create, clear } from "/src/helpers.js";

/*
 * An attempt at a declarative router component
 * inspired a bit by react router.
 * 
 * Will show only the route that matches the current hash route.
 * 
 * Would probably handle the logic a bit differently if I did it again
 * but it works.
*/

// Helper function other components can use to redirect the user
export const navigateTo = route => {
  if (!route.startsWith("/")) {
    route = `/${route}`;
  }
  if (window.location.hash === `#${route}`) {
    window.location.reload();
  } else {
    window.location.hash = route;
  }
}

// The router, will check which route matches and render it
customElements.define("qp-router", class extends HTMLElement {
  constructor() {
    super();

    this.render = this.render.bind(this);
  }

  connectedCallback() {
    window.addEventListener("hashchange", this.render);
    this.render();
  }

  // Will render the first child route that matches the current route
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

// Route component, links a route with a component
//
// Routes can have requirements to render
// If these requirements are not met then they will redirect to whatever route is specified
// This is used to require authentication for certain routes
customElements.define("qp-route", class extends HTMLElement {
  constructor() {
    super();
  }

  // Renders the route
  // This includes any container component and children
  render(route) {
    const hasRedirect = this.hasAttribute("redirect");
    const hasRequirement = this.hasOwnProperty("require");

    if (hasRedirect && !(hasRequirement && this.meetsRequirement())) {
      // If the component has a redirect and doesn't meet its requirements (if they exist)
      // then it should redirect
      //
      // For a component with a redirect + requirement,
      // the redirect serves as a fallback rather than primary action
      return navigateTo(this.getAttribute("redirect"));
    }

    const path = this.getAttribute("path");
    const tail = route.slice(path.length);

    const component = this.getAttribute("component");
    // Finds the child (if any) that matches the route
    const child = [...this.children].find(child => child.matchesRoute(tail))?.render(tail) ?? "";

    const attributes = {};

    // Handle route parameters, so a single route pattern can handle infinite subroutes
    // e.g. /user/:username handles /user/Adam and /user/Jane and so on
    // These parameters are then provided to the route's rendered component
    if (/\/:\w+$/.test(path)) {
      const [head, tail] = path.split("/:");
      const value = route.slice(head.length + 1);
      attributes[tail] = value;
    }

    return (
      component
        ? create(component, attributes, [child])
        : child
    );
  }

  // Checks if a route component matches the current route
  // This checks all subroutes to see if a full match can be built
  //
  // A route will match if it meets at least one of:
  //    1) Is a default route
  //    2) Is an exact match
  //    3) Matches the start of the route path and one of its children matches the rest
  //    4) Matches the start of the route path and has a route parameter that can match the rest
  matchesRoute(route) {
    const path = this.getAttribute("path");
    const isDefault = this.isDefault();
    const isExact = path === route;
    const isPartial = route.startsWith(path) && this.childMatchesRoute(route.slice(path.length));

    let withParam = false;
    if (/\/:\w+$/.test(path)) {
      const [head] = path.split("/:");
      withParam = route.startsWith(head);
    }

    return (isDefault || isExact || isPartial || withParam);
  }

  childMatchesRoute(route) {
    return [...this.children].some(child => child?.matchesRoute(route));
  }

  meetsRequirement() {
    return this.require?.() ?? true;
  }

  isDefault() {
    return this.hasAttribute("default");
  }
});
