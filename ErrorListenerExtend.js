function Extend(that) {
  that.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
    this.errorMsg = msg;
  };
}
module.exports = Extend;
