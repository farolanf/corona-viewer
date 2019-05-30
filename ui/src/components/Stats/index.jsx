import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import humanNumber from 'human-number';

import { SERVER_URL, API_VERSION } from '../../config';
import styles from './styles.scss';

const formatNumber = num => humanNumber(num, n => Number.parseFloat(n).toFixed(2));

const Stats = ({ userCount, challengeCount, prizes }) => (
  <div className={styles.Stats}>
    <div className={styles.statistic}>
      <strong>{formatNumber(userCount)}</strong>
      <small>MEMBERS</small>
    </div>
    <div className={styles.statistic}>
      <strong>{formatNumber(challengeCount)}</strong>
      <small>CHALLENGES</small>
    </div>
    <div className={styles.statistic}>
      <strong>{`$${formatNumber(prizes)}`}</strong>
      <small>IN PRIZES // LAST 7 DAYS</small>
    </div>
  </div>
);

Stats.defaultProps = {
  userCount: 0,
  challengeCount: 0,
  prizes: 0,
};

Stats.propTypes = {
  userCount: PropTypes.number,
  challengeCount: PropTypes.number,
  prizes: PropTypes.number,
};

const StatsContainer = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get(`${SERVER_URL}${API_VERSION}/stats`).then(res => setStats(res.data));
  }, []);

  return (
    <Stats
      userCount={stats['user.count']}
      challengeCount={stats['challenge.count']}
      prizes={stats['user_payment.gross_amount']}
    />
  );
};

export default StatsContainer;
