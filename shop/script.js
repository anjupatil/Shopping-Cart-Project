const produtc = {
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  price: 109.95,
  description:
    "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  rating: { rate: 3.9, count: 120 },
};

var login=sessionStorage.getItem("loggedIn")
console.log(login)
if(login==="true"){

}
else{


  
  window.location.href="../login.html"
}

// Get reference to the product container element
let productContainer = document.getElementById('product-container');


// 
// Function to generate random colors
function getRandomColors() {
  const colors = ["red", "blue", "black", "green", "yellow", "white"];
  const randomColors = [];
  const numOfColors = Math.floor(Math.random() * 3) + 1; // Generate a random number between 1 and 3

  for (let i = 0; i < numOfColors; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    randomColors.push(randomColor);
  }

  return randomColors;
}

// Function to generate random sizes
function getRandomSizes() {
  const sizes = ["s", "l", "m", "xl", "xxl"];
  const randomSizes = [];
  const numOfSizes = Math.floor(Math.random() * 3) + 1; // Generate a random number between 1 and 3

  for (let i = 0; i < numOfSizes; i++) {
    const randomIndex = Math.floor(Math.random() * sizes.length);
    const randomSize = sizes[randomIndex];
    randomSizes.push(randomSize);
  }

  return randomSizes;
}


function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}



// Function to display message when no products are found
function displayNotFoundMessage() {
  const productsDiv = document.getElementById('product-container');
  productsDiv.innerHTML = '<p>No products found</p>';
}







// 








