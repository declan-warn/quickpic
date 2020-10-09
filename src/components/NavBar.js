import { create, css } from "/src/helpers.js";

customElements.define("nav-bar", class NavBar extends HTMLElement {
  static style = css(`
    .nav-bar {
      background: red;
    }
  `);

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.append(
      NavBar.style,
      create("nav", { className: "nav-bar" }, [
        create("slot", { name: "left" }),
        create("slot", { name: "right" }),
      ])
    );
  }
});

export default (...children) => create("nav-bar", undefined, children);
