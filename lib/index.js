'use strict';

var antlr4 = require('antlr4/index');
var policy = require('policy_lang');
var policyLexer = policy.policyLexer;
var policyParser = policy.policyParser;
var _ = require('underscore');

var ErrorListener = require('antlr4/error/ErrorListener').ConsoleErrorListener;
var ErrorListenerExtend = require('./ErrorListenerExtend');
ErrorListenerExtend(ErrorListener.prototype);

var compile = function compile(text) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';

  var extentionClass = require('./JSONGeneratorExtension.js');
  if (target === 'beautify') {
    extentionClass = require('./BeautifyExtension.js');
  }

  var chars = new antlr4.InputStream(text);
  var lexer = new policyLexer(chars);

  var tokens = new antlr4.CommonTokenStream(lexer);
  var parser = new policyParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.p();
  var listener = new extentionClass();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
  if (parser._listeners[0].errorMsg) {
    //把错误信息放进listener里面
    listener.errorMsg = parser._listeners[0].errorMsg;
    parser._listeners[0].errorMsg = null;
  }
  return listener;
};

exports.compile = compile;