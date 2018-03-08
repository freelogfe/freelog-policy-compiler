'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('@freelog/resource-policy-lang'),
    resourcePolicyListener = _require.resourcePolicyListener;

var BREAK_SPACE = ' ';

var BeautifyListener = function (_resourcePolicyListen) {
  _inherits(BeautifyListener, _resourcePolicyListen);

  function BeautifyListener() {
    _classCallCheck(this, BeautifyListener);

    var _this = _possibleConstructorReturn(this, (BeautifyListener.__proto__ || Object.getPrototypeOf(BeautifyListener)).call(this));

    _this.stringArray = [];
    return _this;
  }

  _createClass(BeautifyListener, [{
    key: 'pushIndent',
    value: function pushIndent(num) {
      num = num === undefined ? 2 : num;
      this.stringArray.push(BREAK_SPACE.repeat(num));
    }
  }, {
    key: 'pushChildren',
    value: function pushChildren(children) {
      var _this2 = this;

      children.forEach(function (child) {
        _this2.stringArray.push(child.getText());
      });
    }
  }, {
    key: 'enterSegment',
    value: function enterSegment(ctx) {
      this.stringArray.push('for');
    }
  }, {
    key: 'exitSegment',
    value: function exitSegment(ctx) {
      this.stringArray.push('\n');
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
      if (this.stringArray[this.stringArray.length - 1] === ',') {
        this.stringArray.pop();
        this.stringArray.push(':');
      }

      this.stringArray.push('\n');
      this.pushIndent(1);
    }
  }, {
    key: 'enterInitial_state_clause',
    value: function enterInitial_state_clause(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterCurrent_state_clause',
    value: function enterCurrent_state_clause(ctx) {
      this.stringArray.push('\n');
      this.pushIndent(1);
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterTarget_clause',
    value: function enterTarget_clause(ctx) {
      this.stringArray.push('\n');
      this.pushIndent(3);

      if (!checkExist('ID', ctx)) {
        this.stringArray.push(ctx.getText());
      } else {
        this.stringArray = this.stringArray.concat(['proceed to', ctx.ID().getText(), 'on']);
      }
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
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterSpecific_date_event',
    value: function enterSpecific_date_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterRelative_date_event',
    value: function enterRelative_date_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterPricing_agreement_event',
    value: function enterPricing_agreement_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterTransaction_event',
    value: function enterTransaction_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterContract_guaranty',
    value: function enterContract_guaranty(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterPlatform_guaranty',
    value: function enterPlatform_guaranty(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterSigning_event',
    value: function enterSigning_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterSettlement_event',
    value: function enterSettlement_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterVisit_increment_event',
    value: function enterVisit_increment_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterVisit_event',
    value: function enterVisit_event(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterBalance_greater',
    value: function enterBalance_greater(ctx) {
      this.pushChildren(ctx.children);
    }
  }, {
    key: 'enterBalance_smaller',
    value: function enterBalance_smaller(ctx) {
      this.pushChildren(ctx.children);
    }
  }]);

  return BeautifyListener;
}(resourcePolicyListener);

function checkExist(name, ctx) {
  return ctx[name]() !== null;
}

module.exports = BeautifyListener;