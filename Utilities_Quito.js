//jshint esversion:6

exports.getDate = function () {
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
};

exports.getDay = function () {
  const today = new Date();

  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
};

exports.firstLetterUp = function (word) {
  return word.length !== 0
    ? word.substring(0, 1).toUpperCase() +
        word.substring(1, word.length).toLowerCase()
    : "";
};
