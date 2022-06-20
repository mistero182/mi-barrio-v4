import React, { } from 'react';
import useProgressiveImage from '../../hooks/useProgressiveImage';
import { Link } from 'react-router-dom'

import mainIcon from '../../assets/icons/miBarrio.png';
import gpsPin from '../../assets/icons/gpsPin.png';
import user from '../../assets/icons/user.png';
import './Home.css'

import distritos from '../../data/distritos.json'

export const Home = (() => {
    const loadedMainlogo = useProgressiveImage(mainIcon)
    const loadedGPS = useProgressiveImage(gpsPin)
    
    return (
        <div className='Home'>
            <h1
                className='mainTitle'
            >
                {"MI SANTA CRUZ\n"}
                <span
                    className='subTitle'
                >
                    Emprendedora
                </span>
            </h1>

            <div
                className='mainLogoContainer'
            >
                <img 
                    className='mainLogo'
                    src={ mainIcon }
                />
            </div>

            <div>
                <Link to={`/negocio/apotv`}>
                    <div
                        className='sponsoreditem'
                    >
                        <p> APO tv </p>
                    </div>
                </Link>
                <Link to={`/negocio/revistamisantacruz`}>
                    <div
                        className='sponsoreditem'
                    >
                        <p> Revista Mi Santa Cruz </p>
                    </div>
                </Link>
                <Link to={`/negocio/josedazabienesraices`}>
                    <div
                        className='sponsoreditem'
                    >
                        <p> Jose Daza Bienes Raices </p>
                    </div>
                </Link>
            </div>

            <Link className='currentDistritoContainer' to='/distrito/1'>
                <div className='currentDistrito'>
                    <img className='currentImage' src={loadedGPS}/>
                    <p> DISTRITO 1 </p>
                </div>
            </Link>

            <div
                className='itemsContainer'
            >
                <div
                    className='itemsList'
                >
                    { distritos.map((item, idx) => (
                        <div
                            className='itemContainer'
                            key={`item${idx}`}
                        >
                            <Link to={`/distrito/${item.ndis}`}>
                                <div className='item'>
                                    <p> Distrio {item.ndis} </p>
                                </div>
                            </Link>
                        </div>
                    )) }   
                </div>
            </div>

            <a href='https://auth.apo.ocuba.net/login?client_id=3gb76npoh1pgv2o269524t7jlm&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fapo.ocuba.net'>
                <div
                    className='userButton'
                >
                    <img
                        src={user}
                        className='userIcon'
                    />
                </div>
            </a>

            
        </div>
    );
});
