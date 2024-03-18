document.addEventListener('DOMContentLoaded', () => {

const logoInput = document.getElementById('logo');
const fileLabel = document.querySelector('.custom-file-label');
const fileStatus = document.getElementById('file-status');

logoInput.addEventListener('change', () => {
    if (logoInput.files.length > 0) {
      const fileName = logoInput.files[0].name;
      fileLabel.textContent = fileName;
      fileStatus.textContent = 'Fichier sélectionné : ' + fileName;
    } else {
      fileLabel.textContent = 'Choisir un fichier';
      fileStatus.textContent = '';
    }
 }); 



});
