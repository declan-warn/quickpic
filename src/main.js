import API from "./api.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

import { create } from "/src/helpers.js";
import NavBar from "./components/NavBar.js";
import LoginForm from "/src/pages/LoginForm.js";
import HashRouter from "/src/components/HashRouter.js";
import SignupForm from "/src/pages/SignupForm.js";
import Feed from "/src/pages/Feed.js";

// This url may need to change depending on what port your backend is running
// on.
const api = new API("http://localhost:5000");

const main = document.querySelector("main");

const goto = route => {
  window.location.hash = `#/${route}`;
}

const render = () => {
  while (main.hasChildNodes()) {
    main.lastChild.remove();
  }
  main.append(
    HashRouter(window.location.hash, {
      login: LoginForm,
      signup: SignupForm,
      feed: Feed,
    }, [api, goto])
  );
};

render();

window.addEventListener("hashchange", render);
