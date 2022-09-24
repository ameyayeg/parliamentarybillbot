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
                    let date = new Date().toLocaleDateString()
                    if(allBills.length === 0) {
                        const tweetText = `${date}\nParliament is not sitting today.`
                        postTweet(tweetText)
                    } else {
                        const governmentBills = allBills.filter(bill => bill.IsGovernmentBill)
                        const formattedBills = governmentBills.map(bill => `${bill.NumberCode}: ${bill.StatusName}.`)
                        const tweetText = `${date}\n${formattedBills.join('\r\n')}\nMore information: https://www.parl.ca/legisinfo/`
                        postTweet(tweetText)
                    }
                }).catch(err => {
                    postTweet("Having technical difficulties.")
                })
        },
        null,
        true,
        'America/Toronto'
    );

 