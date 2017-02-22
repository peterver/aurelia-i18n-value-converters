import environment from './environment';
import {I18N} from 'aurelia-i18n';
import I18N_XHR from 'i18next-xhr-backend';
import moment from 'moment';

//Configure Bluebird Promises.
Promise.config({
  longStackTraces: environment.debug,
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use.standardConfiguration();
  aurelia.use.feature('resources');

  //  Setup i18n
  aurelia.use.plugin('aurelia-i18n', (instance) => {
    instance.i18next.use(I18N_XHR);

    // catch the event and make changes accordingly
    instance.i18next.on('languageChanged', (lng) => {
      moment.locale(lng);
    });

    return instance.setup({
      backend : {
        loadPath : '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation : {
        format : function (value, format, lng) {
          const parts = format.split(':');

          //  Check if the value converter is registered as a resource
          const vc = aurelia.resources.valueConverters[parts.shift()];

          return vc ? vc.toView(value, ...parts) : value;
        },
      },
      lng : 'en',
      attributes : ['t', 'i18n'],
      fallbackLng : 'en',
      debug : true
    });
  });


  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
