var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs");

// Get parameters
var myArgs = process.argv.slice(2);

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

    // Send a mail foreach user
    emails.forEach(element => {
        // Replace the literals
        var full_name = element.name + " " + element.surname;
        var custom_content = parse(template_content, full_name);

        // Mail settings
        var mailOptions = {
            from: "Javi Gárate - Coras <"+process.env.CORAS_ACCOUNT+">",
            to: element.email,
            subject: 'Firma licencia baloncesto',
            html: custom_content,
            attachments: [{
                filename: 'Solicitud licencia - '+full_name+'.pdf',
                path: 'C:/Users/garat/Downloads/Sofi.pdf',
                contentType: 'application/pdf'
            }]
        };

        // Send
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent '+full_name+ ': ' + info.response);
            }
        });
    });
}

function GetMailList() {
    var users = [{
        name: "Javi",
        surname: "",
        email: ""
    },{
        name: "Javi otro",
        surname: "",
        email: ""
    }];

    return users;
}


// So we can start processing commands
switch (myArgs[0]) {
    case "licencia": ProcessLicenceMails(); break;
}