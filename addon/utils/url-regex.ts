const PROTOCOL = '(https?:\\/\\/)?';
const WWW_DOMAIN =
  '(www\\.(?!\\d+\\.\\d+\\.\\d+\\.)([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)';
const NON_WWW_DOMAIN =
  '((?!www\\.)(?!\\d+\\.\\d+\\.\\d+\\.\\d+)[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?';
const OPTIONAL_PATH = '(\\/[^\\s]*)?';
const OPTIONAL_HASH = '(#[^\\s]*)?';

export const URL_REGEX = new RegExp(`^${PROTOCOL}(${WWW_DOMAIN}|${NON_WWW_DOMAIN})${OPTIONAL_PATH}${OPTIONAL_HASH}$`);
