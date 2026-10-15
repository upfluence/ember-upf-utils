import { getOwner } from '@ember/application';
import type EngineInstance from '@ember/engine/instance';
import Service from '@ember/service';

import { Loader } from '@googlemaps/js-api-loader';

export interface AutocompleteHandlerBase<T> {
  getLoader(): T;
}

export default class AutocompleteHandler extends Service implements AutocompleteHandlerBase<Loader> {
  getLoader(): Loader {
    return new Loader({
      apiKey: (
        (getOwner(this) as EngineInstance).resolveRegistration('config:environment') as { google_map_api_key: string }
      ).google_map_api_key,
      version: 'weekly'
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'autocomplete-handler': AutocompleteHandler;
  }
}
