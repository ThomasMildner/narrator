//const storySectionsTest = ["eins","zwei","drei","vier","fünf"];

const regex = new RegExp(/^[A-Za-z ]+$/i);

// in the end requests binary input.
const sectionOne = "What if Edna Krabappel fell in love with Homer Simpson? Something clicked inside Edna Krabappel when loveable Homer Simpson came along. So at first, Edna fell deeper in love with Homer than she ever had with Matt Groening."
	+ "<br/><br/>I believe this story needs a little change, do you agree?";
// in the end requests name input.
const sectionTwo = "But Homer was bored almost to death by Edna. Yet Edna charmed Homer with a sly smile. "
	+ "<br/><br/>I think we should introduce a new character. Tell me a name and I will integrate them into our story.";
// in the end request name input.
const sectionThree = "Fantastic! {X} will do just fine!"
	+ "<br/><br/>So Homer started an illicit affair with {X}. Well, Edna viciously sliced Homer with her sharp-edged ruler. So Homer reported Edna to the police. Well, Edna begged for Homer's forgiveness. So Homer lowered the boom on Edna. Then {X} went down on bended knee and proposed to Homer. So Homer introduced {X} to his social circle."
	+ "<br/><br/>That helped the story. Let's introduce another character.";
// in the end requests binary input.
const sectionFour = "Thank you! {Y} is perfect! Let's introduce them to the story."
	+ "<br/><br/>But {X} invited {Y} for a romantic meal. Yet {Y} turned a cold eye to {X}'s entreaties."
	+ "<br/><br/>This is getting intrersting. Let's give it a small turn, shall we?";
// in the end good bye from audience.
const sectionFive = "But {X} harassed {Y} continuously. So {Y} passed information to Homer. We're no longer an item said Homer to {X}. Forgive me begged Homer of Edna. Then Edna forgave all of Homer's transgressions. After this, Edna went down on bended knee and proposed to Homer. Then Homer forged a bond with Edna. So in the end Edna married Homer in Springfield and they honeymooned in Springfield. Thereafter Edna and Homer were utterly inseparable; wherever Homer went Edna was sure to follow. The end.";
const storySections = [sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive];
const maxNameLength = 20;
const storySectionID = "exp_one_story_field";

/******************************/
/* Speech Synthesis Variables */
/*		   and Setup:         */
/******************************/
const lang = "en-GB";
const voiceIndex = 1;
let voices = window.speechSynthesis.getVoices();

function utter(text) {
	let arr = text.split(".");
	/*arr.forEach(function(element) {
		speakSingle(element);
	});*/
	let index;
	for (index = 0; index < arr.length; ++index) {
		utterElement(arr[index]);
	}
}

const utterElement = async text => {
	if(!speechSynthesis) {
		console.log("SPEAK SINGLE - ABORTED UTTERANCE");
		return;
	}
	console.log("SPEAK SINGLE - TRY UTTERANCE: " + text);
	const message 	= new SpeechSynthesisUtterance(text);
	message.voice 	= await chooseVoice();
	message.volume	= 0.8;
	speechSynthesis.speak(message);
	message.onend = function(event) {
		console.log("SPEAK SINGLE - SPOKE: " + text);
	};
};

const getVoices = () => {
	return new Promise(resolve => {
		let voices = speechSynthesis.getVoices()
		if (voices.length) {
			resolve(voices)
			return
		}
		speechSynthesis.onvoiceschanged = () => {
			voices = speechSynthesis.getVoices()
			resolve(voices)
		}
	})
};

const chooseVoice = async () => {
	const voices = (await getVoices()).filter(voice => voice.lang == lang);
	return new Promise(resolve => {
		resolve(voices[voiceIndex]);
	})
};

function helloWolrd(){
	utter("hello world");
}
/******************************/
/*        End Section         */
/******************************/


// Various general variables
let sectionIndex 		= 0;
let showButtons 		= false;
let charIndex 			= 0;
let character 			= ["", ""];

// Begin the experiment and load the interface.
function startExperiment() {

	let expForm 		= $("#exp_one_form");
	let startForm 		= $("#exp_one_start");
	let endOfStoryField = $("#end_of_story_container");

	$("#exp_one_back_button").hide();
	$("#exp_one_continue_container").hide();

	endOfStoryField.hide();
	startForm.hide();
	expForm.show();

	if (isBinarySection(sectionIndex)) {

		if(!showButtons) {
			console.log("showing buttons");
			showButtons = true;
		}
	}
	else if(isNameSection(sectionIndex)) {
		if(showButtons) {
			console.log("showing text input");
			showButtons = false;0
		}
	}

	setInnerText(storySectionID, getCurrentSection());
	utter(getUtteraance(getCurrentSection()));
	sectionIndex++;

	if (showButtons) {
		replaceForBinaryButtons();
	}
	else {
		replaceForInputField();
	}
}

