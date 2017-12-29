import Ember from 'ember';

const { Mixin } = Ember;

export default Mixin.create({
  didInsertElement() {
    this._super();

    if (this.$().attr('data-toggle') !== '') {
      this.$().tooltip();
    } else {
      this.this.$('[data-toggle="tooltip"]').tooltip();
    }
  }
});
