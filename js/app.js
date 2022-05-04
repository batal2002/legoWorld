window.onload = function() {
    getGoods();
};

//global fun
function global() {
    document.addEventListener('click', (e) => {
    //close filter
        if (document.querySelector('.filter')) {
            if (!e.target.matches('[class *= "filter__"]')) {
                const filter = document.querySelector('.filter');

                filter.classList.remove('--active');
            };
        };
    //close sort list
        if (document.querySelector('.sort__header')){
            if (!e.target.matches('[class *= "sort__"]')) {
                const selectHeader = document.querySelector('.sort__header');
                const sortList = document.querySelector('.sort__list');

                selectHeader.classList.remove('--active');
                sortList.classList.remove('--active');
            };
        };
    });
};

//search
function search() {
    const btn = document.querySelector('.header__search-btn');
    const input = document.querySelector('.header__input');
    const card = document.querySelectorAll('.main__card');
    const voidText = document.querySelector('.main__void');
    
    btn.addEventListener('click', () => {
        let text = input.value.toLowerCase();
        if (text.length > 0) {
            card.forEach(item => {
                voidText.classList.remove('--active');
                item.classList.remove('--hiddenSearch');
                const id = item.querySelector('.main__id');
                const name = item.querySelector('.main__name');
                
                if (!id.textContent.toLowerCase().includes(text) && !name.textContent.toLowerCase().includes(text)) {
                    item.classList.add('--hiddenSearch');
                }
                const cardHidden = document.querySelectorAll('.main__card.--hiddenSearch');
                const card = document.querySelectorAll('.main__card');
                if (card.length == cardHidden.length) {
                    voidText.classList.add('--active');
                };
            });  
        } else {
            card.forEach(item => {
                voidText.classList.remove('--active');
                item.classList.remove('--hiddenSearch');
                item.classList.remove('--hidden');
            }); 
        }
        input.value = null;
    });
};

//open cart list
function openCart() {
    const cartBlock = document.querySelector('.cart');
    const cartBtn = document.querySelector('.header__cart');
    const overlay = document.querySelector('.overlay');
    const cartClose = document.querySelector('.cart__close');

    cartBtn.addEventListener('click', () => {
        cartBlock.classList.add('--open');
        overlay.classList.add('--active')
    });

    cartClose.addEventListener('click', () => {
        cartBlock.classList.remove('--open');
        overlay.classList.remove('--active')
    })
};

//Create cart element
function createCartElement(product) {
    let article = document.createElement('article');
    article.classList.add('cart__product');
    article.setAttribute('data-id', `${product.id}`);

    let img = document.createElement('a');
    img.classList.add('cart__img', 'button-link');
    img.setAttribute('data-id', `${product.id}`)
    img.setAttribute('style', `background-image: url('${product.img}')`);

    let info = document.createElement('div');
    info.classList.add('cart__info');

    let id = document.createElement('h5');
    id.classList.add('cart__id');
    id.innerText = `${product.category} ${product.id}`;

    let name = document.createElement('h4');
    name.classList.add('cart__name');
    name.innerText = `${product.title}`;

    let current = document.createElement('span');
    current.classList.add('cart__price');
    current.innerText = `${product.currentPrice} ₽`;  
    
    let wrapper = document.createElement('div');
    wrapper.classList.add('cart__count-wrapper');
    wrapper.setAttribute('data-id', `${product.id}`);

    let minus = document.createElement('span');
    minus.classList.add('cart__count-btn', 'cart__minus');
    minus.innerText = '-';  

    let count = document.createElement('span');
    count.classList.add('cart__count');
    count.innerText = `${product.countProduct}`;  

    let plus = document.createElement('span');
    plus.classList.add('cart__count-btn', 'cart__plus');
    plus.innerText = '+'; 

    info.appendChild(id);
    info.appendChild(name);

    wrapper.appendChild(minus);
    wrapper.appendChild(count);
    wrapper.appendChild(plus);

    article.appendChild(img);
    article.appendChild(info);
    article.appendChild(current);
    article.appendChild(wrapper);

    document.querySelector('.cart__list').appendChild(article);
};

//Add to cart
let data = {};
if (localStorage.getItem('cart')) {
    data = JSON.parse(localStorage.getItem('cart'));
};
const voidText = document.querySelector('.cart__void');

