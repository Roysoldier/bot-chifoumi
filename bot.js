const { Client, Intents, ReactionCollector, MessageEmbed, Discord } = require("discord.js");





const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
                            partial: ["MESSAGE", "CHANNEL", "REACTION"] });

const APP_CONFIG = require("./config.json");
//const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


const ROCK_EMOJI    = "👊";
const SCISSOR_EMOJI = "✌";
const PAPER_EMOJI   = "✋";

const RSP_CHOICES = {
    pierre: ROCK_EMOJI,
    ciseau: SCISSOR_EMOJI,
    papier: PAPER_EMOJI


}


var CURRENT_GAMES = [];
var OLD_MESSAGES =  []; 

client.on("ready", () => {
    console.log("BOT is now ready to Go");
    client.user.setActivity("chifumi avec Noan !", {type: "PLAYING"});
});

client.on("messageReactionAdd", async (reaction, user) => {
    
    var current_game = CURRENT_GAMES.find(game => game.reactMessage.id == reaction.message.id && game.targetUserId == user.id);

    if(!current_game){
        //console.log("partie trouver");
        return;
    }

    
    
    current_game.targetUserChoice = reaction._emoji.name;

    OLD_MESSAGES.push(current_game.reactMessage);

    var result = checkVictory(current_game);

    if(result == -2) {
        console.error("Something wrong hapenned...");
        return;
    }

    var current_channel = client.channels.cache.get(reaction.message.channelId);
    console.log(current_channel);
    
    if(result == 0) {
        // equals
        //console.log("égalité");
        //current_channel.send("Ho non c'est une égalité ! <@" + current_game.sourceUserId + "> <@" + current_game.targetUserId + "> ");

        const embedc = new MessageEmbed()
        
                .setTitle("Chifoumi")
                .setColor("00ffd5")
                .setDescription("Ho non c'est une égalité ! <@" + current_game.sourceUserId + "> <@" + current_game.targetUserId + "> ")
                .setTimestamp()
                


            current_channel.send({ embeds: [embedc] })
    }   
    else if( result == 1) {
        // src winner
        //console.log("src winner");
        //current_channel.send("" + current_game.targetUserChoice + "<@" + current_game.targetUserId + "> a été vaincu par <@" + current_game.sourceUserId + "> !" + current_game.sourceUserChoice);

        const embedb = new MessageEmbed()
        
                .setTitle("Chifoumi")
                .setColor("00ffd5")
                .setDescription("" + current_game.targetUserChoice + "<@" + current_game.targetUserId + "> a été vaincu par <@" + current_game.sourceUserId + "> !" + current_game.sourceUserChoice)
                .setTimestamp()
                


            current_channel.send({ embeds: [embedb] })
    }
    else if(result == -1) {
        //trg winner
        //console.log("trg winner");
        //current_channel.send("" + current_game.sourceUserChoice +"<@" + current_game.sourceUserId + "> a été vaincu par <@" + current_game.targetUserId + "> !" + current_game.targetUserChoice);

        const embeda = new MessageEmbed()
        
                .setTitle("Chifoumi")
                .setColor("00ffd5")
                .setDescription("" + current_game.sourceUserChoice +"<@" + current_game.sourceUserId + "> a été vaincu par <@" + current_game.targetUserId + "> !" + current_game.targetUserChoice)
                .setTimestamp()
                


            current_channel.send({ embeds: [embeda] })
    }
    else {
        //console.log("Something wrong hapenned...");
    }

    CURRENT_GAMES.splice(CURRENT_GAMES.indexOf(current_game), 1);

});

function clearOldMesssages() {
    OLD_MESSAGES.forEach(old_message => old_message.delete());
    OLD_MESSAGES = [];
}

setInterval(clearOldMesssages, 10000);

function checkVictory(game){
    
    var current_source_choice = game.sourceUserChoice;
    var current_target_choice = game.targetUserChoice;

    console.log("debug");
    console.log(current_source_choice);
    console.log(current_target_choice);
    //equality
    if(current_source_choice == current_target_choice) {
        return 0;
    }

    else if(current_source_choice == ROCK_EMOJI && current_target_choice == SCISSOR_EMOJI) {
        return 1;
    }
    else if(current_source_choice == SCISSOR_EMOJI && current_target_choice == PAPER_EMOJI) {
        return 1;
    }
    else if(current_source_choice == PAPER_EMOJI && current_target_choice == ROCK_EMOJI) {
        return 1;
    }

    else if(current_source_choice == ROCK_EMOJI && current_target_choice == PAPER_EMOJI) {
        return -1;
    }
    else if(current_source_choice == SCISSOR_EMOJI && current_target_choice == ROCK_EMOJI) {
        return -1;
    }
    else if(current_source_choice == PAPER_EMOJI && current_target_choice == SCISSOR_EMOJI) {
        return -1;
    }
    else {
        return -2;
    }
}

