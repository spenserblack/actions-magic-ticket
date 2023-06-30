import { readFileSync } from "fs";
import { resolve } from "path";
import { getEventType } from "./utils";
import { getOctokit } from "@actions/github";

export type Octokit = ReturnType<typeof getOctokit>;

const getDiscussionQuery = readFileSync(
  resolve(__dirname, "../queries/GetDiscussion.graphql"),
  "utf8",
);
type DiscussionQueryResponse = {
  repository: {
    discussion: {
      id: string;
    };
  };
};
const postDiscussionCommentMutation = readFileSync(
  resolve(__dirname, "../queries/PostDiscussionComment.graphql"),
  "utf8",
);

export default class Api {
  constructor(
    private readonly octokit: Octokit,
    public readonly owner: string,
    public readonly repo: string,
  ) {}

  private async postIssueComment(number: number, body: string): Promise<void> {
    // NOTE This also works for pull requests, apparently.
    await this.octokit.rest.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: number,
      body,
    });
  }

  private async postDiscussionComment(number: number, body: string): Promise<void> {
    const discussionResponse = (await this.octokit.graphql(getDiscussionQuery, {
      owner: this.owner,
      repo: this.repo,
      number,
    })) as DiscussionQueryResponse;
    const {
      repository: {
        discussion: { id },
      },
    } = discussionResponse;

    await this.octokit.graphql(postDiscussionCommentMutation, {
      id,
      body,
    });
  }

  public async postComment(
    ghContext: any,
    number: number,
    body: string,
  ): Promise<void> {
    const eventType = getEventType(ghContext, true);

    switch (eventType) {
      case "issue":
      case "pr":
        await this.postIssueComment(number, body);
        return;
      case "discussion":
        await this.postDiscussionComment(number, body);
        return;
    }
  }
}
