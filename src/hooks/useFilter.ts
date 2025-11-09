import { useEffect, useState } from 'react';
import { Filter, Issue } from '../types';
import { sortIssuesByPriority } from '../utils/priority';

interface UseFilterProps {
  issues: Issue[];
}

export const useFilter = ({ issues }: UseFilterProps) => {
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setFilteredIssues(sortIssuesByPriority(issues));
  }, [issues]);

  const onFilter = (params: Filter) => {
    let filteredIssues = [...issues];

    if (params.search) {
      filteredIssues = filteredIssues.filter(
        issue =>
          issue.title.toLowerCase().includes(params.search.toLowerCase()) ||
          issue.tags.some(tag => tag.toLowerCase().includes(params.search.toLowerCase()))
      );
    }
    if (params.assignee) {
      filteredIssues = filteredIssues.filter(issue => issue.assignee === params.assignee);
    }
    if (params.severity) {
      filteredIssues = filteredIssues.filter(issue => issue.severity === Number(params.severity));
    }

    filteredIssues = sortIssuesByPriority(filteredIssues);

    setFilteredIssues(filteredIssues);
  };

  return {
    filteredIssues,
    onFilter,
  };
};
