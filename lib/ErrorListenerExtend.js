'use strict';

function Extend(that) {
  that.syntaxError = function (recognizer, offendingSymbol, line, column, msg, e) {
    this.errorMsg = 'line ' + line + ': ' + msg;
  };
}
module.exports = Extend;