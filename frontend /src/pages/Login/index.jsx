import { useRef } from 'react';
import React from 'react';
import Header from '../../components/Header';

const Login = () => {
  const inputEmail = useRef();
  const inputPassword = useRef();
  //Lors de l'actualisation les données restent
  const onSubmitLogin = (event) =>{
   event.preventDefault()
  
  //Stockée la valeur d'un champ saisie du formulaire 
  const valueEmail = inputEmail.current.value;
  const valuePassword = inputPassword.current.value;

  console.log(valueEmail);
  console.log(valuePassword);

  //console.log(inputEmail);
  //console.log(inputPassword);

  // Remise à zéro du formulaire
  inputEmail.current.value = "";
  inputPassword.current.value = "";

  }
    return (
      <div className="login-page">
        <Header />
        <div className="login-container">

          <h1>Connexion</h1>
          <form onSubmit={onSubmitLogin}>
           <div className="element-form1">
            <label htmlFor="email">Email</label>
            <input type="text" placeholder="Votre E-mail" name="email" ref={inputEmail} />
           </div>

           <div className="element-form1">
            <label htmlFor="password">Mot de passe</label>
            <input type="text" placeholder="Votre Mot de passe" name="password" ref={inputPassword} />
           </div>

           <div className="element-form1">
            <button type={"submit"} onClick= {() => {}}>Se connecter</button>
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
