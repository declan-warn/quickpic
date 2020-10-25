import { create } from "/src/helpers.js";

import spinnerStyle from "/src/styles/components/spinner.css.js";

/*
 * A spinner component that is used to denote a loading state.
 *
 * Modelled after <https://atlassian.design/components/spinner/examples>
*/

customElements.define("qp-spinner", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [spinnerStyle];
  }

  // Uses technique from:
  // <https://stackoverflow.com/a/28734954>
  connectedCallback() {
    const namespace = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.classList.add("spinner");

    const circle = document.createElementNS(namespace, "circle");
    circle.classList.add("spinner__dot");

    svg.append(circle);
    this.shadowRoot.append(svg);
  }
});
