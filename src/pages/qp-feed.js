import { create, withLoader, showDateTime, linkToCSS } from "/src/helpers.js";
import { navigateTo } from "/src/components/qp-router.js";
import api from "/src/api.js";

import "/src/components/qp-post.js";

customElements.define("qp-feed", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-feed.css");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);

    this.filterByUser = this.filterByUser.bind(this);
  }

  async connectedCallback() {
    const { posts } = await withLoader(api.user.feed());
    this.shadowRoot.append(
      create("div", { id: "feed" }, [
        create("aside", { id: "side-bar" }, [
          create("button", { class: "action" }, [
            create("ion-icon", { name: "add", size: "small" }),
            "New Post",
          ]),
          create("button", { class: "action" }, [
            create("ion-icon", { name: "eye-outline", size: "small" }),
            "View All",
          ]),
          create("span", { class: "h300" }, [
            "Order",
            create("ion-icon", { name: "swap-vertical-outline" })
          ]),
          create("span", { class: "h300" }, [
            "Filter",
            create("ion-icon", { name: "funnel-outline" })
          ]),
        ]),
        create("div", { class: "post-list" }, posts.map(post =>
          create("qp-post", {
            class: "post",
            "data-post-id": post.id,
            src: `data:image/png;base64,${post.src}`,
            description: post.meta.description_text,
            author: post.meta.author,
            published: post.meta.published,
            likes: post.meta.likes,
            comments: post.comments,
          })
        ))
      ])
    );

    const { following } = await api.user.getCurrent();
    const users = await Promise.all(following.map(api.user.getById));
    this.shadowRoot.getElementById("side-bar").append(
      ...users.map(user =>
        create("button", { onClick: () => this.filterByUser(user.username) }, [user.username])
      )
    )
  }

  filterByUser(username) {
    // const posts = [...this.shadowRoot.querySelectorAll("qp-post")];
    // posts.forEach(post => {
    //   if (post.querySelector("[slot='author']").textContent !== username) {
    //     post.style.display = "none";
    //   }
    // });
  }
});
