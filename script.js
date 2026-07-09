const downloadConfig = {
  url: "https://pan.baidu.com/s/1FELWJmEQ4jOv8RFaThRJ6A",
  label: "打开百度网盘下载",
};

const modal = document.querySelector("#downloadModal");
const downloadLink = document.querySelector("#downloadLink");
const openButtons = document.querySelectorAll("[data-open-download]");
const closeButtons = document.querySelectorAll("[data-close-download]");
// screenshot onload handled inline — no special error logic
const heroCharacter = document.querySelector("#hero-character");
const petalField = document.querySelector(".petal-field");

const ext = (function detectWebp() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp") ? "webp" : "png";
})();

// Swap all img .png src to .webp when the browser supports it
if (ext === "webp") {
  document.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && src.endsWith(".png")) {
      img.setAttribute("src", src.replace(/\.png$/, ".webp"));
      // Also update data-file attribute on parent .screen-shot
      const shot = img.closest(".screen-shot");
      if (shot) {
        const df = shot.getAttribute("data-file");
        if (df) shot.setAttribute("data-file", df.replace(/\.png$/, ".webp"));
      }
    }
  });
}

const heroFrames = [
  `./assets/showcase/hero-frame-1.${ext}`,
  `./assets/showcase/hero-frame-2.${ext}`,
  `./assets/showcase/hero-frame-3.${ext}`,
  `./assets/showcase/hero-frame-4.${ext}`,
  `./assets/showcase/hero-frame-5.${ext}`,
  `./assets/showcase/hero-frame-6.${ext}`,
  `./assets/showcase/hero-frame-7.${ext}`,
  `./assets/showcase/hero-frame-8.${ext}`,
];

const heroFrameDurations = [1800, 1200, 900, 90, 1500, 1100, 80, 2200];

function openDownloadModal() {
  downloadLink.href = downloadConfig.url;
  downloadLink.textContent = downloadConfig.label;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDownloadModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openButtons.forEach((button) => {
  button.addEventListener("click", openDownloadModal);
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeDownloadModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeDownloadModal();
  }
});

// Mark screenshots as loaded so the placeholder text hides
document.querySelectorAll(".screen-shot img").forEach((img) => {
  img.addEventListener("load", () => {
    const w = img.closest(".screen-shot");
    if (w) w.classList.add("has-image");
  });
});

if (heroCharacter) {
  heroFrames.forEach((src) => {
    const image = new Image();
    image.src = src;
  });

  let frame = 0;
  function scheduleNextFrame() {
    frame = (frame + 1) % heroFrames.length;
    heroCharacter.src = heroFrames[frame];
    setTimeout(scheduleNextFrame, heroFrameDurations[frame] || 1000);
  }

  setTimeout(scheduleNextFrame, heroFrameDurations[0]);
}

if (petalField) {
  for (let i = 0; i < 12; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${10 + Math.random() * 7}s`;
    petal.style.animationDelay = `${Math.random() * 10}s`;
    petal.style.setProperty("--drift", `${Math.round(-50 + Math.random() * 100)}px`);
    petal.style.setProperty("--scale", `${0.58 + Math.random() * 0.52}`);
    petalField.appendChild(petal);
  }
}
