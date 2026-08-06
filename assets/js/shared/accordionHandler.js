//* Accordion Handler

export function accordionHandler() {
  document.querySelectorAll('.sidebar details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      document.querySelectorAll('.sidebar details').forEach(other => {
        if (other !== details) other.open = false;
      });
    });
  });
}