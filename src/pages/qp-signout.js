import api from "/src/api.js";
import { navigateTo } from "/src/components/qp-router.js";

/*
 * Signout page
 * Will clear the token from session storage and redirect the user to login
*/

customElements.define("qp-signout", class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    sessionStorage.clear("token");
    navigateTo("/auth/login");
    window.location.reload();
  }
});
