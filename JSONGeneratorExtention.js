const policy = require('policy_lang');
const policyListener = policy.policyListener;
let _ = require('underscore');
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
function genRandomStateName(evt1, evt2,evtName) {
  return 'autoGenratedState_'+evt1+'_'+evt2+'_'+evtName+'_'+(new Date * Math.random()).toString(36).substring(0, 4);
};

class JSONGeneratorExtentionClass extends policyListener {
  constructor() {
    super();
    this.errorMsg = null;
    this.policy_segments = [];
  }

  enterP(ctx) {};
  exitP(ctx) {};
  enterStart_hour(ctx) {};
  exitStart_hour(ctx) {};

  enterEnd_hour(ctx) {};
  exitEnd_hour(ctx) {};

  enterSegment(ctx) {
    //对应一个segment
    ctx.segment_block = {
      initialState : 'initial',
      teminateState : 'terminate',
      users: [], //暂时只有两种user，个人的和组的
      states: [],
      all_occured_states: [],
      state_transition_table: []
    };
  };
  exitSegment(ctx) {
      // this.policy_segments.push(ctx.segment_block);
  };
  // 留给下简化版
  // enterSettlement_clause (ctx) {};
  // exitSettlement_clause (ctx) {
  //   //settlement事件
  //   let settlementForward = {
  //     type: 'settlementForward',
  //     params: [3, 'day'],
  //     eventName: 'settlementForward_3_day'
  //   };
  //   let accountSettled = {
  //     type: 'accountSettled',
  //     params: [],
  //     eventName: 'accountSettled'
  //   };
  //   //列出所有token states
  //   let tokenStates = _.reduce( ctx.ID(), (x, y)=> {
  //     return x.concat(y.getText())
  //   }, []);
  //   //获取对应的segment
  //   let segment = this.policy_segments[this.policy_segments.length-1];
  //   //检查tokens staets 是否已经出现,并且暂存一起来，如果pass验证，那么就concat进去了
  //   let tempStates = [];
  //   let statesOccured = _.every(tokenStates, (el)=> {
  //     tempStates.push({
  //       currentState: el,
  //       event: settlementForward,
  //       nextState: 'settlement'
  //     });
  //     tempStates.push({
  //       currentState: 'settlement',
  //       event: accountSettled,
  //       nextState: el
  //     });
  //     return _.contains(segment.all_occured_states, el);
  //   });
  //   // //针对当前segment加入结算事件
  //   if ( statesOccured ) {
  //     Array.prototype.push.apply(this.policy_segments[this.policy_segments.length-1].state_transition_table, tempStates);
  //   }
  // };
  enterAudience_clause(ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
  };
  exitAudience_clause(ctx) {
    ctx.parentCtx.segment_block = ctx.segment_block;
  };
  enterAthorize_token_clause (ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
    ctx.segment_block.activatedStates = [];
    _.each( ctx.ID(), (state)=>{
        ctx.segment_block.activatedStates.push(state.getText());
    })
  };

  exitAthorize_token_clause (ctx) {
    this.policy_segments.push(ctx.segment_block);
  };

  enterAudience_individuals_clause(ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
    ctx.userObj = {};
    ctx.userObj.userType = 'individuals';
  };
  exitAudience_individuals_clause(ctx) {
    ctx.segment_block.users.push(ctx.userObj);
    ctx.parentCtx.segment_block = ctx.segment_block;
  };

  enterAudience_groups_clause(ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
    ctx.userObj = {};
    ctx.userObj.userType = 'groups';
  };
  exitAudience_groups_clause(ctx) {
    ctx.segment_block.users.push(ctx.userObj);
    ctx.parentCtx.segment_block = ctx.segment_block;
  };

  enterState_clause(ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
  };
  exitState_clause(ctx) {
    ctx.parentCtx.segment_block = ctx.segment_block;
  };

  enterCurrent_state_clause(ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
    ctx.segment_block.states.push(ctx.ID().getText());
    ctx.segment_block.all_occured_states.push(ctx.ID().getText());
    ctx.segment_block.all_occured_states = _.uniq(ctx.segment_block.all_occured_states);
  };
  exitCurrent_state_clause(ctx) {
    ctx.parentCtx.segment_block = ctx.segment_block;
  };

  enterTarget_clause(ctx) {
    ctx.segment_block = ctx.parentCtx.segment_block;
    //重置state
    ctx.current_state = ctx.parentCtx.current_state_clause().ID().getText();
    //next_state
    ctx.next_state = ctx.ID().getText();
    //重置event
    ctx.events = [];
  };

