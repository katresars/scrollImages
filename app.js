// Define variables
const loadLocalBtn = document.getElementById("load-local-btn");
const loadRemoteBtn = document.getElementById("load-remote-btn");
const imageContainer = document.getElementById("image-container");
const imageWrapper = document.getElementById("image-wrapper");
const autoscrollBtn = document.getElementById("autoscroll-btn");
const speedBar = document.getElementById("speed-bar");
let images = [];

// Load images from local storage
loadLocalBtn.addEventListener("click", function () {
  // Clear previous images
  images = [];
  imageWrapper.innerHTML = '<div class="image-row"></div>';

  // Show file input dialog
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.addEventListener("change", function () {
    const files = Array.from(this.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const img = new Image();
        img.src = reader.result;
        images.push(img);
        addImage(img);
      };
    });
  });
  input.click();
});

// Load images from remote links
loadRemoteBtn.addEventListener("click", function () {
  // Clear previous images
  images = [];
  imageWrapper.innerHTML = '<div class="image-row"></div>';

  // Show remote link input dialog
  const link = prompt("Enter remote image links (comma separated):");
  const links = link.split(",");

  links.forEach((link) => {
    const img = new Image();
    img.src = link.trim();
    images.push(img);
    addImage(img);
  });
});

// Add image to the container
function addImage(img) {
  const lastRow = imageWrapper.lastChild;
  const lastRowWidth = lastRow.offsetWidth;
  const imgWidth = img.width;

  if (lastRowWidth + imgWidth > imageWrapper.offsetWidth - 20) {
    // Start new row if the image doesn't fit in the current row
    const newRow = document.createElement("div");
    newRow.classList.add("image-row");
    newRow.appendChild(img);
    imageWrapper.appendChild(newRow);
  } else {
    lastRow.appendChild(img);
  }
}

// Autoscroll
let animationID = null;

autoscrollBtn.addEventListener("click", function () {
  if (animationID) {
    // Stop autoscroll
    cancelAnimationFrame(animationID);
    animationID = null;
    autoscrollBtn.innerHTML = "Autoscroll";
  } else {
    // Start autoscroll
    let start = null;
    const scrollStep = speedBar.value;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      imageWrapper.scrollBy(0, scrollStep);
      if (imageWrapper.scrollTop >= imageWrapper.scrollHeight - imageWrapper.offsetHeight) {
        imageWrapper.scrollTo(0, 0);
      }
      if (progress < 20000) {
        animationID = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(animationID);
        animationID = null;
        autoscrollBtn.innerHTML = "Autoscroll";
      }
    };
    animationID = requestAnimationFrame(step);
    autoscrollBtn.innerHTML = "Stop";
  }
});

// Change autoscroll speed
speedBar.addEventListener("input", function () {
  if (animationID) {
    cancelAnimationFrame(animationID);
    let start = null;
    const scrollStep = speedBar.value;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      imageWrapper.scrollBy(0, scrollStep);
      if (imageWrapper.scrollTop >= imageWrapper.scrollHeight - imageWrapper.offsetHeight) {
        imageWrapper.scrollTo(0, 0);
      }
      if (progress < 20000) {
        animationID = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(animationID);
        animationID = null;
      }
    };
    animationID = requestAnimationFrame(step);
  }
});

