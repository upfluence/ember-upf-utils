export default function (payload, i18n) {
  let errors = [];

  (payload.errors || []).forEach((e) => {
    if (typeof e === 'string') {
      errors.push(e);
    } else if (e.code && e.field && e.resource) {
      errors.push(i18n.t(
        `${e.resource}.${e.field}.${e.code}`
      ));
    }
  });

  return errors;
}

