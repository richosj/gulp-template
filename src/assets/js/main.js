import header from './gnb.js';
//header('basic')
// mobile check basic.

function mobileCheck() {
  var mobile = false;
  if (window.innerWidth <= 768) {
    mobile = true;
  } else {
    mobile = false;
  }
  return mobile;
}
const el = document.querySelector('.gnb');

