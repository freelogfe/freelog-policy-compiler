var assert = require('assert')
var fs = require('fs-extra')
var path = require('path')
const {diff} = require('deep-diff')
var compiler = require('../src/index.js');
var base = 'test/fixtures'
var compileFixtures = path.join(base, 'compile')


describe('resource-policy-compiler', function () {
  function execJSONCompare(policy, target, done) {
    var result = compiler.compile(policy)
    assert.equal(undefined, diff(result, fs.readJSONSync(path.join(compileFixtures, target))))
    done()
  }

  describe('compile policy', function () {

      /***
      激活状态
    */
    it('missing activatedStates', function (done) {
      var policy = `
            for public  :
    `;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'missing activatedStates')
      done()
    })
    /***
    初始状态
  */
    it('must have initial state', function (done) {
      var policy = `
              for example1  :
                in active:
                  terminate`;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'line 3: mismatched input \'active\' expecting {\'initial\', \'<initial>\', \'init\', \'<init>\'}')
      done()
    })
    /***
    终止状态
  */
    it('expecting proceed to or terminate', function (done) {
      var policy = `
            for public  :
              in initial:
    `;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'line 4: mismatched input \'<EOF>\' expecting {\'proceed to\', TERMINATE}')
      done()
    })
    /***
    terminate状态
  */
    it('terminate state', function (done) {
      var policy = `
            for public  :
              in <initial>:
                terminate
    `;
      execJSONCompare(policy, 'terminate.json', done)
    })

    /***
    用户组
  */
    it('test user group', function (done) {
      var policy = `
            for group_user_5a9f8b22ad98f000220a0317 :
              in <initial> :
                terminate
            for group_user_aaaa :
                in initial :
                  proceed to <signing> on receiving transaction of 100 to feth233dbc32069
                in <signing> :
                  proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
    `;
      execJSONCompare(policy, 'user_group.json', done)
    })
    /***
    节点组
  */
    it('test node group', function (done) {
      var policy = `
            for group_node_5a9f8b22ad98f000220a0317 :
              in <initial> :
                terminate
            for group_node_aaaa :
                in initial :
                  proceed to <signing> on receiving transaction of 100 to feth233dbc32069
                in <signing> :
                  proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
              `;
      execJSONCompare(policy, 'node_group.json', done)
    })
    /***
    用户名-数字字母
  */
    it('node-name-pure-number', function (done) {
      var policy = `
            for example1  :
              in <initial>:
                proceed to <active>  on end of cycle
    `;
    var result = compiler.compile(policy)
    assert.equal(result.errorMsg, null)
    done()
    })
    /***
    用户名-纯数字
  */
    it('node-name-pure-number', function (done) {
      var policy = `
            for 13480111111111  :
              in <initial>:
                proceed to <active>  on end of cycle
    `;
    var result = compiler.compile(policy)
    assert.equal(result.errorMsg, null)
    done()
    })

    /***
    用户名-纯字母
  */
    it('node-name-pure-words', function (done) {
      var policy = `
            for aaaaaaaaa  :
              in <initial>:
                proceed to <active>  on end of cycle
    `;

    var result = compiler.compile(policy)
    assert.equal(result.errorMsg, null)
    done()
    })
    /***
    用户名-纯字母
  */
    it('FEATHERACCOUNT', function (done) {
      var policy = `
            for nodes  :
              in initial:
                proceed to <active> on receiving transaction of 100 to feth233dbc32069
    `;
    var result = compiler.compile(policy)
    assert.equal(result.errorMsg, null)
    done()
    })

    /***
    事件-周期
  */
    it('period_event', function (done) {
      var policy = `
            for public  :
              in <initial>:
                proceed to <active>  on end of cycle
    `;
      execJSONCompare(policy, 'period_event.json', done)
    })

    /***
    事件-交易
  */
    it('transaction_event', function (done) {
      var policy = `
            for public  :
              in initial:
                proceed to <active> on receiving transaction of 100 to feth233dbc32069
    `;
      execJSONCompare(policy, 'transaction_event.json', done)
    })
    /***
    事件-许可
  */
    it('signing_event', function (done) {
      var policy = `
            for public  :
              in initial:
                proceed to <active> on accepting license e759419923ea25bf6dff2694391a1e65c21739ce, e759419923ea25bf6dff2694391a1e65c21739ce
    `;
      execJSONCompare(policy, 'signing_event.json', done)
    })

    /***
    事件-特定时间
  */
    it('specific_date_event', function (done) {
      var policy = `
            for public,self, group_node_aaaa  :
              in initial:
                proceed to <active> at 2000-12-12 23:12:12
    `;

      execJSONCompare(policy, 'specific_date_event.json', done)
    })
    /***
    事件-相对时间
  */
    it('test time unit', function (done) {
      var policy = `
        for public  :
          in <initial>:
            proceed to <active>  after 1 cycle of contract creation
            proceed to <active>  after 2 cycles of contract creation
            proceed to <active>  after 1 day of contract creation
            proceed to <active>  after 3 days of contract creation
            proceed to <active>  after 3 years of contract creation
        `
      execJSONCompare(policy, 'time_unit.json', done)
    })

    /***
    事件-复合
  */
    it('compound Events', function (done) {
      var policy = `
              for public  :
                in initial:
                  proceed to <active>  on receiving transaction of 1999 to feth233dbc32081 and on accepting license e759419923ea25bf6dff2694391a1e65c21739ba
      `;
      execJSONCompare(policy, 'compound_events.json', done)
    })
    /***
    事件-余额小于
  */
    it('balance_smaller_event', function (done) {
      var policy = `
              for public  :
                in <initial>:
                  proceed to <active>  on account_balance smaller than 1000
      `;
      execJSONCompare(policy, 'balance_smaller_event.json', done)
    })
    /***
    事件-余额大于
  */
    it('balance_greater_event', function (done) {
      var policy = `
      for public  :
        in <initial>:
          proceed to <active>  on account_balance greater than 8888
      `;
      execJSONCompare(policy, 'balance_greater_event.json', done)
    })

    /***
    事件-引用增量
  */
    it('visit_increment_event', function (done) {
      var policy = `
              for public  :
                in <initial>:
                  proceed to <active>  on visit_increment of 10000
      `;
      execJSONCompare(policy, 'visit_increment_event.json', done)
    })
    /***
    事件-引用数
  */
    it('visit_event', function (done) {
      var policy = `
              for public  :
                in <initial>:
                  proceed to <active>  on visit of 1000
      `;

      execJSONCompare(policy, 'visit_event.json', done)
    })

    /***
    多个policy-segment
  */
    it('compile multi policy', function (done) {
      var policy = `
        for public :
          in initial :
            proceed to <signing> on receiving transaction of 100 to feth233dbc32069
          in <signing> :
            proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce

        for public :
          in initial :
            proceed to <A> on receiving transaction of 19999 to feth233dbc32081
          in <A> :
            proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ba
          in <B> :
            proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ba
        `
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })


  })



