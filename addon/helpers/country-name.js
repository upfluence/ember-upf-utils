import Helper from '@ember/component/helper';
import CountryCodes from '@upfluence/ember-upf-utils/resources/country-codes';

export function countryName(countryCode) {
  let country = CountryCodes.find((item) => item.id === countryCode[0]);

  if (country) {
    return country.name;
  }

  return '—';
}

export default Helper.helper(countryName);
