export class Log {
  constructor(disabled) {
    var _this = this;
    this._disabled = void 0;
    this.log = function (message) {
      if (_this.logger) _this.logger(message);
      if (_this.disabled) return () => {};
      for (var _len = arguments.length, optionalParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        optionalParams[_key - 1] = arguments[_key];
      }
      return console.log(message, ...optionalParams);
    };
    this.error = function (message) {
      if (_this.logger) _this.logger(message);
      if (_this.disabled) return () => {};
      for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        optionalParams[_key2 - 1] = arguments[_key2];
      }
      return console.error(message, ...optionalParams);
    };
    this.logger = message => {};
    this.disabled = disabled || false;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(val) {
    this._disabled = val;
  }
}
export var log = new Log();