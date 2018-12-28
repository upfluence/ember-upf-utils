import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';


const UnifiedAuthenticatedRouteMixin = Mixin.create({
  session: service(),

  beforeModel(transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      window.location.replace(Configuration.formattedLoginUrl());
    } else {
      return this._super(...arguments);
    }
  }
});

const UnifiedApplicationRouteMixin = Mixin.create(ApplicationRouteMixin, {
  session: service(),

  sessionInvalidated() {
    if (!Ember.testing) {
      window.location.replace(Configuration.logoutRedirectUrl);
    }
  }
});

export { ApplicationRouteMixin };
export { AuthenticatedRouteMixin };
export { UnauthenticatedRouteMixin };
export { DataAdapterMixin };
export { UnifiedAuthenticatedRouteMixin };
export { UnifiedApplicationRouteMixin };
