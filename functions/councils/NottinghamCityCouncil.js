const rp = require('request-promise')
const moment = require('moment')

var lookupCouncilNottinghamCityCouncil = async (postcode, number) => {
  console.log(`Nottingham City Council looking up house number: ${number} for postcode: ${postcode}`)

  var apiResult

  var queryParam = encodeURIComponent(`${number} ${postcode}`)
  console.log(queryParam)
  console.log('Looking up UPRN')
  var UPRNData = await rp({
    url: `https://geoserver.nottinghamcity.gov.uk/myproperty/handler/proxy.ashx?http://locator.nottinghamcity.gov.uk/LocatorHub/rest.svc/Match/fcce08c1-05ee-4b53-a828-a4846c94e599/CASCADE?Query=${queryParam}&Fuzzy=false&ReturnCoordinateSystem=27700&CacheID=%27NLPG%27:b6377fdd-5b91-4a21-99e5-a19f2c0c683b&format=json`,
    json: true
  })

  console.log(UPRNData)
  var UPRN = UPRNData.MatchedRecord.R[3]
  if (UPRN) {
    UPRN = UPRN.split(':')[1]
    console.log(UPRN)
    var collectionData = await rp({
      url: `https://geoserver.nottinghamcity.gov.uk/myproperty/handler/proxy.ashx?http://geoserver.nottinghamcity.gov.uk/wcf/BinCollection.svc/livebin/${UPRN}`,
      json: true
    })
    console.log(collectionData)

    var binResults = []

    var previousLocale = moment.locale()
    moment.locale('en-gb')

    var rubbishDayIndex
    var bin
    var thisWeekRubbishBinDate
    var startOfThisWeekDate
    var startOfNextWeekDate
    var nextWeekRubbishBinDate

    moment.weekdays(true).forEach((weekday, index) => {
      console.log(weekday, index)
      if (collectionData.CollectionDetails.DomesticDay === weekday) {
        rubbishDayIndex = index
      }
    })
    console.log(`Rubbish day index: ${rubbishDayIndex}`)

    var weekDayNumberToday = moment().weekday()
    console.log(weekDayNumberToday)

    startOfThisWeekDate = moment().startOf('week')
    startOfNextWeekDate = moment().add(1, 'week').startOf('week')

    if (collectionData.CollectionDetails.DryRecyclingDay === 'Not Applicable') {
      delete (collectionData.CollectionDetails.DryRecyclingDay)
    }

    if (collectionData.CollectionDetails.DryRecyclingDay) {
      console.log(`Dry recycling collection day is: ${collectionData.CollectionDetails.DryRecyclingDay}`)
      var weekNumber = moment().week()
      console.log(weekNumber)
      var isOddEvenWeekNumber = ((moment().week() % 2) === 0)
      console.log(isOddEvenWeekNumber)
      var weekOddEvenAB = ''
      if (isOddEvenWeekNumber) {
        console.log('Week number is even')
        weekOddEvenAB = 'A'
      } else {
        console.log('Week number is odd')
        weekOddEvenAB = 'B'
      }
      console.log(weekOddEvenAB)

      var recyclingDayIndex

      moment.weekdays(true).forEach((weekday, index) => {
        console.log(weekday, index)
        if (collectionData.CollectionDetails.DryRecyclingDay === weekday) {
          recyclingDayIndex = index
        }
      })

      if (weekOddEvenAB === collectionData.CollectionDetails.RecyclingWeek) {
        console.log('Recycling is/was this week')
        if (recyclingDayIndex >= weekDayNumberToday) {
          console.log('Collection day either today or later this week')
          var thisWeekRecyclingBinDate = moment(startOfThisWeekDate).add(recyclingDayIndex, 'day')
          console.log(startOfThisWeekDate.format())
          console.log(thisWeekRecyclingBinDate.format())
          bin = {
            type: 'recycling',
            date: thisWeekRecyclingBinDate.format()
          }
          bin.dateHuman = moment(bin.date).format('dddd Do MMMM YYYY')
          binResults.push(bin)
        }

        nextWeekRubbishBinDate = moment(startOfNextWeekDate).add(rubbishDayIndex, 'day')
        console.log(startOfNextWeekDate.format())
        console.log(nextWeekRubbishBinDate.format())

        bin = {
          type: 'rubbish',
          date: nextWeekRubbishBinDate.format()
        }
        bin.dateHuman = moment(bin.date).format('dddd Do MMMM YYYY')
        binResults.push(bin)
      } else {
        console.log('Recycling is next week, rubbish this week')
        if (rubbishDayIndex >= weekDayNumberToday) {
          console.log('Collection day either today or later this week')

          thisWeekRubbishBinDate = moment(startOfThisWeekDate).add(rubbishDayIndex, 'day')
          console.log(startOfThisWeekDate.format())
          console.log(thisWeekRubbishBinDate.format())
          bin = {
            type: 'rubbish',
            date: thisWeekRubbishBinDate.format()
          }
          bin.dateHuman = moment(bin.date).format('dddd Do MMMM YYYY')
          binResults.push(bin)
        }

        var nextWeekRecyclingBinDate = moment(startOfNextWeekDate).add(recyclingDayIndex, 'day')
        console.log(startOfNextWeekDate.format())
        console.log(nextWeekRecyclingBinDate.format())

        bin = {
          type: 'recycling',
          date: nextWeekRecyclingBinDate.format()
        }
        bin.dateHuman = moment(bin.date).format('dddd Do MMMM YYYY')
        binResults.push(bin)
      }
    } else {
      console.log('No dry recycling collection day, both weeks are rubbish')
      // generate bin calendar for this weeks rubbish bin (if rubbish day not passed) and next week's rubbish bin

      console.log(rubbishDayIndex)
      if (rubbishDayIndex >= weekDayNumberToday) {
        console.log('Collection day either today or later this week')

        thisWeekRubbishBinDate = moment(startOfThisWeekDate).add(rubbishDayIndex, 'day')
        console.log(startOfThisWeekDate.format())
        console.log(thisWeekRubbishBinDate.format())
        bin = {
          type: 'rubbish',
          date: thisWeekRubbishBinDate.format()
        }
        bin.dateHuman = moment(bin.date).format('dddd Do MMMM YYYY')
        binResults.push(bin)
      }

      startOfNextWeekDate = moment().add(1, 'week').startOf('week')
      nextWeekRubbishBinDate = moment(startOfNextWeekDate).add(rubbishDayIndex, 'day')
      console.log(startOfNextWeekDate.format())
      console.log(nextWeekRubbishBinDate.format())

      bin = {
        type: 'rubbish',
        date: nextWeekRubbishBinDate.format()
      }
      bin.dateHuman = moment(bin.date).format('dddd Do MMMM YYYY')
      binResults.push(bin)
    }

    moment.locale(previousLocale)
    console.log(binResults)
    apiResult = {
      status: true,
      council: 'Nottingham',
      councilName: 'Nottingham City Council',
      reasonUser: `Here's the next ${binResults.length} bin collections for you`,
      binResults: binResults
    }
  } else {
    apiResult = {
      status: false,
      reasonUser: "Nottingham City Council couldn't find your address",
      council: 'Nottingham',
      councilName: 'Nottingham City Council'
    }
  }
  return apiResult
}

exports = module.exports = lookupCouncilNottinghamCityCouncil
