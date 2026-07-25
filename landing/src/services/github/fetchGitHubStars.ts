/** Fetches the live stargazers_count from GitHub's REST API for "owner/repo". */
const CACHE_KEY_PREFIX = 'github_stars_cache_';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 час — совпадает с окном лимита GitHub API

export async function fetchGitHubStars(repoPath: string): Promise<number | null> {
  const cleanRepo = repoPath
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\/$/, '')
      .trim();

  if (!cleanRepo || !cleanRepo.includes('/')) return null;

  const cacheKey = `${CACHE_KEY_PREFIX}${cleanRepo}`;

  // Отдаём закэшированное значение, если оно не старше часа — не тратим лимит запросов.
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { stars: number; timestamp: number };
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.stars;
      }
    }
  } catch {
    // повреждённый кэш — просто игнорируем и идём за свежими данными
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${cleanRepo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const stars = typeof data.stargazers_count === 'number' ? data.stargazers_count : null;

    if (stars !== null) {
      localStorage.setItem(cacheKey, JSON.stringify({ stars, timestamp: Date.now() }));
    }

    return stars;
  } catch {
    return null;
  }
}