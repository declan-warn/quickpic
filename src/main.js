import API from "./api.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

import { create } from "/src/helpers.js";
import NavBar from "./components/NavBar.js";
import LoginForm from "/src/pages/LoginForm.js";

// This url may need to change depending on what port your backend is running
// on.
const api = new API("http://localhost:5000");

document.querySelector("main").append(LoginForm(api));
