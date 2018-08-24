import Ember from 'ember';

const { Helper } = Ember;

export function nameInitials(params) {
  let [name] =  params;
  let text = name.trim().toLowerCase();
  return text.replace(/\s[^a-z]/gi, '').split(' ').reduce((acc, word) => {
    let trademarkSign = acc.length > 0 && acc[acc.length - 1].startsWith('t')
      && word.startsWith('m');

    if (!trademarkSign) {
      acc.push(word[0]);
    }

    return acc;
  }, []).slice(0, 3).join('');
}

export default Helper.helper(nameInitials);
