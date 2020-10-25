import { create } from "/src/helpers.js";

import baseStyle from "/src/styles/base.css.js";
import bannerStyle from "/src/styles/components/banner.css.js";

/*
 * A component used to show a prominent message at the top of the screen
 *
 * Modelled after <https://atlassian.design/components/banner/examples>
*/

customElements.define("qp-banner", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, bannerStyle];
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("div", { class: "banner", appearance: this.getAttribute("appearance") }, [
        create("ion-icon", { name: "alert-circle" }),
        create("slot"),
      ])
    );
  }
});
