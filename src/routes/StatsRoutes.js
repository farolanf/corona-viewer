/**
 * Stats API Routes
 */

module.exports = {
  '/stats': {
    get: {
      controller: 'StatsController',
      method: 'stats'
    }
  }
}
