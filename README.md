# group-by-with-sum
Collapses an array of objects at the specified object properties

```bash
npm install group-by-with-sum
```

```js
const groupBy = require('groupByWithSum');

const arr = [
  { name: 'Vasya', who: 'man', money: 100 },
  { name: 'Vasya', who: 'man', money: 263 },
  { name: 'Kolya', who: 'man', money: 98 },
  { name: 'Katya', who: 'woman', money: 290 },
  { name: 'Olya', who: 'woman', money: 5 }
];

const whoWithMoney = groupBy(arr, 'who', 'money');
/* [
    { who: 'man', money: 461 },
    { who: 'woman', money: 295 }
  ]
*/ 

const whoNameWithMoney = groupBy(arr, 'who,name', 'money');
/* [
    { who: 'man', name: 'Vasay', money: 363 },
    { who: 'man', name: 'Kolya', money: 98 },
    { who: 'woman', name: 'Katya', money: 290 },
    { who: 'woman', name: 'Olya', money: 5 }
  ]
*/ 
```

#### Without summary props
```js
const who = groupBy(arr, 'who');
// [{ who: 'man', who: 'woman' }]
```

### Coercion str to num

```js
const badArray = [
    { name: 'a', who: 'people', money: '10' },
    { name: 'b', who: 'people', money: '15' },
    { name: 'b', who: 'animals', money: '0' }
  ];

const result = groupBy(badArray, 'who', 'money');
/* [
    { who: 'people', money: 25 },
    { who: 'animals', money: 0 }
  ]
*/
```

### Array with holes in sum props

```js
const badArray = [
    { name: 'a', who: 'people', money: '10' },
    { name: 'b', who: 'people' },
    { name: 'b', who: 'animals', money: '0' }
];

const result = groupBy(badArray, 'who', 'money');
/* [
    { who: 'people', money: 10 },
    { who: 'animals', money: 0 }
  ]
*/
```

### Array with holes in grouped props

```js
const badArray = [
    { name: 'a', who: 'people', money: '10' },
    { name: 'b', money: '16' },
    { name: 'b', who: 'animals', money: '0' }
];

const result = groupBy(badArray, 'who', 'money');
/* [
    { who: 'people', money: 10 },
    { who: undefined, money: 16 },
    { who: 'animals', money: 0 }
  ]
*/
```

### Collapse arrays by objects

```js
const arr = [
      {
        who: { role: 'dev', access: [ 'dev' ] },
        profile: { name: 'vasya', email: 'vasyq@domen.com' },
        commits: 140
      },
      {
        who: { role: 'dev', access: [ 'dev' ] },
        profile: { name: 'kolya', email: 'kolya@domen.com' },
        commits: 156
      },
      {
        who: { role: 'main', access: [ 'dev', 'master' ] },
        profile: { name: 'kolya', email: 'kolya@domen.com' },
        commits: 11
      },
      {
        who: { role: 'main', access: [ 'dev', 'master' ] },
        profile: { name: 'gg', email: 'gg@domen.com' },
        commits: 260
      }
    ];

const result = groupBy(arr, 'profile', 'commits');
/* [
    {
      profile: { name: 'vasya', email: 'vasyq@domen.com' },
      commits: 140
    },
    {
      profile: { name: 'kolya', email: 'kolya@domen.com' },
      commits: 167
    },
    {
      profile: { name: 'gg', email: 'gg@domen.com' },
      commits: 260
    }
  ]
*/
```

### With additional function

```js
 const fn = (grouped) => {
   return grouped.profile.email;
 };

 const result = groupBy(arr, 'profile', 'commits', fn);
 /* [
      {  
        profile: { name: 'vasya', email: 'vasyq@domen.com' },
        commits: 140
      },
      {
        profile: { name: 'kolya', email: 'kolya@domen.com' },
        commits: 167
      },
      {
        profile: { name: 'gg', email: 'gg@domen.com' },
        commits: 260
      }
    ]
*/
 
```