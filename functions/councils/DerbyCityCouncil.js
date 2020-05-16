const rp = require('request-promise')
const cheerio = require('cheerio')
const moment = require('moment')

var lookupCouncilDerbyCityCouncil = async (postcode, number) => {
  console.log(`Derby city council looking up house number: ${number} for postcode: ${postcode}`)
  try {
    var councilApiResult = await rp({
      url: `https://secure.derby.gov.uk/binday/StreetSearch?StreetNamePostcode=${postcode}&BuildingNameNumber=${number}`,
      transform: function (body) {
        return cheerio.load(body)
      }
    })

    var binResults = []
    councilApiResult('.binresult').each(function () {
      var binResult = cheerio(this)
      var bin = {
        color: binResult.find('img').attr('alt').split(' ')[0].toLowerCase(),
        date: moment(binResult.find('strong').text().split(':')[0], 'dddd, DD MMMM YYYY').format()
      }
      bin.dateHuman = moment(bin.date).format('dddd Do MMMM YYYY')
      switch (bin.color) {
        case 'black':
          bin.type = 'rubbish'
          break
        case 'blue':
          bin.type = 'recycling'
          break
        case 'brown':
          bin.type = 'gardenWaste'
          break
        default:
          bin.type = 'other'
      }
      binResults.push(bin)
    })

    if (binResults.length) {
      return {
        status: true,
        reasonUser: `Here's the next ${binResults.length} bin collections for you`,
        council: 'Derby City Council',
        binResults: binResults
      }
    } else {
      return {
        status: false,
        council: 'Derby City Council',
        reasonUser: 'No bin collections found, please check with Derby City Council'
      }
    }
  } catch (errorResult) {
    console.log('Error looking up address with Derby City Council')
    console.log(errorResult.response.body)
    return {
      status: false,
      reasonUser: 'Something went wrong looking up your bin day',
      council: 'Derby City Council',
      error: true
    }
  }
}

exports = module.exports = lookupCouncilDerbyCityCouncil
