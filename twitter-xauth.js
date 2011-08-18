/*
 * twitter-xauth.js. A simple twitter library using xAuth
 * Copyright (c)  2011 Dwango Co., Ltd.
 * Released under the GPL v2 http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * NOTICE!
 * twitter.js requires oauth.js and sha1.js
 * please write these line to html header
 *
 * <script src="sha1.js">
 * <script src="oauth.js">
 * <script src="twitter-xauth.js">
 */

/**
 * @class Twitter class
 * @constructor
 * @requires sha1.js <a href="http://code.google.com/p/oauth/source/browse/#svn%2Fcode%2Fjavascript">see</a>
 * @requires oauth.js <a href="http://code.google.com/p/oauth/source/browse/#svn%2Fcode%2Fjavascript">see</a>
 * @param {Object} params
 * @param {String} params.consumerKey
 * @param {String} params.consumerSecret
 * @param {String} params.accessToken
 * @param {String} params.accessTokenSecret
 * @param {Object} [params.errorMessages] override errorMessage. example params.errorMessages.tweetTooLong = "hogehoge"
 */
function Twitter(params) {
    this._init(params);
};

/**
 * error code and messages
 * @static
 * @constant
 */
Twitter.errors = {
    invalidConsumerInfo : {code : 100, message : 'consumer key and secret is required'}, 
    notAuthorized       : {code : 101, message : 'access token and secret is required'}, 
    tweetTooLong        : {code : 102, message : 'tweet text too long'}, 
    statusDuplicate     : {code : 103, message : 'Status is a duplicate'}, 
    wrongVal            : {code : 104, message : 'Invalid user name or password'}, 
    authorizeError      : {code : 401, message : 'Failed to authorization'}, 
    unknown             : {code : 900, message : 'Unknown error'} 
};

/**
 * constant twitter API urls
 * @inner
 * @static
 * @constant
 */
Twitter.URLS = {
    AUTHORIZE : "http://api.twitter.com/oauth/access_token",
    TWEET     : "http://api.twitter.com/1/statuses/update.json" 
};

/**
 * using default headers for XmlHttpRequest
 * @static
 * @constant
 */
Twitter.defaultHeaders = {
    "Accept-Encoding" : "none",
    "Accept-Language" : "en",
    "Accept-Charset" : "UTF-8",
    "Cookie" : ""
};

/**
 * constant oauth version
 * @inner
 * @static
 * @constant
 */
Twitter.OAUTH_VERSION = "1.0";
/**
 * constant oauth signature method
 * @inner
 * @static
 * @constant
 */
Twitter.OAUTH_SIGNATURE_METHOD = "HMAC-SHA1";
/**
 * constant xauth mode
 * @inner
 * @static
 * @constant
 */
Twitter.XAUTH_MODE = "client_auth";

/**
 * authorize twitter<br>
 *
 * access token is passed as arguments of callback method
 *
 * @param {Object}   params required these parameter
 * @param {String}   params.consumerKey twitter consumer key
 * @param {String}   params.consumerSecret
 * @param {String}   params.userName
 * @param {String}   params.password
 * @param {function} params.success callback on succeeded. This callback method has two arguments, accessToken and accessTokenSecret. 
 * @param {function} [params.error] callback on error. This callback method has two arguments, errorCode and errorMessage.
 * @param {Object} [params.errorMessages] override errorMessage. example params.errorMessages.tweetTooLong = "hogehoge"
 */
