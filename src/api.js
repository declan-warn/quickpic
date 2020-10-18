/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
const getJSON = (path, options) =>
  fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${sessionStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .catch(err => console.warn(`API_ERROR: ${err.message}`));

const postJSON = (path, payload) =>
  getJSON(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

const putJSON = (path, payload) =>
  getJSON(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

const del = (path) =>
  getJSON(path, { method: "DELETE" });

const useEndpoint = url => {
  const auth = {};
  auth.login = payload =>
    postJSON(`${url}/auth/login`, payload);
  auth.signup = payload =>
    postJSON(`${url}/auth/signup`, payload);

  const user = {};
  user.getByUsername = username =>
    getJSON(`${url}/user?username=${username}`);
  user.getById = id =>
    getJSON(`${url}/user?id=${id}`);
  user.getCurrent = () =>
    getJSON(`${url}/user`);
  user.update = payload =>
    putJSON(`${url}/user`, payload);
  user.feed = () =>
    getJSON(`${url}/user/feed`);
  user.follow = username =>
    putJSON(`${url}/user/follow?username=${username}`);
  user.unfollow = username =>
    putJSON(`${url}/user/unfollow?username=${username}`);

  const post = {};
  post.comment = (postId, comment) =>
    putJSON(`${url}/post/comment?id=${postId}`, { comment });
  post.like = postId =>
    putJSON(`${url}/post/like?id=${postId}`);
  post.unlike = postId =>
    putJSON(`${url}/post/unlike?id=${postId}`);
  post.get = postId =>
    getJSON(`${url}/post?id=${postId}`);
  post.new = payload =>
    postJSON(`${url}/post`, payload);
  post.edit = (postId, payload) =>
    putJSON(`${url}/post?id=${postId}`, payload);
  post.delete = postId =>
    del(`${url}/post?id=${postId}`);

  return { auth, user, post };
};

export default useEndpoint("http://localhost:5000");
