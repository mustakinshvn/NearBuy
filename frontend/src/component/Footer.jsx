import FooterAbout from './footerComponents/footerAbout';
import QuickLinks from './footerComponents/quickLinks';
import CustomerService from './footerComponents/customerService';
import ContactInfo from './footerComponents/contactInfo';
import BottomBar from './footerComponents/bottomBar';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FooterAbout />
          <QuickLinks />
          <CustomerService />
          <ContactInfo />
        </div>

       <BottomBar />
       
      </div>
    </footer>
  );
};

export default Footer;