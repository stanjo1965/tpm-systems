// 플랫폼 지도의 연결선 — 가운데 원에서 다섯 칸으로 **하나씩** 긋는다. (CEO 지시 2026-10-23)
//
// 왜 CSS 가 아니라 JS 인가
//   전에는 비스듬한 직선 두 개(:before·:after)를 겹쳐 「연결된 것처럼」 보이게 했다.
//   그래서 칸을 옮기면 어긋나고, 선이 원 위를 지나갔다.
//   칸의 실제 자리를 재서 그으면 **어디에 놓든 맞는다** — 반응형에서도 다시 잰다.
//
// 선은 원의 테두리에서 시작해 칸의 테두리에서 끝난다. 원 안·칸 안으로는 들어가지 않는다.
(function () {
  var map = document.querySelector('.platform-map')
  if (!map) return
  var svg = map.querySelector('.map-links')
  var core = map.querySelector('.core')
  var nodes = [].slice.call(map.querySelectorAll('.node'))
  if (!svg || !core || !nodes.length) return

  var NS = 'http://www.w3.org/2000/svg'
  var GAP_CORE = 8   // 원 테두리에서 띄우는 간격
  var GAP_NODE = 6   // 칸 테두리에서 띄우는 간격

  function draw () {
    // 좁은 화면에서는 칸이 격자로 누우므로 긋지 않는다
    if (getComputedStyle(svg).display === 'none') return

    var box = map.getBoundingClientRect()
    var c = core.getBoundingClientRect()
    var cx = c.left - box.left + c.width / 2
    var cy = c.top - box.top + c.height / 2
    var r = Math.min(c.width, c.height) / 2

    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height)
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    nodes.forEach(function (n) {
      var b = n.getBoundingClientRect()
      var nx = b.left - box.left + b.width / 2
      var ny = b.top - box.top + b.height / 2

      var dx = nx - cx, dy = ny - cy
      var len = Math.hypot(dx, dy)
      if (!len) return
      var ux = dx / len, uy = dy / len

      // 시작점 — 원의 테두리 바로 바깥
      var x1 = cx + ux * (r + GAP_CORE)
      var y1 = cy + uy * (r + GAP_CORE)

      // 끝점 — 칸의 네모와 만나는 자리(칸 중심에서 원 쪽으로 되짚는다)
      var tx = (b.width / 2) / Math.abs(ux || 1e-6)
      var ty = (b.height / 2) / Math.abs(uy || 1e-6)
      var t = Math.min(tx, ty) + GAP_NODE
      var x2 = nx - ux * t
      var y2 = ny - uy * t

      // 칸이 원에 너무 가까워 선이 뒤집히면 긋지 않는다
      if ((x2 - x1) * ux < 0 && (y2 - y1) * uy < 0) return

      var line = document.createElementNS(NS, 'line')
      line.setAttribute('x1', x1.toFixed(1)); line.setAttribute('y1', y1.toFixed(1))
      line.setAttribute('x2', x2.toFixed(1)); line.setAttribute('y2', y2.toFixed(1))
      svg.appendChild(line)
    })
  }

  var waiting = false
  function schedule () {
    if (waiting) return
    waiting = true
    requestAnimationFrame(function () { waiting = false; draw() })
  }

  draw()
  window.addEventListener('resize', schedule, { passive: true })
  window.addEventListener('load', draw)
  // 글꼴이 늦게 와서 칸 높이가 바뀌는 경우
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw)
})()