client.on("messageCreate", message => {
    

    if(message.content.startsWith("!pfc")) {
        //console.log("rsp called");

        var splited_message = message.content.split(" ");

        if(splited_message.length != 3) {
            //message.reply("Hey <@" + message.author.id + "> Pour utiliser la commande fais: !pfc <@yourFriends> <pierre/papier/ciseau>")
                //.then(() => message.delete());

                var nom = message.author.id 
            
            const embed = new MessageEmbed()
        
                .setTitle("Chifoumi")
                .setColor("00ffd5")
                .setDescription("Hey <@" + message.author.id + "> Pour utiliser la commande fais: !pfc <@yourFriends> <pierre/papier/ciseau>")
                .setTimestamp()
                


            message.reply({ embeds: [embed] })

            
                    
                    
        }
        else {
            //console.log("ok");

            var command = splited_message[0] == "!pfc";
            var mention = splited_message[1].length > 0 && splited_message[1].startsWith("<@") && splited_message[1].endsWith(">");

            
            var parsed_choice = splited_message[2].replaceAll("|","");

            console.log(parsed_choice);

            var choice = RSP_CHOICES[parsed_choice];

            console.log(choice);
            
            if(!command || !mention) {
                //message.reply("Hey <@" + message.author.id + "> Pour utiliser la commande fais: !pfc <@yourFriends> <yourChoise>")
                        //.then(() => message.delete());

                        const embedd = new MessageEmbed()
        
                        .setTitle("Chifoumi")
                        .setColor("00ffd5")
                        .setDescription("Hey <@" + message.author.id + "> Pour utiliser la commande fais: !pfc <@yourFriends> <yourChoise>")
                        .setTimestamp()
                        
        
        
                    message.reply({ embeds: [embedd] })
            }
            else if(!choice){
                //message.reply("Hey <@" + message.author.id + "> Ton choix est invalide merci d'utiliser *[pierre, ciseau, papier]*")
                        //.then(() => message.delete());

                        const embed = new MessageEmbed()
        
                .setTitle("Chifoumi")
                .setColor("00ffd5")
                .setDescription("Hey <@" + message.author.id + "> Ton choix est invalide merci d'utiliser *[pierre, ciseau, papier]*")
                .setTimestamp()
                


            message.reply({ embeds: [embed] })
            }
            else{
                //console.log("all ok");

                message.delete();

                var current_source_user_id = message.member.id
                var current_target_user_id = message.mentions.users.first().id
                
                var new_game = {
                    sourceUserId: current_source_user_id,
                    sourceUserChoice: choice,

                    targetUserId: current_target_user_id,
                    targetUserChoice: undefined,

                    reactMessage: undefined
                }

                var existing_game = CURRENT_GAMES.find(game => game.sourceUserId == current_source_user_id && game.targetUserId == current_target_user_id)
                
                if(existing_game) {
                    CURRENT_GAMES.splice(CURRENT_GAMES.indexOf(existing_game), 1);
                    console.log("Spliced" + CURRENT_GAMES);
                }

                CURRENT_GAMES.push(new_game);

                console.log(CURRENT_GAMES);

                var current_channel = client.channels.cache.get(message.channel.id);

                //current_channel.send("🔥 <@" + current_target_user_id + "> ! Tu a été défier dans un duel de " + ROCK_EMOJI + " pierre " + PAPER_EMOJI + " papier " + SCISSOR_EMOJI + " ciseau par <@"+ current_source_user_id + "> ! Choisit se que tu veux faire: ")
                                //.then(sentMessage => {sentMessage.react(ROCK_EMOJI), sentMessage.react(SCISSOR_EMOJI), sentMessage.react(PAPER_EMOJI); new_game.reactMessage = sentMessage; console.log(CURRENT_GAMES)});

                                const embed = new MessageEmbed()
        
                .setTitle("Chifoumi")
                .setColor("00ffd5")
                .setDescription("🔥 <@" + current_target_user_id + "> ! Tu a été défier dans un duel de " + ROCK_EMOJI + " pierre " + PAPER_EMOJI + " papier " + SCISSOR_EMOJI + " ciseau par <@"+ current_source_user_id + "> ! Choisit se que tu veux faire: ")
                .setTimestamp()
                


            current_channel.send({ embeds: [embed] })
                .then(sentMessage => {sentMessage.react(ROCK_EMOJI), sentMessage.react(SCISSOR_EMOJI), sentMessage.react(PAPER_EMOJI); new_game.reactMessage = sentMessage; console.log(CURRENT_GAMES)});

                        
            }
        }
    }
   
})

//client.login(process.env.APP_CONFIG.bot_token);
client.login(process.env.Token);