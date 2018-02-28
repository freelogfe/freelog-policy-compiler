'use strict';

var _require = require('@freelog/resource-policy-lang'),
    resourcePolicyLexer = _require.resourcePolicyLexer,
    resourcePolicyParser = _require.resourcePolicyParser;

var _require2 = require('antlr4/index'),
    InputStream = _require2.InputStream,
    CommonTokenStream = _require2.CommonTokenStream;

var _require3 = require('antlr4/tree'),
    ParseTreeWalker = _require3.ParseTreeWalker;

var ErrorListener = require('antlr4/error/ErrorListener').ConsoleErrorListener;
var ErrorListenerExtend = require('./ErrorListenerExtend');
ErrorListenerExtend(ErrorListener.prototype);

function parse(text, Listener) {
  var chars = new InputStream(text);
  var lexer = new resourcePolicyLexer(chars);
  var tokens = new CommonTokenStream(lexer);
  var parser = new resourcePolicyParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.policy();
  var listener = new Listener();
  var walker = new ParseTreeWalker();
  walker.walk(listener, tree);
  if (parser._listeners[0].errorMsg) {
    //把错误信息放进listener里面
    listener.errorMsg = parser._listeners[0].errorMsg;
    parser._listeners[0].errorMsg = null;
  }

  return listener;
}

function compile(text) {
  var Listener = void 0;
  Listener = require('./JSONGeneratoListener.js');
  return parse(text, Listener);
};

function beautify(text) {
  var Listener = require('./BeautifyListener.js');
  var listener = parse(text, Listener);
  return listener.stringArray.join(' ').replace(/\n\s/g, '\n');
}

exports.beautify = beautify;
exports.compile = compile;