const CronJob = require('cron').CronJob;
const { postTweet } = require('./bot');
const axios = require('axios')

const url = `https://www.parl.ca/legisinfo/en/overview/json/onagenda`

function getGovernmentBills() {
    return axios.get(url)
} 

    new CronJob(
        '* * * * *', // everyday at 7 am
        function() {
            // Call Twitter BOT to post new Tweet
            getGovernmentBills()
                .then(response => {
                    const allBills = response.data
                    const governmentBills = allBills.filter(bill => bill.IsGovernmentBill)
                    const formattedBills = governmentBills.map(bill => `${bill.NumberCode}: ${bill.StatusName}.`)
                    let date = new Date().toLocaleString('en-US', {
                        timeZone: 'America/New_York',
                      })
                    const tweetText = `${date}\n${formattedBills.join('\r\n')}\nMore information: https://www.parl.ca/legisinfo/`
                    postTweet(tweetText)
                }).catch(err => {
                    postTweet("No sitting")
                })
        },
        null,
        true,
        'America/Toronto'
    );

 