// Fetch products from the API
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(products => {

     // Add random colors and sizes to each product object
     products.forEach((product) => {
      product["Colors"] = getRandomColors();
      product["Sizes"] = getRandomSizes();
      product["id"]=generateId();
    });

    // Do something with the updated products array
    console.log(products);
    // Save products to local storage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Display products on the page
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('item');

      // Create dropdown menu for size options
      let sizeOptions = '';
      product.Sizes.forEach(size => {
        sizeOptions += `<option value="${size}">${size}</option>`;
      });

      
      
      productElement.innerHTML = `

      <img src="${product.image}" alt="${product.title}" />
      <h4>${product.title}</h4>
      <div class="info">
        <div class="row">
          <div class="price">Price:$${product.price}</div>
          
          <div class="size">
          <p>
          <label for="size-select">Size:</label>
          <select id="size-select" name="size">
            ${sizeOptions}
          </select>

          </p>
        </div>

        </div>
        <div class="colors">
          Colors:
          <div class="row">
            <div class="circle"  id="${product.Colors[0]}" style="background-color:${product.Colors[0]} "></div>
            <div class="circle"  id="${product.Colors[1]}" style="background-color:${product.Colors[1]}"></div>
            <div class="circle"  id="${product.Colors[2]}" style="background-color:${product.Colors[2]}"></div>
          </div>
        </div>
        <div class="row">Rating:${product.rating.rate}</div>
        
      </div>
      <button  img="${product.image}" name="${product.title}" prodid="${product.id}" price="${product.price}" size="${product.Sizes}" colors="${product.Colors}" rate="${product.rating.rate}"  class="add-to-cart" id="addBtn">Add to Cart</button>
       
      `;
      const addToCartBtn = productElement.querySelector('.add-to-cart');
      addToCartBtn.addEventListener('click', () => {
        // Get product ID from "prodid" attribute
        const productImage=addToCartBtn.getAttribute("img");
        const productId = addToCartBtn.getAttribute('prodid');
        const productName=addToCartBtn.getAttribute('name');
        const productPrice=addToCartBtn.getAttribute('price');
        // const productSize=addToCartBtn.getAttribute('size');
        // const productColor=addToCartBtn.getAttribute('colors');
        const sizeSelectElement = productElement.querySelector('#size-select');
        const productSize = sizeSelectElement.value;

        const colorCircles = productElement.querySelectorAll('.circle');
        // Initialize selectedColor variable with first color in array
        let selectedColor = product.Colors[0];

        // Add click event listeners to color circles
        colorCircles.forEach(circle => {
          circle.addEventListener('click', () => {
            // Remove "selected" class from all circles
            colorCircles.forEach(circle => circle.classList.remove('selected'));
            // Add "selected" class to clicked circle
            circle.classList.add('selected');
            // Update selectedColor variable with ID of clicked circle
            selectedColor = circle.id;
          });
        });

        // Use selectedColor variable to set productColor value when "Add to Cart" button is clicked
        const productColor = product.Colors.includes(selectedColor) ? selectedColor : product.Colors[0];


        const productRate=addToCartBtn.getAttribute('rate');
        

        // Add product to cart in local storage
        addToCart(productImage,productId,productName,productPrice,productSize,productColor,productRate);
      });
      productContainer.appendChild(productElement);
    });
  })
  .catch(error => console.error(error));
  
  




 // addToCart(productImage,productId,productName,productPrice,productSize,productColor,productRate);
  // cart
  function addToCart(productImage,productId,productName,productPrice,productSize,productColor,productRate) {
    const userEmail = localStorage.getItem('currentUser');

    // Get the existing cart data from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if the product is already in the cart
    let productInCart = cart.find(item => item.id === productId);
  
    if (productInCart) {
      // If the product is already in the cart, increase the quantity
      productInCart.quantity += 1;
    } else {
      // If the product is not in the cart, add it with a quantity of 1
      cart.push({
        userEmail: userEmail,
        image: productImage,
        id: productId,
        name: productName,
        price: productPrice,
        size: productSize,
        color: productColor,
        rate: productRate,
        quantity: 1
      });
    }
  
    // Save the updated cart data back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    
    // Display a success message to the user
    let addtocartmsg=document.getElementById("addcartmsg")
      
    addtocartmsg.textContent="Item added to cart!";
    setTimeout(()=>{
      addtocartmsg.textContent="";

    },2000)
  }
  



  // search

  let search=document.getElementById("search-input");
  search.addEventListener("input",(e)=>{
    console.log("search")
    console.log(search.value.trim())
    
    
    const products = JSON.parse(localStorage.getItem('products'));
    console.log(products);
    let searchQ=search.value.trim().toLowerCase();
    // filter
      const filteredProducts=products.filter(product=>
        product.title.toLowerCase().includes(searchQ)||
        product.description.toLowerCase().includes(searchQ) ||
        product.category.toLowerCase().includes(searchQ)
        );
        console.log(filteredProducts);

        if (filteredProducts.length === 0) {
          displayNotFoundMessage();
        } else {
          displayProducts(filteredProducts);
          attachAddToCartListeners();
        }

        

    // fetch('https://fakestoreapi.com/products')
    // .then(response=>response.json())
    // .then(products=>{
    //   let searchQ=search.value.trim().toLowerCase();
    //   //filter
    //   const filteredProducts=products.filter(product=>
    //     product.title.toLowerCase().includes(searchQ)||
    //     product.description.toLowerCase().includes(searchQ) ||
    //     product.category.toLowerCase().includes(searchQ)
    //     );
    //     console.log(filteredProducts)
    //     displayProducts(filteredProducts);
    // })
    // .catch(error=>console.error(error))


    
    
  })


  function displayProducts(filteredproducts){
    productContainer.innerHTML='';
    filteredproducts.forEach(product=>{
      const productElement=document.createElement('div');
      console.log(product.Colors)
    console.log(product.Sizes)
      productElement.classList.add('item');
      // Create dropdown menu for size options
      let sizeOptions = '';
      product.Sizes.forEach(size => {
        sizeOptions += `<option value="${size}">${size}</option>`;
      });
      productElement.innerHTML = `

    <img src="${product.image}" alt="${product.title}" />
    <h4>${product.title}</h4>
    <div class="info">
      <div class="row">
        <div class="price">Price:$${product.price}</div>
        <div class="size">
          <p>
          <label for="size-select">Size:</label>
          <select id="size-select" name="size">
            ${sizeOptions}
          </select>

          </p>
        </div>
      </div>
      <div class="colors">
        Colors:
        <div class="row">
          <div class="circle" style="background-color:${product.Colors[0]} "></div>
          <div class="circle" style="background-color:${product.Colors[1]}"></div>
          <div class="circle" style="background-color:${product.Colors[2]}"></div>
        </div>
      </div>
     
      <div class="row">Rating:${product.rating.rate}</div>
    </div>
    <button  img="${product.image}" name="${product.title}" prodid="${product.id}" price="${product.price}" size="${product.Sizes}" colors="${product.Colors}" rate="${product.rating.rate}"  class="add-to-cart" id="addBtn">Add to Cart</button>
    `;
    
    const addToCartBtn = productElement.querySelector('.add-to-cart');
      addToCartBtn.addEventListener('click', () => {
        // Get product ID from "prodid" attribute
        const productImage=addToCartBtn.getAttribute("img");
        const productId = addToCartBtn.getAttribute('prodid');
        const productName=addToCartBtn.getAttribute('name');
        const productPrice=addToCartBtn.getAttribute('price');
        // const productSize=addToCartBtn.getAttribute('size');
        // const productColor=addToCartBtn.getAttribute('colors');
        const sizeSelectElement = productElement.querySelector('#size-select');
        const productSize = sizeSelectElement.value;

        const colorCircles = productElement.querySelectorAll('.circle');
        // Initialize selectedColor variable with first color in array
        let selectedColor = product.Colors[0];

        // Add click event listeners to color circles
        colorCircles.forEach(circle => {
          circle.addEventListener('click', () => {
            // Remove "selected" class from all circles
            colorCircles.forEach(circle => circle.classList.remove('selected'));
            // Add "selected" class to clicked circle
            circle.classList.add('selected');
            // Update selectedColor variable with ID of clicked circle
            selectedColor = circle.id;
          });
        });

        // Use selectedColor variable to set productColor value when "Add to Cart" button is clicked
        const productColor = product.Colors.includes(selectedColor) ? selectedColor : product.Colors[0];






        const productRate=addToCartBtn.getAttribute('rate');
        

        // Add product to cart in local storage
        addToCart(productImage,productId,productName,productPrice,productSize,productColor,productRate);
      });

    
    productContainer.appendChild(productElement);

    })
  }



  // new



