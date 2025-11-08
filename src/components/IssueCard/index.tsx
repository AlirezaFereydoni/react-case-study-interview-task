import { Chip } from '../Chip';
import { Issue } from '../../types';
import dayjs from 'dayjs';
import { Tag } from '../Tag';
import { Caption, Heading } from '../Typography/index';
import { LabelValue } from '../LabelValue';
import { HtmlHTMLAttributes } from 'react';
import styles from './IssueCard.module.css';
import classNames from 'classnames';

interface IssueCardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  issue: Issue;
}

export const IssueCard = ({ issue, className, ...props }: IssueCardProps) => {
  return (
    <div className={classNames(styles.card, className)} {...props}>
      <Heading>{issue.title}</Heading>
      <div className={styles.grid}>
        <LabelValue label='Assignee' value={issue.assignee} />
        <LabelValue label='Created' value={dayjs(issue.createdAt).format('DD/MM/YYYY')} />
        <LabelValue label='Severity' value={issue.severity.toString()} />
        <div>
          <Chip
            title={issue.priority}
            variant={
              `priority${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}` as
                | 'priorityLow'
                | 'priorityMedium'
                | 'priorityHigh'
            }
          />
        </div>
      </div>

      {issue.tags.length > 0 && (
        <div className={styles.tagsSection}>
          <Caption>Tags:</Caption>
          <div className={styles.tagsContainer}>
            {issue.tags.map((tag, index) => (
              <Tag key={issue.id + index} title={tag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
