import { create } from "/src/helpers.js";

const withLoader = promise => {
  const spinner = create("dialog", { textContent: "loading..." });
  document.body.append(spinner);
  spinner.showModal();
  promise.then(() => spinner.remove());
}

export default (api, goto) => {
  const loadPosts = async () => {
    const { posts } = await api.user.feed();
    document.getElementById("feed").append(
      create("ul", undefined, posts.map(post =>
        create("li", { textContent: post.meta.description_text })
      ))
    );
  };

  withLoader(loadPosts());

  return (
    create("div", { id: "feed" })
  );
}
