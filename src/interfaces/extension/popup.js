// Controla la interfaz del popup.
// Envía las opciones elegidas por el usuario al background.

const $ = (selector) => document.querySelector(selector);
const setModelName = (modelName) => ($modelName.textContent = modelName);

const $formatSelect = $("#format");
const $exportBtn = $("#exportBtn");
const $status = $("#status");
const $mdOptions = $("#mdOptions");
const $compactCheck = $("#compact");
const $roleRadios = document.getElementsByName("role");

// Mostrar / ocultar opciones de Markdown según el formato
$formatSelect.addEventListener("change", () => {
  $formatSelect.value === "md" ? $mdOptions.hidden = false : $mdOptions.hidden = true;
});

$exportBtn.addEventListener("click", () => {
  const format = $formatSelect.value;
  const compact = $compactCheck.checked;
  const roleFilter = [...$roleRadios].find(r => r.checked).value;

  $status.textContent = "Procesando...";

  chrome.runtime.sendMessage(
    {
      type: "EXPORT",
      format,
      compact,
      roleFilter,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        $status.textContent = "⚠️ Error: " + chrome.runtime.lastError.message;
        return;
      }

      $status.textContent = `✔️ ${format.toUpperCase()} exportado con éxito.`;
    }
  );
});