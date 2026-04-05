export class WindowHelper {
  static get window(): Window {
    return window;
  }

  static ensureFocus(): Promise<void> {
    if (document.hasFocus()) return Promise.resolve();

    return new Promise((resolve) => {
      let settled = false;

      const settle = () => {
        if (settled) return;
        settled = true;
        window.removeEventListener('focus', settle);
        resolve();
      };

      window.addEventListener('focus', settle);
      window.focus();
      setTimeout(settle, 3000);
    });
  }
}
