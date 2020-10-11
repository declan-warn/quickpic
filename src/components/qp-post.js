import { create, linkToCSS, withLoader } from "/src/helpers.js";
import api from "/src/api.js";

const stylesheet = () => linkToCSS("/styles/qp-post.css");

customElements.define("qp-post", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(
      stylesheet(),
      create("div", { id: "container" }, [
        create("slot", { name: "image" }),
        create("slot", { name: "description" }),
        create("slot", { name: "author" }),
        create("slot", { name: "published" }),
        create("slot", { name: "likes" }),
        create("slot", { name: "comments" }),
      ])
    );
  }
});

customElements.define("qp-post-likes", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(stylesheet());

    this.handleClick = this.handleClick.bind(this);
  }

  get likes() {
    const likes = [...this.querySelectorAll("qp-post-like")];
    return likes.map(like => like.getAttribute("user"));
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("span", { onClick: this.handleClick }, [
        `${this.likes.length} like${this.likes.length === 1 ? "" : "s"}`
      ])
    );
  }

  async loadUsers() {
    const users = await Promise.all(this.likes.map(id => api.user.getById(id)));

    const list = create("div", {}, [
      create("h3", {}, ["Liked By"]),
      create("ul", {}, users.map(user =>
        create("li", {}, [user.username])
      ))
    ]);
    const popup = create("dialog", { id: "like-popup" }, [list]);

    this.shadowRoot.append(popup);
    popup.showModal();
    popup.addEventListener("click", ({ target }) => {
      if (target === popup) {
        popup.remove();
      }
    })
  }

  async handleClick(event) {
    withLoader(this.loadUsers());
  };
});

customElements.define("qp-post-comment", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(stylesheet());
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("div", { class: "comment" }, [
        create("slot", { name: "author" }),
        create("slot", { name: "published" }),
        create("slot", { name: "comment" }),
      ])
    );
  }
});

customElements.define("qp-post-comments", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(stylesheet());

    this.handleClick = this.handleClick.bind(this);
  }

  get comments() {
    return this.querySelectorAll("qp-post-comment");
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("span", { onClick: this.handleClick }, [
        `${this.comments.length} comment${this.comments.length === 1 ? "" : "s"}`
      ])
    );
  }

  async showComments() {
    const onSubmit = async (event) => {
      event.preventDefault();
      const input = event.currentTarget.querySelector("#new-comment");
      const postId = this.closest("qp-post").getAttribute("data-post-id");
      const response = await api.post.comment(postId, input.value);
    };

    const list = create("div", {}, [
      create("h3", {}, ["Comments"]),
      create("form", { onSubmit }, [
        create("input", { id: "new-comment", required: true })
      ]),
      create("slot")
    ]);
    const popup = create("dialog", { id: "like-popup" }, [list]);

    this.shadowRoot.append(popup);
    popup.showModal();
    popup.addEventListener("click", ({ target }) => {
      if (target === popup) {
        popup.remove();
      }
    })
  }

  async handleClick(event) {
    this.showComments();
  };
});
