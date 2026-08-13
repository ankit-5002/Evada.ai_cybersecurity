export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

const weakPasswordParts = ["password", "qwerty", "admin", "welcome", "letmein", "evada", "company"];

function isNotSimpleOrWeak(password: string) {
  const normalized = password.toLowerCase();
  if (password.length < 8) return false;
  if (/^(.)\1+$/.test(password)) return false;
  if (/123456|654321|abcdef|fedcba/.test(normalized)) return false;
  return !weakPasswordParts.some((part) => normalized.includes(part));
}

export const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "8+ characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "upper",
    label: "Uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lower",
    label: "Lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "Special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
  {
    id: "not-weak",
    label: "Not simple or weak",
    test: isNotSimpleOrWeak,
  },
];

const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const lower = "abcdefghijkmnopqrstuvwxyz";
const numbers = "23456789";
const special = "!@#$%^&*?";
const all = `${upper}${lower}${numbers}${special}`;

function randomIndex(max: number) {
  const cryptoObject = globalThis.crypto;
  if (cryptoObject?.getRandomValues) {
    const values = new Uint32Array(1);
    cryptoObject.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function pick(characters: string) {
  return characters[randomIndex(characters.length)];
}

function shuffle(characters: string[]) {
  return characters
    .map((character) => ({ character, sort: randomIndex(100000) }))
    .sort((left, right) => left.sort - right.sort)
    .map((item) => item.character)
    .join("");
}

export function generateStrongPassword() {
  const requiredCharacters = [pick(upper), pick(lower), pick(numbers), pick(special)];
  const remainingCharacters = Array.from({ length: 8 }, () => pick(all));
  return shuffle([...requiredCharacters, ...remainingCharacters]);
}

export function isStrongPassword(password: string) {
  return passwordRules.every((rule) => rule.test(password));
}
