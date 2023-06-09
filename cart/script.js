var login=sessionStorage.getItem("loggedIn")
console.log(login)
if(login==="true"){
  document.body.style.display = "block"; // Show the page content
}
else{


  
  window.location.href="../logout.html"
}


const currentUserEmail = localStorage.getItem('currentUser');


// Get the cart items container element
const cartItemsContainer = document.getElementById('cart-items');

// Retrieve the cart data from local storage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// filter
const Cart = cart.filter((item) => item.userEmail === currentUserEmail);

// Initialize the total cart count and price
let cartCount = 0;
let cartPrice = 0;

// Loop through the cart items and create HTML elements for them
Cart.forEach((item) => {
  // Create a new cart item row element
  const cartItemRowElement = document.createElement('tr');
  cartItemRowElement.classList.add('cart-item-row');
  cartItemRowElement.innerHTML = `
    <td class="cart-item">
      <img src="${item.image}" height="200px" width="200px" alt="${item.name}" />
      <div class="details">
        <h4>${item.name}</h4>
        <div>Size: ${item.size}</div>
        <div class="onerow">Color:
        <div class="circle" style="background-color:${item.color}">
        </div>
        </div>
        
      </div>
    </td>  
    <td class="cart-price">$${item.price}</td>
    <td class="cart-quantity">${item.quantity}</td>
    <td class="cart-subtotal">$${item.price * item.quantity}</td>
    <td class="cart-delete"><button id="${item.id}" class="delete-btn">Delete</button></td>
    <td class="cart-add"><button id="${item.id}" class="add-btn">Add</button></td>
  `;

  // Append the cart item row element to the cart items container
  cartItemsContainer.appendChild(cartItemRowElement);

  // Update the total cart count and price
  cartCount += item.quantity;
  cartPrice += item.price * item.quantity;
  
  // Add an event listener to the delete button to handle the delete action
  const deleteButton = cartItemRowElement.querySelector('.delete-btn');
  deleteButton.addEventListener('click', (e) => handleDelete(e));

   // Add an event listener to the add button to handle the delete action
   const addButton = cartItemRowElement.querySelector('.add-btn');
   addButton.addEventListener('click', (e) => handleAdd(e));

});

// Update the total cart count and price on the cart page
document.getElementById('cart-total').textContent = `$${cartPrice}`;
document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

function handleCheckout() {
  // Create a new Razorpay checkout instance
  const messageContainer = document.getElementById('message-container');

  const conversionRate = 75; // Conversion rate from dollars to rupees

  


// Calculate the cart price in rupees
const cartPriceInRupees = cartPrice * conversionRate;

  const options = {
    key: 'rzp_test_PV1oQ0oMtgXOsq',
    amount: cartPriceInRupees * 100,
    currency: 'INR',
    name: 'Shopping Cart',
    description: 'Payment for items in cart',
    image: 'https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg',
    handler: function(response) {
      messageContainer.textContent=`Payment successful! Your transaction ID is  ${response.razorpay_payment_id}`;
     // alert('Payment successful! Your transaction ID is ' + response.razorpay_payment_id);
      // Clear the cart and redirect to the home page after successful payment
      localStorage.removeItem('cart');
      setTimeout(()=>{

        window.location.href = '../shop/index.html';
      },2000)
    }
   
    ,
    prefill: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+919876543210'
    },
    notes: {
      address: '123 Main St, Bangalore'
    },
    theme: {
      color: '#F37254'
    },
    

  };
  const rzp = new Razorpay(options);
  rzp.on('payment.failed', function (response) {
    messageContainer.textContent = `Payment failed with error: ${response.error.description}`;
    rzp.close();
  });

  

  // Open the checkout popup
  rzp.open();

  rzp.on('payment.failed', function (response){
    messageContainer.textContent=`Payment failed with error: ${response.error.description}`;
    messageContainer.style.color = 'red';
    setTimeout(() => {
      rzp.close();
    }, 2000);
  });
  
  

 





}


function handleDelete(event) {
  // Get the index of the cart item to be deleted


 let currentUser = localStorage.getItem('currentUser');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Filter the cart array to only include items associated with the current user
let filteredCart = cart.filter(item => item.userEmail === currentUser);
console.log(filteredCart)
// Get the index of the item to be deleted
const itemId = event.target.id;

// Find the index of the item to be deleted in the filtered cart
const index = filteredCart.findIndex(item => item.id === itemId);


if (index !== -1) {
  // Get the item from the cart
  const item = filteredCart[index];

  // If the quantity of the item is greater than 1, reduce the quantity by 1
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    // Otherwise, remove the entire item from the cart
    filteredCart.splice(index, 1);
  }


// Update the cart in local storage with the filtered cart
localStorage.setItem('cart', JSON.stringify(filteredCart));

// Reload the page to reflect the updated cart
location.reload();

}
}

function handleAdd(event) {
  console.log("add clicked")
  let currentUser = localStorage.getItem('currentUser');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Filter the cart array to only include items associated with the current user
  let filteredCart = cart.filter(item => item.userEmail === currentUser);
  console.log(filteredCart)
  // Get the index of the item to be deleted
  const itemId = event.target.id;
  
  // Find the index of the item to be deleted in the filtered cart
  const index = filteredCart.findIndex(item => item.id === itemId);

  if (index!==-1) {
    // Get the item from the cart
    const item = filteredCart[index];
    // Increase the quantity by 1
    item.quantity++;
  }

  // Save the updated cart to local storage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Reload the page to reflect the updated cart
  location.reload();
}





