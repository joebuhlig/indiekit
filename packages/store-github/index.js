import fs from "node:fs";
import { Buffer } from "node:buffer";
import got from "got";
import octokit from "@octokit/rest";

const defaults = {
  branch: "main",
  lfs: [],
};

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const GithubStore = class {
  constructor(options = {}) {
    this.id = "github";
    this.name = "GitHub store";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { repo, user } = this.options;

    return {
      name: `${user}/${repo} on GitHub`,
      uid: `https://github.com/${user}/${repo}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "user",
        message: "What is your GitHub username?",
      },
      {
        type: "text",
        name: "repo",
        message: "Which repository is your publication stored on?",
      },
      {
        type: "text",
        name: "branch",
        message: "Which branch are you publishing from?",
        initial: defaults.branch,
      },
    ];
  }

  get client() {
    const { Octokit } = octokit;
    return new Octokit({
      auth: `token ${this.options.token}`,
    });
  }

  get lfsServer() {
    return this.options.lfsServer
      ? this.options.lfsServer
      : `https://github.com/${this.options.user}/${this.options.repo}.git/info/lfs/`;
  }

  /**
   * Create file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents}
   */
  async createFile(path, content, message) {
    const extension = path.extname(path);

    if (this.options.lfs.includes(extension)) {
      // Upload file to LFS server
      const version = "https://git-lfs.github.com/spec/v1";
      const oid = "12345678";
      const size = getFilesizeInBytes(content);
      const response = got.post(this.gitLfsServer, {
        headers: {
          Accept: "application/vnd.git-lfs+json",
          "Content-Type": "application/vnd.git-lfs+json",
        },
        responseType: "json",
        json: {
          operation: "upload",
          transfers: ["basic"],
          ref: {
            name: `refs/heads/${this.options.branch}`,
          },
          objects: [{ oid, size }],
        },
      });

      console.log(response);

      content = `version ${version}\noid sha256:${oid}\nsize ${size}`;
    } else {
      content = Buffer.from(content).toString("base64");
    }

    const response = await this.client.repos.createOrUpdateFileContents({
      owner: this.options.user,
      repo: this.options.repo,
      branch: this.options.branch,
      message,
      path,
      content,
    });
    return response;
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-repository-content}
   */
  async readFile(path) {
    const response = await this.client.repos.getContent({
      owner: this.options.user,
      repo: this.options.repo,
      ref: this.options.branch,
      path,
    });
    const content = Buffer.from(response.data.content, "base64").toString(
      "utf8"
    );
    return content;
  }

  /**
   * Update file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents}
   */
  async updateFile(path, content, message) {
    const contents = await this.client.repos
      .getContent({
        owner: this.options.user,
        repo: this.options.repo,
        ref: this.options.branch,
        path,
      })
      .catch(() => false);

    content = Buffer.from(content).toString("base64");
    const response = await this.client.repos.createOrUpdateFileContents({
      owner: this.options.user,
      repo: this.options.repo,
      branch: this.options.branch,
      sha: contents ? contents.data.sha : false,
      message,
      path,
      content,
    });
    return response;
  }

  /**
   * Delete file in a repository
   *
   * @param {string} path Path to file
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#delete-a-file}
   */
  async deleteFile(path, message) {
    const contents = await this.client.repos.getContent({
      owner: this.options.user,
      repo: this.options.repo,
      ref: this.options.branch,
      path,
    });
    const response = await this.client.repos.deleteFile({
      owner: this.options.user,
      repo: this.options.repo,
      branch: this.options.branch,
      sha: contents.data.sha,
      message,
      path,
    });
    return response;
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
};

export default GithubStore;
