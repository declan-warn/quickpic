// import { useEndpoint } from "./api.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

import { create } from "/src/helpers.js";
import LoginForm from "/src/pages/LoginForm.js";
import HashRouter from "/src/components/HashRouter.js";
import SignupForm from "/src/pages/SignupForm.js";
import FrontPage from "/src/pages/FrontPage.js";
import Profile from "./pages/Profile.js";

// This url may need to change depending on what port your backend is running
// on.
// const api = new API("http://localhost:5000");
// const api = useEndpoint("http://localhost:5000");
// window.api = api;

import api from "/src/api.js";


const main = document.querySelector("main");

const goto = route => {
  window.location.hash = `#/${route}`;
}

const render = () => {
  while (main.hasChildNodes()) {
    main.lastChild.remove();
  }
  main.append(
    HashRouter(window.location.hash, "feed", {
      login: LoginForm,
      signup: SignupForm,
      feed: FrontPage,
      user: Profile,
    }, [api, goto])
  );
};

render();

window.addEventListener("hashchange", render);
