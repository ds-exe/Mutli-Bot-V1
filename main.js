const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();

const token = config.token;
const prefix = config.prefix

client.login(token); // Log in token pulled from .gitignore

client.on("ready", () => {
    console.log("Connected as " + client.user.tag);
    //Setting activity: "Now listening to !help"
    client.user.setActivity("!help", { type: "LISTENING" });
});

client.on('message', message => {
    if (message.content.startsWith(prefix)) {
        next(message);
    }
    
});

async function next(message) { 
    //let targetChannel = client.channels.cache.get(message.d.channel_id);
    let targetChannel = client.channels.cache.get(message.channel.id)
    msg = message.content;
    msg = msg.replace(`${prefix}`,"").toLowerCase();
    /*
    pos = msg.indexOf(" ");
    if (pos === -1) {
        command = msg;
        msg = "";
    } else {
        command = msg.slice(0, pos);
        msg = msg.slice(pos + 1);
    }*/
    words = msg.replace(/[\|&;\$%@"<>\(\)\+,]/g, "").split(" ");
    command = words[0];

    switch (command) {
        case "time":
        case "date":
            if (words[1] === undefined) {
                targetChannel.send(
                    "Not following valid formats: \nhh:mm\ndd/mm hh:mm\ndd/mm/yyyy hh:mm"
                );
                break;
            }
            if (words[1].indexOf(":") !== -1) {
                times = words[1].split(":");
                hour = parseInt(times[0]);
                minute = parseInt(times[1]);
                if (isNaN(hour) || isNaN(minute)) {
                    break;
                }
                if ((hour >= 0 && hour < 24) && (minute >= 0 && minute < 60)) {
                    date = new Date();
                    date.setHours(hour);
                    date.setMinutes(minute);
                    targetChannel.send(
                        `<t:${parseInt(date.getTime()/1000)}:F>` +
                        `\n\\<t:${parseInt(date.getTime()/1000)}:F>`
                    );
                }
            } else if (words[1].indexOf("/") !== -1) {
                if (words[2] === undefined) {
                    break;
                }

                days = words[1].split("/");
                date = new Date();
                if (days[2] !== undefined) {
                    year = parseInt(days[2]);
                    if (isNaN(year)) {
                        break;
                    }
                    if (year >= 1970) {
                        date.setYear(year);
                    }
                }

                day = parseInt(days[0]);
                month = parseInt(days[1]);
                if (isNaN(day) || isNaN(month)) {
                    break;
                }
                if ((day > 0 && day < 32) && (month > 0 && month < 13)) {
                    date.setDate(day);
                    date.setMonth(month-1);
                } 

                times = words[2].split(":");
                hour = parseInt(times[0]);
                minute = parseInt(times[1]);
                if (isNaN(hour) || isNaN(minute)) {
                    break;
                }
                if ((hour >= 0 && hour < 24) && (minute >= 0 && minute < 60)) {
                    date.setHours(hour);
                    date.setMinutes(minute);
                    targetChannel.send(
                        `<t:${parseInt(date.getTime()/1000)}:F>` +
                        `\n\\<t:${parseInt(date.getTime()/1000)}:F>`
                    );
                }
            } else {
                targetChannel.send(
                    "Not following valid formats: \nhh:mm\ndd/mm hh:mm\ndd/mm/yyyy hh:mm"
                );
            }
            break;
        case "help":
            targetChannel.send(
                "Available commands:\n!time\n!date"
            );
            break;
        default:
            targetChannel.send(
                "Syntax Error"
            );
            break;
    }
}

client.on("error", console.error);
client.login(token);