
/*
Rough outline for some objects I will have:

users = {id, name, lastname, password, regularuser, follow(id's of users)};
movies = {id, thetitle, releaseyear, average rating, runtime, plot, genrekeywords, people, similarmovies};
people = {id, job, name, lastname, movies(id's of movies), collaborators}
newmovies = {writer(id's of people), director(id's of people), and actor(id's of people)}

Examples of types of data that could be stored:
- If the user is a regular user - Boolean 
- Rating - Integer 
- Name - String
- List of people someone follows - List

*/ 

function Tester(){
    console.log("-------REACHED FUNCTION---------")
}

function unfollowPeople(){
    let peopleFollowingList = document.getElementById("peopleFollowingList");
    getDivs = peopleFollowingList.getElementsByTagName("div");
    let count=0;

    for(let i =0; i < getDivs.length; i++){
        if(getDivs[i].getElementsByTagName("input")[0].checked==true){
            getDivs[i].remove()
            console.log("hi")
            count++;
        }
        
    }
    for(let x =0; x < count; i++){
        for(let i =0; i < getDivs.length; i++){
            if(getDivs[i].getElementsByTagName("input")[0].checked==true){
                getDivs[i].remove()
            }
            
        }
    }
}

function unfollowUsers(){
    let userFollowingList = document.getElementById("userFollowingList");
    getDivs = userFollowingList.getElementsByTagName("div");
    let count=0;

    for(let i =0; i < getDivs.length; i++){
        if(getDivs[i].getElementsByTagName("input")[0].checked==true){
            getDivs[i].remove()
            count++;
        }
        
    }
    
    for(let x =0; x < count; i++){
        for(let i =0; i < getDivs.length; i++){
            if(getDivs[i].getElementsByTagName("input")[0].checked==true){
                getDivs[i].remove()
            }
            
        }
    }
}