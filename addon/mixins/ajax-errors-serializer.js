import Ember from 'ember';

const { Mixin } = Ember;

export default Mixin.create({
  extractErrors(store, typeClass, payload, id) {
    this._super(arguments);

    let errorsPayload = {};

    typeClass.eachAttribute((name) => {
      let key = this.keyForAttribute(name, 'deserialize');
      errorsPayload[key] = payload.errors.map( (error) => {
        if (error.detail.field === name) {
          let { resource, field, code } = error.detail;
          return `${resource}.${field}.${code}`;
        }
      }).filter(val => val !== undefined);
    });

    return errorsPayload;
  }
});
