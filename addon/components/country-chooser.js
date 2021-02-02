import Component from '@glimmer/component';
import CountryCodes from '@upfluence/ember-upf-utils/resources/country-codes';

export default class CountryChooserComponent extends Component {
  codes = CountryCodes

  // Named Arguments Defaults.
  // -------------------------
  get label() { return this.args.label || 'Country'; }
  get placeholder() { return this.args.placeholder || '-'; }
  get required() { return this.args.required || false; }
  get multiple() { return this.args.multiple || true; }
  get dark() { return this.args.dark || false; }
  get size() { return this.args.size || null; }

  get countryCode() {
    return this.args.countryCode || null;
  }

  get countryCodes() {
    return (this.args.countryCodes || []);
  }

  get _selection() {
    if (this.multiple) {
      return this.countryCodes.map((id) => this.codes.findBy('id', id));
    }

    return this.codes.findBy('id', this.countryCode);
  }

  // This is because having a getter forces us to have a setter when writing a
  // in an attribute. The value change is still performed.
  set _selection(v) {}

  get onCountrySelection() {
    if (!this.args.onCountrySelection) {
      throw new Error(
        '[component][country-chooser] Please provide a onCountrySelection action'
      );
    }

    return this.args.onCountrySelection;
  }
}
