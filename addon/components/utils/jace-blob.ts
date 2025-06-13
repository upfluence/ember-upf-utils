import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later, cancel } from '@ember/runloop';

interface JaceBlobArgs {
  loading: boolean;
}

const ACTIVE_GIF_DURATION = 7470;
const IDLE_GIF_DURATION = 7670;

export default class JaceBlob extends Component<JaceBlobArgs> {
  @tracked displayedLoading = this.args.loading;
  @tracked activeImageLoaded = false;
  @tracked idleImageLoaded = false;

  private loopStartTime = Date.now();
  private pendingSwitchTimer: ReturnType<typeof later> | null = null;

  get currentGifDuration(): number {
    return this.displayedLoading ? ACTIVE_GIF_DURATION : IDLE_GIF_DURATION;
  }

  willDestroy() {
    super.willDestroy();
    if (this.pendingSwitchTimer) cancel(this.pendingSwitchTimer);
  }

  get loadingClass() {
    return this.args.loading ? 'fade-in' : 'fade-out';
  }

  get inactiveClass() {
    return this.args.loading ? 'fade-out' : 'fade-in';
  }

  @action
  onImageLoad(type: 'active' | 'idle'): void {
    if (type === 'active') {
      this.activeImageLoaded = true;
    } else {
      this.idleImageLoaded = true;
    }
    if (!this.activeImageLoaded || !this.idleImageLoaded) return;

    this.handleLoadingChange();
  }

  @action
  handleLoadingChange(): void {
    if (this.args.loading === this.displayedLoading) return;
    if (this.pendingSwitchTimer) cancel(this.pendingSwitchTimer);

    const now = Date.now();
    const elapsed = now - this.loopStartTime;
    const remaining = Math.max(this.currentGifDuration - elapsed, 0);

    this.pendingSwitchTimer = later(
      this,
      () => {
        this.displayedLoading = this.args.loading;
        this.loopStartTime = Date.now();
        this.pendingSwitchTimer = null;
      },
      remaining
    );
  }
}
