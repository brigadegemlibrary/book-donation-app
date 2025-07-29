const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const captureBtn = document.getElementById('captureBtn');
const extractBtn = document.getElementById('extractBtn');
const titleInput = document.getElementById('title');

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => video.srcObject = stream)
  .catch(err => alert("Camera not available: " + err));

captureBtn.onclick = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  preview.src = canvas.toDataURL('image/png');
};

extractBtn.onclick = async () => {
  titleInput.value = "Extracting...";
  const result = await Tesseract.recognize(canvas, 'eng');
  titleInput.value = result.data.text.trim().split('\n')[0]; // Use first line
};

document.getElementById('donationForm').onsubmit = async (e) => {
  e.preventDefault();

  const formData = {
    code: document.getElementById('code').value,
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    author: document.getElementById('author').value,
    publisher: document.getElementById('publisher').value,
    edition: document.getElementById('edition').value,
    rfid: titleInput.value,
    genre: document.getElementById('genre').value
  };

  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfD6XxQaH-_VUY425YdmehytiYOLMDxVBKHvAr-z6d_x29C5w/formResponse";

  const formBody = new URLSearchParams({
    'entry.207535114': formData.code,
    'entry.1065046570': formData.name,
    'entry.1166974658': formData.phone,
    'entry.1045781291': formData.email,
    'entry.839337160': formData.author,
    'entry.1484740013': formData.publisher,
    'entry.1852618071': formData.edition,
    'entry.1624577213': formData.rfid,
    'entry.730415916': formData.genre
  });

  await fetch(formUrl, {
    method: "POST",
    mode: "no-cors",
    body: formBody
  });

  await emailjs.send("service_gmail123", "template_abc456", {
    user_name: formData.name,
    user_email: formData.email,
    message: `Thanks for donating "${formData.rfid}". We've received it!`
  });

  alert("🎉 Thank you for your donation!");
  document.getElementById('donationForm').reset();
  titleInput.value = '';
  preview.src = '';
};
