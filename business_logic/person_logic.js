let users = require("../databases/users_db.json");
let people = require("../databases/people_db.json");

let userController = require("./user_logic.js");

const { v4: uuidv4 } = require('uuid');
/*

PERSON BUSINESS LOGIC - Create a Person, Follow a Person, Unfollow a Person, Search a Person, Read a Person 

*/

function createPerson(newPerson){
    if(newPerson.name === null){
        return null;
    }
    let flag = false;
    length = Object.keys(people).length
    for(i=0; i<length; i++){
        if(Object.values(people)[i].name.toLowerCase() == newPerson.name.toLowerCase()){
            flag = true;
        }
    }
    if(flag==true){
        return null;
    }

    newPerson.id = uuidv4();
    if(newPerson.role.toLowerCase() == "actor" || newPerson.role.toLowerCase() == "actress"){
        newPerson.role = {actor: true, director: false, writer: false};
    }else if(newPerson.role.toLowerCase() == "writer"){
        newPerson.role = {actor: false, director: false, writer: true};
    }else if(newPerson.role.toLowerCase() == "director"){
        newPerson.role = {actor: false, director: true, writer: false};
    }else{
        return null;
    }
    newPerson.history = [];
    newPerson.collaborators = [];

    people[newPerson.name] = newPerson

    return people[newPerson.name]
}

function isValidPerson(personObj){
    if(!personObj){
      return false;
    }
    if(!personObj.name || !people.hasOwnProperty(personObj.name)){
      return false;
    }
    return true;
}

function getPerson(requestingUser, personID){
    if(!userController.isValidUser(requestingUser)){
      return null;
    }
    length = Object.keys(people).length

    for(i=0; i<length; i++){
        if(Object.values(people)[i].id == personID){
            return Object.values(people)[i];
        }
    }
    return null;
}

function peopleList(tempList){
    let newList = [];
    length = Object.keys(people).length
    for(i=0; i<tempList.length; i++){
        for(j=0; j<length; j++){
            if(Object.values(people)[j].name.toLowerCase() == tempList[i].trim().toLowerCase()){
                newList.push(Object.values(people)[j])
            }
        }
    }

    return newList;
}

function searchPeople(requestingUser, searchTerm){
    let results = [];
  
    if(!userController.isValidUser(requestingUser)){
      return results;
    }
  
    for(name in people){
      let person = people[name];
      if(person.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0){
          results.push(person);
      }
    }
    return results;
}

function followPerson(User, Person){
    let newPerson;
    length = Object.keys(people).length

    for(i=0; i<length; i++){
        if(Object.values(people)[i].id == Person){
            newPerson = Object.values(people)[i];
        }
    }
    User.peopleFollowing.push({"id":newPerson.id, "name":newPerson.name});

    length = Object.keys(users).length 
    for(i=0; i<length; i++){
        if(Object.values(users)[i].username.toLowerCase() == User.username.toLowerCase()){
            Object.values(users)[i].peopleFollowing = User.peopleFollowing;
            break;
        }
    }

    return User.peopleFollowing;
}


function unfollowPerson(User, Person){
    let index = 0;
    if(User.peopleFollowing.length>0){
        for(i=0; i<User.peopleFollowing.length; i++){
            if(User.peopleFollowing[i] == Person){
                index = i;
                break;
            }
        }
    }else{
        index=0;
    }
    
    if(index == undefined){
        return null;
    }
    User.peopleFollowing.splice(index, 1);

    length = Object.keys(users).length 
    for(i=0; i<length; i++){
        if(Object.values(users)[i].username.toLowerCase() == User.username.toLowerCase()){
            Object.values(users)[i].peopleFollowing = User.peopleFollowing;
            break;
        }
    }

    return User.peopleFollowing;
}

function checkPerson(User, Id){
    flag = 0;
    for(i=0; i<User.peopleFollowing.length; i++){
        if(User.peopleFollowing[i].id == Id){
            flag = 1;
            break;
        }
    } 
    if(flag==0){
        return false;
    }
    return true;
}

function findPerson(Name){
    length = Object.keys(people).length

    let tempPerson;
    for(x=0; x<length; x++){
        if(Object.values(people)[x].name.toLowerCase() == Name.trim().toLowerCase()){
            tempPerson = Object.values(people)[x];
            return tempPerson;
        }
    }

    return null
}

module.exports = {
    users, 
    people,
    createPerson,
    checkPerson, 
    findPerson,
    isValidPerson, 
    searchPeople, 
    getPerson, 
    followPerson,
    unfollowPerson,
    peopleList,
}