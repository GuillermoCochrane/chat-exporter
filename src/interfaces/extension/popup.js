// Controla la interfaz del popup.
// Envía las opciones elegidas por el usuario al background.
const $ = (tagName) => document.querySelector(tagName);
const $exportBtn = $("#exportBtn");
const $formatSelect = $("#format");
const $status = $("#status");

const statusDiv = $status;

$exportBtn.addEventListener("click", () => {
  const format = $formatSelect.value;

  $status.textContent = "Procesando...";

  chrome.runtime.sendMessage(
    {
      type: "EXPORT",
      format: format,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        $status.textContent = "⚠️ Error: " + chrome.runtime.lastError.message;
        return;
      }

      $status.textContent = `✔️ ${$formatSelect.value.toUpperCase()} exportado con éxito.`;
    }
  );
});