import Ember from 'ember';

const { Component, run } = Ember;

export default Component.extend({
  hasSelection: true,
  hasSearch: true,
  hasPolymorphicColumns: true,
  onRowClickCallback: 'goToEntity',
  contentLoading: false,

  hasPagination: null,
  currentPage: 1,
  totalPages: 1,
  perPage: 1,
  itemTotal: 0,
  itemCount: 0,

  didInsertElement() {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == 'attributes') {
          if (mutation.target.classList.contains('expanding-search--opened')) {
            this.$(mutation.target).prev().css('display', 'none');
          } else {
            run.next(() => {
              this.$(mutation.target).prev().css('display', 'inline');
            }, 500);
          }
        }
      });
    });

    observer.observe(this.$('.expanding-search')[0], {
      attributes: true
    });
  }
});
