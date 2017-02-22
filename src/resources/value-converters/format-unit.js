export class FormatUnitValueConverter {
  toView (temp) {
    if (!temp) return '';
    //  Base is centigrade (0)
    //  1 -> kelvin
    //  2 -> fahrenheit
    return ({
      0 : () => `${temp.val} °C`,
      1 : () => `${temp.val + 273.15} °K`,
      2 : () => `${(temp.val*1.8) + 32} °F`,
    }[temp.unit])();
  }
}
