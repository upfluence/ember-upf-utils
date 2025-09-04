import { helper as buildHelper } from '@ember/component/helper';

export const PREVENT_COMPACT_NOTATION_BELOW = 1000;
export const ROUND_TO_INTEGER_ABOVE = 100;

const _getFormatter = function (number) {
  const absoluteValue = Math.abs(number);

  const options =
    absoluteValue >= PREVENT_COMPACT_NOTATION_BELOW
      ? { minimumFractionDigits: 0, maximumFractionDigits: 1, notation: 'compact' }
      : absoluteValue >= ROUND_TO_INTEGER_ABOVE
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 2 };

  return Intl.NumberFormat(['en-EN', 'fr-FR'], options);
};

const formatNumber = function formatNumber(params) {
  const number = params[0];

  if (number === null || number === undefined || isNaN(number)) {
    return '-';
  }

  return _getFormatter(number).format(number);
};

export { formatNumber };
export default buildHelper(formatNumber);
