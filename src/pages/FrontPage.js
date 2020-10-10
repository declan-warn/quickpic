import { create } from "/src/helpers.js";

import NavBar from "/src/containers/NavBar.js";

export default (api, goto) => {
  return (
    NavBar(api, goto)
  );
};
