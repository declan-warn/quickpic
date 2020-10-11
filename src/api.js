/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
const getJSON = (path, options) =>
  fetch(path, options)
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

/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
// export default class API {
//   /** @param {String} url */
//   constructor(url) {
//     this.url = url;
//   }

//   /** @param {String} path */
//   makeAPIRequest(path) {
//     return getJSON(`${this.url}/${path}`);
//   }

//   login(payload) {
//     return postJSON(`${this.url}/auth/login`, payload);
//   }

//   signup(payload) {
//     return postJSON(`${this.url}/auth/signup`, payload);
//   }
// }

const useEndpoint = url => {
  const auth = {};
  auth.login = payload =>
    postJSON(`${url}/auth/login`, payload);
  auth.signup = payload =>
    postJSON(`${url}/auth/isgnup`, payload);

  const user = {};
  user.getByUsername = username =>
    getJSON(`${url}/dummy/user?username=${username}`);
  user.getById = id =>
    getJSON(`${url}/dummy/user?id=${id}`);
  user.getCurrent = () =>
    getJSON(`${url}/dummy/user`);
  user.feed = () =>
    getJSON(`${url}/dummy/user/feed`);

  const post = {};
  post.comment = (postId, comment) =>
    putJSON(`${url}/dummy/post/comment?id=${postId}`, { comment });

  return { auth, user, post };
};

export default useEndpoint("http://localhost:5000");
