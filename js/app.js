'use strict';
class Storage {
    static saveProduct(newproduct) {
        localStorage.setItem('newproduct', JSON.stringify(newproduct));
    }
    static getProduct(id) {
        let newproduct = JSON.parse(localStorage.getItem('newproduct'));
        return newproduct.find(product => product.id === +(id));
    }
    static getProducts() {
        let newproduct = JSON.parse(localStorage.getItem('newproduct'));
        return newproduct;
    }
    static saveCart(cart) {
        localStorage.setItem("basket", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem("basket") ? JSON.parse(localStorage.getItem("basket")) : [];
    }
}

class Product {
    getProducts(newproduct) {
        return newproduct.map(item => {
            const name = item.name;
            const price = item.price;
            const id = item.id;
            const image = item.image;
            const category = item.category;
            return { id, name, price, image, category };
        });
    }
}
const overlayGroup = [{
        liClass: 'list-inline-item m-0 p-0 like-this',
        aClass: 'btn',
        icon: 'fas fa-thumbs-up',
        urlClass: '',
        capture: ''
    },
    {
        liClass: 'list-inline-item m-0 p-0 add-to-cart',
        aClass: 'btn',
        icon: 'fas  fa-cart-arrow-down',
        urlClass: '',
        capture: ''
    },
    {
        liClass: 'list-inline-item m-0 p-0 view-this',
        aClass: 'btn',
        icon: 'fas fa-info-circle',
        capture: ''
    },
];
const socialGroup = [{
        liClass: 'footer-socials social-icon',
        aClass: 'footer-link twitter',
        icon: 'fab fa-twitter',
        capture: 'Twitter'
    },
    {
        liClass: 'footer-socials social-icon',
        aClass: 'footer-link facebook',
        icon: 'fab fa-facebook',
        capture: 'Facebook'
    },
    {
        liClass: 'footer-socials social-icon',
        aClass: 'footer-link instagram',
        icon: 'fab fa-instagram',
        capture: 'Instagram'
    },
    {
        liClass: 'footer-socials social-icon',
        aClass: 'footer-link google',
        icon: 'fab fa-google-plus',
        capture: 'Google'
    },
];

class App {
    cart = [];
    clearCart = document.querySelector(".clear-cart");
    cartItems = document.querySelector(".cart-items");
    sidebar = document.querySelector(".sidebar");
    constructor() {
        const toggleBtn = document.querySelector(".cart-toggle");
        const closeBtn = document.querySelector(".close-btn");


        toggleBtn.addEventListener('click', () => this.openCart());
        closeBtn.addEventListener('click', () => this.closeCart());
        this.navbarToggle();
        document.querySelector('footer div.footerIcon').firstElementChild.innerHTML = this.makeLiGroup(socialGroup, 'navbar-footer footer-socials social-icon', '<h6 class="text-dark text-muted">Social media</h6>');
        this.cart = Storage.getCart();
    }

