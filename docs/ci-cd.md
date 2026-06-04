# CI/CD

This repo ships a static portfolio site as a container image. CircleCI builds and
verifies the image, pushes it to GHCR pinned by `sha256` digest, and — after a
manual approval — SSHes the digest to the VPS, where a forced-command script
pulls and restarts the Compose stack.

The full pipeline lives in [`.circleci/config.yml`](../.circleci/config.yml); the
server-side deploy script is [`deploy/deploy.sh`](../deploy/deploy.sh).

## Pipeline stages

| Stage | Branch | What it does |
|-------|--------|--------------|
| `verify` | all | Builds the image, runs it on `127.0.0.1:3001:8080`, waits for `/healthz`, runs `scripts/smoke.py`, and asserts no secret-like content is baked into `/usr/share/nginx/html`. |
| `build_and_push` | **main only** | Logs in to GHCR, builds `:$CIRCLE_SHA1` + `:latest`, pushes both, and records the resulting `RepoDigests[0]` to `image-digest.txt`. |
| `hold` | **main only** | `type: approval` — a **manual gate that blocks every production deploy**. Nothing reaches `deploy` until a human approves it in the CircleCI UI. |
| `deploy` | **main only** | Registers the `rwinter-deploy@VPS` key, pins the VPS host key from `VPS_KNOWN_HOSTS`, and runs `ssh rwinter-deploy@5.78.144.63 "$DIGEST"`. |

Workflow ordering: `verify -> build_and_push -> hold -> deploy`. Only `main`
builds, pushes, or deploys; on every other branch the pipeline stops after
`verify`. The `hold` approval gates **every** production deploy.

## One-time CircleCI setup

1. **Connect the project.** In CircleCI, *Projects -> Set Up Project* for
   `RealRogerWinter/rwinter-dev-portfolio`, choosing the existing `.circleci/config.yml`.

2. **Create context `ghcr-push`** (*Organization Settings -> Contexts*) with two
   env vars used by `build_and_push`:
   - `GHCR_USER` — the GHCR machine-user login (see below).
   - `GHCR_TOKEN` — that machine user's classic PAT, `write:packages` **only**.

3. **Create context `deploy`** with one env var used by `deploy`:
   - `VPS_KNOWN_HOSTS` — base64 of the VPS host key, so SSH host verification is
     pinned rather than blindly trusted. Produce it on the VPS and paste the output:

     ```bash
     ssh-keyscan -t ed25519 5.78.144.63 | base64 -w0
     ```

     The `deploy` job decodes it with `echo "$VPS_KNOWN_HOSTS" | base64 -d >> ~/.ssh/known_hosts`.

4. **Add the deploy SSH key.** The keypair is **already generated on the VPS** and
   the `rwinter-deploy` user's `authorized_keys` already holds the public half (see
   "Server-side deploy target"). Under *Project Settings -> SSH Keys -> Add SSH
   Key*, set Hostname `5.78.144.63` and paste the **private** key, retrieved on the
   VPS with:

   ```bash
   sudo cat /root/secrets/circleci-deploy-key
   ```

   Its fingerprint is already wired into `.circleci/config.yml`:

   ```yaml
   - add_ssh_keys:
       fingerprints:
         - "64:02:15:67:16:06:56:f4:a5:27:8c:5b:3b:cc:cb:7a"
   ```

   After importing the key into CircleCI, remove the server-side copy
   (`sudo shred -u /root/secrets/circleci-deploy-key`); the public half in
   `authorized_keys` is all the VPS needs.

No secrets live in the repo or in `config.yml` — only context names and a key
fingerprint reference.

## GHCR machine user

Do **not** push images with a personal admin PAT. Instead:

1. Create a dedicated GitHub **bot account** (e.g. `realrogerwinter-ci`) and give
   it write access to the package/repo — or, to move fast, mint the token below on
   your own account; just keep its scope minimal.
2. Mint a **classic** Personal Access Token scoped to `write:packages` **only**
   (this implies `read:packages`). Never grant `repo`, `delete:packages`, or admin
   scopes. (The existing broad `ghp_` admin PAT must not be reused here.)
