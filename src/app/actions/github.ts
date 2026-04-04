'use server';

export interface RepoData {
  name: string;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  default_branch: string;
  owner_avatar: string;
  html_url: string;
  files: Array<{
    path: string;
    type: 'blob' | 'tree';
    size?: number;
  }>;
}

export async function fetchRepoData(url: string): Promise<RepoData> {
  // Simple URL parsing: https://github.com/owner/repo
  const cleanUrl = url.replace(/\/$/, '').replace(/\.git$/, '');
  const parts = cleanUrl.split('/');
  const repo = parts.pop();
  const owner = parts.pop();

  if (!owner || !repo) {
    throw new Error('Invalid GitHub URL structure.');
  }

  // Fetch Metadata
  const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // In Phase 2, we should include GITHUB_TOKEN here
    }
  });

  if (!metaRes.ok) {
    if (metaRes.status === 404) throw new Error('Repository not found.');
    if (metaRes.status === 403) throw new Error('GitHub API rate limit exceeded.');
    throw new Error('Failed to fetch repository metadata.');
  }

  const meta = await metaRes.json();

  // Fetch Tree (Top-level only for now to keep it fast)
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${meta.default_branch}?recursive=1`, {
    next: { revalidate: 3600 },
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    }
  });

  let files = [];
  if (treeRes.ok) {
    const treeData = await treeRes.json();
    files = treeData.tree.slice(0, 50); // Limit to top 50 entries
  }

  return {
    name: meta.name,
    full_name: meta.full_name,
    description: meta.description || 'No description provided.',
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    language: meta.language || 'Unknown',
    default_branch: meta.default_branch,
    owner_avatar: meta.owner.avatar_url,
    html_url: meta.html_url,
    files: files.map((f: any) => ({
      path: f.path,
      type: f.type === 'tree' ? 'tree' : 'blob',
      size: f.size
    })),
  };
}
