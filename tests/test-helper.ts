// @ts-nocheck
import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import setupSinon from 'ember-sinon-qunit';
import QUnit from 'qunit';
import { setup } from 'qunit-dom';

setup(QUnit.assert);
setApplication(Application.create(config.APP));
setupSinon();

start();

declare module '@ember/test-helpers' {
  interface TestContext {
    [key: string]: any;
  }
}
