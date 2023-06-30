import type {
  IssuesOpenedEvent,
  PullRequestOpenedEvent,
  DiscussionCreatedEvent,
} from "@octokit/webhooks-definitions/schema";

/**
 * Gets the ID number of the issue, pull request, or discussion that triggered the workflow.
 */
export function getNumber(ghContext: any): number | null {
  const { payload: pl, eventName } = ghContext;

  switch (eventName) {
    case "issues":
      return (pl as IssuesOpenedEvent).issue.number;
    case "pull_request":
      return (pl as PullRequestOpenedEvent).pull_request.number;
    case "discussion":
      return (pl as DiscussionCreatedEvent).discussion.number;
  }
  return null;
}
