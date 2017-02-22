import {I18N} from 'aurelia-i18n';

export class FormatConditionValueConverter {
  static inject = [I18N];

  constructor (i18n) {
    this.__ = {i18n};
  }

  toView (value, format) {
    return value
      .split(':')
      .map((cond) => this.__.i18n.tr(`weather.conditions.${cond}`))
      .join(', ');
  }
}
