// Types for compiled templates
declare module '@upfluence/ember-upf-utils/templates/*' {}

namespace QUnit {
  type TestFunctionCallback = (this: TestContext, assert: Assert) => void | Promise<void>;
}
