import { create, linkToCSS } from "/src/helpers.js";

import { navigateTo } from "/src/components/qp-router.js";
import api from "/src/api.js";

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

  async connectedCallback() {
    this.shadowRoot.append(
      create("div", { id: "container" }, [
        create("qp-nav", {}, [
          create("qp-nav-link", { slot: "primary", "aria-label": "feed" }, [
            create("a", { href: "#/feed" }, [
              create("ion-icon", { name: "grid" })
            ])
          ]),
          create("qp-nav-link", { slot: "primary", "aria-label": "search users" }, [
            create("ion-icon", { name: "search" })
          ]),
          create("qp-nav-link", { slot: "secondary", "aria-label": "sign out" }, [
            create("a", { href: "#/auth/signout" }, [
              create("ion-icon", { name: "log-out-outline" })
            ])
          ]),
          create("qp-nav-link", { slot: "secondary", "aria-label": "profile" }, [
            create("a", { href: "#/user" }, [
              create("qp-avatar", { size: "medium", outline: false })
            ])
          ])
        ]),
        create("slot")
      ])
    );

    this.currentUser = await api.user.getCurrent();
    const start = Date.now();
    const notified = new Set();
    const poll = async () => {
      const { posts } = await api.user.feed();
      const newPosts = new Set();
      for (const post of posts) {
        if (!notified.has(post.id) && Number(post.meta.published) * 1000 > start) {
          newPosts.add(post);
        } else {
          break;
        }
      }
      for (const post of newPosts) {
        console.log("NEW POST:", post);
        // TODO: notify
        notified.add(post.id);
      }
      window.setTimeout(poll, 2500);
    };
    poll();
  }
});
