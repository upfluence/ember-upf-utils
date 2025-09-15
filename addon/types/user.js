import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  get fullName(): string {
    let { first_name, last_name } = this;
    if (first_name || last_name) {
      return `${first_name} ${last_name}`;
    }

    return 'Anonymous User';
  }
});
