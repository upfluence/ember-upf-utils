<div align="center">
  <img src=".github/assets/logo.svg" width="96" height="96" alt="">
  <h1>@upfluence/ember-upf-utils</h1>
  <p>Ember Upfluence Utilities: shared code used throughout many Upfluence Software services.</p>

[![ci](https://github.com/upfluence/ember-upf-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/upfluence/ember-upf-utils/actions/workflows/ci.yml)
[![Coverage](https://sonarqube.upfluence.co/api/project_badges/measure?project=ember-upf-utils&metric=coverage&token=sqb_9073a24cf63e9c2d77d8b25012c622bde8ac98ed)](https://sonarqube.upfluence.co/dashboard?id=ember-upf-utils)
[![Maintainability Rating](https://sonarqube.upfluence.co/api/project_badges/measure?project=ember-upf-utils&metric=sqale_rating&token=sqb_9073a24cf63e9c2d77d8b25012c622bde8ac98ed)](https://sonarqube.upfluence.co/dashboard?id=ember-upf-utils)
[![Quality Gate Status](https://sonarqube.upfluence.co/api/project_badges/measure?project=ember-upf-utils&metric=alert_status&token=sqb_9073a24cf63e9c2d77d8b25012c622bde8ac98ed)](https://sonarqube.upfluence.co/dashboard?id=ember-upf-utils)
[![Code Smells](https://sonarqube.upfluence.co/api/project_badges/measure?project=ember-upf-utils&metric=code_smells&token=sqb_9073a24cf63e9c2d77d8b25012c622bde8ac98ed)](https://sonarqube.upfluence.co/dashboard?id=ember-upf-utils)

[Compatibility](#compatibility) •
[Installation](#installation) •
[Developing](#developing) •
[License](#license)

</div>

## Compatibility

- Ember.js v6.12 or above
- Node.js v24 or above
- pnpm 10

Apps on Ember.js below 6.12 should stay on `5.x`.

> **Breaking:** support for Ember versions below 6.12 has been dropped. The addon now relies on native types and on the
> `service` import from `@ember/service`.

## Installation

```bash
pnpm add @upfluence/ember-upf-utils
```

Required peer dependencies:

- `ember-source` `^6.12.0`
- `@upfluence/oss-components` `4.x`
- `@upfluence/hyperevents` `2.x`

The host app must also provide `ember-intl`, as the addon's components rely on the `intl` service.

To work on the addon itself:

- `git clone` this repository
- `make install` (runs `pnpm install`)

## Developing

**Styles** are stored in `app/styles`.
**Components** and **Templates** are stored in `addon/components`.

### Linting

- `pnpm lint:hbs`
- `pnpm lint:js`
- `pnpm lint:js --fix`

### Running tests

- `make tests` – Runs the test suite once on the current Ember version
- `make testserver` – Runs the test suite in "watch mode"
- `pnpm test:ember-compatibility` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `make start` (runs `ember serve --port 0`)
- The port is random: visit the dummy application at the URL printed in the output.

## License

This project is licensed under the MIT License.
