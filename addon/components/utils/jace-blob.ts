import Component from '@glimmer/component';
interface JaceBlobArgs {
  loading: boolean;
}

export default class JaceBlob extends Component<JaceBlobArgs> {
  get loadingClass(): string {
    return this.args.loading ? 'fade-in' : 'fade-out';
  }

  get inactiveClass(): string {
    return this.args.loading ? 'fade-out' : 'fade-in';
  }
}
