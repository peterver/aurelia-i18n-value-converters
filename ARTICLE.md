#Combining value converters with i18n in aurelia
 
Most if not all projects at one point or another will have to provide multilingual support.

Adding i18n support in aurelia is as easy as adding the [aurelia-i18n](https://github.com/aurelia/i18n) library and [configuring it](http://aurelia.io/hub.html#/doc/article/aurelia/i18n/latest/i18n-with-aurelia).

But as a project becomes larger, centralizing your logic into reusable components is the way to go.

This article describes a way of combining aurelia's value-converters with i18n, to allow reusing them in your locales.

A live preview can be found [here](https://peterver.github.io/aurelia-i18n-value-converters/).

###0. Getting Started

Create a new aurelia project by running

`au new`

After this has completed, follow the steps at [i18n-with-aurelia](http://aurelia.io/hub.html#/doc/article/aurelia/i18n/latest/i18n-with-aurelia/1) to configure your aurelia project for internationalization.

###1. Adjust the i18n configuration to allow value-converter support

Aurelia-i18n is a wrapper that does two things, and it does it well.

- It acts as a proxy around [i18next](https://www.i18next.com) to allow you to configure an aurelia application for i18next support. 
- It provides some syntactic sugar to allow for easier translations

The fact that it acts as a proxy, allows us to still hook into the **i18next instance** without too much hassle.

i18next provides [interpolation](http://i18next.com/translate/interpolation/) support, this is a way of defining how the specific key-value pairs in your locale file should be processed.

Aurelia provides thin wrappers such as the *[html]* flag or the *df (dateFormat)* value converter to hook into this.

But what if we wanted to add our own custom value converters into the mix?

A very interesting configuration option for i18next's interpolation feature is the [format](http://i18next.com/translate/formatting/) property.

This provides us with a hook into the processing pipeline of i18next, go ahead and extend your i18n configuration like so:

```javascript
return instance.setup({
	// ...
	interpolation : {
		format : function (value, format, lng) {
			const parts = format.split(':');

			//  Check if the value converter is registered as a resource
			const vc = aurelia.resources.valueConverters[parts.shift()];

			return vc ? vc.toView(value, ...parts) : value;
		}
	}
	// ...
});
```

There's a couple of things going on here, let's use an example to explain this step by step.

###2. Using value converters in your locales, an example

Let's consider a value converter called `formatDate`, all this value converter does is receive a date and a format, and return a string representation of that date in the provided format.

```javascript
import moment from 'moment';

export class FormatDateValueConverter {
  toView (value, format) {
    return moment(value, 'YYYY-MM-DD').format(format);
  }
}

```

To use this in your view you could have a setup like so : 

```<span t="a" t-params.bind="{date: '2017-02-20}"></span>```

And your locale file could look like : 

```
{
  a : "Today's date is : {{date, formatDate:MMMM D YYYY}}"
}
```

When executed, i18next will recognize that the key you're trying to translate contains a section that needs to be interpolated (because of the ```{{ ... }}``` in your locale file).

As such it will execute the *interpolation.format* function that we configured in the previous step.

This function will receive a value, format and an optional lng parameter

- Value : The date that we passed, in this case it will be `2017-02-20`
- Format : Our locale file will define this as being `formatDate:MMMM D YYYY`

The format will be split on the `:` character to become `['formatDate', 'MMMM D YYYY']` where the first part would be the name of your value converter and the second part would be any additional parameters your value converter would need.

Our format function will then look for the value converter in aurelia's registered resources, and will execute the `toView` function with the provided parameters.

If no value converter was registered under that name, it will simply return the value.

### Take note

This approach will only work if the value converter that you are trying to use is registered as a global resource.
 