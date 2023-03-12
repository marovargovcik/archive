const axios = require('axios').default;
const contentful = require('contentful');
const contentfulManagement = require('contentful-management');
const sendGrid = require('@sendgrid/mail');
const sendGridClient = require('@sendgrid/client');

const contentfulClient = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.CONTENTFUL_SPACE_ID
});

const contentfulManagementClient = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
});

const imgur = axios.create({
  baseURL: 'https://api.imgur.com/3',
  headers: {
    Authorization: 'Client-ID 335a44d3c6c8965'
  }
});

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
sendGridClient.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  contentful: contentfulClient,
  contentfulManagement: contentfulManagementClient,
  imgur,
  sendGrid,
  sendGridClient
};
