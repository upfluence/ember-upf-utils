type ObjectOfType<Value = any, Key extends string | number | symbol = string> = Record<Key, Value>;

export function objectKeys<Object_ extends ObjectOfType<unknown>>(object: Object_): (keyof Object_)[] {
  return Object.keys(object) as (keyof Object_)[];
}
