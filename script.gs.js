/* 実行関数 */
function main() {
  var prop = PropertiesService.getScriptProperties().getProperties();
  var data = getdata(prop.spid, prop.sheetName);
  postMessage(prop.token, prop.chanel, data);
}

/* slackへの投稿 */
function postMessage(token, chanel, data) {
  //slackApp インスタンスの取得
  var slackApp = SlackApp.create(token);

　//投稿
  slackApp.postMessage(chanel, data, {
    username : "掃除通知",
    icon_emoji: ":dusty_stick:"
  });
}

/* 投稿データの取得・整形 */
function getdata(SP_ID, S_NAME) {
  
  //シートの読み込み
  var spsheet = SpreadsheetApp.openById(SP_ID);
  var sheet = spsheet.getSheetByName(S_NAME);
  
  //データの取得
  var headData = readHeader(sheet);
  var todayData = searchData(sheet,headData.length);
  
  //文字列への変換
  var str = toStr(headData,todayData);

  return str;
}

/* 掃除区分取得 */
function readHeader(sheet) {
  var headData = [];
  var i = 1;
  for (var j = 2; ;j++) {
    var data = sheet.getRange(i,j).getValue();
    if (!data) { break; }
    headData.push(data);
  }
  return headData;
}

/* 掃除当番の人取得 */
function searchData(sheet, dataNum) {
  var todayData = [];
  var dayObj = new Date();
  for (var i = 2; ;i++) {
    var data = sheet.getRange(i,1).getValue();
    if (!data) {break;}
    if (data.getMonth() == dayObj.getMonth() && data.getDate() == dayObj.getDate()) {
      for(var j = 2; j < dataNum + 2; j++){
        todayData.push(sheet.getRange(i,j).getValue());
      }
      return todayData;
    }
  }
  return todayData;
}

/* データの整形 */
function toStr(headData, todayData) {
  var str= "[今日の掃除当番]\n";
  for(var i = 0; i < headData.length; i++){
    str += headData[i] + ':' + todayData[i] + "\n"; 
  }
  return str;
}