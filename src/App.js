import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";

import NavBar from "./components/NavBar";
import Main from "./components/Main.js";
import Footer from "./components/Footer.js";

import './App.css';

const { chains, provider } = configureChains(
	[chain.mainnet],
	[infuraProvider({ apiKey: 'e43256526e5a43068eba8e9af33770a1' })]
);
const { connectors } = getDefaultWallets({
	appName: "DigiRose",
	chains
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
});

function App() {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider 
				theme={lightTheme({
					accentColor: 'pink',
					accentColorForeground: 'red',
					borderRadius: 'medium',
					fontStack: 'system',
				})}
				chains={chains}>
				<div className="app">
					<NavBar />
					<Main />
					<Footer /> 
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;