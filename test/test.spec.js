'use strict';

const chai = require('chai');
const expect = chai.expect;
const groupBy = require('../index');

describe('Collapse arrays', function() {
  describe('Collapse good array', function() {

    const arr = [
      {
        name: 'Vasya',
        who: 'man',
        money: 100
      },
      {
        name: 'Vasya',
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

    it('One column grouped', function() {
      const result = groupBy(arr, 'who', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);

      const men = result[0];
      expect(men).to.have.all.keys('who', 'money');
      expect(men.who).to.equal('man');
      expect(men.money).to.equal(461);

      const women = result[1];
      expect(women).to.have.all.keys('who', 'money');
      expect(women.who).to.equal('woman');
      expect(women.money).to.equal(295);
    });

    it('Two columns grouped', function() {
      const result = groupBy(arr, 'who,name', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(4);

      const vasya = result[0];
      expect(vasya).to.have.all.keys('who', 'name', 'money');
      expect(vasya.who).to.equal('man');
      expect(vasya.name).to.equal('Vasya');
      expect(vasya.money).to.equal(363);

      expect(result[1]).to.deep.equal({
        who: 'man',
        name: 'Kolya',
        money: 98
      });

      expect(result[2]).to.deep.equal({
        name: 'Katya',
        who: 'woman',
        money: 290
      });

      expect(result[3]).to.deep.equal({
        name: 'Olya',
        who: 'woman',
        money: 5
      });
    });

    it('Without summary columns', function() {
      const result = groupBy(arr, 'who');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);

      expect(result[0]).to.deep.equal({
        who: 'man'
      });

      expect(result[1]).to.deep.equal({
        who: 'woman'
      });
    });
  });

  describe('Collapse bad arrays', function() {
    it('Add digits as strings', function() {
      var badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          who: 'people',
          money: '15'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupBy(badArray, 'who', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);

      expect(result[0]).to.deep.equal({
        who: 'people',
        money: 25
      });

      expect(result[1]).to.deep.equal({
        who: 'animals',
        money: 0
      });
    });

    it('Array with holes in sum cols', function() {
      const badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          who: 'people'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupBy(badArray, 'who', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);

      expect(result[0]).to.deep.equal({
        who: 'people',
        money: 10
      });

      expect(result[1]).to.deep.equal({
        who: 'animals',
        money: 0
      });
    });

    it('Array with holes in grouped cols', function() {
      const badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          money: '16'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupBy(badArray, 'who', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        who: 'people',
        money: 10
      });

      expect(result[1]).to.deep.equal({
        who: undefined,
        money: 16
      });

      expect(result[2]).to.deep.equal({
        who: 'animals',
        money: 0
      });
    });
  });

  describe('Collapse arrays by objects', function() {
    const arr = [
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      },
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 156
      },{
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 11
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      }
    ];

    it('By objects', function() {
      const result = groupBy(arr, 'profile', 'commits');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      });

      expect(result[1]).to.deep.equal({
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 167
      });

      expect(result[2]).to.deep.equal({
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      });
    });

    it('By object with array', function() {
      const result = groupBy(arr, 'who', 'commits');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);

      expect(result[0]).to.deep.equal({
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        commits: 296
      });

      expect(result[1]).to.deep.equal({
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        commits: 271
      });
    });
  });

  describe('Collapse with additional function', function() {
    const arr = [
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      },
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 156
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 11
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      }
    ];

    it('By values of object', function() {
      const fn = (grouped) => {
        return grouped.profile.email;
      };

      const result = groupBy(arr, 'profile', 'commits', fn);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      });

      expect(result[1]).to.deep.equal({
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 167
      });

      expect(result[2]).to.deep.equal({
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      });
    });

    it('By values of object without sum cols', function() {
      const fn = (grouped) => {
        return grouped.profile.email;
      };

      const result = groupBy(arr, 'profile', fn);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        }
      });

      expect(result[1]).to.deep.equal({
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        }
      });

      expect(result[2]).to.deep.equal({
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        }
      });
    });
  });

  describe('Collapse bad arrays', function() {
    const nonNumeric = [
      {
        name: 'a',
        who: 'people',
        money: 10
      },
      {
        name: 'b',
        who: 'people',
        money: 'rer'
      },
      {
        name: 'b',
        who: 'animals',
        money: 'sfsdf'
      }
    ];

    it('Array with non-numeric sum cols', function() {
      const result = groupBy(nonNumeric, 'who', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);

      expect(result[0]).to.deep.equal({
        who: 'people',
        money: 10
      });

      expect(result[1]).to.deep.equal({
        who: 'animals',
        money: 0
      });
    });
  });
});