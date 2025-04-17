"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import {
  Box,
  useDisclosure,
  Text,
  Button,
  Grid,
  GridItem,
  Input,
  Flex,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function GuestSignUpPage() {
  const router = useRouter();
  const {
    open: isSuccessModalOpen,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal,
  } = useDisclosure();
  const [code, setCode] = useState("");
  const [error, setError] = useState(true);
  const [emptyForm, setEmptyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    cellphone: "",
    cpf: "",
  });
  const [fullNameInvalid, setFullNameInvalid] = useState(false);
  const [cellphoneInvalid, setCellphoneInvalid] = useState(false);
  const [documentNumberInvalid, setDocumentNumberInvalid] = useState(false);

  const validateFullName = (value: string) => {
    const nameParts = value.trim().split(/\s+/);
    if (value != "") {
      if (nameParts.length < 2) {
        setFullNameInvalid(true);
        toast.error("Por favor, insira o nome completo (nome e sobrenome)!");
        return false;
      }
      setFullNameInvalid(false);
      return true;
    } else {
      return;
    }
  };

  const validateCellphone = (value: string) => {
    if (value != "") {
      if (value.length < 15) {
        setCellphoneInvalid(true);
        toast.error("Por favor, digite o telefone completo!");
        return false;
      }
      setCellphoneInvalid(false);
      return true;
    } else {
      return;
    }
  };

  const validateDocumentNumber = (value: string) => {
    const cpf = value.replace(/\D/g, "");

    if (value != "") {
      if (cpf.length !== 11) {
        setDocumentNumberInvalid(true);
        toast.error("CPF deve conter 11 dígitos!");
        return false;
      }

      if (/^(\d)\1{10}$/.test(cpf)) {
        setDocumentNumberInvalid(true);
        toast.error("CPF inválido!");
        return false;
      }

      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      const digitoVerificador1 = resto > 9 ? 0 : resto;

      if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
        setDocumentNumberInvalid(true);
        toast.error("CPF inválido!");
        return false;
      }

      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      const digitoVerificador2 = resto > 9 ? 0 : resto;

      if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
        setDocumentNumberInvalid(true);
        toast.error("CPF inválido!");
        return false;
      }

      setDocumentNumberInvalid(false);
      return true;
    } else {
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cellphone") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length <= 2) {
        formattedValue = onlyNumbers;
      } else if (onlyNumbers.length <= 7) {
        formattedValue = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
      } else {
        formattedValue = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
          2,
          7
        )}-${onlyNumbers.slice(7, 11)}`;
      }
    } else if (name === "cpf") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length <= 3) {
        formattedValue = onlyNumbers;
      } else if (onlyNumbers.length <= 6) {
        formattedValue = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3)}`;
      } else if (onlyNumbers.length <= 9) {
        formattedValue = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(
          3,
          6
        )}.${onlyNumbers.slice(6)}`;
      } else {
        formattedValue = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(
          3,
          6
        )}.${onlyNumbers.slice(6, 9)}-${onlyNumbers.slice(9, 11)}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  useEffect(() => {
    const validatedCode = sessionStorage.getItem("validatedCode");
    if (!validatedCode) {
      router.push("/convidados");
    } else {
      setError(false);
      setCode(validatedCode);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const requiredFields = Object.entries(formData);

    if (requiredFields.length !== Object.keys(formData).length) {
      setEmptyForm(true);
      toast.error("Campos obrigatórios faltando!");
      setIsLoading(false);
      return;
    } else if (fullNameInvalid || cellphoneInvalid || documentNumberInvalid) {
      toast.error("Complete corretamente os campos!");
      setIsLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("validationToken");
      const response = await fetch("/api/cadastro-convidado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, code }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.removeItem("validatedCode");
        sessionStorage.removeItem("validationToken");
        onOpenSuccessModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div>Carregando...</div>;

  return (
    <Flex
      flexDir={"column"}
      bgColor={"transparent"}
      alignItems={"center"}
      border={"0"}
      w={{ md: "71vw" }}
      maxW={{ md: "800px" }}
      maxH={{ md: "700px" }}
      mx="auto"
      pt={{ md: "5vh" }}
      p={{ base: "3vh" }}
      paddingBottom={{ base: "0" }}
      position="relative"
      zIndex={0}
    >
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={onCloseSuccessModal}
        isCentered
      >
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
            Você está participando!
          </ModalHeader>
          <ModalBody py={6} bgColor={"#fff"}>
            <Text
              color={"#4b4a4a"}
              textAlign={"center"}
              mx={"10px"}
              fontSize={"14px"}
              paddingTop={"5px"}
            >
              Agora é só esperar e torcer para ser um dos premiados! Enquanto
              isso, que tal postar nos seus stories uma imagem especial com a{" "}
              <b>#umbaitafestival</b> e já ir se preparando?
            </Text>
          </ModalBody>
          <ModalFooter
            bgColor={"#fff"}
            borderColor="gray.600"
            justifyContent={"center"}
            height={"70px"}
            borderBottomRadius={"8px"}
            gap={"10px"}
          >
            <Button
              bgColor={"#ED7678"}
              color={"#fff"}
              fontWeight={"500"}
              onClick={() => {
                onCloseSuccessModal();
                router.push("/convidados");
              }}
              _hover={{ bg: "#302e2e", color: "#ED7678" }}
              borderRadius={"8px"}
              width={"150px"}
            >
              DEIXA PRA LÁ...
            </Button>
            <Button
              bgColor={"#DF9A00"}
              color={"#fff"}
              fontWeight={"900"}
              onClick={() => {
                onCloseSuccessModal();
                router.push("/convidados");
              }}
              _hover={{ bg: "#302e2e", color: "#DF9A00" }}
              borderRadius={"8px"}
              width={"150px"}
            >
              VAMOS LÁ!
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
        lineHeight={{ base: "3vh", md: "3vh" }}
        textAlign={"center"}
        width={{ base: "70vh", md: "80vh" }}
        maxW={"100%"}
        mb={"40px"}
      >
        <b id="highlightedText">Parabéns! </b>
        <b>
          Você acaba de ganhar um ingresso cortesia para um acompanhante!
        </b>{" "}
        Por favor preencha o formulário abaixo com os dados do seu convidado(a)
      </Text>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }} gap="2vh">
          <GridItem colSpan={{ base: 1, md: 6 }}>
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Nome Completo:
            </Text>
            <Input
              type="text"
              name="fullName"
              placeholder="Escreva o nome aqui"
              fontSize={{ md: "1.5vh" }}
              value={formData.fullName}
              onChange={handleChange}
              onBlur={(e) => validateFullName(e.target.value)}
              height={"5vh"}
              borderRadius={"lg"}
              color={"#000"}
              bgColor={
                (emptyForm && formData.fullName) === "" ||
                fullNameInvalid === true
                  ? "#f3a3a3"
                  : "#fff"
              }
              border={
                (emptyForm && formData.fullName) === "" ||
                fullNameInvalid === true
                  ? "2px solid red"
                  : "1px solid transparent"
              }
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 6 }}>
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              CPF:
            </Text>
            <Input
              type="text"
              name="cpf"
              placeholder="Escreva o cpf aqui"
              fontSize={{ md: "1.5vh" }}
              value={formData.cpf}
              onChange={handleChange}
              onBlur={(e) => validateDocumentNumber(e.target.value)}
              height={"5vh"}
              borderRadius={"lg"}
              color={"#000"}
              bgColor={
                (emptyForm && formData.cpf) === "" ||
                documentNumberInvalid === true
                  ? "#f3a3a3"
                  : "#fff"
              }
              border={
                (emptyForm && formData.cpf) === "" ||
                documentNumberInvalid === true
                  ? "2px solid red"
                  : "1px solid transparent"
              }
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 6 }}>
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Telefone:
            </Text>
            <Input
              type="tel"
              name="cellphone"
              placeholder="(XX) XXXXX-XXXX"
              fontSize={{ md: "1.5vh" }}
              value={formData.cellphone}
              onChange={handleChange}
              onBlur={(e) => validateCellphone(e.target.value)}
              height={"5vh"}
              borderRadius={"lg"}
              bgColor={
                (emptyForm && formData.cellphone === "") ||
                cellphoneInvalid === true
                  ? "#f3a3a3"
                  : "#fff"
              }
              color={"#000"}
              border={
                (emptyForm && formData.cellphone === "") ||
                cellphoneInvalid === true
                  ? "2px solid red"
                  : "1px solid transparent"
              }
            />
          </GridItem>
        </Grid>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          height={"80px"}
          mt={"20px"}
        >
          <Button
            type="submit"
            color={"#FFF"}
            bgColor={"#DF9A00"}
            justifySelf={"center"}
            height={"7vh"}
            width={{ base: "60%", md: "28vh" }}
            borderRadius={"lg"}
            fontWeight={"900"}
            onSubmit={handleSubmit}
            _hover={{ bg: "#302e2e", color: "#DF9A00" }}
            disabled={isLoading}
          >
            {isLoading === true ? "CARREGANDO..." : "ENVIAR"}
            {isLoading && <Spinner />}
          </Button>
        </Flex>
        <Box
          display={"flex"}
          paddingTop={"20px"}
          mt={"10px"}
          justifyContent={"space-between"}
        >
          <Box
            display={{ base: "flex", md: "none" }}
            flexDirection={"column"}
            gap={"1vw"}
            alignItems={"center"}
          >
            <Text fontSize="clamp(8px, 1.6vh, 10.4px)" color={"#fff"}>
              CERVEJA OFICIAL:
            </Text>
            <Image
              src={"/blackPrincess.png"}
              alt="Logo Black Princess"
              maxW={{ base: "12vh" }}
              w={"100%"}
            />
          </Box>
          <Box
            display={{ base: "flex", md: "none" }}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Image
              src={"/logoUBF.png"}
              alt="Logo Baita Festival"
              maxW={{ base: "12vh" }}
              w={"100%"}
            />
          </Box>
          <Box
            display={{ base: "flex", md: "none" }}
            flexDirection={"column"}
            gap={"1vw"}
            alignItems={"center"}
          >
            <Text fontSize="clamp(8px, 1.6vh, 10.4px)" color={"#fff"}>
              PATROCINADOR:
            </Text>
            <Image
              src={"/ophicina.png"}
              alt="Logo Ophicina"
              maxW={{ base: "12vh" }}
              w={"95%"}
            />
          </Box>
        </Box>

        <Text
          mt={"30px"}
          fontSize={"12px"}
          textAlign={"center"}
          display={{ md: "none" }}
          color={"#fff"}
        >
          BEBA COM SABEDORIA
        </Text>
      </form>
      <Box
        position="fixed"
        top="55%"
        left={0}
        right={0}
        w="100vw"
        overflow="visible"
        pointerEvents="none"
        zIndex={-1}
      >
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          alignItems="center"
          top={{ base: "30vh", md: "-50vh" }}
          left={{ base: "20vw", md: "3vw" }}
          position={{ base: "absolute", md: "absolute" }}
          gap={"1vh"}
          width={{ md: "15vh" }}
        >
          <Text fontSize="1.6vh" color={"#fff"}>
            CERVEJA OFICIAL:
          </Text>
          <Image
            src="/blackPrincess.png"
            alt="Logo Black Princess"
            maxW={{ md: "10vh" }}
            w="100%"
            height={"5vh"}
          />
        </Box>

        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          alignItems="center"
          top={{ base: "30vh", md: "33vh" }}
          left={{ base: "20vw", md: "1vw" }}
          position={{ base: "absolute", md: "absolute" }}
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
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          alignItems="center"
          top={{ base: "30vh", md: "33vh" }}
          right={{ base: "20vw", md: "1vw" }}
          position={{ base: "absolute", md: "absolute" }}
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

        <Box
          position={{ base: "relative", md: "relative" }}
          display={{ base: "none", md: "flex" }}
          justifyContent={"center"}
        >
          <Text
            mt={{ base: "42vh", md: "42vh" }}
            fontSize="12px"
            textAlign="center"
            position={"absolute"}
            color={"#fff"}
          >
            BEBA COM SABEDORIA
          </Text>
        </Box>

        <Image
          src="/instrumentos.png"
          alt="Instrumentos"
          width={{ base: "0%", md: "42vh" }}
          position="absolute"
          left={{ base: "-10%", md: "-130px" }}
          top="-30vh"
          transform={{
            base: "rotate(-10deg) scale(0.8)",
            md: "rotate(40deg)",
          }}
        />

        <Image
          src="/instrumentos.png"
          alt="Instrumentos"
          width={{ base: "0%", md: "42vh" }}
          position="absolute"
          right={{ base: "-10%", md: "-130px" }}
          top="-30vh"
          transform={{
            base: "rotate(10deg) scaleX(-1) scale(0.8)",
            md: "rotate(-40deg) scaleX(-1)",
          }}
        />
      </Box>
    </Flex>
  );
}
