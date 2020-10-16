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
  stylesheet = linkToCSS("/styles/qp-profile.css");
  stylesheetLoaded =
    new Promise((resolve) => this.stylesheet.addEventListener("load", resolve, true));

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    if (!this.getAttribute("data-username")) {
      // TODO:
    }

    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
  }

  async connectedCallback() {
    this.user = await api.user.getCurrent();
    this.currentUser = await api.user.getCurrent();

    this.shadowRoot.appendChild(this.stylesheet).addEventListener("load", () => {
      this.render();

      Promise.all(this.user.posts.map(api.post.get)).then(posts => {
        this.posts = posts;
        this.renderPosts();
      });

      Promise.all(this.user.following.map(api.user.getById)).then(following => {
        this.following = following.sort();
        this.renderFollowing();
      });
    }, true);
  }

  awaitLoaded() {
    return this.shadowRoot.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) => this.stylesheet.addEventListener("load", resolve, true));
  }

  render() {
    this.shadowRoot.append(
      create("div", { id: "profile" }, [
        create("aside", { class: "side-bar" }, [
          this.currentUser.following.includes(this.user.id)
            ? create("button", { onClick: this.unfollow, class: "action" }, [
              create("ion-icon", { name: "person-remove-outline" }),
              "Unfollow",
            ])
            : create("button", { onClick: this.follow, class: "action" }, [
              create("ion-icon", { name: "person-add-outline" }),
              "Follow",
            ]),
          create("span", { id: "following", class: "h300" }, [
            "Following",
            create("ion-icon", { name: "people-outline" })
          ]),
        ]),
        create("div", { class: "content" }, [
          create("div", { class: "profile-card card" }, [
            create("header", {}, [
              create("qp-avatar", { user: this.user.username, size: "xlarge" }),
              create("span", {}, [this.user.username]),
            ]),
            create("div", { class: "profile-card-body" }, [
              this.user.name && create("div", { class: "profile-card-info" }, [
                create("ion-icon", { name: "person-circle" }),
                create("span", {}, [this.user.name]),
              ]),
              this.user.email && create("div", { class: "profile-card-info" }, [
                create("ion-icon", { name: "at-circle" }),
                create("span", {}, [this.user.email]),
              ]),
              create("div", { class: "profile-card-info" }, [
                create("ion-icon", { name: "people-circle" }),
                create("span", {}, [`${this.user.followed_num} followers`]),
              ]),
              create("div", { class: "profile-card-info" }, [
                create("ion-icon", { name: "heart-circle" }),
                create("span", {}, ["TODO likes"]),
              ]),
            ])
          ]),
          create("div", { class: "post-list" }, [])
        ])
      ])
    );
  }

  renderPosts() {
    this.shadowRoot.querySelector(".post-list").append(...this.posts.map(post =>
      create("qp-post", {
        class: "post",
        "data-post-id": post.id,
        description: post.meta.description_text,
        src: `data:image/png;base64,${post.src}`,
        published: post.meta.published,
        author: post.meta.author,
        likes: post.meta.likes,
        comments: post.comments,
      })
    ));
  }

  renderFollowing() {
    this.shadowRoot.querySelector(".side-bar").append(
      ...this.following.map(({ username }) =>
        create("a", { href: `#/profile/${username}` }, [
          create("button", {}, [username])
        ])
      )
    );
  }

  async follow() {
    console.log(await api.user.follow(this.user.username));
  }

  async unfollow() {
    console.log(await api.user.unfollow(this.user.username));
  }
});
