// Nav bar for Media queries @max-width: 520px
const navbarBtn = document.querySelector('.navbar__btn')
const navbarLinks = document.querySelector('.navigation')


navbarBtn.addEventListener('click', function(){
    let value = navbarLinks.classList.contains('navbar__collapse')

    if(value){
        navbarLinks.classList.remove('navbar__collapse')
        navbarBtn.classList.remove('change')
    }else{
        navbarLinks.classList.add('navbar__collapse')
        navbarBtn.classList.add('change')
    }
})