# LBTrim
LBTrim�͉摜�W�F�l���[�^�n�̃T�[�r�X�����ɁA�摜�̃A�b�v���[�h�O�Ƀg���~���O���H����@�\��g�ݍ��݂₷���`�Ƀp�b�P�[�W������Javascript���C�u�����ł��B

�摜�W�F�l���[�^�n�̃T�[�r�X�Ƃ́A���[�U�[���A�b�v���[�h�����摜�t�@�C���ƃe���v���[�g��g�ݍ��킹�āA�V�����摜�����T�[�r�X�ł��B
��ʓI�Ƀ��[�U�[���A�b�v���[�h�����摜�́A�e���v���[�g�̎w�肵���̈�ɔz�u����܂��B
���̎��A�b�v���[�h�����摜�̒��S����Œ�̈��؂蔲���Ĕ��f������@����ԃV���v���Ȏ����ł��B

�������A���[�U�[�͉摜�̒�����C�ӂ̗̈���W�F�l���[�^�ɔ��f����̈�Ƃ��Ďw�肵�����Ȃ�܂����A�摜���̔C�ӂ̗̈���w�肵�Đ؂��郆�[�U�[�C���^�[�t�F�[�X����������̂͗e�Ղł͂���܂���B

�{���C�u�����́A���̋@�\���V���v���Ȍ`�Œ񋟂��邱�Ƃ�ړI�Ƃ��Ă��܂��B

Blog: <a href="http://luckybancho.ldblog.jp/archives/48774944.html" target="_blank">LBTrim - �摜�W�F�l���[�^�[�T�[�r�X�����ėp�g���~���OUI���C�u����</a>


## ����f��
�摜���w�肵�āA�g���~���O���s���T���v���ł��B

<a href="http://luckybancho.ldblog.jp/lbtrim_demo.htm" target="_blank">Demo</a>


## �Z�b�g�A�b�v���@
LBTrim��jQuery��jQuery blockUI���K�v�ł��BjQuery1.7�ȏ�ł���Γ����Ǝv���܂����A���؂͂��Ă��܂���B

LBTrim���g���ɂ́A*lbtrim.css*��*lbtrim.js*��ǂݍ���ł��������B

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js"></script>
    <link rel="stylesheet" href="lbtrim/lbtrim.css" type="text/css">
    <script type="text/javascript" src="lbtrim/lbtrim.js"></script>

## �g�p���@
    //�g���~���O�v�f�̏�����
    var trim_a = new Lb_Trim({
        upload_id:"btn_a"		// �A�b�v���[�h�{�^���̐������ID
        ,trim_id:"trim_img"		// �g���~���O�����摜�̕\�����ID�iIMG��CANVAS�v�f)
    });
    

## ��ȋ@�\
 * �Ăяo�����Ɏw�肵���v�f�ɉ摜�t�@�C���̓ǂݍ��݃{�^���������������܂��B�ǂݍ��݃{�^�������Ńt�@�C���̑I���_�C�A���O���J�����A�t�@�C�����{�^���̈�Ƀh���b�O�A���h�h���b�v�ŉ摜�t�@�C����ݒ肵�܂��B
 * �摜���w�肷��ƁA�����Ńg���~���O��ʂ��I�[�o�[���C�\������܂��B
 * �g���~���O�̈�̎l�����h���b�O���邱�ƂŁA�g���~���O�̈���g��A�k�����邱�Ƃ��ł��܂��B���̎��A�g���~���O�̈�̏c����́A�Ăяo�����Ɏw�肵���C���[�W�v�f�i�ȉ��u�g���~���O��v)�̏c����ŌŒ肳��܂��B�i�X�}�[�g�t�H���̏ꍇ�́A�Q�{�w�ŊJ����������肷�邱�ƂŊg��A�k�����邱�Ƃ��ł��܂��j
 * �g���~���O�̈�����_�u���N���b�N�A�������̓g���~�O��ʂ����́u�؂���v�{�^�������Ŏw��͈͂��g���~���O����g���~���O��ɔ��f����܂��B
 * �g���~���O����N���b�N���邱�ƂŁA�Ăуg���~���O��ʂ��J���A�g���~���O�̂�蒼�����s�����Ƃ��ł��܂��B
 * �g���~���O�̈�O�A�������́u����v�{�^�������Ńg���~���O��ʂ���邱�Ƃ��ł��܂��B
 * ��̉�ʂŕ����̃g���~���O�{�^����ݒu���邱�Ƃ��\�ł��B

## �I�v�V�����@�\
 * �g���~���O��ʂ̊e������e�L�X�g�́A�Ăяo�����̃I�v�V�����Őݒ�\�ł��B
 * �g���~���O������̌�̉摜�ҏW�̂��߂ɉB���v�f�ɂ���ꍇ�ALBTrim�I�u�W�F�N�g��openTrimWindow���\�b�h���R�[�����邱�ƂŃg���~���O��ʂ̍ČĂяo�����s�����Ƃ��ł��܂��B
 * onCutFinished�C�x���g��ݒ肷�邱�ƂŁA�g���~���O��ɔC�ӂ̏������s�����Ƃ��ł��܂��B

## �Ăяo���I�v�V����

| �I�v�V������ |�K�{ | ���e | �f�t�H���g�l |
| --- | --- | --- | --- |
| upload_id | �� | ���[�U�[���摜�t�@�C�����A�b�v���[�h����̈���w�肷��B | - |
| trim_id | �� | �g���~���O��̉摜�̐؂�o����iIMG�v�f��CANVAS�v�f�j���w�肷��B�g���~���O�̏c����͂��̗v�f�̃T�C�Y�ɌŒ肳���B | - |
| rotate_button | | �摜�̉�]�{�^���̗L���E���� | false |
| title||�؂����ʂ̃^�C�g�����w�肷��|�͈͂��w�肵��,�؂���{�^�����_�u���N���b�N�Ő؂����Ă������� |
| upload_area_message | | �t�@�C�����A�b�v���[�h����G���A�̃��b�Z�[�W���w�肷��|�N���b�N���ăt�@�C����I�����邩�����Ƀh���b�O���h���b�v���Ă������� |
| cut_button_message | | �؂蔲���{�^���̃��b�Z�[�W���w�肷��|�؂蔲��|
| close_button_message | | �؂蔲����ʂ����{�^���̃��b�Z�[�W���w�肷�� | ���� |
| maximize_button_message | | �؂蔲���̈�̍ő剻�{�^���̃��b�Z�[�W���w�肷�� | �ő剻 |
| rotate_button_message | | ��]�{�^���̃��b�Z�[�W���w�肷�� | ��] |
| onCutFinished | | �֐����Z�b�g���邱�ƂŁA�g���~���O��Ɏ��s���� | �Ȃ� |

## ���\�b�h

| ���\�b�h�� | �� �� | ���e |
| --- | --- | --- |
| openTrimWindow | �Ȃ� | �g���~���O��ʂ��ēx�J���i�C���[�W�ăA�b�v���[�h�����ɍăg���~���O�ł��܂��j |

## �X�V����
2018/11/23	��]�{�^���@�\��ǉ��B�����C���X�^���X���ɑΉ��B
2016/10/31	���J