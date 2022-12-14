/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import './sass/main.scss';
import {useMoralis} from 'react-moralis';

const Login = () => {
  const {authenticate, isAuthenticated, user} = useMoralis();
  document.title = 'Login';
  const login = async () => {
    if (!isAuthenticated) {
      await authenticate()
        .then(function (user) {
          console.log(user.get('ethAddress'));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(user);
    }
  };

  //Axios Config
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  };

  //State of Wallet for Logging in
  const [wallet, setWallet] = useState({});

  useEffect(() => {
    setTimeout(() => {
      login();
      const ConnectWallet = () => {
        if (window.ethereum) {
          window.ethereum
            .request({method: 'eth_requestAccounts'})
            .then((res) => accountChangeHandler(res[0]));
          console.log(wallet);
        } else {
          toast.error('install metamask extension!!', {
            toastId: 127 + 7,
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      };
      const accountChangeHandler = (account) => {
        // Setting
        setWallet({wallet: account});
      };
      ConnectWallet();
    }, 1000);
  }, []);

  //Login Function
  const LoginUser = () => {
    if (wallet !== '') {
      axios
        .post('https://jinx-social.herokuapp.com/login', wallet, axiosConfig)
        .then((res) => {
          if (res.status === 200) {
            let data = res.data.doc;
            sessionStorage.setItem('user', JSON.stringify(data));
            toast.success('Logged In Successfully', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
        })
        .catch((error) => {
          toast.error(error.message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  return (
    <>
      <section className="login">
        <div className="form">
          <center>
            <img
              src="https://res.cloudinary.com/ronaklala-games/image/upload/v1657619895/posts/favicon_dfjgrb.png"
              alt="logo img"
              height={'150px'}
              style={{borderRadius: '50%'}}
            />
            <h1>Login Into {process.env.REACT_APP_NAME}</h1>
          </center>
          <label>Wallet Address</label>
          <button onClick={LoginUser}>Connect Wallet</button>
          <br />
          <span>
            Dont have an Account? <Link to="/register">Register Now</Link>
          </span>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Login;
