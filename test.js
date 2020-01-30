const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const formatMediaData = proxyquire('./index', { 'request': () => null });

const testData = {
    id: 1234,
    url: 'http://www.example.com/shows/1234/real-title',
    name: 'Actual Show',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Fantasy', 'Science-Fiction'],
    status: 'Running',
    runtime: 60,
    premiered: '2016-07-15',
    officialSite: 'https://www.netflix.com/title/80057281',
    schedule: { time: '', days: ['Thursday'] },
    rating: { average: 8.7 },
    weight: 99,
    network: null,
    webChannel: { id: 1, name: 'Netflix', country: null },
    externals: { tvrage: 12345, thetvdb: 123456, imdb: 'tt0000000' },
    image:
    {
        medium:
            'http://static.example.com/images/medium.jpg',
        original:
            'http://static.example.com/images/original.jpg'
    },
    summary:
        '<p>is an actual show. has a description. multiple sentences.</p>',
    updated: 1234567890,
    _links:
    {
        self: { href: 'http://api.example.com/shows/1234' },
        previousepisode: { href: 'http://api.tvmaze.com/episodes/1234567' }
    },
    _embedded:
    {
        episodes: [
            {
                id: 100001,
                url:
                    'http://www.example.com/episodes/000001/actual-show-1x01-beginning',
                name: 'Chapter: beginning',
                season: 1,
                number: 1,
                airdate: '2016-07-15',
                airtime: '',
                airstamp: '2016-07-15T12:00:00+00:00',
                runtime: 60,
                image:
                {
                    medium:
                        'http://static.example.com/images/medium/000001.jpg',
                    original:
                        'http://static.example.com/images/original/000001.jpg'
                },
                summary:
                    '<p>There is a beginning and someone named Dr. Parse Summary. Things are introduced.</p>',
                _links: { self: { href: 'http://api.tvmaze.com/episodes/000001' } }
            },
            {
                id: 100002,
                url:
                    'http://www.tvmaze.com/episodes/000002/actual-show-1x02-middle',
                name: 'Chapter: middle',
                season: 2,
                number: 1,
                airdate: '2016-07-15',
                airtime: '',
                airstamp: '2016-07-15T12:00:00+00:00',
                runtime: 60,
                image:
                {
                    medium:
                        'http://static.example.com/images/medium/000002.jpg',
                    original:
                        'http://static.example.com/images/original/000002.jpg'
                },
                summary:
                    '<p>A dramatic pause is needed... to convey things properly. Things become complicated, there is a problem. It seems beyond repair without some real risk.</p>',
                _links: { self: { href: 'http://api.example.com/episodes/000002' } }
            },
            {
                id: 100003,
                url:
                    'http://www.tvmaze.com/episodes/000003/actual-show-1x03-end',
                name: 'Chapter: end',
                season: 3,
                number: 1,
                airdate: '2016-07-15',
                airtime: '',
                airstamp: '2016-07-15T12:00:00+00:00',
                runtime: 60,
                image:
                {
                    medium:
                        'http://static.example.com/images/medium/000003.jpg',
                    original:
                        'http://static.example.com/images/original/000003.jpg'
                },
                summary:
                    '<p>The main character takes on the necessary risk and successfully restores order.</p>',
                _links: { self: { href: 'http://api.example.com/episodes/000003' } }
            }
        ]
    }
};


describe('index.js', function () {
    describe('formatMediaData', function () {

        const formattedData = {
            1234:
            {
                totalDurationSec: 10800,
                averageEpisodesPerSeason: 1,
                episodes: {
                    100001:
                    {
                        sequenceNumber: 's1e1',
                        shortTitle: 'beginning',
                        airTimestamp: 1468584000000,
                        shortSummary:
                            'There is a beginning and someone named Dr. Parse Summary.'
                    },
                    100002:
                    {
                        sequenceNumber: 's2e1',
                        shortTitle: 'middle',
                        airTimestamp: 1468584000000,
                        shortSummary:
                            'A dramatic pause is needed... to convey things properly.'
                    },
                    100003:
                    {
                        sequenceNumber: 's3e1',
                        shortTitle: 'end',
                        airTimestamp: 1468584000000,
                        shortSummary:
                            'The main character takes on the necessary risk and successfully restores order.'
                    }
                }
            }
        };

        it('should format media data', function () {
            assert.deepEqual(formatMediaData(testData), formattedData);
        });
    });
});
