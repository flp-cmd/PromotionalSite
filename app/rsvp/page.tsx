"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Image,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/modal";
import { useRouter } from "next/navigation";

export default function GuestsPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerificationSuccess = () => {
    sessionStorage.setItem("validatedCode", code.toUpperCase());
    router.push("/rsvp/cadastro");
  };

  async function validarCodigo() {
    setIsLoading(true);

    if (code.length !== 8) {
      setErrorMessage("Código inválido. Verifique o número digitado.");
      onOpen();
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/validar-codigo?code=${code}`, {
        method: "GET",
      });

      const data = await response.json();
      if (data.token) {
        sessionStorage.setItem("validationToken", data.token);
      }

      if (data.status === "success") {
        handleVerificationSuccess();
      } else {
        setErrorMessage(data.message);
        onOpen();
      }
    } catch (error) {
      console.log("Erro ao validar Código: ", error);
      setErrorMessage(
        <>Ocorreu um erro na verificação. Tente novamente mais tarde.</>
      );
      onOpen();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex
      flexDirection={"column"}
      className="content"
      textAlign="center"
      borderRadius="md"
      bg="transparent"
      minW={"360px"}
      pt={{ base: "4vh", md: "10vh" }}
      paddingInline={{ base: "10vw" }}
      mx={"auto"}
      position={{ md: "relative" }}
      alignItems={"center"}
      zIndex={0}
    >
      <Modal isOpen={open} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
        <ModalContent maxW={"350px"} mx="auto" mt={"200px"}>
          <ModalHeader
            bgColor={"#0E0E0E"}
            color={"#FFDE00"}
            borderTopRadius={"8px"}
            sx={{
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              fontSize: "20px",
            }}
          >
            Algo deu errado...
          </ModalHeader>
          <ModalBody py={6} bgColor={"#fff"}>
            <Text
              color={"#4b4a4a"}
              textAlign={"center"}
              mx={"10px"}
              fontSize={"14px"}
              paddingTop={"5px"}
            >
              {errorMessage}
            </Text>
          </ModalBody>
          <ModalFooter
            bgColor={"#fff"}
            borderColor="gray.600"
            justifyContent={"center"}
            height={"70px"}
            borderBottomRadius={"8px"}
          >
            <Button
              bgColor={"#ED7678"}
              color={"#fff"}
              fontWeight={"500"}
              onClick={onClose}
              _hover={{ bg: "#302e2e", color: "#ED7678" }}
              borderRadius={"8px"}
            >
              Tentar Novamente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Image
        src="/promotionalLogo.png"
        mb={{ base: "5vh", md: "3vh" }}
        width={{ base: "40vh", md: "50vh" }}
        alt="PromotionalLogo"
      />
      <Text
        color="white"
        fontSize={{ base: "2.3vh", md: "2.5vh" }}
        fontWeight={"400"}
        lineHeight={{ base: "3.5vh", md: "4vh" }}
        textAlign={"justify"}
        width={{ base: "40vh", md: "60vh" }}
      >
        Se você recebeu um código <b>RSVP</b> para participar do{" "}
        <b> Um Baita Festival</b>, digite seu código e confirme sua presença no
        melhor festival do Brasil e de brinde ganhe uma{" "}
        <b id="highlightedText">cortesia</b> para um convidado de sua escolha!
      </Text>

      <Flex
        mt={{ base: "5vh", md: "2vh" }}
        direction={{ base: "column", md: "column" }}
        width={{ base: "100%", md: "60vh" }}
        display={{ base: "none", md: "flex" }}
        gap={"0vh"}
      >
        <Flex flexDirection={"row"} width={"100%"} mt={"3vh"} gap={"3vh"}>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Digite seu código aqui"
            borderRadius={"10px"}
            color="black"
            bg="white"
            height={"7vh"}
            _focus={{
              border: "2px solid #DF9A00",
              bg: "blue.50",
              transform: "scale(1.02)",
              transition: "all 0.2s",
            }}
          />
          <Button
            onClick={validarCodigo}
            bg="#DF9A00"
            color="#fff"
            _hover={{ bg: "#302e2e", color: "#DF9A00" }}
            borderRadius={"lg"}
            width={{ base: "60%", md: "28vh" }}
            height={"7vh"}
            fontWeight={"900"}
            mb={{ md: "8px" }}
          >
            {isLoading === true ? "CARREGANDO..." : "VALIDAR CÓDIGO"}
            {isLoading && <Spinner />}
          </Button>
        </Flex>
      </Flex>

      <Flex
        gap={{ base: "5vh", md: "2vh" }}
        mt={{ base: "5vh", md: "2vh" }}
        direction={{ base: "column", md: "row" }}
        alignItems={"center"}
        display={{ base: "flex", md: "none" }}
      >
        <Flex //MOBILE FLEX
          flexDirection={"column"}
          width={{ base: "100%", md: "100%" }}
          mt={{ base: "0vh", md: "3vh" }}
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Digite seu código aqui"
            borderRadius={"10px"}
            color="black"
            bg="white"
            height={"7vh"}
            _focus={{
              border: "2px solid #DF9A00",
              bg: "blue.50",
              transform: "scale(1.02)",
              transition: "all 0.2s",
            }}
          />
        </Flex>

        <Button
          onClick={validarCodigo}
          bg="#DF9A00"
          color="#fff"
          _hover={{ bg: "#302e2e", color: "#DF9A00" }}
          borderRadius={"lg"}
          width={{ base: "60%", md: "28vh" }}
          height={"7vh"}
          fontWeight={"900"}
          mb={{ md: "8px" }}
        >
          {isLoading === true ? "CARREGANDO..." : "VALIDAR CÓDIGO"}
          {isLoading && <Spinner />}
        </Button>
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
        display={"flex"}
        justifyContent={"center"}
        top={{ base: "95vh", md: "95vh" }}
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
}
