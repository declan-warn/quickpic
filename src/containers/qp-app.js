import { create, linkToCSS } from "/src/helpers.js";

import { navigateTo } from "/src/components/qp-router.js";

import "/src/components/qp-dropdown.js";

customElements.define("qp-app", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-app.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);
  }

  connectedCallback() {
    if (!sessionStorage.getItem("token")) {
      return navigateTo("/auth/login");
    }

    this.shadowRoot.append(
      create("div", { id: "container" }, [
        create("qp-nav", {}, [
          // create("qp-nav-link", { slot: "logo" }, [
          //   create("ion-icon", { name: "aperture-outline", size: "large" })
          // ]),
          create("qp-nav-link", { slot: "primary", "aria-label": "feed" }, [
            create("ion-icon", { name: "grid" })
          ]),
          create("qp-nav-link", { slot: "primary", "aria-label": "search users" }, [
            create("ion-icon", { name: "search" })
          ]),
          create("qp-nav-link", { slot: "secondary", "aria-label": "profile" }, [
            create("qp-avatar", { size: "medium", outline: false })
          ])
        ]),
        create("slot")
      ])
    );
  }
});
