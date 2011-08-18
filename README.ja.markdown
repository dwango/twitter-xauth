# twitter.js

## twitter.js とは

 - シンプルで軽量な Twitter API Wrapper ライブラリ
 - xAuth 認証と tweet 投稿機能をサポートしています。
 - twitter.js を利用するためには oauth.js と sha1.js が必要です。[oauth on google code.](http://code.google.com/p/oauth/source/browse/#svn%2Fcode%2Fjavascript) より入手してください。

## API マニュアル

 `docs` ディレクトリ以下にあるドキュメントをご参照ください。

## 使い方

    // 認証
    var authParams = {
        consumerKey    : 'DUMMY-CONSUMER-KEY',
        consumerSecret : 'DUMMY-CONSUMER-SECRET',
        userName       : 'DUMMY-USER-NAME',
        password       : 'DUMMY-PASSWORD',
        success : function(token, secret){                  // 成功時のコールバック処理
                    alert("token:"+token+" secret:"+secret);
                },
        error : function(code, message){                    // エラー時のコールバック処理
                    alert("error:"+code+" message:"+message);
                }
    };
    Twitter.authorize(authParams);

`examples` ディレクトリ以下にサンプルがあります。

## エラーコード

    100, コンシューマーキーが空である
    101, アクセストークンが空である
    102, tweet する文章が長過ぎる
    103, 重複した文章の投稿をしようとした
    104, ユーザー名もしくはパスワードが間違っている
    400, API アクセス制限超過
    401, 認証失敗
    403, 未認証の状態でAPIにアクセスした
    404, 存在しないAPIにアクセスした
    500, Twitter サーバーのエラー
    502, Twitter がメンテナンス中
    503, Twitter が利用できない
    900, 原因不明のエラー

