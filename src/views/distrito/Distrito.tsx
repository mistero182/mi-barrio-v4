import React, {  } from 'react';
import { Link } from 'react-router-dom';
import backArrow from '../../assets/icons/backArrow.png'
import { useParams, useSearchParams} from "react-router-dom";

import './Distrito.css'

import negocio_01 from '../../assets/images/negocios/negocio_01.jpg'
import negocio_02 from '../../assets/images/negocios/negocio_02.jpg'
import negocio_03 from '../../assets/images/negocios/negocio_03.jpg'
import negocio_04 from '../../assets/images/negocios/negocio_04.jpg'
import negocio_05 from '../../assets/images/negocios/negocio_05.jpg'

const dataNegocios = [
    {title: 'Centro Medico Moscu', type: 'centro medico', distance: 50, image: negocio_01 },
    {title: 'Restautante El Tutumaso', type: 'restaurante', distance: 50, image: negocio_02 },
    {title: 'Pollos Yoshi', type: 'restaurante', distance: 125, image: negocio_03 },
    {title: 'Chaperio y pintura "El Estudiante"', type: 'taller de chaperio', distance: 500, image: negocio_04 },
    {title: 'Salon de Eventos Los troncos', type: 'salon de eventos', distance: 500, image: negocio_05 },

]

export const Distrito = (() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { ndis } = useParams();

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
                    Distrito {ndis}
                </p>
            </div>

            {dataNegocios.map((item, idx) => (
                <div className='litCard'>
                    <div className='imageContainer'>
                        <img src={item.image} />
                    </div>
                    <div className='litCardBody'>
                        <p className='litCardTitle'> { item.title } </p>
                        <p className='litCardType' > { item.type } </p>
                    </div>
                    <div className='litCardLeft'>
                        <p className='distance'> { item.distance }mts </p>
                    </div>
                </div>
            ))}
            
            

        </div>
    );
});