// Setup the submissions. This is where the user input goes first.
function onSubmit(id) {
	let identity = document.getElementById(id).id;

	if(identity === "story_section_yes_button") {
		onYesClick();
	}
	else if(identity === "story_section_no_button") {
		onNoClick();
		//setCurrentSection();
	}
	else if(identity === "exp_one_response_button") {
		let response = document.getElementById("exp_one_response_input").value;
		document.getElementById("exp_one_form").reset();

		if(isSubmitOK(response)) {
			setChar(response, charIndex);
			console.log("valid: name set to " + character[charIndex]);
			setCurrentSection();
			charIndex++;
			$("#exp_one_story_field_warning").hide();
		}
	}
	else if(identity === "exp_one_continue_button") {
		onContinueClick();
		$("#exp_one_back_button").show();
	}
}


// Basically the main handler function.
function setCurrentSection() {

	if (isBinarySection(sectionIndex)) {
		if(!showButtons) {
			console.log("setting showButtons true");
			showButtons = true;
		}
	}
	else if(isNameSection(sectionIndex)) {
		if(showButtons) {
			console.log("setting showButtons false");
			showButtons = false;
		}
	}

	let innerText = injectNameToSection(getCurrentSection());
	setInnerText(storySectionID, innerText);
	utter(getUtteraance(innerText));

	if (showButtons) {
		//binaryButtons.show();
		replaceForBinaryButtons();
	}
	else {
		//binaryButtons.hide();
		replaceForInputField();
	}

	if(sectionIndex <= storySections.length) {
		console.log("current section to display: " + sectionIndex);
		sectionIndex++;
	}
	else {
		alert("End Section");
		setInnerText(storySectionID, "The story is over. Thanks for listening and participating.");
	}
}


/******************************/
/*      Parser Functions :    */
/******************************/


function injectNameToSection(section) {
	return section.replace(/{X}/g, character[0]).replace(/{Y}/g, character[1]);
}


/******************************/
/*   Validation Functions:    */
/******************************/

const endOfExperiment = "The story is over. Thanks for listening and participating." +
	"<br><br/>Clicking the link will take you to the Google Sheets Questionnaire." +
	"<br><br/>Please come back for the second part of the study, this tab will stay open. Thank you!";

// Check if input is valid.
function isSubmitOK(input) {

	let submitOK = true;

	if(input === "") {
		submitOK = false;
		$("#exp_one_story_field_warning").show();
		console.log('Input Error - invalid response: No response given');
		setInnerText("exp_one_section_alert", "Please type in a response.");
	}
	else if(!regex.test(input)) {
		submitOK = false;
		$("#exp_one_story_field_warning").show();
		console.log('Input Error - invalid response: non-alphabetical characters.');
		setInnerText("exp_one_section_alert", "Please use alphabetical characters only.");
	}
	else if(input.length > maxNameLength) {
		submitOK = false;
		$("#exp_one_story_field_warning").show();
		console.log('Input Error - invalid response: response has more than 20 characters.');
		setInnerText("exp_one_section_alert", "Please chose a shorter name.");
	}

	return submitOK;
}


// Act on yes click.
function onYesClick() {

	if(sectionIndex < storySections.length) {
		console.log("ony_yes_click - section index: " + sectionIndex);
		let innerText = injectNameToSection( "I like the way you think! <br/><br/>" + getCurrentSection());
		setInnerText(storySectionID, innerText);
		utter(getUtteraance(innerText));
		sectionIndex++;
		setInterface()
	}
	else if(sectionIndex >= storySections.length){
		setInnerText(storySectionID, endOfExperiment);
		setEndOfStoryInterface();
	}
}

// Act on no click.
function onNoClick() {
	if(sectionIndex < storySections.length) {
		console.log("on_no_click - section index: " + sectionIndex);
		let innerText = injectNameToSection("Well, I disagree, but never mind. <br/><br/>" + getCurrentSection());
		setInnerText(storySectionID, innerText);
		utter(getUtteraance(innerText));
		sectionIndex++;
		setInterface()
	}
	else if(sectionIndex >= storySections.length) {
		setInnerText(storySectionID, endOfExperiment);
		setEndOfStoryInterface();
	}
}

function onContinueClick() {
	console.log("setting continue view.")
	setInnerText(storySectionID, endOfExperiment);
	setEndOfStoryInterface();
}

// Vaalidate current section index to determine what interface to show.
function setInterface() {

	if (isNameSection(sectionIndex)) {
		console.log("setting input field for section: " + sectionIndex);
		replaceForInputField();
	}
	else if (isBinarySection(sectionIndex)){
		console.log("setting buttons for section: " + sectionIndex);
		replaceForBinaryButtons();
	}
	else if (isLastSection(sectionIndex)) {
		console.log("setting continue view for section: " + sectionIndex);
		replaceForContinue();
	}
}

