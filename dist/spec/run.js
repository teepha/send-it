"use strict";

var _jasmine = _interopRequireDefault(require("jasmine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var jasmine = new _jasmine["default"]();
jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.execute();