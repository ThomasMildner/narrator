
// Story text.

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

//const storyText     = 'Hello World.';

let msg             = new SpeechSynthesisUtterance();

let voices          = window.speechSynthesis.getVoices();
let finished        = false;
let finishMessage   = ' ';


/******************************/
/* Speech Synthesis Variables */
/*		   and Setup:         */
/******************************/

const lang = "en-GB";
const voiceIndex = 1;
let voices = window.speechSynthesis.getVoices();

function utter(text) {
    let backButton = $("#exp_two_back_button");
    backButton.hide();

    let arr = text.split(".");
    let index;

    for (index = 0; index < arr.length; ++index) {
        utterElement(arr[index]);
    }

    loadFinishMessage();
    loadContinueButton();
    backButton.show();
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

/******************************/
/*        End Section         */
/******************************/


// Function to read the story text.
function simpleNarration() {

    voices = window.speechSynthesis.getVoices();
    msg.voice       = voices[10];
    msg.voiceURI    = 'native';
    msg.volume      = 0.8;              // 0 to 1
    msg.rate        = 10;               // 0 to 10
    msg.pitch       = 0.8;              // 0 to 2
    msg.lang        = 'en-GB';
    msg.text        = storyText;

    msg.onend = function(e) {
        $("#exp_two_back_button").show();
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
        finished = true;
    };

    /*if (!finished) {
        speechSynthesis.speak(msg);
        $("#exp_two_back_button").hide();
    }*/

   utter(storyText);
}

function helloWorld() {
    utter("Hello World.")
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