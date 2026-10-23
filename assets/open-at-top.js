// 「#contact」 로 들어와도 첫 화면부터 보이게 한다. (CEO 지시 2026-10-24)
//
// 왜 필요한가
//   밖에서 .../#contact 링크로 들어오면 브라우저가 문의 양식까지 **내려간 채로** 연다.
//   회사를 처음 보는 사람이 양식부터 마주치게 된다. 첫 화면부터 보여 주는 것이 맞다.
//
// 왜 머리글(head)에서 도나
//   브라우저는 화면을 그리기 전에 닻(#)으로 뛴다. 본문 끝에서 돌면 이미 내려간 뒤라
//   되돌리는 모습이 눈에 보인다. 그리기 전에 주소에서 닻을 떼어 두면 아예 뛰지 않는다.
//
// 메뉴 누르기는 그대로다 — 그때는 쪽을 새로 열지 않으므로 이 글이 돌지 않는다.
(function () {
  if (window.location.hash !== '#contact') return

  // 새로고침할 때 브라우저가 기억해 둔 자리로 돌아가는 것도 막는다
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual' } catch (e) {}

  // 주소에서 닻을 떼어 둔다 — 새로고침해도 다시 내려가지 않는다
  try {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  } catch (e) { /* 옛 브라우저면 아래 되돌리기가 받친다 */ }

  function 맨위로 () {
    var root = document.documentElement
    var 전 = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'      // 미끄러지며 올라가지 않게
    window.scrollTo(0, 0)
    root.style.scrollBehavior = 전
  }

  맨위로()
  document.addEventListener('DOMContentLoaded', 맨위로)
  window.addEventListener('load', 맨위로)
})()
