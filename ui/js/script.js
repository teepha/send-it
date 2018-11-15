//Modal for editing order by admin
document.querySelectorAll('.edit').forEach(item => {
    item.addEventListener('click', function (items){
        document.querySelector('.bg_modal').style.display = 'flex';
    });
})

document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.bg_modal').style.display = 'none';
});

// Modal for viewing a specific order by user
document.querySelectorAll('.view').forEach(item => {
    item.addEventListener('click', function (items){
        document.querySelector('.bgv_modal').style.display = 'flex';
    });
})

document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.bgv_modal').style.display = 'none';
});

// Modal for canceling a specific order by user
document.querySelectorAll('.cancel').forEach(item => {
    item.addEventListener('click', function (items){
        document.querySelector('.bgc_modal').style.display = 'flex';
    });
})

document.querySelector('.c_close').addEventListener('click', function(){
    document.querySelector('.bgc_modal').style.display = 'none';
});
