import { create, showDateTime, getAvatar, showDate } from "/src/helpers.js";
import api from "/src/api.js";

import "/src/components/qp-popup.js";

import baseStyle from "/src/styles/base.css.js";
import postStyle from "/src/styles/components/post.css.js";
import { navigateTo } from "/src/components/qp-router.js";

/* 
 * Post component, shows a post from either the feed or a user's profile
 * Handles commenting, likes, editing, and expansion when clicked
*/

customElements.define("qp-post", class extends HTMLElement {
  // Listens to its description attribute, used for editing functionality
  static get observedAttributes() {
    return ["description"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, postStyle];

    // Lots of context binding as these are used as event handlers
    // and we don't want to lose the this context
    this.showLikes = this.showLikes.bind(this);
    this.likePost = this.likePost.bind(this);
    this.unlikePost = this.unlikePost.bind(this);
    this.toggleLike = this.toggleLike.bind(this);

    this.showComments = this.showComments.bind(this);
    this.addComment = this.addComment.bind(this);
    this.createComment = this.createComment.bind(this);

    this.edit = this.edit.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);

    this.expand = this.expand.bind(this);
  }

  get id() {
    return Number(this.getAttribute("data-post-id"));
  }

  async connectedCallback() {
    const { id } = this.currentUser;

    this.comments.sort((a, b) => Number(b.published) - Number(a.published));

    this.shadowRoot.append(
      create("div", { onClick: this.expand, class: "frame post__container" }, [
        create("div", { class: "post__frame" }, [
          create("img", {
            id: "image",
            class: "post__image",
            src: this.getAttribute("thumbnail"),
            alt: `Thumbnail of ${this.getAttribute("author")}'s image`
          }),
        ]),
        create("h2", {
          class: "post__description h400",
          title: this.getAttribute("description")
        }, [
          this.getAttribute("description")
        ]),
        create("div", { class: "post__action-bar" }, [
          create("div", { class: "button-group", spacing: "compact" }, [
            create("button", {
              onClick: this.toggleLike,
              class: "post__action",
              appearance: "subtle",
              "aria-label": this.likes.includes(id) ? "unlike" : "like",
            }, [
              create("ion-icon", { name: "heart", class: "post__action__icon" }),
              create("ion-icon", { name: "heart-outline", class: "post__action__icon" }),
            ]),
            create("button", { onClick: this.showLikes, appearance: "subtle-link" }, [String(this.likes.length)]),
            create("ion-icon", { class: "post__action-separator", name: "ellipse" }),
            create("button", {
              onClick: this.showComments,
              class: "post__action",
              appearance: "subtle",
              "aria-label": "comment"
            }, [
              create("ion-icon", { name: "chatbubble-outline", class: "post__action__icon" })
            ]),
            create("button", { onClick: this.showComments, appearance: "subtle-link" }, [String(this.comments.length)]),
          ]),
          this.currentUser.posts.includes(this.id) && (
            create("div", { class: "button-group" }, [
              create("button", { onClick: this.confirmDelete }, [
                create("ion-icon", { name: "trash" })
              ]),
              create("button", { onClick: this.edit, appearance: "primary" }, ["Edit"]),
            ])
          )
        ]),
        create("footer", { class: "post__footer" }, [
          create("button", {
            class: "post__author",
            onClick: () => navigateTo(`/user/${this.getAttribute("author")}`),
            appearance: "link",
            title: "View Profile"
          }, [
            create("qp-avatar", { class: "post__avatar", size: "small", user: this.getAttribute("author") }),
            this.getAttribute("author")
          ]),
          create("time", { class: "post__published" }, [showDate(this.getAttribute("published"))]),
        ])
      ])
    );
  }

  // Update DOM if description attribute is changed
  // This will occur if the user edits their post
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "description") {
      const descElem = this.shadowRoot.querySelector(".post__description");
      if (descElem) {
        descElem.textContent = newValue;
      }
    }
  }

  // Show a modal containing a list of users who have liked the post
  async showLikes(event) {
    const users = await Promise.all(this.likes.map(id => api.user.getById(id)));

    const modal = create("qp-popup", {
      heading: "Likes",
      headingElement: "h3",
      description: "People who have liked this post",
      actions: [
        { content: "Close" }
      ]
    }, [
      users.length > 0
        ? create("ul", {}, users.map(({ username }) =>
          create("li", {}, [
            create("button", {
              class: "post__author",
              onClick: () => navigateTo(`/user/${username}`),
              appearance: "link"
            }, [
              create("qp-avatar", { class: "post__avatar", size: "small", user: username }),
              username
            ]),
          ])
        ))
        : create("span", { class: "help-text post__no-likes" }, [
          create("ion-icon", { name: "sad-outline" }),
          "No one yet",
        ])
    ]);

    this.shadowRoot.append(modal);
    modal.showModal();
  }

  // Like the post, doing a dynamic update of the DOM
  async likePost(event) {
    const button = event.currentTarget;
    const oldCount = Number(button.nextSibling.textContent);
    button.setAttribute("aria-label", "unlike");
    button.nextSibling.textContent = String(oldCount + 1);
    this.likes = this.likes.concat(this.currentUser.id);
    await api.post.like(this.id);
  }

  // Unlike the post, doing a dynamic update of the DOM
  async unlikePost(event) {
    const button = event.currentTarget;
    const oldCount = Number(button.nextSibling.textContent);
    button.setAttribute("aria-label", "like");
    button.nextSibling.textContent = String(oldCount - 1);
    this.likes = this.likes.filter(id => id !== this.currentUser.id);
    await api.post.unlike(this.id);
  }

  // Toggle liked/unliked states
  async toggleLike(event) {
    const button = event.currentTarget;
    const oldCount = Number(button.nextSibling.textContent);
    if (button.getAttribute("aria-label") === "like") {
      await this.likePost(event);
    } else {
      await this.unlikePost(event);
    }
  }

  // Shows the comments in a modal, and allows for the current user to comment
  async showComments() {
    const modal =
      create("qp-popup", {
        heading: "Comments",
        headingElement: "h3",
      }, [
        create("div", { class: "comment-list" }, this.comments.map(this.createComment)),
        create("span", { class: "help-text" }, [
          create("ion-icon", { name: "sad-outline" }),
          "No comments yet",
        ]),
        create("form", { onSubmit: this.addComment, class: "comment__form", slot: "footer" }, [
          create("input", { id: "new-comment", required: true, placeholder: "Your thoughts..." }),
          create("div", { class: "button-group" }, [
            create("button", { appearance: "primary" }, ["Comment"]),
            create("button", {
              appearance: "subtle",
              onClick: event => {
                event.preventDefault();
                modal.close();
              }
            }, ["Close"]),
          ])
        ])
      ]);

    this.shadowRoot.append(modal);
    modal.showModal();
  }

  // Event handler to add a comment, will do DOM manipulation to create the comment immediately
  async addComment(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector("#new-comment");

    input.setAttribute("disabled", "");

    const { status } = await api.post.comment(this.id, input.value);
    if (status === 200) {
      const { username: author } = await api.user.getCurrent();

      // Handle discrepancy between python/javascript second/millisecond difference with times
      const published = String(Date.now() / 1000);

      const comments = this.shadowRoot.querySelector(".comment-list");
      comments.prepend(
        this.createComment({ author, published, comment: input.value })
      );

      this.comments.unshift({ author, published, comment: input.value });
      const indicator = this.shadowRoot.querySelector("[aria-label=comment]").nextElementSibling;
      const count = Number(indicator.textContent);
      indicator.textContent = String(count + 1);

      input.value = "";
      input.blur();
      input.removeAttribute("disabled");
      input.closest("qp-popup").scrollTo({ top: 0, left: 0, behaviour: "smooth" });
    }
  }

  // Will render a comment
  createComment({ author, published, comment }) {
    return (
      create("div", { class: "comment" }, [
        create("qp-avatar", { class: "comment__avatar", size: "medium", user: author }),
        create("div", { class: "comment__body" }, [
          create("header", { class: "comment__body__meta" }, [
            create("button", {
              class: "comment__author",
              onClick: () => navigateTo(`/user/${author}`),
              appearance: "link",
              title: "View Profile"
            }, [author]),
            author === this.getAttribute("author") && create("span", { class: "lozenge" }, ["Author"]),
            create("time", { class: "comment__published" }, [showDate(published)]),
          ]),
          create("p", { class: "comment__content" }, [comment]),
        ])
      ])
    );
  }

  // Show the edit modal for a post
  async edit() {
    const saveChanges = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const payload = Object.fromEntries(data.entries());

      if (payload.description_text !== this.getAttribute("description")) {
        this.setAttribute("description", payload.description_text);
        modal.close();
        await api.post.edit(this.id, payload);
      }

    };

    const form = create("form", { onSubmit: saveChanges }, [
      create("label", { for: "desc", class: "h200", required: true }, ["Description"]),
      create("input", {
        id: "desc",
        name: "description_text",
        value: this.getAttribute("description"),
        required: true,
        maxlength: "100",
        onFocus: ({ currentTarget }) => {
          currentTarget.selectionStart = currentTarget.selectionEnd = currentTarget.value.length;
        },
        onInput: ({ currentTarget }) => {
          currentTarget.nextElementSibling.textContent = `${currentTarget.value.length} / 100`;
        }
      }),
      create("span", { id: "description-char-count", class: "help-text" }, [
        `${this.getAttribute("description").length} / 100`
      ]),
    ]);

    const modal = create("qp-popup", {
      heading: "Edit post",
      headingElement: "h3",
      description: "Change the metadata of the post",
      actions: [
        {
          content: "Save",
          onClick: () => form.requestSubmit()
        },
        { content: "Cancel" }
      ]
    }, [form]);
    this.shadowRoot.append(modal);
    modal.showModal();
  }

  // Show a modal to confirm that the user actually wants to delete the post
  confirmDelete() {
    const deletePost = async (event) => {
      await api.post.delete(this.id);
      modal.close();
      this.remove();
    };

    const modal = create("qp-popup", {
      heading: "You're about to delete this post",
      headingElement: "h3",
      appearance: "danger",
      actions: [
        { onClick: deletePost, content: "Delete" },
        { content: "Cancel" }
      ]
    }, [
      create("p", {}, ["This action is permanent. You will not be able to recover your post after deletion."]),
    ]);
    this.shadowRoot.append(modal);
    modal.showModal();
  }

  // Expands an image to occupy most of the viewport
  expand(event) {
    // Not ideal but better than binding a bunch of events just to stop propagation
    // Clicking these areas (and only these areas) will expand the image
    const allowedTargets = [
      ".post__container",
      ".post__image",
      ".post__frame",
      ".post__action-bar",
      ".post__description",
      ".post__footer"
    ];
    if (!event.path[0].matches(allowedTargets.join(", "))) return;

    const modal = create("qp-popup", {
      "no-chrome": true
    }, [
      create("img", {
        src: this.getAttribute("original"),
        class: "post__image--expanded",
        alt: `${this.getAttribute("author")}'s image`
      })
    ]);

    this.shadowRoot.append(modal);
    modal.showModal();
  }
});
