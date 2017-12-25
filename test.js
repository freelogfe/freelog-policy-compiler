var compiler = require('./index.js');
var string1=
`For testUser@test.com and users in LoginUser in the following states:
  in initial :
    proceed to signing on accepting transaction of 100 to feth1026f01634a
  in signing:
    proceed to activate on accepting license license_A
  I agree to authorize token in activate`;


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
   // var re2 = compiler.compile(str8,'beautify');
   // console.log(re2);
compiler.compile(string1)
console.log(compiler.compile(string1).policy_segments[0].state_transition_table);
   // console.log(compiler.compile(str8).policy_segments[0].segmentText);
   // let aa  = compiler.compile(str8).policy_segments[0].segmentText
   // console.log(aa);
   // console.log(compiler.compile(aa, 'beautify').stringArray.splice(1).join(' ').replace(/\n\s/g,'\n'));
   // console.log(re2.policy_segments[0].users);
  //  console.log(re2.policy_segments[0].state_transition_table);
  //  console.log(JSON.stringify(re2.policy_segments[0].state_transition_table));

    // console.log(compiler.compile(str8, 'beautify').stringArray.splice(1).join(' ').replace(/\n\s/g,'\n'));
