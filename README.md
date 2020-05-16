# BinDays
Aggregation API and lookup website (coming soon!) for refuse and recycling bin collection days

## Project Phase
Currently we are aiming at adding all the council's we can to the API before building the website

## Supported Councils
* Derby City Council
* Hastings Council
* BCP (Bournemouth, Christchurch and Poole) Council, both the standalone poole area system and Bournemouth/christchurch systems 
* Nottingham City Council

## Usage
To use make a HTTP request to (please note URL subject to change)

### Fetch bin days
To retreive a list of bin days
URL: https://us-central1-bindaysapi.cloudfunctions.net/lookupAddress?postcode=POSTCODE_HERE&number=HOUSE_NUMBER_HERE
example result: 
{
  "status": true,
  "council": "BCP (Bournemouth/Christchurch)",
  "reasonUser": "Here's the next 6 bin collections for you",
  "binResults": [
    {
      "type": "foodWaste",
      "date": "2020-05-20T00:00:00.000Z",
      "dateHuman": "Wednesday 20th May 2020"
    },
    {
      "type": "foodWaste",
      "date": "2020-05-20T00:00:00.000Z",
      "dateHuman": "Wednesday 20th May 2020"
    },
    {
      "type": "rubbish",
      "date": "2020-05-20T00:00:00.000Z",
      "dateHuman": "Wednesday 20th May 2020"
    },
    {
      "type": "rubbish",
      "date": "2020-05-20T00:00:00.000Z",
      "dateHuman": "Wednesday 20th May 2020"
    },
    {
      "type": "recycling",
      "date": "2020-05-27T00:00:00.000Z",
      "dateHuman": "Wednesday 27th May 2020"
    },
    {
      "type": "recycling",
      "date": "2020-05-27T00:00:00.000Z",
      "dateHuman": "Wednesday 27th May 2020"
    }
  ],
  "nextCollection": {
    "foodWaste": {
      "type": "foodWaste",
      "date": "2020-05-20T00:00:00.000Z",
      "dateHuman": "Wednesday 20th May 2020"
    },
    "rubbish": {
      "type": "rubbish",
      "date": "2020-05-20T00:00:00.000Z",
      "dateHuman": "Wednesday 20th May 2020"
    },
    "recycling": {
      "type": "recycling",
      "date": "2020-05-27T00:00:00.000Z",
      "dateHuman": "Wednesday 27th May 2020"
    }
  }
}


### Lookup council
To check if the postcode is for a council currently supported by the API
URL: https://us-central1-bindaysapi.cloudfunctions.net/lookupCouncil?postcode=POSTCODE_HERE
example result: 

{
  "status": true,
  "reasonUser": "Council for postcode: DE11aa is Derby",
  "council": "Derby",
  "councilName": "Derby City Council"
}

