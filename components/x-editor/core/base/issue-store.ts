import type { ParserIssue } from "../types/parser.type";

class ParserIssueStore {
  private issues: ParserIssue[] = [];
  private maxIssues: number = 1000; // Prevent unbounded growth

  add(issue: ParserIssue) {
    if (this.issues.length >= this.maxIssues) {
      this.issues.shift(); // Remove oldest issue
    }
    this.issues.push({
      ...issue,
    });
  }

  clear(filters?: {
    type?: "error" | "warning";
    fromTimestamp?: number;
    parseId?: string;
    code?: string;
  }) {
    if (!filters) {
      this.issues = [];
      return;
    }

    this.issues = this.issues.filter(
      (issue) =>
        (filters.type && issue.type !== filters.type) ||
        (filters.code && issue.code !== filters.code),
    );
  }

  query(filters?: {
    type?: "error" | "warning";
    fromTimestamp?: number;
    parseId?: string;
    code?: string;
  }) {
    if (!filters) return [...this.issues];

    return this.issues.filter(
      (issue) =>
        (!filters.type || issue.type === filters.type) &&
        (!filters.code || issue.code === filters.code),
    );
  }

  stats() {
    const byType = {
      error: 0,
      warning: 0,
    };
    const byCodes: Record<string, number> = {};

    for (const issue of this.issues) {
      byType[issue.type]++;
      byCodes[issue.code] = (byCodes[issue.code] || 0) + 1;
    }

    return {
      total: this.issues.length,
      byType,
      byCodes,
    };
  }
}

export default ParserIssueStore;
