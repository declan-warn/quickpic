import { create } from "/src/helpers.js";

export default (api, goto) => {
  const onSubmit = async (event) => {
    event.preventDefault();
    const query = document.getElementById("search").value;
    goto(`search/?username=${query}`);
  };

  return (
    create("nav", { className: "nav-bar" }, [
      create("form", { onSubmit }, [
        create("input", { id: "search" })
      ])
    ])
  );
};
