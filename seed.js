const dbConnection = require("./config/mongoConnection");
const posts = require("./data/posts");
const comments = require("./data/comments");
const users = require("./data/users");

const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();
  //CREATE USER 1
  const user_1 = await users.createUser(
    "Divya",
    "Kamath",
    "dkamath@stevens.edu",
    "Test@123",
    24,
    "5512478554",
    "Female",
    "American",
    "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
    {
      drinking: "No Drinking",
      smoking: "No Smoking",
      food: ["Non Vegetarian"],
      room: ["Shared Room"],
      home_type: ["Apartment"],
      location: "Hoboken",
    }
  );
  //GET USER ID FOR USER 1
  const user_1_id = user_1._id.toString();
  // CREATE POST BY USER 1
  const posts1_user1 = await posts.createPost(
    user_1_id,
    "Looking for apartment",
    "Looking for a private/shared room for short-term or month-to-month sublease starting 1st Jan around JSQ in Jersey city. Budget: $400-800. I work full-time at Goldman (3-5 days in office), am vegetarian, don't smoke/drink, keep myself & my space clean, won't invite any guests, and will respect your privacy.Thanks!",
    ""
  );



  //CREATE USER 2
  const user_2 = await users.createUser(
    "Kunal",
    "Mandalya",
    "kmandaly@stevens.edu",
    "Test@123",
    24,
    "5512478555",
    "Male",
    "Indian",
    "I am from India. I am in my first year of Masters. I like to play badminton and go out for drinks in weekend.",
    {
      drinking: "No Drinking",
      smoking: "No Smoking",
      food: ["Vegetarian"],
      room: ["Shared Room"],
      home_type: ["Apartment"],
      location: "Jersey City",
    }
  );

   //GET USER ID FOR USER 2
   const user_2_id = user_2._id.toString();

      //   // CREATE POST BY USER 2
  const posts1_user2 = await posts.createPost(
    user_2_id,
    "Looking for roomate",
    "Looking for female roommate for a master bedroom which is shared with 2 other girls in a 3b/2bath apartment from December 26. Rent $420+utilities, Mixed accomodation, preferably South Indians, 15 mins from Journal Square Path"
  );


  //CREATE USER 3
  const user_3 = await users.createUser(
    "Dhriti",
    "Shah",
    "dhah@stevens.edu",
    "Test@123",
    22,
    "5514329765",
    "Female",
    "Indian",
    "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
    {
      drinking: "Drinking",
      smoking: "Smoking",
      food: ["Vegan"],
      room: ["Private Room"],
      home_type: ["Townhouse"],
      location: "Jersey City",
    }
  );

  //GET USER ID FOR USER 3
  const user_3_id = user_3._id.toString();

  //   // CREATE POST BY USER 3
  const posts1_user3 = await posts.createPost(
    user_3_id,
    "Finding someone to occupy my apartment for temporary basis",
    "Looking for a private/shared room for short-term or month-to-month sublease starting 1st Jan around JSQ in Jersey city. Budget: $400-800. I work full-time at Goldman (3-5 days in office), am vegetarian, don't smoke/drink, keep myself & my space clean, won't invite any guests, and will respect your privacy.Thanks!",
    ""
  );



    //CREATE USER 4
    const user_4 = await users.createUser(
      "Harsh",
      "Kumar",
      "harshkumar@stevens.edu",
      "Test@123",
      22,
      "2045512471",
      "Male",
      "Indian",
      "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
      {
        "drinking": "No Drinking",
        "smoking": "No Smoking",
        "food": ["Vegetarian","Non Vegetarian"],
        "room": ["Shared Room"],
        "home_type": ["Apartment"],
        "location": "Newport"
      }
    );

     //GET USER ID FOR USER 4
     const user_4_id = user_4._id.toString()

    // CREATE POST BY USER 4
    const posts1_user4 = await posts.createPost(
      user_4_id,
      "Need for apartment",
      "Hi, I am looking for a 1 bhk apartment for rent near Jersey City starting  January 5th. Please let me know if there are any available.",
      ""
    );


    //CREATE USER 5
    const user_5 = await users.createUser(
      "Vismay",
      "Rathod",
      "vrathod@stevens.edu",
      "Test@123",
      22,
      "2048885555",
      "Male",
      "Indian",
      "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
      {
        "drinking": "Drinking",
        "smoking": "Smoking",
        "food": ["Vegetarian"],
        "room": ["Private Room"],
        "home_type": ["Apartment","Condos"],
        "location": "Newport"
      }
    );

     //GET USER ID FOR USER 5
     const user_5_id = user_5._id.toString()

    //CREATE USER 6
    const user_6 = await users.createUser(
      "Soham",
      "Mehta",
      "sohamm@stevens.edu",
      "Test@123",
      23,
      "5512340987",
      "Male",
      "Indian",
      "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
      {
        "drinking": "Drinking",
        "smoking": "No Smoking",
        "food": ["Vegetarian","Non Vegetarian"],
        "room": ["Shared Room","Private Room"],
        "home_type": ["Apartment","Studio Apartment"],
        "location": "Hoboken"
      }
    );
    //GET USER ID FOR USER 6
    const user_6_id = user_6._id.toString()

    // CREATE POST BY USER 6
    const posts1_user6 = await posts.createPost(
      user_6_id,
      "Ping me if you are looking for apartment",
      "Hello everyone, A spacious one master bed room with attached bathroom in 3bhk  available for moving in from January . Available for both sharing or occupying the whole room in Hobokne only for boys . Dm for more details",
      ""
    );

    //CREATE USER 7
    const user_7 = await users.createUser(
      "Chinmay",
      "Kamath",
      "ckamath@stevens.edu",
      "Test@123",
      23,
      "5516382491",
      "Male",
      "Indian",
      "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
      {
        "drinking": "No Drinking",
        "smoking": "Smoking",
        "food": ["Non Vegetarian"],
        "room": ["Shared Room"],
        "home_type": ["Apartment"],
        "location": "Union City"
      }
    );

     //GET USER ID FOR USER 7
     const user_7_id = user_7._id.toString()
     // CREATE POST BY USER 7
    const posts1_user7 = await posts.createPost(
      user_7_id,
      "Help needede to search for apartment",
      "Hello Everyone, I am looking for a furnished short term stay with Kitchen for a month, starting from 1st January to 31st January. Anything near Hoboken or Union City with public transport connectivity works for me. Please help me with any lead",
      ""
    );

    //CREATE USER 8
    const user_8 = await users.createUser(
      "Krushali",
      "Patel",
      "krupatel@stevens.edu",
      "Test@123",
      22,
      "5512476888",
      "Female",
      "Indian",
      "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
      {
        "drinking": "No Drinking",
        "smoking": "No Smoking",
        "food": ["Vegetarian"],
        "room": ["Private Room"],
        "home_type": ["Apartment","Condos","Studio Apartment"],
        "location": "Weehawken"
      }
    );

    //GET USER ID FOR USER 8
    const user_8_id = user_8._id.toString()


    // CREATE POST BY USER 8
    const posts1_user8 = await posts.createPost(
      user_8_id,
      "Room available, looking for roomate",
      "Hello everyone, 1bed/1bath is available for $1200 monthly. 2bed/2bath - $2300 - Available Now - Furnished: fully and well furnished-Laundry on -Parking: yes available Flexible for any length of stay! The apartment includes: - Equipped kitchen (gas stove, oven, microwave, fridge and dishwasher) - Furnished with TV, storage, bookshelves - Washer/dryer - Radiator for heating (included) - Window A/C unit and box fan for cooling (included) - WiFi included, Gas and electricity is all available.",
      "",
    );


    //CREATE USER 9
    const user_9 = await users.createUser(
      "Preeti",
      "Roomate",
      "preeti@stevens.edu",
      "Test@123",
      24,
      "5512578663",
      "Female",
      "American",
      "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
      {
        "drinking": "Drinking",
        "smoking": "No Smoking",
        "food": ["Non Vegetarian"],
        "room": ["Private Room", "Shared Room"],
        "home_type": ["Apartment"],
        "location": "Hoboken"
      }
    );


  //GET USER ID FOR USER 9
  const user_9_id = user_9._id.toString()

    //CREATE USER 10
    const user_10 = await users.createUser(
      "Rahul",
      "Kumar",
      "rahulkumar@stevens.edu",
      "Test@123",
      22,
      "5513892743",
      "Male",
      "Indian",
      "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
      {
        "drinking": "No Drinking",
        "smoking": "No Smoking",
        "food": ["Vegetarian","Non Vegetarian"],
        "room": ["Shared Room"],
        "home_type": ["Apartment"],
        "location": "Newport"
      }
    );
    //GET USER ID FOR USER 10
    const user_10_id = user_10._id.toString()
 //CREATE USER 10
 const user_11 = await users.createUser(
  "Reshma",
  "Verma",
  "reshmav@stevens.edu",
  "Test@123",
  26,
  "5513892744",
  "Female",
  "Pakistan",
  "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
  {
    "drinking": "Drinking",
    "smoking": "Smoking",
    "food": ["Non Vegetarian"],
    "room": ["Shared Room"],
    "home_type": ["Condo"],
    "location": "Newport"
  }
);
//GET USER ID FOR USER 10
const user_11_id = user_11._id.toString()
 //CREATE USER 10
 const user_12 = await users.createUser(
  "Saumya",
  "Verma",
  "saumyav@stevens.edu",
  "Test@123",
  29,
  "5513892733",
  "Male",
  "Chinese",
  "Currently pursuing master's in CS. I like to chat and go for drinks during weekend. I love to cook.",
  {
    "drinking": "Drinking",
    "smoking": "No Smoking",
    "food": ["Non Vegetarian"],
    "room": ["Private"],
    "home_type": ["Apartment"],
    "location": "Jersey City"
  }
);
//GET USER ID FOR USER 10
const user_12_id = user_12._id.toString()
 //CREATE USER 10
 const user_13 = await users.createUser(
  "Prasad",
  "Patil",
  "prasadp@stevens.edu",
  "Test@123",
  23,
  "5513892743",
  "Male",
  "Indian",
  " I love to cook and want roomates who are vegan",
  {
    "drinking": "No Drinking",
    "smoking": "Smoking",
    "food": ["Vegan"],
    "room": ["Shared Room"],
    "home_type": ["Condo"],
    "location": "Weehawken"
  }
);
//GET USER ID FOR USER 10
const user_13_id = user_13._id.toString()
 //CREATE USER 10
 const user_14 = await users.createUser(
  "Riddhi",
  "Dange",
  "rdange@stevens.edu",
  "Test@123",
  21,
  "5533892743",
  "Female",
  "Swiss",
  "Need urgent accomodation for 6 months.",
  {
    "drinking": "No Drinking",
    "smoking": "No Smoking",
    "food": ["Vegetarian","Non Vegetarian"],
    "room": ["Shared Room"],
    "home_type": ["Apartment"],
    "location": "Union City"
  }
);
//GET USER ID FOR USER 10
const user_14_id = user_14._id.toString()

 //CREATE USER 10
 const user_15 = await users.createUser(
  "Rohan",
  "Shetty",
  "rohanshetty@stevens.edu",
  "Test@123",
  22,
  "5513892710",
  "Male",
  "Ugandan",
  "Looking for roomates with similar interest. I like to play video games and go dancing.",
  {
    "drinking": "No Drinking",
    "smoking": "No Smoking",
    "food": ["Non Vegetarian"],
    "room": ["Shared Room"],
    "home_type": ["Townhouse"],
    "location": "Weehawken"
  }
);
//GET USER ID FOR USER 10
const user_15_id = user_15._id.toString()



