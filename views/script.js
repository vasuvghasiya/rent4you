
function openNav() {
    document.getElementById("myNav").classList.toggle("menu_width");
}

let name1=document.getElementById("name");
let mail=document.getElementById("mail");
let message=document.getElementById("message");

function sendMail(){
    if(message.value && name1.value && mail.value){
    window.location =`mailto:rent4youofficial@gmail.com?subject=feedback&body=${message.value}`;
}}