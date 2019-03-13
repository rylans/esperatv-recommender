'use strict';

function FluentRecommenderQuery(catalog)  {
  this.catalog = catalog;
  this.limit = -1;
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
