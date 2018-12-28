import Service, { inject as service } from '@ember/service';

const defaultData = {
  currency: 'USD',
  rate: 1
};

export default Service.extend({
  currentUser: service(),

  fetch() {
    return this.get('currentUser').fetch().then(
      ({ user }) => {
        return {
          currency: user.currency || defaultData.currency,
          rate: user.currency_rate || defaultData.rate
        };
      },
      () => defaultData
    );
  }
});
