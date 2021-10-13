let users = require("../databases/users_db.json");
let movies = require("../databases/movie_db.json");
let people = require("../databases/people_db.json");
let reviews = require("../databases/reviews_db.json");

let userController = require("./user_logic.js");
let personController = require("./person_logic.js");

const { v4: uuidv4 } = require('uuid');

/*

MOVIE BUSINESS LOGIC - Create a Movie, Search a Movie, Read a Movie, Create a Review 

*/

function getMovie(requestingUser, movieID){
    if(!userController.isValidUser(requestingUser)){
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
    if(userController.contributingDoesExist(User)==false){
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
        personAdding = personController.findPerson(list[i])
        tempList = newMovie.Actors.split(',');
        for(j=0; j<tempList.length; j++){
            personToBeAdded = personController.findPerson(tempList[j])
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
        personAdding = personController.findPerson(list[i])
        tempList = newMovie.Director.split(',');
        for(j=0; j<tempList.length; j++){
            personToBeAdded = personController.findPerson(tempList[j])
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
        personAdding = personController.findPerson(list[i])
        tempList = newMovie.Writer.split(',');
        for(j=0; j<tempList.length; j++){
            personToBeAdded = personController.findPerson(tempList[j])
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

function addMovie(Obj, movieID){
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
    if(!userController.isValidUser(requestingUser)){
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

module.exports = {
    users, 
    movies, 
    people,
    recommendedMovies, 
    addMovie, 
    getMovie, 
    searchMovies, 
    createMovie, 
    createReview, 
    similarMovies,  
}