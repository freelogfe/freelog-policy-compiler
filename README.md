## Events
___
### period
##### Pattern: _the end of TIME_UNIT_
##### Sample:  proceed to settlement on **the end of day**
 ```
 {
   type: 'period',
   params: ['day'],
   eventName: 'period_day_event'
 }
 ```
___

 ### specificDate
 ##### Pattern: _date DATE_
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
  ##### Pattern: _INT TIME_UNIT after contract creation_
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
   ##### Pattern: _pricingAgreement_
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
   ##### Pattern: _transaction of INT to owner_
   ##### Sample:  proceed to settlement on ** transaction of 300 to owner**
   ```
  {
    type: 'transaction',
    params: ['userId', 300],
    eventName: 'transaction_userid_300_event'
  }
   ```

   ___

   ### signing
   ##### Pattern: _license LICENSEID_
   ##### Sample:  proceed to settlement on ** license l12312, l19992**
   ```
  {
    type: 'signing',
    params: ['l123123', 'l19992'],
    eventName: 'signing_l123123_l19992_event'
  }
   ```

   ___

   ### contractGuaranty
   ##### Pattern: _contract_guaranty of INT refund after INT day_
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
   ##### Pattern: _platform_guaranty of INT_
   ##### Sample:  proceed to settlement on **platform_guaranty of 50000**
   ```
  {
    type: 'platformGuaranty',
    params: [5000],
    eventName: 'platformGuaranty_5000_event'
  }
   ```

   ### compoundEvent
   ##### Pattern: compoundEvents
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
