import express from 'express';
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config();


const emailMessage = (siteUrl) => {
  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: process.env.MAIL_RECIPIENT,
    subject: `Unavailable: ${siteUrl}`,
    text: `This site ${siteUrl} is unavailable`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Wiadomość została wysłana: ' + info.response);
    }
  });
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
  }
});


const checkAvailability = async (url) => {
  try {
    const response = await axios.get(url);

    emailMessage(url);

    return {
      url: url,
      status: 'available',
      date: new Date()
    };
  } catch (error) {
    emailMessage(url);

    return {
      url: url,
      status: 'unavailable',
      date: new Date()
    };
  }
};

let results = [];

const checkSites = async () => {
  const sites = ['https://test.kwiecien.dev', 'https://kwiecien.dev'];
  try {
    results = await Promise.all(
      sites.map((site) => checkAvailability(site))
    );
  } catch (error) {
    console.error(error);
  }
};

setInterval(checkSites, 5000);

app.get('/sites', (req, res) => {
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});