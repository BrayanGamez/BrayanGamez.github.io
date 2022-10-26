const check = document.querySelector('.check');
const section = document.querySelector('.section');

const darkMode = ()=>
{
    if(check.checked)
    {
        section.style.backgroundColor = "#1b1b1b";
        section.style.color = "white";
    }
    else
    {
        section.style.backgroundColor = "white";
        section.style.color = "black";
    }
}

check.addEventListener('click',()=>darkMode());