export const mockFetch = <T>(path: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        import(`../data/${path}.json`).then(module => resolve(module.default));
      } catch (error) {
        reject(new Error('Failed to fetch data'));
      }
    }, 500);
  });
};

export const mockUpdateIssue = (issueId: string, updates: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        resolve({ id: issueId, ...updates });
      } else {
        reject(new Error('Failed to update issue'));
      }
    }, 500);
  });
};
