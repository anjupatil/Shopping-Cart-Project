let signupbtn=document.getElementById("signup");
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');


signupbtn.addEventListener("click",(event)=>{
    event.preventDefault();
    console.log("btn is clicked")
    const form=document.getElementById("formelements");
    console.log(form);

    // Get user input
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmpassword').value;
//   console.log(firstname,lastname,email,password)


   // Validate user input
  if (!firstname || !lastname || !email || !password) {
    errorMessage.textContent = 'Please enter all fields.';
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = 'Passwords do not match.';
    return;
  }
  

   // Check if user already exists
   const users = JSON.parse(localStorage.getItem('users')) || {};
   if (users[email]) {
    errorMessage.textContent = 'User already exists.';
     return;
   }


   // Create user object and save to local storage
  const user = { firstname,lastname, email, password };
  users[email] = user;
  localStorage.setItem('users', JSON.stringify(users));

  // Show success message and reset the form
  errorMessage.textContent = 'Successfully signed up!';
  form.reset();


})
