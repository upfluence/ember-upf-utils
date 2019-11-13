import Mixin from '@ember/object/mixin';

export default Mixin.create({
  handleResponse(status, headers, payload, requestData) {
    if (status === 402) {
      payload.errors = [{
        message: 'limit_exceeded',
        limit_spent: headers['x-endpoint-spent'],
        limit_total: headers['x-endpoint-limit'],
        status: status
      }];

      delete payload.error;
    }

    return this._super(status, headers, payload, requestData);
  }
});
