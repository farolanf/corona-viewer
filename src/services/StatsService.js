const axios = require('axios')
const _ = require('lodash')
const errors = require('common-errors')

function * stats () {
  let result
  try {
    result = _.extend({},
      yield axios.get('https://api.topcoder.com/v4/looks/1143/run/json')
        .then(res => res.data[0]),
      yield axios.get('https://api.topcoder.com/v4/looks/1145/run/json')
        .then(res => res.data[0]),
      yield axios.get('https://api.topcoder.com/v4/looks/1294/run/json')
        .then(res => res.data[0])
    )
  } catch (e) {
    throw new errors.HttpStatusError(503, 'Stats backend cannot be reached')
  }
  return result
}

module.exports = {
  stats
}
