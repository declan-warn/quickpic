import { create, linkToCSS, withLoader, showDateTime, getAvatar, showDate } from "/src/helpers.js";
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
    this.showComments = this.showComments.bind(this);

    this.expandImage = this.expandImage.bind(this);
    this.contractImage = this.contractImage.bind(this);
  }

  get id() {
    return this.getAttribute("data-post-id");
  }

  async connectedCallback() {
    const { id } = await api.user.getCurrent();

    this.comments.sort((a, b) => Number(b.published) - Number(a.published));

    this.shadowRoot.appendChild(this.constructor.stylesheet).addEventListener("load", () => {
      this.shadowRoot.append(
        create("div", { id: "container", class: "card" }, [
          create("div", { id: "frame" }, [
            create("img", { id: "image", src: this.getAttribute("src") }),
            create("button", { onClick: this.expandImage, class: "icon-button" }, [
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
            create("button", { onClick: this.showComments, class: "icon-button" }, [
              create("ion-icon", { name: "chatbubble-outline" })
            ]),
            create("span", {}, [String(this.comments.length)])
          ]),
          create("span", {
            onClick: this.showComments,
            id: "description",
            class: "h400",
            title: this.getAttribute("description")
          }, [
            this.getAttribute("description")
          ]),
          create("footer", {}, [
            create("a", { class: "author", href: `#/user/${this.getAttribute("author")}` }, [
              create("qp-avatar", { size: "small", user: this.getAttribute("author") }),
              this.getAttribute("author")
            ]),
            create("time", { class: "published" }, [showDate(this.getAttribute("published"))]),
          ])
        ])
      )
    }, true);
  }

  async expandImage() {
    const img = this.shadowRoot.getElementById("image");
    const rect = img.getBoundingClientRect();
    const clone = create("dialog", {}, [
      create("img", { src: img.src }),
      create("button", { onClick: this.contractImage, class: "icon-button floating" }, [
        create("ion-icon", { name: "contract" })
      ])
    ]);
    clone.style.setProperty("--expandStartLeft", `${Math.round(rect.x)}px`);
    clone.style.setProperty("--expandStartTop", `${Math.round(rect.y)}px`);
    clone.style.setProperty("--expandStatWidth", `${Math.round(rect.width)}px`);
    clone.style.setProperty("--expandStatHeight", `${Math.round(rect.height)}px`);
    img.insertAdjacentElement("beforebegin", clone);
    clone.showModal();
    clone.addEventListener("click", ({ path }) => {
      if (path[0] === clone) {
        this.contractImage();
      }
    });
    img.style.visibility = "hidden";
    img.nextSibling.style.visibility = "hidden";
    clone.classList.add("expanded", "floating", "card");
  }

  async contractImage() {
    const clone = this.shadowRoot.querySelector("dialog");
    clone.addEventListener("animationend", () => {
      const img = this.shadowRoot.getElementById("image");
      img.style.visibility = "visible";
      img.nextSibling.style.visibility = "visible";
      clone.remove();
    });
    clone.classList.add("contract");
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
    console.log(await api.post.like(this.id));
  }

  async showComments() {
    const onSubmit = async (event) => {
      event.preventDefault();
      const input = event.currentTarget.querySelector("#new-comment");
      const response = await api.post.comment(this.id, input.value);
    };

    const popup = create("dialog", { id: "comment-popup", class: "popup card floating" }, [
      create("div", { onClick: event => event.stopPropagation() }, [
        create("header", { class: "sticky" }, [
          create("span", { class: "h600" }, ["Comments"]),
          create("form", { onSubmit }, [
            create("label", { class: "h200", for: "new-comment" }, ["New Comment"]),
            create("input", { id: "new-comment", required: true, placeholder: "What are your thoughts?" })
          ]),
        ]),
        ...this.comments.map(({ author, published, comment }) =>
          create("div", { class: "comment" }, [
            create("qp-avatar", { size: "medium", user: author }),
            create("div", { class: "comment-body" }, [
              create("header", {}, [
                create("a", { class: "author", href: `#/user/${author}` }, [author]),
                author === this.getAttribute("author") && create("span", { class: "lozenge" }, ["Author"]),
                create("time", { class: "published" }, [showDate(published)]),
              ]),
              create("p", {}, [comment]),
            ])
          ])
        )
      ])
    ]);

    this.shadowRoot.append(popup);
    popup.showModal();
    popup.addEventListener("click", ({ target }) => {
      if (target === popup) {
        popup.remove();
      }
    })
  }
});