    openCart() {
        document.querySelector('.overlay').classList.add('active');
        this.sidebar.classList.toggle("show-sidebar");
        this.cartItems.innerHTML = '';
        this.cart = Storage.getCart();
        this.populateCart(this.cart);
        // this.setItemTotal(this.cart);
        this.setCartTotal(this.cart);
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    closeCart() {
        this.sidebar.classList.remove("show-sidebar");
        document.querySelector('.overlay').classList.remove('active');
        this.cartItems.innerHTML = '';
        this.cart = Storage.getCart();
        this.populateCart(this.cart);
        this.setCartTotal(this.cart);
    }
    navbarToggle() {
        const navToggle = document.querySelector(".nav-toggle");
        const linksContainer = document.querySelector(".linkscont");
        const links = document.querySelector(".links-container");

        navToggle.addEventListener('click', function() {
            const linksHeight = links.getBoundingClientRect().height;
            const containerHeight = linksContainer.getBoundingClientRect().height;
            if (containerHeight === 0) {
                linksContainer.style.height = `${linksHeight}px`;
            } else {
                linksContainer.style.height = 0;
            }
        });
    }
    makeLiGroup = (group, ulClass, header = '') => {
        let lis = '';
        group.forEach(function(item) {
            lis += `<li class ="${item.liClass}">
        <a class = "${item.aClass}" href="#">
        <i class = "${item.icon}"></i>${item.capture}
        </a>
        </li>`;
        });
        return `
    ${header}
    <ul class ="${ulClass}">
    ${lis}
    </ul>`;
    }

    makeShowCase(newproduct) {
        if (!document.querySelector('.showcase')) {
            return;
        }
        let result = '';
        newproduct.forEach(item => {
            result += this.createProductMarkUp(item);
        });
        document.querySelector('.showcase').innerHTML = result;
    }
    createProductMarkUp(data) {
        return `
            <div  class="col-md-3 col-4 ">
               <div class="newproduct text-center" data-id="${data.id}">
                  <div class="position-relative mb-3">
                    <a href="detail.html" class="d-block">
                     <img src="${data.image}" alt="${data.name}" class="img-fluid w-100 product-img">
                    </a>
                     <div class="product-overlay">
                     ${this.makeLiGroup(overlayGroup,'mb-0 list-inline')}
                     </div>
                   </div>
                  <h3><a href="detail.html" class="reset-anchor product-name">${data.name}</a></h3>
                 <p class="small text-muted product-price" data-price=${data.price}>${data.price}</p>
                 </div>
            </div> `;
    }
    getProduct = (id) => Storage.getProducts().find(product => product.id === +(id));

    addToCart() {
        const addToCartButtons = [...document.querySelectorAll(".add-to-cart")];
        addToCartButtons.forEach(button => {
            button.addEventListener('click', event => {
                let product = this.getProduct(event.target.closest('.newproduct').getAttribute('data-id'));
                let exist = this.cart.some(elem => elem.id === product.id);
                if (exist) {
                    this.cart.forEach(elem => {
                        if (elem.id === product.id) {
                            elem.amount += 1;
                        }
                    })
                } else {
                    let cartItem = {...product, amount: 1 };
                    this.cart = [...this.cart, cartItem];
                }
                // this.addCartItem(cartItem);
                // this.setItemTotal(this.cart);
                this.setCartTotal(this.cart);
                Storage.saveCart(this.cart);
            });
        });
    }
    addCartItem(item) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.setAttribute('id', item.id);
        div.innerHTML = `
            <div class="picture product-img">
              <div class="product-name p-auto">${item.name}</div>
                    <img src="${item.image}" alt="${item.name}" class="img-fluid w-100">
               
                
                
                </div>
                <div class="quantity">
                    <div class="border d-flex justify-content-around mx-auto-cart">
                        <i class="fas fa-caret-left inc-dec-btn" data-id=${item.id}></i>
                        <span class="border-1 p-1 amount">${item.amount}</span>
                        <i class="fas fa-caret-right inc-dec-btn" data-id=${item.id}></i>
                    </div>
                </div>
                 
                <div class="price">
                    $<span class="product-price">${item.price}</span>
                </div>
                <div class="remove-btn text-right">
                    <a class="reset-anchor m-auto" href="#">
                        <i class="fas fa-trash-alt" data-id=${item.id}></i>
                    </a>
                </div>`;
        this.cartItems.appendChild(div);
    }
    filterItem = (cart, curentItem) => cart.filter(item => item.id !== +(curentItem.dataset.id));

    findItem = (cart, curentItem) => cart.find(item => item.id === +(curentItem.dataset.id));

    clear = () => {
        this.cart = [];
        while (this.cartItems.children.length > 0) {
            this.cartItems.removeChild(this.cartItems.children[0]);
        }
        // this.setItemTotal(this.cart);
        this.setCartTotal(this.cart);
        Storage.saveCart(this.cart);

    }

    // setItemTotal(cart) {

    //     document.querySelector('.product-price').textContent = parseFloat(cart.reduce((p, c) => p + c.amount * c.price, 0).toFixed(2));
    //     document.querySelector('.count-items').textContent = cart.reduce((prev, cur) => prev + cur.amount, 0);
    // }
    setCartTotal(cart) {

        document.querySelector('.cart-total').textContent = parseFloat(cart.reduce((p, c) => p + c.amount * c.price, 0).toFixed(2));
        document.querySelector('.count-items').textContent = cart.reduce((prev, cur) => prev + cur.amount, 0);
    }

