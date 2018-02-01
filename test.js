var compiler = require('./lib/index.js');
var string1=
`
for nodes :

  in initial :

    proceed to <signing> on transaction of 100 to feth233dbc32069

  in <signing> :

    proceed to activate on accepting license e759419923ea25bf6dff2694391a1e65c21739ce`
var str2 = `
for nodes :
  in initial :
    proceed to <activate> on license e759419923ea25bf6dff2694391a1e65c21739ce
`
   console.log('start gen');
  //  var re = compiler.compile(string1, 'beautify');
   // console.log(re);
  //  var str = re.stringArray.join(' ').replace(/\n\s/g,'\n');
  //  console.log(str);
   var re2 = compiler.compile(string1);
   // console.log(re2.errorMsg);
   // if ( /^mismatched input/.test(re2.errorMsg) ) {
   //   let end = re2.errorMsg.indexOf('expecting');
   //   let result = re2.errorMsg.substring(17, end);
   //   let suggestions = re2.errorMsg.substring(end+10)
   //
   //   console.log(result + 'is not matched, expected inputs are ' + suggestions);
   // }
// console.log(compiler.compile(string1));
// console.log(compiler.compile(string1, 'beautify'));
// console.log('users: ',re2.policy_segments[0].users);
console.log('activatedState', compiler.compile(string1).policy_segments[0].activatedStates);
// console.log('all_occured_states', re2.policy_segments[0].all_occured_states);
// console.log('state_transition_table', re2.policy_segments[0].state_transition_table);
   // console.log(compiler.compile(str8).policy_segments[0].segmentText);
   // let aa  = compiler.compile(str8).policy_segments[0].segmentText
   // console.log(aa);
   // console.log(compiler.compile(str2, 'beautify').stringArray.splice(1).join(' ').replace(/\n\s/g,'\n'));
   // console.log(re2.policy_segments[0].users);
  //  console.log(re2.policy_segments[0].state_transition_table);
  //  console.log(JSON.stringify(re2.policy_segments[0].state_transition_table));

    console.log(compiler.compile(str2, 'beautify').stringArray.splice(1).join(' ').replace(/\n\s/g,'\n'));
