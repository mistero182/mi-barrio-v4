import React, { useEffect, useState, useLayoutEffect } from 'react';
import {Route, Routes, useLocation, useSearchParams} from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from 'axios';
import qs from 'qs';


console.log(process.env.COGNITO_CLIENT_ID)


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

const client_id =  process.env.COGNITO_CLIENT_ID || 'hola-acd3-a24de1ee1baf';
console.log(client_id)

export default function App() {
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
            cookies.set('token', param);
            console.log(param)
            // searchParams.delete('code');
    
            // 👇️ update state after
            setSearchParams(searchParams);

            

            // const payload = {
            //     grant_type: authorization_code,
            //     client_id: 
            // }

            // const options = {
            //     method: 'POST',
            //     headers: { 'content-type': 'application/x-www-form-urlencoded' },
            //     data: qs.stringify(data),
            //     'https://auth.apo.ocuba.net/oauth2/token',
            // };

            // axios.post(options)
            // .then(function (response) {
            // console.log(response);
            // })
            // .catch(function (error) {
            // console.log(error);
            // });
        }
    }, [searchParams])

  return (
    <div
        className="App"
    >
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/distrito/:ndis" element={<Distrito />} />
            <Route path="/negocio/:id" element={<Negocio />} />
        </Routes>
    </div>
  );
}
