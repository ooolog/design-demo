var BrowserUrl = '';
var url__ = (BrowserUrl = window.self.location.toString());
var domainPrefix = url__.substring(
  0,
  url__.indexOf('/', url__.indexOf('://', 0) + 3)
);
var hostName = window.location.hostname;
var base = 0;
if (domainPrefix.indexOf('dev-') > -1) {
  base = 1;
} else if (domainPrefix.indexOf('uat-') > -1) {
  base = 2;
} else if (hostName === 'web.vipthink.cn') {
  base = 3;
}
switch (base) {
  case 1: //测试环境
    var httpUrl = 'https://dev.vipthink.cn';
    var domain = 'https://dev.vipthink.cn';
    var banner = 'https://test-1253622427.cos.ap-guangzhou.myqcloud.com';
    var redirect = 'https://dev-m.vipthink.cn';
    var static_url = 'https://dev-web-static.vipthink.cn/';
    var merakDominUrl = 'https://dev-merak-api.vipthink.cn'
    break;
  case 2: //dev环境
    var httpUrl = 'https://uat.vipthink.cn';
    var domain = 'https://uat.vipthink.cn';
    var banner = 'https://test-1253622427.cos.ap-guangzhou.myqcloud.com';
    var redirect = 'https://uat-m.vipthink.cn';
    var static_url = 'https://uat-web-static.vipthink.cn/';
    var merakDominUrl = 'https://uat-merak-api.vipthink.cn'
    break;

  case 3: //正式环境
    var httpUrl = 'https://www.vipthink.cn';
    var domain = 'https://web.vipthink.cn';
    var banner = 'https://crm-oss.vipthink.cn';
    var redirect = 'https://m.vipthink.cn';
    var static_url = 'https://web-static.vipthink.cn/';
    var merakDominUrl = 'https://merak-api.vipthink.cn'
    break;
  default:
    var httpUrl = 'https://uat.vipthink.cn';
    var domain = 'https://uat.vipthink.cn';
    var banner = 'https://test-1253622427.cos.ap-guangzhou.myqcloud.com';
    var redirect = 'https://uat-m.vipthink.cn';
    var static_url = '/public/';
    var merakDominUrl = 'https://uat-merak-api.vipthink.cn'
}


// var originAddEventListener = EventTarget.prototype.addEventListener;
// EventTarget.prototype.addEventListener = function (type, listener, options) {
//   // 捕获添加事件时的堆栈
//   var addStack = new Error('Event' + type).stack;
//   var wrappedListener = function () {
//     try {
//       return listener.apply(this, arguments);
//     } catch (err) {
//       err.stack += '\n' + addStack;
//       console.error(err);
//       throw err;
//     }
//   };
//   return originAddEventListener.call(this, type, wrappedListener, options);
// };
// var static_url="http://localhost:9998/";
window.static_img = static_url + 'website/mobile/';
function addCssByStyle(cssString) {
  var doc = document;
  var style = doc.createElement('style');
  style.setAttribute('type', 'text/css');

  if (style.styleSheet) {
    // IE
    style.styleSheet.cssText = cssString;
  } else {
    // w3c
    var cssText = doc.createTextNode(cssString);
    style.appendChild(cssText);
  }

  var heads = doc.getElementsByTagName('head');
  if (heads.length) heads[0].appendChild(style);
  else doc.documentElement.appendChild(style);
}
function addCssByLink(url) {
  var doc = document;
  var link = doc.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', url);

  var heads = doc.getElementsByTagName('head');
  if (heads.length) heads[0].appendChild(link);
  else doc.documentElement.appendChild(link);
}
function addJsBysrc(url) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  var heads = document.getElementsByTagName('head');
  if (heads.length) heads[0].appendChild(script);
  else document.documentElement.appendChild(script);
}
function setStatic(arr, type) {
  if (!type) {
    for (var i = 0; i < arr.length; i++) {
      addCssByLink(static_url + arr[i]);
    }
  } else {
    for (var i = 0; i < arr.length; i++) {
      addJsBysrc(static_url + arr[i]);
    }
  }
}

var classcodes = [];
window.Import = {
  /*加载一批文件，_files:文件路径数组,可包括js,css,less文件,succes:加载成功回调函数*/
  LoadFileList: function (_files, succes) {
    var FileArray = [];
    if (typeof _files === 'object') {
      FileArray = _files;
    } else {
      /*如果文件列表是字符串，则用,切分成数组*/
      if (typeof _files === 'string') {
        FileArray = _files.split(',');
      }
    }
    if (FileArray != null && FileArray.length > 0) {
      var LoadedCount = 0;
      for (var i = 0; i < FileArray.length; i++) {
        loadFile(FileArray[i], function () {
          LoadedCount++;
          if (LoadedCount == FileArray.length) {
            succes();
          }
        });
      }
    }
    /*加载JS文件,url:文件路径,success:加载成功回调函数*/
    function loadFile(url, success) {
      url = static_url + url;
      if (!FileIsExt(classcodes, url)) {
        var ThisType = GetFileType(url);
        var fileObj = null;
        if (ThisType == '.js') {
          fileObj = document.createElement('script');
          fileObj.src = url;
        } else if (ThisType == '.css') {
          fileObj = document.createElement('link');
          fileObj.href = url;
          fileObj.type = 'text/css';
          fileObj.rel = 'stylesheet';
        } else if (ThisType == '.less') {
          fileObj = document.createElement('link');
          fileObj.href = url;
          fileObj.type = 'text/css';
          fileObj.rel = 'stylesheet/less';
        }
        success = success || function () {};
        fileObj.onload = fileObj.onreadystatechange = function () {
          if (
            !this.readyState ||
            'loaded' === this.readyState ||
            'complete' === this.readyState
          ) {
            success();
            classcodes.push(url);
          }
        };
        document.getElementsByTagName('head')[0].appendChild(fileObj);
      } else {
        success();
      }
    }
    /*获取文件类型,后缀名，小写*/
    function GetFileType(url) {
      if (url != null && url.length > 0) {
        return url.substr(url.lastIndexOf('.')).toLowerCase();
      }
      return '';
    }
    /*文件是否已加载*/
    function FileIsExt(FileArray, _url) {
      if (FileArray != null && FileArray.length > 0) {
        var len = FileArray.length;
        for (var i = 0; i < len; i++) {
          if (FileArray[i] == _url) {
            return true;
          }
        }
      }
      return false;
    }
  }
};

function loadScript(url, fn) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = static_url + url;
  script.onload = script.onreadystatechange = function () {
    if (
      !script.readyState ||
      'loaded' === script.readyState ||
      'complete' === script.readyState
    ) {
      fn && fn();
    }
  };
  script.src = static_url + url;
  document.head.appendChild(script);
}
