export const regexEmail =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
// eslint-disable-next-line no-useless-escape
export const regexSpecialCharacters = /[!@#$%^&*(),.?":{}/|<>~`_\-=+\[\]\\;']/;
export const regexUpperCase = /[A-Z]/;
export const regexLowerCase = /[a-z]/;
export const regexNumber = /[\d]/;
export const regexSpace = /\s/;
export const numberRegex = /^[0-9]*(\.[0-9])?$/;

export const onlyNumbersAndLettersRegex = /^[a-zA-Z0-9]*$/;

export const lettersAndSpecialCharactersRegex = /^[^0-9\\s]*([\\s][^0-9\\s]*)*$/;

export const accountHolderRegex = /^[a-zA-Z0-9\s.-]+$/;

export const regexSpecialAndCharacters = /^[a-zA-Z\s\-_!@#$%^&*(),.?":{}[`~|<>\\;=+"\]/'\]]+$/;

export const regexSpecials = /^[s\-_!@#$%^&*(),.?":{}[`~|<>\\;=+"\]/'\]]+$/;
