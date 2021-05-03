const express = require('express');
const path = require('path');
const fs = require("fs");
let app = express();
app.set("view engine", "pug");
const model = require("./business_logic.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

const session = require('express-session')
app.use(session({secret: 'some secret here'}))
app.use(express.urlencoded({extended: true}));

app.use("/", function(req, res, next){
    next()
});

app.use(express.static("public"))
 
const { writer } = require('repl');

//Loads pictures used in website
app.get("/Frame%201.png", (req, res) => {
    fs.readFile('Frame 1.png', function(err, data){
        if (err){
            res.status(404).send("error: no such file!")
        }
        res.status(200).type('.png').send(data)
    })
})

app.get("/movie.png", (req, res) => {
    fs.readFile('movie.png', function(err, data){
        if (err){
            res.status(404).send("error: no such file!")
        }
        res.status(200).type('.png').send(data)
    })
})

app.get("/chair.png", (req, res) => {
    fs.readFile('chair.png', function(err, data){
        if (err){
            res.status(404).send("error: no such file!")
        }
        res.status(200).type('.png').send(data)
    })
})

app.get("/user.png", (req, res) => {
    fs.readFile('user.png', function(err, data){
        if (err){
            res.status(404).send("error: no such file!")
        }
        res.status(200).type('.png').send(data)
    })
})

app.get("/search", function(req, res){
    if(req.session.loggedin){
        res.render("search.pug", {"users": '', "movies":'', "people":''});
    }else{
            res.status(404).send("There is no User Logged In.");
    }  
})

//Requests for movie functionalities ---------------------------------
app.post('/searchMovie', function(req, res){
    if(req.session.loggedin){
        if(req.body == null){
            res.status(404).send("Not a valid Movie")
        }else{
            res.redirect("/movies?search="+ req.body.movie);
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    } 
})

app.get("/movies", function (req, res){
    if(req.session.loggedin){
        if(req.query.search == undefined){
            req.query.search = "";
        }
        let result = model.searchMovies(req.session.user, req.query.search);
        res.format({
            'text/html': function(){
                if(result == null){
                    res.status(404).send("Not a valid Movie")
                }else{
                    res.status(200).render("search.pug", {"users":'', "movies": result, "people": '', "session": req.session})
                }
            },
            'application/json': function(){
                if(result == null){
                    res.status(404).send(result[0])
                }else{
                    res.status(200).send(JSON.stringify(result[0]))
                }
            }
        }
    
        )
    
    }else{
            res.status(404).send("There is no User Logged In.");
    } 

    
})

app.get("/movies/:movie", function(req, res){
    if(req.session.loggedin){
        let result = model.getMovie(req.session.user, req.params.movie);
    res.format({
        'text/html': function(){
            if(result == null){
                res.status(404).send("Not a valid ID")
              }else{
                  genre = result.Genre.split(',')
                  writers = result.Writer.split(',');
                  newWriters = model.peopleList(writers);
                  actors = result.Actors.split(',')
                  newActors = model.peopleList(actors);
                  director = result.Director.split(',')
                  newDirectors = model.peopleList(director);
                  similar = model.similarMovies(result);
                  res.status(200).render("moviePage.pug", {"director": newDirectors, "actors": newActors, "writer": newWriters, "genre": genre, "movie": result, "session": req.session, "similar": similar})
              }
        },
        'application/json': function(){
            if(result == null){
                res.status(404).send("Not a valid ID")
              }else{
                genre = result.Genre.split(',')
                writers = result.Writer.split(',')
                newWriters = model.peopleList(writers);
                actors = result.Actors.split(',')
                newActors = model.peopleList(actors);
                director = result.Director.split(',')
                newDirectors = model.peopleList(director);
                similar = model.similarMovies(result);
                res.status(200).send(JSON.stringify({"director": director, "actors": actors, "writer": writers, "genre": genre, "movie": result, "session": req.session, "similar": similar}))
              }
        }
    }
    
    )
    
    }else{
            res.status(404).send("There is no User Logged In.");
    } 
})

app.post("/movies", function(req, res){
    if(req.session.loggedin){
        let result = model.createMovie(req.session.user, req.body);
        if(result){
            res.status(201).render("createMovie.pug")
        }else{
          res.status(405).send("Failed to add movie.");
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

//Requests for user functionalities ---------------------------------

app.post('/searchUser', function(req, res){
    if(req.session.loggedin){
        if(req.body == null){
            res.status(404).send("Not a valid User")
        }else{
            res.redirect("/users?search="+ req.body.user);
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

app.get("/users", function(req, res){
    if(req.session.loggedin){
        if(req.query.search == undefined){
            req.query.search = "";
        }
        //return people page with given information
        let result = model.searchUsers(req.session.user, req.query.search);
        res.format({
            'text/html': function(){
                if(result == null){
                    res.status(404).send("Not a valid User")
                }else{
                    res.status(200).render("search.pug", {"users":result, "movies":'', "people": '', "session": req.session})
                }
            },
            'application/json': function(){
                if(result == null){
                    res.status(404).send("Not a valid User")
                }else{
                    res.status(200).send(JSON.stringify({"users":result, "movies":'', "people": '', "session": req.session}))
                }
            }
        }
        
        )
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

app.get("/users/:user", function(req, res){
    if(req.session.loggedin){
        let result = model.getUser(req.session.user, req.params.user);
        let check = model.checkUser(req.session.user, req.params.user);
        res.format({
            'text/html': function(){
                if(result == null){
                    res.status(404).send("Not a valid ID")
                }else{
                    res.status(200).render("userPage.pug", {"user": result, "session": req.session, "check":check})
                }
            },
            'application/json': function(){
                if(result == null){
                    res.status(404).send("Not a valid ID")
                }else{
                    res.status(200).send(JSON.stringify({"user": result, "session": req.session, "check":check}))
                }
            }
        })
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})


//Requests for people functionalities ---------------------------------
app.post('/searchPerson', function(req, res){
    if(req.session.loggedin){
        if(req.body == null){
            res.status(404).send("Not a valid Person")
        }else{
            res.redirect("/people?search="+ req.body.person);
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

app.get("/people", function(req, res){
    if(req.session.loggedin){
        if(req.query.search == undefined){
            req.query.search = "";
        }
        let result = model.searchPeople(req.session.user, req.query.search);
        res.format({
            'text/html': function(){
                if(result == null){
                    res.status(404).send("Not a valid Movie")
                }else{
                    res.status(200).render("search.pug", {"users":'', "movies":'', "people": result, "session": req.session})
                }
            },
            'application/json': function(){
                if(result == null){
                    res.status(404).send("Not a valid Movie")
                }else{
                    res.status(200).send(JSON.stringify({"users":'', "movies":'', "people": result, "session": req.session}))
                }
            }
        })
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

app.get("/people/:person", function(req, res){
    if(req.session.loggedin){
        let result = model.getPerson(req.session.user, req.params.person);
        let check = model.checkPerson(req.session.user, req.params.person);
        res.format({
            'text/html': function(){
                if(result == null){
                    res.status(404).send("Unknown user")
                  }else{
                      res.status(200).render("peoplePage.pug", {"person": result, "session": req.session, "check":check})
                  }
            },
            'application/json': function(){
                if(result == null){
                    res.status(404).send("Unknown user")
                  }else{
                      res.status(200).send(JSON.stringify({"person": result, "session": req.session, "check":check}))
                  }
            }
        })
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

//Other functions that handle Requests -----------------------------------------
app.get("/moviepage", function(req, res){res.status(200).render("moviePage.pug");})
app.get("/createreview", function(req, res){res.status(200).render("createReview.pug");})
app.get("/peoplepage", function(req, res){res.status(200).render("peoplePage.pug");})
app.get("/userpage", function(req, res){res.status(200).render("userPage.pug");})
app.get("/userprofile", function(req, res){res.status(200).redirect("/users/"+ req.session.user.id);})
app.get("/profile", userProfile);

app.get("/", function(req, res){
    if(req.session.loggedin){
        let user = req.session.user
        res.status(200).render("userHomepage.pug", {"user": user, "session": req.session})
    }else{
        res.status(200).render("homePage.pug");
    }
})

app.get("/signin", function(req, res){
    if(!req.session.loggedin){
        res.status(200).render("signinPage.pug");
    }else{
        res.status(404).send("A user is already logged in");
    }
})

app.get("/signup", function(req, res){
    if(!req.session.loggedin){
        res.status(200).render("signupPage.pug");
    }else{
        res.status(404).send("A user is already logged in");
    }
})

app.get("/createperson", function(req, res){
    if(!req.session.user.regularUser){
        res.status(200).render("createPerson.pug");
    }else{
        res.status(404).send("You are not a Contributing User, must change Account Type");
    }
})
app.get("/createmovie", function(req, res){
    if(!req.session.user.regularUser){
        res.status(200).render("createMovie.pug");
    }else{
        res.status(404).send("You are not a Contributing User, must change Account Type");
    }
})
app.get("/home", function(req, res){
    if(req.session.loggedin){
    let user = req.session.user
    if(user != null){
        res.status(200).render("userHomepage.pug", {"user": user, "session": req.session})
    }else{
        res.status(404).send("Failed.");
    }
    }else{
        res.status(404).send("There is no User Logged In.");
    }
})
app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect('/')
})
app.get("/create", function(req, res){
    if(req.session.loggedin){
        if(req.session.user){
            res.status(200).render("createPage.pug");
        }
        else{
            res.status(403).send("Cannot View")
        }
        
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

app.get("/status", function(req, res){
    if(req.session.loggedin){
        let result = model.createContributingUser(req.session.user);
        if(result == null){
            res.status(404).send("Failed to make change status.");
        }else{
            res.status(200).redirect("/profile")
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

function userProfile (req, res){

    if(req.session.loggedin){
        let result = model.recommendedMovies(req.session.user);
        if(model.authenticateSignUpUser(req.session.username)){
            res.status(200).render("userprofilePage.pug", {"user": req.session.user, "session": req.session, "movies": result})    
        }else{
            res.status(401).send("Invalid Credentials")
        }
        
    }else{
            res.status(404).send("There is no User Logged In.");
    }
}

//POST Requests
app.post("/add/:movieID", function(req, res){
    if(req.session.loggedin){
        let result = model.addPerson(req.body, req.params.movieID);
        if(result == null){
            res.status(404).send("Failed to add person.");
        }else{
            res.status(201).redirect("/movies/"+req.params.movieID);
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

app.post("/users", function(req, res){
    if(req.session.loggedin){
        let result = model.createPerson(req.body);
        if(result == null){
            res.status(404).send("Failed to add person.");
        }else{
            res.status(201).render("createPerson.pug")
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})
app.post("/reviews/:movieid", function(req, res){
    if(req.session.loggedin){
        let result = model.createReview(req.session.user, req.body, req.params.movieid);
        if(result == null){
            res.status(404).send("Failed to add review.");
        }else{
            res.status(200).redirect("/movies/"+result.imdbID)
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})
app.post("/followuser/:user", function (req, res){
    if(req.session.loggedin){
        let result = model.followUser(req.session.user, req.params.user);
        if(result == null){
            res.status(404).send("Failed to follow user.");
        }else{
            res.status(200).redirect("/profile")
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})
app.post("/unfollowuser/:user", function (req, res){
    if(req.session.loggedin){
        let result = model.unfollowUser(req.session.user, req.params.user);
        if(result == null){
            res.status(404).send("Failed to unfollow user.");
        }else{
            res.status(200).redirect("/profile")
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})
app.post("/followperson/:person", function (req, res){
    if(req.session.loggedin){
        let result = model.followPerson(req.session.user, req.params.person);
        if(result == null){
            res.status(404).send("Failed to follow person.");
        }else{
            res.status(200).redirect("/profile")
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})
app.post("/unfollowperson/:person", function (req, res){
    if(req.session.loggedin){
        let result = model.unfollowPerson(req.session.user, req.params.person);
        if(result == null){
            res.status(404).send("Failed to follow person.");
        }else{
            res.status(200).redirect("/profile")
        }
    
    }else{
            res.status(404).send("There is no User Logged In.");
    }
})

app.post("/signinUser", logInUser)
app.post("/signupUser", signUpUser, logInUser)

function logInUser(req, res, next){
    if(session.loggedin == true){
        res.send("You are already logged in")
    }else{
        if(model.authenticateUser(req.body.username, req.body.password)){
            req.session.loggedin = true;
            req.session.username = req.body.username
            req.session.user = model.users[req.body.username] 
            let result = model.recommendedMovies(req.session.user); 
            res.status(201).render("userprofilePage.pug", {"user": req.session.user, "session": req.session, "movies":result})  
            req.session.user.notifications = [];
            req.session.user.anyNotifs = false;
        }else{
            res.status(404).send("Invalid Credentials")
        }
    }
}

function signUpUser(req, res, next){
    let newUser = req.body;

    if(newUser.username == null || newUser.password == null){
        res.status(404).redirect("signUpUser");
    }else if (model.authenticateSignUpUser(newUser.username)){
        res.status(201).send("Username already exists! Enter another one");
    }else{
        model.createUser(newUser)
        next();
    }

}

app.listen(3000);
console.log("Server listening at http://localhost:3000");

