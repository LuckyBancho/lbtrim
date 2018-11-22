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


## セットアップ方法
LBTrimはjQueryとjQuery blockUIが必要です。jQuery1.7以上であれば動くと思いますが、検証はしていません。

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

## オプション機能
 * トリミング画面の各種説明テキストは、呼び出し時のオプションで設定可能です。
 * トリミング先をその後の画像編集のために隠し要素にする場合、LBTrimオブジェクトのopenTrimWindowメソッドをコールすることでトリミング画面の再呼び出しを行うことができます。
 * onCutFinishedイベントを設定することで、トリミング後に任意の処理を行うことができます。

## 呼び出しオプション

<table>
	<tr>
		<th>オプション名</th>
		<th>必須</th>
		<th>内容</th>
		<th>デフォルト値</th>
	<tr>
	<tr>
		<td>upload_id</td>
		<td>○</td>
		<td>ユーザーが画像ファイルをアップロードする領域を指定する。</td>
		<td>-</td>
	</tr>
	<tr>
		<td>trim_id</td>
		<td>○</td>
		<td>トリミング後の画像の切り出し先（IMG要素かCANVAS要素）を指定する。トリミングの縦横比はこの要素のサイズに固定される。</td>
		<td>-</td>
	</tr>


	<tr>
		<td>rotate_button</td>
		<td>&nbsp;</td>
		<td>画像の回転ボタンの有効/無効</td>
		<td>false</td>
	</tr>
	<tr>
		<td>title</td>
		<td>&nbsp;</td>
		<td>切り取り画面のタイトルを指定する</td>
		<td>範囲を指定して,切り取りボタンかダブルクリックで切り取ってください</td>
	</tr>
	<tr>
		<td>upload_area_message</td>
		<td>&nbsp;</td>
		<td>ファイルをアップロードするエリアのメッセージを指定する</td>
		<td>クリックしてファイルを選択するかここにドラッグ＆ドロップしてください</td>
	</tr>
	<tr>
		<td>cut_button_message</td>
		<td>&nbsp;</td>
		<td>切り抜きボタンのメッセージを指定する</td>
		<td>切り抜き</td>
	</tr>
	<tr>
		<td>close_button_message</td>
		<td>&nbsp;</td>
		<td>切り抜き画面を閉じるボタンのメッセージを指定する</td>
		<td>閉じる</td>
	</tr>
	<tr>
		<td>maximize_button_message</td>
		<td>&nbsp;</td>
		<td>切り抜き領域の最大化ボタンのメッセージを指定する</td>
		<td>最大化</td>
	</tr>
	<tr>
		<td>rotate_button_message</td>
		<td>&nbsp;</td>
		<td>回転ボタンのメッセージを指定する</td>
		<td>回転</td>
	</tr>
	<tr>
		<td>onCutFinished</td>
		<td>&nbsp;</td>
		<td>関数をセットすることで、トリミング後に実行する</td>
		<td>なし</td>
	</tr>
</table>

## メソッド

<table>
	<tr>
		<th>メソッド名</th>
		<th>引数</th>
		<th>内容</th>
	<tr>
	<tr>
		<td>openTrimWindow</td>
		<td>なし</td>
		<td>トリミング画面を再度開く（イメージ再アップロード無しに再トリミングできます）</td>
	</tr>
</table>

## 更新履歴
2018/11/23	回転ボタン機能を追加。複数インスタンス化に対応。
2016/10/31	公開