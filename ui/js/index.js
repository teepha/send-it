const nextBtn = document.querySelector('.nextBtn');
const prevBtn = document.querySelector('.prevBtn');
const container = document.querySelector('.main_body');

let counter = 0;

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

function nextSlide(){
    container.animate([{opacity:'1.0'},{opacity:'1.0'}],{duration:8000,fill:'forwards'});
    if(counter ===3){
        counter=-1;
    }
    counter++;
    container.style.backgroundImage=`url(images/bcg-${counter}.jpg)`;
}

function prevSlide(){
    container.animate([{opacity:'1.0'},{opacity:'1.0'}],{duration:8000,fill:'forwards'})
    if(counter===0){
        counter=4;
    }
    counter--
    container.style.backgroundImage='url(images/bcg-'+counter+'.jpg)';
}
