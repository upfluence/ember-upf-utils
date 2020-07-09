## Identity Management : Migrate from @upfluence/ember-upf-utils to @upfluence/ember-identity

In order to split the `ember-upf-utils` package into smaller, more
feature-centric packages, we started by moving all of the
authentication and identity related code to `@upfluence/ember-identity`.

The direct effects of those changes are that we obviously introduced
some breaking changes (resulting in the bump of a major version).

### CHANGELOG

As far as the addon Configuration goes:

* The configuration keys: `storeDomain`, `loginUrl`, `logoutRedirectUrl`,
  `oauthUrl` and `oauthClientId` have been moved to the new package but
  their names and the environment variables they depend on have been kept unchanged.
  You can then basically move them to the `ember-identity` package's
  configuration in your app's `config/environment.js`
  (under `@upfluence/ember-identity`).
* The `current-user` and `feature-flags-manager` services have been
  moved to `@upfluence/ember-identity` but being injected into your
  Routes/Controller/Components, that should not affect you unless you're
  extending them. In that case, you'll have to update their import path
  to the new package.
* The **Ember Simple Auth** session store has been moved to the new
  package so you will have to update its import path in your app (under
  `app/session-store/application.js` or `app/application/session-store.js`
  depending on your app layout style).
* The whole `mixins/auth` file has been moved to the new package,
  meaning that everything related to Authentication mixins will need to
  be updated (authenticated routes, login routes, etc.)
