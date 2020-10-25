import { create } from "/src/helpers.js";

import { navigateTo } from "/src/components/qp-router.js";
import api from "/src/api.js";

import "/src/components/qp-flag.js";

import baseStyle from "/src/styles/base.css.js";
import appStyle from "/src/styles/containers/app.css.js";

/*
 * A container component that wraps the entire app,
 * providing the navigation bar, basic layout and title capabilities
*/

customElements.define("qp-app", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, appStyle];

    this.pageTitle = "";

    this.start = Date.now();
    this.notified = new Set();

    this.poll = this.poll.bind(this);
    this.searchUser = this.searchUser.bind(this);
  }

  // Set the page title, showing on the left hand side in the navbar
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
          create("qp-nav-link", { slot: "primary", "aria-label": "search users", onClick: this.searchUser }, [
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

  // Poll to see if there is a new post from a user you follow
  async poll() {
    if (!this.isConnected) return;

    const { posts } = await api.user.feed({ n: 3 });
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

  // Shows a notification of a newly created post
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

  // Shows a modal used to search for a user
  searchUser() {
    const handleSubmit = async (event) => {
      event.preventDefault();

      const form = event.currentTarget;

      const data = new FormData(form);
      const username = data.get("username");

      const response = await api.user.getByUsername(username);
      console.log(response);
      switch (response.status) {
        // If the user is found then go to their profile
        case 200:
          navigateTo(`user/${username}`);
          break;

        // If the user isn't found show a message showing this
        case 404:
          const input = form.querySelector("#username");
          const helpText = create("span", { class: "help-text", appearance: "error" }, [
            create("ion-icon", { name: "alert-circle" }),
            response.message
          ]);
          if (input.nextElementSibling) {
            input.nextElementSibling.replaceWith(helpText);
          } else {
            input.insertAdjacentElement("afterend", helpText);
          }
          break;
      }
    };

    const modal = create("qp-popup", {
      heading: "Find a user",
      description: "Please note this will only find a user with the exact same username (case sensitive)",
      actions: [
        { content: "Search", onClick: () => modal.querySelector("form").requestSubmit() },
        { content: "Cancel" }
      ]
    }, [
      create("form", { onSubmit: handleSubmit }, [
        create("label", { class: "h200", for: "username", required: true }, ["Username"]),
        create("input", { id: "username", name: "username" })
      ])
    ]);

    this.shadowRoot.append(modal);
    modal.showModal();
  }
});
