# Update Memory Bank

## Step 1: Review all files in memory-bank
read_file memory-bank/projectBrief.md
read_file memory-bank/productContext.md
read_file memory-bank/systemPatterns.md
read_file memory-bank/techContext.md
read_file memory-bank/activeContext.md
read_file memory-bank/progress.md

## Step 2: Summarize current state
ask_followup_question "What changes were made recently?"
ask_followup_question "What needs to be updated in activeContext.md and progress.md?"

## Step 3: Update files
new_task "Update activeContext.md and progress.md with latest changes and next steps."
