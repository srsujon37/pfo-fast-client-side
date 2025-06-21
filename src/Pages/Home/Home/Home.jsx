import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import ClientLogos from '../ClientLogos/ClientLogos ';
import BenefitsSection from '../BenefitsSection/BenefitsSection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services />
            <ClientLogos />
            <BenefitsSection/>
        </div>
    );
};

export default Home;