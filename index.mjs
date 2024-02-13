import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import express from "express";

// Construct a schema, using GraphQL schema language
const restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

const schema = buildSchema(`
  type Query {
    restaurant(id: Int): Restaurant
    restaurants: [Restaurant]
  }

  type Restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
  }

  type Dish {
    name: String
    price: Int
  }

  input RestaurantInput {
    name: String
    description: String
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type Mutation {
    setRestaurant(input: RestaurantInput): Restaurant
    deleteRestaurant(id: Int!): DeleteResponse
    editRestaurant(id: Int!, name: String!): Restaurant
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  restaurant: ({ id }) => restaurants[id],
  restaurants: () => restaurants,
  setRestaurant: ({ input }) => {
    const newRestaurant = {
      id: restaurants.length + 1,
      name: input.name,
      description: input.description,
      dishes: input.dishes || [],
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleteRestaurant: ({ id }) => {
    const ok = Boolean(restaurants[id]);
    const deletedRestaurant = restaurants[id];
    restaurants.splice(id, 1);
    console.log(JSON.stringify(deletedRestaurant));
    return { ok };
  },
  editRestaurant: ({ id, ...restaurant }) => {
    if (!restaurants[id]) {
      throw new Error("Restaurant doesn't exist");
    }
    restaurants[id] = {
      ...restaurants[id],
      ...restaurant,
    };
    return restaurants[id];
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 5500;
app.listen(port, () => console.log(`Running GraphQL on Port: ${port}`));
