/* globals window */
import Ember from 'ember';

const STORE_KEY = '__upf-selected';
const DATA_LIFETIME = 24 * 60 * 60; // 1 day

export default Ember.Service.extend({
  init() {
    this._store = window.localStorage;
    this._cache = {};
    this._length = 0;
    this._loaded = false;
    this.load();
  },

  length: Ember.computed.alias('_length'),

  all: Ember.computed('_length', function() {
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
    if (this._is_expired(data.date) && data.ids.length > 0) {
      this.clear();

      return;
    }

    data.ids.forEach((v) => this._cache[v] = true);
    this._length = data.ids.length;
  },

  has(id) {
    return this._cache[id] || false;
  },

  add(id) {
    this._cache[id] = true;

    Ember.run.debounce(this, this._persist, 300);
  },

  remove(id) {
    delete this._cache[id];

    Ember.run.debounce(this, this._persist, 300);
  },

  clear() {
    this._cache = {};
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
    this.set('_length', data.length);
  },

  _is_expired(date) {
    if (!date) {
      return true;
    }

    return date < (Date.now() - DATA_LIFETIME * 1000);
  }
});
