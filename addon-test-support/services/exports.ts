import Service from '@ember/service';

export const PROCESSED_EXPORT_RESPONSE = {
  processed: 2,
  status: 'processed',
  total: 2,
  waiting: 0,
  warnings: []
};

export const SCHEDULED_EXPORT_RESPONSE = {
  processed: 2,
  status: 'scheduled',
  total: 20,
  waiting: 0,
  warnings: []
};


export default class extends Service {
  perform(source: any, destination: any) {
    console.info(
      `Mock ExportService: Received export request.
        => Source: ${JSON.stringify(source)}
        => Destination: ${JSON.stringify(destination)}`
    );
    return Promise.resolve(PROCESSED_EXPORT_RESPONSE);
  }

  getAvailableExports() {
    return Promise.resolve({
      destinations: {
        entities: ['campaign', 'list', 'stream']
      },
      sources: {
        entities: ['campaign', 'list']
      }
    });
  }

  getLimit() {
    return Promise.resolve({
      limit: 500,
      spent: 1
    });
  }

  searchEntities() {
    return Promise.resolve({
      list: [{ id: 1, name: 'foo list', total: 23, type: 'list' }]
    });
  }
}
