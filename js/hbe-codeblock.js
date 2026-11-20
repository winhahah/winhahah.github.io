// source/js/hbe-codeblock.js
// 密码文章（hexo-blog-encrypt）解密后，补上 Icarus 在页面加载时对代码块做的增强。
(function () {
  'use strict';

  function enhanceFigure(figure) {
    // 1) 横向滚动容器：长代码行靠它滚动，否则会被 html 的 overflow-x: hidden 裁掉
    var table = figure.querySelector(':scope > table');
    if (table) {
      var body = document.createElement('div');
      body.className = 'highlight-body';
      table.parentNode.insertBefore(body, table);
      body.appendChild(table);
    }

    // 2) 语法高亮：CDN 的 highlight.js 主题使用 .hljs-keyword 这类类名
    figure.classList.add('hljs');
    Array.prototype.forEach.call(figure.querySelectorAll('.code .line span'), function (span) {
      Array.prototype.slice.call(span.classList).forEach(function (cls) {
        if (cls.indexOf('hljs-') === 0) return;
        span.classList.add('hljs-' + cls);
        span.classList.remove(cls);
      });
    });

    // 3) 顶部工具条（复制 / 展开-折叠），结构和主题 main.js 一致
    var caption = figure.querySelector('figcaption');
    if (!caption) {
      caption = document.createElement('figcaption');
      caption.className = 'level is-mobile';
      caption.innerHTML = '<div class="level-left"></div><div class="level-right"></div>';
      figure.insertBefore(caption, figure.firstChild);
    }

    var right = caption.querySelector('.level-right');
    if (right && !right.querySelector('.copy')) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy';
      button.title = '复制';
      button.setAttribute('aria-label', '复制');
      button.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>';
      right.appendChild(button);
    }

    var left = caption.querySelector('.level-left');
    if (left && !left.querySelector('.fold')) {
      figure.classList.add('foldable');
      var fold = document.createElement('span');
      fold.className = 'fold';
      fold.innerHTML = '<i class="fas fa-angle-down"></i>';
      left.insertBefore(fold, left.firstChild);
      left.addEventListener('click', function () {
        var folded = figure.classList.toggle('folded');
        var icon = fold.querySelector('i');
        icon.classList.toggle('fa-angle-down', !folded);
        icon.classList.toggle('fa-angle-right', folded);
      });
    }
  }

  window.addEventListener('hexo-blog-decrypt', function (event) {
    var root = (event.detail && event.detail.element) || document;
    Array.prototype.forEach.call(root.querySelectorAll('figure.highlight'), enhanceFigure);
  });
})();
