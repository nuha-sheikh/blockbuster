let users = require("../databases/users_db.json");

const { v4: uuidv4 } = require('uuid');

/*
USER BUSINESS LOGIC - Create a User, Follow a User, Unfollow a User, Search a User, Read a User 
*/

function createUser(newUser){
    if(!newUser.username || !newUser.password){
        return null;
    }

    if(users.hasOwnProperty(newUser.username)){
        return null;
    }

    newUser.id = uuidv4();
    newUser.regularUser = true;
    newUser.followers = [];
    newUser.peopleFollowing = [];
    newUser.usersFollowing = [];
    newUser.moviesReviewed = [];
    newUser.recommendedMovies = [];
    newUser.notifications = []
    newUser.anyNotifs = false

    users[newUser.username] = newUser;

    return users[newUser.username];
}

//Helper function to verify a user object exists, has a username and that a user with that name exists
function isValidUser(userObj){
    if(!userObj){
      return false;
    }
    if(!userObj.username || !users.hasOwnProperty(userObj.username)){
      return false;
    }
    return true;
}

function getUser(requestingUser, userID){
    if(!isValidUser(requestingUser)){
      return null;
    }
    length = Object.keys(users).length

    for(i=0; i<length; i++){
        if(Object.values(users)[i].id == userID){
            return Object.values(users)[i];
        }
    }
    return null;
}

function searchUsers(requestingUser, searchTerm){
    let results = [];
    if(!isValidUser(requestingUser)){
      return results;
    }

    for(username in users){
      let user = users[username];
      if(requestingUser.username.toLowerCase() != user.username.toLowerCase()){
        if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0){
            results.push(user);
        }
      }
    }
  
    return results;
}

function followUser(User, otherUser){
    let newUser;
    length = Object.keys(users).length

    for(i=0; i<length; i++){
        if(Object.values(users)[i].id == otherUser){
            newUser = Object.values(users)[i];
        }
    }
    User.usersFollowing.push({"id":newUser.id, "username":newUser.username})

    length = Object.keys(users).length 
    for(i=0; i<length; i++){
        if(Object.values(users)[i].username.toLowerCase() == User.username.toLowerCase()){
            Object.values(users)[i].usersFollowing = User.usersFollowing;
            break;
        }
    }

    return User.usersFollowing;
}

function unfollowUser(User, otherUser){
    let index = 0;
    for(i=0; i<User.usersFollowing.length; i++){
        if(User.usersFollowing[i].id == otherUser
            ){
            index = i;
            break;
        }
    }
    if(index == undefined){
        return null;
    }
    User.usersFollowing.splice(index, 1);

    length = Object.keys(users).length 
    for(i=0; i<length; i++){
        if(Object.values(users)[i].username.toLowerCase() == User.username.toLowerCase()){
            Object.values(users)[i].usersFollowing = User.usersFollowing;
            break;
        }
    }

    return User.usersFollowing;
}

function checkUser(User, Id){
    flag = 0;
    for(i=0; i<User.usersFollowing.length; i++){
        if(User.usersFollowing[i].id == Id){
            flag = 1;
            break;
        }
    } 
    if(flag==0){
        return false;
    }
    return true;
}

/*
CONTRIBUTING USERS - make a contributing user, check if user is a contributing user 
*/

function createContributingUser(User){
    if(User==null){
        return false
    }
    if(User.regularUser == false){
        User.regularUser = true;
    }else{
        User.regularUser = false;
    }

    return User;
}

function contributingDoesExist(User){
    if(User==null){
        return false;
    }
    if(User.regularUser == false){
        return true;
    }
    return false;
} 

module.exports = {
    users, 
    checkUser,
    createUser, 
    getUser, 
    isValidUser,
    searchUsers,
    followUser,
    unfollowUser,
    createContributingUser
}