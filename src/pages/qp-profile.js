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
    this.editProfile = this.editProfile.bind(this);
  }

  async connectedCallback() {
    [this.user, this.currentUser] = await Promise.all([api.user.getCurrent(), api.user.getCurrent()]);
    // this.currentUser = await api.user.getCurrent();

    [this.posts, this.following] =
      await Promise.all([
        Promise.all(this.user.posts.map(api.post.get)),
        Promise.all(this.user.following.map(api.user.getById)),
      ]);

    this.following.sort();

    this.shadowRoot.appendChild(this.stylesheet).addEventListener("load", () => {
      this.render();
      this.renderPosts();
      this.renderFollowing();
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
          this.currentUser.id === this.user.id
            ? create("button", { onClick: this.editProfile, class: "action" }, [
              create("ion-icon", { name: "build-outline" }),
              "Edit profile",
            ])
            : this.currentUser.following.includes(this.user.id)
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
                create("span", {}, [
                  `${String(this.posts.reduce((post, count) => count + post.meta.likes.length, 0))} likes`
                ]),
              ]),
              create("div", { class: "profile-card-info" }, [
                create("ion-icon", { name: "list-circle" }),
                create("span", {}, [`${String(this.posts.length)} posts`]),
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
    console.log(this.following);
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

  editProfile() {
    const closePopup = () => {
      this.shadowRoot.getElementById("edit-profile").remove();
    };

    const handleClick = event => {
      if (event.target.matches("dialog")) {
        closePopup();
      }
    }

    const handleSubmit = async (event) => {
      event.preventDefault();

      const formData = new FormData(this.shadowRoot.querySelector("form"));
      const payload = Object.fromEntries(formData.entries());

      if (payload.password === "") {
        delete payload.password;
      }

      console.log(await api.user.update(payload));

      closePopup();
    };

    const popup = create("dialog", { onClick: handleClick, id: "edit-profile", class: "popup card floating" }, [
      create("div", { class: "popup-body" }, [
        create("span", { class: "h600 no-margin" }, ["Your information"]),
        create("form", { onSubmit: handleSubmit }, [
          create("label", { for: "name", class: "h200" }, ["Name"]),
          create("input", { id: "name", name: "name", placeholder: "John Smith", value: this.currentUser.name }),
          create("label", { for: "email", class: "h200" }, ["Email"]),
          create("input", {
            id: "email",
            type: "email",
            name: "email",
            placeholder: "john.smith@example.com",
            value: this.currentUser.email
          }),
          create("label", { for: "password", class: "h200" }, ["New password"]),
          create("input", { id: "password", type: "password", name: "password", placeholder: "•".repeat(10) }),
          create("span", { class: "help-text" }, [
            create("ion-icon", { name: "information-circle" }),
            "Leave blank if you do not wish to change your password"
          ]),
          create("button", { style: { marginTop: "16px" } }, ["Save"]),
        ])
      ])
    ]);
    this.shadowRoot.append(popup);
    popup.showModal();
  }
});
