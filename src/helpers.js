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

// <https://stackoverflow.com/a/31538091>
const isPrimitive = x => x !== Object(x);

const isBool = x =>
  typeof x === "boolean";

export const create = (tagName, { is, style = {}, ...parameters } = {}, children = []) => {
  const el = document.createElement(tagName, { is });
  Object.entries(style).forEach(([key, value]) => {
    if (/^--/.test(key)) {
      el.style.setProperty(key, value)
    } else {
      el.style[key] = value;
    }
  });
  Object.entries(parameters).forEach(([key, value]) => {
    if (/^on[A-Z]/.test(key)) {
      el[key.toLowerCase()] = value;
    } else if (isBool(value)) {
      if (value) {
        el.setAttribute(key, "");
      }
    } else if (isPrimitive(value)) {
      el.setAttribute(key, value);
    } else {
      el[key] = value;
    }
  });
  children
    .filter(Boolean)
    .forEach(child => el.append(child));
  return el;
};

export const css = (fragments, ...interpolations) => {
  const rules =
    fragments.reduce((acc, fragment, i) =>
      i < interpolations.length
        ? acc.concat([fragment, interpolations[i]])
        : acc.concat(fragment)
      , []).join("");

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
  return promise.then(x => { spinner.remove(); return x });
}

// Hashing function used for seeding a random number generator
// <http://www.cse.yorku.ca/~oz/hash.html>
const djb2 = str =>
  str.split("").reduce((hash, char) => hash * 33 ^ char.charCodeAt(0), 5381);

// Seeded random number generator, for reproducible randomness
// <https://stackoverflow.com/a/47593316>
const mulberry32 = a => {
  let t = a += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// Will return a 'random' avatar, using a random generator seeded by the provided username
// Meaning that the same username will always provide the same avatar
export const getAvatar = username => {
  const seed = djb2(username);
  const random = mulberry32(seed);
  const avatar = Math.floor(random * 50) + 1;
  return `/assets/avatars/${avatar}.svg`;
}

export const clear = element => {
  while (element.hasChildNodes()) {
    element.lastChild.remove();
  }
}

export const showDateTime = published => {
  const timestamp = Number(published) * 1000;
  const date = new Date(timestamp);
  return date.toLocaleString("en-AU");
};

export const showDate = published => {
  const timestamp = Number(published) * 1000;
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-AU");
};
