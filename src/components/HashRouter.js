import { create } from "/src/helpers.js";

export default (hash, defaultRoute, routes, routeParams) => {
  const route = hash.replace(/^#\//, "").split("/");
  const component =
    routes.hasOwnProperty(route[0])
      ? routes[route[0]]
      : routes[defaultRoute];
  return component.apply(undefined, routeParams);
}
