import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['campaign-dashboard'],

  statsSizeClass: computed('isInList', function() {
    if (this.get('isInList')) {
      return 'col-xs-12';
    }

    return 'col-xs-4';
  }),

  campaignTags: computed('isInList', 'campaign.tags', function() {
    if (this.get('isInList')) {
      return this.get('campaign.tags').slice(0, 3);
    } else {
      this.get('campaign.tags');
    }
  }),

  totalSourcedToPercent: computed(
    'campaign.{totalSourced,targetSourced}',
    function() {
      return (100 * this.getWithDefault(
        'campaign.totalSourced',
        0
      )) / this.get('campaign.targetSourced');
    }
  ),

  totalInterestedToPercent: computed(
    'campaign.{totalInterested,targetInterested}',
    function() {
      return (100 * this.getWithDefault(
        'campaign.totalInterested',
        0
      )) / this.get('campaign.targetInterested');
    }
  ),

  totalUnknown: computed(
    'campaign.selectabilityStats.unknown_selectability',
    function() {
      return this.getWithDefault(
        'campaign.selectabilityStats.unknown_selectability',
        0
      );
    }
  ),

  totalOk: computed(
    'campaign.selectabilityStats.ok',
    function() {
      return this.getWithDefault(
        'campaign.selectabilityStats.ok',
        0
      );
    }
  ),

  totalGood: computed(
    'campaign.selectabilityStats.good',
    function() {
      return this.getWithDefault(
        'campaign.selectabilityStats.good',
        0
      );
    }
  ),

  totalGreat: computed(
    'campaign.selectabilityStats.great',
    function() {
      return this.getWithDefault(
        'campaign.selectabilityStats.great',
        0
      );
    }
  ),
});
