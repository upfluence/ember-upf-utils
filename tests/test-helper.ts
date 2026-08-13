import { setApplication } from '@ember/test-helpers';

import { forceModulesToBeLoaded, sendCoverage } from 'ember-cli-code-coverage/test-support';
import { start } from 'ember-qunit';
// @ts-expect-error ember-sinon-qunit does not ship with types
import setupSinon from 'ember-sinon-qunit';
import QUnit from 'qunit';
import { setup } from 'qunit-dom';

// @ts-expect-error ember-sinon-qunit does not ship with types
import Application from '../app';
import config from '../config/environment';

setup(QUnit.assert);
QUnit.done(async function () {
  forceModulesToBeLoaded();
  await sendCoverage();
});

// @ts-expect-error the dummy app's entrypoint is not typed
setApplication(Application.create(config.APP));
setupSinon();

start();

declare module '@ember/test-helpers' {
  interface TestContext {
    [key: string]: any;
  }
}
