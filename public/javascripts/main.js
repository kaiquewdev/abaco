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
                limit: 11,
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

            randomSignal: function () {
                var signals = this.get('signals'),
                    id = Math.round( Math.random() * signals.length );

                return signals[ id ];
            },

            randomNumber: function () {
                var limit = this.get('limit');

                return Math.round( Math.random() * limit );
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
                'click #answer-button': 'next'
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

            next: function () {
                var abaco = $('.abaco'),
                    led = abaco.find('.led h2'),
                    userAnswer = $('#answer-input'); 

                if ( userAnswer.val() ) {
                    if ( app.abacoModel.get('answer').toString() === userAnswer.val() ) {
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
        app.abacoCollection = new AbacoCollection;
        app.abaco = new AbacoView({
            el: '.abaco'    
        });
    });
});
