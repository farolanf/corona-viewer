/**
 * This file defines helper methods
 */
const co = require('co')
const _ = require('lodash')
const config = require('config')
const logger = require('./logger')

const cacheDateSpan = 24 * 60 * 60 * 1000 * Number(config.CACHED_EVENTS_MAX_DAYS_BACK + 1) // cache events of one more day since ui clients have different local timezones

/**
 * Get the min date elegible to cache
 * @returns {Number} min date in milliseconds
 */
function getMinDate () {
  return Date.now() - cacheDateSpan
}

/**
 * Get kafka options.
 * @returns {Object} kafka options
 */
function getKafkaOptions () {
  const options = { connectionString: config.KAFKA_URL, groupId: config.KAFKA_GROUP_ID }
  logger.info(`KAFKA Options - ${JSON.stringify(options)}`)

  if (config.KAFKA_CLIENT_CERT && config.KAFKA_CLIENT_CERT_KEY) {
    options.ssl = { cert: config.KAFKA_CLIENT_CERT, key: config.KAFKA_CLIENT_CERT_KEY }
  }

  return options
}

/**
 * Wrap generator function to standard express function
 * @param {Function} fn The generator function
 * @return {Function} The wrapped function
 */
function wrapExpress (fn) {
  return function wrap (req, res, next) {
    co(fn(req, res, next)).catch(next)
  }
}

/**
 * Wrap all generators in object/array.
 * @param {object|Array|Function} obj The object (controller exports)
 * @return {object|Array|Function} The wrapped object
 */
function autoWrapExpress (obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress)
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'GeneratorFunction') {
      return wrapExpress(obj)
    }
    return obj
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value)
  })
  return obj
}

module.exports = {
  getKafkaOptions,
  getMinDate,
  wrapExpress,
  autoWrapExpress
}
