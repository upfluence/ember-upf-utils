import { setApplication } from '@ember/test-helpers';

import config from 'dummy/config/environment';
import { forceModulesToBeLoaded, sendCoverage } from 'ember-cli-code-coverage/test-support';
import { start } from 'ember-qunit';
// @ts-expect-error ember-sinon-qunit does not ship with types
import setupSinon from 'ember-sinon-qunit';
import QUnit from 'qunit';
import { setup } from 'qunit-dom';

// @ts-expect-error ember-sinon-qunit does not ship with types
import Application from '../app';

setup(QUnit.assert);
QUnit.done(async function () {
  forceModulesToBeLoaded();
  await sendCoverage();
});

setApplication(Application.create(config.APP));
setupSinon();

start();

declare module '@ember/test-helpers' {
  interface TestContext {
    [key: string]: any;
  }
}
