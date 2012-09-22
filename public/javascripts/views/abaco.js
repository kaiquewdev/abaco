(function () {
    'use strict';

    var AbacoView = window.AbacoView = Backbone.View.extend({
        defaults: {
            el: '',    
        },

        events: {
            'click .start': 'start',
            'click #answer-button': 'next',
            'keypress #answer-input': 'next'
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            var template = $('#abaco-screen').html();

            template = _.template( template, {
                led: {
                    label: 'Click here to start the challenge!'
                }  
            });

            this.$el.html( template );
        },

        start: function () {
            var abaco = $('.abaco'),
                led = abaco.find('.led h2');    

            window.abacoModel.start();

            led.removeClass('start');
            led.html( window.abacoModel.get('label') );
        },

        colorTime: 700,

        correct: function () {
            var abaco = $('.abaco'),
                led = abaco.find('.led h2'),
                storedColor = led.css('color');

            led.addClass( 'correct' ).removeClass('incorrect');
            
            setTimeout(function () {
                led.removeClass('correct');
            }, this.colorTime );
        },

        incorrect: function () {
            var abaco = $('.abaco'),
                led = abaco.find('.led h2'),
                storedColor = led.css('color');

            led.addClass( 'incorrect' ).removeClass('correct');
            
            setTimeout(function () {
                led.removeClass('incorrect');
            }, this.colorTime );
        },

        next: function ( e ) {
            var abaco = $('.abaco'),
                led = abaco.find('.led h2'),
                userAnswer = $('#answer-input'); 

            if ( 'keyCode' in e && 13 === e.keyCode || !( 'keyCode' in e ) ) {
                var response = userAnswer.val(),
                    answer = window.abacoModel.get('answer');

                if ( response ) {
                    var comparison = ( response === answer.toString() );

                    if ( comparison ) {
                        this.correct();
                    } else {
                        this.incorrect();    
                    }

                    window.abacoModel.start();
                    led.html( window.abacoModel.get('label') );

                    userAnswer.val('');
                    userAnswer.focus();

                } else {
                    alert('Please give a answer!');    
                }
            }
        }
    });

    window.abaco = new AbacoView({
        el: '.abaco'    
    });
}).call( this, window );
