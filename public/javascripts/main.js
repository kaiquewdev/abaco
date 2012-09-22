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
                var id = Math.round( Math.random() * this.get('signals').length );    

                return this.get('signals')[ id ];
            },

            randomNumber: function () {
                return Math.round( Math.random() * this.get('limit') );
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

            expression: function ( a, operator, b ) {
                var output = 0;

                switch ( operator ) {
                    case '+':    
                        output = this.sum( Number( a ), Number( b ) ); 
                    case '-':    
                        output = this.sub( Number( a ), Number( b ) ); 
                    case '÷':    
                        output = this.div( Number( a ), Number( b ) ); 
                    case 'x':    
                        output = this.mult( Number( a ), Number( b ) ); 
                }

                return output;
            },

            label: function ( a, operator, b ) {
                return String( a ) +
                       String( operator ) +
                       String( b );
            },

            answer: function ( a, operator, b ) {
                return this.expression(
                    a,
                    operator,
                    b
                );    
            },

            newChallenge: function () {
                var output = {
                        label: '',
                        answer: 0
                    },
                    expression = [
                        this.randomNumber(),
                        this.randomSignal(),
                        this.randomNumber()
                    ];

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
