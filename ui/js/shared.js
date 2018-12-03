// LogOut remove saved values from Local storage
document.querySelectorAll('#log_out').forEach(item => {
    item.addEventListener('click', event => {
        localStorage.clear();
    })
});