const cron = require('node-cron');
const nodemailer = require('nodemailer');
const today = new Date();
const day = today.getDate().toString().padStart(2, '0');
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const year = today.getFullYear().toString();
const todayString = `${day}/${month}/${year}`;
console.log(todayString);

const certificats=[
{
"Temps restant": "17j",
"Nom": "VIA SANTE Exchange Delegation Federation",
"Date d'expiration": "2023-04-13"
},
{
"Temps restant": "22j",
"Nom": "FRANCE BREVETS Microsoft Exchange",
"Date d'expiration": "2023-04-18"
},
{
"Temps restant": "33j",
"Nom": "mail.procie.com",
"Date d'expiration": "2023-04-29"
},
]
const domaines=[
  {
  "Temps restant": "217j",
  "Nom": "proudreed.com	",
  "Date d'expiration": "2023-10-30"
  },
  {
  "Temps restant": "320j",
  "Nom": "adapei65.fr",
  "Date d'expiration": "2024-02-10"
  },
  {
  "Temps restant": "680j",
  "Nom": "bredinprat.com",
  "Date d'expiration": "2025-02-04"
  },
  {
    "Temps restant": "761j",
    "Nom": "fondinvest.com",
    "Date d'expiration": "2025-04-26"
    },
  ]
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: "cert.helpdesk@outlook.com",
    pass: "vcyukwfypeuyymwd",
  }
});

function sendEmail(certificats, domaines) {
  let expiringCerts = '';
  let count = 0;
  let certsToDisplay = certificats.filter(cert => {
    const today = new Date();
    const expirationDate = new Date(cert['Date d\'expiration']);
    const timeDiff = expirationDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)-1);
    cert['Temps restant'] = daysLeft;
    return daysLeft <= 15;
  });
  if (certsToDisplay.length === 0) {
    expiringCerts += `<tr style="background-color: white; color: black;"> <td style="border: 1px solid black; text-align: center; color: green;"> RAS</td> <td style="border: 1px solid black; text-align: center; color: green;">RAS</td> <td style="border: 1px solid black; text-align: center; color: green;"> RAS</td> </tr>`;
  } else {
    certsToDisplay.forEach((cert, index) => {
      const daysLeft = cert['Temps restant'];
      expiringCerts += `<tr style="background-color: ${index % 2 === 0 ? 'white' : 'lightgrey'}; color: black;"> <td style="border: 1px solid black; text-align: center;">${cert['Nom']}</td> <td style="border: 1px solid black; text-align: center;">${cert['Date d\'expiration']}</td> <td style="border: 1px solid black; text-align: center;">${daysLeft}j</td> </tr>`;
      count++;
    });
  }
  
  let expiringDomains = '';
  let domainCount = 0;
  let domainsToDisplay = domaines.filter(domain => {
    const today = new Date();
    const expirationDate = new Date(domain['Date d\'expiration']);
    const timeDiff = expirationDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)-1);
    domain['Temps restant'] = daysLeft;
    return daysLeft <= 15;
  });
  if (domainsToDisplay.length === 0) {
    expiringDomains += `<tr style="background-color: white; color: black;"> <td style="border: 1px solid black; text-align: center; color: green;"> RAS</td> <td style="border: 1px solid black; text-align: center; color: green;">RAS</td> <td style="border: 1px solid black; text-align: center; color: green;"> RAS</td> </tr>`;
  } else {
    domainsToDisplay.forEach((domain, index) => {
      const daysLeft = domain['Temps restant'];
      expiringDomains += `<tr style="background-color: ${index % 2 === 0 ? 'white' : 'lightgrey'}; color: black;"> <td style="border: 1px solid black; text-align: center;">${domain['Nom']}</td> <td style="border: 1px solid black; text-align: center;">${domain['Date d\'expiration']}</td> <td style="border: 1px solid black; text-align: center;">${daysLeft}j</td> </tr>`;
      domainCount++;
    });
  }
  const message = `<html><head> 
  <style> 
    body { 
      font-family: "Times New Roman", Times, serif; 
    } 
  </style> 
</head> 
  <body>
    <p>Bonjour,</p>
    <p>Ci-dessous les certificats et domaines qui seront expirés dans les prochains jours :</p>
    <h3 style="border: 1px solid white; padding: 5px;">Certificats qui expirent bientôt (${count}) :</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: black; color: #FF6347;border: 1px solid white;">
          <th style="border: 1px solid white; text-align: center; padding: 5px;">Nom</th>
          <th style="border: 1px solid white; text-align: center; padding: 5px;">Date d'expiration</th>
          <th style="border: 1px solid white; text-align: center; padding: 5px;">Temps restant</th>
        </tr>
      </thead>
      <tbody>
        ${expiringCerts}
      </tbody>
    </table>
    <br>
    <h3 style="border: 1px solid white; padding: 5px;">Domaines qui expirent bientôt (${domainCount}) :</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: black; color: #FF6347;">
          <th style="border: 1px solid white; text-align: center; padding: 5px;">Nom</th>
          <th style="border: 1px solid white; text-align: center; padding: 5px;">Date d'expiration</th>
          <th style="border: 1px solid white; text-align: center; padding: 5px;">Temps restant</th>
        </tr>
      </thead>
      <tbody>
        ${expiringDomains}
      </tbody>
    </table>
    <div style="margin-top:10px; font-family: Arial, Times, serif!important;">
      <img src="https://support.neocles.com/resources/images/logoOBS.png" alt="source" style="width: 200px; height: auto; margin-right: 10px; margin-right: 10px;">
    </div>
    <div>
      <div style="color: blue; font-weight: bold;">Support Flexible Workspace Services</div>
      <div style="color: orange;">Orange Cloud for Business</div>
      <div style="color: blue;">helpdesk@neocles.com</div>
      <div style="color: orange;">Orange Business</div>
      <div style="color: blue;">Immeuble Terra Nova II – 15 rue Henri Rol-Tanguy 93558 Montreuil</div>
      <div style="color: orange;">
        <a href="https://www.orange-business.com/fr/solutions/cloud-computing" style="color: orange; text-decoration: none;">https://www.orange-business.com/fr/solutions/cloud-computing</a>
      </div>
    </div>
  </body>
</html>

`; ;

  const mailOptions = {
    from: 'cert.helpdesk@outlook.com',
    to: 'cert.helpdesk@outlook.com',
    subject: `Vérification quotidienne des certificats et des domaines ce ${todayString}` ,
    html: message
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  }
   
    cron.schedule('*/2 * * * *', () => {
      console.log('Running cron job...');
      sendEmail(certificats, domaines);
    });
