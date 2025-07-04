## Fork & Pull-Request Flow

```mermaid
flowchart TD
    subgraph Upstream
        A["Upstream Repo<br/>github.com/WikiTruthPlatform"]:::repo
    end

    subgraph "Your GitHub Account"
        B["Your Fork<br/>github.com/username/WikiTruthPlatform"]:::fork
        C["Local Clone<br/>git clone"]:::local
        D["feature/my-change"]:::branch
    end

    A -- "Fork" --> B
    B -- "git clone" --> C
    C -- "checkout -b feature/my-change" --> D
    D -- "commit & push" --> E["Push to Fork"]:::fork
    E -- "Open Pull Request" --> F["Pull Request<br/>to Upstream"]:::pr
    F -- "Review & CI" --> G["Merge into main"]:::merge
    G --> H["Deploy"]:::deploy

    classDef repo   fill:#dfe7fd,stroke:#4c6ef5,color:#1e3a8a,font-weight:bold;
    classDef fork   fill:#fef3c7,stroke:#d97706,color:#92400e;
    classDef local  fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e;
    classDef branch fill:#d1fae5,stroke:#059669,color:#064e3b;
    classDef pr     fill:#f0abfc,stroke:#c026d3,color:#86198f;
    classDef merge  fill:#e9d5ff,stroke:#7c3aed,color:#4c1d95;
    classDef deploy fill:#fde68a,stroke:#ca8a04,color:#78350f;
