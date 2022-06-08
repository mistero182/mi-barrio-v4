import React, { } from 'react';
import useProgressiveImage from '../../hooks/useProgressiveImage';
import { Link } from 'react-router-dom'

import mainIcon from '../../assets/icons/miBarrio.png';
import gpsPin from '../../assets/icons/gpsPin.png';
import './Home.css'

export const Home = (() => {
    const loadedMainlogo = useProgressiveImage(mainIcon)
    const loadedGPS = useProgressiveImage(gpsPin)
    
    return (
        <div>
            <h1
                className='mainTitle'
            >
                MI SANTA CRUZ
            </h1>

            <div
                className='mainLogoContainer'
            >
                <img 
                    className='mainLogo'
                    src={ loadedMainlogo }
                />
            </div>

            <div>
                <Link className='currentDistritoContainer' to='/distrito'>
                    <div className='currentDistrito'>
                        <img className='currentImage' src={loadedGPS}/>
                        <p> DISTRITO 1 </p>
                    </div>
                </Link>
            </div>

            <div
                className='itemsList'
            >
                <div className='itemContainer'>
                    <Link to='/distrito'>
                        <div className='item'>
                            <p> Distrio 1 </p>
                        </div>
                    </Link>
                </div>
                <div className='itemContainer'>
                    <div className='item'>
                        <p> Distrio 2 </p>
                    </div>
                </div>
                <div className='itemContainer'>
                    <div className='item'>
                        <p> Distrio 3 </p>
                    </div>
                </div>
                <div className='itemContainer'>
                    <div className='item'>
                        <p> Distrio 4 </p>
                    </div>
                </div>
                <div className='itemContainer'>
                    <div className='item'>
                        <p> Distrio 5 </p>
                    </div>
                </div>
                <div className='itemContainer'>
                    <div className='item'>
                        <p> Distrio 6 </p>
                    </div>
                </div>
                <div className='itemContainer'>
                    <div className='item'>
                        <p> Distrio 7 </p>
                    </div>
                </div>
                <div className='itemContainer'>
                    <div className='item'>
                        <p> Distrio 8 </p>
                    </div>
                </div>

            </div>


        </div>
    );
});
