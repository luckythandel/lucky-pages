// Lucky Thandel site effects: matrix rain + typed terminal lines
(function () {
  // Matrix rain
  var canvas = document.getElementById("matrix");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var chars = "01アイタンデルroot$#<>+*";
    var drops = [];
    var fontSize = 15;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var cols = Math.floor(canvas.width / fontSize);
      drops = [];
      for (var i = 0; i < cols; i++) drops[i] = Math.random() * -40;
    }
    resize();
    window.addEventListener("resize", resize);
    setInterval(function () {
      ctx.fillStyle = "rgba(10,14,10,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = fontSize + "px monospace";
      for (var i = 0; i < drops.length; i++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 66);
  }

  // Typed effect for [data-type] elements
  document.querySelectorAll("[data-type]").forEach(function (el) {
    var full = el.getAttribute("data-type");
    var i = 0;
    el.textContent = "";
    var timer = setInterval(function () {
      el.textContent = full.slice(0, ++i);
      if (i >= full.length) clearInterval(timer);
    }, 34);
  });

  // Footer uptime-ish clock
  var clock = document.getElementById("session-clock");
  if (clock) {
    var start = Date.now();
    setInterval(function () {
      var s = Math.floor((Date.now() - start) / 1000);
      var hh = String(Math.floor(s / 3600)).padStart(2, "0");
      var mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      var ss = String(s % 60).padStart(2, "0");
      clock.textContent = hh + ":" + mm + ":" + ss;
    }, 1000);
  }
})();
