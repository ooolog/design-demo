// window.url = 'https://pre.vipthink.cn'

// window.url = 'https://www.vipthink.cn'

// 设置请求默认值
var ajaxCount = 0;
$.ajaxSetup({
  beforeSend: function (res) {
    ajaxCount++;
    if (ajaxCount === 1) {}
  },
  complete: function () {
    ajaxCount--;
    if (ajaxCount <= 0) {}
  },
});
// 请求封装
function ajaxFun(obj, callback, domin) {
  var baseUrl = httpUrl;
  if (domin) baseUrl = domin
  $.ajax({
    url: baseUrl + obj.url,
    data: obj.data,
    type: obj.type || "POST",
    success: function (res) {
      callback && callback(res);
    },
  });
}

// 获取url参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}
// 删除url参数
function deleteUrlParam(url, ref) {
  var str = "";
  if (url.indexOf("?") != -1) {
    str = url.substr(url.indexOf("?") + 1);
  } else {
    return url;
  }
  var arr = "";
  var returnurl = "";
  var setparam = "";
  if (str.indexOf("&") != -1) {
    arr = str.split("&");
    for (i in arr) {
      if (arr[i].split("=")[0] != ref) {
        returnurl =
          returnurl + arr[i].split("=")[0] + "=" + arr[i].split("=")[1] + "&";
      }
    }
    return (
      url.substr(0, url.indexOf("?")) +
      "?" +
      returnurl.substr(0, returnurl.length - 1)
    );
  } else {
    arr = str.split("=");
    if (arr[0] == ref) {
      return url.substr(0, url.indexOf("?"));
    } else {
      return url;
    }
  }
}
/**
 * 动态添加js或css
 * @param url js/css url地址
 * @param fileType 加载文件类型 js/css
 */
function addJsFiles(url, fileType) {
  var vessel = $("body");
  var addheadfile;
  if (fileType == "js") {
    addheadfile = document.createElement("script");
    addheadfile.type = "text/javascript";
    addheadfile.src = url;
  } else {
    addheadfile = document.createElement("link");
    addheadfile.type = "text/css";
    addheadfile.rel = "stylesheet";
    addheadfile.rev = "stylesheet";
    addheadfile.media = "screen";
    addheadfile.href = url;
  }
  vessel.append(addheadfile);
}

function isWeiXin() {
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}

// adid
var adId = getUrlParam("adId");
var mid = getUrlParam("mid");
var callbackJs = "";
var isStart = null;
var source = 10002;
var adIdSource = null;

// 如果有mid 并且mid有渠道，取mid对应的渠道
// 如果有mid 但是没有渠道，有adid并且有渠道，取adid对应的渠道
// 无mid adid有渠道，取adid的渠道
// 都没有 默认10002
if (adId) {
  ajaxFun({
      url: "/api_index.php/index/ad/getAdCallbackJs",
      data: {
        id: adId,
      },
    },
    function (res) {
      if (res.code === 200) {
        $("head").append(res.headerJs);
        callbackJs = res.callbackJs;
        isStart = res.isStart;
        if (!mid && res.channelId) {
          source = res.channelId;
        } else {
          adIdSource = res.channelId
        }
      }
    }
  );
}

if (mid) {
  ajaxFun({
      url: "/v1/info/" + mid + "?version=vipthink&baseVersion=vipthink",
      type: 'GET'
    },
    function (res) {
      if (res.code === 200 && res.data.channelId) {
        source = res.data.channelId;
      } else {
        source = adIdSource ? adIdSource : source
      }
    },
    merakDominUrl
  );
}

// 2020-4-4哀悼代码
function setStyleGray() {
  var odate = new Date();
  var year = odate.getFullYear();
  var month = odate.getMonth() + 1;
  var day = odate.getDate();

  if (year == 2020 && month == 4 && day == 4) {
    $("html").css({
      "-webkit-filter": "grayscale(100%)",
      filter: "filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)",
    });
  }
}
setStyleGray();