//minus count
function minusFun(item) {   
    item.forEach(item => {
        item.addEventListener('click', () => {
            let article = item.parentElement.parentElement;
            let countItem = article.getAttribute('data-id');
            let count = item.parentElement.querySelector('.cart__count');

            Object.entries(JSON.parse(localStorage.getItem('cart'))).forEach((item) => {
                if (item[1]['id'] == countItem) {
                    let localCounter = data[countItem]['countProduct'];
                    localCounter--;
                    data[countItem]['countProduct'] = localCounter;
                    count.innerText = localCounter;
                    if (localCounter < 1) {
                        article.remove();
                        delete data[countItem];          
                    }
                }
            });
            let allArticle = document.querySelectorAll('.cart__product');  
            
            if (allArticle.length > 0) {
                localStorage.setItem('cart', JSON.stringify(data));
            } else {
                localStorage.clear();
                voidText.classList.add('--active');
                document.querySelector('.cart__sum').innerText = 0;
                document.querySelector('.header__counter').innerText = 0;
            }
            priceCounter();  
            cartCounter();
        });
    })
};

//plus count
function plusFun(item) {
    item.forEach(item => {
        item.addEventListener('click', () => {
            let countItem = item.parentElement.getAttribute('data-id');
            let count = item.parentElement.querySelector('.cart__count');

            Object.entries(JSON.parse(localStorage.getItem('cart'))).forEach((item) => {
                if (item[1]['id'] == countItem) {
                    let localCounter = data[countItem]['countProduct'];
                    localCounter++;
                    data[countItem]['countProduct'] = localCounter;
                    count.innerText = localCounter;
                    
                }
            });
            localStorage.setItem('cart', JSON.stringify(data));
            cartCounter();
            priceCounter();
        });
    })
};

//mini cart counter
function cartCounter() {
    const counter = document.querySelector('.header__counter');
    let count = 0;
    if (JSON.parse(localStorage.getItem('cart'))) {
        Object.entries(JSON.parse(localStorage.getItem('cart'))).forEach((item) => {
            count += item[1]['countProduct'];
            counter.innerText = count;
        });
        count = 0;
    };
};

//all price
function priceCounter() {
    const sumEl = document.querySelector('.cart__sum');
    let sum = 0;
    if (JSON.parse(localStorage.getItem('cart'))) {
        Object.entries(JSON.parse(localStorage.getItem('cart'))).forEach((item) => {
            sum += item[1]['currentPrice'] * item[1]['countProduct'];
            sumEl.innerText = sum;
        });
        sum = 0;
    };
};



function addToCartBtn(goods, btn) {
    btn.forEach(item => {
        item.addEventListener('click', (e) => { 
            const modal = document.querySelector('.modal__add-to-cart');
            const list = document.querySelectorAll('.cart__product');                 
            let id = item.getAttribute('data-id');
            modal.classList.add('--open');
            setTimeout(() => {
                modal.classList.remove('--open');
            }, 2000);

            if (data[id] !== undefined){
                data[id]['countProduct']++;
            } else {
                goods.forEach((item) => {
                    if (item.id === id) {
                        data[id] = item;
                        data[id]['countProduct'] = 1;
                    };
                });
            };
            localStorage.setItem('cart', JSON.stringify(data));
            if (list !== null) {
                voidText.classList.remove('--active');
            };
            list.forEach((item) => {
                item.remove();
            });
            drawCart(goods);
            const plus = document.querySelectorAll('.cart__plus');
            const minus = document.querySelectorAll('.cart__minus');
            cartCounter();
            priceCounter();
            minusFun(minus);
            plusFun(plus);
        });
    });
}

//add to localStorage
function addToCart(goods) {
    const minus = document.querySelectorAll('.cart__minus');
    const plus = document.querySelectorAll('.cart__plus');
    
    const btn = document.querySelectorAll('.button-add-to-cart');

    cartCounter();
    priceCounter();
    minusFun(minus);
    plusFun(plus);
    addToCartBtn(goods, btn);
};

//clear cart
function clearCart() {
    const btn = document.querySelector('.cart__clear');

    btn.addEventListener('click', () => {
        const list = document.querySelectorAll('.cart__product');
        localStorage.clear();
        list.forEach((item) => {
            item.remove();
        });
        voidText.classList.add('--active');
        data = {};
        document.querySelector('.header__counter').innerText = 0;
        document.querySelector('.cart__sum').innerText = 0;
    })
};

