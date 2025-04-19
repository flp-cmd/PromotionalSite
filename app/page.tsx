"use client";

import { Box, Flex, Text, Image } from "@chakra-ui/react";

const VerificationGate: React.FC = () => {
  return (
    <Flex
      flexDirection={"column"}
      className="content"
      textAlign="center"
      borderRadius="md"
      bg="transparent"
      minW={"360px"}
      pt={{ base: "4vh", md: "8vh" }}
      paddingInline={{ base: "10vw" }}
      mx={"auto"}
      position={{ md: "relative" }}
      alignItems={"center"}
      zIndex={0}
    >
      <Image
        src="/promotionalLogo.png"
        mb={{ base: "5vh", md: "6vh" }}
        width={{ base: "40vh", md: "50vh" }}
        alt="PromotionalLogo"
      />
      <Text
        color="white"
        fontSize={{ base: "2.3vh", md: "2.5vh" }}
        fontWeight={"400"}
        lineHeight={{ base: "4vh", md: "4vh" }}
        textAlign={"justify"}
        width={{ base: "50vh", md: "80vh" }}
        maxW={{ base: "100%" }}
      >
        <b id="highlightedText">Promoção encerrada!</b> Agradecemos a todos que
        participaram da promoção especial do Um Baita Festival! O período para
        cadastro de CPF e solicitação do ticket promocional{" "}
        <b> foi encerrado</b>. Se você se cadastrou a tempo, fique tranquilo: o
        seu <b>ticket está a caminho</b> e será enviado para o endereço
        informado no cadastro. <b>Importante: </b> os brindes{" "}
        <b>não serão enviados.</b> O ticket dá direito a prêmios especiais, e
        nele você encontrará um QR Code que mostrará{" "}
        <b> onde e quando você poderá reivindicá-los.</b> Nos vemos no{" "}
        <b>Um Baita Festival!</b> Vai ser épico e cheio de surpresas!
      </Text>

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
        gap={"4vh"}
        mt={"5vh"}
        alignItems={"center"}
        width={{ md: "70vh" }}
        display={{ base: "flex", md: "none" }}
        flexDir={"column"}
        mb={"10px"}
      >
        <Flex gap={"5vw"}>
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
        </Flex>
        <Text
          fontSize="1.6vh"
          textAlign="center"
          color={"#fff"}
          display={{ base: "flex", md: "none" }}
          justifyContent={"center"}
          width={{ md: "20vw" }}
        >
          BEBA COM SABEDORIA
        </Text>
      </Flex>

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

      <Text
        fontSize="1.6vh"
        textAlign="center"
        position={"absolute"}
        color={"#fff"}
        display={{ base: "none", md: "flex" }}
        justifyContent={"center"}
        top={{ base: "112vh", md: "95vh" }}
        width={{ md: "20vw" }}
      >
        BEBA COM SABEDORIA
      </Text>

      <Image
        src="/instrumentos.png"
        alt="Instrumentos"
        width={{ base: "0%", md: "45vh" }}
        position="absolute"
        left={{ base: "-10%", md: "-130px" }}
        top="20vh"
        transform={{ base: "rotate(-10deg) scale(0.8)", md: "rotate(40deg)" }}
        zIndex={-1}
      />

      <Image
        src="/instrumentos.png"
        alt="Instrumentos"
        width={{ base: "0%", md: "45vh" }}
        position="fixed"
        right={{ base: "-10%", md: "-130px" }}
        top="20vh"
        transform={{
          base: "rotate(10deg) scaleX(-1) scale(0.8)",
          md: "rotate(-40deg) scaleX(-1)",
        }}
        zIndex={-1}
      />
    </Flex>
  );
};

export default VerificationGate;
