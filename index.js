'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var CATHEDRA_CONFIG = Symbol('CATHEDRA_CONFIG');

var IS_BENCHMARK_KEY = 'isBenchmark';

var IS_SUITE_KEY = 'isSuite';

var DEFAULT_FN_NAME = 'unknown function';

var DEFAULT_SUITE_NAME = 'unknown suite';

var FUNCTION_FIELDS = ['initialize', 'before', 'after', 'fn', 'until', 'now'];

var isArray = function isArray(input) {
  return input instanceof Array;
};

var isFunction = function isFunction(input) {
  return Boolean(input && input.constructor && input.call && input.apply);
};

var isObject = function isObject(input) {
  return input instanceof Object && !isArray(input) && !isFunction(input);
};

var isDefined = function isDefined(input) {
  return input !== null && typeof input !== 'undefined';
};

var merge = function merge() {
  for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  var result = {};
  objects.forEach(function (object) {
    var keys = Object.keys(object);
    var symbols = Object.getOwnPropertySymbols(object);
    keys.forEach(function (key) {
      result[key] = object[key];
    });
    symbols.forEach(function (symbol) {
      result[symbol] = object[symbol];
    });
  });
  return result;
};

var milliseconds = function milliseconds(ms) {
  return function (_, totalTime) {
    return totalTime < ms;
  };
};

var times = function times(amount) {
  return function (ops) {
    return ops < amount;
  };
};

var configOf = function configOf(input) {
  return input[CATHEDRA_CONFIG];
};

var hasConfigKey = function hasConfigKey(key) {
  return function (input) {
    if (!isDefined(input)) {
      return false;
    }
    var config = input[CATHEDRA_CONFIG] || {};
    return Boolean(config[key]);
  };
};

var isBenchmark = hasConfigKey(IS_BENCHMARK_KEY);

var isSuite = hasConfigKey(IS_SUITE_KEY);

var initConfig = function initConfig(input) {
  for (var _len2 = arguments.length, configs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    configs[_key2 - 1] = arguments[_key2];
  }

  if (!isFunction(input)) {
    throw new TypeError('expected function, got ' + input + ' instead');
  }
  if (isDefined(configOf(input))) {
    throw new Error('input is already either a benchmark or a suite');
  }
  input[CATHEDRA_CONFIG] = merge.apply(undefined, configs);
  return input;
};

var omit = function omit(object) {
  for (var _len3 = arguments.length, keys = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    keys[_key3 - 1] = arguments[_key3];
  }

  var result = {};
  Object.keys(object).filter(function (key) {
    return !keys.includes(key);
  }).forEach(function (key) {
    result[key] = object[key];
  });
  Object.getOwnPropertySymbols(object).filter(function (symbol) {
    return !keys.includes(symbol);
  }).forEach(function (symbol) {
    result[symbol] = object[symbol];
  });
  return result;
};

var now = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now;

