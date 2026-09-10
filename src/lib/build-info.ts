export interface BuildInfo {
  sha: string | null;
  shortSha: string | null;
  builtAt: Date;
  runUrl: string | null;
}

export function getBuildInfo(env: Record<string, string | undefined>, now: Date = new Date()): BuildInfo {
  const sha = env.GITHUB_SHA ?? null;
  const runUrl =
    env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY && env.GITHUB_RUN_ID
      ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`
      : null;
  return { sha, shortSha: sha ? sha.slice(0, 7) : null, builtAt: now, runUrl };
}
