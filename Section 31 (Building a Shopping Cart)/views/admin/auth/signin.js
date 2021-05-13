// const { requirePassword } = require("../../../routes/admin/validators");
const layout = require("../layout"); //++ Require layout template in upper directory
const {getError} = require ("../../helpers");

module.exports = ({req, err}) => {
    return layout({
        content: `
          <div class="container">
            <div class="columns is-centered">
              <div class="column is-one-quarter">
                <form method="POST">
                  <h1 class="title">Sign in</h1>
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
                  <button class="button is-primary">Submit</button>
                </form>
                <a href="/signup">Need an account? Sign Up</a>
              </div>
            </div>
          </div>
        `
      });//? passes content as property to layout.js
};