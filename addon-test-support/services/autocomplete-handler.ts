import Service from '@ember/service';

import { AutocompleteHandlerInterface } from '@upfluence/ember-upf-utils/services/autocomplete-handler';
import { MockLoader } from '@upfluence/ember-upf-utils/utils/google-maps-mock';

class AutocompleteHandlerServiceMock extends Service implements AutocompleteHandlerInterface {
  private mockLoader: MockLoader = new MockLoader({ apiKey: 'test-key' });

  getLoader(): MockLoader {
    return this.mockLoader;
  }
}

export { AutocompleteHandlerServiceMock };
