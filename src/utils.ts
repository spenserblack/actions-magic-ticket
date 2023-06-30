import type {
  IssuesOpenedEvent,
  PullRequestOpenedEvent,
  DiscussionCreatedEvent,
} from "@octokit/webhooks-definitions/schema";

export type EventType = "issue" | "pr" | "discussion";

export class UnknownEventTypeError extends Error {
  constructor(eventName: string) {
    super(`Unknown event type: ${eventName}`);
  }
}

export function getEventType<Raise extends boolean>(ghContext: any, raise: Raise): EventType | (Raise extends true ? never : null) {
  const { eventName } = ghContext;

  switch (eventName) {
    case "issues":
      return "issue";
    case "pull_request":
      return "pr";
    case "discussion":
      return "discussion";
  }
  if (raise) {
    throw new UnknownEventTypeError(eventName);
  }

  return null as never;
}
/**
 * Gets the ID number of the issue, pull request, or discussion that triggered the workflow.
 */
export function getNumber(ghContext: any): number | null {
  const eventType = getEventType(ghContext, false);
  const { payload: pl } = ghContext;

  switch (eventType) {
    case "issue":
      return (pl as IssuesOpenedEvent).issue.number;
    case "pr":
      return (pl as PullRequestOpenedEvent).pull_request.number;
    case "discussion":
      return (pl as DiscussionCreatedEvent).discussion.number;
  }
  return null;
}
