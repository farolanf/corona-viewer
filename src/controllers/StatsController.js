const StatsService = require('../services/StatsService')

/**
 * Get stats.
 * @param {object} req The HTTP request
 * @param {object} res The HTTP response
 */
function * stats (req, res) {
  res.json(yield StatsService.stats())
}

module.exports = {
  stats
}
