const Discord = require("discord.js");

var targetChannel = null;
const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var errored = false;

const embedMessage = new Discord.MessageEmbed()
    .setColor("#00FFFF")
    .setTitle("Local time:")
    .setDescription(`<t:0:F>`);

module.exports = {
    generateTimestamp: (channel, words) => {
        targetChannel = channel;
        errored = false;
        if (words[1] === undefined || words[1] === "help") {
            targetChannel.send(
                "Valid inputs: \nTime in form: `hh:mm`\nDate in form: `dd/mm` or `dd/mm/yyyy`"
            );
            return;
        }
        date = new Date();
        if (words[1].indexOf(":") !== -1) {
            if (words[2] !== undefined && words[2].indexOf("/") !== -1) {
                parseDate(words[2], date);
            }
            parseTime(words[1], date);
        } else if (words[1].indexOf("/") !== -1) {
            if (words[2] !== undefined && words[2].indexOf(":") !== -1) {
                parseTime(words[2], date);
            } else {
                date.setHours(0);
                date.setMinutes(0);
            }
            parseDate(words[1], date);
        } else {
            error();
            return;
        }
        if (errored) {
            error();
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

function error() {
    targetChannel.send(
        "Not following valid formats: \nTime in form: `hh:mm`\nDate in form: `dd/mm` or `dd/mm/yyyy`"
    );
}

function parseTime(word, date) {
    times = word.split(":");
    hour = makeInt(times[0]);
    minute = makeInt(times[1]);
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
        date.setHours(hour);
        date.setMinutes(minute);
    } else {
        errored = true;
        return;
    }
}

function parseDate(word, date) {
    days = word.split("/");
    if (days[2] !== undefined) {
        year = makeInt(days[2]);
        if (year >= 1970) {
            date.setYear(year);
        } else {
            errored = true;
            return;
        }
    }
    day = makeInt(days[0]);
    month = makeInt(days[1]);
    year = date.getYear();
    if (
        day >= 1 &&
        day <= monthLength(month, year) &&
        month >= 1 &&
        month <= 12
    ) {
        date.setDate(day);
        date.setMonth(month - 1);
    } else {
        errored = true;
        return;
    }
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

function monthLength(month, year) {
    if (month == 2) {
        if (leapYear(year)) {
            return 29;
        }
    }
    return monthLengths[month - 1];
}

function leapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
