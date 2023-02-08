const CronJob = require('cron').CronJob
const axios = require('axios')
const { tweetThread } = require('./bot')

const url = `https://www.parl.ca/legisinfo/en/overview/json/onagenda`

function getGovernmentBills() {
  return axios.get(url)
}

new CronJob(
  '0 7 * * *', // everyday at 7 am
  function () {
    // Call Twitter BOT to post new Tweet
    getGovernmentBills()
      .then((response) => {
        const allBills = response.data
        if (allBills.length === 0) {
          const tweetText = `${new Date().toLocaleDateString(
            'en-GB'
          )}\nParliament is not sitting today.\nMore information: https://www.parl.ca/legisinfo/\n#cdnpoli`
          tweetThread(tweetText)
        } else {
          const governmentBills = allBills.filter(
            (bill) => bill.IsGovernmentBill
          )
          if (governmentBills.length === 0) {
            const tweetText = `${new Date().toLocaleDateString(
              'en-GB'
            )}\nNo government bills being debated today.\nMore information: https://www.parl.ca/legisinfo/\n#cdnpoli`
            tweetThread(tweetText)
          } else {
            const formattedBills = governmentBills.map(
              (bill) =>
                `${bill.NumberCode} - ${bill.LongTitle} (http://www.parl.ca/legisinfo/en/bill/${bill.ParliamentNumber}-${bill.SessionNumber}/${bill.NumberCode}): ${bill.StatusName}.`
            )
            const tweetText = `${new Date().toLocaleDateString(
              'en-GB'
            )}\n${formattedBills.join('\r\n')}\n#cdnpoli`
            tweetThread(tweetText)
          }
        }
      })
      .catch((err) => {
        tweetThread('Having technical difficulties.')
      })
  },
  null,
  true,
  'America/Toronto'
)
