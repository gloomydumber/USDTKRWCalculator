function beep() {
  var audio = new Audio();
  audio.src = "sound/battlelogbeep.mp3";
  audio.play();
}

function errsound() {
  var audio = new Audio();
  audio.src = "sound/errorsound.mp3";
  audio.play();
}

function clipBcopy() {
  // 손절가를 클립보드에 복사해주는 함수
  var tempvalue = document.getElementById("BTC").value;
  if (tempvalue === "") {
    errsound();
  } else {
    beep();
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = tempvalue;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
}

// input에 숫자만 전달하도록 하는 함수
function inNumber() {
  if (!(event.keyCode == 46 || (event.keyCode > 47 && event.keyCode < 58))) {
    event.returnValue = false;
  }
}

// input에 한글 입력 방지
// function delHangle(evt) {
//   var objTarget = evt.srcElement || evt.target;
//   var _value = event.srcElement.value;
//   if (/[ㄱ-ㅎㅏ-ㅡ가-하-핳]/g.test(_value)) {
//     objTarget.value = null;
//   }
// }
// function fn_press_han(obj)
// {
//   if(event.keyCode==8||event.keyCode==9||event.keyCode==37||event.keyCode==39||event.keyCode==46)
//   return;
//   obj.value = obj.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]\g,'');
// }

$(document).ready(function () {
  var btckrw;
  var btcusdt;
  // Upbit BTC/KRW 값 추출
  function upbit() {
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        var upbitData = this.responseText;
        upbitData = JSON.parse(upbitData);
        btckrw = upbitData[0].trade_price;
        btckrw = parseFloat(btckrw);
        // console.log(btckrw); // Upbit BTC/KRW 현재가
        return btckrw;
      }
    });
    xhr.open(
      "GET",
      "https://api.upbit.com/v1/candles/weeks?market=KRW-BTC&count=1&trade_price"
    );
    xhr.send(data);
  }

  // Binance BTC/USDT 값 추출
  function binance() {
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        var binanceData = this.responseText;
        binanceData = JSON.parse(binanceData);
        btcusdt = parseFloat(binanceData.price).toFixed(2);
        btcusdt = parseFloat(btcusdt);
        // console.log(btcusdt); // Binance BTC/USDT 현재가
        return btcusdt;
      }
    });
    xhr.open(
      "GET",
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    xhr.send(data);
  }

  // 최초에 호출해야 btckrw/btcusdt 값 등록 됨.
  upbit();
  binance();

  // 환율 계산 함수
  function exchangeBTC() {
    upbit();
    binance();
    var CountBTC = parseFloat(document.getElementById("BTC").value);
    if (CountBTC) {
      document.getElementById("USDT").value = btcusdt * CountBTC;
      document.getElementById("KRW").value = btckrw * CountBTC;
    } else {
      document.getElementById("USDT").value = "";
      document.getElementById("KRW").value = "";
    }
  }
  function exchangeUSDT() {
    upbit();
    binance();
    var CountUSDT = parseFloat(document.getElementById("USDT").value);
    var oneUSDTperKRW = (btckrw / btcusdt).toFixed(4);
    if (CountUSDT) {
      document.getElementById("BTC").value = (CountUSDT / btcusdt).toFixed(8);
      document.getElementById("KRW").value = (
        CountUSDT * oneUSDTperKRW
      ).toFixed(2);
    } else {
      document.getElementById("BTC").value = "";
      document.getElementById("KRW").value = "";
    }
  }

  function exchangeKRW() {
    upbit();
    binance();
    var CountKRW = parseFloat(document.getElementById("KRW").value);
    var oneUSDTperKRW = (btckrw / btcusdt).toFixed(4);
    if (CountKRW) {
      document.getElementById("BTC").value = (CountKRW / btckrw).toFixed(8);
      document.getElementById("USDT").value = (
        CountKRW / oneUSDTperKRW
      ).toFixed(2);
    } else {
      document.getElementById("BTC").value = "";
      document.getElementById("USDT").value = "";
    }
  }

  // 동기적으로 환율 계산 해주는 함수 (BTC)
  $(document).ready(function () {
    var oldVal = $("#BTC").val();
    $("#BTC").on("propertychange change keyup paste", function () {
      var currentVal = $(this).val();
      if (currentVal == oldVal) {
        return;
      }
      oldVal = currentVal;
      exchangeBTC();
    });
  });

  // 동기적으로 환율 계산 해주는 함수 (USDT)
  $(document).ready(function () {
    var oldVal = $("#USDT").val();
    $("#USDT").on("propertychange change keyup paste", function () {
      var currentVal = $(this).val();
      if (currentVal == oldVal) {
        return;
      }
      oldVal = currentVal;
      exchangeUSDT();
    });
  });

  // 동기적으로 환율 계산 해주는 함수 (KRW)
  $(document).ready(function () {
    var oldVal = $("#KRW").val();
    $("#KRW").on("propertychange change keyup paste", function () {
      var currentVal = $(this).val();
      if (currentVal == oldVal) {
        return;
      }
      oldVal = currentVal;
      exchangeKRW();
    });
  });
});

// jQuery src 여부 체크
/* <script type="text/javascript">
if (typeof jQuery == "undefined") {
  alert("없음");
} else {
  alert("있음");
}
</script> */
