import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  hasSelection: true,
  hasSearch: true,
  hasPolymorphicColumns: true,
  onRowClickCallback: 'goToEntity',
  contentLoading: false
});
