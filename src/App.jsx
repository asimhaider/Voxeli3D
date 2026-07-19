import './index.css';
import { useState } from 'react';
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
import ContactStrip from './components/ContactStrip';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <LayerRail />
      <Header />
      <Hero />
      <ContactStrip />
      <StatsSection />
      <VerticalsSection />
      <CatalogueSection onRequestProduct={setSelectedProduct} />
      <ProcessSection />
      <CustomUploadSection />
      <GallerySection />
      <CTASection selectedProduct={selectedProduct} onProductCleared={() => setSelectedProduct(null)} />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
