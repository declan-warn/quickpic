import { create } from "/src/helpers.js";

import NavBar from "/src/containers/NavBar.js";
import Feed from "/src/containers/Feed.js";

export default (api, goto) => {
  return (
    create("div", undefined, [
      NavBar(api, goto),
      Feed(api, goto),
    ])
  );
};
