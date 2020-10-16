var path = require('path');
var path = require('path');
var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs");
const csv = require('csv-parser');

// Get parameters
var myArgs = process.argv.slice(2);
const command = myArgs[0];
const dir = myArgs[1];

// If credentials file not found
if (process.env.CORAS_ACCOUNT === "") throw "Credentials not found";
if (process.env.CORAS_ACCOUNT_PASS === "") throw "Credentials not found";

// mailer is common for any command
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CORAS_ACCOUNT,
        pass: process.env.CORAS_ACCOUNT_PASS
    }
});

// Utitily to replace template %s --> variable
function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}


// Send Licence to be signed
function ProcessLicenceMails() {
    // Load the mail template raw
    var template_content = fs.readFileSync('./template-licencia-firma.html', { encoding: 'utf8', flag: 'r' });

    // Load the list of emails from the excel
    var emails = GetMailList();
    emails.then(function (result) {
        // use the result here
        console.log(result);

        // Send a mail foreach user
        result.forEach(element => {
            // Replace the literals
            var full_name = element.Nombre + " " + element["Apellido 1"];
            var custom_content = parse(template_content, full_name);

            // Mail settings
            var mailOptions = {
                from: "Javi Gárate - Coras <" + process.env.CORAS_ACCOUNT + ">",
                to: element.Mail,
                subject: 'Firma licencia - ' + element.Nombre,
                html: custom_content,
                attachments: [{
                    filename: 'Solicitud licencia - ' + full_name + '.pdf',
                    path: path.join(dir, full_name +".pdf"),
                    contentType: 'application/pdf'
                }]
            };
            // Send
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent ' + full_name + ': ' + info.response);
                }
            });
        });
    });
}

function GetMailList() {
    return new Promise(function (resolve, reject) {
        var results = [];
        fs.createReadStream(path.join(dir, 'data.csv'))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', reject);
    });
}


// So we can start processing commands
switch (command) {
    case "licencia": ProcessLicenceMails(); break;
}