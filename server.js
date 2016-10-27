/**
 * Created by Maheshi.Hemachandra on 10/25/2016.
 */
var firebase = require("firebase");
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var config = {
    apiKey: "AIzaSyDLUpdtV-WPzKo3_4E2EnzcLMy_Cved_DU",
    authDomain: "whiteboard-10ec5.firebaseapp.com",
    databaseURL: "https://whiteboard-10ec5.firebaseio.com",
    storageBucket: "whiteboard-10ec5.appspot.com",
    messagingSenderId: "867522105303"
};

firebase.initializeApp(config);

var dbRef = firebase.database().ref('users');

var port = process.env.PORT || 3981;

app.put('/coursesignup', function (req, res) {
    var school = req.body.school;
    var course = req.body.course;
    //Reference the course table in firebase
    dbRef.child(school)
        .orderByChild("course")
        .equalTo(course)
        .once("value", function(snapshot) {
            if (!snapshot.exists()) {
                dbRef.child(school).push({
                    course: course
                });
                console.log("New course added!");
                res.send("0");
                return;
            } else {
                console.log("You have already signed up for this course!");
                res.send("1");
            }
        });
});

app.put('/login', function (req, res) {
    var user=req.body.userid;
    var pass=req.body.password;
    var dbRef1=dbRef;
    dbRef.child(user).once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            if (pass !== snapshot.child("Passwd").val()) {
                console.log("Invalid password. Retry!");
                res.send("2");
                return;
            } else {
                var datetime = Date();
                console.log("Login Successful!");
                window.localStorage.setItem('username', user);
                dbRef1.child(user).push({logintime: datetime});
                res.send("0");   // Code never reaches here need to investigate
                return;
            }
        } else {
            console.log("Invalid user id. Please signup.");
            res.send("1");
        }
    });

});

app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
