import { create, showDateTime, fileToDataUrl, numDesc, numFnDesc, take, getScrollPercentage } from "/src/helpers.js";
import { navigateTo } from "/src/components/qp-router.js";
import api from "/src/api.js";

import "/src/components/qp-post.js";
import "/src/components/qp-popup.js";
import "/src/components/qp-spinner.js";

import baseStyle from "/src/styles/base.css.js";
import feedStyle from "/src/styles/pages/feed.css.js";

/*
 * Component representing the entire feed page
 *
 * Handles fetching + rendering posts, as well as new post functionality
 * 
 * Provides infinite scroll using an async generator
*/

customElements.define("qp-feed", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, feedStyle];

    this.handleScroll = this.handleScroll.bind(this);
    this.renderPost = this.renderPost.bind(this);
    this.newPost = this.newPost.bind(this);
  }

  // Async generator which produces posts to display in the feed
  // Will fetch posts in batches of 10, but you can take any number
  // at a time.
  //
  // Tries to prefetch posts for better UX.
  //
  // Will also merge in the current user's posts in-order, so that
  // the current user's posts also show up in the feed.
  async* getFeed() {
    const batchSize = 10;

    let feedCursor = 0;
    let feed;

    let prefetch = api.user.feed({ p: feedCursor, n: batchSize });

    const userPosts = this.currentUser.posts;

    do {
      feed = await prefetch;

      let posts;
      if (feed.posts.length === 0) {
        if (feedCursor === 0) {
          // No posts in feed at all, just yield all the current user's posts
          posts = await userPosts.sort(numDesc).map(api.post.get);
        } else {
          // No posts left to load from the feed, yield the rest of the current user's posts
          const last = this.shadowRoot.querySelector(".post:last-child").id;
          posts = await userPosts.filter(id => id < last).sort(numDesc).map(api.post.get);
        }
      } else {
        // If there are posts in the feed, will merge in the current user's posts in order
        const [high, low] = [feed.posts[0].id, feed.posts[feed.posts.length - 1].id];
        const matching =
          feedCursor === 0
            ? userPosts.filter(id => low < id)
            : userPosts.filter(id => low < id && id < high);
        const insertion = await Promise.all(matching.map(api.post.get));

        posts = feed.posts.concat(insertion).sort(numFnDesc(x => x.id));
      }

      feedCursor += batchSize;
      // Prefetch the next 10 from the feed endpoint
      prefetch = api.user.feed({ p: feedCursor, n: batchSize });
      for (const post of posts) {
        yield post;
      }
      // Stop looping if we have not been given a full batch, as this indicates no more posts
    } while (feed.posts.length === batchSize);
  }

  // Convenience method to take a chunk from the feed async generator
  async getPosts(n) {
    if (!this.postGenerator) {
      this.postGenerator = this.getFeed();
    }
    return await take(n, this.postGenerator);
  }

  async connectedCallback() {
    // Show loading state
    const loading = this.shadowRoot.appendChild(
      create("div", { class: "feed" }, [
        create("aside", { class: "side-bar" }),
        create("section", { class: "feed__loading" }, [
          create("qp-spinner")
        ]),
      ])
    );

    // Load initial posts
    this.currentUser = await api.user.getCurrent();
    const posts = await this.getPosts(10);

    // Show content after it loads
    loading.replaceWith(
      create("div", { class: "feed" }, [
        create("aside", { class: "side-bar" }, [
          create("button", { class: "action", onClick: this.newPost, hero: true, appearance: "subtle" }, [
            create("ion-icon", { name: "add", size: "small" }),
            "New post",
          ]),
        ]),
        create("section", { class: "feed__main" }, [
          create("div", { class: "feed__posts" }, posts.map(this.renderPost))
        ])
      ])
    );

    // Show the page title
    this.closest("qp-app").setTitle("Feed");

    // Event listener for infinite scroll
    window.addEventListener("scroll", this.handleScroll);

    // If after the initial render there is still room to show posts
    // then progressively load some more in
    // until the screen is full
    //
    // We do this because infinite scroll doesn't work if you can't scroll to begin with
    const fillScreen = async () => {
      if (Number.isNaN(getScrollPercentage())) {
        await this.loadMorePosts();
        window.setTimeout(fillScreen, 100);
      }
    }
    fillScreen();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  // Infinite scroll logic
  async handleScroll(event) {
    // Temporarily ignore scroll events while we are processing
    if (this.handleScroll.isProcessing) return;
    this.handleScroll.isProcessing = true;

    const scrollPercentage = getScrollPercentage();
    const shouldLoad = scrollPercentage >= 0.85;

    // Will load more posts if the scroll percentage is greater or equal to 85%
    if (shouldLoad) {
      this.loadMorePosts();
    }

    this.handleScroll.isProcessing = false;
  }

  // Method to 'load' more posts
  //
  // Will take a chunk from the feed generator and show the posts
  async loadMorePosts() {
    const posts = await this.getPosts(5);
    const container = this.shadowRoot.querySelector(".feed__posts");

    posts
      .map(this.renderPost)
      .forEach(post => container.append(post));
  }

  // Convenience method to render a post
  renderPost(post) {
    return (
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
        currentUser: this.currentUser,
      })
    );
  }

  // Show the modal form to create a new post
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
    popup.showModal();

    async function handleSubmit(event) {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const payload = Object.fromEntries(data.entries());

      try {
        const dataUrl = await fileToDataUrl(payload.image);
        payload.src = dataUrl.match(/;base64,(.*)$/)[1];
        delete payload.image;

        const response = await api.post.new(payload);
        window.location.reload();
        popup.close();
      } catch (error) {
        const imgInput = event.currentTarget.querySelector("#image");
        const helpText = create("span", { class: "help-text", appearance: "error" }, [
          create("ion-icon", { name: "alert-circle" }),
          error.message
        ]);
        if (imgInput.nextElementSibling) {
          imgInput.nextElementSibling.replaceWith(helpText);
        } else {
          imgInput.insertAdjacentElement("afterend", helpText);
        }
      }
    };
  }
});
