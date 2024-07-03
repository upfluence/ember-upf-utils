# Ember-upf-utils

Ember Upfluence Utilities. This repository contains a load of shared code which can be found throughout many Upfluence Software services.

[Short description of the addon.]


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.24 or above
* Ember CLI v3.24 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

* `git clone` this repository
* `npm install`

## Developing

**Styles** are stored in `app/styles`.
**Components** and **Templates** are stored in `addon/components`. *(Pod Structure)*

#### Compiling
*Let's say you are working on **search** *

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

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).
See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
