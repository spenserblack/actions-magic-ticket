import { renderString as renderInternal } from "nunjucks";
import { getNumber } from "./utils";

export class MessageFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageFailedError";
  }
}

export function render(message: string, ghContext: any): string {
  // NOTE A bit redundant, but a bit more testable.

  // NOTE See https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
  const { actor } = ghContext;
  const number = getNumber(ghContext);
  if (number === null) {
    throw new MessageFailedError(
      `Unable to determine issue, pull request, or discussion number.`,
    );
  }
  return renderInternal(message, { actor, number });
}
