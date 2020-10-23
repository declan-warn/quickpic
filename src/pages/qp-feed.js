import { create, showDateTime, fileToDataUrl } from "/src/helpers.js";
import { navigateTo } from "/src/components/qp-router.js";
import api from "/src/api.js";

import "/src/components/qp-post.js";
import "/src/components/qp-popup.js";
import "/src/components/qp-spinner.js";

import baseStyle from "/src/styles/base.css.js";
import feedStyle from "/src/styles/pages/feed.css.js";

customElements.define("qp-feed", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    // this.shadowRoot.append(this.constructor.stylesheet);
    this.shadowRoot.adoptedStyleSheets = [baseStyle, feedStyle];

    this.newPost = this.newPost.bind(this);
    this.filterByUser = this.filterByUser.bind(this);
  }

  async connectedCallback() {
    const loading = this.shadowRoot.appendChild(
      create("div", { class: "feed" }, [
        create("aside", { class: "side-bar" }),
        create("section", { class: "feed__loading" }, [
          create("qp-spinner")
        ]),
      ])
    );

    // This whack looking promise gives us full parallel fetching while still letting us
    // await a single value
    const [{ posts: feedPosts }, [currentUser, myPosts]] =
      await Promise.all([
        api.user.feed(),
        api.user.getCurrent()
          .then(currentUser =>
            Promise.all([
              currentUser,
              Promise.all(currentUser.posts.map(api.post.get))
            ])
          )
      ]);

    const posts = feedPosts.concat(myPosts);
    posts.sort((a, b) => Number(b.meta.published) - Number(a.meta.published));

    loading.replaceWith(
      create("div", { class: "feed" }, [
        create("aside", { class: "side-bar" }, [
          create("button", { class: "action", onClick: this.newPost, hero: true, appearance: "subtle" }, [
            create("ion-icon", { name: "add", size: "small" }),
            "New post",
          ]),
          // create("span", { class: "h300" }, [
          //   "Order",
          //   create("ion-icon", { name: "swap-vertical-outline" })
          // ]),
          // create("span", { class: "h300" }, [
          //   "Filter",
          //   create("ion-icon", { name: "funnel-outline" })
          // ]),
        ]),
        create("section", { class: "feed__main" }, [
          create("div", { class: "feed__posts" }, posts.map(post =>
            create("qp-post", {
              class: "post",
              "data-post-id": post.id,
              thumbnail: `data:image/png;base64,${post.thumbnail}`,
              original: `data:image/png;base64,${post.src}`,
              description: post.meta.description_text,
              author: post.meta.author,
              published: post.meta.published,
              likes: post.meta.likes,
              comments: post.comments,
              currentUser,
            })
          ))
        ])
      ])
    );

    this.closest("qp-app").setTitle("Feed");

    // const { following } = await api.user.getCurrent();
    // const users = await Promise.all(following.map(api.user.getById));
    // this.shadowRoot.querySelector(".side-bar").append(
    //   ...users.map(user =>
    //     create("button", { onClick: () => this.filterByUser(user.username), appearance: "subtle" }, [user.username])
    //   )
    // )
  }

  newPost() {
    const popup = create("qp-popup", {
      heading: "New post",
      description: "Got some fresh OC or a spicy meme? Share it!",
      actions: [
        { content: "Create", onClick: () => this.shadowRoot.querySelector("form").requestSubmit() },
        { content: "Cancel" }
      ]
    }, [
      create("form", { onSubmit: handleSubmit }, [
        create("label", { for: "description", class: "h200", required: true }, ["Description"]),
        create("input", {
          id: "description",
          name: "description_text",
          required: true,
          maxlength: "100",
          onInput: ({ currentTarget }) => {
            currentTarget.nextElementSibling.textContent = `${currentTarget.value.length} / 100`;
          }
        }),
        create("span", { id: "description-char-count", class: "help-text" }, ["0 / 100"]),
        create("label", { for: "image", class: "h200", required: true }, ["Image"]),
        create("input", {
          id: "image",
          name: "image",
          type: "file",
          accept: "image/png,image/jpg,image/jpeg",
          required: true,
        })
      ])
    ]);
    this.shadowRoot.append(popup);
    console.log(popup);
    popup.showModal();

    async function handleSubmit(event) {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const payload = Object.fromEntries(data.entries());

      const dataUrl = await fileToDataUrl(payload.image);
      payload.src = dataUrl.match(/;base64,(.*)$/)[1];
      delete payload.image;

      const response = await api.post.new(payload);
      if (response.status !== 200) {
        alert(response.message);
      } else {
        window.location.reload();
      }
      popup.close();
    };
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