    renderCart() {

        this.clearCart.addEventListener('click', () => this.clear());
        this.cartItems.addEventListener('click', event => {
            if (event.target.classList.contains('fa-trash-alt')) {
                this.cart = this.filterItem(this.cart, event.target);
                // this.setItemTotal(this.cart);
                this.setCartTotal(this.cart);
                Storage.saveCart(this.cart);
                this.cartItems.removeChild(event.target.parentElement.parentElement.parentElement);
            } else if (event.target.classList.contains('fa-caret-right')) {
                console.log(event.target.classList.contains('fa-caret-right'));
                let tempItem = this.findItem(this.cart, event.target);
                // this.setItemTotal(this.cart);
                this.setCartTotal(this.cart);
                Storage.saveCart(this.cart);
                tempItem.amount = tempItem.amount + 1;
                // tempItem.price = tempItem.price + 1;

                event.target.previousElementSibling.innerHTML = tempItem.amount;
                // event.target.nextElementSibling.innerHTML = tempItem.price;
                // this.setItemTotal(this.cart);
                this.setCartTotal(this.cart);
                Storage.saveCart(this.cart);
            } else if (event.target.classList.contains('fa-caret-left')) {
                let tempItem = this.findItem(this.cart, event.target);
                tempItem.amount = tempItem.amount - 1;
                // tempItem.price = tempItem.price - 1;
                if (tempItem.amount > 0) {

                    event.target.nextElementSibling.innerHTML = tempItem.amount;
                    // event.target.previousElementSibling.innerHTML = tempItem.price;
                } else {
                    this.cart = this.filterItem(this.cart, event.target);
                    this.cartItems.removeChild(event.target.parentElement.parentElement.parentElement);
                };
                // this.setItemTotal(this.cart);
                this.setCartTotal(this.cart);
                Storage.saveCart(this.cart);
            };
        });
    }

    renderCategory() {
        const categories = document.querySelector('.categories');
        if (categories) {
            categories.addEventListener('click', event => {
                event.preventDefault();
                const target = event.target;
                if (target.classList.contains('category-item')) {
                    const category = target.dataset.category;
                    // console.log(category);
                    const categoryFilter = items => items.filter(item => item.category.includes(category));
                    //   console.log(categoryFilter);
                    this.makeShowCase(categoryFilter(Storage.getProducts()));

                } else {
                    this.makeShowCase(Storage.getProducts());
                }
                this.addToCart();
                this.renderCart();
            });
        }
    }

}

function footerSocials(className, url, icon, capture = '') {
    return `
          <li><a class="footer-link ${className}" href="${url}" target="_blank"><i
          class="fab ${icon}"></i> ${capture}</a></li>`
}

function footerService(url, capture = '') {
    return `
       <li><a class="footer-link" href="${url}">${capture} </a></li>`
}

function footerContact(className, url, icon, capture = '') {
    return `
       <li><a class="footer-link ${className}" href="${url}"><i class=" ${icon}"></i>${capture}</a></li>
       `
}

function navbarNav(className, url, icon, capture = '') {
    return `
   <li class="nav-item active ${className}"><a href="${url}" class="nav-link scroll-link" target="_blank"><i
   class="fas ${icon}"></i>${capture}</a></li>`
}



(function() {
    const url = 'https://my-json-server.typicode.com/SvetaSvitlychna/dbsecond/data';
    fetch(url)
        .then(response => {
            response.json()
                .then(newproduct => {
                    const app = new App();
                    let data = new Product();
                    Storage.saveProduct(data.getProducts(newproduct));
                    console.log(data.getProducts(newproduct))
                    app.makeShowCase(newproduct);
                    app.addToCart();
                    app.renderCart();
                    app.renderCategory();
                })
        })
        .catch(err => {
            console.log(err);
        })

    document.querySelector('.navbar-nav').innerHTML =
        `${navbarNav('', 'index.html', 'fa-home', 'Home')}
${navbarNav('','aboutUs.html','fa-book-open', 'About' )}
${navbarNav('','catalog.html', 'fa-blog','Catalog')}
${navbarNav('','SignUp.html', 'fa-address-card','Sign up')}`;


    document.querySelector('.footer-service').innerHTML =
        `${footerService('#','Help')}
${footerService('#','FAQs')}
${footerService('#','Returns')}
${footerService('#','Refund')}
${footerService('#','Delivery')}`;

    document.querySelector('.footer-contact').innerHTML =
        `${footerContact('message','contactUS.html','fas fa-comment-dots','Leave a message')}
${footerContact('email','','fas fa-envelope','test@test.com')}
${footerContact('phone','','fas fa-phone','+38 000 000 00 00')}
${footerContact('viber','','fab fa-viber', '+38 000 111 11 11')}
${footerContact('telegram','','fab fa-telegram', '+38 000 111 11 11')}`;

})();