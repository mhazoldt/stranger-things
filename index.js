const request = require('request');


const url = "http://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes";

request(url, (err, response, body) => {
    const mediaData = JSON.parse(body);
    const formattedMediaData = formatMediaData(mediaData);
    console.log('formattedMediaData: ', formattedMediaData);
})


function formatMediaData(mediaData) {
    const { id, _embedded: { episodes } } = mediaData;
    const formattedMediaData = {
        [id]: {
            totalDurationSec: getTotalShowDuration(episodes),
            averageEpisodesPerSeason: getAverageEpisodesPerSeason(episodes),
            episodes: formatEpisodes(episodes)
        }
    };

    return formattedMediaData;
}

function getAverageEpisodesPerSeason(episodes) {
    const episodesBySeason = episodes.reduce((result, episode) => {
        result[episode.season] 
            ? result[episode.season].push(episode)
            : result[episode.season] = [episode];
        return result;
    }, {})

    const numberOfSeasons = Object.keys(episodesBySeason).length;
    const numberOfEpisodes = episodes.length;

    return numberOfEpisodes / numberOfSeasons;
}

function getTotalShowDuration(episodes) {
    const totalDuration = episodes.reduce((result, episode) => result + episode.runtime, 0)
    return totalDuration * 60;
}

function getShortTitle(episodeName) {
    const indexOfPrefix = episodeName.indexOf(':') + 2;
    const shortTitle = episodeName.slice(indexOfPrefix);
    return shortTitle;
}

function getSequenceNumber(episode) {
    return `s${episode.season}e${episode.number}`
}

function getAirTimestamp(airstamp) {
    const airTimestamp = new Date(airstamp);
    return airTimestamp.getTime();
}

function firstSectionInvalid(summarySections) {
    const invalidEndings = ['Dr', 'Mr', '\\.'];

    let hasInvalidEnding = invalidEndings.reduce((result, ending) => {
        const testRegex = new RegExp(`${ending}$`);
        const regexResult = testRegex.test(summarySections[0]);

        return regexResult || result
    }, false);

    return hasInvalidEnding
}

function getShortSummary(summary) {
    if(!summary) return ''

    let summarySections = summary.split('. ');
    let hasInvalidEnding = firstSectionInvalid(summarySections);

    while(hasInvalidEnding) {
        let firstSection = summarySections.shift();
        summarySections[0] = firstSection + '. ' + summarySections[0]; 
        hasInvalidEnding = firstSectionInvalid(summarySections);
    }

    let shortSummary = summarySections[0];
    shortSummary = shortSummary.slice(3);
    const closingTagRegex = /<\/p>$/;
    const hasClosingTag = closingTagRegex.test(shortSummary);
    shortSummary = hasClosingTag ? shortSummary.slice(0, -4) : shortSummary + '.';

    return shortSummary;
}

function formatEpisodes(episodes) {
    const formattedEpisodes = episodes.reduce((result, episode) => {
        result[episode.id] = {
            sequenceNumber: getSequenceNumber(episode),
            shortTitle: getShortTitle(episode.name),
            airTimestamp: getAirTimestamp(episode.airstamp),
            shortSummary: getShortSummary(episode.summary)
        }
        return result
    }, {})

    return formattedEpisodes;
}

module.exports = formatMediaData;