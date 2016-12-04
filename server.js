var express = require('express');
var fs = require('fs');
var logStream = null;
var flushTimer = null;
var quizResultsPath = "quizResults/results.txt";
var quizInProgress = false;

//
// this is your magic passphrase to access instructor functions.
// currently the quiz supports a single instructor and a single quiz.
//
var instructorCode = "BrettRunsFast";

function getHeadersAsCSV(aline) {
   var record = JSON.parse(aline);
   var fields = "Name,Student#, Result, Answers";
   var t;
   for( t in record.answers ) {
      fields += "," + t; 
   }
   fields += ", Correctness";
   for( t in record.answers ) {
      fields += "," + t; 
   }
   fields += ",time submitted";
   return fields; 
}

function getDataAsCSV(aline ) { 
   
   var record = JSON.parse(aline);
   var fields = "Name,Student#, Result, Answers";
   var fields = record.name + "," + record.number + "," + record.correctCount + ",";
   var t, i;
   for( t in record.answers ) {
      fields += "," + record.answers[t]; 
   }
   fields += ",";
   for( i =  0; i <  record.correctness.length; i++ ) {
      fields += "," + record.correctness[i]; 
   }
   fields += "," + record.timestamp;
   return fields;
}

function getResultsAsCSV() {
   var contents = fs.readFileSync(quizResultsPath).toString();
   var lines = contents.split("\n");
   var outdata = "";
   var printedHeader = false;
   var i;
   for(i = 0; i < lines.length; i++ ) {
     var firstChar = lines[i].substr(0,1);
     if( firstChar == '{' ) {
        if( !printedHeader ) {
            outdata += getHeadersAsCSV(lines[i]) + "\n";
            printedHeader = true;
        }
        outdata += getDataAsCSV(lines[i]) + "\n";
     }
     else {
        outdata += lines[i] + '\n';
     }
   }
   return outdata;
}

function openLogStream() {
   if( !logStream ) {
      logStream = fs.createWriteStream(quizResultsPath, {'flags': 'a'});
   }
}
var app = express();

app.use(express.static("static"));

app.get('/results', function(req, res){
  var csv = getResultsAsCSV();
  res.setHeader('Content-disposition', 'attachment; filename=quizResults.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
});


app.get('/quizcontents/rootQuiz.html', function(req, res) {
   rootSpec = { root: __dirname + '/static/'};
   if( quizInProgress ) {
      res.sendFile( "rootQuiz.html", rootSpec);
   }
   else {
      res.sendFile( "quizOver.html", rootSpec);
   }
 });
//
// enable presentquiz
//
app.post('/startquiz', function(req, res) {
   console.log("start of quiz");
   openLogStream();
   logStream.write("#quiz_start "+  ((new Date()) + "\n"));
   res.end();
   quizInProgress = true;
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
  quizInProgress = false;
});

app.listen(8080, function() {
    console.log("phyquiz listening on port 8080");
});
