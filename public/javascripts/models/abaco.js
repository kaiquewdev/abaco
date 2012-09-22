(function () {
    'use strict';

    var AbacoModel = window.AbacoModel = Backbone.Model.extend({
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
            var signals = this.tokens(),
                signalsLength = signals.length,
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

        operationTokens: function () {
            return {
                '+': this.sum,
                '-': this.sub,
                '÷': this.div,
                'x': this.mult     
            };
        },

        tokens: function () {
            return Object.keys( this.operationTokens() ); 
        },

        operations: function ( operator, a, b ) {
            var fn = this.operationTokens();    

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

    window.abacoModel = new AbacoModel;
}).call( this, window );
