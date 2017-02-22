import moment from 'moment';
import {bindable, bindingMode, Aurelia} from 'aurelia-framework';
import {BindingSignaler} from 'aurelia-templating-resources';
import {I18N} from 'aurelia-i18n';

export class App {
  static inject = [I18N, Aurelia, BindingSignaler];

  @bindable({defaultBindingMode: bindingMode.oneWay}) unit = 0;
  @bindable({defaultBindingMode: bindingMode.oneWay}) language = 'en';

  constructor(i18n, au, signal) {
    this.__ = {i18n, au, signal};

    this.data = {
      date : '2017-02-20',
      unit : 0,
      records : [
        {
          city : 'cities.0',
          country : 'countries.BE',
          data : [
            { date : '2017-02-20', temp : 11, condition : 'B1'},
            { date : '2017-02-21', temp : 12, condition : 'C1'},
            { date : '2017-02-22', temp : 11, condition : 'B1:C1:D1'},
          ]
        }, {
          city : 'cities.1',
          country : 'countries.UK',
          data : [
            { date : '2017-02-20', temp : 14, condition : 'B1'},
            { date : '2017-02-21', temp : 12, condition : 'B1:C2'},
            { date : '2017-02-22', temp : 12, condition : 'C2'},
          ]
        }, {
          city : 'cities.2',
          country : 'countries.ES',
          data : [
            { date : '2017-02-20', temp : 14, condition : 'B1'},
            { date : '2017-02-21', temp : 16, condition : 'A1:B1'},
            { date : '2017-02-22', temp : 16, condition : 'A1:B2'},
          ]
        },
      ]
    };

    this.__.au.subscribe('i18n:locale:changed', (payload) => {
      this.__.signal.signal('language-signal');
    });
  }

  languageChanged (lng) {
    this.__.i18n.setLocale(lng);
  }

  unitChanged (uom) {
    this.data.unit = uom;
    this.__.signal.signal('unit-signal');
  }
}
