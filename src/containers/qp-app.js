import { create } from "/src/helpers.js";

import { navigateTo } from "/src/components/qp-router.js";
import api from "/src/api.js";

import "/src/components/qp-flag.js";

import baseStyle from "/src/styles/base.css.js";
import appStyle from "/src/styles/containers/app.css.js";

customElements.define("qp-app", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, appStyle];

    this.pageTitle = "";

    this.start = Date.now();
    this.notified = new Set();

    this.poll = this.poll.bind(this);
  }

  setTitle(title) {
    const h1 = this.shadowRoot.querySelector(".app__page-title");

    this.pageTitle = title;
    h1.textContent = title;
    h1.classList.add("fade");
    h1.addEventListener("animationend", () => { h1.classList.remove("fade") }, true);
  }

  async connectedCallback() {
    this.shadowRoot.append(
      create("div", { class: "app__container" }, [
        create("qp-nav", {}, [
          create("h1", { slot: "page-title", class: "h800 app__page-title" }, []),
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
          ]),
        ]),
        create("slot")
      ])
    );

    this.currentUser = await api.user.getCurrent();
    this.nextPoll = window.setTimeout(this.poll, 0);
  }

  async poll() {
    if (!this.isConnected) return;


    const { posts } = await api.user.feed();
    const newPosts = new Set();
    for (const post of posts) {
      if (!this.notified.has(post.id) && Number(post.meta.published) * 1000 > this.start) {
        newPosts.add(post);
      } else {
        break;
      }
    }
    for (const post of newPosts) {
      this.notify(post);
      this.notified.add(post.id);
    }
    this.nextPoll = window.setTimeout(this.poll, 2500);
  }

  notify(post) {
    const flag = create("qp-flag", {
      icon: "information-circle",
      heading: "New Content!",
      description: `${post.meta.author} just made a new post.`,
      appearance: "info",
      actions: [
        { content: "Check it out", onClick: () => { navigateTo("/feed") } }
      ]
    });
    this.shadowRoot.append(flag);
  }
});