let isFilterActive = false; // Variable to track the filter state
let activeFilter = null; // Variable to track the active filter

const applyFilter = (filterElement, searchQuery) => {
  const products = JSON.parse(localStorage.getItem('products'));
  
  if (isFilterActive && activeFilter !== filterElement) {
    activeFilter.classList.remove('active'); // Remove active class from previous active filter
  }

  if (activeFilter === filterElement) {
    // Remove the active filter
    filteredProducts = products;
    isFilterActive = false;
    activeFilter = null;
    filterElement.classList.remove('active'); // Remove active class from clicked filter
  } else {
    filterElement.classList.add('active'); // Add active class to clicked filter

    // Filter the products
    filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
    );

    isFilterActive = true;
    activeFilter = filterElement;
  }

  if (filteredProducts.length === 0) {
    displayNotFoundMessage();
  } else {
    displayProducts(filteredProducts);
    attachAddToCartListeners();
  }
};

// Add click event listeners to the filters
let all = document.getElementById("all");
all.addEventListener("click", () => {
  applyFilter(all, "");
});

let mens = document.getElementById("mens");
mens.addEventListener("click", () => {
  applyFilter(mens, "mens");
});

let women = document.getElementById("womens");
women.addEventListener("click", () => {
  applyFilter(women, "women");
});

let jewellery = document.getElementById("jewellery");
jewellery.addEventListener("click", () => {
  applyFilter(jewellery, "jewel");
});

let electronics = document.getElementById("electronics");
electronics.addEventListener("click", () => {
  applyFilter(electronics, "electronics");
});





 




//new color filter

let red = document.getElementById("red");

red.addEventListener("change", (e) => {
  applyColorFilter("red", e.target.checked);
  if (e.target.checked) {
    clearOtherColorFilters(red);
  }
});

let blue = document.getElementById("blue");

blue.addEventListener("change", (e) => {
  applyColorFilter("blue", e.target.checked);
  if (e.target.checked) {
    clearOtherColorFilters(blue);
  }
});

let green = document.getElementById("green");

green.addEventListener("change", (e) => {
  applyColorFilter("green", e.target.checked);
  if (e.target.checked) {
    clearOtherColorFilters(green);
  }
});

let black = document.getElementById("black");

black.addEventListener("change", (e) => {
  applyColorFilter("black", e.target.checked);
  if (e.target.checked) {
    clearOtherColorFilters(black);
  }
});

let white = document.getElementById("white");

white.addEventListener("change", (e) => {
  applyColorFilter("white", e.target.checked);
  if (e.target.checked) {
    clearOtherColorFilters(white);
  }
});

function applyColorFilter(color, isChecked) {
  const products = JSON.parse(localStorage.getItem("products"));
  const filteredProducts = products.filter((product) => {
    const colors = Array.isArray(product.Colors) ? product.Colors : [product.Colors];
    return isChecked ? colors.includes(color) : true;
  });

  if (filteredProducts.length === 0) {
    displayNotFoundMessage();
  } else {
    displayProducts(filteredProducts);
    attachAddToCartListeners();
  }

  
}



function clearOtherColorFilters(currentFilter) {
  const colorFilters = [red, blue, green, black, white];
  colorFilters.forEach((filter) => {
    if (filter !== currentFilter) {
      filter.checked = false;
    }
  });
}



// new color filter ends

// ------//

//new  Size filter
let small = document.getElementById("s");
let medium = document.getElementById("m");
let large = document.getElementById("l");
let xlarge = document.getElementById("xl");

small.addEventListener("change", (e) => {
  applySizeFilter("s", e.target.checked);
  if (e.target.checked) {
    clearOtherSizeFilters(small);
  }
});

medium.addEventListener("change", (e) => {
  applySizeFilter("m", e.target.checked);
  if (e.target.checked) {
    clearOtherSizeFilters(medium);
  }
});

large.addEventListener("change", (e) => {
  applySizeFilter("l", e.target.checked);
  if (e.target.checked) {
    clearOtherSizeFilters(large);
  }
});

