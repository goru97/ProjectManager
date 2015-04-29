var mongoose = require('mongoose'),
    User = require('./models/user-model');
    Project = require('./models/project-model');

var connStr = 'mongodb://localhost:27017/test';
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});



var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {

	res.json('hooray! welcome to our api!');	
});



//REST API for sign-in
    router.route('/sign-in')
    .post(function(req, res) {
          // fetch user and test password verification
    //User.findOne({ username: 'jmar777' }, function(err, user) {
if(req.body.username == null || req.body.password == null)
    res.json({ message: 'User name or password cannot be null' });
else{
        User.findOne({ username: req.body.username }, function(err, user) {
        if (err) throw err;
       console.log(err);
        // test a matching password
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) throw err;
            console.log(req.body.password, isMatch); // -> Password123: true

            if(isMatch)
                 res.json({ message: 'sign-in Successful' });
             else
               res.json({ message: 'sign-in failed' }); 
        });

    });
}

    });


//REST API for Registration
    router.route('/registerUser')
    .post(function(req, res) {
          // fetch user and test password verification
    //User.findOne({ username: 'jmar777' }, function(err, user) {
if(req.body.username == null || req.body.username == '') 
    res.json({ message: 'User name cannot be left blank' });
else if(req.body.password == null || req.body.password == '')
    res.json({ message: 'Password cannot be left blank' });
else if(req.body.name == null || req.body.name == '')
    res.json({ message: 'Name cannot be left blank' })
else if(req.body.email == null || req.body.email == '')
    res.json({ message: 'Email cannot be left blank' })
else{

     // create a user a new user
var newUser = new User({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password
});

// save user to database
newUser.save(function(err) {
  //  if (err) throw err;
  if (err) 
 res.json({ message: 'User already exists!' }); 
  else
  res.json({ message: 'Registration Successful!' , code: 200 }); 
});
}
});



//REST API for opening existing project
   router.route('/openProject')
    .get(function(req, res) {
      console.log('Opening');


var project = new Project({
project_id: "1",
project_name: "DRC"
    });

//var newUser = new User({
  //  projects: [project]
//});

User.findOneAndUpdate({username:'goru97'},{ $push: { projects: project } }, {upsert:true}, function(err, users) {
if(err)
  console.log(err);
else{
  res.json(users)
}
}
);
  
/*
project.save(function (err) {
    if (err) 
      console.log(err);
    // thats it!
  });
*/
       // create a user a new user



/*
// save user to database
newUser.save(function(err) {
  //  if (err) throw err;
  if (err) 
 res.json({ message: 'User already exists!' }); 
  else{
      
      User.find({})
            .populate('projects')
            .exec(function(error, users) {
              if(error)
                console.log(error);
              else{
                res.json(users.projects)
            }
            });

//res.json({ message: 'Registration Successful!' , code: 200 }); 

  }
});*/


    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);