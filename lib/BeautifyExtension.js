'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var policyListener = require('policy_lang').policyListener;
var _ = require('underscore');
var indentLevel = 2;

var Beautify = function (_policyListener) {
  _inherits(Beautify, _policyListener);

  function Beautify() {
    _classCallCheck(this, Beautify);

    var _this = _possibleConstructorReturn(this, (Beautify.__proto__ || Object.getPrototypeOf(Beautify)).call(this));

    _this.errorMsg = null;
    _this.stringArray = [];
    _this._nextIndent = ' ';
    return _this;
  }

  _createClass(Beautify, [{
    key: 'addIndent',
    value: function addIndent() {
      var _this2 = this;

      _.each(_.range(indentLevel), function () {
        _this2._nextIndent += " ";
      });
    }
  }, {
    key: 'deleteIndent',
    value: function deleteIndent() {
      this._nextIndent = this._nextIndent.slice(0, Number('-' + indentLevel));
    }
  }, {
    key: 'enterSegment',
    value: function enterSegment(ctx) {
      this.stringArray.push('\n');
      this.stringArray.push('for');
    }
  }, {
    key: 'exitSegment',
    value: function exitSegment(ctx) {
      this.deleteIndent();
    }
  }, {
    key: 'enterUsers',
    value: function enterUsers(ctx) {
      this.stringArray.push(ctx.getText());
      this.stringArray.push(',');
    }
  }, {
    key: 'enterState_clause',
    value: function enterState_clause(ctx) {
      if (this.stringArray[this.stringArray.length - 1] == ',') {
        this.stringArray.pop();
        this.stringArray.push(':');
      }
      this.stringArray.push('\n');
      this.stringArray.push(this._nextIndent);
    }
  }, {
    key: 'enterCurrent_state_clause',
    value: function enterCurrent_state_clause(ctx) {
      var _this3 = this;

      _.map(ctx.children, function (child) {
        _this3.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterTarget_clause',
    value: function enterTarget_clause(ctx) {
      this.stringArray.push('\n');
      this.addIndent();
      this.stringArray.push(this._nextIndent);
      if (ctx.getText().toLowerCase() == 'terminate') {
        this.stringArray = this.stringArray.concat([ctx.getText()]);
      } else {
        this.stringArray = this.stringArray.concat(['proceed to', ctx.ID().getText(), 'on']);
      }
    }
  }, {
    key: 'exitTarget_clause',
    value: function exitTarget_clause() {
      this.deleteIndent();
    }
  }, {
    key: 'enterAccepting',
    value: function enterAccepting(ctx) {
      this.stringArray.push('accepting');
    }
  }, {
    key: 'enterAnd_event',
    value: function enterAnd_event(ctx) {
      this.stringArray.push('and on');
    }
  }, {
    key: 'enterPeriod_event',
    value: function enterPeriod_event(ctx) {
      var _this4 = this;

      _.map(ctx.children, function (child) {
        _this4.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterSpecific_date_event',
    value: function enterSpecific_date_event(ctx) {
      var _this5 = this;

      _.map(ctx.children, function (child) {
        _this5.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterRelative_date_event',
    value: function enterRelative_date_event(ctx) {
      var _this6 = this;

      _.map(ctx.children, function (child) {
        _this6.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterPricing_agreement_event',
    value: function enterPricing_agreement_event(ctx) {
      var _this7 = this;

      _.map(ctx.children, function (child) {
        _this7.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterTransaction_event',
    value: function enterTransaction_event(ctx) {
      var _this8 = this;

      _.map(ctx.children, function (child) {
        _this8.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterContract_guaranty',
    value: function enterContract_guaranty(ctx) {
      var _this9 = this;

      _.map(ctx.children, function (child) {
        _this9.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterPlatform_guaranty',
    value: function enterPlatform_guaranty(ctx) {
      var _this10 = this;

      _.map(ctx.children, function (child) {
        _this10.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterSigning_event',
    value: function enterSigning_event(ctx) {
      var _this11 = this;

      _.map(ctx.children, function (child) {
        console.log('child', child.getText());
        _this11.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterSettlement_event',
    value: function enterSettlement_event(ctx) {
      var _this12 = this;

      _.map(ctx.children, function (child) {
        _this12.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterVisit_increment_event',
    value: function enterVisit_increment_event(ctx) {
      var _this13 = this;

      _.map(ctx.children, function (child) {
        _this13.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterVisit_event',
    value: function enterVisit_event(ctx) {
      var _this14 = this;

      _.map(ctx.children, function (child) {
        _this14.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterBalance_greater',
    value: function enterBalance_greater(ctx) {
      var _this15 = this;

      _.map(ctx.children, function (child) {
        _this15.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterBalance_smaller',
    value: function enterBalance_smaller(ctx) {
      var _this16 = this;

      _.map(ctx.children, function (child) {
        _this16.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterAthorize_token_clause',
    value: function enterAthorize_token_clause(ctx) {
      var _this17 = this;

      this.stringArray.push('\n');
      this.stringArray.push(this._nextIndent);
      _.map(ctx.children, function (child) {
        _this17.stringArray.push(child.getText());
      });
    }
  }]);

  return Beautify;
}(policyListener);

;

module.exports = Beautify;