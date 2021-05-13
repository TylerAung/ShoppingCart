/*
File is called index.js
? Normally we associate showing a list of diff things with an index action
? So whenever we show a list of files img, comments, blog post, products. Whatever it is, usually referred as index

%   <a href="/admin/products/${product.id}/edit"> //# ${product.id} seed ID route on edit btn click
*/
const layout = require('../layout')
module.exports =({ products }) => {
    //? Returns an array of HTML snippets
    const renderedProducts = products.map((product)=>{ //Function is invoke on every element in array 
        // console.log(`Rendered Prod Ele${product}`);
        return`
        <tr>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
        <a href="/admin/products/${product.id}/edit">
            <button class="button is-link">
              Edit
            </button>
          </a>
        </td>
        <td>
          <form method="POST" action="/admin/products/${product.id}/delete">
          <button class="button is-danger">Delete</button>
          <form>
        </td>
      </tr>
        `;
    }).join(''); //++ adds on current data to renderedProducts arr
    // console.log(renderedProducts);
    //? Array is join tgt with layout and shown
    return layout({
        content:`
        <div class="control">
        <h1 class="subtitle">Products</h1>  
        <a href="/admin/products/new" class="button is-primary">New Product</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${renderedProducts}
        </tbody>
      </table>
        `
    })};
    