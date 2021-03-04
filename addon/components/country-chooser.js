import Component from '@glimmer/component';
import CountryCodes from '@upfluence/ember-upf-utils/resources/country-codes';

export default class CountryChooserComponent extends Component {
  codes = CountryCodes;

  constructor(owner, args) {
    super(owner, args);

    if (!args.onCountrySelection) {
      throw new Error('[component][country-chooser] Please provide a onCountrySelection action');
    }
  }

  // Named Arguments Defaults.
  // -------------------------
  get label() {
    return this.args.label || 'Country';
  }
  get placeholder() {
    return this.args.placeholder || '-';
  }
  get dark() {
    return this.args.dark || false;
  }
  get size() {
    return this.args.size || null;
  }
  get multiple() {
    return this.args.multiple == false ? this.args.multiple : true;
  }

  get countryCode() {
    return this.args.countryCode || null;
  }

  get countryCodes() {
    return this.args.countryCodes || [];
  }

  get _selection() {
    if (this.multiple) {
      return this.countryCodes.map((id) => this.codes.find((x) => x.id === id));
    }

    return this.codes.find((x) => x.id === this.countryCode);
  }

  // This is because having a getter forces us to have a setter when writing a
  // in an attribute. The value change is still performed.
  set _selection(v) {}
}
