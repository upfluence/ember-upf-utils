import { get } from '@ember/object';
import { typeOf } from '@ember/utils';

const DEFAULTS: Record<string, unknown> = {
  uploaderUrl: 'http://localhost:8080/upload',
  exportUrl: 'http://localhost:9001/export',
  meURL: 'http://localhost:9000/me',
  settingsURL: 'http://localhost:9000/settings',
  scope: ['facade_web']
};

type Defaults = typeof DEFAULTS;

interface Configuration extends Defaults {
  __initialized__: boolean;
  load(config: unknown): void;
  [key: string]: unknown;
}

const configuration: Configuration = {
  uploaderUrl: DEFAULTS.uploaderUrl,
  exportUrl: DEFAULTS.exportUrl,
  settingsURL: DEFAULTS.settingsURL,
  meURL: DEFAULTS.meURL,
  scope: DEFAULTS.scope,

  __initialized__: false,

  load(config: unknown) {
    for (const property in this) {
      if (!Object.prototype.hasOwnProperty.call(this, property) || typeOf(this[property]) === 'function') continue;

      this[property] = get(config, property) ?? DEFAULTS[property];
    }

    this.__initialized__ = true;
  }
};

export default configuration;
