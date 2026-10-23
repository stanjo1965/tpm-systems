// 맨 위로 단추 — 첫 화면(hero)을 지나면 보이고, 누르면 맨 위로 올라간다. (CEO 지시 2026-10-23)
//
// 왜 JS 가 필요한가
//   올라가는 것 자체는 CSS 의 scroll-behavior:smooth 와 href="#top" 으로 이미 된다.
//   JS 는 **언제 보일지**만 맡는다 — 첫 화면에서는 거슬리고, 내려가야 쓸모가 있다.
//
// 왜 rAF 로 묶나
//   scroll 은 1초에 수십 번 터진다. 그때마다 클래스를 만지면 화면이 버벅인다.
//   한 프레임에 한 번만 재도록 묶는다.
(function () {
  var btn = document.getElementById('toTop')
  if (!btn) return

  // 첫 화면 높이의 60% 를 지나면 보인다. hero 가 없으면 600px 를 기준으로 쓴다.
  var hero = document.querySelector('.hero')
  var mark = hero ? Math.round(hero.offsetHeight * 0.6) : 600
  var waiting = false

  function paint () {
    waiting = false
    var y = window.pageYOffset || document.documentElement.scrollTop
    btn.classList.toggle('on', y > mark)
  }

  function onScroll () {
    if (waiting) return
    waiting = true
    window.requestAnimationFrame(paint)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', function () {
    mark = hero ? Math.round(hero.offsetHeight * 0.6) : 600
    paint()
  }, { passive: true })

  // 주소창에 #top 이 남지 않게 한다 — 새로고침하면 그 자리로 튀어 거슬린다.
  btn.addEventListener('click', function (e) {
    e.preventDefault()
    var slow = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: slow ? 'auto' : 'smooth' })
    // 올라간 뒤 머리글 첫 링크로 초점을 돌려 준다(키보드로 쓰는 사람)
    var first = document.querySelector('header .logo')
    if (first) first.focus({ preventScroll: true })
  })

  paint()
})()