var os = require('os');
nl = os.EOL;
  describe('beautify policy', function () {
    it('beautify single policy', function (done) {
      var policy = `
            for public,nodes  :
                in initial :
                proceed to      <pending> on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
              in <pending> :
                       proceed to   pendingtwo on end of cycle
              in pendingtwo :
                proceed to <pending> on receiving transaction of 100 to feth233dbc320699
    `;

      var result = compiler.beautify(policy);
      assert.equal(result.replace(/\s/g, ""), fs.readFileSync(path.join(base, 'beautify'), 'utf8').replace(/\s/g, ""))
      done()
    })

    it('beautify terminate policy', function (done) {
      var policy = `
            for public  :
              in <initial>:
               TERMINATE
    `;

      var result = compiler.beautify(policy)
      assert.equal(result.replace(/\s/g, ""), fs.readFileSync(path.join(base, 'terminate-beautify'), 'utf8').replace(/\s/g, ""))
      done()
    })

    it('beautify multi policies', function (done) {
      var policy = `
            for nodes :
              in initial :
                proceed to <signing> on receiving transaction of 100 to feth233dbc32069
                proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
              in <signing> :
                proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
                for nodes :
                  in initial :
                    proceed to <signing> on receiving transaction of 100 to feth233dbc32069
                  in <signing> :
                    proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
          `
      var result = compiler.beautify(policy)
      assert.equal(result.replace(/\s/g, ""), fs.readFileSync(path.join(base, 'multi-beautify'), 'utf8').replace(/\s/g, ""))
      done()
    })
  })
});
