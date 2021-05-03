/*
Module that contains the Business Logic

Functions for...
User Business Logic - Create a User, Follow a User, Unfollow a User, Search a User, Read a User  (GOOD)
Person Business Logic - Create a Person, Follow a Person, Unfollow a Person, Search a Person, Read a Person 
Movie Business Logic - Create a Movie, Search a Movie, Read a Movie, Create a Review
Contributing User - make a contributing user

*/

let users = require("./users.json");
let movies = require("./movie-data-short.json");
let people = require("./people.json");
let reviews = require("./reviews.json");
const { v4: uuidv4 } = require('uuid');

function authenticateUser(username, password){
    return users.hasOwnProperty(username) && users[username].password == password;
}

function authenticateSignUpUser(username){
    return users.hasOwnProperty(username);
}

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
    if(!isValidUser(requestingUser)){
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
  
    if(!isValidUser(requestingUser)){
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

/*

MOVIE BUSINESS LOGIC - Create a Movie, Search a Movie, Read a Movie, Create a Review 

*/

function getMovie(requestingUser, movieID){
    if(!isValidUser(requestingUser)){
      return null;
    }
    length = Object.keys(movies).length

    for(i=0; i<length; i++){
        if(Object.values(movies)[i].imdbID == movieID){
            return Object.values(movies)[i];
        }
    }
    return null;
}

function createMovie(User, newMovie){
    if(contributingDoesExist(User)==false){
        return null;
    }
    if(newMovie.Title === null){
        return null;
    }

    let flag = false;
    movies.forEach(el => {
        if(el.Title === newMovie.Title){
            flag = true;
        }
    });
    if(flag==true){
        return null;
    }
    if(newMovie.Runtime == null || !(newMovie.Runtime>0) ){
        return null;
    }
    if(!(newMovie.Year > 0)){
        return null;
    }
    if(!((newMovie.imdbRating >= 0) && (newMovie.imdbRating <= 10)) ){
        return null;
    }
    if(newMovie.Plot == null){
        return null;
    }

    length = Object.keys(people).length
    flag = false;
    let x = '';
    let updateHistory = []

    x = newMovie.Director.split(',');
    for(i=0; i<x.length; i++){
        for(j=0; j<length; j++){
            if((Object.values(people)[j].name.toLowerCase()) == x[i].trim().toLowerCase()){
                flag = true;
                updateHistory.push(Object.values(people)[j]);
            }
        }
        if(flag == false){
            return null;
        }
    }

    flag = false;
    x = newMovie.Actors.split(',');
    for(i=0; i<x.length; i++){
        for(j=0; j<length; j++){
            if((Object.values(people)[j].name.toLowerCase()) == x[i].trim().toLowerCase()){
                flag = true;
                updateHistory.push(Object.values(people)[j]);
            }
        }
        if(flag == false){
            return null;
        }
    }

    flag = false;
    x = newMovie.Writer.split(',');
    for(i=0; i<x.length; i++){
        for(j=0; j<length; j++){
            if((Object.values(people)[j].name.toLowerCase()) == x[i].trim().toLowerCase()){
                flag = true;
                updateHistory.push(Object.values(people)[j]);
            }
        }
        if(flag == false){
            return null;
        }
    }
    
    newMovie.imdbID = uuidv4();

    for(i=0; i<updateHistory.length; i++){
        updateHistory[i].history.push({"id":newMovie.imdbID, "Title":newMovie.Title});
    }

    let list = newMovie.Actors.split(',');
    for(i=0; i<list.length; i++){
        let check = 0;
        personAdding = findPerson(list[i])
        tempList = newMovie.Actors.split(',');
        for(j=0; j<tempList.length; j++){
            personToBeAdded = findPerson(tempList[j])
            if(personToBeAdded.name.toLowerCase() == personAdding.name.toLowerCase()){
                check = 1;
            }
            for(k=0; k<personAdding.collaborators.length; k++){
                if(personAdding.collaborators[k].name.toLowerCase() == personToBeAdded.name.toLowerCase() ){
                    check = 1;
                }
            }

            if(check == 0){
                personAdding.collaborators.push({"id": personToBeAdded.id, "name": personToBeAdded.name})
                personToBeAdded.collaborators.push({"id": personAdding.id, "name": personAdding.name})
            }
        }
    }

    list = newMovie.Director.split(',');
    for(i=0; i<list.length; i++){
        let check = 0;
        personAdding = findPerson(list[i])
        tempList = newMovie.Director.split(',');
        for(j=0; j<tempList.length; j++){
            personToBeAdded = findPerson(tempList[j])
            if(personToBeAdded.name.toLowerCase() == personAdding.name.toLowerCase()){
                check = 1;
            }
            for(k=0; k<personAdding.collaborators.length; k++){
                if(personAdding.collaborators[k].name.toLowerCase() == personToBeAdded.name.toLowerCase() ){
                    check = 1;
                }
            }
            if(check == 0){
                personAdding.collaborators.push({"id": personToBeAdded.id, "name": personToBeAdded.name})
                personToBeAdded.collaborators.push({"id": personAdding.id, "name": personAdding.name})
            }
        }
    }

    list = newMovie.Writer.split(',');
    for(i=0; i<list.length; i++){
        let check = 0;
        personAdding = findPerson(list[i])
        tempList = newMovie.Writer.split(',');
        for(j=0; j<tempList.length; j++){
            personToBeAdded = findPerson(tempList[j])
            if(personToBeAdded.name.toLowerCase() == personAdding.name.toLowerCase()){
                check = 1;
            }
            for(k=0; k<personAdding.collaborators.length; k++){
                if(personAdding.collaborators[k].name.toLowerCase() == personToBeAdded.name.toLowerCase() ){
                    check = 1;
                }
            }
            if(check == 0){
                personAdding.collaborators.push({"id": personToBeAdded.id, "name": personToBeAdded.name})
                personToBeAdded.collaborators.push({"id": personAdding.id, "name": personAdding.name})
            }
        }
    }


    newMovie.imdbVotes = 1;
    newMovie.Reviews = [];

    sendNotifications(newMovie);
    movies.push(newMovie);

    return newMovie;
}

function sendNotifications(Movie){
    let str = '';
    str += Movie.Director + ','
    str += Movie.Writer + ','
    str += Movie.Actors
    let peopleList = [];

    peopleList = str.split(',')

    length = Object.keys(users).length

    for(i=0; i<length; i++){
        let user = Object.values(users)[i]
        let flag1 = 0;
        for(j=0; j< user.peopleFollowing.length; j++){

            for(k=0; k<peopleList.length; k++){

                if(user.peopleFollowing[j].name.toLowerCase() == peopleList[k].trim().toLowerCase()){
                    user.notifications.push(Movie.Title);
                    user.anyNotifs = true;
                    flag1 = 1;
                    break;
                }
            }
            if(flag1==1){
                break;
            }
        }
    }
}

function sendNotificationsReview(Movie, Review){
    length = Object.keys(users).length

    for(i=0; i<length; i++){
        let user = Object.values(users)[i]
        let flag1 = 0;
        for(j=0; j< user.usersFollowing.length; j++){

                if(user.usersFollowing[j].username.toLowerCase() == Review.user.toLowerCase()){
                    user.notifications.push(Movie.Title);
                    user.anyNotifs = true;
                    flag1 = 1;
                    break;
                }

            if(flag1==1){
                break;
            }
        }
    }
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

function addPerson(Obj, movieID){
    length = Object.keys(people).length
    let person;
    flag = 0;

    for(i=0; i<length; i++){
        if(Object.values(people)[i].name.toLowerCase()== Obj.name.trim().toLowerCase()){
            person = Object.values(people)[i]
            flag = 1;
        }

    }

    if(flag == 0){
        return null;
    }

    movies.forEach(m => {
        if(m.imdbID == movieID){       
            
            if(person.role.actor){
                list = m.Actors.split(',');

                for(i=0; i<list.length; i++){
                    if(list[i].trim().toLowerCase() == person.name.toLowerCase()){
                        return null;
                    }
                }

                for(i=0; i<list.length; i++){
                    flag = 0;
                    for(j=0; j<person.collaborators.length; j++){
                        
                        if(person.name.toLowerCase() == list[i].trim().toLowerCase()){
                            flag = 1;
                        }

                        if(person.collaborators[j].name.toLowerCase() == list[i].trim().toLowerCase()){
                            flag = 1;
                        }
                    }

                    length = Object.keys(people).length
                    let tempPerson;
                    for(j=0; j<length; j++){
                        if(Object.values(people)[j].name.toLowerCase() == list[i].trim().toLowerCase()){
                            tempPerson = Object.values(people)[j];
                        }

                    }
                    
                    if(flag == 0){
                        person.collaborators.push({"id": tempPerson.id, "name": tempPerson.name})
                        tempPerson.collaborators.push({"id": person.id, "name": person.name})
                    }
                }
                m.Actors = m.Actors + ", "+ person.name;
                person.history.push({"id": movieID, "Title":m.Title})
                sendNotifications(m);

            }else if(person.role.director){

                    list = m.Director.split(',');
                    for(i=0; i<list.length; i++){
                        if(list[i].trim().toLowerCase() == person.name.toLowerCase()){
                            return null;
                        }
                    }
    
                    for(i=0; i<list.length; i++){
                        flag = 0;
                        for(j=0; j<person.collaborators.length; j++){
                            if(person.name.toLowerCase() == list[i].trim().toLowerCase()){
                                flag = 1;
                            }
                            if(person.collaborators[j].name.toLowerCase() == list[i].trim().toLowerCase()){
                                flag = 1;
                            }
                        }
    
                        length = Object.keys(people).length
                        let tempPerson;
                        for(j=0; j<length; j++){
                            if(Object.values(people)[j].name.toLowerCase() == list[i].trim().toLowerCase()){
                                tempPerson = Object.values(people)[j];
                            }
    
                        }
                        
                        if(flag == 0){
                            person.collaborators.push({"id": tempPerson.id, "name": tempPerson.name})
                            tempPerson.collaborators.push({"id": person.id, "name": person.name})
                        }
                    }

                m.Director = m.Director + ", "+ person.name;
                person.history.push({"id": movieID, "Title":m.Title})
                sendNotifications(m);

            }else{

                    list = m.Writer.split(',');
                    for(i=0; i<list.length; i++){
                        if(list[i].trim().toLowerCase() == person.name.toLowerCase()){
                            return null;
                        }
                    }
    
                    for(i=0; i<list.length; i++){
                        flag = 0;
                        for(j=0; j<person.collaborators.length; j++){
                            if(person.name.toLowerCase() == list[i].trim().toLowerCase()){
                                flag = 1;
                            }
                            if(person.collaborators[j].name.toLowerCase() == list[i].trim().toLowerCase()){
                                flag = 1;
                            }
                        }
    
                        length = Object.keys(people).length
                        let tempPerson;
                        for(j=0; j<length; j++){
                            if(Object.values(people)[j].name.toLowerCase() == list[i].trim().toLowerCase()){
                                tempPerson = Object.values(people)[j];
                            }
    
                        }
                        
                        if(flag == 0){
                            person.collaborators.push({"id": tempPerson.id, "name": tempPerson.name})
                            tempPerson.collaborators.push({"id": person.id, "name": person.name})
                        }
                    }

                m.Writer = m.Writer + ", "+ person.name;
                person.history.push({"id": movieID, "Title":m.Title})
                sendNotifications(m);
            }
        }

    })

    return person;

}

function searchMovies(requestingUser, searchTerm){
    let results = [];
    if(!isValidUser(requestingUser)){
      return results;
    }

    movies.forEach(m => {
        if(m.Title.toLowerCase() == searchTerm.toLowerCase()){
            results.push({movie:m});
        }
    })
    movies.forEach(m => {
        if(m.Year == searchTerm){
            results.push({movie:m});
        }
    })

    movies.forEach(m => {
        if(m.imdbRating == null){
            m.imdbRating = 0;
        }
        if( (m.imdbRating) >= searchTerm && searchTerm <= 10){
            results.push({movie:m});
        }
    })

    movies.forEach(m => {
        if(m.Genre != ""){
            let list = m.Genre.toLowerCase().split(',')
            for(i=0; i<list.length; i++){
                if(list[i].trim() == searchTerm.toLowerCase()){
                    results.push({movie:m});
                }
            }
        }
    })
  
    return results;
}

function similarMovies(Movie){
    let list = Movie.Genre.split(',');
    count = 0;
    movieList = []

    movies.forEach(m => {
        let tempList = m.Genre.split(',');

        if(list.length >= tempList.length){
            for(i=0; i<list.length; i++){

                for(j=0; j<tempList.length; j++){

                    if(list[i] == tempList[j]){
                        count++
                    }

                }
            }

            if(count >= 2 && (m.Title != Movie.Title)){
                movieList.push(m);
            }

            count=0;

        }else{
            for(i=0; i<tempList.length; i++){

                for(j=0; j<list.length; j++){

                    if(list[j] == tempList[i]){
                        count++
                    }

                }
            }

            if(count >= 2 && (m.Title != Movie.Title)){
                movieList.push(m);
            }

            count=0;

        }
    })

    return movieList;

}

function createReview(User, Review, movieID){
    if(Review == undefined){
        return null;
    }
    if(Review.score > 10 ||  Review.score < 0 ){
        return null;
    }

    flag = false;
    let Movie;
    movies.forEach(m => {
        if(m.imdbID == movieID){
            Movie = m;
            flag = true;
        }
    })

    if(flag=false){
        return null;
    }
    if(Movie==undefined){
        return null;
    }

    if(Review.summary == null){
        Review.summary = "";
    }
    if(Review.fullSummary== null){
        Review.fullSummary = "";
    }
    Review.id = uuidv4();
    Review.user = User.username;

    movies.forEach(el => {
        if(el.Title === Movie.Title){
            el.Reviews.push(Review)
        }
    });
    length = Object.keys(users).length 
    for(i=0; i<length; i++){
        if(Object.values(users)[i].username.toLowerCase() == Review.user.toLowerCase()){
            Object.values(users)[i].moviesReviewed.push({"id": movieID,"Title": Movie.Title})
            break;
        }
    }

    Movie.imdbVotes += 1;

    reviews[Review.id] = Review

    sendNotificationsReview(Movie, Review)

    return Movie;
}

function recommendedMovies(User){
    let list = [];
    flag = 0;

    for(i=0; i<User.usersFollowing.length ; i++){
        length = Object.keys(users).length

        for(j=0; j<length; j++){

            if(Object.values(users)[j].id == User.usersFollowing[i].id){

                for(k=0; k< Object.values(users)[j].moviesReviewed.length; k++){
                    let movie = Object.values(users)[j].moviesReviewed[k];

                    for(l=0; l<list.length; l++){
                        if(list[l].Title == movie.Title ){
                            flag = 1;
                            break;
                        }
                    }

                    if(flag == 1){
                        continue;
                    }else{
                        list.push(movie)
                    }

                    flag = 0;
                }

            }
        }

    }

    flag = 0;

    for(i=0; i<User.peopleFollowing.length ; i++){
        length = Object.keys(people).length

        for(j=0; j<length; j++){
            
            if(Object.values(people)[j].id == User.peopleFollowing[i].id){

                for(k=0; k< Object.values(people)[j].history.length; k++){

                    let movie = Object.values(people)[j].history[k];

                    for(l=0; l<list.length; l++){
                        if(list[l].Title == movie.Title ){
                            flag = 1;
                            break;
                        }
                    }

                    if(flag == 1){
                        continue;
                    }else{
                        list.push(movie)
                    }

                    flag = 0;
                    
                }

            }
        }

    }

    let random = list.sort(() => .5 - Math.random()).slice(0,5);

    return random;
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
    movies, 
    people,
    checkUser,
    recommendedMovies, 
    createPerson,
    createUser, 
    checkPerson, 
    getUser, 
    addPerson, 
    isValidUser,
    searchUsers,
    followUser,
    unfollowUser,
    isValidPerson, 
    searchPeople, 
    getPerson, 
    followPerson,
    unfollowPerson,
    getMovie, 
    searchMovies, 
    createMovie, 
    createReview, 
    createContributingUser, 
    authenticateUser, 
    peopleList,
    similarMovies,  
    authenticateSignUpUser
}