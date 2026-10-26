const profile = {
  name: "Sijia Che",
  title: "Business Development Department",
  company: "airweave inc.",
  mobile: "+81-80-7458-6668",
  telephone: "+81-3-6214-2460",
  fax: "+81-3-6214-2461",
  email: "sijia_che@airweave.jp",
  website: "https://airweave.com",
  address: "8F Shin-Otemachi Building, 2-2-1 Otemachi, Chiyoda-ku, Tokyo, 100-0004 Japan"
};

const card = document.querySelector("#card");
const backgroundVideo = document.querySelector("#background-video");
const playGate = document.querySelector("#play-gate");
const button = document.querySelector("#save-contact");
const ripple = button.querySelector(".ripple");

function prepareVideo() {
  backgroundVideo.muted = true;
  backgroundVideo.defaultMuted = true;
  backgroundVideo.setAttribute("muted", "");
  backgroundVideo.setAttribute("playsinline", "");
  backgroundVideo.setAttribute("webkit-playsinline", "");
}

async function playBackground() {
  prepareVideo();
  try {
    await backgroundVideo.play();
    playGate.hidden = true;
  } catch (_) {
    playGate.hidden = false;
  }
}

playGate.addEventListener("click", playBackground);
playBackground();

window.setTimeout(() => card.classList.add("is-revealing"), 1450);
window.setTimeout(() => card.classList.add("is-ready"), 2050);
window.setTimeout(() => {
  if (backgroundVideo.paused) playGate.hidden = false;
}, 2150);

button.addEventListener("pointerdown", (event) => {
  const rect = button.getBoundingClientRect();
  ripple.style.setProperty("--x", `${event.clientX - rect.left}px`);
  ripple.style.setProperty("--y", `${event.clientY - rect.top}px`);
  ripple.classList.remove("play");
  requestAnimationFrame(() => ripple.classList.add("play"));
});

button.addEventListener("click", async () => {
  let photo = [];
  try {
    const response = await fetch("assets/sijia-che.jpg");
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    const encoded = btoa(binary);
    const prefix = "PHOTO;ENCODING=b;TYPE=JPEG:";
    photo.push(prefix + encoded.slice(0, 75 - prefix.length));
    for (let i = 75 - prefix.length; i < encoded.length; i += 74) photo.push(` ${encoded.slice(i, i + 74)}`);
  } catch (_) {}

  const vcard = [
    "BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name}`, "N:Che;Sijia;;;",
    `ORG:${profile.company}`, `TITLE:${profile.title}`,
    `TEL;TYPE=CELL:${profile.mobile}`, `TEL;TYPE=WORK,VOICE:${profile.telephone}`,
    `TEL;TYPE=WORK,FAX:${profile.fax}`, `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
    `URL;TYPE=WORK:${profile.website}`,
    "ADR;TYPE=WORK:;;8F Shin-Otemachi Building\\, 2-2-1 Otemachi;Chiyoda-ku;Tokyo;100-0004;Japan",
    "NOTE:The Quality Sleep — airweave. TEAM JAPAN / JAPAN PARALYMPIC TEAM Official Bedding Partner.",
    ...photo, "END:VCARD", ""
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([vcard], {type:"text/vcard;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "Sijia-Che.vcf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
});