Twitter.authorize = function(params){
    var accessor = {
        consumerSecret: params.consumerSecret,
        tokenSecret: ""
    };

    var message = {
        method: "POST",
        action: Twitter.URLS.AUTHORIZE,
        parameters: {
            oauth_consumer_key : params.consumerKey,
            oauth_signature_method: Twitter.OAUTH_SIGNATURE_METHOD,
            oauth_version : Twitter.OAUTH_VERSION,
            x_auth_username : params.userName,
            x_auth_password : params.password,
            x_auth_mode : Twitter.XAUTH_MODE
        }
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);


    var additionalHeaders = { "Authorization" : 'OAuth oauth_nonce="' + message.parameters.oauth_nonce + '"'
                     + ', oauth_signature_method="'+message.parameters.oauth_signature_method+'"'
                     + ', oauth_timestamp="' + message.parameters.oauth_timestamp + '"'
                     + ', oauth_consumer_key="' + message.parameters.oauth_consumer_key + '"'
                     + ', oauth_signature="' + encodeURIComponent(message.parameters.oauth_signature) + '"'
                     + ', oauth_version="'+message.parameters.oauth_version+'"'};

    var request = {
        method : message.method,
        action : message.action,
        consumerKey : params.consumerKey,
        consumerSecret : params.consumerSecret,
        additionalHeaders : additionalHeaders,
        errorMessages : params.hasOwnProperty('errorMessages') ? params.errorMessages : {},
        postData : 'x_auth_username=' + params.userName
                    + '&x_auth_password=' + params.password
                    + '&x_auth_mode=' + message.parameters.x_auth_mode,
        success : Twitter._hasFunction(params, "success") ? params.success : function(token, secret, twitter){},
        error : Twitter._hasFunction(params, "error") ? params.error : function(err, message){}
    };

    Twitter._send(request);
}

/**
 * XmlHttpRequest wrapper method
 *
 * @private
 * @param {Object} request
 * @param {Object} request.method
 * @param {Object} request.action
 * @param {Object} request.success
 * @param {Object} request.error
 * @param {Object} request.errorMessages
 * @param {Object} [request.additionalHeaders]
 * @param {Object} [request.postData]
 * @param {Object} [request.consumerKey]
 * @param {Object} [request.consumerSecret]
 */
Twitter._send = function(request){
    var headers = {};
    for(var key in Twitter.defaultHeaders){
        headers[key] = Twitter.defaultHeaders[key];
    }
    // merge and override headers by additionalHeaders
    for(var key in request.additionalHeaders){
        headers[key] = request.additionalHeaders[key];
    }
    if(request.method == "POST"){
        headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    var xhr = new XMLHttpRequest();

    xhr.open(request.method, request.action, true);

    for(var i in headers){
        xhr.setRequestHeader(i, headers[i]);
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200){
                // success has been validated already.
                if(request.action == Twitter.URLS.AUTHORIZE){
                    // token get
                    var responseParams = OAuth.getParameterMap(xhr.responseText);
                    if(responseParams['oauth_token'] == null || responseParams['oauth_token_secret'] == null){
                        // response error
                        var message = (request.errorMessages.hasOwnProperty('authorizeError')) ? request.errorMessages.authorizeError : Twitter.errors.authorizeError.message;
                        request.error(Twitter.errors.authorizeError.code, Twitter.errors.authorizeError.message);
                        return;
                    }
                    request.success(responseParams['oauth_token'], responseParams['oauth_token_secret']);
                }
                else{
                    request.success();
                }
            }
            else{
                var code = xhr.status;
                var message = xhr.responseText;
                // error has been validated already.
                if(code == 403 && message.indexOf(Twitter.errors.statusDuplicate.message) != -1){
                    code = Twitter.errors.statusDuplicate.code;
                    message = Twitter.errors.statusDuplicate.message;
                }else if(code == 401 && (message.indexOf(Twitter.errors.wrongVal.message) != -1 || message.indexOf("ユーザー名かパスワードが無効です") != -1)){
                    code = Twitter.errors.wrongVal.code;
                    message = Twitter.errors.wrongVal.message;
                }
                request.error(code, message);
            }
        }
    };

    xhr.send(request.hasOwnProperty("postData") ? request.postData : null);
}

/**
 * execute error callback method
 *
 * @private
 * @param {Object} String
 * @param {function} fn
 * @param {Object} messages
 */
