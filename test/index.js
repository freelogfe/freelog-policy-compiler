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

    it('missing activatedStates', function (done) {
      var policy = `
            for public  :
              in active:
                terminate`;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'missing activatedStates')
      done()
    })

    it('expecting proceed to or terminate', function (done) {
      var policy = `
            for public  :
              in active:
    `;

      var result = compiler.compile(policy)
      assert.equal(result.errorMsg, 'line 4: mismatched input \'<EOF>\' expecting {\'proceed to\', TERMINATE}')
      done()
    })

    it('terminate state', function (done) {
      var policy = `
            for public  :
              in <active>:
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
  })

  describe('beautify policy', function () {
    it('beautify single policy', function (done) {
      var policy = `
            for public,nodes  :
                in initial :
                proceed to      <pending> on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
              in <pending> :
                       proceed to   pendingtwo on end of cycle
              in pendingtwo :
                proceed to <pending> on transaction of 100 to feth233dbc320699
    `;

      var result = compiler.beautify(policy)
      assert.equal(result, fs.readFileSync(path.join(base, 'beautify'), 'utf8'))
      done()
    })

    it('beautify terminate policy', function (done) {
      var policy = `
            for public  :
              in <initial>:
               TERMINATE
    `;

      var result = compiler.beautify(policy)
      assert.equal(result, fs.readFileSync(path.join(base, 'terminate-beautify'), 'utf8'))
      done()
    })

    it('beautify multi policies', function (done) {
      var policy = `
for nodes :
  in initial :
    proceed to <signing> on transaction of 100 to feth233dbc32069
  in <signing> :
    proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
    for nodes :
      in initial :
        proceed to <signing> on transaction of 100 to feth233dbc32069
      in <signing> :
        proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
`

      var result = compiler.beautify(policy)
      assert.equal(result, fs.readFileSync(path.join(base, 'multi-beautify'), 'utf8'))
      done()
    })
  })
});