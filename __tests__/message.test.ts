import { describe, expect, test } from "@jest/globals";
import { render, MessageFailedError } from "../src/message";

describe("render", () => {
  test("renders a message", () => {
    const ghContext = {
      actor: "octocat",
      eventName: "issues",
      payload: {
        issue: {
          number: 100,
        },
      },
    };

    const message = render(
      "Congratulations @{{ actor }} on submitting issue #{{ number }}! :tada:",
      ghContext,
    );
    expect(message).toBe("Congratulations @octocat on submitting issue #100! :tada:");
  });

  test("throws an error if the number cannot be determined", () => {
    const ghContext = {
      actor: "octocat",
      eventName: "foo",
    };

    expect(() => render("", ghContext)).toThrowError(MessageFailedError);
  });
});
