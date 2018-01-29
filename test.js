var compiler = require('./lib/index.js');
var string1=
`for 123-123, self :
  in initial :
    terminate`
var str2 = `
  for 13480125810,13480125811@123.com,nodes, group_user_abc :
    in <initial>:
      TERMINATE
`

    var str8 = `For testUser@test.com and users in LoginUser in the following states:
    in initial :
      proceed to activatetwo on accepting transaction of 100 to feth1026f01634a
    I agree to authorize token in activatetwo  For testUser@test.com and users in LoginUser in the following states:
    in initial :
      proceed to activatetwo on accepting license licenseA , licenseB
        proceed to activatetwo on accepting license licenseA , licenseB
    I agree to authorize token in activatetwo                     For testUser@test.com and users in LoginUser in the following states:
    in initial :
      proceed to activatetwo on accepting license licenseA , licenseB
        proceed to activatetwo on accepting license licenseA , licenseB
    I agree to authorize token in activatetwo`
   console.log('start gen');
  //  var re = compiler.compile(string1, 'beautify');
   // console.log(re);
  //  var str = re.stringArray.join(' ').replace(/\n\s/g,'\n');
  //  console.log(str);
   var re2 = compiler.compile(string1);
   console.log(re2);
// console.log(compiler.compile(string1));
// console.log(compiler.compile(string1, 'beautify'));
console.log('users: ',re2.policy_segments[0].users);
// console.log('activatedState', compiler.compile(str2).policy_segments[0].activatedStates);
// console.log('all_occured_states', re2.policy_segments[0].all_occured_states);
// console.log('state_transition_table', re2.policy_segments[0].state_transition_table);
   // console.log(compiler.compile(str8).policy_segments[0].segmentText);
   // let aa  = compiler.compile(str8).policy_segments[0].segmentText
   // console.log(aa);
   // console.log(compiler.compile(str2, 'beautify').stringArray.splice(1).join(' ').replace(/\n\s/g,'\n'));
   // console.log(re2.policy_segments[0].users);
  //  console.log(re2.policy_segments[0].state_transition_table);
  //  console.log(JSON.stringify(re2.policy_segments[0].state_transition_table));

    console.log(compiler.compile(string1, 'beautify').stringArray.splice(1).join(' ').replace(/\n\s/g,'\n'));
