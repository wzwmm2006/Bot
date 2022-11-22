const { TwitterApi } = require('twitter-api-v2');

// Instantiate with desired auth type (here's Bearer v2 auth)
const client = new TwitterApi({
    appKey: '',
    appSecret: '',
    accessToken: '',
    accessSecret: '',
});

// Tell typescript it's a readonly app
const readOnlyClient = client.readWrite;

// 获取用户最新推�?
exports.GetLastTweet = async (user) => {
    const userTimeline = await client.v1.userTimelineByUsername(user);
    const fetchedTweets = userTimeline.tweets;
    //console.log(fetchedTweets[0]);
    return fetchedTweets[0];
}

  
