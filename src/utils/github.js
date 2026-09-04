// Thin wrapper around the GitHub Contents API used by the admin page to
// read and write src/principles.json and src/categories.json directly in
// the repo, without needing a build step or a hosted backend.

const OWNER = 'eharpste';
const REPO = 'interactive-principles';
const API_BASE = 'https://api.github.com';

// The branch the admin page reads from and commits to. GitHub Actions
// builds and deploys this branch to GitHub Pages on every push.
export const CONTENT_BRANCH = 'master';

function authHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };
}

function b64EncodeUnicode(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
}

function b64DecodeUnicode(b64) {
    const binary = atob(b64.replace(/\n/g, ''));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

async function parseErrorMessage(res) {
    try {
        const data = await res.json();
        return data.message || `Request failed (${res.status})`;
    } catch {
        return `Request failed (${res.status})`;
    }
}

export async function verifyToken(token) {
    const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}`, {
        headers: authHeaders(token)
    });
    if (!res.ok) {
        throw new Error(await parseErrorMessage(res));
    }
    const data = await res.json();
    const permissions = data.permissions || {};
    if (!permissions.push) {
        throw new Error('This token can read the repo but does not have write access. Use a token with Contents: Read and write permission.');
    }
}

export async function getJsonFile(token, path) {
    const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}?ref=${CONTENT_BRANCH}`, {
        headers: authHeaders(token)
    });
    if (!res.ok) {
        throw new Error(`Failed to load ${path}: ${await parseErrorMessage(res)}`);
    }
    const data = await res.json();
    const text = b64DecodeUnicode(data.content);
    return { value: JSON.parse(text), sha: data.sha };
}

export async function putJsonFile(token, path, value, sha, message) {
    const content = b64EncodeUnicode(JSON.stringify(value, null, 2) + '\n');
    const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}`, {
        method: 'PUT',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            content,
            sha,
            branch: CONTENT_BRANCH
        })
    });
    if (!res.ok) {
        if (res.status === 409) {
            throw new Error(`${path} was changed on GitHub since you loaded it. Reload the admin page and re-apply your edits.`);
        }
        throw new Error(`Failed to save ${path}: ${await parseErrorMessage(res)}`);
    }
    return res.json();
}
