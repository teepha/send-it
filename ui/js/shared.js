// Modal for viewing a specific order by user
document.querySelectorAll('.view').forEach(item => {
    item.addEventListener('click', function (items){
        document.querySelector('.bgv_modal').style.display = 'flex';
    });
})

document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.bgv_modal').style.display = 'none';
});
