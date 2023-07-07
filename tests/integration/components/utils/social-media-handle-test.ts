import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import typeIn from '@ember/test-helpers/dom/type-in';
import click from '@ember/test-helpers/dom/click';
import sinon from 'sinon';

module('Integration | Component | utils/social-media-handle', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.onChange = sinon.stub();
  });

  test('it renders', async function (assert) {
    await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);

    assert.dom('.social-handle-container').exists();
  });

  test('If the @errorMessage parameter is filled, the message is displayed', async function (assert) {
    await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @errorMessage="This is an error" />`);

    assert.dom('.social-handle-container').exists();
    assert.dom('.social-handle-input--error').exists();
    assert.dom('.font-color-error-500').hasText('This is an error');
  });

  module('Default mode', () => {
    module('Parameter verifications', () => {
      test('Not passing the @socialNetwork parameter preselects Instagram', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);
        assert.dom('.selector i').hasClass('fa-instagram');
      });
      test('Passing the @socialNetwork parameter preselects the correct network', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @socialNetwork="twitter" />`);
        assert.dom('.selector i').hasClass('fa-twitter');
      });
      test('Passing the @handle parameter fills the input with the formatted URL', async function (assert) {
        await render(
          hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @handle="nomad.technologies" @socialNetwork="instagram" />`
        );
        assert.dom('input').hasValue('https://www.instagram.com/nomad.technologies');
      });
      test('Passing the @handle parameter in a URL format fills the input without modifying the contents', async function (assert) {
        await render(
          hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @handle="https://www.instagram.com/specific/nomad.technologies" @socialNetwork="instagram" />`
        );
        assert.dom('input').hasValue('https://www.instagram.com/specific/nomad.technologies');
      });
    });

    module('User action verifications', () => {
      test('Typing a handle and blurring the input reformats the @handle', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);
        await typeIn('input', 'tito');
        await click('.social-handle-container');
        assert.dom('input').hasValue('https://www.instagram.com/tito');
      });
      test('Typing a handle and hitting the enter key reformats the @handle', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);
        await typeIn('input', 'tito');
        await triggerKeyEvent('input', 'keydown', 'Enter');
        assert.dom('input').hasValue('https://www.instagram.com/tito');
      });
      test('Typing a URL in the input does not reformat the input', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);
        await typeIn('input', 'http://url.com/tito');
        await triggerKeyEvent('input', 'keydown', 'Enter');
        assert.dom('input').hasValue('http://url.com/tito');
      });
      test('When the handle input is already filled, changing the social network applies the new Network URL', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);
        await typeIn('input', 'tito');
        await click('.social-handle-container');
        assert.dom('input').hasValue('https://www.instagram.com/tito');
        await click('.selector');
        await click('.upf-infinite-select__item:nth-child(2)');
        assert.dom('input').hasValue('https://twitter.com/tito');
      });
    });

    module('Developer verifications', () => {
      test('When the component is created with @socialNetwork & @handle parameters, the @onChange function is called', async function (assert) {
        await render(
          hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @handle="nomad.technologies" @socialNetwork="instagram" />`
        );
        assert.true(
          this.onChange.calledOnceWithExactly(
            'instagram',
            'nomad.technologies',
            'https://www.instagram.com/nomad.technologies'
          )
        );
      });
      test('When the input is blurred, the @onChange function is called', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);
        await typeIn('input', 'a');
        await click('.social-handle-container');
        assert.true(this.onChange.calledOnceWithExactly('instagram', 'a', 'https://www.instagram.com/a'));
      });
      test('When the user hits the Enter key, the @onChange function is called', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} />`);
        await typeIn('input', 'a');
        await triggerKeyEvent('input', 'keydown', 'Enter');
        assert.true(this.onChange.calledOnceWithExactly('instagram', 'a', 'https://www.instagram.com/a'));
      });
      test('When the user selects a social network, the @onChange function is called', async function (assert) {
        await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @handle="a" @socialNetwork="a" />`);
        assert.true(this.onChange.calledOnceWithExactly('instagram', 'a', 'https://www.instagram.com/a'));
        await click('.selector');
        await click('.upf-infinite-select__item:nth-child(2)');
        assert.true(this.onChange.calledWithExactly('twitter', 'a', 'https://twitter.com/a'));
      });
    });
  });

  module('Selector-Only mode', () => {
    test('Only the dropdown is visible', async function (assert) {
      await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @selectorOnly={{true}} />`);
      assert.dom('.selector-full-width').exists();
      assert.dom('input').doesNotExist();
    });
    test('If the @socialNetwork parameter is not passed, instagram is selected as default', async function (assert) {
      await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @selectorOnly={{true}} />`);
      assert.dom('.selector-full-width div span').hasText('Instagram');
    });
    test('If the @socialNetwork parameter is passed, the proper network is selected', async function (assert) {
      await render(
        hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @selectorOnly={{true}} @socialNetwork="twitter" />`
      );
      assert.dom('.selector-full-width div span').hasText('Twitter');
    });
    test('When the user selects another network from the dropdown, the @onChange function is called', async function (assert) {
      await render(hbs`<Utils::SocialMediaHandle @onChange={{this.onChange}} @selectorOnly={{true}} />`);
      await click('.selector');
      await click('.upf-infinite-select__item:nth-child(2)');
      assert.true(this.onChange.calledWith('twitter'));
    });
  });
});
