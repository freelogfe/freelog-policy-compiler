const {resourcePolicyListener} = require('@freelog/resource-policy-lang');
let _ = require('underscore');
const ACTIVE_REG = /^<.+>$/

//排列
permute.permArr = [];
permute.usedChars = [];

function permute(input) {
  let i,
    ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    permute.usedChars.push(ch);
    if (input.length == 0) {
      permute.permArr.push(permute.usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    permute.usedChars.pop();
  }
  return permute.permArr
};

//随机的中间态名称
function genRandomStateName(evt1, evt2, evtName) {
  return 'autoGenratedState_' + evt1 + '_' + evt2 + '_' + evtName + '_' + (new Date * Math.random()).toString(36).substring(0, 4);
}


class JSONGeneratoListener extends resourcePolicyListener {
  constructor() {
    super();
    this.errorMsg = null;
    this.policy_segments = [];
  }

  //统一处理segmentblock格式
  formatSegmentBlock() {
    let segment_block = this._segment_block
    var users = {};
    segment_block.users.forEach((info) => {
      users[info.userType] = users[info.userType] || {userType: info.userType, users: []}
      users[info.userType].users.push(info.users)
    })

    segment_block.users = Object.values(users)
    segment_block.all_occured_states = Array.from(segment_block.all_occured_states);
    segment_block.activatedStates = segment_block.all_occured_states.filter((state) => {
      if (ACTIVE_REG.test(state)) {
        return state;
      }
    });
  }

  enterSegment(ctx) {
    let originalInput = ctx.start.getInputStream().strdata;
    let segmentText = originalInput.slice(ctx.start.start, ctx.stop.stop + 1);
    segmentText = segmentText.replace(/[ \t\r\n]+/g, ' ');
    //对应一个segment
    this._segment_block = {
      segmentText: segmentText,
      initialState: '',
      terminateState: 'terminate',
      users: [],
      states: [],//from state 所有启示state
      all_occured_states: new Set(),
      state_transition_table: [],
      activatedStates: []
    };
  };

  exitSegment(ctx) {
    let segment_block = this._segment_block

    this.formatSegmentBlock()
    if (!segment_block.activatedStates.length) {
      this.errorMsg = 'missing activatedStates'
    }

    this.policy_segments.push(segment_block);

    //临时变量
    delete this._segment_block
    delete this._events
    delete this._current_state
  };

  enterUsers(ctx) {
    let segment_block = this._segment_block
    //是否手机或者邮箱地址

    let user = ctx.getText().toLowerCase() || ctx.INTEGER_NUMBER().getText();

    const GROUP_NODE_REG = /^group_node_[a-zA-Z0-9-]+$/;
    const GROUP_USER_REG = /^group_user_[a-zA-Z0-9-]+$/;
    const DOMAIN_REG = /^[a-zA-Z0-9-]{4,24}$/;
    let isGroupNode = GROUP_NODE_REG.test(user);
    let isNode = /nodes/.test(user.toLowerCase());
    let isPublic = /public/.test(user.toLowerCase());
    let isGroupUser = GROUP_USER_REG.test(user);
    let isDomain = DOMAIN_REG.test(user);

    let isSelf = /self/.test(user.toLowerCase());
    if (isGroupNode || isNode || isPublic || isGroupUser) {
      segment_block.users.push({'userType': 'group', users: user})
    } else if (isSelf) {
      segment_block.users.push({'userType': 'individual', users: user})
    } else if (isDomain) {
      segment_block.users.push({'userType': 'domain', users: user})
    } else {
      return this.errorMsg = 'user format is not valid'
    }
  };

  enterCurrent_state_clause(ctx) {
    let segment_block = this._segment_block
    let state = ctx.ID().getText()
    this._current_state = state;
    segment_block.states.push(state);
    segment_block.all_occured_states.add(state);

  };

  enterInitial_state_clause(ctx) {
    let segment_block = this._segment_block
    var state = ctx.children[1].getText();

    segment_block.initialState = state
    this._current_state = state
    segment_block.states.push(state);
    segment_block.all_occured_states.add(state);
  }

  enterTarget_clause(ctx) {
    let segment_block = this._segment_block

    if (ctx.getText().toLowerCase() !== 'terminate') {
      ctx.next_state = ctx.ID().getText();
      segment_block.all_occured_states.add(ctx.next_state);
    }
    //重置event
    this._events = []
  }

  exitTarget_clause(ctx) {
    let segment_block = this._segment_block
    let state_transition = {
      currentState: this._current_state
    };

    if (ctx.next_state) {
      state_transition.nextState = ctx.next_state
    }
    if (this._events.length) {
      state_transition.event = (this._events.length > 1) ? {
        type: 'compoundEvents',
        params: this._events
      } : this._events[0];
    }
    segment_block.state_transition_table.push(state_transition);
  };

  enterPeriod_event(ctx) {
    let timeUnit = ctx.TIMEUNIT().getText();
    this._events.push({
      type: 'period',
      params: [timeUnit],
      eventName: ['period', timeUnit, 'event'].join('_')
    });
  };

  enterSpecific_date_event(ctx) {
    if (ctx.DATE() && ctx.HOUR()) {
      let datePattern = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/; //校验日期
      let hourPattern = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/i; //校验时间，秒为可选
      let date = ctx.DATE().getText();
      let hour = ctx.HOUR().getText();

      if (datePattern.test(date) && hourPattern.test(hour)) {
        this._events.push({
          type: 'arrivalDate',
          params: [1, `${date} ${hour}`],
          eventName: ['arrivalDate_1', date, 'event'].join('_')
        });
      } else {
        this.errorMsg = 'date format error';
        return
      }
    }
  };

  enterRelative_date_event(ctx) {
    let day = Number(ctx.INTEGER_NUMBER().getText());
    let unit = ctx.TIMEUNIT().getText();
    unit = unit.replace(/s$/, '')
    this._events.push({
      type: 'arrivalDate',
      params: [0, day, unit],
      eventName: ['arrivalDate_0', day, unit, 'event'].join('_')
    });
  };

  enterPricing_agreement_event(ctx) {
    this._events.push({
      type: 'pricingAgreement',
      params: [],
      eventName: 'pricingAgreement'
    });
  };

  exitPricing_agreement_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterTransaction_event(ctx) {
    let transactionAmount = Number(ctx.INTEGER_NUMBER().getText());
    let account_id = ctx.ID().getText();

    let REG = /f[0-9a-zA-Z]{14}$/
    if(!REG.test(account_id)) {
          return this.errorMsg = 'FEATHERACCOUNT not valid'
    }

    this._events.push({
      type: 'transaction',
      params: [account_id, transactionAmount],
      eventName: ['transaction', account_id, transactionAmount, 'event'].join('_')
    });
  };

  enterSigning_event(ctx) {
    let tempLicenseIds = ctx.license_resource_id().map((licensId) => {
      return licensId.getText()
    })

    this._events.push({
      type: 'signing',
      params: tempLicenseIds,
      eventName: 'signing_' + tempLicenseIds.join('_')
    });
  };


  enterContract_guaranty(ctx) {
    let amount = ctx.INT()[0].getText();
    let day = ctx.INT()[1].getText();
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'contractGuaranty',
      params: [amount, day, 'day'],
      eventName: 'contractGuaranty_' + amount + '_' + day + '_event'
    });
  };

  enterPlatform_guaranty(ctx) {
    this._events.push({
      type: 'platformGuaranty',
      params: [Number(ctx.INTEGER_NUMBER().getText())],
      eventName: 'platformGuaranty'
    });
  };

  enterSettlement_event(ctx) {
    this._events.push({
      type: 'accountSettled',
      params: []
    });
  };

  enterVisit_increment_event(ctx) {
    this._events.push({
      type: 'accessCountIncrement',
      params: [Number(ctx.INTEGER_NUMBER().getText())]
    });
  };

  enterVisit_event(ctx) {
    this._events.push({
      type: 'accessCount',
      params: [Number(ctx.INTEGER_NUMBER().getText())]
    });
  };

  enterBalance_greater(ctx) {
    this._events.push({type: 'balance_greater_event', params: ctx.INTEGER_NUMBER().getText()});
  }

  enterBalance_smaller(ctx) {
    this._events.push({type: 'balance_smaller_event', params: ctx.INTEGER_NUMBER().getText()});
  }

}

module.exports = JSONGeneratoListener;
