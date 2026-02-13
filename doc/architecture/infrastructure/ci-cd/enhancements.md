[← Back to CI/CD Documentation](./ci-cd.md) | [Back to Overview](../../overview.md)

# CI/CD Enhancement Suggestions

Current status: **Standard**. We verify and build.
Goal status: **Advanced**. Faster, Safer, and Smarter.

---

## 1. Speed (Make the Robot Faster)

### A. Caching
**Why?**
Every time we run tests, we download `Django`, `Gevent`, `React`, etc. from the internet. This takes 2 minutes.
**How?**
Tell GitHub to "Save" the downloaded files.
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
```
**Result**: Downloads take 1 second instead of 2 minutes.

### B. Only Build What Changed
**Why?**
If you only changed the **Auth Service**, why are we rebuilding the **Vet Service**? It's a waste of time.
**How?**
Use `paths` filter in GitHub Actions or a monorepo tool (like `Nx` or `Turborepo`) to detect changes and only trigger relevant jobs.

---

## 2. Quality (Make the Robot Smarter)

### A. Static Analysis (SAST)
**Why?**
Tests check if the code *works*. SAST checks if the code is *secure*.
**How?**
Add a step to run **SonarQube** or **CodeQL**.
It scans for: "Password in code", "SQL Injection vulnerability", "Complex spaghetti code".

### B. Automatic Staging Deploy
**Why?**
Right now, we build the image, but a human has to go to the server and deploy it.
**How?**
Add a `deploy-staging` job at the end.
1.  SSH into the Staging Server.
2.  Run `deploy.sh`.
**Result**: You merge code, and 5 minutes later it's live on the test site.

---

## 3. Releases (Semantic Versioning)

### A. Automatic Versioning
**Why?**
`main-a1b2c3d` is an ugly version number. Clients prefer `v1.2.0`.
**How?**
Use **Semantic Release**.
1.  You write commit: `fix: login bug`. Robot knows this is a "Patch" -> `v1.0.1`.
2.  You write commit: `feat: add dark mode`. Robot knows this is a "Minor" -> `v1.1.0`.
3.  Robot automatically creates a GitHub Release and Changelog.