//draw cart
function drawCart() {  
    if (JSON.parse(localStorage.getItem('cart')) && document.querySelector('.cart__list')) {
        Object.entries(JSON.parse(localStorage.getItem('cart'))).forEach((item) => {
            createCartElement(item[1]);
        })
    } else {
        voidText.classList.add('--active');
    }
};
//------------------------------------------------------------------------------------------------------

//open, close, change login form
function loginForm() {
    const btn = document.querySelector('.header__login');
    const overlay = document.querySelector('.overlay');
    const loginForm = document.querySelectorAll('.header__form');
    const btnChange = document.querySelectorAll('.form__change');
    const cartBlock = document.querySelector('.cart');


    btn.addEventListener('click', () => {
        overlay.classList.toggle('--active');
        loginForm.forEach(item => {
            item.classList.toggle('--active');
        });
    });

    overlay.addEventListener('click', () => {
        overlay.classList.remove('--active');
        cartBlock.classList.remove('--open');
        loginForm.forEach(item => {
            item.classList.remove('--active');
        });
    });

    btnChange.forEach(btn => {
        btn.addEventListener('click', () => {
            loginForm.forEach(item => {
                item.classList.toggle('--hidden');
            })
        })
    })
    
};

//open filter
function filterMenu() {
    if (document.querySelector('.filter__icon')) {
        const filterBtn = document.querySelector('.filter__icon');
        
        filterBtn.addEventListener('click', () => {
            const filter = document.querySelector('.filter');
            filter.classList.toggle('--active');
        })
    };
};

//open sort list
function sortList() {
    if (document.querySelector('.sort__header')) {
        const selectHeader = document.querySelector('.sort__header');
        const sortList = document.querySelector('.sort__list');
        const sortItem = document.querySelectorAll('.sort__item');

        selectHeader.addEventListener('click', (e) => {
            selectHeader.classList.toggle('--active');
            sortList.classList.toggle('--active');
        });

        sortItem.forEach (item => {
            item.addEventListener('click', (e) =>  {
                let text = e.target.innerText;
                document.querySelector('.sort__select').innerText = text;
                selectHeader.classList.remove('--active');
                sortList.classList.remove('--active');
            });
        });  
    };
};

function getGoods() {
//Считывание элементов массива товарова из БД 
    fetch('db/db.json') 
        .then((dbFile) => {
            return dbFile.json();
        })
        .then((items) => {
            //Отрисовка товаров на страницу
            drawGoods(items.goods);
            global();
            search();
            openCart();
            loginForm();
            filterMenu();
            category()
            sortList();
            sort();
            addToCart(items.goods);
            clearCart()
            imgHoverEvent();
        })
        .then(() => {
//Иницилизация слайдера 
            $('.hero__slider').slick({
                appendArrows: $('.hero__buttons'),
                prevArrow: '<button type="button" class="hero__button hero__button-left"></button>',
                nextArrow: '<button type="button" class="hero__button hero__button-right"></button>',
                dots: true,
                appendDots: $(".hero__dots"),
                customPaging : () => {
                    return '<span></span>';
                },
                autoplay:false,
                autoplaySpeed: 2500
            });
            
        });
};

//Создание элементов слайдера
function createSliderElement(product) {
    let wrapper = document.createElement('div');
    wrapper.classList.add('slider__item')

    let img = document.createElement('img');
    img.classList.add('slider__img');
    img.setAttribute('src', `${product.img}`)

    let info = document.createElement('div');
    info.classList.add('slider__info');

    let title = document.createElement('div');
    title.classList.add('slider__title');

    let id = document.createElement('h5');
    id.classList.add('slider__id');
    id.innerText = `${product.category} ${product.id}`;

    let name = document.createElement('h4');
    name.classList.add('slider__name');
    name.innerText = `${product.title}`;

    let cost = document.createElement('div');
    cost.classList.add('slider__cost');

    let old = document.createElement('span');
    old.classList.add('slider__old');
    old.innerText = `${product.oldPrice}`;

    let current = document.createElement('p');
    current.classList.add('slider__new');
    current.innerText = `${product.currentPrice} ₽`;

    let description = document.createElement('span');
    description.classList.add('slider__description');
    description.innerText = `${product.description}`;

    let button = document.createElement('a');
    button.classList.add('slider__button', 'button-link');
    button.setAttribute('data-id', `${product.id}`)
    button.innerText = 'Страница товара';

    title.appendChild(id);
    title.appendChild(name);

    cost.appendChild(old);
    cost.appendChild(current);

    info.appendChild(title);
    info.appendChild(cost);
    info.appendChild(description);
    info.appendChild(button);

    wrapper.appendChild(img);
    wrapper.appendChild(info);

    document.querySelector('.hero__slider').appendChild(wrapper);
};

