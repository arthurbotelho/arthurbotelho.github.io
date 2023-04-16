(function () {
  document.querySelectorAll(".open-modal").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      hideAllModalWindows();
      showModalWindow(this.getAttribute("data-target"));
    });
  });

  document.querySelectorAll(".modal-hide").forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function () {
      hideAllModalWindows();
    });
  });

  document.querySelector(".modal-fader").addEventListener("click", function () {
    hideAllModalWindows();
  });
})();

export function showModalWindow(modalTarget) {
  modalTarget = "#" + modalTarget;
  document.querySelector(".modal-fader").className += " active";
  document.querySelector(modalTarget).className += " active";
}

function hideAllModalWindows() {
  var modalFader = document.querySelector(".modal-fader");
  var modalWindows = document.querySelectorAll(".modal-window");

  if (modalFader.className.indexOf("active") !== -1) {
    modalFader.className = modalFader.className.replace("active", "");
  }

  modalWindows.forEach(function (modalWindow) {
    if (modalWindow.className.indexOf("active") !== -1) {
      modalWindow.className = modalWindow.className.replace("active", "");
    }
  });
}
