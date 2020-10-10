import { create } from "/src/helpers.js";

const withLoader = promise => {
  const spinner = create("dialog", { textContent: "loading..." });
  document.body.append(spinner);
  spinner.showModal();
  promise.then(() => spinner.remove());
}

const showDateTime = published => {
  const timestamp = Number(published) * 1000;
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export default (api, goto) => {
  const feed = create("div", { id: "feed" });

  const loadPosts = async () => {
    const { posts } = await api.user.feed();
    feed.append(
      create("ol", { className: "post-list" }, posts.map(post =>
        create("li", { className: "post" }, [
          create("img", { src: `data:image/png;base64,${post.src}` }),
          create("span", { textContent: `${post.meta.description_text}` }),
          create("span", { textContent: `${post.meta.author}` }),
          create("span", { textContent: `${showDateTime(post.meta.published)}` }),
          create("span", { textContent: `${post.meta.likes.length} like(s)` }),
          create("span", { textContent: `${post.comments.length} comment(s)` }),
        ])
      ))
    );
  };

  withLoader(loadPosts());

  return feed;
}
