const express = require("express");
const app = express();
const session = require('express-session');
const configRoutes = require("./routes");

app.use(express.json());

app.use(
  session({
      name: "AuthCookie",
      secret: 'some secret string',
      resave: false,
      saveUninitialized: true
  })
);

//if user attempts to access private route without being authenicated, redirect them to the "main" page
app.use('/private', async(req, res, next) =>{
    if (!req.session.user) {
      let errors = [];
      errors.push("You cannot access the private route without logging in")
      return res.render('errors/error',{
        title: 'Errors',
        errors: errors,
        partial: 'errors-script'});
    } 
    next();
});

app.use('/posts/new', async(req,res, next) =>{
  if (!req.session.user) {
    req.session.previousRoute = req.originalUrl;
    return res.render("users/login", {
        title: 'Log In',
        error: "You must be logged in to create a post",
        partial: 'login-script'
      });
  } 
  next();
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});