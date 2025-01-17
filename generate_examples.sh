#!/bin/bash

# Set the output directory
OUTPUT_DIR="./EXAMPLE_VAULT/daily notes"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

for YEAR in 2023 2024 2025
do
  for DAY in {1..20}
  do
    DAY_PADDED=$(printf "%02d" $DAY)
    FILENAME="${OUTPUT_DIR}/${YEAR}-05-${DAY_PADDED}.md"

    # Random values for steps, exercise, and learning
    STEPS=$((RANDOM % 10000 + 1000))
    EXERCISE=$((RANDOM % 60 + 10))
    LEARNING=$((RANDOM % 120 + 10))

    # Random times for wake-up and bedtime
    WAKE_HOUR=$((RANDOM % 5 + 4)) # 4 am to 9 am
    WAKE_MINUTE=$((RANDOM % 60))
    SLEEP_HOUR=$((RANDOM % 5 + 20)) # 8 pm to midnight
    SLEEP_MINUTE=$((RANDOM % 60))

    # Zero-pad minutes and hours manually
    WAKE_TIME="${YEAR}-05-${DAY_PADDED}T$(printf "%02d" $WAKE_HOUR):$(printf "%02d" $WAKE_MINUTE)"
    SLEEP_TIME="${YEAR}-05-${DAY_PADDED}T$(printf "%02d" $SLEEP_HOUR):$(printf "%02d" $SLEEP_MINUTE)"

    # Randomly generate tasks as complete or incomplete
    TASKS=""
    for TASK_NUM in {1..5}
    do
      if (( RANDOM % 2 == 0 )); then
        TASKS+="- [x] Task ${TASK_NUM}\n"
      else
        TASKS+="- [ ] Task ${TASK_NUM}\n"
      fi
    done

    # Create Markdown file with random content
    {
      echo "---"
      echo "steps: $STEPS"
      echo "exercise: $EXERCISE minutes"
      echo "learning: $LEARNING minutes"
      echo "---"
      echo "## Day No ${DAY} in ${YEAR}"
      echo "Good morning! Today is a beautiful day."
      echo "I'm going to learn something new today."
      echo ""
      echo "I learned about the history of the Roman Empire."
      echo ""
      echo "What do you think about the Roman Empire?"
      echo ""
      echo "I woke up today at [Woke:: $WAKE_TIME]"
      echo "I went to bed today at [Sleep:: $SLEEP_TIME]"
      echo ""
      echo "#### Task tracking example"
      echo -e "$TASKS"
    } > "$FILENAME"
  done
done