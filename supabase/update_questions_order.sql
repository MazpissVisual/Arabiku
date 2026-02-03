-- Add order_index to questions table
ALTER TABLE questions ADD COLUMN order_index INT DEFAULT 0;

-- Update existing questions to have an order based on their creation time
WITH ranked_questions AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY quiz_id ORDER BY created_at ASC) - 1 as rank
  FROM questions
)
UPDATE questions
SET order_index = ranked_questions.rank
FROM ranked_questions
WHERE questions.id = ranked_questions.id;
