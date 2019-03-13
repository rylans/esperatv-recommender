var assert = require('assert');

const rec = require('.')

const catalog = [
  {name: 'movie 1', keywords: ['comedy', 'action', 'spielberg']},
  {name: 'movie 2', keywords: ['romantic', 'gosling', 'dicaprio', 'spielberg']},
];

describe('Recommender', function () {
  it ('should recommend catalog for empty string query', function() {
    const recommender = rec(catalog);
    var out = recommender.limit(-1).forQuery('');
    assert.equal(out.length, 2);
    assert.equal(out[1].name, 'movie 2');
  });

  it ('should recommend nothing for zero matches', function() {
    const recommender = rec(catalog);
    var out = recommender.limit(10).forQuery('no-such-keyword-exists');
    assert.equal(out.length, 0);
  });

  it ('should recommend movie 1', function() {
    const recommender = rec(catalog);
    var out = recommender.limit(10).forQuery('comedy');
    assert.equal(out.length, 1);
    assert.equal(out[0].name, 'movie 1');
  });

  it ('should recommend movie 2', function() {
    const recommender = rec(catalog);
    var out = recommender.limit(10).forQuery('dicaprio');
    assert.equal(out.length, 1);
    assert.equal(out[0].name, 'movie 2');
  });

  it ('should recommend movie 1 and 2', function() {
    const recommender = rec(catalog);
    var out = recommender.limit(10).forQuery('spielberg');
    assert.equal(out.length, 2);
    assert.equal(out[0].name, 'movie 1');
    assert.equal(out[1].name, 'movie 2');
  });

});
