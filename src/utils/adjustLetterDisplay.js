export const adjustLetterDisplay = (letter) => {
  return letter;
};

export const adjustTextDisplay = (text) => {
  return text
    .split("")
    .map((letter) => adjustLetterDisplay(letter))
    .join("");
};
