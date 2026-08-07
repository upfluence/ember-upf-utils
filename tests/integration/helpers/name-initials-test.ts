import { render } from '@ember/test-helpers';

import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { nameInitials } from '@upfluence/ember-upf-utils/helpers/name-initials';

const HAIR_SPACE = '\u200A';

module('Integration | Helper | name-initials', (hooks) => {
  setupRenderingTest(hooks);

  module('Basic formatting', () => {
    test('It joins the initials of the first and last name with a hair space', async function (assert) {
      this.fullName = 'John Doe';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText(`j${HAIR_SPACE}d`);
    });

    test('It lowercases the initials', async function (assert) {
      this.fullName = 'JOHN DOE';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText(`j${HAIR_SPACE}d`);
    });

    test('It returns a single initial for a single word name', async function (assert) {
      this.fullName = 'John';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText('j');
    });

    test('It keeps only the first two initials', async function (assert) {
      this.fullName = 'Jean Claude Van Damme';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText(`j${HAIR_SPACE}c`);
    });

    test('It trims the surrounding whitespace', async function (assert) {
      this.fullName = '   John Doe   ';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText(`j${HAIR_SPACE}d`);
    });

    test('It keeps accented initials', async function (assert) {
      this.fullName = 'Émile Zola';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText(`é${HAIR_SPACE}z`);
    });
  });

  module('Concatenated first and last name', () => {
    test('It renders both initials when both names are set', async function (assert) {
      this.firstName = 'John';
      this.lastName = 'Doe';

      await render(hbs`<div>{{name-initials (concat this.firstName " " this.lastName)}}</div>`);
      assert.dom('div').hasText(`j${HAIR_SPACE}d`);
    });

    test('It renders the last name initial when the first name is missing', async function (assert) {
      this.firstName = undefined;
      this.lastName = 'Doe';

      await render(hbs`<div>{{name-initials (concat this.firstName " " this.lastName)}}</div>`);
      assert.dom('div').hasText('d');
    });

    test('It renders the first name initial when the last name is missing', async function (assert) {
      this.firstName = 'John';
      this.lastName = undefined;

      await render(hbs`<div>{{name-initials (concat this.firstName " " this.lastName)}}</div>`);
      assert.dom('div').hasText('j');
    });

    test('It renders nothing when both names are missing', async function (assert) {
      this.firstName = undefined;
      this.lastName = undefined;

      await render(hbs`<div>{{name-initials (concat this.firstName " " this.lastName)}}</div>`);
      assert.dom('div').hasText('');
    });
  });

  module('Edge cases', () => {
    test('It renders nothing for an empty name', async function (assert) {
      this.fullName = '';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText('');
    });

    test('It renders nothing for a whitespace only name', async function (assert) {
      this.fullName = '     ';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText('');
    });

    test('It merges both words into a single initial when they are separated by two spaces', async function (assert) {
      this.fullName = 'John  Doe';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText('j');
    });

    test('It renders both initials when the words are separated by three spaces', async function (assert) {
      this.fullName = 'John   Doe';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText(`j${HAIR_SPACE}d`);
    });

    test('It merges a word starting with a digit into the previous one', async function (assert) {
      this.fullName = 'John 3Doe';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText('j');
    });

    test('It merges a word starting with a symbol into the previous one', async function (assert) {
      this.fullName = 'John @Doe';

      await render(hbs`<div>{{name-initials this.fullName}}</div>`);
      assert.dom('div').hasText('j');
    });
  });

  module('Unsupported inputs', () => {
    test('It throws when the name is undefined', function (assert) {
      assert.throws(() => nameInitials([undefined]), TypeError);
    });

    test('It throws when the name is null', function (assert) {
      assert.throws(() => nameInitials([null]), TypeError);
    });

    test('It throws when the name is a number', function (assert) {
      assert.throws(() => nameInitials([42]), TypeError);
    });
  });
});