Twitter._executeErrorCallback = function(error, callback, messages){
    if(!Twitter.errors.hasOwnProperty(error)){
        // unDefined error
        callback(Twitter.errors.unknown.code, Twitter.errors.unknown.message);
        return;
    }

    var message = (messages != null && messages.hasOwnProperty(error)) ? messages[error] : Twitter.errors[error].message;
    callback(Twitter.errors[error].code, message);
}

/**
 * This returns object has function propety  
 *
 * @private
 * @param {Object} params object
 * @param {String} name   property name
 * @returns {boolean}
 */
Twitter._hasFunction = function(params, name){
    if(params.hasOwnProperty(name) && typeof params[name] == "function"){
        return true;
    }
    return false;
}

Twitter.prototype = {
    /**
     * initialize
     *
     * @private
     * @param {Object} params
     * @param {Object} params.consumerKey
     * @param {Object} params.consumerSecret
     * @param {Object} params.accessToken
     * @param {Object} params.accessTokenSecret
     * @param {Object} params.errorMessages
     */
    _init : function(params){
        this.consumerKey       = params.consumerKey;
        this.consumerSecret    = params.consumerSecret;
        this.accessToken       = params.accessToken;
        this.accessTokenSecret = params.accessTokenSecret;
        this.errorMessages     = params.hasOwnProperty("errorMessages") ? params.errorMessages : {};
    },

    /**
     * to check this object has been Authorized already
     *
     * @return {boolean} true:valid token and secret/false:invalid token and secret
     */
    isAuthorized : function(){
        if(this.accessToken == null || this.accessToken.length == 0 || this.accessTokenSecret == null || this.accessTokenSecret.length == 0){
            return false;
        }
        return true;
    },

    /**
     * tweet method
     *
     * @param {Object|String}   params
     * @param {String}   params.tweet tweet
     * @param {function} [params.success] callback on succeeded.
     * @param {function} [params.error] callback on error. This callback method has two arguments, errorCode and errorMessage.
     * @param {Object} [params.errorMessages] override errorMessage. example params.errorMessages.tweetTooLong = "hogehoge"
     */
    tweet : function(params){
        if(params == null || (typeof params != "object" && typeof params != "String")){
            return;
        }
        else if(typeof params == "String"){
            params = {tweet:params};
        }
        var errorCallback = Twitter._hasFunction(params, "error") ? params.error : function(code, message){};

        if(this.consumerKey == null || this.consumerSecret == null){
            // error : not exist consumer key/secret
            Twitter._executeErrorCallback("invalidConsumerInfo", errorCallback, this.errorMessages);
            return ;
        }
        if(!this.isAuthorized()){
            // error : not exist access token/secret
            Twitter._executeErrorCallback("notAuthorized", errorCallback, this.errorMessages);
            return ;
        }
        if(params.tweet.length > 140){
            // error : tweet over 140 chars
            Twitter._executeErrorCallback("tweetTooLong", errorCallback, this.errorMessages);
            return;
        }

        var accessor = {
            consumerSecret: this.consumerSecret,
            tokenSecret: this.accessTokenSecret
        };

        var message = {
            method: "POST",
            action: Twitter.URLS.TWEET,
            parameters: {
                oauth_consumer_key : this.consumerKey,
                oauth_signature_method: Twitter.OAUTH_SIGNATURE_METHOD,
                oauth_version : Twitter.OAUTH_VERSION,
                oauth_token : this.accessToken,
                status: params.tweet
            }
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var request = {
            method  : message.method,
            action  : OAuth.addToURL(message.action, message.parameters),
            success : Twitter._hasFunction(params, "success") ? params.success : function(){},
            error   : errorCallback,
            additionalHeaders : (params.hasOwnProperty("additionalHeaders")) ? params.additionalHeaders : {},
            errorMessages     : this.errorMessages
        };

        Twitter._send(request);
    }
};
