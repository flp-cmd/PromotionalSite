"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  Image,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import Checkbox from "@/components/Checkbox";
import { useState, useEffect } from "react";
import { createListCollection } from "@chakra-ui/react";
import { db, collection, addDoc } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/modal";
import { toaster } from "@/components/ui/toaster";
import Select from "react-select";
import { ActionMeta, SingleValue } from "react-select";

const VerificationGate: React.FC<{
  onVerify: () => void;
}> = ({ onVerify }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const [isChecked, setIsChecked] = useState(false);

  const handleVerification = () => {
    const mockValidCode = "1234";
    if (isChecked) {
      if (verificationCode === mockValidCode) {
        onVerify();
      } else {
        setErrorMessage(
          <>
            Não conseguimos encontrar seu CPF em nosso banco de dados. Verifique
            se este foi o mesmo CPF utilizado para a compra dos ingressos do{" "}
            <b>Um Baita Festival</b>.
          </>
        );
        onOpen();
      }
    } else {
      setErrorMessage(
        <>
          Para continuar, é necessário concordar com as <b>regras</b> do
          sorteio. Marque a opção antes de prosseguir.
        </>
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
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Digite seu cpf aqui"
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
                  href="https://v2.chakra-ui.com/docs/hooks/use-disclosure"
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

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

interface ListItem {
  label: string;
  value: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export default function SignupPage() {
  const {
    open: isSuccessModalOpen,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal,
  } = useDisclosure();
  const [emptyForm, setEmptyForm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [states, setStates] = useState<ListItem[]>([]);

  const [cities, setCities] = useState(
    createListCollection<ListItem>({ items: [] })
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    cellphone: "",
    email: "",
    address: "",
    addressNumber: "",
    neighborhood: "",
    complement: "",
    state: "",
    city: "",
    postalCode: "",
  });

  const fetchCities = async (uf: string) => {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      );
      const data: Cidade[] = await response.json();

      const sortedCities = data.sort((a, b) => a.nome.localeCompare(b.nome));

      const citiesCollection = createListCollection<ListItem>({
        items: sortedCities.map(
          (city): ListItem => ({
            label: city.nome,
            value: city.nome,
          })
        ),
      });

      setCities(citiesCollection);
    } catch (err) {
      console.log(err);
    }
  };

  type SelectChangeHandler = (
    selectedOption: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption> & { name: string }
  ) => void;

  const handleSelectChange: SelectChangeHandler = (
    selectedOption,
    actionMeta
  ) => {
    const { name } = actionMeta;
    const value = selectedOption?.value || "";

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      fetchCities(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "birthDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 8)
        .replace(/(\d{2})(\d{2})?(\d{4})?/, (_, d, m, y) => {
          return [d, m, y].filter(Boolean).join("/");
        });
    }

    if (name === "addressNumber") {
      formattedValue = value.replace(/\D/g, "");
    }

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
    }

    if (name === "postalCode") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length <= 5) {
        formattedValue = onlyNumbers;
      } else {
        formattedValue = `${onlyNumbers.slice(0, 5)}-${onlyNumbers.slice(
          5,
          8
        )}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      fullName,
      birthDate,
      cellphone,
      email,
      address,
      addressNumber,
      neighborhood,
      complement,
      state,
      city,
      postalCode,
    } = formData;

    if (
      !fullName ||
      !birthDate ||
      !cellphone ||
      !email ||
      !address ||
      !addressNumber ||
      !neighborhood ||
      !complement ||
      !state ||
      !city ||
      !postalCode
    ) {
      setEmptyForm(true);
      toast.error("Todos os campos devem ser preenchidos!");
      return;
    }

    try {
      const userData = {
        ...formData,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "users"), userData);

      onOpenSuccessModal();

      setFormData({
        fullName: "",
        birthDate: "",
        cellphone: "",
        email: "",
        address: "",
        addressNumber: "",
        neighborhood: "",
        complement: "",
        state: "",
        city: "",
        postalCode: "",
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toaster.create({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const data: Estado[] = await response.json();

        const sortedStates = data.sort((a, b) => a.nome.localeCompare(b.nome));

        const statesCollection: ListItem[] = sortedStates.map((state) => ({
          label: state.nome,
          value: state.sigla,
        }));

        setStates(statesCollection);

        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Erro ao carregar estados");
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box
      bgColor={"transparent"}
      border={"0"}
      maxWidth={{ base: "100%", md: "600px" }}
      maxHeight="650px"
      mx="auto"
      my={{ base: "30px", md: "auto" }}
      p="20px"
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
                setIsVerified(false);
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
                setIsVerified(false);
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
      {!isVerified ? (
        <VerificationGate onVerify={() => setIsVerified(true)} />
      ) : (
        <>
          <Heading
            as="h1"
            size="lg"
            textAlign="center"
            mt="-5"
            mb="10"
            color={"#FFF"}
            textDecoration={"underline"}
          >
            Preencha todos os campos para concorrer aos prêmios.
          </Heading>
          <form onSubmit={handleSubmit}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
              gap="4"
            >
              <GridItem colSpan={{ base: 1, md: 6 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Nome Completo:
                </Text>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Escreva seu nome aqui"
                  value={formData.fullName}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  color={"#000"}
                  bgColor={"#FFF"}
                  border={
                    emptyForm && formData.fullName === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Data de Nascimento:
                </Text>
                <Input
                  type="text"
                  name="birthDate"
                  value={formData.birthDate}
                  placeholder="dd/mm/aaaa"
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.birthDate === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 4 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Telefone:
                </Text>
                <Input
                  type="tel"
                  name="cellphone"
                  placeholder="(XX) XXXXX-XXXX"
                  value={formData.cellphone}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.cellphone === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 6 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Email:
                </Text>
                <Input
                  type="email"
                  name="email"
                  placeholder="Digite seu email aqui"
                  value={formData.email}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.email === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 4 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Endereço:
                </Text>
                <Input
                  type="text"
                  name="address"
                  placeholder="Digite seu endereço aqui"
                  value={formData.address}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.address === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Número:
                </Text>
                <Input
                  type="text"
                  name="addressNumber"
                  placeholder="Ex: 123"
                  value={formData.addressNumber}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.addressNumber === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 4 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Bairro:
                </Text>
                <Input
                  type="text"
                  name="neighborhood"
                  placeholder="Escreva seu bairro aqui"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.neighborhood === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  Complemento:
                </Text>
                <Input
                  type="text"
                  name="complement"
                  placeholder="Ex: Apt 48"
                  value={formData.complement}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.complement === ""
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Text
                  mb="2"
                  color={"#FFDE00"}
                  fontSize={"16px"}
                  fontWeight={"700"}
                >
                  Selecione um estado:
                </Text>
                <Select
                  name="state"
                  isSearchable
                  options={Array.isArray(states) ? states : []}
                  placeholder="Selecione um estado"
                  onChange={(option, meta) =>
                    handleSelectChange(option, { ...meta, name: "state" })
                  }
                  menuPosition="fixed"
                  styles={{
                    placeholder: (provided) => ({
                      ...provided,
                      fontSize: "14px",
                      color: "#5a5959",
                      fontWeight: "500",
                    }),
                    control: (provided) => ({
                      ...provided,
                      height: "5px",
                      border:
                        emptyForm && !formData.state
                          ? "2px solid red"
                          : "1px solid transparent",
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: "black",
                      padding: 10,
                    }),
                  }}
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Text
                  mb="2"
                  color={"#FFDE00"}
                  fontSize={"16px"}
                  fontWeight={"700"}
                >
                  Selecione uma cidade:
                </Text>
                <Select
                  name="city"
                  isSearchable
                  options={Array.isArray(cities.items) ? cities.items : []}
                  placeholder="Selecione uma cidade"
                  onChange={(option, meta) =>
                    handleSelectChange(option, { ...meta, name: "city" })
                  }
                  menuPosition="fixed"
                  styles={{
                    placeholder: (provided) => ({
                      ...provided,
                      fontSize: "13px",
                      color: "#5a5959",
                      fontWeight: "500",
                    }),
                    control: (provided) => ({
                      ...provided,
                      height: "35px",
                      border:
                        emptyForm && !formData.city
                          ? "2px solid red"
                          : "1px solid transparent",
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: "black",
                      padding: 10,
                    }),
                  }}
                  isDisabled={!formData.state}
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Text mb="2" color={"#FFDE00"} fontWeight={"700"}>
                  CEP:
                </Text>
                <Input
                  type="text"
                  name="postalCode"
                  placeholder="Digite seu CEP"
                  value={formData.postalCode}
                  onChange={handleChange}
                  height={"35px"}
                  borderRadius={"lg"}
                  bgColor={"#FFF"}
                  color={"#000"}
                  border={
                    emptyForm && formData.postalCode === ""
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
              mt={"10px"}
            >
              <Button
                type="submit"
                color={"#FFF"}
                bgColor={"#DF9A00"}
                justifySelf={"center"}
                height={"45px"}
                width="150px"
                borderRadius={"lg"}
                fontWeight={"900"}
                onSubmit={handleSubmit}
                _hover={{ bg: "#302e2e", color: "#DF9A00" }}
              >
                Enviar
              </Button>
            </Flex>
          </form>
        </>
      )}
    </Box>
  );
}
