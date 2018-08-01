export function normalizeKey(key) {
  return key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

export function copyToClipboard(val) {
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);

}