//Заполнение элементов слайдера
function drawSlider(goods) {
    if (document.querySelector('.hero__slider')){
        goods.forEach((item, i) => { 
            if (item.sale) {
                createSliderElement(item);
            };
        });
    };
};

//Create product page
function createProductCard(product) {
    let container = document.createElement('div');
    container.classList.add('container', 'product__container');

    let wrapper = document.createElement('div');
    wrapper.classList.add('product');

    let gallery = document.createElement('div');
    gallery.classList.add('product__gallery');

    let img = document.createElement('img');
    img.classList.add('product__img');
    img.setAttribute('src', `${product.img}`);

    let info = document.createElement('div');
    info.classList.add('product__info');

    let id = document.createElement('h5');
    id.classList.add('product__id');
    id.innerText = `${product.category} ${product.id}`;

    let name = document.createElement('h2');
    name.classList.add('product__title');
    name.innerText = `${product.title}`;

    let old = document.createElement('p');
    old.classList.add('product__old-price');
    old.innerText = `${product.oldPrice}`;

    let current = document.createElement('p');
    current.classList.add('product__current-price');
    current.innerText = `${product.currentPrice} ₽`;

    let button = document.createElement('button');
    button.classList.add('product__btn', 'button-add-to-cart');
    button.setAttribute('data-id', `${product.id}`);
    button.innerText = 'Добавить в корзину';

    let descriptionBlock = document.createElement('div');
    descriptionBlock.classList.add('product__description-block');

    let description = document.createElement('div');
    description.classList.add('product__description');
    description.innerText = `${product.description}`;

    gallery.appendChild(img);

    info.appendChild(id);
    info.appendChild(name);
    if (product.sale) {
        info.appendChild(old);
    }
    info.appendChild(current);
    info.appendChild(button);

    wrapper.appendChild(gallery);
    wrapper.appendChild(info);

    descriptionBlock.appendChild(description);

    container.appendChild(wrapper);
    container.appendChild(descriptionBlock);

    document.querySelector('.modal__product-card').appendChild(container);
};

let product = {}; 

//draw product page
function drawProductPage(goods) {
    const btn = document.querySelectorAll('.button-link');
    const modal = document.querySelector('.modal__product-card');
    const overlay = document.querySelector('.overlay');

    btn.forEach(item => {
        item.addEventListener('click', () => {
            let id = item.getAttribute('data-id');
            goods.forEach((item) => {
                if (item.id === id) {
                    product = item;
                };
            });
            if (document.querySelector('.product__container')) {
                document.querySelector('.product__container').remove();
            }
            createProductCard(product);
            
            modal.classList.add('--active');
            overlay.classList.add('--active');
            const productBtn = document.querySelectorAll('.product__btn');
            addToCartBtn(goods, productBtn);
        });
    });

    overlay.addEventListener('click', () => {
        modal.classList.remove('--active');
        product = {};
    });
};

//Hover img
function imgHoverEvent() {
    document.querySelectorAll('.main__img').forEach((item) => {
        let hoverSrc = item.getAttribute('data-hover-img');
        if(hoverSrc){
            let src = item.getAttribute('style');
            
            item.addEventListener('mouseover', () => {
                item.setAttribute('style', `background-image: url('${hoverSrc}')`);
            });

            item.addEventListener('mouseout', () => {
                item.setAttribute('style', `${src}`);
            });
        };
    });
};

