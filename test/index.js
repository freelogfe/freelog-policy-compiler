var assert = require('assert')
var fs = require('fs')
var path = require('path')
var compiler = require('../src/index.js');
var base = 'test/fixtures'


describe('resource-policy-compiler', function () {

  describe('compile policy', function () {
    it('missing activatedStates', function (done) {
      var policy = `
            for public  :
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'missing activatedStates')
      done()
    })

    it('must have initial state', function (done) {
      var policy = `
              for public  :
                in active:
                  terminate`;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'line 3: mismatched input \'active\' expecting {\'initial\', \'<initial>\'}')
      done()
    })

    it('expecting proceed to or terminate', function (done) {
      var policy = `
            for public  :
              in initial:
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'line 4: mismatched input \'<EOF>\' expecting {\'proceed to\', TERMINATE}')
      done()
    })

    it('terminate state', function (done) {
      var policy = `
            for public  :
              in <initial>:
                terminate
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })

    it('period_event', function (done) {
      var policy = `
            for public  :
              in <initial>:
                proceed to <active>  on end of cycle
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })


    it('transaction_event', function (done) {
      var policy = `
            for public  :
              in initial:
                proceed to <active> on receiving transaction of 100 to feth233dbc32069
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })

    it('signing_event', function (done) {
      var policy = `
            for public  :
              in initial:
                proceed to <active> on accepting license e759419923ea25bf6dff2694391a1e65c21739ce, e759419923ea25bf6dff2694391a1e65c21739ce
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })


    it('specific_date_event', function (done) {
      var policy = `
            for public,self, group_node_aaaa  :
              in initial:
                proceed to <active> at 2000-12-12 23:12:12
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })

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

    it('group_user and group node', function (done) {
      var policy = `
        for group_user_aaaa :
          in initial :
            proceed to <signing> on receiving transaction of 100 to feth233dbc32069
          in <signing> :
            proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce

        for group_node_aaaa :
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
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })


    it('compound Events', function (done) {
      var policy = `
              for public  :
                in initial:
                  proceed to <active>  on receiving transaction of 1999 to feth233dbc32081 and on accepting license e759419923ea25bf6dff2694391a1e65c21739ba
      `;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })

    it('balance_smaller_event', function (done) {
      var policy = `
              for public  :
                in <initial>:
                  proceed to <active>  on account_balance smaller than 1000
      `;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })

    it('balance_greater_event', function (done) {
      var policy = `
      for public  :
        in <initial>:
          proceed to <active>  on account_balance greater than 8888
      `;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })


    it('visit_increment_event', function (done) {
      var policy = `
              for public  :
                in <initial>:
                  proceed to <active>  on visit_increment of 10000
      `;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })

    it('visit_event', function (done) {
      var policy = `
              for public  :
                in <initial>:
                  proceed to <active>  on visit of 1000
      `;
      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, null)
      done()
    })


  })

//   describe('beautify policy', function () {
//     it('beautify single policy', function (done) {
//       var policy = `
//             for public,nodes  :
//                 in initial :
//                 proceed to      <pending> on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
//               in <pending> :
//                        proceed to   pendingtwo on end of cycle
//               in pendingtwo :
//                 proceed to <pending> on transaction of 100 to feth233dbc320699
//     `;
//
//       var result = compiler.beautify(policy)
//       assert.equal(result, fs.readFileSync(path.join(base, 'beautify'), 'utf8'))
//       done()
//     })
//
//     it('beautify terminate policy', function (done) {
//       var policy = `
//             for public  :
//               in <initial>:
//                TERMINATE
//     `;
//
//       var result = compiler.beautify(policy)
//       assert.equal(result, fs.readFileSync(path.join(base, 'terminate-beautify'), 'utf8'))
//       done()
//     })
//
//     it('beautify multi policies', function (done) {
//       var policy = `
// for nodes :
//   in initial :
//     proceed to <signing> on transaction of 100 to feth233dbc32069
//   in <signing> :
//     proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
//     for nodes :
//       in initial :
//         proceed to <signing> on transaction of 100 to feth233dbc32069
//       in <signing> :
//         proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
// `
//
//       var result = compiler.beautify(policy)
//       assert.equal(result, fs.readFileSync(path.join(base, 'multi-beautify'), 'utf8'))
//       done()
//     })
//   })
});
