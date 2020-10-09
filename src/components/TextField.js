import { create } from "/src/helpers.js";

export default (name, { label, required }) =>
  create("label", { for: name, textContent: label }, [
    create("input", { id: name, name, required })
  ]);
