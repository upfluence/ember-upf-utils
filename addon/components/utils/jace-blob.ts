import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface JaceBlobArgs {
  loading: boolean;
}

export default class JaceBlob extends Component<JaceBlobArgs> {
  @tracked displayedLoading = this.args.loading;

  get loadingClass(): string {
    return this.args.loading ? 'fade-in' : 'fade-out';
  }

  get inactiveClass(): string {
    return this.args.loading ? 'fade-out' : 'fade-in';
  }
}
