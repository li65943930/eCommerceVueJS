<template>
    <div class="about mx-auto">
        <b-card class="shadow p-4 mt-3">
            <h1>About Socket</h1>
            <hr>
            <p class="mt-4"><strong>Socket</strong> is the final assignment of the Web Technologies Course that consists of four assignments.</p>
            <p>This project is a fully working shopping website with VueJs that can communicate with different server side technologies and databases built in the other three assignments.</p>
            <p>The shopping website provides the following features:</p>
            <ol>
                <li><span>A page that displays products, products' images and descriptions, which may be purchased in various quantities.</span></li>
                <li><span>A product details page that shows more information about a specific product and allows the user to select a quantity for purchase.</span></li>
                <li><span>Authorized users, such as Admins, have extra features of creating a new product and updating or deleting an existing product from the store's inventory.</span></li>
                <li><span>A shopping cart that shows selected items and their quantities of each user.</span></li>
                <li><span>Users can update the cart by changing products' quantities or removing items from the cart.</span></li>
                <li><span>At the discretion of the user, any user can create new account or modify current account details, such as user name, email, shipping address, and password.</span></li>
                <li><span>Users are still able to purchase anonymously from our online store without the need to create an account (guest checkout).</span></li>
                <li><span>Users can rate and add a review/comment about any product they have purchased with their account information. While guest users can ONLY display other users' comments.</span></li>
                <li><span>In addition, users optionally can upload images as well as part of their product review.</span></li>
                <li><span>A login element on every page that shows the user a login dialog for switching from anonymous shopping. The element should optionally switch to showing the user's name when logged in.</span></li>
                <li><span>Our project keep track of cart items' sessions in two ways: for guest users, cart items are available as long as the session is active. For logged in users (users with accounts), the cart items are available as long as the user is logged and the session is active (including if they sign out and then sign in, these details will be retrieved as long as the session is alive).</span></li>
            </ol>
        </b-card>
    </div>
</template>

<script>
export default {
    name: "About"
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

.about {
    max-width: 50rem;
}

h1, h2 {
    text-align: center;
}

p, li {
    line-height: 30px;
    font-family: 'Roboto', sans-serif;
    text-justify: auto;
    text-align: justify;
    text-justify: inter-word;
}

li {
    font-weight: bold;
}

li span {
    font-weight: normal;
}

</style>