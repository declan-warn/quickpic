import { create, getAvatar, showDateTime, moveCursorToEnd } from "/src/helpers.js";
import api from "/src/api.js";
import { navigateTo } from "/src/components/qp-router.js";

import "/src/components/qp-avatar.js";
import "/src/components/qp-post.js";
import "/src/components/qp-popup.js";
import "/src/components/qp-spinner.js";

import baseStyle from "/src/styles/base.css.js";
import profileStyle from "/src/styles/pages/profile.css.js";

const createInfo = (iconName, field, value, id = "") =>
  create("div", { class: "profile-card__info card" }, [
    create("ion-icon", { name: iconName, class: "profile-card__info__icon" }),
    create("span", { class: "profile-card__info__field" }, [field]),
    create("span", { class: "profile-card__info__value", id }, [value]),
  ]);

customElements.define("qp-profile", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, profileStyle];

    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
    this.editProfile = this.editProfile.bind(this);
  }

  async connectedCallback() {
    this.shadowRoot.append(
      create("div", { class: "profile" }, [
        create("aside", { class: "side-bar" }),
        create("div", { class: "profile__loading" }, [
          create("qp-spinner")
        ])
      ])
    )

    if (!this.getAttribute("username")) {
      const { username } = await api.user.getCurrent();
      return navigateTo(`user/${username}`);
    }

    [this.user, this.currentUser] = await Promise.all([
      api.user.getByUsername(this.getAttribute("username")),
      api.user.getCurrent()
    ]);


    [this.posts, this.following] =
      await Promise.all([
        Promise.all(this.user.posts.map(api.post.get)),
        Promise.all(this.user.following.map(api.user.getById)),
      ]);


    this.posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));
    this.following.sort((a, b) => a.username > b.username ? 1 : -1);

    this.closest("qp-app").setTitle(
      this.user.id === this.currentUser.id
        ? "Your Profile"
        : `${this.user.username}'s Profile`
    );

    this.render();
    this.renderPosts();
    this.renderFollowing();
  }

  render() {
    this.shadowRoot.firstChild.remove();
    this.shadowRoot.append(
      create("div", { class: "profile" }, [
        create("aside", { class: "side-bar" }, [
          this.currentUser.id === this.user.id
            ? this.renderEditButton()
            : this.currentUser.following.includes(this.user.id)
              ? this.renderUnfollowButton()
              : this.renderFollowButton(),
          create("span", { id: "following", class: "h300" }, [
            "Following",
            create("ion-icon", { name: "people-outline" })
          ]),
        ]),
        create("div", { class: "profile__main" }, [
          create("div", { class: "profile-card card" }, [
            create("header", { class: "profile-card__header" }, [
              create("qp-avatar", { user: this.user.username, size: "xlarge", class: "profile-card__avatar" }),
            ]),
            create("div", { class: "profile-card__body" }, [
              createInfo("finger-print", "Username", this.getAttribute("username")),
              this.user.name &&
              createInfo("person-circle", "Name", this.user.name, "profile--card__name"),
              this.user.email &&
              createInfo("at-circle", "Email", this.user.email, "profile--card__email"),
              createInfo("people-circle", "Followers", String(this.user.followed_num)),
              createInfo("heart-circle", "Likes",
                String(this.posts.reduce((count, { meta: { likes } }) => count + likes.length, 0))
              ),
              createInfo("list-circle", "Posts", String(this.posts.length)),
            ])
          ]),
          create("h2", { class: "h600 profile__posts-heading" }, ["Posts"]),
          create("div", { class: "profile__posts" }, [])
        ])
      ])
    );
  }

  renderEditButton() {
    return (
      create("button", { onClick: this.editProfile, class: "action", hero: true, appearance: "subtle" }, [
        create("ion-icon", { name: "build-outline" }),
        "Update",
      ])
    );
  }

  renderFollowButton() {
    return (
      create("button", { onClick: this.follow, class: "action", hero: true, appearance: "subtle" }, [
        create("ion-icon", { name: "person-add-outline" }),
        "Follow",
      ])
    );
  }

  renderUnfollowButton() {
    return (
      create("button", { onClick: this.unfollow, class: "action", hero: true, appearance: "subtle" }, [
        create("ion-icon", { name: "person-remove-outline" }),
        "Unfollow",
      ])
    );
  }

  renderPosts() {
    this.shadowRoot.querySelector(".profile__posts").append(...this.posts.map(post =>
      create("qp-post", {
        class: "post",
        "data-post-id": post.id,
        description: post.meta.description_text,
        thumbnail: `data:image/png;base64,${post.thumbnail}`,
        original: `data:image/png;base64,${post.src}`,
        published: post.meta.published,
        author: post.meta.author,
        likes: post.meta.likes,
        comments: post.comments,
        currentUser: this.currentUser,
      })
    ));
  }

  renderFollowing() {
    this.shadowRoot.querySelector(".side-bar").append(
      ...this.following.map(({ username }) =>
        create("button", { onClick: () => navigateTo(`/user/${username}`), appearance: "subtle" }, [username])
      )
    );
  }

  async follow() {
    this.shadowRoot.querySelector(".action[hero]").replaceWith(this.renderUnfollowButton());
    await api.user.follow(this.user.username);
  }

  async unfollow() {
    this.shadowRoot.querySelector(".action[hero]").replaceWith(this.renderFollowButton());
    await api.user.unfollow(this.user.username);
  }

  editProfile() {
    const saveChanges = async (event) => {
      event.preventDefault();

      const formData = new FormData(this.shadowRoot.querySelector("form"));
      const payload = Object.fromEntries(formData.entries());

      if (payload.password === "") {
        delete payload.password;
      }

      if (payload.name !== this.currentUser.name || payload.email !== this.currentUser.email || payload.password) {
        this.currentUser.name = payload.name;
        this.currentUser.email = payload.email;
        const nameElem = this.shadowRoot.getElementById("profile--card__name");
        const emailElem = this.shadowRoot.getElementById("profile--card__email");
        if (nameElem) nameElem.textContent = payload.name;
        if (emailElem) emailElem.textContent = payload.email;
        await api.user.update(payload);
      }

      modal.close();
    };

    const form =
      create("form", { onSubmit: saveChanges }, [
        create("label", { for: "name", class: "h200" }, ["Name"]),
        create("input", {
          id: "name",
          name: "name",
          placeholder: "John Smith",
          value: this.currentUser.name,
          onFocus: moveCursorToEnd,
        }),
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
        create("button", { hidden: true }), // to allow form submission by pressing enter
      ]);

    const modal = create("qp-popup", {
      heading: "Your information",
      actions: [
        { content: "Save", onClick: () => form.requestSubmit() },
        { content: "Cancel" }
      ]
    }, [form]);
    this.shadowRoot.append(modal);
    modal.showModal();
  }
});
