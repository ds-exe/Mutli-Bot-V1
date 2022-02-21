const Discord = require("discord.js");

const embedMessage = new Discord.MessageEmbed()
    .setColor("#00FFFF")
    .setTitle("Local time:")
    .setDescription(`<t:0:F>`);

module.exports = {
    generateTimestamp: (targetChannel, words) => {
        if (words[1] === undefined) {
            targetChannel.send(
                "Not following valid formats: \nhh:mm\ndd/mm hh:mm\ndd/mm/yyyy hh:mm"
            );
            return;
        }
        date = new Date();
        if (words[1].indexOf(":") !== -1) {
            times = words[1].split(":");
            hour = parseInt(times[0]);
            minute = parseInt(times[1]);
            if (isNaN(hour) || isNaN(minute)) {
                return;
            }
            if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
                date.setHours(hour);
                date.setMinutes(minute);
            }
        } else if (words[1].indexOf("/") !== -1) {
            if (words[2] === undefined) {
                return;
            }

            days = words[1].split("/");
            if (days[2] !== undefined) {
                year = parseInt(days[2]);
                if (isNaN(year)) {
                    return;
                }
                if (year >= 1970) {
                    date.setYear(year);
                }
            }

            day = parseInt(days[0]);
            month = parseInt(days[1]);
            if (isNaN(day) || isNaN(month)) {
                return;
            }
            if (day > 0 && day < 32 && month > 0 && month < 13) {
                date.setDate(day);
                date.setMonth(month - 1);
            }

            times = words[2].split(":");
            hour = parseInt(times[0]);
            minute = parseInt(times[1]);
            if (isNaN(hour) || isNaN(minute)) {
                return;
            }
            if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
                date.setHours(hour);
                date.setMinutes(minute);
            }
        } else {
            targetChannel.send(
                "Not following valid formats: \nhh:mm\ndd/mm hh:mm\ndd/mm/yyyy hh:mm"
            );
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
