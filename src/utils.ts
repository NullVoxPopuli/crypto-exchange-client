export function lPad(value: string | Decimal | number, width = 10) {
  const str = (value.toString && value.toString()) || `${value}`;
  const length = str.length;
  const remaining = width - length;

  let spaces = '';

  for (let i = 0; i < remaining; i++) {
    spaces += ' ';
  }

  return spaces + str;
}
