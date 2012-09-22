(function () {
    'use strict';
    
    var AbacoCollection = window.AbacoCollection = Backbone.Collection.extend({
        model: window.AbacoModel    
    });  

    window.abacoCollection = new AbacoCollection;
}).call( this, window );
