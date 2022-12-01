/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if ((Array.isArray(arr) && !arr.length) || !arguments.length) {
    return [];
  }
  return [...arr].filter((element, index, array) => array.indexOf(element) === index);
}
