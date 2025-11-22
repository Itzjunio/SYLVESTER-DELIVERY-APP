'use strict';

var ExpeditiousEngine = require('expeditious').ExpeditiousEngine;

module.exports = function () {

  // This is our cache storage object
  var data = {};


  // Create an engine that inherts from ExpeditiousEngine
  var engine = Object.create(ExpeditiousEngine.prototype);


  /**
   * Set the given key-value pair with the given expire time
   * @param {String}   key
   * @param {String}   val
   * @param {Number}   expire
   * @param {Function} callback
   */
  engine.set = function (key, val, expire, callback) {
    // We need to store entries as Objects to track expiry etc.
    data[key] = {
      val: val,
      expire: Date.now() + expire,
      timer: setTimeout(
        engine.del.bind(
          engine,
          key,
          function noop (/* err */) {}
        ),
        expire
      )
    };

    setImmediate(function () {
      callback(null, null);
    });
  };

  /**
   * Get the value for a specific key from the cache
   * @param  {String}   key
   * @param  {Function} callback
   */
  engine.get = function (key, callback) {
    setImmediate(function () {
      if (data[key]) {
        callback(null, data[key].val);
      } else {
        callback(null, null);
      }
    });
  };

  /**
   * Delete the given key-value pair from the cache
   * @param  {String}   key
   * @param  {Function} callback
   */
  engine.del = function (key, callback) {
    var entry = data[key];

    /* istanbul ignore else  */
    if (entry) {
      delete data[key];
      clearTimeout(entry.timer);
    }

    setImmediate(function () {
      callback(null, null);
    });
  };

  /**
   * Return keys matching the provided pattern
   * @param  {Function} callback
   */
  engine.keys = function (callback) {
    setImmediate(function () {
      callback(null, Object.keys(data));
    });
  };

  /**
   * Returns the milliseconds left before the given key expires
   * @param  {String}   key
   * @param  {Function} callback
   */
  engine.ttl = function (key, callback) {
    var entry = data[key]
      , ret = null;

    if (entry) {
      ret = entry.expire - Date.now();
    }

    setImmediate(function () {
      callback(null, ret);
    });
  };

  /**
   * Delete all cache entries
   * @param  {Function} callback
   */
  engine.flush = function (ns, callback) {
    data = {};

    if (typeof ns === 'function') {
      callback = ns;
      ns = null;
    }

    setImmediate(function () {
      callback(null, null);
    });
  };

  return engine;
};
