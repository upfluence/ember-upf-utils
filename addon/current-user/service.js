import { notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default Service.extend({
  ajax: service(),
  session: service(),
  _cachedUrl: null,
  _cachedUser: null,
  _fetchPromise: null,

  logged: notEmpty('session.data.authenticated.access_token'),

  init() {
    this._super();

    run.next(() => {
      this.fetch().then((payload) => {
        let user = payload.user;

        if (!isNone(window.Raven)){
          window.Raven.setUserContext({
            email: user.email,
            id: user.id
          });
        }

        if (!isNone(window.Intercom)){
          window.Intercom('update', {
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            user_id: user.id
          });
        }

        if (!isNone(window.analytics)) {
          window.analytics.identify(user.id, {
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            scopes: user.granted_scopes,
            extra: user.extra,
          });
        }
      });
    });
  },

  meURL: computed('session.data.authenticated.access_token', function() {
    const url = Configuration.meURL;
    const token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return `${url}?access_token=${token}`;
  }),

  fetch(force = false) {
    let timeout = 3000; // 3 seconds
    let start = new Date().getTime();

    if (force) {
      this.clear();
    }

    if (this._fetchPromise)  {
      return this._fetchPromise;
    }

    return this._fetchPromise = new RSVP.Promise((resolve) => {
      let fn = () => {
        if (new Date().getTime() - start > timeout) {
          throw new Error('Unable to load user');
        }

        if (this.get('logged')) {
          resolve(this._fetch());
        } else {
          // just in case of delais to load authenticated data
          run.next(this, fn);
        }
      };

      fn();
    });
  },

  clear() {
    this.set('_fetchPromise', null);
    this.set('_cachedUser', null);
    this.set('_cachedUrl', null);
  },

  fetchColleagues() {
    const url = Configuration.identityURL;
    const token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return this.fetch().then((payload) => {
      const companyId = payload.user.company_id;
      return this.ajax.request(`${url}api/v1/users?company_id=${companyId}&access_token=${token}`, {
        type: 'GET'
      });
    });
  },

  createCompositeGroup(members) {
    const ids = members.mapBy('id');

    const url = Configuration.identityURL;
    const token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return this.ajax.post(`${url}api/v1/composites?access_token=${token}`, {
      data: JSON.stringify({
        composite: { members: ids }
      })
    });
  },

  fetchOwnerships() {
    return this.fetch().then((payload) => {
      let ownerships = [];

      payload.companies.forEach((company) => {
        ownerships.push(
          { id: `company:${company.id}`, name: company.name }
        );
      });

      payload.teams.forEach((team) => {
        ownerships.push(
          { id: `team:${team.id}`, name: team.name }
        );
      });

      (payload.composites || []).forEach((composite) => {
        ownerships.push(
          { id: `composite:${composite.id}`, name: composite.name }
        );
      });

      ownerships.push(
        { id: `user:${payload.user.id}`, name: payload.user.first_name }
      );

      return ownerships;
    });
  },

  _fetch() {
    if (this._cachedUrl === this.get('meURL')) {
      // return the current promise
      return this._cachedUser;
    }

    this._cachedUrl = this.get('meURL');

    return this._cachedUser = this.get('ajax').request(this.get('meURL'));
  }
});
