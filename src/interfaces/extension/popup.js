// Controla la interfaz del popup.
// Envía las opciones elegidas por el usuario al background.

const $ = (selector) => document.querySelector(selector);
const setText = (selector, text) => ($(selector).textContent = text);

const $formatSelect = $("#format");
const $exportBtn = $("#exportBtn");
const $spinner = $(".spinner");
const $statusText = $("#statusText");
const $mdOptions = $("#mdOptions");
const $compactCheck = $("#compact");
const $roleRadios = document.getElementsByName("role");
const $modelName = $("#modelName");

setText('aside.version', `v${chrome.runtime.getManifest().version}`);


// Mostrar / ocultar opciones de Markdown según el formato
$formatSelect.addEventListener("change", () => {
  $formatSelect.value === "md" ? $mdOptions.hidden = false : $mdOptions.hidden = true;
});

$exportBtn.addEventListener("click", () => {
  const format = $formatSelect.value;
  const compact = $compactCheck.checked;
  const roleFilter = [...$roleRadios].find((r) => r.checked).value;

  // Estado de carga
  $exportBtn.disabled = true;
  $statusText.textContent = "";
  $spinner.style.display = "inline-block";

  chrome.runtime.sendMessage(
    { type: "EXPORT", format, compact, roleFilter },
    (response) => {
      // Restaurar estado
      $spinner.style.display = "none";
      $exportBtn.disabled = false;

      if (chrome.runtime.lastError) {
        $statusText.textContent = "⚠️ " + chrome.runtime.lastError.message;
        return;
      }

      if (response && response.success === false) {
        $statusText.textContent = "⚠️ " + response.error;
        return;
      }

      $statusText.textContent = `✔️ ${format.toUpperCase()} exportado con éxito.`;
    }
  );
});