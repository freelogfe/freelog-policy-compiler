'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('@freelog/resource-policy-lang'),
    resourcePolicyListener = _require.resourcePolicyListener;

var _ = require('underscore');
var initialFlag = false;
var domainFlag = false;
var individualFlag = false;
var groupFlag = false;

//排列
permute.permArr = [];
permute.usedChars = [];

function permute(input) {
  var i = void 0,
      ch = void 0;
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
  return permute.permArr;
};

//随机的中间态名称
function genRandomStateName(evt1, evt2, evtName) {
  return 'autoGenratedState_' + evt1 + '_' + evt2 + '_' + evtName + '_' + (new Date() * Math.random()).toString(36).substring(0, 4);
}

var JSONGeneratorExtentionClass = function (_resourcePolicyListen) {
  _inherits(JSONGeneratorExtentionClass, _resourcePolicyListen);

  function JSONGeneratorExtentionClass() {
    _classCallCheck(this, JSONGeneratorExtentionClass);

    var _this = _possibleConstructorReturn(this, (JSONGeneratorExtentionClass.__proto__ || Object.getPrototypeOf(JSONGeneratorExtentionClass)).call(this));

    _this.errorMsg = null;
    _this.policy_segments = [];
    return _this;
  }

  _createClass(JSONGeneratorExtentionClass, [{
    key: 'enterP',
    value: function enterP(ctx) {}
  }, {
    key: 'exitP',
    value: function exitP(ctx) {}
  }, {
    key: 'enterStart_hour',
    value: function enterStart_hour(ctx) {}
  }, {
    key: 'exitStart_hour',
    value: function exitStart_hour(ctx) {}
  }, {
    key: 'enterEnd_hour',
    value: function enterEnd_hour(ctx) {}
  }, {
    key: 'exitEnd_hour',
    value: function exitEnd_hour(ctx) {}
  }, {
    key: 'enterSegment',
    value: function enterSegment(ctx) {
      //对应一个segment
      ctx.segment_block = {
        segmentText: ctx.start.source[0]._input.strdata.slice(ctx.start.start, ctx.stop.stop + 1),
        initialState: '',
        terminateState: 'terminate',
        users: [],
        states: [],
        all_occured_states: [],
        state_transition_table: []
      };
    }
  }, {
    key: 'exitSegment',
    value: function exitSegment(ctx) {
      if (ctx.segment_block.activatedStates == [] || !ctx.segment_block.activatedStates) {
        this.errorMsg = 'missing activatedStates';
      }
      this.policy_segments.push(ctx.segment_block);
      initialFlag = false;
      domainFlag = false;
      individualFlag = false;
      groupFlag = false;
    }
  }, {
    key: 'enterUsers',


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
    value: function enterUsers(ctx) {
      while (ctx.parentCtx) {
        if (ctx.parentCtx.segment_block && ctx.parentCtx.segment_block.users) {
          break;
        }
        ctx.parentCtx = ctx.parentCtx.parentCtx;
      }
      ctx.segment_block = ctx.parentCtx.segment_block;
      //是否手机或者邮箱地址
      var user = ctx.getText().toLowerCase();

      var isGroupNode = /^group_node_[a-zA-Z0-9-]{4,20}$/.test(user);
      var isNode = /nodes/.test(user.toLowerCase());
      var isPublic = /public/.test(user.toLowerCase());
      var isGroupUser = /^group_user_[a-zA-Z0-9-]{4,20}$/.test(user);
      var isDomain = /^[a-zA-Z0-9-]{4,24}$/.test(user);
      var isSelf = /self/.test(user.toLowerCase());
      if (!(isGroupNode || isNode || isPublic || isGroupUser || isDomain || isSelf)) {
        return this.errorMsg = 'user format is not valid';
      }
      if (isGroupNode || isNode || isPublic || isGroupUser) {
        if (!groupFlag) {
          groupFlag = true;
          ctx.segment_block.users.push({ 'userType': 'group', users: [user] });
        } else {
          ctx.segment_block.users.forEach(function (obj) {
            if (obj.userType == 'group') {
              obj.users.push(user);
            }
          });
        }
      } else if (isSelf) {
        if (!individualFlag) {
          individualFlag = true;
          ctx.segment_block.users.push({ 'userType': 'individual', users: [user] });
        } else {
          ctx.segment_block.users.forEach(function (obj) {
            if (obj.userType == 'individual') {
              obj.users.push(user);
            }
          });
        }
      } else if (isDomain) {
        if (!domainFlag) {
          domainFlag = true;
          ctx.segment_block.users.push({ 'userType': 'domain', users: [user] });
        } else {
          ctx.segment_block.users.forEach(function (obj) {
            if (obj.userType == 'domain') {
              obj.users.push(user);
            }
          });
        }
      }
    }
  }, {
    key: 'exitUsers',
    value: function exitUsers(ctx) {
      ctx.parentCtx.segment_block = ctx.segment_block;
    }
  }, {
    key: 'enterState_clause',
    value: function enterState_clause(ctx) {
      ctx.segment_block = ctx.parentCtx.segment_block;
    }
  }, {
    key: 'exitState_clause',
    value: function exitState_clause(ctx) {
      ctx.parentCtx.segment_block = ctx.segment_block;
    }
  }, {
    key: 'enterCurrent_state_clause',
    value: function enterCurrent_state_clause(ctx) {
      ctx.segment_block = ctx.parentCtx.segment_block;
      if (!initialFlag) {
        initialFlag = true;
        ctx.segment_block.initialState = ctx.ID().getText();
      }

      ctx.segment_block.states.push(ctx.ID().getText());
      ctx.segment_block.all_occured_states.push(ctx.ID().getText());
      ctx.segment_block.all_occured_states = _.uniq(ctx.segment_block.all_occured_states);
    }
  }, {
    key: 'exitCurrent_state_clause',
    value: function exitCurrent_state_clause(ctx) {
      ctx.parentCtx.segment_block = ctx.segment_block;
    }
  }, {
    key: 'enterTarget_clause',
    value: function enterTarget_clause(ctx) {

      ctx.segment_block = ctx.parentCtx.segment_block;

      //重置state
      ctx.current_state = ctx.parentCtx.current_state_clause().ID().getText();
      if (ctx.current_state[0] == '<' && ctx.current_state[ctx.current_state.length - 1] == '>') {
        ctx.segment_block.activatedStates = ctx.segment_block.activatedStates || [];
        ctx.segment_block.activatedStates.push(ctx.current_state);
        ctx.segment_block.activatedStates = _.uniq(ctx.segment_block.activatedStates);
      }

      if (ctx.getText().toLowerCase() !== 'terminate') {
        //next_state
        ctx.next_state = ctx.ID().getText();
        //activatedState
        if (ctx.next_state[0] == '<' && ctx.next_state[ctx.next_state.length - 1] == '>') {
          ctx.segment_block.activatedStates = ctx.segment_block.activatedStates || [];
          ctx.segment_block.activatedStates.push(ctx.next_state);
          ctx.segment_block.activatedStates = _.uniq(ctx.segment_block.activatedStates);
        }
      }
      //重置event
      ctx.events = [];
    }
  }, {
    key: 'exitTarget_clause',


    // Exit a parse tree produced by policyParser#target_clause.
    value: function exitTarget_clause(ctx) {
      var state_transition = void 0;
      if (ctx.events.length > 1) {
        state_transition = {
          currentState: ctx.current_state,
          event: {
            type: 'compoundEvents',
            params: ctx.events
          },
          nextState: ctx.next_state
        };
      } else {
        state_transition = {
          currentState: ctx.current_state,
          event: ctx.events[0],
          nextState: ctx.next_state
        };
      }
      ctx.segment_block.state_transition_table.push(state_transition);
      // //生成中间状态
      // let tempCurrent = ctx.current_state;
      // //permute当前events
      // _.each(permute(ctx.events), (orderedEvts) => {
      //   tempCurrent = ctx.current_state;
      //   let path = [];
      //   while (orderedEvts.length != 0) {
      //     let event = orderedEvts.pop();
      //     path.push(event.type);
      //     let randomStateName = genRandomStateName(ctx.current_state, ctx.next_state,path.join('-'));
      //     let state_transition = {
      //       currentState: tempCurrent,
      //       event: event,
      //       nextState: ctx.next_state
      //     };
      //     if (orderedEvts.length != 0) {
      //       state_transition.nextState = randomStateName;
      //       tempCurrent = randomStateName;
      //       ctx.segment_block.all_occured_states.push(randomStateName); //记录同一个起始state下面所有的target state及中间state
      //     }
      //     ctx.segment_block.state_transition_table.push(state_transition);
      //   }
      // });
      //记录同一个curren_state 下的多个target
      if (ctx.next_state) {
        ctx.segment_block.all_occured_states.push(ctx.next_state);
        ctx.segment_block.all_occured_states = _.uniq(ctx.segment_block.all_occured_states);
      }
      //回传
      ctx.parentCtx.segment_block = ctx.segment_block;
    }
  }, {
    key: 'enterEvent',
    value: function enterEvent(ctx) {
      ctx.events = ctx.parentCtx.events;
    }
  }, {
    key: 'exitEvent',
    value: function exitEvent(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterAnd_event',
    value: function enterAnd_event(ctx) {
      ctx.events = ctx.parentCtx.events;
    }
  }, {
    key: 'exitAnd_event',
    value: function exitAnd_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterPeriod_event',
    value: function enterPeriod_event(ctx) {
      var timeUnit = ctx.time_unit().getText();
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'period',
        params: [timeUnit],
        eventName: 'period_' + timeUnit + '_event'
      });
    }
  }, {
    key: 'exitPeriod_event',
    value: function exitPeriod_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterSpecific_date_event',
    value: function enterSpecific_date_event(ctx) {
      var date = ctx.ID().getText();
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'arrivalDate',
        params: [1, date],
        eventName: 'arrivalDate_1_' + date + '_event'
      });
    }
  }, {
    key: 'exitSpecific_date_event',
    value: function exitSpecific_date_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterRelative_date_event',
    value: function enterRelative_date_event(ctx) {
      var day = Number(ctx.INT().getText());
      var unit = ctx.time_unit().getText();
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'arrivalDate',
        params: [0, day, unit],
        eventName: 'arrivalDate_0_' + day + '_' + unit + '_event'
      });
    }
  }, {
    key: 'exitRelative_date_event',
    value: function exitRelative_date_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterPricing_agreement_event',
    value: function enterPricing_agreement_event(ctx) {
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'pricingAgreement',
        params: [tbd],
        eventName: 'pricingAgreement'
      });
    }
  }, {
    key: 'exitPricing_agreement_event',
    value: function exitPricing_agreement_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterTransaction_event',
    value: function enterTransaction_event(ctx) {

      ctx.children.forEach(function (child) {});
      var transactionAmount = Number(ctx.INTEGER_NUMBER().getText());
      var account_id = ctx.FEATHERACCOUNT().getText();

      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'transaction',
        params: [account_id, transactionAmount],
        eventName: 'transaction_' + account_id + '_' + transactionAmount + '_event'
      });
    }
  }, {
    key: 'exitTransaction_event',
    value: function exitTransaction_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterSigning_event',
    value: function enterSigning_event(ctx) {
      ctx.events = ctx.parentCtx.events;
      var tempLicenseIds = [];
      _.each(ctx.license_resource_id(), function (licensId) {
        tempLicenseIds.push(licensId.getText());
      });
      ctx.events.push({
        type: 'signing',
        params: tempLicenseIds,
        eventName: 'signing_' + tempLicenseIds.join('_')
      });
    }
  }, {
    key: 'exitSigning_event',
    value: function exitSigning_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterGuaranty_event',
    value: function enterGuaranty_event(ctx) {
      ctx.events = ctx.parentCtx.events;
    }
  }, {
    key: 'exitGuaranty_event',
    value: function exitGuaranty_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterContract_guaranty',
    value: function enterContract_guaranty(ctx) {
      var amount = ctx.INT()[0].getText();
      var day = ctx.INT()[1].getText();
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'contractGuaranty',
        params: [amount, day, 'day'],
        eventName: 'contractGuaranty_' + amount + '_' + day + '_event'
      });
    }
  }, {
    key: 'exitContract_guaranty',
    value: function exitContract_guaranty(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterPlatform_guaranty',
    value: function enterPlatform_guaranty(ctx) {
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'platformGuaranty',
        params: [Number(ctx.INT().getText())],
        eventName: 'platformGuaranty'
      });
    }
  }, {
    key: 'exitPlatform_guaranty',
    value: function exitPlatform_guaranty(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterSettlement_event',
    value: function enterSettlement_event(ctx) {
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'accountSettled',
        params: []
      });
    }
  }, {
    key: 'exitSettlement_event',
    value: function exitSettlement_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterAccess_count_event',
    value: function enterAccess_count_event(ctx) {
      ctx.events = ctx.parentCtx.events;
    }
  }, {
    key: 'exitAccess_count_event',
    value: function exitAccess_count_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterVisit_increment_event',
    value: function enterVisit_increment_event(ctx) {
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'accessCountIncrement',
        params: [Number(ctx.INT().getText())]
      });
    }
  }, {
    key: 'exitVisit_increment_event',


    // Exit a parse tree produced by policyParser#visit_increment_event.
    value: function exitVisit_increment_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterVisit_event',
    value: function enterVisit_event(ctx) {
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({
        type: 'accessCount',
        params: [Number(ctx.INT().getText())]
      });
    }
  }, {
    key: 'exitVisit_event',
    value: function exitVisit_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterBalance_event',
    value: function enterBalance_event(ctx) {
      ctx.events = ctx.parentCtx.events;
    }
  }, {
    key: 'exitBalance_event',
    value: function exitBalance_event(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterBalance_greater',


    // Enter a parse tree produced by policyParser#balance_greater.
    value: function enterBalance_greater(ctx) {
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({ type: 'balance_smaller_event', params: ctx.getText() });
    }
  }, {
    key: 'exitBalance_greater',
    value: function exitBalance_greater(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterBalance_smaller',
    value: function enterBalance_smaller(ctx) {
      ctx.events = ctx.parentCtx.events;
      ctx.events.push({ type: 'balance_greater_event', params: ctx.getText() });
    }
  }, {
    key: 'exitBalance_smaller',
    value: function exitBalance_smaller(ctx) {
      ctx.parentCtx.events = ctx.events;
    }
  }, {
    key: 'enterTime_unit',
    value: function enterTime_unit(ctx) {}
  }, {
    key: 'exitTime_unit',
    value: function exitTime_unit(ctx) {}
  }, {
    key: 'enterState',
    value: function enterState(ctx) {}
  }, {
    key: 'exitState',
    value: function exitState(ctx) {}
  }, {
    key: 'enterLicense_resource_id',
    value: function enterLicense_resource_id(ctx) {}
  }, {
    key: 'exitLicense_resource_id',
    value: function exitLicense_resource_id(ctx) {}
  }]);

  return JSONGeneratorExtentionClass;
}(resourcePolicyListener);

module.exports = JSONGeneratorExtentionClass;
