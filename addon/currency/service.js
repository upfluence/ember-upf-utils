import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const { Service, inject } = Ember;

const defaultCurrency = {
  iso_code: 'USD',
  symbol: '$',
  exchange_rate: 1.0,
};

export default Service.extend({
  currentUser: inject.service(),
  ajax: inject.service(),

  _cache: {},

  fetch() {
    return this.get('currentUser').fetch().then(
      ({ user }) => this._fetch(user.currency),
      () => defaultCurrency
    );
  },

  _fetch(currency = 'USD') {
    if (this._cache[currency]) {
      return this._cache[currency];
    }

    return this._cache[currency] = this.get('ajax').request(
      `${Configuration.currencyURL}/${currency.toLowerCase()}/exchange`
    ).then(
      (payload) => payload,
      () => defaultCurrency
    );
  }
});
