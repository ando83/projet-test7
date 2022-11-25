import React from 'react';
import Header from '../../components/Header';

const Login = () => {
    return (
      <div className="login-page">
        <Header />
        <div className="login-container">

          <h1>Connexion</h1>
          <form onSubmit={() => {}}>
           <div className="element-form1">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" />
           </div>

           <div className="element-form1">
            <label htmlFor="password">Mot de passe</label>
            <input type="text" name="password" />
           </div>

           <div className="element-form1">
            <button type="button" onClick= {() => {}}>Se connecter</button>
           </div> 
           
           <div className="button-register">
            <p> Vous n'êtes pas encore inscrit ?</p> 
            <span>Rejoignez-nous</span>
           </div> 

          </form>

        </div>  
      </div>  
    );

};

export default Login;
