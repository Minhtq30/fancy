export default function JsonProperty(name: string) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function DoJsonProperty(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.get = function () {
      return this.data[name];
    };
    descriptor.set = function (value) {
      this.data[name] = value;
    };
  };
}