//Создание элементов каталога
function createCatalogElement(product) {
    let article = document.createElement('article');
    article.classList.add('main__card');
    article.setAttribute('data-sale', `${product.sale}`);
    article.setAttribute('data-price', `${product.currentPrice}`);
    article.setAttribute('data-price-old', `${product.oldPrice}`);
    article.setAttribute('data-category', `${product.category}`);

    let img = document.createElement('a');
    img.classList.add('main__img', 'button-link');
    img.setAttribute('style', `background-image: url('${product.img}')`);
    img.setAttribute('data-id', `${product.id}`);
    if (product.hoverImg) {
        img.setAttribute('data-hover-img', `${product.hoverImg}`);
    }

    let info = document.createElement('div');
    info.classList.add('main__info');

    let title = document.createElement('div');
    title.classList.add('main__title');

    let id = document.createElement('h5');
    id.classList.add('main__id');
    id.innerText = `${product.category} ${product.id}`;

    let name = document.createElement('h4');
    name.classList.add('main__name');
    name.innerText = `${product.title}`;

    let shopping = document.createElement('div');
    shopping.classList.add('main__shopping');

    let cost = document.createElement('div');
    cost.classList.add('main__cost');

    let current = document.createElement('span');
    current.classList.add('main__current');
    current.innerText = `${product.currentPrice} ₽`;
    
    
    let button = document.createElement('button');
    button.classList.add('btn', 'main__button', 'button-add-to-cart');
    button.setAttribute('data-id', `${product.id}`);
    button.innerText = 'В корзину';

    cost.appendChild(current);

    if (product.sale) {
        let old = document.createElement('span');
        old.classList.add('main__old');
        old.innerText = `${product.oldPrice}`;

        current.classList.add('main__current--sale');

        cost.appendChild(old);
    }

    title.appendChild(id);
    title.appendChild(name);

    shopping.appendChild(cost);
    shopping.appendChild(button);

    info.appendChild(title);
    info.appendChild(shopping);

    if (product.sale) {
        let sale = document.createElement('span');
                sale.classList.add('main__sale');
                sale.innerText = 'SALE';
        article.appendChild(sale);
    }

    article.appendChild(img);
    article.appendChild(info);

    document.querySelector('.main__list').appendChild(article);
};

//SORT
function sort() {
    const sortItem = document.querySelectorAll('.sort__item');    
    sortItem.forEach (item => {
        item.addEventListener('click', () =>  {
            if (item.innerText === 'Сначала дешевые') {
                sortAscending();
            } else if (item.innerText === 'Сначала дорогие') {
                sortDescending();
            } else if (item.innerText === 'По размеру скидки') {
                sortSale()
            }
        });
    }); 
};

function sortAscending() {
    const productList = document.querySelector('.main__list');

    for (let i = 0; i < productList.children.length; i++){
        for (let j = i; j < productList.children.length; j++) {
            if (+productList.children[i].getAttribute('data-price') > +productList.children[j].getAttribute('data-price')) {
                replace = productList.replaceChild(productList.children[j], productList.children[i]);
                insertAfter(replace, productList.children[i]);
            }
        }
    }
};

function sortDescending() {
    const productList = document.querySelector('.main__list');

    for (let i = 0; i < productList.children.length; i++){
        for (let j = i; j < productList.children.length; j++) {
            if (+productList.children[i].getAttribute('data-price') < +productList.children[j].getAttribute('data-price')) {
                replace = productList.replaceChild(productList.children[j], productList.children[i]);
                insertAfter(replace, productList.children[i]);
            }
        }
    }
};

function sortSale() {
    const productList = document.querySelector('.main__list');

    for (let i = 0; i < productList.children.length; i++){
        for (let j = i; j < productList.children.length; j++) {
            let item = +productList.children[i].getAttribute('data-price-old')/+productList.children[i].getAttribute('data-price')
            let nextItem = +productList.children[j].getAttribute('data-price-old')/+productList.children[j].getAttribute('data-price')

            if (item < nextItem) {
                replace = productList.replaceChild(productList.children[j], productList.children[i]);
                insertAfter(replace, productList.children[i]);
            }
        }
    }
};

function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
};
//-------------------------------

//category
function category() {
    const categoryItem = document.querySelectorAll('.filter__category');
    const card = document.querySelectorAll('.main__card');

    categoryItem.forEach(item => {
        item.addEventListener('click', () => {
            let categoryFilter = item.getAttribute('data-category');
            const card = document.querySelectorAll('.main__card');
            card.forEach(item => {
                item.classList.remove('--hidden')
                let categoryCard = item.getAttribute('data-category');
                if (categoryFilter != 'all') {
                    if (categoryCard != categoryFilter) {
                        item.classList.add('--hidden');
                    }
                } else {
                    item.classList.remove('--hidden');
                    item.classList.remove('--hiddenSearch');
                    document.querySelector('.main__void').classList.remove('--active');
                }
            });
        });
    });
};

//Заполнение элементов каталога
function drawCatalog(goods) {
    if (document.querySelector('.main__list')){
        goods.forEach((item, i) => {
            createCatalogElement(item);
        });
        sortDescending();
    };
};

function drawGoods(goods) {
    drawSlider(goods);
    drawCatalog(goods);
    drawCart(goods);
    drawProductPage(goods);
};