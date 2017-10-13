const policyListener = require('policy_lang').policyListener;
let _ = require('underscore');
let indentLevel = 2

class Beautify extends policyListener {
  constructor() {
    super();
    this.errorMsg = null;
    this.stringArray = [];
    this._nextIndent = ' ';
  }
  addIndent() {
    _.each(_.range(indentLevel), () => {
      this._nextIndent += " ";
    });
  };
  deleteIndent() {
    this._nextIndent = this._nextIndent.slice(0, Number('-' + indentLevel));
  };
  enterSegment(ctx) {
    this.stringArray.push('\n')
    this.stringArray.push('For');
  };
  exitSegment(ctx) {
    this.deleteIndent();
  };

  enterSettlement_clause (ctx) {
      this.stringArray.push('\n')
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  exitSettlement_clause (ctx) {
  };
  enterAudience_clause(ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
  };
  exitAudience_clause(ctx) {
    this.stringArray.push(':');
    this.addIndent();
    this.stringArray.push(this._nextIndent);
  };
  enterState_clause(ctx) {
    this.stringArray.push('\n');
    this.stringArray.push(this._nextIndent);
  };
  enterCurrent_state_clause(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterTarget_clause(ctx) {
    this.stringArray.push('\n');
    this.addIndent();
    this.stringArray.push(this._nextIndent);
    this.stringArray = this.stringArray.concat(['proceed to', ctx.ID().getText(), 'on']);
  };
  exitTarget_clause() {
    this.deleteIndent();
  }
  enterAccepting(ctx) {
    this.stringArray.push('accepting');
  };
  enterAnd_event(ctx) {
    this.stringArray.push('and');
  };
  enterPeriod_event (ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterSpecific_date_event (ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterRelative_date_event (ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterPricing_agreement_event(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterTransaction_event(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterContract_guaranty(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterPlatform_guaranty(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterSigning_event(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterSettlement_event(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterVisit_increment_event(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterVisit_event(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterBalance_greater(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterBalance_smaller(ctx) {
    _.map(ctx.children, (child) => {
      this.stringArray.push(child.getText());
    });
  };
  enterUsers(ctx) {
    for (var i = 0; i < ctx.getChildCount(); i++) {
      this.stringArray.push(ctx.getChild(i).getText());
    }
  };
  enterUser_groups(ctx) {
    this.stringArray.push('users in');
    for (var i = 0; i < ctx.getChildCount(); i++) {
      this.stringArray.push(ctx.getChild(i).getText());
    }
  };
};

module.exports = Beautify
