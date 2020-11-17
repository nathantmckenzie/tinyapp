// DEPENDENCIES
const {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
  users,
  urlDatabase
} = require("./helpers");
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');

// IMPLEMENTING DEPENDENCIES 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['LHL RULEZ']
}));

// SETTING VIEW ENGINE 
app.set("view engine", "ejs");


//GET ROUTES

//GET REQUEST TO VIEW THE HOMEPAGE
app.get("/urls", (req, res) => {
  const urls = urlsForUser(req.session["user_id"]);
  const templateVars = {
    user: users[req.session["user_id"]],
    urls: urls
  };
  res.render("urls_index", templateVars);
});

//GET REQUEST TO VIEW THE LOGIN PAGE 
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session["user_id"]],
    urls: urlDatabase
  };
  res.render('urls_login', templateVars);
});


//GET REQUEST TO VIEW THE NEW URL PAGE
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session["user_id"]]
  };
  if (!users[req.session["user_id"]]) {
    res.redirect('/urls');
  }
  res.render("urls_new", templateVars);
});

//GET REQUEST TO VIEW THE WEBSITE OF THE SHORT URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//GET REQUEST TO VIEW THE PAGE FOR EDITING THE SHORT URL
app.get("/urls/:shortURL", (req, res) => {
  const databaseID = urlDatabase[req.params.shortURL]["id"];
  if (databaseID === req.session["user_id"]) {
    const templateVars = {
      user: users[req.session["user_id"]],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]["longURL"]
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(400).send("You are not authorized to perform this action");
  }
});


//GET REQUEST TO VIEW THE REGISTER PAGE
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session["user_id"]]
  };
  res.render("register", templateVars);
});

//POST ROUTES

//POST REQUEST TO SUBMIT A FORM FOR NEW USER REGISTRATION
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    return res.status(400).send('Enter Or Password Input Missing');
  }

  for (const user in users) {
    if (getUserByEmail(email, users) === user) {
      return res.status(400).send('Invalid Input');
    }
  }

  const newUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[newUserID] = { id: newUserID, email, password: hashedPassword };
  req.session["user_id"] = newUserID;
  res.redirect('/urls');
});

//POST REQUEST TO SUBMIT A FORM FOR THE URLS PAGE
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const newEntry = {
    id: req.session["user_id"],
    longURL: longURL
  };
  urlDatabase[shortURL] = newEntry;
  res.redirect(`/urls/${shortURL}`);
});


//POST REQUEST TO SUBMIT A FORM FOR SHORT URL EDITING
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
});


//POST REQUEST TO SUBMIT A FORM FOR SHORT URL DELETION 
app.post("/urls/:shortURL/delete", (req, res) => {
  const databaseID = urlDatabase[req.params.shortURL]["id"];
  if (req.session["user_id"] === databaseID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(400).send("You are not authorized to perform this action");
  }
});

//POST REQUEST TO SUBMIT A FORM FOR USER LOGIN
app.post("/login", (req, res) => {
  let foundUser = null;
  const email = req.body.email;
  const password = req.body.password;

  if (!password || !email) {
    res.status(400).send('Please Enter an Email and Password')
  }

  for (const key in users) {
    if (getUserByEmail(email, users) === key) {
      foundUser = users[key];
    }
  }

  if (foundUser === null) {
    res.status(400).send('Invalid Input');
  }

  if (!bcrypt.compareSync(password, foundUser.password)) {
    res.send('Invalid Input');
  }

  req.session["user_id"] = foundUser.id;
  res.redirect("/urls");
});

//POST REQUEST TO SUBMIT A FORM TO LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//LISTENING ON THE LISTED PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
