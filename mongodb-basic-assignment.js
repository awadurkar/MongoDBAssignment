print("Task 1: Local Setup and Data Creation");

use company;

show dbs;

db.createCollection("employees");

db.employees.insertMany(
    [
        {
            _id: "EMP001",
            name: "John",
            department: "Engineering",
            experience: 4,
            skills: ["Java", "Spring Boot"],
            active: true,
            address: {
            city: "Pune",
            country: "India"
            }
        },
        {
            _id: "EMP002",
            name: "Alice",
            department: "HR",
            experience: 3,
            skills: ["Recruitment", "Communication"],
            active: true,
            address: {
            city: "Mumbai",
            country: "India"
            }
        },
        {
            _id: "EMP003",
            name: "David",
            department: "Engineering",
            experience: 6,
            skills: ["Java", "MongoDB"],
            active: true,
            address: {
            city: "Bengaluru",
            country: "India"
            }
        },
        {
            _id: "EMP004",
            name: "Emma",
            department: "Finance",
            experience: 2,
            skills: ["Accounting", "Excel"],
            active: false,
            address: {
            city: "Pune",
            country: "India"
            }
        },
        {
            _id: "EMP005",
            name: "Robert",
            department: "Engineering",
            experience: 5,
            skills: ["Java", "Docker"],
            active: true,
            address: {
            city: "Delhi",
            country: "India"
            }
        }
    ]
)

print("Task 2: Querying the employees collection");
print("2.1 Engineering Employees");
db.employees.find(
  {department: "Engineering"},
  {_id: 1, name: 1, experience: 1}
).sort({
  name: 1
})

print("2.2 Employees with more than 5 years of experience");
db.employees.find(
  {experience: {$gte: 5}},
  {_id: 0, name: 1, experience: 1}
).sort({
  experience: -1
})

print("2.3 Nested Document Query");
db.employees.find(
  {"address.city": "Pune"},
  {_id: 0, name: 1, "address.city": 1}
).sort({
  name: 1
})

print("2.4 Array Query");
db.employees.find({
  skills: {$in: ["MongoDB", "Spring Boot"]}
}).sort({
  name: 1
})

print("2.5 Limit and Sort");
db.employees.find(
  {},
  {_id: 0, name: 1, experience: 1}
).sort({
  experience: -1
}).limit(2)

print("Task 3: Update Operations");
print("3.1 Incrementing Experience for Alice");
db.employees.updateOne(
  {name: "Alice"},
  {$inc: {experience: 1}}
)

print("3.2 Updating Active Status for Emma");
db.employees.updateOne(
  {name: "Emma"},
  {$set: {active: true}}
)

print("3.3 Adding a Skill for Robert");
db.employees.updateOne(
  {name: "Robert"},
  {$addToSet: {skills: "MongoDB"}}
)

print("Task 4: Delete Operation");
db.employees.deleteOne({
  _id: "EMP999"
})

print("Task 5: Indexing");
print("5.1 Check Existing Indexes");
db.employees.getIndexes()

print("5.2 Create an Index");
db.employees.createIndex({
    department: 1
})

print("5.3 Verify the Index");
db.employees.getIndexes()

print("Task 6: Aggregation");
print("6.1 Employees per Department");
db.employees.aggregate([
  {
    $group: {
      _id: "$department",
      totalEmployees: {$sum: 1}
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
])

print("6.2 Average Experience per Department");
db.employees.aggregate([
  {
    $group: {
      _id: "$department",
      averageExperience: {$avg: "$experience"}
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
])

print("6.3 Top 2 Engineering Employees by Experience");
db.employees.aggregate([
  {
    $match: {
      department: "Engineering"
    }
  },
  {
    $sort: {
      experience: -1
    }
  },
  {
    $limit: 2
  }
])