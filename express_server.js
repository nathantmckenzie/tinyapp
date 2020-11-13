const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const getUserByEmail = require("./helpers");


app.use(cookieSession({
  name: 'session',
  keys: ['LHL RULEZ']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


const users = { 
    "1": {
      id: "1",
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
    "2": {
      id: "2",
      email: "usesdfffar@example.com", 
      password: "puasdfle-monkey-dinosaur"
    }
  }


const genNextId = () => {
  return Object.keys(users).length + 1;
};

const generateRandomString = () => {
  const length = 6;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const emailCheck = function(emailInput) {
  for (const keys in users) {
    if (users[keys].email === emailInput) {
      return true;
    }
  }
  return false;
}

const urlsForUser = (id) => {
  let obj = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].id === id) {
      obj[url] = { longURL: urlDatabase[url].longURL, id: id };
    }
  }
  return obj;
};



app.get("/urls", (req, res) => {
  const urls = urlsForUser(req.session["user_id"]);
  const templateVars = { user: users[req.session["user_id"]], urls: urls };
  if (!req.session["user_id"]) {
     res.redirect("/login")
  }
  res.render("urls_index", templateVars);
});

app.get("/urls_login", (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], urls: urlDatabase };
  res.render('urls_login', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {user: users[req.session["user_id"]], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  if (!req.session["user_id"]) {
    res.redirect("/login");
  }
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.get("/urls/new", (req, res) => {
    const templateVars = { user: users[req.session["user_id"]], urls: urlDatabase };
    if (!users[req.session["user_id"]]); {
      res.redirect('/login');
    } 
    res.render("urls_new", templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.session["user_id"]], urls: urlDatabase };
  res.render('urls_login', templateVars);
});


app.get("/register", (req, res) => {
    const templateVars = { user: users[req.session["user_id"]], urls: urlDatabase };
    res.render("register", templateVars);
});



app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {  //works
    res.status(400).send('Email Or Password Input Missing');
  } else if (emailCheck(req.body.email)) { //doesn't work 
    res.status(400).send('Email Already Exists');
  } 

    const id = genNextId();
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { id, email, password: hashedPassword };
    users[id] = user;
    
    console.log(users);
    req.session['user_id'] = id;
    res.redirect('/urls');
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session["user_id"]) {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.session["user_id"]) {
    urlDatabase[req.body.longURL] = req.body.longURL;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
    let foundUser = null;
    const email = req.body.email;
    const password = req.body.password;
    if (!password || !email) { 
      res.status(400).send('Please Enter an Email and Password')
    }

    for (const id in users) {
      if (emailCheck(email)) {
        foundUser = users[id];
      }
    }

    if (foundUser === null) {
      res.status(400).send('No User With That Email Found'); 
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      res.send('Incorrect Password - Try Again');
    }
  
    req.session["user_id"] = foundUser.id;
    res.redirect("/urls");
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
