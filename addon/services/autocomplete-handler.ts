import Service from '@ember/service';
import { getOwner } from '@ember/application';

import { MockLoader } from '@upfluence/ember-upf-utils/utils/google-maps-mock';

import { Loader } from '@googlemaps/js-api-loader';

export interface AutocompleteHandlerInterface {
  getLoader(): Loader | MockLoader;
}

export default class AutocompleteHandler extends Service implements AutocompleteHandlerInterface {
  getLoader(): Loader {
    return new Loader({
      apiKey: getOwner(this).resolveRegistration('config:environment').google_map_api_key,
      version: 'weekly'
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'autocomplete-handler': AutocompleteHandler;
  }
}
