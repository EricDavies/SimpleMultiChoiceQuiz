# SimpleMultiChoiceQuiz

## What this is
This is a simple webserver which is used to deliver multiple choice quizes to students. You should not use this quiz (unaltered) for assigning grades because the correct answer to each question is embedded inside the page served to the student.

## Installation Instructions
You need to have /nodejs installed first. If you don't have nodejs see, https://nodejs.org/en/download/ .

Then download this project with: https://github.com/EricDavies/SimpleMultiChoiceQuiz.git

Cd into the SimpleMultiChoiceQuiz directory.

Install the dependencies with

      npm install

## To run the Quiz

Cd into the SimpleMultiChoiceQuiz directory.

Then run the server.js script with:

      node server.js

By default, this will start the script running on port 8080.

The instructor should point their browser at http://yoursite:8080/index_instructor.html. The default passphrase for the instructor is "BrettRunsFast" (without the quotes). Your browser will remember the passphrase for you. Once there, click the "Start the Quiz Period" button. When the time is up, click the "End the Quiz Period" button.

The students should point their browsers at http://yoursite:8080/index_student.html. It will store the students name and studentnumber (so give them some extra time on the first quiz to enter that) the first time, and then take them to the quiz page. There is a submit button the bottom right corner of the page used to submit answsers and have them marked on the fly.

## Customizing The Quiz

The quiz questions and their possible answers are stored in the static/quizcontents/body.html file. The format of the file is:

    <section>
Text and other content describing the first question.
You can include references to other files in the quizcontents directory, but the path must begin with "quizcontents/". Ie, The sample.png already in the quizcontents directory is referenced by
      <img src="quizcontents/sample.png"/>
not
      <img src="sample.png"/>

       <label> Text for first wrong answer</label>
       <label> Text for second wrong answer</label>
       <label class="correct"> Text for second answer</label>
       <label> Text for the fourth (but wrong) answer</label>
    </section>

    <section>
       Text and other contents for the second question.
       <label> ... </label>
          ...
       <label> ... </label>
    </section>
     ...


Just to be really clear: you denote which answer is correct by adding the class="correct" tag to its label.

There is code in the page that will edit the page to add radio buttons in front of each label. Do not add the radio buttons yourself.

You can add addition content (like general instructions) to the static/rootQuiz.html file just after the <body> tag or just before the </body> tag.


