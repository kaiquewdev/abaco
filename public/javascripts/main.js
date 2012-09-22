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
                answer: null,
                limit: 20,
                signals: [
                    '+',
                    '-',
                    '÷',
                    'x'
                ]
            },

            start: function () {
                var challenge = this.newChallenge();

                this.set({
                    label: challenge.label,
                    answer: challenge.answer
                });    
            },

            random: function ( len ) {
                return Math.round( Math.random() * len );    
            },

            randomSignal: function () {
                var signals = this.get('signals'),
                    signalsLength = signals.length;
                    id = this.random( signalsLength );

                if ( id >= signalsLength ) {
                    id = this.random( signalsLength );    
                }

                return signals[ id ];
            },

            randomNumber: function () {
                var limit = this.get('limit');

                return this.random( limit );
            },

            sum: function ( a, b ) {
                return a + b;    
            },

            sub: function ( a, b ) {
                return a - b;    
            },

            div: function ( a, b ) {
                return a / b;    
            },

            mult: function ( a, b ) {
                return a * b;    
            },

            operations: function ( operator, a, b ) {
                var fn = {
                    '+': this.sum,
                    '-': this.sub,
                    '÷': this.div,
                    'x': this.mult     
                };    

                return fn[ operator ]( a, b );
            },

            expression: function ( a, operator, b ) {
                return this.operations( operator, a, b );
            },

            label: function ( a, operator, b ) {
                return String( a ) +
                       String( operator ) +
                       String( b );
            },

            answer: function ( a, operator, b ) {
                return this.expression( a, operator, b );
            },

            mountExpression: function () {
                var output = [];

                output.push( this.randomNumber() );
                output.push( this.randomSignal() );
                output.push( this.randomNumber() );

                return output;
            },

            newChallenge: function () {
                var output = { label: '', answer: 0 },
                    expression = this.mountExpression();

                output['label'] = this.label(
                    expression[0],
                    expression[1],
                    expression[2]
                ); 

                output['answer'] = this.answer(
                    expression[0],
                    expression[1],
                    expression[2]
                );

                return output;
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

                app.abacoModel.start();

                led.removeClass('start');
                led.html( app.abacoModel.get('label') );
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
                        answer = app.abacoModel.get('answer');

                    if ( response ) {
                        var comparison = ( response === answer.toString() );

                        if ( comparison ) {
                            this.correct();
                        } else {
                            this.incorrect();    
                        }

                        app.abacoModel.start();
                        led.html( app.abacoModel.get('label') );
                    } else {
                        alert('Please give a answer!');    
                    }
                }
            }
        }); 

        // Abaco app
        window.app = {};

        app.abacoModel = new AbacoModel;
        app.abacoCollection = new AbacoCollection;
        app.abaco = new AbacoView({
            el: '.abaco'    
        });
    });
});