var assert = function assert(value, message) {
  var ErrorConstructor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Error;

  if (!value) {
    throw new ErrorConstructor(message);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var runSuite = function runSuite(input) {
  var parentConfig = configOf(input);
  var children = parentConfig.children;

  var results = children.map(function (child) {
    var originalChildConfig = configOf(child);
    var childWithParentConfig = child(omit(parentConfig, 'name', 'isSuite', 'children'), originalChildConfig);
    var childResults = run(childWithParentConfig);
    return omit.apply(undefined, [merge(configOf(childWithParentConfig), childResults)].concat(toConsumableArray(FUNCTION_FIELDS)));
  });
  return merge(omit.apply(undefined, [parentConfig].concat(toConsumableArray(FUNCTION_FIELDS))), { children: results });
};

var runRepeatedly = function runRepeatedly(_ref) {
  var fn = _ref.fn,
      until = _ref.until,
      now = _ref.now,
      args = _ref.args;

  var operations = 0;
  var pureTime = 0;
  var fullTime = 0;
  var startTime = now();

  while (true) {
    // eslint-disable-line no-constant-condition
    var before = now();
    fn.apply(undefined, toConsumableArray(args));
    var after = now();

    var runTime = after - before;

    pureTime += runTime;
    operations += 1;
    fullTime = after - startTime;

    if (!until(operations, fullTime, pureTime)) {
      break;
    }
  }

  return { operations: operations, pureTime: pureTime, fullTime: fullTime };
};

var withDefaults = function withDefaults(input) {
  var _configOf = configOf(input),
      now$$1 = _configOf.now,
      name = _configOf.name,
      until = _configOf.until,
      initialize = _configOf.initialize,
      before = _configOf.before,
      after = _configOf.after;

  return input({
    now: isDefined(now$$1) ? now$$1 : now,
    name: isDefined(name) ? name : 'unknown',
    until: isDefined(until) ? until : milliseconds(5000),
    before: isDefined(before) ? before : function () {/* default before */},
    after: isDefined(after) ? after : function () {/* default after */},
    initialize: isDefined(initialize) ? initialize : function () {
      return [/* default init */];
    }
  });
};

var runBenchmark = function runBenchmark(input) {
  var benchWithDefaults = withDefaults(input);
  var config = configOf(benchWithDefaults);
  var initialize = config.initialize,
      before = config.before,
      after = config.after,
      fn = config.fn,
      now$$1 = config.now,
      until = config.until;


  var args = initialize() || [];

  before.apply(undefined, toConsumableArray(args));
  var results = runRepeatedly({ fn: fn, now: now$$1, until: until, args: args });
  after.apply(undefined, toConsumableArray(args));

  return merge(omit.apply(undefined, [config].concat(toConsumableArray(FUNCTION_FIELDS))), results);
};

var run = function run(input) {
  if (isBenchmark(input)) {
    return runBenchmark(input);
  } else if (isSuite(input)) {
    return runSuite(input);
  }
  throw new TypeError('expected benchmark or suite, got ' + input + ' instead');
};

var fromConfig = function fromConfig(config) {
  var runnable = function runnable() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 0) {
      return run(runnable);
    } else {
      args.forEach(function (arg) {
        return assert(isObject(arg), 'expected object, got ' + arg + ' of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) + ' instead', TypeError);
      });
      return fromConfig(merge.apply(undefined, [configOf(runnable)].concat(args)));
    }
  };
  return initConfig(runnable, config);
};

var fromFunction = function fromFunction(fn) {
  return fromConfig(defineProperty({
    fn: fn,
    name: fn.name === '' ? DEFAULT_FN_NAME : fn.name
  }, IS_BENCHMARK_KEY, true));
};

var benchmark = function benchmark(input) {
  if (isBenchmark(input)) {
    return input;
  } else if (isObject(input)) {
    return fromConfig(input);
  } else if (isFunction(input)) {
    return fromFunction(input);
  }
  throw new TypeError('expected either configuration object or function, got ' + input + ' of type ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)) + ' instead');
};

var toBenchmarkOrSuite = function toBenchmarkOrSuite(input) {
  if (isSuite(input) || isBenchmark(input)) {
    return input;
  } else if (isFunction(input)) {
    return benchmark(input);
  }
  throw new TypeError('expected suite, benchmark or function, got ' + input + ' of type ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)) + ' instead');
};

var fromBenchmarksOrSuites = function fromBenchmarksOrSuites(children) {
  return fromConfig(defineProperty({
    name: DEFAULT_SUITE_NAME,
    children: children
  }, IS_SUITE_KEY, true));
};

var suite = function suite() {
  for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
    input[_key] = arguments[_key];
  }

  return fromBenchmarksOrSuites(input.map(toBenchmarkOrSuite));
};

exports.benchmark = benchmark;
exports.suite = suite;
exports.times = times;
exports.milliseconds = milliseconds;
exports.isBenchmark = isBenchmark;
exports.isSuite = isSuite;
