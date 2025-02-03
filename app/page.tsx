"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Image,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import Checkbox from "@/components/Checkbox";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/modal";
import { useRouter } from "next/navigation";

const VerificationGate: React.FC = () => {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const [isChecked, setIsChecked] = useState(false);

  const sanitizeCpf = (cpf: string) => {
    return cpf.replace(/\D/g, "");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const cleaned = value.replace(/\D/g, "");

    let formattedValue = "";

    if (cleaned.length <= 11) {
      if (cleaned.length <= 3) {
        formattedValue = cleaned;
      } else if (cleaned.length <= 6) {
        formattedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
      } else if (cleaned.length <= 9) {
        formattedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(
          3,
          6
        )}.${cleaned.slice(6)}`;
      } else {
        formattedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(
          3,
          6
        )}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
      }
    } else {
      if (cleaned.length <= 2) {
        formattedValue = cleaned;
      } else if (cleaned.length <= 5) {
        formattedValue = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
      } else if (cleaned.length <= 8) {
        formattedValue = `${cleaned.slice(0, 2)}.${cleaned.slice(
          2,
          5
        )}.${cleaned.slice(5)}`;
      } else if (cleaned.length <= 12) {
        formattedValue = `${cleaned.slice(0, 2)}.${cleaned.slice(
          2,
          5
        )}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}`;
      } else {
        formattedValue = `${cleaned.slice(0, 2)}.${cleaned.slice(
          2,
          5
        )}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(
          12,
          14
        )}`;
      }
    }

    setCpf(formattedValue);
  };

  const handleVerificationSuccess = () => {
    sessionStorage.setItem("validatedCpf", sanitizeCpf(cpf));
    router.push("/cadastro");
  };

  const handleVerification = async () => {
    if (!isChecked) {
      setErrorMessage(
        <>
          Para continuar, é necessário concordar com as <b>regras</b> do
          sorteio. Marque a opção antes de prosseguir.
        </>
      );
      onOpen();
      return;
    }

    const cleanedCpf = sanitizeCpf(cpf);

    if (![11, 14].includes(cleanedCpf.length)) {
      setErrorMessage(<>CPF/CNPJ inválido. Verifique o número digitado.</>);
      onOpen();
      return;
    }

    try {
      const docRef = doc(db, "clients", cleanedCpf);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data?.isParticipating === false) {
          handleVerificationSuccess();
        } else {
          setErrorMessage(
            <>
              Seu CPF ou CNPJ já está participando do sorteio, aguarde os
              resultados!
            </>
          );
          onOpen();
        }
      } else {
        setErrorMessage(
          <>
            Não conseguimos encontrar seu CPF ou CNPJ em nosso banco de dados.
            Verifique se este foi o mesmo utilizado para a compra dos ingressos
            do <b>Um Baita Festival</b>.
          </>
        );
        onOpen();
      }
    } catch (error) {
      console.error("Erro na verificação:", error);
      setErrorMessage(
        <>Ocorreu um erro durante a verificação. Tente novamente.</>
      );
      onOpen();
    }
  };

  return (
    <Box
      textAlign="center"
      borderRadius="md"
      bg="transparent"
      maxWidth={{ base: "100%", md: "600px" }}
      height="650px"
      mx="auto"
      my="auto"
      p={{ base: "10px", md: "20px" }}
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
        src="https://shorturl.at/3qVoS"
        mb={{ base: "30px", md: "50px" }}
        width={{ base: "350px", md: "500px" }}
        mx="auto"
        alt="PromotionalLogo"
      />
      <Text
        mb="4"
        color="white"
        fontSize={{ base: "18px", md: "25px" }}
        fontWeight={"400"}
        lineHeight={{ base: "22px", md: "37.5px" }}
        textAlign={"center"}
      >
        Se você foi <b>comprador</b> de alguma edição do{" "}
        <b>Um Baita Festival</b>, digite seu CPF e concorra a um{" "}
        <b id="highlightedText">Black Ticket</b> com prêmios especiais!{" "}
      </Text>

      <Flex
        gap={{ base: "30px", md: "15px" }}
        mb="4"
        mt={"30px"}
        direction={{ base: "column", md: "row" }}
        alignItems={"center"}
      >
        <Flex
          flexDirection={"column"}
          width={{ base: "100%", md: "65%" }}
          mt={"33px"}
        >
          <Input
            value={cpf}
            onChange={handleCpfChange}
            placeholder="Digite seu cpf ou cnpj aqui"
            borderRadius={"10px"}
            color="black"
            bg="white"
            height={"50px"}
            _focus={{
              border: "2px solid #DF9A00",
              bg: "blue.50",
              transform: "scale(1.02)",
              transition: "all 0.2s",
            }}
          />
          <Checkbox
            checked={isChecked}
            onChange={(checked) => setIsChecked(checked)}
            label={
              <>
                Concordo com as{" "}
                <Link
                  href="/regras-sorteio.pdf"
                  color="#7E92FF"
                  textDecoration={"underline"}
                  target="_blank"
                  _focus={{ outline: "none" }}
                >
                  regras
                </Link>{" "}
                do sorteio
              </>
            }
          />
        </Flex>

        <Button
          onClick={handleVerification}
          bg="#DF9A00"
          color="#fff"
          _hover={{ bg: "#302e2e", color: "#DF9A00" }}
          borderRadius={"lg"}
          width={{ base: "60%", md: "35%" }}
          height={"50px"}
          fontWeight={"900"}
        >
          QUERO PARTICIPAR
        </Button>
      </Flex>
    </Box>
  );
};

export default VerificationGate;
