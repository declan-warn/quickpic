/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector("input[type="file"]").files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
  const validFileTypes = ["image/jpeg", "image/png", "image/jpg"]
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let"s walk away.
  if (!valid) {
    throw Error("provided file is not a png, jpg or jpeg image.");
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export const create = (tagName, { is, style = {}, ...parameters } = {}, children = []) => {
  const el = document.createElement(tagName, { is });
  Object.entries(style).forEach(([key, value]) => el.style[key] = value);
  Object.entries(parameters).forEach(([key, value]) => {
    if (/^on[A-Z]/.test(key)) {
      el[key.toLowerCase()] = value;
    } else {
      el.setAttribute(key, value);
    }
  });
  children
    .filter(Boolean)
    .forEach(child => el.append(child));
  return el;
};

export const css = rules => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(rules);
  return sheet;
}

export const linkToCSS = href =>
  create("link", { href, rel: "stylesheet" });

export const withLoader = promise => {
  const spinner = create("dialog", { textContent: "loading..." });
  document.body.append(spinner);
  spinner.showModal();
  return promise.then(() => spinner.remove());
}
