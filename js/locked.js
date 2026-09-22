/* Password gate for labbridge.html.

   The case study is stored as AES-256-GCM ciphertext in the page. The key is
   derived from the typed password with PBKDF2-SHA256, so nothing readable
   ships in the HTML. This keeps the work out of search results and away from
   casual readers while the paper is under double-blind review — it is not
   access control, since anyone with the password gets everything.

   Needs a secure context (https:// or localhost) for window.crypto.subtle. */

(function () {
  "use strict";

  var form    = document.getElementById("unlock-form");
  var input   = document.getElementById("unlock-input");
  var button  = document.getElementById("unlock-button");
  var error   = document.getElementById("unlock-error");
  var gate    = document.querySelector(".locked");
  var target  = document.getElementById("unlocked-content");
  var payload = document.getElementById("locked-payload");

  if (!form || !payload || !target) return;

  function fail(message) {
    error.textContent = message;
    error.hidden = false;
    button.disabled = false;
    button.textContent = "Unlock";
    input.select();
  }

  function bytes(b64) {
    var raw = atob(b64);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  if (!window.crypto || !window.crypto.subtle) {
    form.hidden = true;
    error.textContent =
      "This page needs a secure connection (https) to unlock. Opening the file directly from disk will not work.";
    error.hidden = false;
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    error.hidden = true;

    var password = input.value;
    if (!password) return fail("Enter the password.");

    button.disabled = true;
    button.textContent = "Unlocking…";

    var blob;
    try {
      blob = JSON.parse(payload.textContent);
    } catch (e) {
      return fail("This page is missing its content. Please email me for the case study.");
    }
    if (!blob || !blob.data) {
      return fail("This page is missing its content. Please email me for the case study.");
    }

    var encoder = new TextEncoder();

    window.crypto.subtle
      .importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"])
      .then(function (base) {
        return window.crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: bytes(blob.salt),
            iterations: blob.iterations,
            hash: "SHA-256"
          },
          base,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
      })
      .then(function (key) {
        return window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv: bytes(blob.iv) },
          key,
          bytes(blob.data)
        );
      })
      .then(function (plain) {
        target.innerHTML = new TextDecoder().decode(plain);
        target.hidden = false;
        if (gate) gate.hidden = true;

        /* The protected content carries no [data-reveal] on purpose: main.js
           builds its reveal list once at load and drops its listeners when
           that list empties, so anything injected later would stay hidden. */
        var heading = target.querySelector("h2, h3");
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function () {
        fail("That password did not work. Check it, or email me for the case study.");
      });
  });
})();