3. Put the login in `GHCR_USER` and the token in `GHCR_TOKEN` in the `ghcr-push`
   context. The `build_and_push` job uses them for:

   ```bash
   echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
   ```

### Public vs private image

- **Public (recommended).** Set the GHCR package visibility to public. The site
  itself is public, the image holds only static assets, and the server can pull
  anonymously — no login or read token needed on the VPS. Simplest to operate.
- **Private.** The VPS must authenticate before pulling, so you'd provision a
  separate `read:packages` token and `docker login ghcr.io` on the server. More
  moving parts and another credential to rotate.

Since the repo is going public and the image carries no secrets, make the package
**public**.

## Server-side deploy target

**Already provisioned on the VPS** — a dedicated, least-privilege `rwinter-deploy`
user, kept entirely separate from sheet-llm's own `deploy` user. For reference, the
setup is:

- User `rwinter-deploy` (added to the sshd `AllowUsers` allow-list).
- The repo's [`deploy/deploy.sh`](../deploy/deploy.sh) installed as
  `/usr/local/sbin/rwinter-deploy.sh` (root-owned, `0755`).
- A sudoers drop-in (`/etc/sudoers.d/rwinter-deploy`) letting `rwinter-deploy` run
  **only** that script as root, no password, preserving `SSH_ORIGINAL_COMMAND`:

  ```
  rwinter-deploy ALL=(root) NOPASSWD: /usr/local/sbin/rwinter-deploy.sh
  Defaults!/usr/local/sbin/rwinter-deploy.sh env_keep += "SSH_ORIGINAL_COMMAND"
  ```

- `~rwinter-deploy/.ssh/authorized_keys` pins the CI key to a forced command that
  can do nothing but trigger the script (`restrict` = no shell, PTY, or forwarding):

  ```
  command="sudo -n /usr/local/sbin/rwinter-deploy.sh",no-pty,no-port-forwarding,no-X11-forwarding,no-agent-forwarding,restrict ssh-ed25519 AAAA... circleci-deploy@rwinter
  ```

The Compose stack lives in `/opt/rwinter-portfolio` (root-owned, mirroring
`/opt/sheet-llm`); `rwinter-deploy.sh` `cd`s there and drives `docker compose`. The
static site needs no runtime secrets or `.env`.

## How the digest flows, and a first manual deploy

When CI runs `ssh rwinter-deploy@5.78.144.63 "$DIGEST"`, SSH ignores the requested
command and instead runs the forced command. The string the client sent is exposed
to the script as **`$SSH_ORIGINAL_COMMAND`** — the image digest. The script then:

1. **Validates** the ref matches our image and is digest-pinned
   (`ghcr.io/realrogerwinter/rwinter-dev-portfolio@sha256:...`) and rejects any
   shell metacharacters or whitespace.
2. Saves the currently-running image to `.previous-image`, then runs
   `PORTFOLIO_IMAGE="$REF" docker compose pull` and `... up -d --remove-orphans`.
3. Waits up to 30s for `http://127.0.0.1:3001/healthz`; on failure it **rolls back**
   to `.previous-image` and exits non-zero.

To deploy the first time **without CI** (or to test the path end-to-end), resolve
the digest and SSH it exactly as CI would:

```bash
DIGEST="$(docker buildx imagetools inspect \
  ghcr.io/realrogerwinter/rwinter-dev-portfolio:latest \
  --format '{{json .Manifest.Digest}}' | tr -d '"')"
REF="ghcr.io/realrogerwinter/rwinter-dev-portfolio@${DIGEST}"
ssh rwinter-deploy@5.78.144.63 "$REF"
```

Or run it directly on the VPS, where the script also accepts the ref as `$1`:

```bash
sudo /usr/local/sbin/rwinter-deploy.sh \
  ghcr.io/realrogerwinter/rwinter-dev-portfolio@sha256:<digest>
```

Once the manual deploy is healthy, normal releases flow through the pipeline: merge
to `main`, wait for `build_and_push`, **approve `hold`**, and `deploy` ships the
freshly pinned digest.
