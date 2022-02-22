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
    timezoneRegex = /^([+-]{1}[0-9]{1,2})$/;
    if (word.indexOf("+") === -1 && word.indexOf("-") === -1) {
        return;
    }
    const matches = timezoneRegex.exec(word);
    if (matches === null) {
        return; // error does not match
    }
    const zone = matches[1];
    if (date.getHours() - zone < 0) {
        date.setDate(date.getDate() - 1);
    }
    if (date.getHours() - zone > 23) {
        date.setDate(date.getDate() + 1);
    }
    date.setHours(date.getHours() - zone);
    return;
}

function parseTime(word, date) {
    timeRegex = /^([0-9]{2}):([0-9]{2})$/;
    if (word.indexOf(":") === -1) {
        return;
    }
    const matches = timeRegex.exec(word);
    if (matches === null) {
        return; // error does not match
    }
    const hour = matches[1];
    const minute = matches[2];
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
        date.setHours(hour);
        date.setMinutes(minute);
    } else {
        errored = true;
        return;
    }
}

function parseDate(word, date) {
    dateRegex = /^([0-9]{2})\/([0-9]{2})\/?([0-9]{4})?$/;
    if (word.indexOf("/") === -1) {
        return;
    }
    const matches = dateRegex.exec(word);
    if (matches === null) {
        return; // error does not match
    }
    const day = matches[1];
    const month = matches[2];
    let year = matches[3];
    if (year !== undefined) {
        date.setYear(year);
    }
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
