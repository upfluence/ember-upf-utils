# Ember-upf-utils

Ember Upfluence Utilities. This repository contains a load of shared code which can be found throughout many Upfluence Software services.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

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

## Components
### Header

Generates a header. The header can be customized by using the `application-header/right`, `application-header/left` and `application-header/center` components.

**Exemple**
```xml
{{#layout/application-header}}
	{{#layout/application-header/right}}
		<div>Some content</div>
	{{/layout/application-header/right}}
{{/layout/application-header}}
```