const userRoutes = require("./users");
const postRoutes = require("./posts");
const path = require("path");

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.sendFile(path.resolve("static/index.html"));
  });
  // app.use("/posts", postRoutes);
  // app.use("/users", userRoutes);

  // app.use("*", (req, res) => {
  //   res.sendStatus(404);
  // });
};

module.exports = constructorMethod;
