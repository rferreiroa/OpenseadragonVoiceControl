/*
	This plugin is created by Roi Ferreiroa (quiansfactory.com).
	If you need to contact me, please find me on github, selko.
*/

(function($) {
    'use strict';

    if (!$.version || $.version.major < 2) {
        throw new Error('This version of OpenSeadragonSpeechtextRecognition requires OpenSeadragon version 2.0.0+');
    }

    $.Viewer.prototype.speechtextrecognition = function(options) {
        if (!this.speechtextrecognitionInstance || options) {
            options = options || {};
            options.viewer = this;
            this.speechtextrecognitionInstance = new $.Speechtextrecognition(options);
        }
        return this.speechtextrecognitionInstance;
    };


    /**
    * @class Speechtextrecognition
    * @classdesc Provides functionality for voice control and speech text recognition
    * @memberof OpenSeadragon
    * @param {Object} options
    */
    $.Speechtextrecognition = function ( options ) {

        $.extend( true, this, {
            // internal state properties
            viewer:                 null,
            buttonActiveImg:        false,
            showingMenu: 			false,
            speechTextDiv:  				null,
            toggleButton:           null,
            navImages:              {
                speechrecognition: {
                    REST:   'speechtext_rest.png',
                    GROUP:  'speechtext_grouphover.png',
                    HOVER:  'speechtext_hover.png',
                    DOWN:   'speechtext_pressed.png'
                },
            },
            // options
            showOptions: 			false,
            showSpeechtextRecognitionControl:  true,
            speechTextLanguage: "en-EN",
            voiceControlLanguage: "en",
        }, options );

        $.extend( true, this.navImages, this.viewer.navImages );
        

        if(this.showOptions && !this.speechTextDiv){
            
	    	var speechDiv = this.viewer.container;
	    	var newSpeechDiv = document.createElement('div');
	    	newSpeechDiv.style.position = "absolute";
	    	newSpeechDiv.style.backgroundColor = "black";
	    	newSpeechDiv.style.width = "30%";
	    	newSpeechDiv.style.minWidth = "400px";
	    	newSpeechDiv.style.padding = "20px";
	    	newSpeechDiv.style.margin = "-100px 0 0 -200px";
	    	newSpeechDiv.style.top = "50%";
	    	newSpeechDiv.style.left = "50%";
	    	newSpeechDiv.style.fontFamily = "Tahoma,Arial,sans-serif";
            
	    	// Close button
	    	var closeButton = document.createElement('a');
	    	closeButton.style.position = "absolute";
	    	closeButton.innerHTML = "&times;";
	    	closeButton.style.position = "absolute";
	    	closeButton.style.top= "0px";
	    	closeButton.style.right= "19px";
	    	closeButton.style.fontSize = "30px";
	    	closeButton.style.fontWeight = "bold";
	    	closeButton.style.textDecoration= "none";
	    	closeButton.style.color= "white";
	    	closeButton.style.cursor= "pointer";
	    	closeButton.id = "speechtextCloseButton";
               
	    	// Button to voice control
	    	var voiceControlbutton = document.createElement('button');
	    	voiceControlbutton.innerHTML = "Voice control";
	    	voiceControlbutton.onclick = this.startVoiceControl.bind(this, voiceControlbutton);
	    	voiceControlbutton.ontouchstart = this.startVoiceControl.bind(this, voiceControlbutton);
	    	voiceControlbutton.style.height = "40px";
	    	voiceControlbutton.style.lineHeight = "30px";
	    	voiceControlbutton.style.fontSize = "24px";
	    	voiceControlbutton.style.margin = "0 auto";
	    	voiceControlbutton.style.marginLeft = "50px";
	    	voiceControlbutton.style.marginTop = "18px";
	    	voiceControlbutton.style.borderRadius = "6px";
	    	voiceControlbutton.style.background = "white";

	    	// Button to Speech text recognition
	    	var Speechtextbutton = document.createElement('button');
	    	Speechtextbutton.innerHTML = "Speech text";
	    	Speechtextbutton.onclick = this.enableSpeechtext.bind(this, Speechtextbutton);
	    	Speechtextbutton.ontouchstart = this.enableSpeechtext.bind(this, Speechtextbutton);
	    	Speechtextbutton.style.height = "40px";
	    	Speechtextbutton.style.lineHeight = "30px";
	    	Speechtextbutton.style.fontSize = "24px";
	    	Speechtextbutton.style.margin = "0 auto";
	    	Speechtextbutton.style.marginLeft = "25px";
	    	Speechtextbutton.style.borderRadius = "6px";
	    	Speechtextbutton.style.background = "white";
            
            
	    	newSpeechDiv.appendChild(closeButton);
	    	newSpeechDiv.appendChild(Speechtextbutton);
	    	newSpeechDiv.appendChild(voiceControlbutton);           
	    	speechDiv.appendChild(newSpeechDiv);
	    	
                    
            // Speech text input main div
	    	var mainspeechtextInputDiv = this.viewer.container;

	    	var speechtextInputDiv = document.createElement('div');            
	    	speechtextInputDiv.id = "speechtextinputcontainer";
	    	speechtextInputDiv.style.position = "absolute";
	    	speechtextInputDiv.style.backgroundColor = "black";
	    	speechtextInputDiv.style.width = "30%";
	    	speechtextInputDiv.style.minWidth = "400px";
	    	speechtextInputDiv.style.padding = "20px";
	    	speechtextInputDiv.style.margin = "-100px 0 0 -200px";
	    	speechtextInputDiv.style.top = "50%";
	    	speechtextInputDiv.style.left = "50%";
            speechtextInputDiv.style.display = "none";
            
            
	    	// Speech text input close button
	    	var closespeechInputButton = document.createElement('a');
	    	closespeechInputButton.style.position = "absolute";
	    	closespeechInputButton.innerHTML = "&times;";
	    	closespeechInputButton.style.position = "absolute";
	    	closespeechInputButton.style.top= "0px";
	    	closespeechInputButton.style.right= "19px";
	    	closespeechInputButton.style.fontSize = "30px";
	    	closespeechInputButton.style.fontWeight = "bold";
	    	closespeechInputButton.style.textDecoration= "none";
	    	closespeechInputButton.style.color= "white";
	    	closespeechInputButton.style.cursor= "pointer";
	    	closespeechInputButton.id = "speechtextinputCloseButton";   
            
	    	var speechTextInput = document.createElement('input');
	    	speechTextInput.type = "text";
	    	speechTextInput.id = "speechText";
	    	speechTextInput.style.display = "block";
	    	speechTextInput.style.width = "100%";
   	    	speechTextInput.style.marginLeft= "-3px";
            speechTextInput.style.marginTop= "17px";
   	    	speechTextInput.style.background= "white";
   	    	speechTextInput.style.borderRadius = "6px";
            speechTextInput.style.fontSize= "41px";
            speechTextInput.style.display = "none";
	    	speechTextInput.placeholder = "Come on! Talk to me!";

            speechtextInputDiv.appendChild(closespeechInputButton);
            speechtextInputDiv.appendChild(speechTextInput);
	    	mainspeechtextInputDiv.appendChild(speechtextInputDiv);            
            
	    	this.showingMenu = false;
	    	this.speechTextDiv = newSpeechDiv;
	    	this.speechTextDiv.style.display = "none";

	    	// Add Events to all elements by id, since they won't work after HTML text addition somehow
	    	document.getElementById('speechtextCloseButton').onclick = this.closeMenu.bind(this);
	    	document.getElementById('speechtextinputCloseButton').onclick = this.closeSpeechTextMenu.bind(this);

        }

 		// Add button
        var prefix = this.prefixUrl || this.viewer.prefixUrl || '';
        var useGroup = this.viewer.buttons && this.viewer.buttons.buttons;
        var anyButton = useGroup ? this.viewer.buttons.buttons[0] : null;
        var onFocusHandler = anyButton ? anyButton.onFocus : null;
        var onBlurHandler = anyButton ? anyButton.onBlur : null;
        if (this.showSpeechtextRecognitionControl) {
            this.toggleButton = new $.Button({
                element:    this.toggleButton ? $.getElement( this.toggleButton ) : null,
                clickTimeThreshold: this.viewer.clickTimeThreshold,
                clickDistThreshold: this.viewer.clickDistThreshold,
                tooltip:    $.getString('Tooltips.SpeechtextRecognitionToggle') || 'Speech text',
                srcRest:    prefix + this.navImages.speechrecognition.REST,
                srcGroup:   prefix + this.navImages.speechrecognition.GROUP,
                srcHover:   prefix + this.navImages.speechrecognition.HOVER,
                srcDown:    prefix + this.navImages.speechrecognition.DOWN,
                onRelease:  this.toggleSpeechRecognitionMenu.bind( this ),
                onFocus:    onFocusHandler,
                onBlur:     onBlurHandler
            });
            if (useGroup) {
                this.viewer.buttons.buttons.push(this.toggleButton);
                this.viewer.buttons.element.appendChild(this.toggleButton.element);
            }
            if (this.toggleButton.imgDown) {
                this.buttonActiveImg = this.toggleButton.imgDown.cloneNode(true);
                this.toggleButton.element.appendChild(this.buttonActiveImg);
            }
		}

	    this.outerTracker = new $.MouseTracker({
	        element:            this.viewer.drawer.canvas,
	        clickTimeThreshold: this.viewer.clickTimeThreshold,
	        clickDistThreshold: this.viewer.clickDistThreshold,
	        clickHandler:       $.delegate( this, onOutsideClick ),
	        startDisabled:      !this.showingMenu,
	    });
	};


    function onOutsideClick() {
    	this.closeMenu();
    }

    $.extend( $.Speechtextrecognition.prototype, $.ControlDock.prototype, /** @lends OpenSeadragon.ControlDock.prototype */{

        closeMenu: function(){
        	if(this.speechTextDiv)
    			this.speechTextDiv.style.display = "none";
    		this.showingMenu = false;
    		this.outerTracker.setTracking(false);
    		return true;
        },

        closeSpeechTextMenu: function(){

            jQuery("#speechtextinputcontainer").css("display","none");
            jQuery("#speechText").css("display","none");
            
    		return true;
        },
        
        test: function(){

            //this.closeMenu();
	    	var viewer = this.viewer;

            this.viewer.viewport.goHome(true);

        },
        
        enableSpeechtext: function(viewer) {

            this.closeMenu();

	    	var viewer = this.viewer;

            jQuery("#speechtextinputcontainer").css("display","block");
            jQuery("#speechText").css("display","block");

            console.log(this.speechTextLanguage);
            var speech = new Speech({
                debugging: true,
                continuous: true,
                interimResults: true,
				lang: this.speechTextLanguage,
                autoRestart: false
            })

            speech

                .on('end', function () {
                   
                })
                .on('interimResult', function (msg) {
                   
					
                 jQuery("#speechText").val(msg);
                })
                .on('finalResult', function (msg) {
                    
					
                    jQuery("#speechText").val(msg);

                })
                .start()
                                
                return true; 
        },

        startVoiceControl: function(viewer) {

	    	var viewer = this.viewer;
            
            this.closeMenu();
            this.viewer.viewport.goHome(true);

            if (annyang) {
        
            // define our commands.
            // * The key is the phrase you want your users to say.
            // * The value is the action to do.
            //   You can pass a function, a function name (as a string), or write your function as part of the commands object.
            var commands = {
    
              'Go':   this.viewer.viewport.goHome,
              'Go Home': this.test,
              
            };

            // OPTIONAL: activate debug mode for detailed logging in the console
            annyang.debug();

            // Add voice commands to respond to
            annyang.addCommands(commands);

            // OPTIONAL: Set a language for speech recognition (defaults to English)
            // For a full list of language codes, see the documentation:
            // https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported
            console.log(this.voiceControlLanguage);
            annyang.setLanguage(this.voiceControlLanguage);

            // Start listening. You can call this here, or attach this call to an event, button, etc.
            annyang.start();
              } else {
            $(document).ready(function() {
              $('#unsupported').fadeIn('fast');
            });
         }

        	return true;
        },

        toggleSpeechRecognitionMenu: function(){
            
            this.outerTracker.setTracking(!this.showingMenu);
            
        	if(this.showingMenu){
        		this.closeMenu.bind(this);
        		return true;
        	}
        	else{
                jQuery("#speechtextinputcontainer").css("display","none");
                jQuery("#speechText").css("display","none");
        		this.showMenu();
        	}

	    	return true;
        },

        showMenu: function(){
        	this.speechTextDiv.style.display = "inline";
        	this.showingMenu = true;
        },

    });



})(OpenSeadragon);
