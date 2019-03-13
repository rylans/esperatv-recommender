'use strict';

function similarity(kw1, kw2) {
  if ([] === kw1 || [] === kw2) return 0;

  var intersection = kw1.filter(v => kw2.includes(v));

  var obj = {};
  for(var i=0; i < kw1.length; i++) obj[kw1[i]] = kw1[i];
  for(var i=0; i < kw2.length; i++) obj[kw2[i]] = kw2[i];

  var union = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) union.push(obj[k]);
  }
  return intersection.length / union.length;
}

function FluentRecommenderQuery(catalog)  {
  this.catalog = catalog;
  this.limit = -1;
}

FluentRecommenderQuery.prototype.forRelated = function(relatedTitle) {
  if ('' === relatedTitle) return [];

  var kw = [];
  for (var i=0; i < this.catalog.length; i++) {
    if (relatedTitle == this.catalog[i].name) {
      kw = this.catalog[i].keywords;
    }
  }
  if ([] === kw) return [];
  var outputSet = [];

  for(var i=0; i < this.catalog.length; i++) {
    if (relatedTitle == this.catalog[i].name) continue;
    var keywords = this.catalog[i].keywords;
    var sim = similarity(kw, keywords);
    var movieClone = JSON.parse(JSON.stringify(this.catalog[i]));
    movieClone.similarity = sim; // sort by this
    outputSet.push(movieClone);
  }

  outputSet.sort(function(a,b) {
    return b.similarity - a.similarity;
  });

  if (this.limit > 0) return outputSet.slice(0, this.limit);
  return outputSet;
}

FluentRecommenderQuery.prototype.forQuery = function(queryString) {
  if ('' === queryString) return this.catalog;

  var outputSet = [];
  for (var i=0; i < this.catalog.length; i++) {
    for(var j=0; j < this.catalog[i].keywords.length; j++) {
      if (queryString == this.catalog[i].keywords[j]) {
	outputSet.push(this.catalog[i]);
      }
    }
  }

  if (this.limit > 0) return outputSet.slice(0, this.limit);
  return outputSet;
}

FluentRecommenderQuery.prototype.setLimit = function(n) {
  this.limit = n;
}

function Recommender(catalog) {
  if (!(this instanceof Recommender)) return new Recommender(catalog);
  this.catalog = catalog || [];
}

Recommender.prototype.limit = function(n) {
  var query = new FluentRecommenderQuery(this.catalog);
  query.setLimit(n);
  return query;
}

module.exports = Recommender;
