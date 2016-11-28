var express = require('express');
var fs = require('fs');
var logStream = null;
var flushTimer = null;

function openLogStream() {
   if( !logStream ) {
      logStream = fs.createWriteStream('quizResults/results.txt', {'flags': 'a'});
   }
}
//
// this is your magic password to access quiz results
// currently the quiz supports a single instructor and a single quiz.
//
var instructorCode = "BrettRunsFast";

var app = express();

app.use(express.static("static"));

app.get('/results', function(req, res){
    res.end();
});

//
// enable presentquiz
//
app.post('/startquiz', function(req, res) {
   console.log("start of quiz");
   openLogStream();
   logStream.write("#quiz_start "+  ((new Date()) + "\n"));
   res.end();
});

//
// upload a quiz question. 
//
app.post('/submitAnswers', function(request, response) {
  var body = [];
  //
  // Guess what? You forgot to start a quiz and students are now trying answer the quiz.
  // Have no fear, we'll open the file for you so the values aren't lost (which tends to 
  // iritate people. 
  //
  openLogStream(); 
  request.on('data', function(chunk) {
     body.push(chunk);
  }).on('end', function() {
     body = Buffer.concat(body).toString();
     logStream.write(body + "\n");
     response.end();
    
  });
});

//
// Close the quiz. Answers will still be accepted and stored but they won't be part of the quiz results 
// per se.
//
app.post('/endquiz', function(req, res) {
  console.log("end of quiz");
  logStream.end("#end of quiz\n");
  logStream = null;
});

app.listen(8080, function() {
    console.log("phyquiz listening on port 8080");
});
