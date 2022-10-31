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
                        const tweetText = `${new Date().toLocaleDateString('en-GB')}\nParliament is not sitting today.\nMore information: https://www.parl.ca/legisinfo/`
                        postTweet(tweetText)
                    } else {
                        const governmentBills = allBills.filter(bill => bill.IsGovernmentBill)
                        if(governmentBills.length === 0) {
                            const tweetText = `${new Date().toLocaleDateString('en-GB')}\nNo government bills being debated today.\nMore information: https://www.parl.ca/legisinfo/`
                            postTweet(tweetText)
                        } else {
                            // const formattedBills = governmentBills.map(bill => `${bill.NumberCode}: ${bill.StatusName}.`)
                            function checkStatus(status) {
                                if(status === 'At first reading in the House of Commons') {
                                    return '1st reading in @HoCChamber'
                                } else if(status === 'At second reading in the House of Commons') {
                                    return '2nd reading in @HoCChamber'
                                } else if(status === 'At third reading in the House of Commons') {
                                    return '2nd reading in @HoCChamber'
                                } else if(status === 'At first reading in the Senate') {
                                    return '1st reading in @SenateCA'
                                } else if(status === 'At second reading in the Senate') {
                                    return '2nd reading in @SenateCA'
                                } else if(status === 'At third reading in the Senate') {
                                    return '3rd reading in @SenateCA'
                                } else if (status === 'At report stage in the House of Commons') {
                                    return 'Report stage in @HoCChamber'
                                } else if(status === 'At report stage in the Senate') {
                                    return 'Report stage in @SenateCA'
                                }
                            }
                            const formattedBills = governmentBills.map(bill => `${bill.NumberCode} - ${bill.ShortTitle}: ${checkStatus(bill.StatusName)}.`)
                            const tweetText = `${new Date().toLocaleDateString('en-GB')}\n${formattedBills.join('\r\n')}\nMore information: https://www.parl.ca/legisinfo/`
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

 