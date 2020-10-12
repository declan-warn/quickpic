import api from "/src/api.js";
import { navigateTo } from "/src/components/qp-router.js";

customElements.define("qp-signout", class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    localStorage.clear("token");
    navigateTo("/auth/login");
  }
});
