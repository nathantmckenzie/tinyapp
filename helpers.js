//HELPER FUNCTIONS

//GETS A USER BASED ON THE EMAIL INPUT
const getUserByEmail = function(email, database) {
    let user;
    for (const key in database) {
      if (database[key].email === email) {
        user = key;
      }
    } 
    return user;
  };


//GENERATES A RANDOM, UNIQUE ALPHANUMERICAL VALUE THAT WILL BE THE ID FOR EACH NEW USER
  const generateRandomString = () => {
    const length = 6;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  //CREATES AN OBJECT THAT WILL BE INSERTED INTO THE USERS OBJECT. THIS OBJECT WILL CONTAIN THE USER ID
  //AND THE LONG URL THAT WAS USED BY THE USER OF THAT USER ID
  const urlsForUser = (id) => {
    let URLS = {};
    for (const url in urlDatabase) {
      if (urlDatabase[url].id === id) {
        URLS[url] = { longURL: urlDatabase[url].longURL, id: id };
      }
    }
    return URLS;
  };


  //USERS AND URL DATABASE
  const users = { 
    "1": {
      id: "random",
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
    "2": {
      id: "2",
      email: "usesdfffar@example.com", 
      password: "puasdfle-monkey-dinosaur"
    }
  }

  const urlDatabase = {
    b6UTxQ: { id: "random", longURL: "https://www.tsn.ca" },
    i3BoGr: { id: "aJ48lW", longURL: "https://www.google.ca" }
  };


module.exports = { getUserByEmail, urlsForUser, generateRandomString, urlDatabase, users };