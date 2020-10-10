import { create } from "/src/helpers.js";

export default (hash, defaultRoute, routes, routeParams) => {
  const route = hash.replace(/^#\//, "");
  const component =
    routes.hasOwnProperty(route)
      ? routes[route]
      : routes[defaultRoute];
  return component.apply(undefined, routeParams);
}
