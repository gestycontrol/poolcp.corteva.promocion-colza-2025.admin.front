import {
  i18n,
} from '@/tools/i18n.js';

export const translatedErrorMessage = (err, mappedErrorMessages) => {
  if (err?.response) {
    err = err?.response;
  }

  if (err?.message && !(err instanceof TypeError)) {
    err = err.message;
  }

  if (!err || (typeof err != 'string')) {
    err = 'An err has occurred';
  }

  if (mappedErrorMessages?.[err]) {
    err = mappedErrorMessages[err];
  }

  err = i18n(err);

  return err;
};