//jshint esversion:6

// package.json SIN indicar type:"module"

// exports.getDate = function () {
//   const today = new Date();

//   const options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//   };

//   return today.toLocaleDateString("en-US", options);
// };

// exports.getDay = function () {
//   const today = new Date();

//   const options = {
//     weekday: "long",
//   };

//   return today.toLocaleDateString("en-US", options);
// };

// exports.firstLetterUp = function (word) {
//   return word.length !== 0
//     ? word.substring(0, 1).toUpperCase() +
//         word.substring(1, word.length).toLowerCase()
//     : "";
// };


// In package.json indicar type:"module", entonses se utiliza la siguiente estructura de exportacion, o export default y se lee con:
// import xxx, { xxx } from "docname" 

export function getDate () {
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
};

export function getDay() {
  const today = new Date();

  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
};

export function firstLetterUp (word) {
  return word.length !== 0
    ? word.substring(0, 1).toUpperCase() +
        word.substring(1, word.length).toLowerCase()
    : "";
};
