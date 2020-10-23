import { create } from "/src/helpers.js";

import spinnerStyle from "/src/styles/components/spinner.css.js";

customElements.define("qp-spinner", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [spinnerStyle];
  }

  // Uses technique from:
  // <https://stackoverflow.com/a/28734954>
  connectedCallback() {
    const namespace = "http://www.w3.org/2000/svg"

    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.classList.add("spinner");

    const circle = document.createElementNS(namespace, "circle");
    circle.classList.add("spinner__dot");

    svg.append(circle);
    this.shadowRoot.append(svg);
  }
});

/*

<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="
    filL: red;
    display: block;
    color: red;
    width: 100px;
    height: 100px;
">
  <circle cx="50" cy="50" r="50" style="
    fill: none;
    cx: 8;
    cy: 8;
    r: 7;
    stroke-width: 1.5;
    stroke: rgb(66, 82, 110);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-dasharray: 60;
    stroke-dashoffset: inherit;
"></circle>
</svg>

*/
