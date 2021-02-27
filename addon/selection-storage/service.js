/* globals window */
import { set } from '@ember/object';
import { alias } from '@ember/object/computed';

import Service from '@ember/service';
import { observer, computed } from '@ember/object';
import { run } from '@ember/runloop';

const STORE_KEY = '__upf-selected';
const DATA_LIFETIME = 24 * 60 * 60; // 1 day

export default Service.extend({
  storageScope: null,

  init() {
    this._super();
    this._store = window.localStorage;
    set(this, '_cache', {});
    set(this, '_length', 0);
    this._loaded = false;
    this.load();
  },

  _: observer('storageScope', function() {
    this._loaded = false;
    this.load();
  }),

  setContext(scope) {
    this.set('storageScope', scope);
  },

  length: alias('_length'),

  all: computed('_cache', '_length', function() {
    return Object.keys(this._cache);
  }),

  hasCache() {
    return this._store.getItem(STORE_KEY) !== null;
  },

  load() {
    if (this._loaded) {
      return;
    }

    this._loaded = true;
    let data = this._load();

    // Invalid data
    let currentScopeIds = data.ids.filter((id) => {
      return id.split(':')[0] === this.storageScope;
    });
    if (this._is_expired(data.date) && currentScopeIds.length > 0) {
      this.clear();

      return;
    }

    currentScopeIds.forEach((v) => this._cache[v] = true);
    set(this, '_length', currentScopeIds.length);
  },

  has(id) {
    return this._cache[`${this.storageScope}:${id}`] || false;
  },

  add(id) {
    this._cache[`${this.storageScope}:${id}`] = true;

    run.debounce(this, this._persist, 300);
  },

  remove(id) {
    delete this._cache[`${this.storageScope}:${id}`];

    run.debounce(this, this._persist, 300);
  },

  clear() {
    Object.keys(this._cache).forEach((key) => {
      let [scope] = key.split(':');
      if (scope === this.storageScope) {
        delete this._cache[key];
      }
    });

    this._persist();
  },

  _load() {
    let defaultValue = { date: null, ids: [] };

    return JSON.parse(this._store.getItem(STORE_KEY)) || defaultValue;
  },

  _persist() {
    let ids = Object.keys(this._cache);
    let data = {
      date: Date.now(),
      ids
    };

    this._store.setItem(STORE_KEY, JSON.stringify(data));
    let currentScopeIds = data.ids.filter((id) => {
      return id.split(':')[0] === this.storageScope;
    });
    this.set('_length', currentScopeIds.length);
  },

  _is_expired(date) {
    if (!date) {
      return true;
    }

    return date < (Date.now() - DATA_LIFETIME * 1000);
  }
});
