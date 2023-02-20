import Service, { inject as service } from '@ember/service';

export default class AuthenticatedRequesterService extends Service {
  @service declare session: any;

  get headers(): Headers {
    return new Headers({ Authorization: `Bearer ${this.accessToken}` });
  }

  private get accessToken(): string {
    return this.session.data.authenticated.access_token;
  }
}

declare module '@ember/service' {
  interface Registry {
    'authenticated-requester-service': AuthenticatedRequesterService;
  }
}
