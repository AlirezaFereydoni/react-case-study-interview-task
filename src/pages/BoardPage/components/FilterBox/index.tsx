import { Input } from '../../../../components/Input';
import { Select } from '../../../../components/Select';
import { useEffect, useMemo, useState } from 'react';
import { useBoardStore } from '../../../../store/useBoardStore';
import { debounce } from '../../../../utils/debounce';
import { Filter } from '../../../../types';
import styles from './FilterBox.module.css';

interface FilterBoxProps {
  onFilterChange: (filter: Filter) => void;
}

export const FilterBox = ({ onFilterChange }: FilterBoxProps) => {
  const { issues } = useBoardStore();
  const [filter, setFilter] = useState<Filter>({
    search: '',
    assignee: '',
    severity: '',
  });

  const { assigneeOptions, severityOptions } = useMemo(() => {
    return {
      assigneeOptions: Array.from(new Set(issues.map(issue => issue.assignee))).map(assignee => ({
        value: assignee,
        label: assignee,
      })),
      severityOptions: Array.from(new Set(issues.map(issue => issue.severity)))
        .sort((a, b) => a - b)
        .map(severity => ({
          value: severity.toString(),
          label: severity.toString(),
        })),
    };
  }, [issues]);

  useEffect(() => {
    onFilterChange(filter);
  }, [filter]);

  return (
    <div className={styles.container}>
      <Input
        placeholder='Type to search...'
        onChange={debounce(e => setFilter(prev => ({ ...prev, search: e.target.value })), 500)}
      />

      <Select
        placeholder='Select assignee'
        options={assigneeOptions}
        onChange={value => setFilter(prev => ({ ...prev, assignee: value }))}
        value={filter.assignee}
      />

      <Select
        placeholder='Select severity'
        options={severityOptions}
        onChange={value => setFilter(prev => ({ ...prev, severity: value }))}
        value={filter.severity}
      />
    </div>
  );
};

