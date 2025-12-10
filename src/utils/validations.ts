import {
  regexEmail,
  regexLowerCase,
  regexNumber,
  regexSpace,
  regexSpecialCharacters,
  regexUpperCase,
} from '@/constant';

export const validatePassword = (val: string) => {
  const hasUpperCase = regexUpperCase.test(val);
  const hasLowerCase = regexLowerCase.test(val);
  const hasNumber = regexNumber.test(val);
  const hasSpecialChar = regexSpecialCharacters.test(val);
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

export const spaceValidation = (val: string) => {
  const hasNoSpace = regexSpace.test(val);
  return hasNoSpace;
};

export const validateEmail = (val: string) => {
  return regexEmail.test(val);
};

export const convertToStringNumber = (str: string) => {
  return str.replace(/\D/g, '');
};

export const onlyLettersAndSpecialCharactersRegex = (str: string) => {
  return str.replace(/[^a-zA-Z\s\-_]+/g, '');
};

export const numbersAndLettersRegex = (str: string) => {
  return str.replace(/[^0-9a-zA-Z]+/g, '');
};

export const accountHolderValidation = (str: string) => {
  // Accept letters, numbers, spaces, hyphens, and dots
  // Exclude special characters: ! # $ % ^ & * ( ) _ + = { } : ; " ' < > , ? / \ | ~ ` @
  return str.replace(/[^a-zA-Z0-9\s.-]+/g, '');
};
