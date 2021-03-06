//
// Move the submit panel to the top.
//

function moveSubmitPanel() {
   if( $("#submitpanel").height() > 0 ) {
	$("#spacer").height( $("#submitpanel").height());
        $("#submitpanel").css("position","fixed");
        $("#submitpanel").css("bottom",0);
        $("#submitpanel").css("z-index", 2);
   }
   else {
      setTimeout(moveSubmitPanel, 200);
   }
}



moveSubmitPanel();

function assignValuesAndLabels() {
    var sections = $("#quizbody").children();
    var nsections = sections.length;
    var i, j;
    var buttons;
    var labels;
    var qcount = 0;
    var labelValues = "abcdefghijklmnop";
    for( i = 0; i < nsections; i++ ) {
	buttons = $(sections[i]).find("input");
        labels = $(sections[i]).find("label");
	if(buttons.length == 0 ) continue;
        qcount++;
	var buttonGroup = "q" + qcount;
	for( j = 0; j < buttons.length; j++ ) {
            labels[j].htmlFor = buttons[j].id = buttonGroup + labelValues.substr(j,1);
            buttons[j].value = labelValues.substr(j,1);
            buttons[j].name = buttonGroup;
        }
    }
}

function addButtons() {
    srcText = $("#quizbody").html();
    changedText = srcText.replace(/<label/g, "<input type=\"radio\" /><label");
    $("#quizbody").html(changedText);
    setTimeout( assignValuesAndLabels, 100);
}


$("#quizbody").load("body.html", "empty", addButtons);

function submitanswers() {
    var sections = $("#quizbody").children();
    var nsections = sections.length;
    var i, j;
    var buttons;
    var labels;
    var answers = {};
    var correctness = [];
    var correctCount = 0;
    var qcount = 0; 
    for( i = 0; i < nsections; i++ ) {
	buttons = $(sections[i]).find("input");
        labels = $(sections[i]).find("label");
	if(buttons.length == 0 ) continue;
	qcount++;      

	var buttonGroup = "q" + qcount;
        markDiv = document.createElement("div");
        sections[i].appendChild(markDiv);
        var answerGiven = "none";
	for( j = 0; j < buttons.length; j++ ) {
            if( buttons[j].checked ) {
              answerGiven = buttons[j].value; 
            }            
	    if( labels[j].className == "correct") {	
               if( buttons[j].checked ) {
                  markDiv.innerHTML = "<span style=\"color:blue\">Correct</span>";
                  correctness.push(true);
                  correctCount++;
               }
               else {
                  markDiv.innerHTML = "<span style=\"color:red\">Wrong</span>";
		  correctness.push(false);
               }
            }
        }
        answers[buttonGroup] = answerGiven;
    }

    var mesgData = {
        name: window.localStorage["phyquiz_studentname"],
        number:  window.localStorage["phyquiz_studentnumber"],
        answers: answers,
        correctness: correctness,
        correctCount: correctCount,
        timestamp: ((new Date())+"")
    }

    $.post("/submitAnswers", JSON.stringify(mesgData), function() {
        $("#submitanswers").prop('disabled', true);       
    });  	 	
}
