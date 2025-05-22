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
  const [showGuestFields, setShowGuestFields] = useState(false);
  const [formData, setFormData] = useState({
    vip: {
      cpf: "",
      fullName: "",
      cellphone: "",
      email: "",
    },
    guest: {
      cpf: "",
      fullName: "",
      cellphone: "",
      email: "",
    },
  });
  const [fullNameInvalidVip, setFullNameInvalidVip] = useState(false);
  const [cellphoneInvalidVip, setCellphoneInvalidVip] = useState(false);
  const [documentNumberInvalidVip, setDocumentNumberInvalidVip] =
    useState(false);
  const [emailInvalidVip, setEmailInvalidVip] = useState(false);

  const [fullNameInvalidGuest, setFullNameInvalidGuest] = useState(false);
  const [cellphoneInvalidGuest, setCellphoneInvalidGuest] = useState(false);
  const [documentNumberInvalidGuest, setDocumentNumberInvalidGuest] =
    useState(false);
  const [emailInvalidGuest, setEmailInvalidGuest] = useState(false);

  const resetInvalidFields = () => {
    setFullNameInvalidVip(false);
    setFullNameInvalidGuest(false);
    setDocumentNumberInvalidVip(false);
    setDocumentNumberInvalidGuest(false);
    setCellphoneInvalidVip(false);
    setCellphoneInvalidGuest(false);
    setEmailInvalidVip(false);
    setEmailInvalidGuest(false);
  };

  useEffect(() => {
    const fetchFullName = async () => {
      const validatedCode = sessionStorage.getItem("validatedCode");
      const token = sessionStorage.getItem("validationToken");

      if (validatedCode && token) {
        try {
          const response = await fetch(
            `/api/get-fullname?code=${validatedCode}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok && data.status === "success") {
            setFormData((prev) => ({
              ...prev,
              vip: {
                ...prev.vip,
                fullName: data.fullName || "",
              },
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar nome do convidado:", error);
        }
      }
    };

    fetchFullName();
  }, [router]);

  const handleStoryDownload = () => {
    const link = document.createElement("a");
    link.href = "/storyUmBaitaFestival.png";
    link.download = "storyUmBaitaFestival.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateFullName = (value: string, type: string) => {
    const nameParts = value.trim().split(/\s+/);
    if (value != "") {
      if (nameParts.length < 2) {
        if (type === "vip") {
          setFullNameInvalidVip(true);
          toast.error(
            "Por favor, insira seu nome completo (nome e sobrenome)!"
          );
        } else {
          setFullNameInvalidGuest(true);
          toast.error(
            "Por favor, insira o nome completo de seu convidado (nome e sobrenome)!"
          );
        }
        return false;
      }
      if (type === "vip") setFullNameInvalidVip(false);
      else setFullNameInvalidGuest(false);
      return true;
    } else {
      return;
    }
  };

  const validateCellphone = (value: string, type: string) => {
    if (value != "") {
      if (value.length < 15) {
        if (type === "vip") {
          setCellphoneInvalidVip(true);
          toast.error("Por favor, digite seu telefone completo!");
        } else {
          setCellphoneInvalidGuest(true);
          toast.error(
            "Por favor, digite o telefone completo do seu convidado!"
          );
        }
        return false;
      }
      if (type === "vip") setCellphoneInvalidVip(false);
      else setCellphoneInvalidGuest(false);
      return true;
    } else {
      return;
    }
  };

  const validateDocumentNumber = (value: string, type: string) => {
    const cpf = value.replace(/\D/g, "");

    if (value != "") {
      if (cpf.length !== 11) {
        if (type === "vip") setDocumentNumberInvalidVip(true);
        else setDocumentNumberInvalidGuest(true);
        toast.error("CPF deve conter 11 dígitos!");
        return false;
      }

      if (/^(\d)\1{10}$/.test(cpf)) {
        if (type === "vip") setDocumentNumberInvalidVip(true);
        else setDocumentNumberInvalidGuest(true);
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
        if (type === "vip") setDocumentNumberInvalidVip(true);
        else setDocumentNumberInvalidGuest(true);
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
        if (type === "vip") setDocumentNumberInvalidVip(true);
        else setDocumentNumberInvalidGuest(true);
        toast.error("CPF inválido!");
        return false;
      }

      if (type === "vip") setDocumentNumberInvalidVip(false);
      else setDocumentNumberInvalidGuest(false);
      return true;
    } else {
      return;
    }
  };

  const validateEmail = (value: string, type: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value != "") {
      if (emailRegex.test(value) === false) {
        if (type === "vip") setEmailInvalidVip(true);
        else setEmailInvalidGuest(true);
        toast.error("Por favor, digite um email válido!");
        return false;
      }
      if (type === "vip") setEmailInvalidVip(false);
      else setEmailInvalidGuest(false);
      return true;
    } else {
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split("-");

    let formattedValue = value;

    if (subfield === "cellphone") {
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
    } else if (subfield === "cpf") {
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
      [field]: {
        ...prev[field as keyof typeof prev],
        [subfield]: formattedValue,
      },
    }));
  };

  useEffect(() => {
    const validatedCode = sessionStorage.getItem("validatedCode");
    if (!validatedCode) {
      router.push("/rsvp");
    } else {
      setError(false);
      setCode(validatedCode);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    resetInvalidFields();

    if (
      !formData.vip.fullName ||
      !formData.vip.cpf ||
      !formData.vip.email ||
      !formData.vip.cellphone
    ) {
      setEmptyForm(true);
      toast.error("Por favor, preencha todos os seus dados!");
      setIsLoading(false);
      return;
    }

    if (showGuestFields) {
      if (
        !formData.guest.fullName ||
        !formData.guest.cpf ||
        !formData.guest.email ||
        !formData.guest.cellphone
      ) {
        setEmptyForm(true);
        toast.error("Por favor, preencha todos os dados do seu convidado!");
        setIsLoading(false);
        return;
      }
      if (formData.vip.fullName === formData.guest.fullName) {
        setEmptyForm(true);
        setFullNameInvalidVip(true);
        setFullNameInvalidGuest(true);
        toast.error(
          "Por favor, preencha nomes diferentes para cada convidado!"
        );
        setIsLoading(false);
        return;
      }
      if (formData.vip.cpf === formData.guest.cpf) {
        setEmptyForm(true);
        setDocumentNumberInvalidVip(true);
        setDocumentNumberInvalidGuest(true);
        toast.error(
          "Por favor, preencha um cpf diferente para cada convidado!"
        );
        setIsLoading(false);
        return;
      }
    }

    resetInvalidFields();

    const isVipFullNameValid = validateFullName(formData.vip.fullName, "vip");
    const isVipCpfValid = validateDocumentNumber(formData.vip.cpf, "vip");
    const isVipEmailValid = validateEmail(formData.vip.email, "vip");
    const isVipPhoneValid = validateCellphone(formData.vip.cellphone, "vip");

    let isGuestValid = true;
    if (showGuestFields) {
      const isGuestFullNameValid = validateFullName(
        formData.guest.fullName,
        "guest"
      );
      const isGuestCpfValid = validateDocumentNumber(
        formData.guest.cpf,
        "guest"
      );
      const isGuestEmailValid = validateEmail(formData.guest.email, "guest");
      const isGuestPhoneValid = validateCellphone(
        formData.guest.cellphone,
        "guest"
      );

      isGuestValid =
        isGuestFullNameValid === true &&
        isGuestCpfValid === true &&
        isGuestEmailValid === true &&
        isGuestPhoneValid === true;
    }

    if (
      isVipFullNameValid === false ||
      isVipCpfValid === false ||
      isVipEmailValid === false ||
      isVipPhoneValid === false ||
      (showGuestFields && !isGuestValid)
    ) {
      toast.error("Complete corretamente todos os campos!");
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
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      width="100vw"
      overflowY="auto"
      bg="#3B037F"
      minH={"100vh"}
      height={"100%"}
    >
      <Flex
        flexDir={"column"}
        bgColor={"transparent"}
        alignItems={"center"}
        border={"0"}
        w={{ md: "71vw" }}
        maxW={{ md: "800px" }}
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
                textAlign={"justify"}
                mx={"10px"}
                fontSize={"14px"}
                paddingTop={"5px"}
              >
                {showGuestFields ? (
                  <>
                    Parabéns! Você e seu convidado estão na lista de convidados
                    VIP do <b>Um Baita Festival</b>! Enquanto isso, que tal
                    postar nos seus stories uma imagem especial com a{" "}
                    <b>#umbaitafestival</b> e já ir se preparando?
                  </>
                ) : (
                  <>
                    Parabéns você está na lista de convidados VIP do{" "}
                    <b>Um Baita Festival</b>! Enquanto isso, que tal postar nos
                    seus stories uma imagem especial com a{" "}
                    <b>#umbaitafestival</b> e já ir se preparando?
                  </>
                )}
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
                  router.push("/rsvp");
                }}
                _hover={{ bg: "#302e2e", color: "#ED7678" }}
                borderRadius={"8px"}
                width={"150px"}
              >
                DEIXA PRA LÁ...
              </Button>
              <Button
                bgColor={"#dfdf26"}
                color={"#fff"}
                fontWeight={"900"}
                onClick={() => {
                  handleStoryDownload();
                  onCloseSuccessModal();
                  router.push("/rsvp");
                }}
                _hover={{ bg: "#302e2e", color: "#dfdf26" }}
                borderRadius={"8px"}
                width={"150px"}
              >
                VAMOS LÁ!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Text
          color="white"
          fontSize={{ base: "2.3vh", md: "2.5vh" }}
          fontWeight={"400"}
          lineHeight={{ base: "3vh", md: "3vh" }}
          textAlign={"center"}
          width={{ base: "70vh", md: "80vh" }}
          maxW={"100%"}
          mb={"40px"}
          mt={"40px"}
        >
          <b id="highlightedText">Parabéns! </b>
          Você foi convidado(a) para fazer parte da lista{" "}
          <b id="highlightedText">VIP</b> do <b>Um Baita Festival</b> e pode
          levar um convidado da sua escolha para curtir esse evento incrível com
          você. Preencha o formulário abaixo com as informações necessárias para
          garantir seu acesso.
        </Text>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
            gap="2vh"
          >
            <GridItem colSpan={{ base: 1, md: 6 }}>
              <Text
                mb="2"
                color={"#fffe2d"}
                fontWeight={"700"}
                fontSize={{ md: "2vh" }}
              >
                Nome Completo:
              </Text>
              <Input
                type="text"
                name="vip-fullName"
                placeholder="Digite seu nome aqui"
                fontSize={{ md: "1.5vh" }}
                value={formData.vip.fullName}
                onChange={handleChange}
                onBlur={(e) => validateFullName(e.target.value, "vip")}
                height={"5vh"}
                borderRadius={"lg"}
                color={"#000"}
                bgColor={
                  (emptyForm && formData.vip.fullName) === "" ||
                  fullNameInvalidVip === true
                    ? "#f3a3a3"
                    : "#fff"
                }
                border={
                  (emptyForm && formData.vip.fullName) === "" ||
                  fullNameInvalidVip === true
                    ? "2px solid red"
                    : "1px solid transparent"
                }
                disabled
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 6 }}>
              <Text
                mb="2"
                color={"#fffe2d"}
                fontWeight={"700"}
                fontSize={{ md: "2vh" }}
              >
                CPF:
              </Text>
              <Input
                type="text"
                name="vip-cpf"
                placeholder="Digite seu cpf aqui"
                fontSize={{ md: "1.5vh" }}
                value={formData.vip.cpf}
                onChange={handleChange}
                onBlur={(e) => validateDocumentNumber(e.target.value, "vip")}
                height={"5vh"}
                borderRadius={"lg"}
                color={"#000"}
                bgColor={
                  (emptyForm && formData.vip.cpf) === "" ||
                  documentNumberInvalidVip === true
                    ? "#f3a3a3"
                    : "#fff"
                }
                border={
                  (emptyForm && formData.vip.cpf) === "" ||
                  documentNumberInvalidVip === true
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 6 }}>
              <Text
                mb="2"
                color={"#fffe2d"}
                fontWeight={"700"}
                fontSize={{ md: "2vh" }}
              >
                Email:
              </Text>
              <Input
                type="text"
                name="vip-email"
                placeholder="Digite seu email aqui"
                fontSize={{ md: "1.5vh" }}
                value={formData.vip.email}
                onChange={handleChange}
                onBlur={(e) => validateEmail(e.target.value, "vip")}
                height={"5vh"}
                borderRadius={"lg"}
                bgColor={
                  (emptyForm && formData.vip.email === "") ||
                  emailInvalidVip === true
                    ? "#f3a3a3"
                    : "#fff"
                }
                color={"#000"}
                border={
                  (emptyForm && formData.vip.email === "") ||
                  emailInvalidVip === true
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 6 }}>
              <Text
                mb="2"
                color={"#fffe2d"}
                fontWeight={"700"}
                fontSize={{ md: "2vh" }}
              >
                Telefone:
              </Text>
              <Input
                type="tel"
                name="vip-cellphone"
                placeholder="(XX) XXXXX-XXXX"
                fontSize={{ md: "1.5vh" }}
                value={formData.vip.cellphone}
                onChange={handleChange}
                onBlur={(e) => validateCellphone(e.target.value, "vip")}
                height={"5vh"}
                borderRadius={"lg"}
                bgColor={
                  (emptyForm && formData.vip.cellphone === "") ||
                  cellphoneInvalidVip === true
                    ? "#f3a3a3"
                    : "#fff"
                }
                color={"#000"}
                border={
                  (emptyForm && formData.vip.cellphone === "") ||
                  cellphoneInvalidVip === true
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 6 }}>
              <Flex justifyContent="center" mt={4} mb={4}>
                <Button
                  onClick={() => setShowGuestFields(!showGuestFields)}
                  colorScheme="yellow"
                  variant="outline"
                  color="#FE006C"
                  borderColor="#FE006C"
                  bg={"rgba(0,0,0,0.2)"}
                  _hover={{ bg: "rgba(0, 0, 0, 0.8)" }}
                >
                  {showGuestFields
                    ? "Esconder campos do convidado"
                    : "Adicionar convidado"}
                </Button>
              </Flex>
            </GridItem>

            {showGuestFields && (
              <>
                <GridItem colSpan={{ base: 1, md: 6 }}>
                  <Text
                    mb="2"
                    color={"#fffe2d"}
                    fontWeight={"700"}
                    fontSize={{ md: "2vh" }}
                  >
                    Nome Completo do Convidado:
                  </Text>
                  <Input
                    type="text"
                    name="guest-fullName"
                    placeholder="Digite o nome aqui"
                    fontSize={{ md: "1.5vh" }}
                    value={formData.guest.fullName}
                    onChange={handleChange}
                    onBlur={(e) => validateFullName(e.target.value, "guest")}
                    height={"5vh"}
                    borderRadius={"lg"}
                    color={"#000"}
                    bgColor={
                      (emptyForm && formData.guest.fullName) === "" ||
                      fullNameInvalidGuest === true
                        ? "#f3a3a3"
                        : "#fff"
                    }
                    border={
                      (emptyForm && formData.guest.fullName) === "" ||
                      fullNameInvalidGuest === true
                        ? "2px solid red"
                        : "1px solid transparent"
                    }
                  />
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 6 }}>
                  <Text
                    mb="2"
                    color={"#fffe2d"}
                    fontWeight={"700"}
                    fontSize={{ md: "2vh" }}
                  >
                    CPF do convidado:
                  </Text>
                  <Input
                    type="text"
                    name="guest-cpf"
                    placeholder="Digite o cpf aqui"
                    fontSize={{ md: "1.5vh" }}
                    value={formData.guest.cpf}
                    onChange={handleChange}
                    onBlur={(e) =>
                      validateDocumentNumber(e.target.value, "guest")
                    }
                    height={"5vh"}
                    borderRadius={"lg"}
                    color={"#000"}
                    bgColor={
                      (emptyForm && formData.guest.cpf) === "" ||
                      documentNumberInvalidGuest === true
                        ? "#f3a3a3"
                        : "#fff"
                    }
                    border={
                      (emptyForm && formData.guest.cpf) === "" ||
                      documentNumberInvalidGuest === true
                        ? "2px solid red"
                        : "1px solid transparent"
                    }
                  />
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 6 }}>
                  <Text
                    mb="2"
                    color={"#fffe2d"}
                    fontWeight={"700"}
                    fontSize={{ md: "2vh" }}
                  >
                    Email do convidado:
                  </Text>
                  <Input
                    type="text"
                    name="guest-email"
                    placeholder="Digite o email aqui"
                    fontSize={{ md: "1.5vh" }}
                    value={formData.guest.email}
                    onChange={handleChange}
                    onBlur={(e) => validateEmail(e.target.value, "guest")}
                    height={"5vh"}
                    borderRadius={"lg"}
                    bgColor={
                      (emptyForm && formData.guest.email === "") ||
                      emailInvalidGuest === true
                        ? "#f3a3a3"
                        : "#fff"
                    }
                    color={"#000"}
                    border={
                      (emptyForm && formData.guest.email === "") ||
                      emailInvalidGuest === true
                        ? "2px solid red"
                        : "1px solid transparent"
                    }
                  />
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 6 }}>
                  <Text
                    mb="2"
                    color={"#fffe2d"}
                    fontWeight={"700"}
                    fontSize={{ md: "2vh" }}
                  >
                    Telefone do convidado:
                  </Text>
                  <Input
                    type="tel"
                    name="guest-cellphone"
                    placeholder="(XX) XXXXX-XXXX"
                    fontSize={{ md: "1.5vh" }}
                    value={formData.guest.cellphone}
                    onChange={handleChange}
                    onBlur={(e) => validateCellphone(e.target.value, "guest")}
                    height={"5vh"}
                    borderRadius={"lg"}
                    bgColor={
                      (emptyForm && formData.guest.cellphone === "") ||
                      cellphoneInvalidGuest === true
                        ? "#f3a3a3"
                        : "#fff"
                    }
                    color={"#000"}
                    border={
                      (emptyForm && formData.guest.cellphone === "") ||
                      cellphoneInvalidGuest === true
                        ? "2px solid red"
                        : "1px solid transparent"
                    }
                  />
                </GridItem>
              </>
            )}
          </Grid>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            height={"80px"}
            mt={{ base: "20px", md: "60px" }}
            flexDir={"column"}
            gap={"30px"}
          >
            <Button
              type="submit"
              color={"#FFF"}
              bgColor={"#FE006C"}
              justifySelf={"center"}
              height={"7vh"}
              width={{ base: "60%", md: "28vh" }}
              borderRadius={"lg"}
              fontWeight={"900"}
              onSubmit={handleSubmit}
              _hover={{ bg: "#302e2e", color: "#FE006C" }}
              disabled={isLoading}
            >
              {isLoading === true ? "CARREGANDO..." : "ENVIAR"}
              {isLoading && <Spinner />}
            </Button>
            <Text
              fontSize="12px"
              textAlign="center"
              color={"#fff"}
              display={{ base: "none", md: "flex" }}
            >
              BEBA COM SABEDORIA
            </Text>
          </Flex>

          <Box
            display={{ base: "flex", md: "none" }}
            flexDirection={"column"}
            alignItems={"center"}
            mt={"10px"}
          >
            <Image
              src={"/logoUBF.png"}
              alt="Logo Baita Festival"
              maxW={{ base: "14vh" }}
              w={"100%"}
            />
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
        </Box>
      </Flex>
    </Box>
  );
}
