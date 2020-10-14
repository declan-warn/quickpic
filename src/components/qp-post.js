import { create, linkToCSS, withLoader, showDateTime } from "/src/helpers.js";
import api from "/src/api.js";

const stylesheet = () => linkToCSS("/styles/qp-post.css");

customElements.define("qp-post", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-post.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.showLikes = this.showLikes.bind(this);
    this.likePost = this.likePost.bind(this);
  }

  async connectedCallback() {
    const { id } = await api.user.getCurrent();

    this.shadowRoot.append(
      this.constructor.stylesheet,
      create("div", { id: "container", class: "card" }, [
        create("div", { id: "frame" }, [
          create("img", { src: this.getAttribute("src") }),
          create("button", { class: "icon-button" }, [
            create("ion-icon", { name: "expand" })
          ])
        ]),
        create("div", { id: "actions" }, [
          create("button", { onClick: this.likePost, id: "like", class: "icon-button" }, [
            create("ion-icon", {
              name: this.likes.includes(id) ? "heart" : "heart-outline"
            }),
          ]),
          create("span", { onClick: this.showLikes }, [String(this.likes.length)]),
          create("ion-icon", { class: "separator", name: "ellipse" }),
          create("button", { class: "icon-button" }, [
            create("ion-icon", { name: "chatbubble-outline" })
          ]),
          create("span", {}, [String(this.comments.length)])
        ]),
        create("span", { id: "description", class: "h400", title: this.getAttribute("description") }, [
          this.getAttribute("description")
        ]),
        create("footer", {}, [
          create("a", { id: "author", href: `#/user/${this.getAttribute("author")}` }, [
            create("qp-avatar", { size: "small", user: this.getAttribute("author") }),
            this.getAttribute("author")
          ]),
          create("time", { id: "published", class: "h200" }, [showDateTime(this.getAttribute("published"))]),
        ])
      ])
    );
  }

  async showLikes(event) {
    const users = await withLoader(Promise.all(this.likes.map(id => api.user.getById(id))));

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
    });
  }

  async likePost(event) {
    event.target.blur();
    const postId = this.getAttribute("data-post-id");
    console.log(await api.post.like(postId));
  }
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

    this.showComments = this.showComments.bind(this);
  }

  get comments() {
    return this.querySelectorAll("qp-post-comment");
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("div", { onClick: this.showComments, class: "action" }, [
        create("button", { class: "material-icons-outlined" }, ["forum"]),
        create("span", { class: "badge" }, [
          String(this.comments.length)
        ])
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
