# Memory Bank for SpotifyToVinyl

Welcome to the Memory Bank of the SpotifyToVinyl project. This directory serves as a centralized repository for project documentation, context, and progress tracking. It is designed to keep all relevant information organized and accessible, facilitating better project management and collaboration.

## Purpose
The Memory Bank captures the essence of the project at various levels:
- **Strategic Overview**: High-level goals and product vision.
- **Technical Details**: System architecture, patterns, and technology stack.
- **Development Progress**: Current tasks, milestones, and blockers.
- **Active Context**: Immediate focus areas and ongoing work.

By maintaining these documents, we ensure that anyone joining the project or revisiting it after a break can quickly understand its state and direction.

## Structure
This directory contains the following files, each with a specific focus:

- **projectBrief.md**: Outlines the project's objectives, scope, stakeholders, and timeline. It answers "What are we building and why?"
- **productContext.md**: Describes the product, target audience, problem statement, and competitive landscape. It answers "Who is this for and what problem does it solve?"
- **systemPatterns.md**: Details architectural and design patterns used in the project for consistency and scalability. It answers "How is the system structured?"
- **techContext.md**: Provides an overview of the technology stack, integrations, and technical challenges. It answers "What tools and frameworks are we using?"
- **activeContext.md**: Captures the current development focus, active tasks, and immediate priorities. It answers "What are we working on right now?"
- **progress.md**: Tracks completed milestones, ongoing work, upcoming tasks, and blockers. It answers "Where are we in the development timeline?"

## Usage with Cline
This Memory Bank is integrated with Cline, an AI-assisted development tool, to maintain up-to-date project context. Here's how to interact with it:

- **Updating Memory Bank**: After significant development sessions or changes, use the command `/update-memory-bank` in the Cline chat prompt. This triggers a workflow to review and update `activeContext.md` and `progress.md` with the latest information.
- **Workflow Configuration**: The workflow for updating the Memory Bank is defined in `.cline/workflows/update-memory-bank.md`. It includes steps to read current files, ask for updates, and create new task contexts.
- **File Inclusion**: The glob pattern `["memory-bank/**/*.md"]` in `.cline/config.json` ensures that all markdown files in this directory are considered part of the project's memory for AI context.

## How to Contribute
- **Editing Files**: Feel free to update any of these markdown files directly to reflect new insights, progress, or changes in project direction.
- **Adding New Documents**: If additional context or categories are needed (e.g., user research, design guidelines), create new markdown files in this directory and update this README with their purpose.
- **Feedback**: If you're collaborating with others, share feedback on the content or structure of the Memory Bank to keep it relevant and useful.

## Note
The Memory Bank is a living set of documents. As the SpotifyToVinyl project evolves, so will the content here. Regular updates ensure that it remains a reliable source of truth for the project's state and history.

For any questions or to initiate an update cycle, use the Cline interface or manually edit the files as needed.
