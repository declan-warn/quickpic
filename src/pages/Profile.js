import { create } from "/src/helpers.js";

import NavBar from "/src/containers/NavBar.js";

export default (api, goto) => {
  const loadProfileData = async () => {
    const data = await api.user.getCurrent();
    console.log("PROFILE DATA:", data);
  }

  loadProfileData();

  return (
    create("div", undefined, [
      NavBar(api, goto),
      create("span", { id: "name" })
    ])
  );
};
