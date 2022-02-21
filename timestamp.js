const Discord = require("discord.js");

var target = null;

const embedMessage = new Discord.MessageEmbed()
    .setColor("#00FFFF")
    .setTitle("Local time:")
    .setDescription(`<t:0:F>`);

module.exports = {
    generateTimestamp: (targetChannel, words) => {
        target = targetChannel;
        if (words[1] === undefined) {
            targetChannel.send(
                "Valid inputs: \n!time hh:mm\n!time hh:mm dd/mm\n!time hh:mm dd/mm/yyyy"
            );
            return;
        }
        if (words[1] === "-help" || words[1] === "help") {
            targetChannel.send(
                "Valid inputs: \n!time hh:mm\n!time hh:mm dd/mm\n!time hh:mm dd/mm/yyyy"
            );
            return;
        }
        date = new Date();
        if (words[1].indexOf(":") !== -1) {
            if (words[2] !== undefined && words[2].indexOf("/") !== -1) {
                days = words[2].split("/");
                if (days[2] !== undefined) {
                    year = makeInt(days[2]);
                    if (year >= 1970) {
                        date.setYear(year);
                    } else {
                        error(targetChannel);
                        return;
                    }
                }
                day = makeInt(days[0]);
                month = makeInt(days[1]);
                if (day > 0 && day < 32 && month > 0 && month < 13) {
                    date.setDate(day);
                    date.setMonth(month - 1);
                }
            }
            times = words[1].split(":");
            hour = makeInt(times[0]);
            minute = makeInt(times[1]);
            if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
                date.setHours(hour);
                date.setMinutes(minute);
            } else {
                error(targetChannel);
                return;
            }
        } else {
            error(targetChannel);
            return;
        }
        unixTime = parseInt(date.getTime() / 1000);
        embedMessage.setDescription(`<t:${unixTime}:F>`);
        embedMessage.fields = [];
        embedMessage.addFields({
            name: `Copy Link:`,
            value: `\\<t:${unixTime}:F>`,
        });
        targetChannel.send(embedMessage);
    },
};

function error(targetChannel) {
    targetChannel.send(
        "Not following valid formats: \nhh:mm\nhh:mm dd/mm\nhh:mm dd/mm/yyyy"
    );
}

function makeInt(val) {
    out = parseInt(val);
    if (isNaN(out)) {
        out = -1;
    }
    if (out.toString() !== val && "0" + out.toString() !== val) {
        out = -1;
    }
    return out;
}
