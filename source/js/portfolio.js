(function () {
  if (window.__portfolioDialogInitialized) {
    return;
  }

  window.__portfolioDialogInitialized = true;
  const openers = new WeakMap();

  function syncScrollLock() {
    const hasOpenDialog = Boolean(document.querySelector('[data-portfolio-dialog][open]'));
    document.documentElement.classList.toggle('portfolio-dialog-active', hasOpenDialog);
  }

  function closeDialog(dialog, restoreFocus) {
    if (!(dialog instanceof HTMLDialogElement) || !dialog.open) {
      return;
    }

    const opener = openers.get(dialog);
    dialog.close();
    syncScrollLock();

    if (restoreFocus && opener?.isConnected) {
      opener.focus();
    }
  }

  function closeAllDialogs() {
    document.querySelectorAll('[data-portfolio-dialog][open]').forEach((dialog) => {
      closeDialog(dialog, false);
    });
    syncScrollLock();
  }

  document.addEventListener('click', function (event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const opener = target.closest('[data-portfolio-open]');
    if (opener) {
      const dialog = document.getElementById(opener.dataset.portfolioOpen);
      if (dialog instanceof HTMLDialogElement) {
        openers.set(dialog, opener);
        if (!dialog.open) {
          dialog.showModal();
        }
        syncScrollLock();
      }
      return;
    }

    const closeButton = target.closest('[data-portfolio-close]');
    if (closeButton) {
      closeDialog(closeButton.closest('[data-portfolio-dialog]'), true);
      return;
    }

    const link = target.closest('[data-portfolio-dialog] a');
    if (link) {
      closeDialog(link.closest('[data-portfolio-dialog]'), false);
      return;
    }

    const dialog = target.closest('[data-portfolio-dialog]');
    if (dialog && target === dialog) {
      closeDialog(dialog, true);
    }
  });

  document.addEventListener('cancel', function (event) {
    const dialog = event.target;
    if (dialog instanceof HTMLDialogElement && dialog.matches('[data-portfolio-dialog]')) {
      window.setTimeout(syncScrollLock, 0);
      const opener = openers.get(dialog);
      if (opener?.isConnected) {
        window.setTimeout(() => opener.focus(), 0);
      }
    }
  }, true);

  window.addEventListener('popstate', closeAllDialogs);
})();
