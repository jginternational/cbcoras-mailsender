# cbcoras-mailsender
Send mails based on template and list

## Basics
- Create environment variables for the mail account and password
- Give permission to Non secure apps https://myaccount.google.com/lesssecureapps
- Example:
    - ```npm start licencia "C:\Users\garat\Desktop\JuniorFem"```
    - The folder must the file data.csv
    - The file must contain at least the columns
        - Nombre
        - Apellido 1
        - Mail
    - The folder contains the licences in the following format:
        - ```"element['Nombre'] + " " + element['Apellido 1'] + ".pdf"; ```
