const Discord = require("discord.js");

let targetChannel = null;
const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let errored = false;

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
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);

        for (let word of words) {
            dateModifiers.forEach((mod) => mod(word, date));
        }
        if (errored) {
            error();
            return;
        }
        let unixTime = parseInt(date.getTime() / 1000);
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

const dateModifiers = [parseDate, parseTime, setTimezone];

function setTimezone(word, date) {
    if (word.indexOf("-") === -1) {
        return;
    }
    //W.I.P
    errored = true;
    return;
}

function parseTime(word, date) {
    if (word.indexOf(":") === -1) {
        return;
    }
    const parts = word.split(":");
    if (parts.length !== 2) {
        return;
    }
    hour = makeInt(parts[0]);
    minute = makeInt(parts[1]);
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
        date.setHours(hour);
        date.setMinutes(minute);
    } else {
        errored = true;
        return;
    }
}

function parseDate(word, date) {
    if (word.indexOf("/") === -1) {
        return;
    }
    const parts = word.split("/");
    if (parts.length < 2 || parts.length > 3) {
        return;
    }
    if (parts[2] !== undefined) {
        year = makeInt(parts[2]);
        if (year >= 1970) {
            date.setYear(year);
        } else {
            errored = true;
            return;
        }
    }
    day = makeInt(parts[0]);
    month = makeInt(parts[1]);
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
