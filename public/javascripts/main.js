require([
    '/javascripts/lib/underscore.js',
    '/javascripts/lib/jquery.js',
    '/javascripts/lib/json2.js',
    '/javascripts/lib/backbone.js'
], function () {
    $(function () {
        var AbacoModel = Backbone.Model.extend({
            defaults: {
                label: 'Start?',
                answer: null
            },

            start: function () {
                var challenge = this.newChallenge();

                this.set({
                    label: challenge.label,
                    answer: challenge.answer
                });    
            },

            newChallenge: function () {
                var signals = [
                    '+',
                    '-',
                    '÷',
                    'x'
                ], 
                limitValue = 100,
                limitExpression = 2,
                label = '',
                answer = undefined;

                // Random signal
                var signalID = Math.round( Math.random() * signals.length );

                label = ( ( Math.round( Math.random() * limitValue ) ) + 
                        ( signals[ signalID ] ) +
                        ( Math.round( Math.random() * limitValue ) ) ).toString();

                answer = function ( label ) {
                    var label = label,
                        output = 0,
                        counter = 0;

                    if ( label.indexOf( signals[0] ) > -1 ) {
                        label = label.split( signals[0] );
                        counter = label.length;

                        output = Number( label[0] ) + Number( label[1] );
                    } else if ( label.indexOf( signals[1] ) > -1 ) {
                        label = label.split( signals[1] );
                        counter = label.length;

                        output = Number( label[0] ) - Number( label[1] );
                    } else if ( label.indexOf( signals[2] ) > -1 ) {
                        label = label.split( signals[2] );
                        counter = label.length;

                        output = Number( label[0] ) / Number( label[1] );
                    } else if ( label.indexOf( signals[3] ) > -1 ) {
                        label = label.split( signals[3] );
                        counter = label.length;

                        output = Number( label[0] ) * Number( label[1] );
                    } 

                    return output;
                };

                return {
                    label: label,
                    answer: answer( label )
                };
            }
        });

        var AbacoCollection = Backbone.Collection.extend({
            model: AbacoModel    
        });

        var AbacoView = Backbone.View.extend({
            defaults: {
                el: '',    
            },

            events: {
                'click .start': 'start',
                'click #answer-button': 'next'
            },

            initialize: function () {
                this.render();
            },

            render: function () {
                var template = $('#abaco-screen').html();

                template = _.template( template, {
                    led: {
                        label: 'Start?'
                    }  
                });

                this.$el.html( template );
            },

            start: function () {
                var abaco = $('.abaco'),
                    led = abaco.find('.led h2');    

                app.abacoModel.start();

                led.removeClass('start');
                led.html( app.abacoModel.get('label') );
            },

            next: function () {
                var abaco = $('.abaco'),
                    led = abaco.find('.led h2'),
                    userAnswer = $('#answer-input'); 

                if ( userAnswer.val() ) {
                    if ( app.abacoModel.get('answer').toFixed(2) === userAnswer.val() ) {
                        alert( 'Correct!' );
                    } else {
                        alert( 'Incorrect!' );    
                    }

                    app.abacoModel.start();
                    led.html( app.abacoModel.get('label') );
                } else {
                    alert('Please give a answer!');    
                } 
            }
        }); 

        window.app = {};

        app.abacoModel = new AbacoModel;

        app.abaco = new AbacoView({
            el: '.abaco'    
        });
    });
});
