# LBTrim
LBTrimは画像ジェネレータ系のサービス向けに、画像のアップロード前にトリミング加工する機能を組み込みやすい形にパッケージ化したJavascriptライブラリです。

画像ジェネレータ系のサービスとは、ユーザーがアップロードした画像ファイルとテンプレートを組み合わせて、新しい画像を作るサービスです。
一般的にユーザーがアップロードした画像は、テンプレートの指定した領域に配置されます。
この時アップロードした画像の中心から固定領域を切り抜いて反映する方法が一番シンプルな実装です。

しかし、ユーザーは画像の中から任意の領域をジェネレータに反映する領域として指定したくなりますが、画像中の任意の領域を指定して切り取るユーザーインターフェースを実装するのは容易ではありません。

本ライブラリは、その機能をシンプルな形で提供することを目的としています。

Blog: <a href="http://luckybancho.ldblog.jp/archives/48774944.html" target="_blank">LBTrim - 画像ジェネレーターサービス向け汎用トリミングUIライブラリ</a>


## 動作デモ
画像を指定して、トリミングを行うサンプルです。

<a href="http://luckybancho.ldblog.jp/lbtrim_demo.htm" target="_blank">Demo</a>

## 使用例
<a href="https://luckybancho.ldblog.jp/ff14gcc.html" target="_blank">FF14GuildleveCharacterCard！</a>

<a href="https://luckybancho.ldblog.jp/uchinoko.html" target="_blank">うちの固！</a>

<a href="https://luckybancho.ldblog.jp/uncyclopediaeorzea.html" target="_blank">Uncyclopedia Eorzea</a>


## セットアップ方法
LBTrimは<a href="https://jquery.com/" target="_blank">jQuery</a>と<a href="https://jquery.malsup.com/block/" target="_blank">jQuery blockUI</a>が必要です。jQuery1.7以上であれば動くと思いますが、検証はしていません。

LBTrimを使うには、*lbtrim.css*と*lbtrim.js*を読み込んでください。

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js"></script>
    <link rel="stylesheet" href="lbtrim/lbtrim.css" type="text/css">
    <script type="text/javascript" src="lbtrim/lbtrim.js"></script>

## 使用方法
    //トリミング要素の初期化
    var trim_a = new Lb_Trim({
        upload_id:"btn_a"		// アップロードボタンの生成先のID
        ,trim_id:"trim_img"		// トリミングした画像の表示先のID（IMGかCANVAS要素)
    });
    

## 主な機能
 * 呼び出し時に指定した要素に画像ファイルの読み込みボタンを自動生成します。読み込みボタン押下でファイルの選択ダイアログを開くか、ファイルをボタン領域にドラッグアンドドロップで画像ファイルを設定します。
 * 画像を指定すると、自動でトリミング画面がオーバーレイ表示されます。
 * トリミング領域の四隅をドラッグすることで、トリミング領域を拡大、縮小することができます。この時、トリミング領域の縦横比は、呼び出し時に指定したイメージ要素（以下「トリミング先」)の縦横比で固定されます。（スマートフォンの場合は、２本指で開いたり閉じたりすることで拡大、縮小することもできます）
 * トリミング領域内をダブルクリック、もしくはトリミグ画面したの「切り取り」ボタン押下で指定範囲がトリミングされトリミング先に反映されます。
 * トリミング先をクリックすることで、再びトリミング画面が開き、トリミングのやり直しを行うことができます。
 * トリミング領域外、もしくは「閉じる」ボタン押下でトリミング画面を閉じることができます。
 * 一つの画面で複数のトリミングボタンを設置することが可能です。
 * ファイルアップロードの代わりにトリミングウィンドウを画像コピペで呼び出せます。単体使用の場合はBody全域、複数指定の場合はデフォルトでアップロードボタン上がペースト呼び出し領域になります。複数指定の場合のペースト領域はオプションでID指定(配列で複数可)です。

## オプション機能
 * トリミング画面の各種説明テキストは、呼び出し時のオプションで設定可能です。
 * トリミング先をその後の画像編集のために隠し要素にする場合、LBTrimオブジェクトのopenTrimWindowメソッドをコールすることでトリミング画面の再呼び出しを行うことができます。
 * onCutFinishedイベントを設定することで、トリミング後に任意の処理を行うことができます。

## 呼び出しオプション

| オプション名 |必須 | 内容 | デフォルト値 |
| --- | --- | --- | --- |
| upload_id | ○ | ユーザーが画像ファイルをアップロードする領域を指定する。 | - |
| trim_id | ○ | トリミング後の画像の切り出し先（IMG要素かCANVAS要素）を指定する。トリミングの縦横比はこの要素のサイズに固定される。 | - |
| rotate_button | | 画像の回転ボタンの有効・無効 | false |
| title||切り取り画面のタイトルを指定する|範囲を指定して,切り取りボタンかダブルクリックで切り取ってください |
| upload_area_message | | ファイルをアップロードするエリアのメッセージを指定する|クリックしてファイルを選択するかここにドラッグ＆ドロップしてください |
| cut_button_message | | 切り抜きボタンのメッセージを指定する|切り抜き|
| close_button_message | | 切り抜き画面を閉じるボタンのメッセージを指定する | 閉じる |
| maximize_button_message | | 切り抜き領域の最大化ボタンのメッセージを指定する | 最大化 |
| rotate_button_message | | 回転ボタンのメッセージを指定する | 回転 |
| onCutFinished | | 関数をセットすることで、トリミング後に実行する | なし |
| image_paste_area | | ファイルアップロードの代わりにトリミングウィンドウを画像コピペで呼び出す領域の対象IDを指定。複数の場合は配列で指定 | なし |



## メソッド

| メソッド名 | 引 数 | 内容 |
| --- | --- | --- |
| openTrimWindow | なし | トリミング画面を再度開く（イメージ再アップロード無しに再トリミングできます） |

## 更新履歴
 2022/8/21	画像コピペに対応

 2018/11/23	回転ボタン機能を追加。複数インスタンス化に対応。

 2016/10/31	公開