## Fork & Pull-Request Flow

```mermaid
...
---

## 2  What your fork-flow diagram should show

| Step | Purpose |
|------|---------|
| **Upstream Repo** | The canonical WikiTruthPlatform repo. |
| **Fork** | Your personal copy on GitHub. |
| **Local Clone** | The repo on your machine. |
| **Feature Branch** | Where you develop (`feature/*`). |
| **Push to Fork** | Upload local commits to your fork. |
| **Pull Request** | Propose changes back to upstream. |
| **Review & CI** | Code review and automated checks. |
| **Merge → main** | Pull Request is accepted. |
| **Deploy** | (Optional) Production deployment. |

---

## 3  Ready-to-use Mermaid code

```mermaid
%% Fork flow for WikiTruthPlatform
flowchart TD
    subgraph Upstream
        A[Upstream Repo<br/>github.com/WikiTruthPlatform]:::repo
    end

    subgraph Your&nbsp;GitHub&nbsp;Account
        B[Your Fork<br/>github.com/username/WikiTruthPlatform]:::fork
        C[Local Clone<br/>git&nbsp;clone]:::local
        D[feature/my-change]:::branch
    end

    A -- Fork --> B
    B -- git&nbsp;clone --> C
    C -- git checkout&nbsp;-b&nbsp;feature/my-change --> D
    D -- commit&nbsp;&amp;&nbsp;push --> E[Push&nbsp;to&nbsp;Fork]:::fork
    E -- Open Pull Request --> F[Pull&nbsp;Request<br/>to&nbsp;Upstream]:::pr
    F -- Review&nbsp;&amp;&nbsp;CI --> G[Merge&nbsp;into&nbsp;main]:::merge
    G --> H[Deploy]:::deploy

    classDef repo fill:#dfe7fd,stroke:#4c6ef5,color:#1e3a8a,font-weight:bold;
    classDef fork fill:#fef3c7,stroke:#d97706,color:#92400e;
    classDef local fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e;
    classDef branch fill:#d1fae5,stroke:#059669,color:#064e3b;
    classDef pr fill:#f0abfc,stroke:#c026d3,color:#86198f;
    classDef merge fill:#e9d5ff,stroke:#7c3aed,color:#4c1d95;
    classDef deploy fill:#fde68a,stroke:#ca8a04,color:#78350f;
...
