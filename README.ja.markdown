# twitter.js

## twitter.js �Ƃ�

 - �V���v���Ōy�ʂ� Twitter API Wrapper ���C�u����
 - xAuth �F�؂� tweet ���e�@�\���T�|�[�g���Ă��܂��B
 - twitter.js �𗘗p���邽�߂ɂ� oauth.js �� sha1.js ���K�v�ł��B[oauth on google code.](http://code.google.com/p/oauth/source/browse/#svn%2Fcode%2Fjavascript) �����肵�Ă��������B

## API �}�j���A��

 `docs` �f�B���N�g���ȉ��ɂ���h�L�������g�����Q�Ƃ��������B

## �g����

    // �F��
    var authParams = {
        consumerKey    : 'DUMMY-CONSUMER-KEY',
        consumerSecret : 'DUMMY-CONSUMER-SECRET',
        userName       : 'DUMMY-USER-NAME',
        password       : 'DUMMY-PASSWORD',
        success : function(token, secret){                  // �������̃R�[���o�b�N����
                    alert("token:"+token+" secret:"+secret);
                },
        error : function(code, message){                    // �G���[���̃R�[���o�b�N����
                    alert("error:"+code+" message:"+message);
                }
    };
    Twitter.authorize(authParams);

`examples` �f�B���N�g���ȉ��ɃT���v��������܂��B

## �G���[�R�[�h

    100, �R���V���[�}�[�L�[����ł���
    101, �A�N�Z�X�g�[�N������ł���
    102, tweet ���镶�͂����߂���
    103, �d���������͂̓��e�����悤�Ƃ���
    104, ���[�U�[���������̓p�X���[�h���Ԉ���Ă���
    400, API �A�N�Z�X��������
    401, �F�؎��s
    403, ���F�؂̏�Ԃ�API�ɃA�N�Z�X����
    404, ���݂��Ȃ�API�ɃA�N�Z�X����
    500, Twitter �T�[�o�[�̃G���[
    502, Twitter �������e�i���X��
    503, Twitter �����p�ł��Ȃ�
    900, �����s���̃G���[

