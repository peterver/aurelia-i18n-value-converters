export function configure(au) {
  //  Hook up value converters
  [
    'format-date',
    'format-unit',
    'format-condition',
  ].forEach((vc) => au.globalResources(`./value-converters/${vc}`));
}
