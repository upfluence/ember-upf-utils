import Ember from 'ember';
import CountryCodes from 'ember-upf-utils/resources/country-codes';

const {
  Helper
} = Ember;

export function countryName(countryCode) {
  let country = CountryCodes.find((item) => item.id === countryCode[0]);

  if (country) {
    return country.name;
  }

  return '—';
}

export default Helper.helper(countryName);
