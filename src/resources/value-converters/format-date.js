import moment from 'moment';

export class FormatDateValueConverter {
  toView (value, format) {
    return moment(value, 'YYYY-MM-DD').format(format);
  }
}
