// MongoDB Advanced Assignment
// Run this in mongosh

//Task 1: Schema Validation and Data Creation"
//Step 1: Select a Fresh Database"
use company_advanced

//Step 2: Create the Validated Collection"
db.createCollection("employees", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "departmentId", "experience", "active"],
      properties: {
        name: { bsonType: "string" },
        departmentId: { bsonType: "int" },
        experience: { bsonType: "int" },
        active: { bsonType: "bool" },
        skills: {
          bsonType: ["array", "null"],
          items: { bsonType: "string" }
        },
        certifications: {
          bsonType: ["array", "null"],
          items: {
            bsonType: "object",
            required: ["name", "status", "expiryYear"],
            properties: {
              name: { bsonType: "string" },
              status: { bsonType: "string" },
              expiryYear: { bsonType: "int" }
            },
            additionalProperties: true
          }
        }
      },
      additionalProperties: true
    }
  }
})

//Step 3: Insert the Starting Dataset
db.employees.insertMany([
  {
    _id: 1,
    name: "John",
    departmentId: 10,
    skills: ["Java", "MongoDB"],
    experience: 4,
    active: true,
    certifications: [
      { name: "MongoDB", status: "Expired", expiryYear: 2026 }
    ]
  },
  {
    _id: 2,
    name: "Alice",
    departmentId: 10,
    skills: ["Python", "MongoDB"],
    experience: 6,
    active: true,
    certifications: [
      { name: "MongoDB", status: "Active", expiryYear: 2028 }
    ]
  },
  {
    _id: 3,
    name: "David",
    departmentId: 20,
    skills: ["Communication"],
    experience: 3,
    active: false,
    certifications: [
      { name: "Communication", status: "Active", expiryYear: 2027 }
    ]
  }
])

// Step 4: Test the Validation Rule;
// Attempt to insert invalid document; must be rejected by validation
db.employees.insertOne({
  _id: 99,
  name: 123,
  departmentId: "HR",
  experience: "one",
  active: "yes"
})

// Task 2: Advanced Array Queries and Updates
// 2.1 Find One Matching Array Object
// Use $elemMatch to find employees whose certifications contain the same object with name: "MongoDB" and status: "Active".
print("2.1: Find employee with MongoDB certificate status Active");
db.employees.findOne(
    { certifications:
        { $elemMatch:
            { name: "MongoDB", status: "Active" } 
        } 
    },
    { _id: 0, name: 1, certifications: 1 }
)

// 2.2 Update One Matching Array Element
db.employees.updateOne(
  { _id: 1, certifications:
    { $elemMatch:
        { name: "MongoDB", status: "Expired" }
    }
  },
  { $set: 
    { "certifications.$.status": "Active" } }
)

// 2.3 Update Selected Array Elements
db.employees.updateMany(
  {},
  { $set: { "certifications.$[cert].status": "Renewal Due" } },
  { arrayFilters: [{ "cert.expiryYear": { $lt: 2027 } }] }
)

// Task 3: Bulk Write Operations
// Use one bulkWrite() call
db.employees.bulkWrite([
  {
    updateOne: {
      filter: { _id: 1 },
      update: { $inc: { experience: 1 } }
    }
  },
  {
    updateOne: {
      filter: { _id: 2 },
      update: { $set: { active: false } }
    }
  },
  {
    insertOne: {
      document: {
        _id: 4,
        name: "Emma",
        departmentId: 20,
        skills: ["Excel"],
        experience: 2,
        active: true,
        certifications: [
          { name: "Excel", status: "Active", expiryYear: 2026 }
        ]
      }
    }
  }
])

// Final employee state after bulkWrite
db.employees.find(
  { _id: { $in: [1, 2, 4] } },
  { _id: 1, name: 1, experience: 1, active: 1 }
)

// Task 4: Advanced Aggregation
// Step 1: Create the Departments Collection
db.departments.insertMany([
  { _id: 10, name: "Engineering" },
  { _id: 20, name: "HR" }
]);

// 4.1 Join Employees with Departments

db.employees.aggregate([
{
    $lookup: {
    from: "departments",
    localField: "departmentId",
    foreignField: "_id",
    as: "departmentInfo"
    }
},
{ $unwind: "$departmentInfo" },
{
    $project: {
    _id: 0,
    name: 1,
    departmentName: "$departmentInfo.name"
    }
},
{ $sort: { name: 1 } }
])

// 4.2 Count Employees for Each Skill
db.employees.aggregate([
    { $unwind: "$skills" },
    { $group: { _id: "$skills", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
])

// 4.3 Return Active Employees and a Count
db.employees.aggregate([
    { $match: { active: true } },
    {
        $facet: {
        activeEmployees: [
            { $project: { _id: 0, name: 1 } },
            { $sort: { name: 1 } }
        ],
        totalActiveEmployees: [
            { $count: "count" }
        ]
        }
    }
])

// Task 5: Indexing and Query Performance
// 5.1 Create and Verify a Compound Index
db.employees.createIndex({ departmentId: 1, name: 1 })
db.employees.getIndexes()

// 5.2 Read explain("executionStats")
db.employees
    .find({ departmentId: 10 })
    .sort({ name: 1 })
    .explain("executionStats")

// 5.3 Create a TTL Index
db.sessions.drop();
db.sessions.insertOne({
  _id: 1,
  userName: "John",
  expiresAt: new Date(Date.now() + 600000)
});
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.sessions.getIndexes()

db.sessions.findOne({ _id: 1 })

// Task 6: Backup and Restore (commands saved separately in backup-restore-commands.txt)
mongodump --db company_advanced --archive=company_advanced.archive --gzip

mongorestore --drop --archive=company_advanced.archive --gzip \
  --nsFrom="company_advanced.*" \
  --nsTo="company_advanced_restore.*"

use company_advanced_restore
db.employees.countDocuments()
