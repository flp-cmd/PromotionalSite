"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Text, Image, Link } from "@chakra-ui/react";
import MapaGoogle from "@/components/common/GoogleMap";

export default function ExchangePage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const flag = localStorage.getItem("acesso_autorizado");
    if (flag === "true") {
      setAuthenticated(true);
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!authenticated) return null;

  return (
    <Flex
      flexDirection={"column"}
      className="content"
      textAlign="center"
      borderRadius="md"
      bg="transparent"
      minW={"360px"}
      pt={{ base: "15px", md: "5vh" }}
      paddingInline={{ base: "10vw" }}
      mx={"auto"}
      position={{ md: "relative" }}
      alignItems={"center"}
      zIndex={0}
      gap={"30px"}
      height={{ base: "100vh", md: "100vh" }}
    >
      <Image
        src="/promotionalLogo.png"
        maxW={{ base: "35vh", md: "50vh" }}
        w={"100%"}
        alt="PromotionalLogo"
      />

      <Text
        color="white"
        fontSize={{ base: "2.3vh", md: "2.5vh" }}
        fontWeight={"400"}
        lineHeight={{ base: "3vh", md: "3vh" }}
        textAlign={"center"}
        width={{ base: "100%", md: "60vh" }}
      >
        Para receber seu prêmio, troque seu ticket entre os{" "}
        <b>dias 12 e 16 de Maio no Dom Brejas das 18h às 23h.</b> E você que vai
        curtir o <b>Um Baita Festival 2025,</b> caso ache melhor, pode retirar
        seu prêmio no dia do evento.
      </Text>

      <Box maxW={"500px"} w={"100%"} height={"100%"} maxH={"300px"}>
        <MapaGoogle />
      </Box>

      <Box>
        <Link
          fontSize={"18px"}
          color="white"
          href="https://maps.google.com/?q=Av.+Barão+de+Itapura,+2947+-+Taquaral,+Campinas+-+SP,+13073-300"
          target="_blank"
          textDecoration="underline"
          _focus={{ outline: "none", boxShadow: "none" }}
        >
          Av. Barão de Itapura, 2947 - Taquaral, Campinas - SP, 13073-300
        </Link>
      </Box>

      <Flex gap={"50px"} display={{ base: "none", md: "flex" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          top={{ base: "30vh", md: "3vh" }}
          left={{ base: "20vw", md: "3vw" }}
          position={{ md: "absolute" }}
          gap={"0.7vh"}
          width={{ md: "15vh" }}
        >
          <Text fontSize="1.6vh" color={"#fff"}>
            CERVEJA OFICIAL:
          </Text>
          <Image
            src="/blackPrincess.png"
            alt="Logo Black Princess"
            w={"100%"}
            height={"5vh"}
            maxW={{ md: "10vh" }}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          top={{ base: "28vh", md: "88vh" }}
          left={{ base: "20vw", md: "1vw" }}
          position={{ md: "absolute" }}
          width={{ md: "18vh" }}
        >
          <Image
            src="/logoUBF.png"
            alt="Logo Baita Festival"
            maxW={{ md: "20vh" }}
            w="60%"
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          top={{ base: "28vh", md: "88vh" }}
          right={{ base: "20vw", md: "1vw" }}
          position={{ md: "absolute" }}
          gap={"0.7vh"}
          width={{ md: "18vh" }}
        >
          <Text fontSize="1.6vh" color={"#fff"}>
            PATROCINADOR:
          </Text>
          <Image
            src="/ophicina.png"
            alt="Logo Ophicina"
            maxW={{ md: "20vh" }}
            w="50%"
            height={{ md: "5vh" }}
          />
        </Box>
      </Flex>

      <Flex
        gap={{ base: "5vh", md: "2vh" }}
        direction={{ base: "column", md: "row" }}
        alignItems={"center"}
        width={{ md: "70vh" }}
        display={{ base: "flex", md: "none" }}
      >
        <Box display={{ base: "flex", md: "none" }} gap={"3.5vw"}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            top={{ base: "30vh", md: "3vh" }}
            left={{ base: "20vw", md: "3vw" }}
            position={{ md: "absolute" }}
            gap={"1vh"}
          >
            <Text fontSize="clamp(8px, 1.6vh, 10.4px)" color={"#fff"}>
              CERVEJA OFICIAL:
            </Text>
            <Image
              src="/blackPrincess.png"
              alt="Logo Black Princess"
              maxW={{ base: "12vh" }}
              w={"100%"}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            top={{ base: "28vh", md: "90vh" }}
            right={{ base: "20vw", md: "3vw" }}
            position={{ md: "absolute" }}
            gap={"0.7vh"}
          >
            <Image
              src="/logoUBF.png"
              alt="Logo Baita Festival"
              maxW={{ base: "12vh" }}
              w="100%"
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            top={{ base: "28vh", md: "90vh" }}
            right={{ base: "20vw", md: "3vw" }}
            position={{ md: "absolute" }}
            gap={"0.7vh"}
          >
            <Text fontSize="clamp(8px, 1.6vh, 10.4px)" color={"#fff"}>
              PATROCINADOR:
            </Text>
            <Image
              src="/ophicina.png"
              alt="Logo Ophicina"
              maxW={{ base: "12vh" }}
              w="95%"
            />
          </Box>
        </Box>
      </Flex>

      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        mt={"-15px"}
        pb={"10px"}
      >
        <Text
          fontSize="1.6vh"
          textAlign="center"
          color={"#fff"}
          display={"flex"}
          justifyContent={"center"}
          width={{ md: "20vw" }}
        >
          BEBA COM SABEDORIA
        </Text>
      </Box>
    </Flex>
  );
}
