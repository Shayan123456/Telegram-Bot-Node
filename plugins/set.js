/*
    DESCRIPTION: 
        Trigger bot responses whenever someone says a specific sentence. 
        The triggers will be saved to file on shutdown.

    AUTHOR: 
        Cristian Baldi

    COMMANDS:
        !set <trigger> - <response>
        !unset <trigger>

    EXAMPLE:
        You: !set hello - f*** you!
        You: hello
        Bot: f*** you!

        You: !unset hello
        You: hello
        Bot: ... <- Nothing, you removed the trigger
*/
var fs = require('fs');

var set = function(){

    dict = {};

    this.init = function(){
        fs.readFile("./files/set",'utf8', function(err, data) {
            if(err) {    
                if(err.code == 'ENOENT') {
                    dict = {}
                    console.log("\tSET: file not found. Empty Set.");
                } else {
                    return console.log(err);
                }
            } else {
                dict = JSON.parse(data);
                console.log("\tSET: file loaded");
            }
        }); 
    };

    this.doStop = function(done){
        var fs = require('fs');
        fs.writeFile("./files/set", JSON.stringify(dict), { flags: 'w' }, function(err) {
            if(err) {
                return done(err);
            }
            console.log("\tSET: file saved");
            return done();
        }); 
    };


    this.doMessage = function (msg, reply){
        var reSet = /!set\s+(.*?)\s*-\s*(.*)/im;

        var reUnset = /!unset\s+(.*)/im; 

        var matchSet = reSet.exec(msg.text);  
        var matchUnset = reUnset.exec(msg.text);  
        
        if(matchSet){

            key = matchSet[1];
            value = matchSet[2];

            dict[key] = value;

            reply({type: 'text', text: key + " = " + value})

            console.log("\tSET: " + key + " = " + value);

        }
        else if(matchUnset)
        {
            key = matchUnset[1];
            delete dict[key];
            reply({type: 'text', text: "Unset " + key})
            console.log("\tSET: unset " + key);

        }
        else
        {
            text = msg.text;
            if (text in dict)
                reply({type: 'text', text: dict[text]});

        }
    };

};

module.exports = set;