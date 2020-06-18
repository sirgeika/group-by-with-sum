'use strict';

const chai = require('chai');
const expect = chai.expect;
const groupBy = require('../index');

const arr = [
  {
    name: 'Vasya',
    who: 'man',
    money: 100
  },
  {
    name: 'Petya',
    who: 'man',
    money: 263
  },
  {
    name: 'Kolya',
    who: 'man',
    money: 98
  },
  {
    name: 'Katya',
    who: 'woman',
    money: 290
  },
  {
    name: 'Olya',
    who: 'woman',
    money: 5
  }
];

describe('Collapse simple array', function() {
  it('One column grouped', function() {
    const result = groupBy(arr, 'who', 'money');

    expect(result).to.be.an('array');
    expect(result.length).to.equal(2);

    const men = result[0];
    expect(men).to.not.have.property('name');
    expect(men).to.have.property('who');
    expect(men).to.have.property('money');
    expect(men.who).to.equal('man');
    expect(men.money).to.equal(461);

    const women = result[1];
    expect(women).to.not.have.property('name');
    expect(women).to.have.property('who');
    expect(women).to.have.property('money');
    expect(women.who).to.equal('woman');
    expect(women.money).to.equal(295);
  });
});