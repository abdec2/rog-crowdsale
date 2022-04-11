import HeaderComponent from "./components/Header";
import Presale from "./components/Presale";
import ShapeDivider from "./components/ShapeDivider";
import FooterComponent from './components/Footer';
import { useContext, useEffect } from "react";
import { GlobalProvider } from "./context/GlobalContext";

function App() {
  useEffect(() => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
    }

  }, []);
  return (
    <GlobalProvider>
      <div className="container mx-auto px-10 max-w-7xl">
        <div className="min-h-screen">
          <HeaderComponent />
          <ShapeDivider />
          <Presale />
        </div>
      </div>
      <FooterComponent />
    </GlobalProvider>
  );
}

export default App;
