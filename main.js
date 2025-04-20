// Updates character count
function updateCharCount() {
  const text = document.getElementById("post-input").value;
  const charCount = document.getElementById("char-count");
  charCount.textContent = text.length;
}
