window.onload = function() {
    getGoods();
};
//global fun
function global() {
    document.addEventListener('click', (e) => {
    //close burger menu
        if (!e.target.matches('[class *= "nav__"]')) {
            const burger = document.querySelector('.nav__burger');
        const navbar = document.querySelector('.nav__navbar');

            burger.classList.remove('--active');
            navbar.classList.remove('--active');
        };
    //close filter
        if (!e.target.matches('[class *= "filter__"]')) {
            const filter = document.querySelector('.filter')

            filter.classList.remove('--active');
        };
    //close sort list
        if (!e.target.matches('[class *= "sort__"]')) {
            const selectHeader = document.querySelector('.sort__header');
        const sortList = document.querySelector('.sort__list');

            selectHeader.classList.remove('--active');
            sortList.classList.remove('--active');
        };
    });
}

//open burger menu
function burgerMenu() {
    const burger = document.querySelector('.nav__burger');
    
    burger.addEventListener('click', () => {
        const navbar = document.querySelector('.nav__navbar');
        burger.classList.toggle('--active');
        navbar.classList.toggle('--active');
    });
};

//open, close, change login form
function loginForm() {
    const btn = document.querySelector('.header__login');
    const overlay = document.querySelector('.overlay');
    const loginForm = document.querySelectorAll('.header__form');
    const btnChange = document.querySelectorAll('.form__change');

    btn.addEventListener('click', () => {
        overlay.classList.toggle('--active');
        loginForm.forEach(item => {
            item.classList.toggle('--active');
        })
    })

    overlay.addEventListener('click', () => {
        overlay.classList.remove('--active');
        loginForm.forEach(item => {
            item.classList.remove('--active');
        })
    })

    btnChange.forEach(btn => {
        btn.addEventListener('click', () => {
            loginForm.forEach(item => {
                item.classList.toggle('--hidden');
            })
        })
    })
    
}

//open filter
function filterMenu() {
    const filterBtn = document.querySelector('.filter__icon');
    

    filterBtn.addEventListener('click', () => {
        const filter = document.querySelector('.filter');
        filter.classList.toggle('--active');
    })
}

//open sort list
function sortList() {
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

//Counter card
function addToCart() {
    const btn = document.querySelectorAll('.main__button');
    const counter = document.querySelector('.header__counter');
    //const card = document.querySelector('.main__card');
    let count = 0;
    btn.forEach(item => {
        item.addEventListener('click', (e) => { 
            count++;
            counter.innerText = count;
        });
    });
    
}

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
            burgerMenu();
            loginForm();
            filterMenu();
            sortList();
            sortTest();
            addToCart();
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
    button.classList.add('slider__button');
    button.setAttribute('href', './product.html')
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
    goods.forEach((item, i) => { 
        if (item.sale) {
            createSliderElement(item);
        };
    });
};

//Hover
function imgHoverEvent() {
    document.querySelectorAll('.main__img').forEach((item, i) => {
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

    let img = document.createElement('a');
    img.classList.add('main__img');
    img.setAttribute('href', `#`);
    img.setAttribute('style', `background-image: url('${product.img}')`);
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
    button.classList.add('main__button');
    button.classList.add('btn');
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

function sortTest() {
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
    
}

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
}

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
}

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
}

function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

//Заполнение элементов каталога
function drawCatalog(goods) {
    
    goods.forEach((item, i) => {
        createCatalogElement(item);
    });
    sortDescending()
};

function drawGoods(goods) {
    drawSlider(goods);
    drawCatalog(goods);
};