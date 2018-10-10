(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['tinycolor'] };
  }

  define('tinycolor', [], vendorModule);
})();
