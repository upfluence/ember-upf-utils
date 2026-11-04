# Ember-upf-utils

Ember Upfluence Utilities. This repository contains a load of shared code which can be found throughout many Upfluence Software services.

[Short description of the addon.]

## Compatibility

- Ember.js v6.12 or above
- Node.js v22 or above

> **Breaking:** support for Ember versions below 6.12 has been dropped. The addon now relies on native types and on the
> `service` import from `@ember/service`.

## Installation

```bash
pnpm add @upfluence/ember-upf-utils
```

Required peer dependencies:

- `ember-source` `^6.12.0`
- `@upfluence/oss-components` `>=3`
- `@upfluence/hyperevents` `>=1`

The host app must also provide `ember-intl`, as the addon's components rely on the `intl` service.

To work on the addon itself:

- `git clone` this repository
- `make install` (runs `pnpm install`)

## Developing

**Styles** are stored in `app/styles`.
**Components** and **Templates** are stored in `addon/components`. _(Pod Structure)_

#### Compiling

_Let's say you are working on **search** _

```bash
# in upfluence/ember-upf-utils
$> ember build
```

In `upfluence/facade-web/package.json` replace :

```json
"ember-upf-utils": "upfluence/ember-upf-utils",
```

by :

```json
"ember-upf-utils": "file:../ember-upf-utils"
```

```bash
# In the service using it
$> npm uninstall ember-upf-utils
$> npm install ember-upf-utils
```

### Linting

- `pnpm lint:hbs`
- `pnpm lint:js`
- `pnpm lint:js --fix`

### Running tests

- `make tests` – Runs the test suite once on the current Ember version
- `make testserver` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `make start` (runs `ember serve --port 0`)
- The port is random: visit the dummy application at the URL printed in the output.
  See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
