/*jshint node:true*/
'use strict';

module.exports = function(environment, appConfig) {
  appConfig['ember-toastr'] = {
    toastrOptions: {
      positionClass: 'toast-bottom-center upf-toastr--container',
      hideDuration: 200,
      timeOut: 12000,
      newestOnTop: true,
      closeButton: true,
      extendedTimeOut: 6000
    }
  };

  return {
    modulePrefix: 'ember-upf-utils'
  };
};
