//HELPER FUNCTIONS

const getUserByEmail = function(email, database) {
    let user;
    for (const key in database) {
      if (database[key].email === email) {
        user = key;
      }
    } 
    return user;
  };


  const generateRandomString = () => {
    const length = 6;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  const urlsForUser = (id) => {
    let URLS = {};
    for (const url in urlDatabase) {
      if (urlDatabase[url].id === id) {
        URLS[url] = { longURL: urlDatabase[url].longURL, id: id };
      }
    }
    return URLS;
  };

  const emailCheck = function(emailInput) {
    for (const keys in users) {
      if (users[keys].email === emailInput) {
        return true;
      }
    }
    return false;
  }



  //USERS AND URL DATABASE

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

  const urlDatabase = {
    b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
    i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
  };


module.exports = { getUserByEmail, urlsForUser, generateRandomString, emailCheck, urlDatabase, users };