const CronJob = require('cron').CronJob;
const { postTweet } = require('./bot');
const axios = require('axios')

const url = `https://www.parl.ca/legisinfo/en/overview/json/onagenda`

function getGovernmentBills() {
    return axios.get(url)
} 

    new CronJob(
        '0 7 * * *', // everyday at 7 am
        function() {
            // Call Twitter BOT to post new Tweet
            getGovernmentBills()
                .then(response => {
                    const allBills = response.data
                    if(allBills.length === 0) {
                        const tweetText = `${new Date().toLocaleDateString()}\nParliament is not sitting today.\nMore information: https://www.parl.ca/legisinfo/`
                        postTweet(tweetText)
                    } else {
                        const governmentBills = allBills.filter(bill => bill.IsGovernmentBill)
                        if(governmentBills.length === 0) {
                            const tweetText = `${new Date().toLocaleDateString()}\nNo government bills being debated today.\nMore information: https://www.parl.ca/legisinfo/`
                            postTweet(tweetText)
                        } else {
                            const formattedBills = governmentBills.map(bill => `${bill.NumberCode}: ${bill.StatusName}.`)
                            const tweetText = `${new Date().toLocaleDateString()}\n${formattedBills.join('\r\n')}\nMore information: https://www.parl.ca/legisinfo/`
                            postTweet(tweetText)
                        }
                    }
                }).catch(err => {
                    postTweet("Having technical difficulties.")
                })
        },
        null,
        true,
        'America/Toronto'
    );

 