function setEndOfStoryInterface() {
	console.log("setting field to end section.")
	let binaryButtons = $("#story_section_buttons_container");
	let inputField = $("#exp_one_name_input");
	let continueButton 	= $("#exp_one_continue_container");
	let endOfStoryField = $("#end_of_story_container");

	binaryButtons.hide();
	inputField.hide();
	continueButton.hide();

	endOfStoryField.show();
}

/******************************/
/* Specific Helper Functions: */
/******************************/


function getUtteraance(input) {
	return input.replace(/<br\/>/g, " ");
}

// Check if story sections demands a 'yes' or 'no' reply.
function isBinarySection(index) {
	let binary = [0,3];
	return binary.includes(index);
}


// Check if story currentSection demands a name input.
function isNameSection(index) {
	let names = [1, 2];
	return names.includes(index);
}

function isLastSection(index) {
	return index === storySections.length;
}


/******************************/
/*      Getter Functions :    */
/******************************/


// Return current story section.
function getCurrentSection() {
	return storySections[sectionIndex];
}


/******************************/
/*      Setter Functions :    */
/******************************/


function setChar(name, index){
	character[index] = name;
}

// Replace the input field container with the button container.
function replaceForBinaryButtons() {
	let inputField 		= $("#exp_one_name_input");
	let binaryButtons 	= $("#story_section_buttons_container");
	let continueButton 	= $("#exp_one_continue_container");

	binaryButtons.show();
	inputField.hide();
	continueButton.hide();
}

// Replace the button container with the input field container.
function replaceForInputField() {
	let inputField 		= $("#exp_one_name_input");
	let binaryButtons 	= $("#story_section_buttons_container");
	let continueButton 	= $("#exp_one_continue_container");

	inputField.show();
	binaryButtons.hide();
	continueButton.hide();
}

function replaceForContinue() {
	let inputField 		= $("#exp_one_name_input");
	let binaryButtons 	= $("#story_section_buttons_container");
	let continueButton 	= $("#exp_one_continue_container");

	continueButton.show();
	inputField.hide();
	binaryButtons.hide();
}


/******************************/
/*  General Helper Functions: */
/******************************/


function setInnerText(elementID, text) {
	$("#"+elementID).html(text);
}


/******************************/
/*      Experiment Two        */
/******************************/

const utterSimpleText = async text => {
	let arr = text.split(".");
	let counter = 0;
	let index;
	for (index = 0; index < arr.length; ++index) {
		$("#two-play-button").hide();
		//utterElement(arr[index]);
		const message	= new SpeechSynthesisUtterance(arr[index]);
		message.voice 	= await chooseVoice();
		message.volume 	= 0.8;
		speechSynthesis.speak(message);

		message.onend 	= function (event) {
			console.log(message.text + "| Array length: " + arr.length + ". Counter: " + counter);
			counter ++
			if(counter === arr.length){
				console.log("last element");
				loadFinishMessage();
				loadContinueButton();
			}
		}
	}
};

const storyText = "What if Edna Krabappel fell in love with Homer Simpson.  Something clicked inside Edna Krabappel " +
	"when loveable Homer Simpson came along.  So at first, Edna fell deeper in love " +
	"with Homer than she ever had with Matt Groening. But Homer was bored almost to death by Edna. Yet Edna charmed " +
	"Homer with a sly smile. So Homer started an illicit affair with Marge Simpson. Well, Edna viciously sliced " +
	"Homer with her sharp-edged ruler. So Homer reported Edna to the police. Well, Edna begged for Homer's " +
	"forgiveness. So Homer lowered the boom on Edna.Then Marge Simpson went down on bended knee and proposed to " +
	"Homer. So Homer introduced Marge Simpson to his social circle. But Marge Simpson invited Barney Gumble for " +
	"a romantic meal. Yet Barney Gumble turned a cold eye to Marge Simpson's entreaties. But Marge Simpson harassed " +
	"Barney Gumble continuously. So Barney Gumble passed information to Homer. We're no longer an item said Homer " +
	"to Marge Simpson. Forgive me begged Homer of Edna. Then Edna forgave all of Homer's transgressions. After this, " +
	"Edna went down on bended knee and proposed to Homer. Then Homer forged a bond with Edna. So in the end Edna " +
	"married Homer in Springfield and they honeymooned in Springfield. Thereafter Edna and Homer were utterly " +
	"inseparable; wherever Homer went Edna was sure to follow.";

function simpleNarration() {
	utterSimpleText(storyText);
}


function loadFinishMessage() {
	finishMessage = 'The story has finished. \n Clicking the link will take you to the Google Sheets Questionnaire.';
	document.getElementById('experiment-two-finish-text').innerText = finishMessage;
	//document.getElementById('experiment-two-finish-text').contentWindow.location.reload();
}

function loadContinueButton() {
	let nextButton = document.getElementById("experiment_two_ending_button");
	if(!nextButton.style.display === "block") {
		console.log("alert");
		nextButton.style.display = "block";
	}
	else {
		nextButton.style.display = "block";
	}
}