// ==UserScript==
// @name         微信读书：鼠标滚轮翻页
// @namespace    https://weread.qq.com/
// @version      1.0.0
// @description  在微信读书网页版中使用鼠标滚轮向上/向下切换上一页/下一页
// @author       Codex
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // 触控板会产生许多很小的 wheel 事件。累积超过此值后才翻一页。
  const WHEEL_THRESHOLD = 80;
  // 翻页后的锁定时间，避免一次滚动连续翻过多页。
  const COOLDOWN_MS = 450;

  let accumulatedDelta = 0;
  let lastWheelAt = 0;
  let lockedUntil = 0;

  function isEditable(element) {
    return element instanceof Element && Boolean(
      element.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')
    );
  }

  function hasOpenOverlay() {
    // 打开目录、搜索、设置、评论等浮层时，保留浮层自己的滚动行为。
    const overlays = document.querySelectorAll(
      '.readerCatalog, .readerNotePanel, .readerSearch, [role="dialog"]'
    );
    return Array.from(overlays).some((element) => {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' &&
        element.getClientRects().length > 0;
    });
  }

  function dispatchPageKey(key) {
    const keyCode = key === 'ArrowRight' ? 39 : 37;
    const target = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : document.body;

    for (const type of ['keydown', 'keyup']) {
      const event = new KeyboardEvent(type, {
        key,
        code: key,
        bubbles: true,
        cancelable: true,
      });

      // 兼容仍读取 keyCode/which 的旧版网页事件处理代码。
      Object.defineProperties(event, {
        keyCode: { get: () => keyCode },
        which: { get: () => keyCode },
      });
      target.dispatchEvent(event);
    }
  }

  function onWheel(event) {
    if (
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
      isEditable(event.target) || hasOpenOverlay()
    ) {
      accumulatedDelta = 0;
      return;
    }

    const now = Date.now();
    if (now < lockedUntil) {
      event.preventDefault();
      return;
    }

    // 两次滚动间隔较长，或中途改变方向时，重新开始累计。
    if (now - lastWheelAt > 300 || Math.sign(event.deltaY) !== Math.sign(accumulatedDelta)) {
      accumulatedDelta = 0;
    }
    lastWheelAt = now;
    accumulatedDelta += event.deltaY;

    event.preventDefault();
    event.stopPropagation();

    if (Math.abs(accumulatedDelta) < WHEEL_THRESHOLD) return;

    // 微信读书原生使用左右方向键翻页。
    const key = accumulatedDelta > 0 ? 'ArrowRight' : 'ArrowLeft';
    accumulatedDelta = 0;
    lockedUntil = now + COOLDOWN_MS;
    dispatchPageKey(key);
  }

  window.addEventListener('wheel', onWheel, { capture: true, passive: false });
})();
