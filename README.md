# Project Description

A Twitter bot that tells you what government bills are up for debate daily.

The project uses the following technologies:

<ul>
  <li>Node</li>
  <li>Twitter API</li>
  <li>Axios</li>
  <li>Node</li>
  <li>Cron Job</li>
</ul>

The bot is scheduled to tweet out every morning using the Cron Job package. A new instance of the package then makes an Axios get request to the Canadian House of Commons API endpoint. It will then output the government bills scheduled for debate that day.

# How to install

First, you'll need to sign up with Twitter's developer platform to get access to the API. Once you sign up, please note down the following four keys, which you will have to store in an environment file:

<ul>
  <li>API key</li>
  <li>API key secret</li>
  <li>Access token</li>
  <li>Access token secret</li>
</ul>

Then, after cloning the repo, please make sure to use install all the dependiencies using the following:

```javascript
$ npm install
```
Store the four aforementioned keys in a .env file as four separate variables, as such:
```javascript
TWITTER_API_KEY="INSERT VARIABLE HERE"
TWITTER_API_SECRET="INSERT VARIABLE HERE"
TWITTER_ACCESS_TOKEN="INSERT VARIABLE HERE"
TWITTER_ACCESS_TOKEN_SECRET="INSERT VARIABLE HERE"
```
Then use ```node app.js``` in your terminal to spin up a local development server and you'll see the day's government bills tweeted out by your bot at 7 a.m. ET.

<img width="597" alt="Screenshot 2022-10-02 at 19 07 11" src="https://user-images.githubusercontent.com/91851828/193480354-3027484a-bd84-44c0-b61d-09cb89361a62.png">

Tada!

