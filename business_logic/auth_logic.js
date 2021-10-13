let users = require("../databases/users_db.json");

function authenticateUser(username, password){
    return users.hasOwnProperty(username) && users[username].password == password;
}

function authenticateSignUpUser(username){
    return users.hasOwnProperty(username);
}

module.exports = {
    users, 
    authenticateUser, 
    authenticateSignUpUser
}