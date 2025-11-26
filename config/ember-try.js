'use strict';

module.exports = async function () {
  return {
    packageManager: 'pnpm',
    command: 'pnpm test:ember',
    scenarios: [
      {
        name: 'ember-lts-3.28'
      },
      {
        name: 'ember-4.12',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': false // Disable per https://deprecations.emberjs.com/id/optional-feature-jquery-integration
          })
        },
        npm: {
          dependencies: {
            '@ember/jquery': '^2.0.0',
            'ember-inflector': '^4.0.2'
          },
          devDependencies: {
            'ember-source': '~4.12.3',
            'ember-cli': '~4.12.3',
            'ember-data': '~4.12.8'
          }
        }
      }
    ]
  };
};
