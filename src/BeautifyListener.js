const {
  resourcePolicyListener
} = require('@freelog/resource-policy-lang');
const BREAK_SPACE = ' '

class BeautifyListener extends resourcePolicyListener {
  constructor() {
    super();
    this.stringArray = [];
  }

  pushIndent(num) {
    num = (num === undefined) ? 2 : num
    this.stringArray.push(BREAK_SPACE.repeat(num))
  }

  pushChildren(children) {
    children.forEach((child) => {
      this.stringArray.push(child.getText());
    })
  }

  enterSegment(ctx) {
    this.stringArray.push('for');
  }

  exitSegment(ctx) {
    this.stringArray.push('\n');
  }

  enterUsers(ctx) {
    this.stringArray.push(ctx.getText());
    this.stringArray.push(',');
  }

  enterState_clause(ctx) {
    if (this.stringArray[this.stringArray.length - 1] === ',') {
      this.stringArray.pop();
      this.stringArray.push(':')
    }

    this.stringArray.push('\n');
    this.pushIndent(1)
  }

  enterCurrent_state_clause(ctx) {
    this.pushChildren(ctx.children)
  }

  enterTarget_clause(ctx) {
    this.stringArray.push('\n');
    this.pushIndent(3);

    if (!checkExist('ID', ctx)) {
      this.stringArray.push(ctx.getText())
    } else {
      this.stringArray = this.stringArray.concat(['proceed to', ctx.ID().getText(), 'on']);
    }
  }

  enterAccepting(ctx) {
    this.stringArray.push('accepting');
  }

  enterAnd_event(ctx) {
    this.stringArray.push('and on');
  }

  enterPeriod_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterSpecific_date_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterRelative_date_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterPricing_agreement_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterTransaction_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterContract_guaranty(ctx) {
    this.pushChildren(ctx.children)
  }

  enterPlatform_guaranty(ctx) {
    this.pushChildren(ctx.children)
  }

  enterSigning_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterSettlement_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterVisit_increment_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterVisit_event(ctx) {
    this.pushChildren(ctx.children)
  }

  enterBalance_greater(ctx) {
    this.pushChildren(ctx.children)
  }

  enterBalance_smaller(ctx) {
    this.pushChildren(ctx.children)
  }
}

function checkExist(name, ctx) {
  return (ctx[name]() !== null)
}

module.exports = BeautifyListener
