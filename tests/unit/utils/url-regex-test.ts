import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { URL_REGEX } from '@upfluence/ember-upf-utils/utils/url-regex';

const VALID_URLS = [
  'toto.com',
  'toot.tooooooooaze',
  'www.totot.com',
  'www.totot.com/',
  'toto-toto.com',
  'www.toto-toto.com',
  'https://toto-toto.com',
  'http://toto-toto.com',
  'http://www.toto-toto.com',
  'https://www.toto.com',
  'sub.domain.com',
  'sub.domain.com/p',
  'sub.domain.com/paze',
  'sub.domain.com/path/azeoaize',
  'https://sub.domain.com',
  'toto-toto.com/az',
  'https://toto.com',
  'aze.te',
  'aze.t',
  'aze.te/',
  'https://aze.te',
  'https://aze.te/',
  'http://domain.com/path/sub/param&toto=true',
  'http://domain.com/path/sub/param&toto=email.john@gmail.com',
  'domain.com/path/sub/param&toto=email.john@gmail.com',
  'https://google.com',
  'www.google.com',
  'www.google.com/path/param=email@toto.com',
  'http://www.google.com/path/param=email@toto.com',
  'https://www.google.com/path/param=email@toto.com',
  'http://google.com/path/param=email@toto.com',
  'https://google.com/path/param=email@toto.com',
  'office365.com',
  'www.office365.com',
  'http://office365.com',
  'https://office365.com'
];
const INVALID_URLS = [
  'https://toto-toto .com',
  'https://toto- toto.com',
  'https:// toto-toto.com',
  'https ://toto-toto.com',
  'aze@aze',
  'aze.aze@comaze.com',
  'aze.toto@aze',
  'https://domain@domain.com/sub/path',
  'www.aze@aez.com',
  'random text goes here to make sure',
  'email@toto.com',
  'john.email@toto.com',
  'office 365.com',
  'www.office 365.com'
];

module('Unit | Utils | url-regex', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.urlRegex = URL_REGEX;
  });

  VALID_URLS.forEach((url) => {
    test(`it should pass for ${url}`, function (assert) {
      assert.ok(this.urlRegex.test(url));
    });
  });

  INVALID_URLS.forEach((url) => {
    test(`it should not pass for ${url}`, function (assert) {
      assert.notOk(this.urlRegex.test(url));
    });
  });
});
