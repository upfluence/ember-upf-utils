/*jshint node:true*/
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    modulePrefix: 'ember-upf-utils',

    'ember-toastr': {
      toastrOptions: {
        positionClass: 'toast-bottom-center upf-toastr--container',
        hideDuration: 200,
        timeOut: 10000,
        newestOnTop: true
      }
    },
  };
};
