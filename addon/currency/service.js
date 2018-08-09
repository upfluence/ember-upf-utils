import Ember from 'ember';

const { Service, inject } = Ember;

const defaultData = {
  currency: 'USD',
  rate: 1
};

export default Service.extend({
  currentUser: inject.service(),

  fetch() {
    return this.get('currentUser').fetch().then(
      ({ user }) => {
        return {
          currency: user.currency || defaultData.currency,
          rate: user.currency_rate || defaultData.rate
        }
      },
      () => defaultData
    );
  }
});
