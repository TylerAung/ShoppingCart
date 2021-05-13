const layout = require("../layout"); //++ Require layout template in upper directory
const {getError} = require ("../../helpers");

//? Use obj instead of individual arg, to avoid confusion of too many arg to take note off
module.exports = ({req, err}) => {
    return layout({
        content: `
          <div class="container">
            <div class="columns is-centered">
              <div class="column is-one-quarter">
                <form method="POST">
                  <h1 class="title">Sign Up</h1>
                  <div class="field">
                    <label class="label">Email</label>
                    <input required class="input" placeholder="Email" name="email" />
                    <p class="help is-danger">${getError(err, 'email')}</p>
                  </div>
                  <div class="field">
                    <label class="label">Password</label>
                    <input required class="input" placeholder="Password" name="password" type="password" />
                    <p class="help is-danger">${getError(err, 'password')}</p>
                  </div>
                  <div class="field">
                    <label class="label">Password Confirmation</label>
                    <input required class="input" placeholder="Password Confirmation" name="passwordConfirmation" type="password" />
                    <p class="help is-danger">${getError(err,'passwordConfirmation')}</p>
                  </div>
                  <button class="button is-primary">Submit</button>
                </form>
                <a href="/signin">Have an account? Sign In</a>
              </div>
            </div>
          </div>
        `
      });//? passes content as property to layout.js
};
//! Wrap as a function so it can be called in route through function call

/* > *, error with req user using template*/