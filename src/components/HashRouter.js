import { create } from "/src/helpers.js";

export default (hash, routes) => {
  const route = hash.replace(/^#\//, "");
  return routes.hasOwnProperty(route)
    ? routes[route]()
    : "";
}