  // Exit a parse tree produced by policyParser#target_clause.
  exitTarget_clause(ctx) {
    //生成中间状态
    let tempCurrent = ctx.current_state;
    //permute当前events
    _.each(permute(ctx.events), (orderedEvts) => {
      tempCurrent = ctx.current_state;
      let path = [];
      while (orderedEvts.length != 0) {
        let event = orderedEvts.pop();
        path.push(event.type);
        let randomStateName = genRandomStateName(ctx.current_state, ctx.next_state,path.join('-'));
        let state_transition = {
          currentState: tempCurrent,
          event: event,
          nextState: ctx.next_state
        };
        if (orderedEvts.length != 0) {
          state_transition.nextState = randomStateName;
          tempCurrent = randomStateName;
          ctx.segment_block.all_occured_states.push(randomStateName); //记录同一个起始state下面所有的target state及中间state
        }
        ctx.segment_block.state_transition_table.push(state_transition);
      }
    });
    //记录同一个curren_state 下的多个target
    ctx.segment_block.all_occured_states.push(ctx.next_state);
    ctx.segment_block.all_occured_states = _.uniq(ctx.segment_block.all_occured_states);
    //回传
    ctx.parentCtx.segment_block = ctx.segment_block;
  };

  enterEvent(ctx) {
    ctx.events = ctx.parentCtx.events;
  };
  exitEvent(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterAnd_event(ctx) {
    ctx.events = ctx.parentCtx.events;
  };
  exitAnd_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };
  enterPeriod_event (ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'period',
      params: [ctx.time_unit().getText()]
    });
  };
  exitPeriod_event (ctx) {
    ctx.parentCtx.events = ctx.events;
  };
  enterSpecific_date_event (ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'arrivalDate',
      params: ['1', ctx.DATE().getText()]
    });
  };
  exitSpecific_date_event  (ctx) {
    ctx.parentCtx.events = ctx.events;
  };
  enterRelative_date_event (ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'arrivalDate',
      params: ['0', ctx.INT().getText(), ctx.time_unit().getText()]
    });
  };
  exitRelative_date_event (ctx) {
    ctx.parentCtx.events = ctx.events;
  };
  enterPrice_event(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'pricingAgreement',
      params:'tbd',
      eventName: 'pricingAgreement'
    });
  };
  exitPrice_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterTransaction_event(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'transaction',
      params: ['userId', ctx.INT().getText()],
      eventName: 'transaction_userid_'+ctx.INT().getText()
    });
  };
  exitTransaction_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterSigning_event(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'signing',
      params: [ctx.license_resource_id()[0].getText()],
      eventName: 'signing_'+ctx.license_resource_id()[0].getText()
    });
  };
  exitSigning_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterGuaranty_event(ctx) {
    ctx.events = ctx.parentCtx.events;
  };
  exitGuaranty_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterContract_guaranty(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'guarantyEvent',
      params: 'tbd',
      eventName: 'tbd'
    });
  };
  exitContract_guaranty(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterPlatform_guaranty(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'platformGuaranty',
      params: [ctx.INT().getText()]
    });
  };
  exitPlatform_guaranty(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterSettlement_event(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'accountSettled',
      params:[]
    });
  };
  exitSettlement_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterAccess_count_event(ctx) {
    ctx.events = ctx.parentCtx.events;
  };
  exitAccess_count_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterVisit_increment_event(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'accessCountIncrement',
      params: [ctx.INT().getText()]
    });
  };

  // Exit a parse tree produced by policyParser#visit_increment_event.
  exitVisit_increment_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterVisit_event(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({
      type: 'accessCount',
      params: [ctx.INT().getText()]
    });
  };
  exitVisit_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterBalance_event(ctx) {
    ctx.events = ctx.parentCtx.events;
  };
  exitBalance_event(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  // Enter a parse tree produced by policyParser#balance_greater.
  enterBalance_greater(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({type: 'balance_smaller_event', params: ctx.getText()});
  };
  exitBalance_greater(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterBalance_smaller(ctx) {
    ctx.events = ctx.parentCtx.events;
    ctx.events.push({type: 'balance_greater_event', params: ctx.getText()});
  };
  exitBalance_smaller(ctx) {
    ctx.parentCtx.events = ctx.events;
  };

  enterTime_unit(ctx) {};
  exitTime_unit(ctx) {};

  enterState(ctx) {};
  exitState(ctx) {};

  enterLicense_resource_id(ctx) {};
  exitLicense_resource_id(ctx) {};

  enterUsers(ctx) {
    //继承
    ctx.userObj = ctx.parentCtx.userObj;
    //新增users
    ctx.userObj.users = ctx.userObj.users || [];
    for (var i = 0; i < ctx.getChildCount(); i++) {
      if (ctx.getChild(i).getText() != ',') {
        //修改
        ctx.userObj.users.push(ctx.getChild(i).getText());
      }
    }
  };
  exitUsers(ctx) {
    //回传
    ctx.parentCtx.userObj = ctx.userObj;
  };

  enterUser_groups(ctx) {
    //继承
    ctx.userObj = ctx.parentCtx.userObj;
    //新增users
    ctx.userObj.users = ctx.userObj.users || [];
    for (var i = 0; i < ctx.getChildCount(); i++) {
      if (ctx.getChild(i).getText() != ',') {
        ctx.userObj.users.push(ctx.getChild(i).getText());
      }
    }
  };
  exitUser_groups(ctx) {
    //回传
    ctx.parentCtx.userObj = ctx.userObj;
  };

};

module.exports = JSONGeneratorExtentionClass;
