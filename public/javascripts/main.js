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
                var self = this,
                    signals = self.get('signals'),
                    id = Math.rount( Math.random() * signals.length );

                return signals[ id ];
            },

            randomNumber: function () {
                var self = this,
                    limit = self.get('limit');

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
                var self = this,
                    operations = {
                        '+': self.sum,
                        '-': self.sub,
                        '÷': self.div,
                        'x': self.mult     
                };    

                return operations[ operator ]( a, b );
            },

            expression: function ( a, operator, b ) {
                var self = this,
                    operations = self.operations;

                return operations( operator, a, b );
            },

            label: function ( a, operator, b ) {
                return String( a ) +
                       String( operator ) +
                       String( b );
            },

            answer: function ( a, operator, b ) {
                var self = this,
                    expression = self.expression;

                return expression( a, operator, b );
            },

            mountExpression: function () {
                var self = this,
                    output = [];

                output.push( self.randomNumber() );
                output.push( self.randomSignal() );
                output.push( self.randomNumber() );

                return output;
            };

            newChallenge: function () {
                var self = this,
                    output = { label: '', answer: 0 },
                    expression = self.mountExpression();

                output['label'] = self.label(
                    expression[0],
                    expression[1],
                    expression[2]
                ); 

                output['answer'] = self.answer(
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

        app.abaco = new AbacoView({
            el: '.abaco'    
        });
    });
});
