# Openseadragon Voice Control Plug-in

An OpenSeadragon plugin that provides functionality for text recognition and voice commands like zooming, panning and more...

<b>Demo</b>

See index.html included in this repository


<b>Usage:</b>

Include

    openseadragonSpeechtextRecognition.js
    annyang.js
    speech.js

after OpenSeadragon in your html. Then after you create a viewer:

 var viewer.speechtextrecognition({
 
        showOptions: true, // Default is false
        speechTextLanguage: 'en-En', // Default is en-EN
        voiceControlLanguage: 'en', // Default is en
        showSpeechtextRecognitionControl: true // Default is true
 });

<b>Avaliable languages:</b>

See Languages.md for more details.
