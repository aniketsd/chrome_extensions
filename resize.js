// Get the popup and resize handle elements
const popup = document.body;
const resizeHandle = document.getElementById('resizeHandle');

// Initialize variables to track resizing state
let isResizing = false;
let initialWidth, initialHeight;

// Event listener for mousedown on the resize handle
resizeHandle.addEventListener('mousedown', (e) => {
  isResizing = true;
  initialWidth = popup.offsetWidth;
  initialHeight = popup.offsetHeight;
  const startX = e.clientX;
  const startY = e.clientY;

  // Event listener for mousemove while resizing
  const onMouseMove = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Update the popup size based on the mouse movement
    popup.style.width = initialWidth + deltaX + 'px';
    popup.style.height = initialHeight + deltaY + 'px';
  };

  // Event listener for mouseup to stop resizing
  const onMouseUp = () => {
    isResizing = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});
