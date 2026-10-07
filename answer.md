# MongoDB Advanced Assignment Answers

## Task 5.2: explain("executionStats")

Ran the following query in mongosh and filled in the values shown:

```js
db.employees
  .find({ departmentId: 10 })
  .sort({ name: 1 })
  .explain("executionStats")
```

Record the actual values:

- winning plan stage: IXSCAN
- nReturned: 2
- totalDocsExamined: 2
- totalKeysExamined: 2

## MCQ Answers

Q1. B
Q2. B
Q3. C
Q4. A
Q5. C
Q6. B
Q7. C
Q8. B
Q9. C
Q10. B
Q11. A
Q12. C

## Final result notes

- Valid employee documents: 3
- Invalid document: rejected by schema validation
- Final certification status after update: Alice = MongoDB / Active, John = MongoDB / Renewal Due
- Final bulkWrite state: John.experience = 5, Alice.active = false, employee count = 4
