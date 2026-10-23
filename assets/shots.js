// 화면 모형 세 장 — 가만히 두면 돌아가고, 누르면 그 장에서 멈춘다. (CEO 지시 2026-10-23)
//
// 왜 자동으로 돌리나
//   화면이 어떻게 생겼는지 보여 달라는 요청이다. 세 장을 나란히 늘어놓으면 다시 글이 많아진다.
//   한 자리에서 번갈아 보이면 영상처럼 읽히고 자리도 한 장만 쓴다.
//
// 멈추는 조건 셋 — 사람이 탭을 누름 · 마우스를 올림 · 움직임을 줄여 달라고 한 사용자.
(function () {
  var wrap = document.querySelector('.shots')
  if (!wrap) return
  var tabs = [].slice.call(wrap.querySelectorAll('.shot-tabs button'))
  var shots = [].slice.call(wrap.querySelectorAll('.shot'))
  if (!tabs.length || tabs.length !== shots.length) return

  var at = 0
  var timer = null
  var stopped = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function show (i) {
    at = (i + shots.length) % shots.length
    tabs.forEach(function (t, n) { t.setAttribute('aria-selected', n === at ? 'true' : 'false') })
    shots.forEach(function (s, n) { s.classList.toggle('on', n === at) })
  }

  function start () {
    if (stopped || timer) return
    timer = setInterval(function () { show(at + 1) }, 5000)
  }
  function stop () { clearInterval(timer); timer = null }

  tabs.forEach(function (t, n) {
    t.addEventListener('click', function () { stopped = true; stop(); show(n) })
  })
  wrap.addEventListener('mouseenter', stop)
  wrap.addEventListener('mouseleave', start)
  wrap.addEventListener('focusin', stop)

  // 화면 밖에 있을 때는 돌리지 않는다 — 안 보이는 것을 바꾸는 것은 낭비다
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? start() : stop() })
    }, { threshold: .25 }).observe(wrap)
  } else start()

  show(0)
})()
