import React, { useEffect, useState, useLayoutEffect, useContext } from 'react';
import {Route, Routes, useLocation, useSearchParams} from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from 'axios';
import qs from 'qs';
import useConfig from './hooks/useConfig'


const cookies = new Cookies();

import { Home } from './views/home/Home'
import { Distrito } from './views/distrito/Distrito'
import { Negocio } from './views/negocio/Negocio'

import useViewport from './hooks/useViewport';

import './App.css'
import './assets/css/font-family.css';


const globalConfig = {
    maxHDWidth: 1340,
    maxSDWidth: 1100,
    mobileThreshold: 950,
    SDthreshold: 1340,
}


export default function App() {
    const { app } = useConfig();

    const { pathname, hash, key } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const { bodyTop, bodyWidth } = useViewport();
    const [isMobile, setIsMobile] = useState(false);
    const [isSD, setIsSD] = useState(false);

    useEffect(() => {
        if (hash === '') {
            window.scrollTo(0, 0);
        } else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            }, 0);
        }
    }, [pathname, hash, key]);

    useLayoutEffect(() => {
        if (bodyWidth < globalConfig.mobileThreshold) setIsMobile(true);
        else setIsMobile(false);

        if ((bodyWidth > globalConfig.mobileThreshold) && (bodyWidth < globalConfig.maxHDWidth)) setIsSD(true)
        else setIsSD(false)

    }, [bodyWidth, bodyTop])

    useEffect(() => {
        const param = searchParams.get('code');

        if (param) {
            // 👇️ delete each query param
            cookies.set('vrc_tk', param);
            console.log(param)
            // searchParams.delete('code');
    
            // 👇️ update state after
            setSearchParams(searchParams);

        }
    }, [searchParams])

    function showCookie() {
        console.log(cookies.get('vrc_tk'));
    }

    function getToken() {
        const code = cookies.get('vrc_tk');

        const payload = {
            grant_type: 'authorization_code',
            client_id: '3gb76npoh1pgv2o269524t7jlm',
            code: code,
            redirect_uri: 'https://apo.ocuba.net',
        }

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(payload),
            url: 'https://auth.apo.ocuba.net/oauth2/token'
        };

        axios(options)
        .then(function (response) {
            console.log(response);
            const { id_token, expires_in, access_token, refresh_token } = response.data;

            cookies.set('vrc_idtk', id_token);
            cookies.set('vrc_acsstk', access_token);
            cookies.set('vrc_rftk', refresh_token);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function logOut() {
        const rftk = cookies.get('vrc_rftk');

        const payload = {
            token: rftk,
            client_id: '3gb76npoh1pgv2o269524t7jlm'
        };

        const options = {
            method: 'POST',
            headers: { 
                'accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(payload),
            url: 'https://auth.apo.ocuba.net'
        };

        axios(options)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function userInfo() {
        const bearer = cookies.get('vrc_acsstk');

        const options = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${bearer}` },
            url: 'https://auth.apo.ocuba.net/oauth2/userInfo'
        };

        axios(options)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function testAuth() {
        const bearer = cookies.get('vrc_idtk');

        const options = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${bearer}` },
            url: 'https://apo.ocuba.net/testauth'
            // url: 'http://localhost:3004/testauth'
        };

        axios(options)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

  return (
    <div
        className="App"
    >
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/distrito/:ndis" element={<Distrito />} />
            <Route path="/negocio/:id" element={<Negocio />} />
        </Routes>

        <div>
            <button
                onClick={()=>(showCookie())}
            >
                Log Cookies
            </button>
            <button
                onClick={()=>(getToken())}
            >
                Token
            </button>
            <button
                onClick={()=>(logOut())}
            >
                <a href='https://auth.apo.ocuba.net/logout?response_type=code&client_id=3gb76npoh1pgv2o269524t7jlm&redirect_uri=https://apo.ocuba.net'>
                    <div>
                        log Out
                    </div>
                </a>
            </button>
            <button
                onClick={()=>(userInfo())}
            >
                User Info
            </button>
            <button
                onClick={()=>(testAuth())}
            >
                Test Auth
            </button>
        </div>
    </div>
  );
}
