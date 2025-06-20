import React from 'react';
import logo from '../../../assets/logo.png'

const ProFastLogo = () => {
    return (
        <div className='flex items-end'>
            <img className='mb-2' src={logo} alt="" />
            <h3 className='text-3xl font-extrabold -ml-4'>ProFast</h3>
        </div>
    );
};

export default ProFastLogo;