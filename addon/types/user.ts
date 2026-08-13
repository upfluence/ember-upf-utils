import EmberObject from '@ember/object';

export default EmberObject.extend({
  get fullName(): string {
    const { first_name, last_name } = this as any;
    if (first_name || last_name) {
      return `${first_name} ${last_name}`;
    }

    return 'Anonymous User';
  }
});
