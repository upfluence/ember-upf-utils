import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, getSettledState, waitUntil } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { hbs } from 'ember-cli-htmlbars';
import {
  clickTrigger, selectChoose, typeInSearch
} from 'ember-power-select/test-support/helpers'
import sinon from 'sinon';

class CurrentUserServiceStub extends Service {
  async fetchOwnerships() {
    return [];
  }
}

module('Integration | Component | ownership-selection', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:current-user', CurrentUserServiceStub);
  });

  test('(no ownerships) it does not render anything', async function(assert) {
    this.entity = null;

    await render(hbs`{{ownership-selection entity=this.entity}}`);

    assert.dom('.ember-basic-dropdown').doesNotExist();
  });

  // ownerships > 1 because there is always at least the current user's.
  test('(w/ ownerships > 1) it renders the current ownerships and available options', async function(assert) {
    this.entity = EmberObject.create({ name: 'My Entity', ownedBy: 'user:1' });
    this.ownershipsStub = [
      {
        id: 'user:1',
        name: 'Norman'
      },
      {
        id: 'company:1',
        name: 'Marvel'
      },
      {
        id: 'team:1',
        name: 'Spiderman Villains'
      }
    ];

    const currentUserService = this.owner.lookup('service:current-user');

    sinon.stub(currentUserService, 'fetchOwnerships').returns(
      new Promise((resolve) => resolve(this.ownershipsStub))
    );

    await render(hbs`{{ownership-selection entity=this.entity}}`);

    assert.dom('.ember-basic-dropdown').exists();
    assert.dom(
      '.ember-basic-dropdown .ember-power-select-selected-item'
    ).containsText('Norman');

    await clickTrigger();

    const options = this.element.querySelectorAll('.ember-power-select-options li');

    assert.equal(options.length, 3);
    assert.dom(options[0]).containsText('Norman');
    assert.dom(options[1]).containsText('Marvel');
    assert.dom(options[2]).containsText('Spiderman Villains');
  });

  test('it correctly updates when the entity changes', async function(assert) {
    this.entity = EmberObject.create({ name: 'My Entity', ownedBy: 'user:1' });
    this.ownershipsStub = [
      {
        id: 'user:1',
        name: 'Norman'
      },
      {
        id: 'company:1',
        name: 'Marvel'
      },
      {
        id: 'team:1',
        name: 'Spiderman Villains'
      }
    ];

    const currentUserService = this.owner.lookup('service:current-user');

    sinon.stub(currentUserService, 'fetchOwnerships').returns(
      new Promise((resolve) => resolve(this.ownershipsStub))
    );

    await render(hbs`{{ownership-selection entity=this.entity}}`);

    assert.dom(
      '.ember-basic-dropdown .ember-power-select-selected-item'
    ).containsText('Norman');

    this.set('entity', EmberObject.create({ name: 'Entity #2', ownedBy: 'company:1' }));

    await waitUntil(() => {
      // Check for the settled state minus hasPendingTimers
      // https://github.com/emberjs/ember-test-helpers/blob/master/API.md#getsettledstate
      let { hasRunLoop, hasPendingRequests, hasPendingWaiters } = getSettledState();
      if (hasRunLoop || hasPendingRequests || hasPendingWaiters) {
        return false;
      }

      return true;
    });

    assert.dom(
      '.ember-basic-dropdown .ember-power-select-selected-item'
    ).containsText('Marvel');
  });

  test('it correctly assign a selected ownership to the entity', async function(assert) {
    this.entity = EmberObject.create({ name: 'My Entity', ownedBy: 'user:1' });
    this.ownershipsStub = [
      {
        id: 'user:1',
        name: 'Norman'
      },
      {
        id: 'company:1',
        name: 'Marvel'
      },
      {
        id: 'team:1',
        name: 'Spiderman Villains'
      }
    ];

    const currentUserService = this.owner.lookup('service:current-user');

    sinon.stub(currentUserService, 'fetchOwnerships').returns(
      new Promise((resolve) => resolve(this.ownershipsStub))
    );

    await render(hbs`{{ownership-selection entity=this.entity}}`);

    assert.dom(
      '.ember-basic-dropdown .ember-power-select-selected-item'
    ).containsText('Norman');

    await selectChoose('.ember-power-select-trigger', 'Spiderman Villains');

    assert.dom(
      '.ember-basic-dropdown .ember-power-select-selected-item'
    ).containsText('Spiderman Villains');
    assert.equal(this.entity.ownedBy, 'team:1');
  });
});
