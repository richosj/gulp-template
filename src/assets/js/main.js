//import * as validate from './validation.js';

let globalCheckVar = null;
let OldGlobalCheckVar = null;

const mediaScreen = {
  sm: 1000,
  md: 1000,
  lg: 1000,
  xl: 1000,
  xxl: 1000,
};
const body = document.body;

const checekscreen = (e) => {
  return (globalCheckVar =
    window.innerWidth < mediaScreen.sm ? "mobile" : "desktop");
};
const initClassList = () => {
  checekscreen();
  //console.log(globalCheckVar)
};

/*  
  UI. modal
*/
const parseSelector = (selector) => {
  if (selector && window.CSS && window.CSS.escape) {
    selector = selector.replace(
      /#([^\s"#']+)/g,
      (match, id) => `#${CSS.escape(id)}`
    );
  }
  return selector;
};
const getSelector = (element) => {
  let selector = element.getAttribute("data-toggle-target");
  if (!selector) {
    return console.log('don"t be not find selector');
  }
  return selector;
};
// 모달 base
const Selector = document.querySelectorAll(
  parseSelector('[data-toggle="modal"]')
);
const SelectorClose = document.querySelectorAll(
  parseSelector('[data-dismiss="modal"]')
);

document.addEventListener("click", (e) => {
  if (e.target.getAttribute("data-dismiss") === "modal") {
    e.preventDefault();
    const modalElement = e.target.closest(".modal");
    //this.close(modalElement);
  }
});

function init() {
  initClassList();
}
document.addEventListener("DOMContentLoaded", init());
