import Helper from '@ember/component/helper';

export function nameInitials(params) {
  let [name] = params;
  let text = name.trim().toLowerCase();
  return text
    .replace(/\s[^a-z]/gi, '')
    .split(' ')
    .reduce((acc, word) => {
      acc.push(word[0]);
      return acc;
    }, [])
    .slice(0, 2)
    .join(String.fromCharCode(0x200a).toString());
}

export default Helper.helper(nameInitials);
