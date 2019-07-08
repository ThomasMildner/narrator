const lang = "en-GB";
const voiceIndex = 1;

const speak = async text => {
    if(!speechSynthesis) {
        return
    }
    const message = new SpeechSynthesisUtterance(text);
    message.voice = await chooseVoice();
    speechSynthesis.speak(message);
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


function helloWorld(){
    speak("Hello World");
}

/*
const voiceschanged = () => {
    console.log(`Voices #: ${speechSynthesis.getVoices().length}`);
    speechSynthesis.getVoices().forEach(voice => {
        console.log("Voice Name: " + voice.name + "\n", "Voice Language: " + voice.lang + "\n", "Voice URI: " + voice.voiceURI + "\n");
    })
};
speechSynthesis.onvoiceschanged = voiceschanged;

function helloWorld(){
    let utterance = new SpeechSynthesisUtterance('Hello World');
    utterance.voiceURI = "Google UK English Female";
    utterance.lang = 'en-GB';
    utterance.volume = 0.5;

    speechSynthesis.speak(utterance);
}
*/