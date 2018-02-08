## SAMPLES
1. free policy
```
for public :
  in <initial> :
    terminate
```

2. transaction policy

```
for nodes :
  in initial :
    proceed to <active> on transaction of 100 to feth233dbc32069
```

3. license & transaction policy
```
for nodes :
  in initial :
    proceed to pending on transaction of 100 to feth233dbc32069
  in pending :
    proceed to <active> on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
```

4. period transaction policy
```
for public :
  in initial :
    proceed to <pending> on accepting license e759419923ea25bf6dff2694391a1e65c21739ce
  in <pending> :
    proceed to pendingtwo on end of cycle
  in pendingtwo :
    proceed to <pending> on transaction of 100 to feth233dbc320699
```

## Events
___
### period
##### Grammar: _end of TIME_CYCLE_
##### Sample:  proceed to settlement on **end of day**
 ```
 {
   type: 'period',
   params: ['cycle'],
   eventName: 'period_day_event'
 }
 ```
___

 ### specificDate
 ##### Grammar: _date DATE_
 ##### Sample:  proceed to settlement on **date 2012-12-12**
  ```
  {
    type: 'arrivalDate',
    params: ['1', '2012-12-12'],
    eventName: 'arrivalDate_1_2012-12-12_event'
  }
  ```
  ___

  ### relativeDate
  ##### Grammar: _INT TIME_UNIT after contract creation_
  ##### Sample:  proceed to settlement on **10 day after contract creation**
   ```
   {
     type: 'arrivalDate',
     params: ['0', '10', 'day'],
     eventName: 'arrivalDate_0_10_day_event'
   }
   ```
   ___

   ### pricingAgreement
   ##### Grammar: _pricingAgreement_
   ##### Sample:  proceed to settlement on **pricingAgreement**
   ```
  {
    type: 'pricingAgreement',
    params: [],
    eventName: 'pricingAgreement_event'
  }
   ```
   ___

   ### transaction
   ##### Grammar: _transaction of INT to FEATHERACCOUNT_
   ##### Sample:  proceed to settlement on ** transaction of 300 to feth233dbc32069**
   ```
  {
    type: 'transaction',
    params: ['userId', 300],
    eventName: 'transaction_userid_300_event'
  }
   ```

   ___

   ### signing
   ##### Grammar: _license LICENSEID_
   ##### Sample:  proceed to settlement on ** accepting license e759419923ea25bf6dff2694391a1e65c21739ce, e7594199435jh3jhasf1ff2694391a1e65c21739ce**
   ```
  {
    type: 'signing',
    params: ['e759419923ea25bf6dff2694391a1e65c21739ce', 'e7594199435jh3jhasf1ff2694391a1e65c21739ce'],
    eventName: 'signing_l123123_l19992_event'
  }
   ```

   ___

   ### contractGuaranty
   ##### Grammar: _contract_guaranty of INT refund after INT day_
   ##### Sample:  proceed to settlement on **contract_guaranty of 3000 refund after 50 day**
   ```
  {
    type: 'contractGuaranty',
    params: [3000, 50, 'day'],
    eventName: 'contractGuaranty_3000_50_day_event'
  }
   ```

   ___

   ### platformGuaranty
   ##### Grammar: _platform_guaranty of INT_
   ##### Sample:  proceed to settlement on **platform_guaranty of 50000**
   ```
  {
    type: 'platformGuaranty',
    params: [5000],
    eventName: 'platformGuaranty_5000_event'
  }
   ```

   ### compoundEvent
   ##### Grammar: compoundEvents
   ##### Sample:  proceed to settlement on **platform_guaranty of 50000 and contract_guaranty of 3000 refund after 50 day**
   ```
  {
    type: 'compound',
    params: [  {
        type: 'contractGuaranty',
        params: [3000, 50, 'day'],
        eventName: 'contractGuaranty_3000_50_day_event'
      },
      {
        type: 'platformGuaranty',
        params: [5000],
        eventName: 'platformGuaranty_5000_event'
      }],
    eventName: 'compound_event'
  }
   ```
