const antlr4 = require('antlr4/index');
const policy = require('policy_lang');
const policyLexer = policy.policyLexer;
const policyParser = policy.policyParser
const _ = require('underscore');

const ErrorListener = require('antlr4/error/ErrorListener').ConsoleErrorListener;
const ErrorListenerExtend = require('./ErrorListenerExtend');
ErrorListenerExtend(ErrorListener.prototype);

var compile = function (text, target='json'){
  let extentionClass = require('./JSONGeneratorExtension.js');
  if (target === 'beautify') {
    extentionClass = require('./BeautifyExtension.js');
  }

  let chars = new antlr4.InputStream(text);
  let lexer = new policyLexer(chars);

  let tokens  = new antlr4.CommonTokenStream(lexer);
  let parser = new policyParser(tokens);
  parser.buildParseTrees = true;
  let tree = parser.p();
  let listener = new extentionClass();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
  if( parser._listeners[0].errorMsg ) {
    //把错误信息放进listener里面
    listener.errorMsg =  parser._listeners[0].errorMsg;
  }
  return listener;
};

exports.compile = compile;
