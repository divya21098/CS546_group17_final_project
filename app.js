const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const static = express.static(__dirname + '/public');

app.use('/public',static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({defaultLayout : "main"}));
app.set("view engine", "handlebars");


app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("*", (req, res, next) => {
  console.log(
    "[%s]: %s %s (%s)",
    new Date().toUTCString(),
    req.method,
    req.originalUrl,
    `${req.session.user ? "Authenticated User" : "Non-Authenticated User"}`
  );
  next();
});
//if user attempts to access private route without being authenicated, redirect them to the "main" page
app.use("/private", async (req, res, next) => {
  if (!req.session.user) {
    let errors = [];
    errors.push("You cannot access the private route without logging in");
    return res.render("errors/error", {
      title: "Errors",
      errors: errors,
      partial: "errors-script",
    });
  }
  next();
});

app.use("/posts/new", async (req, res, next) => {
  if (!req.session.user) {
    req.session.previousRoute = req.originalUrl;
    return res.render("login", {
      title: "Log In",
      error: "You must be logged in to create a post",
      partial: "login-script",
    });
  }
  next();
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {

  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
