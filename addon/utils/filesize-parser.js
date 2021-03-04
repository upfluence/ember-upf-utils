// implementation from https://github.com/patrickkettner/filesize-parser
let validAmount = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let parsableUnit = function (u) {
  return u.match(/\D*/).pop() === u;
};
let incrementBases = {
  2: [
    [['b', 'bit', 'bits'], 1 / 8],
    [['B', 'Byte', 'Bytes', 'bytes'], 1],
    [['Kb'], 128],
    [['k', 'K', 'kb', 'KB', 'KiB', 'Ki', 'ki'], 1024],
    [['Mb'], 131072],
    [['m', 'M', 'mb', 'MB', 'MiB', 'Mi', 'mi'], Math.pow(1024, 2)],
    [['Gb'], 1.342e8],
    [['g', 'G', 'gb', 'GB', 'GiB', 'Gi', 'gi'], Math.pow(1024, 3)],
    [['Tb'], 1.374e11],
    [['t', 'T', 'tb', 'TB', 'TiB', 'Ti', 'ti'], Math.pow(1024, 4)],
    [['Pb'], 1.407e14],
    [['p', 'P', 'pb', 'PB', 'PiB', 'Pi', 'pi'], Math.pow(1024, 5)],
    [['Eb'], 1.441e17],
    [['e', 'E', 'eb', 'EB', 'EiB', 'Ei', 'ei'], Math.pow(1024, 6)]
  ],
  10: [
    [['b', 'bit', 'bits'], 1 / 8],
    [['B', 'Byte', 'Bytes', 'bytes'], 1],
    [['Kb'], 125],
    [['k', 'K', 'kb', 'KB', 'KiB', 'Ki', 'ki'], 1000],
    [['Mb'], 125000],
    [['m', 'M', 'mb', 'MB', 'MiB', 'Mi', 'mi'], 1.0e6],
    [['Gb'], 1.25e8],
    [['g', 'G', 'gb', 'GB', 'GiB', 'Gi', 'gi'], 1.0e9],
    [['Tb'], 1.25e11],
    [['t', 'T', 'tb', 'TB', 'TiB', 'Ti', 'ti'], 1.0e12],
    [['Pb'], 1.25e14],
    [['p', 'P', 'pb', 'PB', 'PiB', 'Pi', 'pi'], 1.0e15],
    [['Eb'], 1.25e17],
    [['e', 'E', 'eb', 'EB', 'EiB', 'Ei', 'ei'], 1.0e18]
  ]
};

export default function (input) {
  let options = arguments[1] || {};
  let base = parseInt(options.base || 2);

  /* eslint-disable no-useless-escape */
  let parsed = input.toString().match(/^([0-9\.,]*)(?:\s*)?(.*)$/);
  /* eslint-enable no-useless-escape */
  let amount = parsed[1].replace(',', '.');
  let unit = parsed[2];

  let validUnit = function (sourceUnit) {
    return sourceUnit === unit;
  };

  if (!validAmount(amount) || !parsableUnit(unit)) {
    throw "Can't interpret " + (input || 'a blank string');
  }
  if (unit === '') return Math.round(Number(amount));

  let increments = incrementBases[base];
  for (let i = 0; i < increments.length; i++) {
    let _increment = increments[i];

    if (_increment[0].some(validUnit)) {
      return Math.round(amount * _increment[1]);
    }
  }

  throw unit + " doesn't appear to be a valid unit";
}
