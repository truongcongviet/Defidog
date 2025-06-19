import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Web3 from "web3";
import MetaMaskNotFoundPopup from "../components/popup/metamask-not-found";
import WrongNetworkPopup from "../components/popup/wrong-network";
import SwitchNetworkSuccessPopup from "../components/popup/switch-network-success";
import SomethingWentWrongPopup from "../components/popup/something-went-wrong";
import WelcomePopup from "../components/popup/webcome";
import MintSuccessPopup from "../components/popup/mint-success";
import MintLimitReachedPopup from "../components/popup/mint-limit-reached";
import InformationPopup from "../components/popup/information";
import ABI from "../public/abi.json";
import { Parallax } from "react-parallax";
import { Wallet, Menu, X, Star, Users, Clock, Shield } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { VARIANTS } from "../public/constant/animation";
import { useAnimations } from "../hooks/useAnimations";
import { WEB3_CONFIG } from "../public/constant/web3";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'ethers';
import {
  base,
  baseSepolia
} from 'wagmi/chains';
import { useSwitchChain, useChainId } from 'wagmi';

export default function Home() {
  const animations = useAnimations();

  // State
  const [isMobile, setIsMobile] = useState(false);
  const [currentWallet, setCurrentWallet] = useState(null);
  const [isPopupSomethingWentWrong, setIsPopupSomethingWentWrong] =
    useState(false);
  const [isPopupWelcome, setIsPopupWelcome] = useState(false);
  const [isPopupMintSuccess, setIsPopupMintSuccess] = useState(false);
  const [isPopupMintLimitReached, setIsPopupMintLimitReached] = useState(false);
  const [isActiveMenuMobile, setIsActiveMenuMobile] = useState(false);

  const [isPopupNotInWhitelist, setIsPopupNotInWhitelist] = useState(false);
  const [isPopupMintHasNotStarted, setIsPopupMintHasNotStarted] = useState(false);

  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingScreenMessage, setLoadingScreenMessage] = useState("Loading");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mintQuantity, setMintQuantity] = useState(1);

  const chainId = useChainId();

  // Write contract
  const {
    data: hash,
    writeContract,
    error: writeError,
    isPending: isWritePending
  } = useWriteContract();

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  console.log({ address, isConnected })

  // Hàm detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobileBreakpoint = 768; // Limited mobile
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // First run
    checkMobile();

    // add event listener when resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Web3

  useEffect(() => {
    if (localStorage.getItem("currentWallet")) {
      setCurrentWallet(localStorage.getItem("currentWallet"));
    }
  }, []);
  useEffect(() => {
    if (currentWallet != null) {
      localStorage.setItem("currentWallet", currentWallet);
    } else {
      localStorage.setItem("currentWallet", "");
    }
  }, [currentWallet]);
  useEffect(() => {
    accountsChanged().then((res) => {
      console.log(res);
    });
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window;
    if (ethereum) {
      await ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(async (accounts) => {
          if (accounts !== undefined) {
            await setCurrentWallet(accounts[0]);
            const detect = await detectNetwork();
            if (detect) {
              setIsPopupWelcome(true);
            }
          }
        });
    } else {
      setIsPopupMetamaskNotFound(true);
    }
  };

  const accountsChanged = async () => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts[0]) {
          await setCurrentWallet(accounts[0]);
          await connectWallet();
        } else {
          setCurrentWallet(null);
        }
      });
    }
  };

  const handleSwitchChain = async () => {
    try {
      await switchChain({
        chainId: base.id,
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  const detectNetwork = async () => {
    const web3 = new Web3("https://base.llamarpc.com");
    // const web3 = new Web3(Web3.givenProvider || base.rpcUrls.default.http[0]);
    const { ethereum } = window;
    let checkNetwork = true;

    if (ethereum) {
      await web3.eth.getChainId().then((res) => {
        console.log({ res });
        if (Number(res) !== base.id) {
          handleSwitchChain()
          checkNetwork = false;
        } else {
          // Network is correct
        }
      });
    }

    return checkNetwork;
  };

  const mintNFT = async () => {
    const checkNetWork = await detectNetwork();
    console.log({ checkNetWork })
    if (checkNetWork) {
    const web3 = new Web3("https://base.llamarpc.com");

      // const web3 = new Web3(Web3.givenProvider || base.rpcUrls.default.http[0]);

      if (address) {
        setLoadingScreenMessage("Minting...");
        setLoadingScreen(true);

        // const checkMintHasNotStarted = await mintHasNotStarted();
        // if (checkMintHasNotStarted) {
        //   setIsPopupMintHasNotStarted(true);
        //   setIsPopupWelcome(false);
        //   setIsPopupSwitchNetworkSuccess(false);
        //   setLoadingScreen(false);
        //   return false;
        // }

        // const whiteListUser = await checkWhiteListUser(currentWallet);
        // if (!whiteListUser) {
        //   setIsPopupNotInWhitelist(true);
        //   setIsPopupWelcome(false);
        //   setIsPopupSwitchNetworkSuccess(false);
        //   setLoadingScreen(false);
        //   return false;
        // }

        // web3.eth.defaultAccount = address;
        const contractDEFIDOG = new web3.eth.Contract(ABI, WEB3_CONFIG.CONTRACT_ADDRESS);

        // // Track wallet mint status
        // const check = await mintTracker();
        // if (check) {
        //   setIsPopupMintLimitReached(true);
        //   setLoadingScreen(false);
        // } else {
        //   // const merkleHexProof = await getMerkleHexProof(currentWallet);
        // Call mint function
        // writeContract({
        //   address: WEB3_CONFIG.CONTRACT_ADDRESS,
        //   abi: ABI,
        //   functionName: 'mint',
        //   args: [1],
        //   value: WEB3_CONFIG.MINT_PRICE,
        // });
        console.log({ contractDEFIDOG, address });
        contractDEFIDOG.methods
          .mint(1)
          .send({
            from: address,
            // value: WEB3_CONFIG.MINT_PRICE,
            value: 10000000000000,
          })
          .on("receipt", function (receipt) {
            console.log({receipt});
            setLoadingScreen(false);
            setIsPopupMintSuccess(true);
          })
          .on("error", function (error, receipt) {
            console.log(error, receipt);
            setLoadingScreen(false);
            if (error && error.code !== 4001) {
              setIsPopupSomethingWentWrong(true);
            }
          })
          .catch(function (e) {
            console.log(e);
            setLoadingScreen(false);
            // setIsPopupSomethingWentWrong(true);
          });
        // }
      } else {
        await connectWallet();
      }
    }
  };

  const mintNFTs = async () => {
    if (!isConnected) {
      alert("Vui lòng kết nối ví trước!");
      return;
    }

    if (chainId !== base.id) {
      alert("Vui lòng chuyển sang Base Sepolia!");
      return;
    }

    try {
      await writeContract({
        address: WEB3_CONFIG.CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'mint',
        args: [1], // Số lượng NFT
        value: parseEther('0.00001'), // Phí mint
      });
    } catch (error) {
      console.error("Lỗi mint:", error);
    }
  };
  // // Track wallet mint status
  // const mintTracker = async () => {
  //   const checkNetWork = await detectNetwork();
  //   let check = false;
  //   if (checkNetWork) {
  //     const web3 = new Web3(Web3.givenProvider || RPC_URL);
  //     if (currentWallet) {
  //       web3.eth.defaultAccount = currentWallet;
  //       const contractDEFIDOG = new web3.eth.Contract(ABI, contractAddress);
  //       check = await contractDEFIDOG.methods.mintTracker(currentWallet).call();
  //     }
  //   }

  //   // return check;
  //   return false;
  // };

  // Check mint has not started
  const mintHasNotStarted = async () => {
    const web3 = new Web3(Web3.givenProvider || base.rpcUrls.default.http[0]);
    const contract = new web3.eth.Contract(ABI, WEB3_CONFIG.CONTRACT_ADDRESS);
    return await contract.methods.pausePublicMint().call();
  };

  // // Placeholder image
  // const shimmer = (w, h) => `
  //   <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  //     <defs>
  //       <linearGradient id="g">
  //         <stop stop-color="#333" offset="20%" />
  //         <stop stop-color="#222" offset="50%" />
  //         <stop stop-color="#333" offset="70%" />
  //       </linearGradient>
  //     </defs>
  //     <rect width="${w}" height="${h}" fill="#333" />
  //     <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  //     <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  //   </svg>`;

  // const toBase64 = (str) =>
  //   typeof window === "undefined"
  //     ? Buffer.from(str).toString("base64")
  //     : window.btoa(str);
  // // End placeholder image

  return (
    <div>
      <Head>
        <title>Mint Now - The Defi Dogs legend edition.</title>
        <meta
          property="og:title"
          content="Mint Now - The Defi Dogs legend edition."
        />
        <meta
          property="og:description"
          content="Your Wanderers have become mountable creatures - the powerful means of transportation that aids riders on their adventures and grants access to unique combat abilities in the blockbuster MMORPG “Realms of Ethernity”. And who knows if there’s a chance of obtaining the all-powerful King and Queen Wanderer..."
        />
        <meta property="og:image" content="/images/thumb-v2.jpeg" />
        <meta
          name="description"
          content="Your Wanderers have become mountable creatures - the powerful means of transportation that aids riders on their adventures and grants access to unique combat abilities in the blockbuster MMORPG “Realms of Ethernity”. And who knows if there’s a chance of obtaining the all-powerful King and Queen Wanderer..."
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="min-h-screen flex flex-col bg-[url('/images/background.png')] bg-top bg-no-repeat bg-cover relative">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}

              <div className="relative w-[110px] lg:w-[201px] h-[50px] lg:h-[80px]">
                <Link href={"/"}>
                  <a className="relative block w-full h-full">
                    <Image
                      src="/images/defido-logo.png"
                      layout="fill"
                      objectFit="cover"
                      alt="Logo"
                    />
                  </a>
                </Link>
              </div>

              {/* Wallet Connect */}
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-end p-3">
                  <ConnectButton />
                </div>
                {isConnected && <button
                  onClick={mintNFTs}
                  className="bg-gradient-to-r from-[#003fdd] to-[#000d9f] px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 transition-all"
                >
                  <span>Mint NFT</span>

                </button>}
              </div>


            </div>
          </div>

        </header>

        <main className="flex-1 relative">
          {/* Defi dog Header - Background Image */}
          <div className="overflow-hidden max-w-4xl w-full mx-auto">
            <Image
              src="/images/defiHeader.png"
              alt="Defi Header"
              width={1024}
              height={480}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Section 1 */}
          <div className="relative w-full h-[400px] lg:h-[600px] mt-[-150px]">
            {/* <div className="w-full absolute top-0 bottom-0 flex flex-col items-center" style={{ zIndex: 10 }}> */}
            <div className="w-full flex flex-col items-center">

              <div className="relative w-full h-auto flex flex-col items-center pt-24 lg:pt-10 space-y-6">
                <motion.div
                  className="w-full flex flex-col items-center absolute bottom-0 z-50"
                  style={{
                    left: `${isMobile ? '22%' : '35%'}`,
                    transform: 'translateX(-50%)',
                    width: `${isMobile ? '58%' : '32%'}`,
                    y: animations.transforms.yDefiDog
                  }}
                >
                  <Image
                    src="/images/defi-thumnail.png"
                    alt="Defi Thumbnail 1"
                    width={500}
                    height={150}
                    className="w-auto h-auto max-w-[500px] object-contain"
                    unoptimized={true}
                  />

                </motion.div>
                <motion.div
                  className="w-full flex flex-col items-center absolute bottom-[-24px] lg:bottom-[-40px] z-50"
                  style={{
                    left: `${isMobile ? '32%' : '35%'}`,
                    transform: 'translateX(-50%)',
                    width: `${isMobile ? '35%' : '32%'}`,
                    y: animations.transforms.yDefiDog
                  }}
                >
                  <Image
                    src="/images/defimini.png"
                    alt="Defi Thumbnail 2"
                    width={300}
                    height={50}
                    className="w-auto h-auto max-w-[300px] object-contain"
                    unoptimized={true}
                  />

                </motion.div>

              </div>

              <div className="w-full lg:max-w-[80%] relative h-[224px] lg:h-[450px] flex justify-center">
                {/* Ảnh 1 */}
                <motion.div
                  className="absolute bottom-0 z-10"
                  style={{ left: '5%', width: '15%', y: animations.transforms.y1 }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={animations.parallaxControls}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src="/images/dog/dogs-1.png"
                    alt="Defi dogs 1"
                    width={240}
                    height={240}
                    className="w-full h-auto object-contain origin-bottom"
                    unoptimized={true}
                  />
                </motion.div>

                {/* Ảnh 2 */}
                <motion.div
                  className="absolute bottom-0 z-20"
                  style={{ left: '13%', width: '20%', y: animations.transforms.y2 }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={animations.parallaxControls}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src="/images/dog/dogs-2.png"
                    alt="Defi dogs 2"
                    width={280}
                    height={280}
                    className="w-full h-auto object-contain origin-bottom"
                    unoptimized={true}
                  />
                </motion.div>

                {/* Ảnh 3 */}
                <motion.div
                  className="absolute bottom-0 z-30"
                  style={{ left: '25%', width: '25%', y: animations.transforms.y3 }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={animations.parallaxControls}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src="/images/dog/dogs-3.png"
                    alt="Defi dogs 3"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain origin-bottom"
                    unoptimized={true}
                  />
                </motion.div>

                {/* Ảnh chính giữa */}
                <motion.div
                  className="absolute bottom-0 z-50"
                  style={{
                    left: '35%',
                    transform: 'translateX(-50%)',
                    width: '32%',
                    y: animations.transforms.yMain
                  }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={animations.parallaxControls}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src="/images/dog/dogs-main.png"
                    alt="Main Defi dog"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain origin-bottom"
                    unoptimized={true}
                  />
                </motion.div>

                {/* Ảnh 4 */}
                <motion.div
                  className="absolute bottom-0 z-30"
                  style={{ right: '22%', width: '25%', y: animations.transforms.y3 }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={animations.parallaxControls}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src="/images/dog/dogs-4.png"
                    alt="Defi dogs 4"
                    width={320}
                    height={320}
                    className="w-full h-auto object-contain origin-bottom"
                    unoptimized={true}
                  />
                </motion.div>

                {/* Ảnh 5 */}
                <motion.div
                  className="absolute bottom-0 z-20"
                  style={{ right: '13%', width: '20%', y: animations.transforms.y2 }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={animations.parallaxControls}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src="/images/dog/dogs-5.png"
                    alt="Defi dogs 5"
                    width={300}
                    height={300}
                    className="w-full h-auto object-contain origin-bottom"
                    unoptimized={true}
                  />
                </motion.div>

                <motion.div
                  className="absolute bottom-0 z-10"
                  style={{ right: '5%', width: '15%', y: animations.transforms.y1 }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={animations.parallaxControls}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src="/images/dog/dogs-6.png"
                    alt="Defi dogs 6"
                    width={200}
                    height={200}
                    className="w-full h-auto object-contain origin-bottom"
                    unoptimized={true}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="max-w-[80%] mx-auto grid grid-rows-[auto_auto] grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4 bg-black rounded-xl lg:rounded-3xl w-full">
            {/* Cột 1 */}
            <motion.div
              ref={animations.refs.ref1}
              initial="hidden"
              animate={animations.jumpControls[1]}
              variants={VARIANTS.left}
              className="relative row-span-3 lg:row-span-2 bg-[#666aa5] h-full rounded-xl lg:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `${isMobile ? 'inset -6px 0 4px rgba(77, 80, 125, 0.5), inset 0 -6px 4px rgba(77, 80, 125, 0.5)' : 'inset -10px 0 4px rgba(77, 80, 125, 0.5), inset 0 -10px 4px rgba(77, 80, 125, 0.5)'}`
              }}
            >
              <div className="absolute overflow-hidden bottom-[-6px] right-[-68px]">
                <Image
                  src="/images/dog/dogs-1.png"
                  alt="Defi dogs 1"
                  width={240}
                  height={240}
                  className="w-full h-auto object-contain origin-bottom"
                  unoptimized={true}
                />
              </div>
            </motion.div>

            {/* Hàng 1 */}
            {/* Khối 1 */}
            <motion.div
              ref={animations.refs.ref2}
              initial="hidden"
              animate={animations.jumpControls[1]}
              variants={VARIANTS.topRight}
              className="relative row-start-2 lg:row-start-1 col-start-2 col-span-2 bg-white h-[100px] lg:h-[200px] rounded-xl lg:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `${isMobile ? 'inset -6px 0 4px rgba(200, 200, 200, 0.4), inset 0 -6px 4px rgba(200, 200, 200, 0.4)' : 'inset -10px 0 4px rgba(200, 200, 200, 0.4), inset 0 -10px 4px rgba(200, 200, 200, 0.4)'}`
              }}
            >
              <div className="absolute overflow-hidden bottom-0 right-0">
                <Image
                  src="/images/section/sectionBlue.png"
                  alt="Section Blue"
                  width={isMobile ? 80 : 180}
                  height={isMobile ? 80 : 180}
                  className="w-full h-auto object-contain origin-bottom"
                  unoptimized={true}
                />
              </div>
            </motion.div>

            {/* Khối 2 */}
            <motion.div
              ref={animations.refs.ref3}
              initial="hidden"
              animate={animations.jumpControls[2]}
              variants={VARIANTS.right}
              className="relative lg:col-start-4 bg-[#2b2d33] h-[100px] lg:h-[200px] rounded-xl lg:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `${isMobile ? 'inset -6px 0 4px rgba(21, 22, 25, 0.5), inset 0 -6px 4px rgba(21, 22, 25, 0.5)' : 'inset -10px 0 4px rgba(21, 22, 25, 0.5), inset 0 -10px 4px rgba(21, 22, 25, 0.5)'}`
              }}
            >
              <div className="absolute overflow-hidden top-[-20px] right-[-20px] lg:right-[-60px]">
                <Image
                  src="/images/section/sectionOrange.png"
                  alt="Section Orange"
                  width={isMobile ? 80 : 180}
                  height={isMobile ? 80 : 180}
                  className="w-full h-auto object-contain origin-bottom"
                  unoptimized={true}
                />
              </div>
            </motion.div>

            {/* Khối 3 */}
            <motion.div
              ref={animations.refs.ref4}
              initial="hidden"
              animate={animations.jumpControls[3]}
              variants={VARIANTS.bottomLeft}
              className="relative lg:col-start-5 bg-[#666aa5] h-[100px] lg:h-[200px] rounded-xl lg:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `${isMobile ? 'inset -6px 0 4px rgba(77, 80, 125, 0.5), inset 0 -6px 4px rgba(77, 80, 125, 0.5)' : 'inset -10px 0 4px rgba(77, 80, 125, 0.5), inset 0 -10px 4px rgba(77, 80, 125, 0.5)'}`
              }}

            >
              <div className="absolute overflow-hidden bottom-[-10px] right-0 left-0 mx-auto translate-x-[20%]">
                <Image
                  src="/images/dog/dogs-2.png"
                  alt="Section Blue"
                  width={isMobile ? 80 : 130}
                  height={isMobile ? 80 : 130}
                  className="w-full h-auto object-contain origin-bottom transform scale-x-[-1]"
                  unoptimized={true}
                />
              </div>
            </motion.div>

            {/* Hàng 2 */}
            {/* Khối 4 */}
            <motion.div
              ref={animations.refs.ref5}
              initial="hidden"
              animate={animations.jumpControls[4]}
              variants={VARIANTS.bottom}
              className="relative row-start-3 lg:row-start-2 col-start-3 lg:col-start-2 bg-[#2b2d33] h-[100px] lg:h-[300px] rounded-xl lg:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `${isMobile ? 'inset -6px 0 4px rgba(21, 22, 25, 0.5), inset 0 -6px 4px rgba(21, 22, 25, 0.5)' : 'inset -10px 0 4px rgba(21, 22, 25, 0.5), inset 0 -10px 4px rgba(21, 22, 25, 0.5)'}`
              }}
            >
              <div className="absolute overflow-hidden top-[-6px] left-[-6px]">
                <Image
                  src="/images/section/sectionOriginal.png"
                  alt="Section Original"
                  width={isMobile ? 80 : 180}
                  height={isMobile ? 80 : 180}
                  className="w-full h-auto object-contain origin-bottom"
                  unoptimized={true}
                />
              </div>
            </motion.div>

            {/* Khối 5 */}
            <motion.div
              ref={animations.refs.ref6}
              initial="hidden"
              animate={animations.jumpControls[5]}
              variants={VARIANTS.right}
              className="relative col-start-1 lg:col-start-3 col-span-2 bg-[#3947eb] h-[100px] lg:h-[300px] rounded-xl lg:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `${isMobile ? 'inset -6px 0 4px rgba(28, 35, 180, 0.5), inset 0 -6px 4px rgba(28, 35, 180, 0.5)' : 'inset -10px 0 4px rgba(28, 35, 180, 0.5), inset 0 -10px 4px rgba(28, 35, 180, 0.5)'}`
              }}
            >
              <div className="absolute overflow-hidden bottom-[-6px] lg:bottom-[-10px] right-[-20px] lg:right-[-80px]">
                <Image
                  src="/images/dog/dogs-5.png"
                  alt="Section Blue"
                  width={isMobile ? 110 : 320}
                  height={isMobile ? 110 : 320}
                  className="w-full h-auto object-contain origin-bottom transform scale-x-[-1]"
                  unoptimized={true}
                />
              </div>
            </motion.div>

            {/* Khối 6 */}
            <motion.div
              ref={animations.refs.ref6}
              initial="hidden"
              animate={animations.jumpControls[6]}
              variants={{
                hidden: { y: -100, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 80,
                    damping: 10,
                    mass: 0.5,
                    delay: 0.2 // Thêm độ trễ
                  }
                }
              }}
              className="relative lg:col-start-5 bg-white h-[100px] lg:h-[300px] rounded-xl lg:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `${isMobile ? 'inset -6px 0 4px rgba(200, 200, 200, 0.4), inset 0 -6px 4px rgba(200, 200, 200, 0.4)' : 'inset -10px 0 4px rgba(200, 200, 200, 0.4), inset 0 -10px 4px rgba(200, 200, 200, 0.4)'}`
              }}
            >
              <div className="absolute overflow-hidden top-[10px] lg:top-[20px] right-[-6px] lg:right-0">
                <Image
                  src="/images/section/ethereum.png"
                  alt="Section Ethereum"
                  width={isMobile ? 60 : 160}
                  height={isMobile ? 60 : 160}
                  className="w-full h-auto object-contain origin-bottom"
                  unoptimized={true}
                />
              </div>
            </motion.div>
          </div>

          {/* Section 3 */}
          <div className="relative lg:max-w-[80%] w-full h-[980px] bg-[url('/images/bg-mobile.webp')] lg:bg-[url('/images/bg-section.webp')] bg-center bg-no-repeat bg-cover mx-auto mt-[100px]">
            <div className="absolute lg:left-[100px] translate-y-1/2 lg:translate-y-3/4 w-full lg:w-1/2 flex justify-center items-end overflow-hidden">
              <div className="max-w-[80%] lg:max-w-full w-full flex gap-2 lg:gap-3">
                <div className="relative w-1/2 h-[240px] lg:h-[360px] mt-4 rounded-xl lg:rounded-3xl bg-[#2b252b] shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000"  >

                  <div className="absolute overflow-hidden bottom-[-80px] right-[-40px] lg:right-[-80px]">
                    <Image
                      src="/images/section/sun.png"
                      alt="The Sun"
                      width={isMobile ? 160 : 240}
                      height={isMobile ? 160 : 240}
                      className="w-full h-auto object-contain origin-bottom"
                      unoptimized={true}
                    />
                  </div>
                </div>

                <div className="flex w-1/2 gap-2 lg:gap-3 h-[240px] lg:h-[360px]">
                  <div className="flex flex-col gap-2 lg:gap-3 w-[150px]">
                    <div className="relative w-full h-[200px] rounded-2xl bg-[#2b252b] shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000"  >
                      <div className="absolute overflow-hidden top-[-10px] right-[-10px]">
                        <Image
                          src="/images/section/base.png"
                          alt="The Base"
                          width={isMobile ? 60 : 80}
                          height={isMobile ? 60 : 80}
                          className="w-full h-auto object-contain origin-bottom"
                          unoptimized={true}
                        />
                      </div>
                    </div>

                    <div className="relative w-full h-[200px] rounded-2xl bg-[#2b252b] shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000"  >
                      <div className="absolute overflow-hidden bottom-[-120px] lg:bottom-[-160px] right-[-180px]">
                        <Image
                          src="/images/section/fire.png"
                          alt="The Fire"
                          width={isMobile ? 260 : 380}
                          height={isMobile ? 260 : 380}
                          className="w-full h-auto object-contain origin-bottom"
                          unoptimized={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:gap-3 w-[150px] -mb-4 mt-4">
                    <div className="relative w-full h-[200px] rounded-2xl bg-[#2b252b] shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000"  >
                      <div className="absolute overflow-hidden bottom-[-60px] right-[-30px] lg:right-[-60px]">
                        <Image
                          src="/images/section/moon.png"
                          alt="The Moon"
                          width={isMobile ? 100 : 140}
                          height={isMobile ? 100 : 140}
                          className="w-full h-auto object-contain origin-bottom"
                          unoptimized={true}
                        />
                      </div>
                      <div className="absolute overflow-hidden bottom-[-40px] lg:bottom-[-50px] left-[-20px]">
                        <Image
                          src="/images/section/cloud.png"
                          alt="The Moon"
                          width={isMobile ? 100 : 140}
                          height={isMobile ? 100 : 140}
                          className="w-full h-auto object-contain origin-bottom"
                          unoptimized={true}
                        />
                      </div>
                    </div>

                    <div className="relative w-full h-[200px] rounded-2xl bg-[#2b252b] shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000"  >

                      <div className="absolute overflow-hidden bottom-[-140px] lg:bottom-[-160px] left-[-180px] lg:left-[-280px]">
                        <Image
                          src="/images/section/fire.png"
                          alt="The Fire"
                          width={isMobile ? 300 : 380}
                          height={isMobile ? 300 : 380}
                          className="w-full h-auto object-contain origin-bottom"
                          unoptimized={true}
                        />
                      </div>
                      <div className="absolute overflow-hidden bottom-0 left-0 right-0 mx-auto translate-x-[20%]">
                        <Image
                          src="/images/section/safemoon.png"
                          alt="The Safe Moon"
                          width={isMobile ? 40 : 80}
                          height={isMobile ? 40 : 80}
                          className="w-full h-auto object-contain origin-bottom"
                          unoptimized={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* Footer */}
        {/* <footer className="bg-black/20 backdrop-blur-md border-t border-purple-500/20 mt-auto relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">DefidoNFT</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">OpenSea</a>
              </div>
            </div>
            <div className="border-t border-purple-500/20 mt-6 pt-6 text-center">
              <p className="text-gray-400 text-sm">© 2025 DefidoNFT. All rights reserved.</p>
            </div>
          </div>
        </footer> */}
      </div>

      {/* Loading screen, waiting for something */}
      <div
        className={`section-loading-screen fixed z-[10000] top-0 left-0 overflow-hidden transition-opacity ${loadingScreen === true
          ? "duration-300 w-full h-full opacity-100"
          : "duration-[0ms] w-0 h-0 opacity-0"
          }`}
      >
        <div className="relative w-full h-full bg-[#000000]/80 flex flex-col items-center justify-center">
          <div className="relative w-[32px] h-[32px] animate-spin select-none mb-[24px]">
            <Image
              src="/images/loading.png"
              layout="fill"
              objectFit="contain"
              alt="Icon Loading"
              priority
            />
          </div>
          <div className="text-center">
            <span className="text-white">{loadingScreenMessage}</span>
          </div>
        </div>
      </div>

      {/* Popup Something Went Wrong */}
      <div
        className={`absolute z-[999] top-0 left-0 overflow-hidden bg-[#000000]/80 transition-opacity ease-in-out duration-300 ${isPopupSomethingWentWrong
          ? "w-screen h-screen opacity-100"
          : "w-0 h-0 opacity-0"
          }`}
      >
        <SomethingWentWrongPopup
          triggerParentUpdate={setIsPopupSomethingWentWrong}
        />
      </div>
      {/* Popup Welcome */}
      <div
        className={`absolute z-[999] top-0 left-0 overflow-hidden bg-[#000000]/80 transition-opacity ease-in-out duration-300 ${isPopupWelcome ? "w-screen h-screen opacity-100" : "w-0 h-0 opacity-0"
          }`}
      >
        <WelcomePopup
          triggerParentUpdate={setIsPopupWelcome}
          triggerMintNFT={() => mintNFT()}
        />
      </div>
      {/* Popup Mint Success */}
      <div
        className={`absolute z-[999] top-0 left-0 overflow-hidden bg-[#000000]/80 transition-opacity ease-in-out duration-300 ${isPopupMintSuccess
          ? "w-screen h-screen opacity-100"
          : "w-0 h-0 opacity-0"
          }`}
      >
        <MintSuccessPopup triggerParentUpdate={setIsPopupMintSuccess} />
      </div>
      {/* Popup Mint Limit Reached */}
      <div
        className={`absolute z-[999] top-0 left-0 overflow-hidden bg-[#000000]/80 transition-opacity ease-in-out duration-300 ${isPopupMintLimitReached
          ? "w-screen h-screen opacity-100"
          : "w-0 h-0 opacity-0"
          }`}
      >
        <MintLimitReachedPopup
          triggerParentUpdate={setIsPopupMintLimitReached}
        />
      </div>
      {/* Popup You're Not In Whitelist */}
      <div
        className={`absolute z-[999] top-0 left-0 overflow-hidden bg-[#000000]/80 transition-opacity ease-in-out duration-300 ${isPopupNotInWhitelist
          ? "w-screen h-screen opacity-100"
          : "w-0 h-0 opacity-0"
          }`}
      >
        <InformationPopup
          triggerParentUpdate={setIsPopupNotInWhitelist}
          title="Ooops!"
          message="You're not in whitelist"
        />
      </div>
      {/* Popup Mint Has Not Started Yet */}
      <div
        className={`absolute z-[999] top-0 left-0 overflow-hidden bg-[#000000]/80 transition-opacity ease-in-out duration-300 ${isPopupMintHasNotStarted
          ? "w-screen h-screen opacity-100"
          : "w-0 h-0 opacity-0"
          }`}
      >
        <InformationPopup
          triggerParentUpdate={setIsPopupMintHasNotStarted}
          title="Ooops!"
          message="Mint hasn't started yet"
        />
      </div>
    </div>
  );
}
