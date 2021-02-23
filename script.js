const qs = (element) => document.querySelector(element);
const qsAll = (element) => document.querySelectorAll(element);
const brl = (element) => element.toLocaleString('pt-BR',{style:'currency', currency:'BRL'});
let modalQt = 1;
let modalKey = 0;
let price;
let newPrice = 0;
let cart = [];

pizzaJson.map((item, key)=>{
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.querySelector('.pizza-item--price').innerHTML = brl(item.price[0]);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    
    pizzaItem.querySelector('a').addEventListener('click', (event)=>{
        event.preventDefault();

        
        modalQt = 1;
        modalKey = key;

        qs('.pizzaInfo h1').innerHTML = item.name;
        qs('.pizzaBig img').src = item.img;
        qs('.pizzaInfo--desc').innerHTML = item.description;
        
        qs('.pizzaInfo--qt').innerHTML = modalQt;
        
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsAll('.pizzaInfo--size').forEach((size, index)=>{
            if(index == 2){
                size.classList.add('selected');
                qs('.pizzaInfo--actualPrice').innerHTML = brl(item.price[2]);
                price = item.price[2];
                newPrice = price;
            }

            size.querySelector('span').innerHTML = item.sizes[index];
        });
        
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    qs('.pizza-area').append(pizzaItem);
});

function closeModal(){
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500)
}

qsAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    qs('.pizzaInfo--qt').innerHTML = ++modalQt;
    
    newPrice = price * modalQt;
    qs('.pizzaInfo--actualPrice').innerHTML = brl(newPrice);
});

qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        qs('.pizzaInfo--qt').innerHTML = --modalQt;

        newPrice = price * modalQt;
        qs('.pizzaInfo--actualPrice').innerHTML = brl(newPrice);

    }
});

qsAll('.pizzaInfo--size').forEach((size)=>{
    size.addEventListener('click', ()=>{
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        let key = Number(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
        price = pizzaJson[modalKey].price[key];
        qs('.pizzaInfo--actualPrice').innerHTML = brl(price);
        modalQt = 1;
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    });
});


qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = Number(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt,
        });
    }
    updateCart();
    closeModal();
});

qs('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        qs('aside').style.left = '0';
    }
});
qs('.menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
});

function updateCart(){
    qs('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';
        let subtotal = 0;
        let discount = 0;
        let total = 0;
        
        cart.map((item, index)=>{
            let pizzaItem = pizzaJson.find((pizza) => pizza.id == item.id);

            let cartItem = qs('.models .cart--item').cloneNode(true);
            
            cartItem.querySelector('img').src = pizzaItem.img;

            let pizzaSize;
            switch(item.size){
                case 0: 
                    pizzaSize = 'P';
                    break;
                case 1: 
                    pizzaSize = 'M';
                    break;
                case 2: 
                    pizzaSize = 'G';
                    break;
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSize})`;

            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = item.qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                item.qt++;
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(item.qt > 1){
                    item.qt--;
                }
                else{
                    cart.splice(index, 1);
                }
                updateCart();
            });

            subtotal += item.qt * pizzaItem.price[item.size];
            
            qs('aside .cart').append(cartItem);
        });

        discount = subtotal * 0.1;
        total = subtotal - discount;

        qsAll('.cart--details .subtotal span')[1].innerHTML = brl(subtotal);
        qsAll('.cart--details .desconto span')[1].innerHTML = brl(discount);
        qsAll('.cart--details .total span')[1].innerHTML = brl(total);

        qs('.menu-openner span').innerHTML = cart.length;

    }else{
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}