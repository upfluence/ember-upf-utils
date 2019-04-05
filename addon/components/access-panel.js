import Component from '@ember/component';

export default Component.extend({
  hasSelection: true,
  hasSearch: true,
  hasPolymorphicColumns: true,
  contentLoading: false,

  onRowClick() {},
  performSearch() {},

  hasPagination: null,
  currentPage: 1,
  totalPages: 1,
  perPage: 1,
  itemTotal: 0,
  itemCount: 0,
});
