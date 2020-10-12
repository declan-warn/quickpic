import { create, getAvatar, linkToCSS } from "/src/helpers.js";
import api from "/src/api.js";

import "/src/components/qp-avatar.js";
import "/src/components/qp-post.js";

const showDateTime = published => {
  const timestamp = Number(published) * 1000;
  const date = new Date(timestamp);
  return date.toLocaleString();
};

customElements.define("qp-profile", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-profile.css");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);

    if (!this.getAttribute("data-username")) {
      // TODO:
    }
  }

  async connectedCallback() {
    this.render({ isLoading: true });
    this.user = await api.user.getCurrent();
    this.render({ isLoading: false });

    this.posts = await Promise.all(this.user.posts.map(api.post.get));
    this.renderPosts();
  }

  render({ isLoading }) {
    this.clear();

    if (isLoading) {
      this.shadowRoot.append(
        create("div", {}, ["loading..."])
      );
    } else {
      this.shadowRoot.append(
        create("div", { id: "profile" }, [
          create("section", { id: "info" }, [
            create("qp-avatar", { size: "xxlarge" }),
            create("h1", {}, [this.user.username]),
            create("table", {}, [
              create("tr", {}, [
                create("th", {}, ["Name"]),
                create("td", {}, [
                  create("input", { value: this.user.username })
                ])
              ]),
              create("tr", {}, [
                create("th", {}, ["Email"]),
                create("td", {}, [
                  create("input", { value: this.user.email })
                ])
              ]),
              create("tr", {}, [
                create("th", {}, ["Password"]),
                create("td", {}, [
                  create("input", { value: "password", type: "password" })
                ])
              ])
            ])
          ]),
          create("section", { id: "posts", class: "post-list" }, ["loading..."])
        ])
      );
    }
  }

  renderPosts() {
    const parent = this.shadowRoot.getElementById("posts");
    while (parent.hasChildNodes()) {
      parent.lastChild.remove();
    }
    parent.append(...this.posts.map(post =>
      create("qp-post", { class: "post", "data-post-id": post.id }, [
        create("h2", { slot: "description" }, [post.meta.description_text]),
        create("img", { slot: "image", src: `data:image/png;base64,${post.src}` }),
        create("span", { slot: "author" }, [post.meta.author]),
        create("time", { slot: "published" }, [showDateTime(post.meta.published)]),
        create("qp-post-likes", { slot: "likes" }, post.meta.likes.map(like =>
          create("qp-post-like", { user: like })
        )),
        create("qp-post-comments", { slot: "comments" }, post.comments.map(comment =>
          create("qp-post-comment", {}, [
            create("span", { slot: "author" }, [comment.author]),
            create("span", { slot: "published" }, [showDateTime(comment.published)]),
            create("span", { slot: "comment" }, [comment.comment]),
          ])
        )),
      ])
    ));
  }

  clear() {
    while (this.shadowRoot.hasChildNodes()) {
      this.shadowRoot.lastChild.remove();
    }
    this.shadowRoot.append(this.constructor.stylesheet);
  }
});
