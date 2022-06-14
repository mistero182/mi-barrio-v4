import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import backArrow from '../../assets/icons/backArrow.png'
import { useParams, useSearchParams} from "react-router-dom";

import './Negocio.css'

import negocio_01 from '../../assets/images/negocios/apotv.jpg'
import negocio_02 from '../../assets/images/negocios/revistamisantacruz.jpg'
import negocio_03 from '../../assets/images/negocios/josedaza.jpg'


const dataNegocios = [
    {id: 'apotv', title: 'Apo tv', type: 'noticias', distance: 50, image: negocio_01 },
    {id: 'revistamisantacruz', title: 'Revista Mi Querida\nSanta Cruz', type: 'entrevistas', distance: 50, image: negocio_02 },
    {id: 'josedazabienesraices', title: 'Jose Daza\nBienes Raices', type: 'bienes raices ', distance: 50, image: negocio_03 },
]

let negociomodel = {id: '', title: '', type: 'as', distance: 0, image: '' };

const capitalizeFirst = (str:string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const Negocio = (() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [negocio, setNegocio] = useState(negociomodel);
    
    const { id } = useParams();

    useLayoutEffect(() => {
        let filtered = dataNegocios.filter((item) => {
            if (item.id === id ) return true
        })

        setNegocio(filtered[0]);
    }, [id])

    

    return (
        <div className='mainDistrito'>
            <div className='header'>
                <Link to='/'>
                    <img 
                        className='backArrow'
                        src={backArrow}
                    />
                </Link>
                <p className='headerTitle'>
                    { capitalizeFirst(negocio.type) }
                </p>
            </div>

            <h1
                className='negocioTitle'
            >
                { negocio.title }
            </h1>

            <div
                className='mainLogoContainer-negocio'
            >
                <img 
                    className='mainLogo-negocio'
                    src={ negocio.image }
                />
            </div>

        </div>
    );
});
