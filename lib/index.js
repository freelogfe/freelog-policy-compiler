'use strict';

var _require = require('@freelog/resource-policy-lang'),
    resourcePolicyLangLexer = _require.resourcePolicyLangLexer,
    resourcePolicyLangParser = _require.resourcePolicyLangParser;

var _require2 = require('antlr4/index'),
    InputStream = _require2.InputStream,
    CommonTokenStream = _require2.CommonTokenStream;

var _require3 = require('antlr4/tree'),
    ParseTreeWalker = _require3.ParseTreeWalker;

var ErrorListener = require('antlr4/error/ErrorListener').ConsoleErrorListener;
var ErrorListenerExtend = require('./ErrorListenerExtend');
ErrorListenerExtend(ErrorListener.prototype);

var compile = function compile(text) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';

  var Listener = require('./JSONGeneratorExtension.js');
  if (target === 'beautify') {
    Listener = require('./BeautifyExtension.js');
  }

  var chars = new InputStream(text);
  var lexer = new resourcePolicyLangLexer(chars);
  var tokens = new CommonTokenStream(lexer);
  var parser = new resourcePolicyLangParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.policy();
  var listener = new Listener();
  var walker = new ParseTreeWalker();
  walker.walk(listener, tree);
  // antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
  if (parser._listeners[0].errorMsg) {
    //把错误信息放进listener里面
    listener.errorMsg = parser._listeners[0].errorMsg;
    parser._listeners[0].errorMsg = null;
  }
  return listener;
};

exports.compile = compile;