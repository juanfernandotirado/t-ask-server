const axios = require('axios')

const eventsSearch = (req, res, next) => {

    let queryText = req.query.text;

    if (!queryText) {
        queryText = "tech";
    }
    
    //Get upcoming event from meetup
    axios.get(`https://api.meetup.com/find/upcoming_events?key=${process.env.MEETUP_KEY}&page=10&text=${queryText}`)
        .then((response) => {
            let events = response.data.events;
            res.send(events)
        })
        .catch(err => {

            if (err) {
                const e = new Error(err)
                e.status = 500

                next(e)
            } else {
                next(err)
            }

        })

}

exports.eventsSearch = eventsSearch;