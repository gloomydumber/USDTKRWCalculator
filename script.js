function beep() {
  var e = new Audio();
  (e.src = "sound/battlelogbeep.mp3"), e.play();
}
function errsound() {
  var e = new Audio();
  (e.src = "sound/errorsound.mp3"), e.play();
}
function clipBcopy() {
  var e,
    t = document.getElementById("BTC").value;
  "" === t
    ? errsound()
    : (beep(),
      (e = document.createElement("textarea")),
      document.body.appendChild(e),
      (e.value = t),
      e.select(),
      document.execCommand("copy"),
      document.body.removeChild(e));
}
$(document).ready(function () {
  var n, a;
  function o() {
    var e = new XMLHttpRequest();
    e.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        var e = this.responseText,
          e = JSON.parse(e);
        return (n = e[0].trade_price), (n = parseFloat(n));
      }
    }),
      e.open(
        "GET",
        "https://api.upbit.com/v1/candles/weeks?market=KRW-BTC&count=1&trade_price"
      ),
      e.send(null);
  }
  function d() {
    var e = new XMLHttpRequest();
    e.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        var e = this.responseText,
          e = JSON.parse(e);
        return (a = parseFloat(e.price).toFixed(2)), (a = parseFloat(a));
      }
    }),
      e.open(
        "GET",
        "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
      ),
      e.send(null);
  }
  o(),
    d(),
    $(document).ready(function () {
      var t = $("#BTC").val();
      $("#BTC").on("propertychange change keyup paste", function () {
        var e = $(this).val();
        e != t &&
          ((t = e),
          (function () {
            o(), d();
            var e = parseFloat(document.getElementById("BTC").value);
            e
              ? ((document.getElementById("USDT").value = a * e),
                (document.getElementById("KRW").value = n * e))
              : ((document.getElementById("BTC").value = ""),
                (document.getElementById("KRW").value = ""));
          })());
      });
    }),
    $(document).ready(function () {
      var t = $("#USDT").val();
      $("#USDT").on("propertychange change keyup paste", function () {
        var e = $(this).val();
        e != t &&
          ((t = e),
          (function () {
            o(), d();
            var e = parseFloat(document.getElementById("USDT").value),
              t = (n / a).toFixed(4);
            e
              ? ((document.getElementById("BTC").value = (e / a).toFixed(8)),
                (document.getElementById("KRW").value = (e * t).toFixed(2)))
              : ((document.getElementById("BTC").value = ""),
                (document.getElementById("KRW").value = ""));
          })());
      });
    }),
    $(document).ready(function () {
      var t = $("#KRW").val();
      $("#KRW").on("propertychange change keyup paste", function () {
        var e = $(this).val();
        e != t &&
          ((t = e),
          (function () {
            o(), d();
            var e = parseFloat(document.getElementById("KRW").value),
              t = (n / a).toFixed(4);
            e
              ? ((document.getElementById("BTC").value = (e / n).toFixed(8)),
                (document.getElementById("USDT").value = (e / t).toFixed(2)))
              : ((document.getElementById("BTC").value = ""),
                (document.getElementById("KRW").value = ""));
          })());
      });
    });
});
