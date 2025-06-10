export function searchLetterAlphabet(name: string) {
  const filter = new Set(name.toLowerCase().replace(/[^a-z]/g, ""));
  let value = "-";
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i);
    if (!filter.has(letter)) {
      value = letter;
      break;
    }
  }

  return value;
}