const posts1_user11 = await posts.createPost(
  user_11_id,
  "Looking for house in Newport",
  "Looking for a private/shared room for short-term or month-to-month sublease starting 1st Jan around Newport. Budget: $1400-1800. Thanks!",
  ""
);

//   // CREATE POST BY USER 2
const posts1_user12 = await posts.createPost(
  user_12_id,
  "Looking for Apt in jersey",
  "Looking for roommate for a master bedroom which is shared with 2 other girls in a 3b/1bath apartment from December 26. Rent $440+utilities,preferably North Indians, 15 mins from Journal Square Path"
);

//   // CREATE POST BY USER 3
const posts1_user13 = await posts.createPost(
  user_13_id,
  "Finding someone indian roomate in Stevens",
  " Budget: $400-800. I work full-time at Goldman (3-5 days in office), am vegetarian, don't smoke/drink, keep myself & my space clean, won't invite any guests, and will respect your privacy.Thanks!",
  ""
);

  // CREATE POST BY USER 4
  const posts1_user14 = await posts.createPost(
    user_14_id,
    "Need for apartment",
    "  Looking for roommates okay with drinking and smoking    ",
    ""
  );

  // CREATE POST BY USER 6
  const posts1_user15 = await posts.createPost(
    user_15_id,
    "Ping me if you are looking for apartment",
    "Hello everyone, A spacious one master bed room with attached bathroom in 3bhk  available for moving in from January . Available for both sharing or occupying the whole room in Hobokne only for boys . Dm for more details",
    ""
  );



    

  console.log("Done seeding....");
  await dbConnection.closeConnection();
};

main().catch((error) => {
  console.log(error);
});
