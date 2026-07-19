import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import LayerRail from './components/LayerRail';
import StatsSection from './components/StatsSection';
import VerticalsSection from './components/VerticalsSection';
import CatalogueSection from './components/CatalogueSection';
import ProcessSection from './components/ProcessSection';
import CustomUploadSection from './components/CustomUploadSection';
import GallerySection from './components/GallerySection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <>
      <LayerRail />
      <Header />
      <Hero />
      <StatsSection />
      <VerticalsSection />
      <CatalogueSection />
      <ProcessSection />
      <CustomUploadSection />
      <GallerySection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
