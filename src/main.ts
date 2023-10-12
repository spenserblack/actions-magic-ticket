import * as core from "@actions/core";
import Api from "./api";
import { getNumber } from "./utils";
import { getOctokit, context } from "@actions/github";
import { render } from "./message";

const token = core.getInput("token", { required: true });
const message = core.getInput("message", { required: true });
const regex = new RegExp(core.getInput("regex", { required: true }));

async function run(): Promise<void> {
  const number = getNumber(context);
  if (number === null) {
    core.setFailed("Unable to determine issue, pull request, or discussion number.");
    return;
  }
  if (!regex.test(number.toString(10))) {
    core.debug(`Number ${number} does not match regex ${regex}`);
    return;
  }
  const comment = render(message, context);
  const octokit = getOctokit(token);
  const api = new Api(octokit, context.repo.owner, context.repo.repo);
  await api.postComment(context, number, comment);
}

run();
