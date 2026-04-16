import simpleGit from "simple-git";
import { paths } from "./config-paths";

const git = simpleGit(paths.root);

export interface SyncResult {
  committed: boolean;
  pushed: boolean;
  summary: string;
  files: string[];
}

export async function getStatus() {
  const status = await git.status();
  return {
    modified: status.modified,
    created: status.created,
    deleted: status.deleted,
    isClean: status.isClean(),
  };
}

export async function commitAndPush(message: string): Promise<SyncResult> {
  const status = await git.status();
  const changedFiles = [
    ...status.modified,
    ...status.created,
    ...status.deleted,
    ...status.not_added,
  ];

  if (changedFiles.length === 0) {
    return {
      committed: false,
      pushed: false,
      summary: "No changes to commit",
      files: [],
    };
  }

  await git.add(["-A"]);
  const commit = await git.commit(message);
  await git.push();

  return {
    committed: true,
    pushed: true,
    summary: `Committed ${commit.summary.changes} change(s)`,
    files: changedFiles,
  };
}
