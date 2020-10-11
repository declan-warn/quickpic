import { create } from "/src/helpers.js";

export default (name, { label, required }) =>
  create("label", { for: name }, [
    label,
    create("input", { id: name, name, required })
  ]);
