# AI Instance Governance Rules
These RULES must be followed at all times.

This document defines mandatory operating principles for all AI instances. It ensures consistent behaviour, robust execution, and secure collaboration across tasks and services.

⸻

# Code Quality Standards

- All scripts must implement structured error handling with specific failure modes.
- Every function must include a concise, purpose-driven docstring.
- Scripts must verify preconditions before executing critical or irreversible operations.
- Long-running operations must implement timeout and cancellation mechanisms.
- File and path operations must verify existence and permissions before granting access.

⸻

# Documentation Protocols

- Documentation must be synchronised with code changes—no outdated references.
- Markdown files must use consistent heading hierarchies and section formats.
- Code snippets in documentation must be executable, tested, and reflect real use cases.
- Each doc must clearly outline: purpose, usage, parameters, and examples.
- Technical terms must be explained inline or linked to a canonical definition.

⸻

# Task Management Rules
- Tasks must be clear, specific, and actionable—avoid ambiguity.
- Every task must be assigned a responsible agent, explicitly tagged.
- Complex tasks must be broken into atomic, trackable subtasks.
- No task may conflict with or bypass existing validated system behaviour.
- Security-related tasks must undergo mandatory review by a designated reviewer agent.
- Agents must update task status and outcomes in the shared task file.
- Dependencies between tasks must be explicitly declared.
- Agents must escalate ambiguous, contradictory, or unscoped tasks for clarification.
- If you encounter any unclear, missing, or ambiguous requirements:
+ Stop implementation immediately
+ Ask specific clarification questions
+ Wait for explicit confirmation before continuing
- Do NOT make assumptions or infer behavior that is not clearly stated.

⸻

# Security Compliance Guidelines

- Hardcoded credentials are strictly forbidden—use secure storage mechanisms.
- All inputs must be validated, sanitised, and type-checked before processing.
- Avoid using eval, unsanitised shell calls, or any form of command injection - vectors.
- File and process operations must follow the principle of least privilege.
- All sensitive operations must be logged, excluding sensitive data values.
- Agents must check system-level permissions before accessing protected services or paths.

⸻

# Process Execution Requirements

- Agents must log all actions with appropriate severity (INFO, WARNING, ERROR, etc.).
- Any failed task must include a clear, human-readable error report.
- Agents must respect system resource limits, especially memory and CPU usage.
- Long-running tasks must expose progress indicators or checkpoints.
- Retry logic must include exponential backoff and failure limits.

⸻

# Core Operational Principles

- Agents must never use mock, fallback, or synthetic data in production tasks.
- Error handling logic must be designed using test-first principles.
- Agents must always act based on verifiable evidence, not assumptions.
- All preconditions must be explicitly validated before any destructive or high-impact operation.
- All decisions must be traceable to logs, data, or configuration files.

⸻

# Design Philosophy Principles

KISS (Keep It Simple, Stupid)
• Solutions must be straightforward and easy to understand.
• Avoid over-engineering or unnecessary abstraction.
• Prioritise code readability and maintainability.

YAGNI (You Aren’t Gonna Need It)
• Do not add speculative features or future-proofing unless explicitly required.
• Focus only on immediate requirements and deliverables.
• Minimise code bloat and long-term technical debt.

# SOLID Principles

- Single Responsibility Principle — each module or function should do one thing only.
- Open-Closed Principle — software entities should be open for extension but closed for modification.
- Liskov Substitution Principle — derived classes must be substitutable for their base types.
- Interface Segregation Principle — prefer many specific interfaces over one general-purpose interface.
- Dependency Inversion Principle — depend on abstractions, not concrete implementations.

⸻

# System Extension Guidelines

- All new agents must conform to existing interface, logging, and task structures.
- Utility functions must be unit tested and peer reviewed before shared use.
- All configuration changes must be reflected in the system manifest with version stamps.
- New features must maintain backward compatibility unless justified and documented.
- All changes must include a performance impact assessment.

⸻

# Quality Assurance Procedures

- A reviewer agent must review all changes involving security, system config, or agent roles.
- Documentation must be proofread for clarity, consistency, and technical correctness.
- User-facing output (logs, messages, errors) must be clear, non-technical, and actionable.
- All error messages should suggest remediation paths or diagnostic steps.
- All major updates must include a rollback plan or safe revert mechanism.

⸻

# Testing & Simulation Rules

- All new logic must include unit and integration tests.
- Simulated or test data must be clearly marked and never promoted to production.
- All tests must pass in continuous integration pipelines before deployment.
- Code coverage should exceed defined thresholds (e.g. 85%).
- Regression tests must be defined and executed for all high-impact updates.
- Agents must log test outcomes in separate test logs, not production logs.

⸻

# Change Tracking & Governance

- All configuration or rule changes must be documented in the system manifest and changelog.
- Agents must record the source, timestamp, and rationale when modifying shared assets.
- All updates must increment the internal system version where applicable.
- A rollback or undo plan must be defined for every major change.
- Audit trails must be preserved for all task-modifying operations.