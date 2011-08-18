# twitter-xauth.js

## About twitter-xauth.js

 - a simple Twitter API Wrapper Class
  - authorization using xAuth
  - send tweets
 - twitter.js depends on oauth.js and sha1.js from [oauth on google code.](http://code.google.com/p/oauth/source/browse/#svn%2Fcode%2Fjavascript)

## API Documentation

Please refer to the class summary under the `docs` directory

## Usage

    // authorization
    var authParams = {
        consumerKey    : 'DUMMY-CONSUMER-KEY',
        consumerSecret : 'DUMMY-CONSUMER-SECRET',
        userName       : 'DUMMY-USER-NAME',
        password       : 'DUMMY-PASSWORD',
        success : function(token, secret){                  // callback method on success
                    alert("token:"+token+" secret:"+secret);
                },
        error : function(code, message){                    // callback method on error
                    alert("error:"+code+" message:"+message);
                }
    };
    Twitter.authorize(authParams);

See the `examples` directory for sample  application code.

## Error Codes

    100, consumer key or secret is null
    101, access token or secret is null
    102, tweet text too long
    103, status duplicate
    104, authorization failed. wrong username or password.
    400, api accesss limit has been exceeded
    401, failed to authorization(only Twitter::authorization()), or invalid access token.
    403, request unauthorized api
    404, request Non-existent api
    500, Internal server error(Twitter error)
    502, Twitter network error or under maintenance(Twitter error)
    503, Twitter service unavailable(Twitter error)
    900, unknown error

