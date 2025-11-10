import { useBoardStore } from '../../store/useBoardStore';
import { Select } from '../../components/Select';
import { Heading, Label } from '../../components/Typography/index';
import styles from './index.module.css';

const POLLING_OPTIONS = [
  { value: '0', label: 'Off' },
  { value: '5000', label: '5 seconds' },
  { value: '10000', label: '10 seconds' },
  { value: '30000', label: '30 seconds' },
  { value: '60000', label: '1 minute' },
  { value: '300000', label: '5 minutes' },
];

export const SettingsPage = () => {
  const { pollingInterval, setPollingInterval } = useBoardStore();

  const handleIntervalChange = (value: string) => {
    setPollingInterval(parseInt(value, 10));
  };

  return (
    <div className={styles.container}>
      <Heading>Settings</Heading>
      <div className={styles.section}>
        <div className={styles.field}>
          <Label>Polling Interval</Label>
        </div>
        <div className={styles.selectContainer}>
          <Select
            options={POLLING_OPTIONS}
            value={pollingInterval.toString()}
            onChange={handleIntervalChange}
            placeholder='Select polling interval'
          />
        </div>
        <p className={styles.helpText}>
          {pollingInterval === 0
            ? 'Polling is disabled. Data will only be fetched once when the page loads.'
            : `Data will be automatically refreshed every ${pollingInterval / 1000} seconds.`}
        </p>
      </div>
    </div>
  );
};