xlarge.addEventListener("change", (e) => {
  applySizeFilter("xl", e.target.checked);
  if (e.target.checked) {
    clearOtherSizeFilters(xlarge);
  }
});

function applySizeFilter(size, isChecked) {
  const products = JSON.parse(localStorage.getItem("products"));
  const filteredProducts = products.filter((product) => {
    const sizes = Array.isArray(product.Sizes) ? product.Sizes : [product.Sizes];
    return isChecked ? sizes.includes(size) : true;
  });

  if (filteredProducts.length === 0) {
    displayNotFoundMessage();
  } else {
    displayProducts(filteredProducts);
    attachAddToCartListeners();
  }
}

function clearOtherSizeFilters(currentFilter) {
  const sizeFilters = [small, medium, large, xlarge];
  sizeFilters.forEach((filter) => {
    if (filter !== currentFilter) {
      filter.checked = false;
    }
  });
}

// Rating filter
const rangeInput = document.getElementById("range");

rangeInput.addEventListener("input", (e) => {
  const rating = e.target.value;
  const products = JSON.parse(localStorage.getItem("products"));

  // Filter products based on selected rating
  const filteredProducts = products.filter((product) => product.rating.rate >= rating);

  if (filteredProducts.length === 0) {
    displayNotFoundMessage();
  } else {
    displayProducts(filteredProducts);
    attachAddToCartListeners();
  }
});




// let priceRangeInputs = document.querySelectorAll('input[name="prange"]');
// priceRangeInputs.forEach((input) => {
//   input.addEventListener("change", () => {
//     const products = JSON.parse(localStorage.getItem("products"));
//     const checkedInputs = Array.from(priceRangeInputs).filter((input) => input.checked);

//     let filteredProducts = [];

//     if (checkedInputs.length) {
//       const prices = checkedInputs.map((input) => input.id.split("-"));
//       filteredProducts = products.filter((product) => {
//         const productPrice = parseFloat(product.price);
//         for (const [minPrice, maxPrice] of prices) {
//           if (productPrice >= parseFloat(minPrice) && productPrice <= parseFloat(maxPrice)) {
//             return true;
//           }
//         }
//         return false;
//       });
//     } else {
//       filteredProducts = products;
//     }

//     if (filteredProducts.length === 0) {
//       displayNotFoundMessage();
//     } else {
//       displayProducts(filteredProducts);
//       attachAddToCartListeners();
//     }

//     // Clear other price range filters
//     clearOtherPriceRangeFilters(input);
//   });
// });

// function clearOtherPriceRangeFilters(currentFilter) {
//   priceRangeInputs.forEach((filter) => {
//     if (filter !== currentFilter) {
//       filter.checked = false;
//     }
//   });
// }
let priceRangeInputs = document.querySelectorAll('input[name="prange"]');
let previousCheckedInput = null;

priceRangeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (previousCheckedInput && previousCheckedInput !== input) {
      previousCheckedInput.checked = false;
    }

    const products = JSON.parse(localStorage.getItem("products"));
    const checkedInput = Array.from(priceRangeInputs).find((input) => input.checked);

    let filteredProducts = [];

    if (checkedInput) {
      const priceRange = checkedInput.id.split("-");
      filteredProducts = products.filter((product) => {
        const productPrice = parseFloat(product.price);
        const minPrice = parseFloat(priceRange[0]);
        const maxPrice = parseFloat(priceRange[1]);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    } else {
      filteredProducts = products;
    }

    if (filteredProducts.length === 0) {
      displayNotFoundMessage();
    } else {
      displayProducts(filteredProducts);
      attachAddToCartListeners();
    }

    previousCheckedInput = input;
  });
});



function attachAddToCartListeners(){
  var addToCartBtns = document.querySelectorAll(".add-to-cart");
  
  // Loop through all the buttons and attach an event listener to each one
  addToCartBtns.forEach(function(addToCartBtn) {
    addToCartBtn.addEventListener("click", function(event) {
      // Get the product ID from the "prodid" attribute of the clicked button
      var productId = event.target.getAttribute("prodid");
  
      // Retrieve the cart from local storage
      var cart = JSON.parse(localStorage.getItem("cart")) || {};
  
      // Add the product to the cart
      if (cart[productId]) {
        cart[productId]++;
      } else {
        cart[productId] = 1;
      }
  
      // Store the updated cart in local storage
      localStorage.setItem("cart", JSON.stringify(cart));
  
      // Display a success message to the user
      let addtocartmsg=document.getElementById("addcartmsg")

      
      
      addtocartmsg.textContent="Item added to cart!";
      setTimeout(()=>{
        addtocartmsg.textContent="";
        

      },2000)
    });
  });

}


//  ADD TO CART

// Get all the "add to cart" buttons





