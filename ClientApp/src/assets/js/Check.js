document.addEventListener('DOMContentLoaded', () => {

  const checkDivs = document.querySelectorAll('.check');
  checkDivs.forEach(checkDiv => {
    const icon = checkDiv.querySelector('i');
    checkDiv.addEventListener('click', () => {
      if (icon.classList.contains('fa-check')) { icon.classList.remove('fa-check'); icon.classList.add('fa-times'); }
      else { icon.classList.remove('fa-times'); icon.classList.add('fa-check'); }
      checkDiv.classList.toggle('clicked');
    });
  });


  const checkDivs2 = document.querySelectorAll('.check2');
  checkDivs2.forEach(checkDiv => {
    const icon = checkDiv.querySelector('i');
    checkDiv.addEventListener('click', () => {
      if (icon.classList.contains('fa-check')) { icon.classList.remove('fa-check'); icon.classList.add('fa-times'); }
      else { icon.classList.remove('fa-times'); icon.classList.add('fa-check'); }
      checkDiv.classList.toggle('clicked2');
    });
  });


  const checkDivs3 = document.querySelectorAll('.check3');
  checkDivs3.forEach(checkDiv => {
    const icon = checkDiv.querySelector('i');
    checkDiv.addEventListener('click', () => {
      if (icon.classList.contains('fa-check')) { icon.classList.remove('fa-check'); icon.classList.add('fa-times'); }
      else { icon.classList.remove('fa-times'); icon.classList.add('fa-check'); }
      checkDiv.classList.toggle('clicked3');
    });
  });


  const checkDivs4 = document.querySelectorAll('.check4');
  checkDivs4.forEach(checkDiv => {
    const icon = checkDiv.querySelector('i');
    checkDiv.addEventListener('click', () => {
      if (icon.classList.contains('fa-check')) { icon.classList.remove('fa-check'); icon.classList.add('fa-times'); }
      else { icon.classList.remove('fa-times'); icon.classList.add('fa-check'); }
      checkDiv.classList.toggle('clicked4');
    });
  });



const auth2faCheckDiv = document.getElementById('auth2fa-check');
const auth2faText = document.querySelector('.auth2fa');

 auth2faCheckDiv.addEventListener('click', () => {
   if (auth2faText.style.color === 'red') { auth2faText.style.color = ''; }
   else { auth2faText.style.color = 'red'; }
 });
});

