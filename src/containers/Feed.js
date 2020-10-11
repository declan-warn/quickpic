import { create, withLoader } from "/src/helpers.js";

import "/src/components/qp-post.js";

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
      create("div", { class: "post-list" }, posts.map(post =>
        create("qp-post", { class: "post" }, [
          create("img", { slot: "image", src: `data:image/png;base64,${post.src}` }),
          create("h2", { slot: "description" }, [post.meta.description_text]),
          create("span", { slot: "author" }, [post.meta.author]),
          create("time", { slot: "published" }, [showDateTime(post.meta.published)]),
          create("qp-post-likes", { slot: "likes" }, post.meta.likes.map(like =>
            create("qp-post-like", { user: like })
          )),
          create("span", { slot: "comments" }, [`${post.comments.length} comment(s)`]),
        ])
      ))
    );
  };

  withLoader(loadPosts());

  return feed;
}
