## Events
___
### period
##### Pattern: _the end of TIME_UNIT_
##### Sample:  proceed to settlement on **the end of day**
 ```
 {
   type: 'period',
   params: ['day']
 }
 ```
___

 ### specificDate
 ##### Pattern: _date DATE_
 ##### Sample:  proceed to settlement on **date 2012-12-12**
  ```
  {
    type: 'arrivalDate',
    params: ['1', '2012-12-12']
  }
  ```
  ___

  ### relativeDate
  ##### Pattern: _INT TIME_UNIT after contract creation_
  ##### Sample:  proceed to settlement on **10 cycle after contract creation**
   ```
   {
     type: 'arrivalDate',
     params: ['0', '10', 'cycle']
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
    eventName: 'pricingAgreement'
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
    eventName: 'transaction_userid_300'
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
    eventName: 'signing_l123123_l19992'
  }
   ```

   ___

   ### contractGuaranty
   ##### Pattern: _contract_guaranty of INT refund after INT day_
   ##### Sample:  proceed to settlement on **contract_guaranty of 3000 refund after 50 day**
   ```
  {
    type: 'guaranty',
    params: 'contractGuaranty_3000_50_day',
    eventName: 'contractGuaranty'
  }
   ```

   ___

   ### platformGuaranty
   ##### Pattern: _platform_guaranty of INT_
   ##### Sample:  proceed to settlement on **platform_guaranty of 50000**
   ```
  {
    type: 'guaranty',
    params: 'contractGuaranty_50000',
    eventName: 'platformGuaranty'
  }
   ```
