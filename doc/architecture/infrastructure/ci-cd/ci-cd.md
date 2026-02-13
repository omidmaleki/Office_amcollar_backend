[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# CI/CD Infrastructure (GitHub Actions)

## Introduction
**CI/CD** (Continuous Integration / Continuous Deployment) is our "Robot Butler".
Instead of you manually running tests, building images, and uploading them (which is slow and error-prone), the Robot does it automatically every time you push code.

**Analogy**:
*   **Without CI/CD**: You build a car by hand in your garage. Maybe you forget to tighten a bolt.
*   **With CI/CD**: You send a blueprint to a factory. The factory robots check the blueprint (Tests), assemble the parts (Build), and paint it (Push) perfectly every time.

---

## 1. The Pipeline (`.github/workflows/ci-cd.yml`)

Our "Factory" has 3 main stations. They run in order.

### Station 1: Testing (`test-backend`)
**Goal**: Catch bugs fast.
*   **What it does**: It starts a separate computer (Runner) for *every* microservice (Auth, Pet, Owner...).
*   **The Check**: It runs `python manage.py test`.
*   **Result**: If *any* test fails, the whole factory stops. You get an email: "Fix your code!"

### Station 2: Linting (`lint-frontend`)
**Goal**: Keep code pretty.
*   **What it does**: Checks the Frontend code (`amcollar-landing`, `amcollarapp`).
*   **The Check**: Runs `npm run lint`.
*   **Result**: Fails if you have messy code, unused variables, or syntax errors.

### Station 3: Build & Push (`build-push`)
**Goal**: Create the shipping container.
*   **Condition**: Only runs if Station 1 and 2 passed.
*   **What it does**:
    1.  **Login**: Logs into our Docker Registry (like logging into Gmail).
    2.  **Tag**: Calculates the version name (e.g., `main-a1b2c3d`).
    3.  **Build**: Runs `docker build` for every service.
    4.  **Push**: Uploads the images to the cloud.

---

## 2. Configuration & Secrets

The Robot needs passwords to do its job, but we **NEVER** put passwords in the code.
We use **GitHub Secrets** (Settings -> Secrets and variables -> Actions).

| Secret Name | Description |
| :--- | :--- |
| `DOCKER_REGISTRY` | Where to upload images (e.g., `docker.arvancloud.ir`). |
| `DOCKER_USERNAME` | The robot's username. |
| `DOCKER_PASSWORD` | The robot's password. |

---

## 3. How to Trigger It
 You don't need to do anything special!
1.  **Push to `main` or `develop`**: The pipeline starts automatically.
2.  **Open a Pull Request**: The pipeline runs to prove your code is safe *before* you merge.

---

## 4. Troubleshooting
**"The build failed!"**
1.  Go to the **Actions** tab in GitHub.
2.  Click on the failed run.
3.  Click on the red bubble (e.g., `test-backend`).
4.  Read the logs. It usually says exactly what happened (e.g., `AssertionError: 1 != 2`).

**"It says 'Login Failed'!"**
*   This means the `DOCKER_PASSWORD` secret in GitHub is wrong or expired. Ask the Team Lead to update it.
