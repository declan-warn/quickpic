import { create } from "/src/helpers.js";

export default (hash, routes, routeParams) => {
  const route = hash.replace(/^#\//, "");
  return routes.hasOwnProperty(route)
    ? routes[route].apply(undefined, routeParams)
    : "";
}
