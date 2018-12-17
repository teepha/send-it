// LogOut remove saved values from Local storage
document.querySelectorAll('#log_out').forEach(item => {
    item.addEventListener('click', event => {
        localStorage.clear();
    })
});


// Nav bar for Logged In User for Media queries @max-width: 520px
const navbarBtnIn = document.querySelector('.navbar__btn-in')
const navbarLinksIn = document.querySelector('.logged-in-nav')


navbarBtnIn.addEventListener('click', function(){
    let value = navbarLinksIn.classList.contains('navbar__collapse')

    if(value){
        navbarLinksIn.classList.remove('navbar__collapse')
        navbarBtnIn.classList.remove('change')
    }else{
        navbarLinksIn.classList.add('navbar__collapse')
        navbarBtnIn.classList.add('change')
    }
})