// import { useEndpoint } from "./api.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

import { create } from "/src/helpers.js";
import "/src/pages/qp-profile.js";
import "/src/containers/qp-nav.js";
import "/src/components/qp-router.js";
import "/src/pages/qp-login.js";
import "/src/pages/qp-signup.js";
import "/src/pages/qp-feed.js";
import "/src/containers/qp-app.js";

import api from "/src/api.js";

const main = document.querySelector("main").append(
  create("qp-router", {}, [
    create("qp-route", { path: "/auth" }, [
      create("qp-route", { path: "/login", component: "qp-login" }),
      create("qp-route", { path: "/signup", component: "qp-signup" }),
    ]),
    create("qp-route", { path: "/", component: "qp-app" }, [
      create("qp-route", { path: "user", component: "qp-profile" }),
      create("qp-route", { path: "feed", component: "qp-feed" }),
    ])
  ])
);
