document.querySelectorAll('.edit').forEach(item => {
    item.addEventListener('click', function (items){
        document.querySelector('.bg_modal').style.display = 'flex';
    });
})

document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.bg_modal').style.display = 'none';
});

function goBack() {
    window.history.back();
}