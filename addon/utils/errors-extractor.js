export default function (payload, intl) {
  let errors = [];

  (payload.errors || []).forEach((e) => {
    if (typeof e === 'string') {
      errors.push(e);
    } else if (e.code && e.field && e.resource) {
      errors.push(intl.t(`${e.resource}.${e.field}.${e.code}`));
    }
  });

  return errors;
}
