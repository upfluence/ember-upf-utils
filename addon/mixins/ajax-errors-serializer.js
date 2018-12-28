import Mixin from '@ember/object/mixin';
import { isBlank } from '@ember/utils';

export default Mixin.create({
  extractErrors(store, typeClass, payload/*, id */) {
    if (!payload || typeof payload !== 'object' || !payload.errors) {
      return payload;
    }

    let defaultsErrors = this._super(arguments) || {};

    let errors = this.arrayToHash(payload.errors);

    typeClass.eachAttribute((name) => {
      let key = this.keyForAttribute(name, 'deserialize');
      // undersore / camelCase
      let validKey = key !== name ? name : key;

      if (!errors[key]) {
        return;
      }

      let {resource, field, code} = errors[key];

      if (!defaultsErrors[validKey]) {
        defaultsErrors[validKey] = [];
      }

      defaultsErrors[validKey].push(`${resource}.${field}.${code}`);
    });

    return defaultsErrors;
  },

  arrayToHash(errors) {
    if (isBlank(errors)) {
      return {};
    }

    return errors.reduce((acc, err) => {
      if (err.detail && err.detail.field) {
        acc[err.detail.field] = err.detail;
      }

      return acc;
    }, {});
  }
});
