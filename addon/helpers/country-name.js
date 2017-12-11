import Ember from 'ember';
import CountryCodes from 'ember-upf-utils/resources/country-codes';

const {
  Helper
} = Ember;

export function countryName(countryCode) {
  return CountryCodes.find((item) => item.id === countryCode[0]).name;
}

export default Helper.helper(countryName);
