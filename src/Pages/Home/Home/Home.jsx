import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import ClientLogos from '../ClientLogos/ClientLogos ';
import BenefitsSection from '../BenefitsSection/BenefitsSection';
import BeMerchant from '../BeMerchant/BeMerchant';
import HowItWorks from '../HowItWorks/HowItWorks';
import FAQ from '../FAQ/FAQ';

const Home = () => {
    return (
        <div className="container mx-auto space-y-8">
            <Banner></Banner>
            <HowItWorks/>
            <Services />
            <ClientLogos />
            <BenefitsSection/>
            <BeMerchant/>
            <FAQ/>
        </div>
    );
};

export default Home;