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
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { createListCollection } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/modal";
import Select from "react-select";
import { ActionMeta, SingleValue } from "react-select";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const {
    open: isSuccessModalOpen,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal,
  } = useDisclosure();
  const [cpf, setCpf] = useState("");
  const [emptyForm, setEmptyForm] = useState(false);
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

  useEffect(() => {
    const validatedCpf = sessionStorage.getItem("validatedCpf");
    if (!validatedCpf) {
      router.push("/");
    } else {
      setCpf(validatedCpf);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      setEmptyForm(true);
      toast.error("Todos os campos devem ser preenchidos!");
      return;
    }

    try {
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, cpf }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.removeItem("validatedCpf");
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao cadastrar. Tente novamente.");
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
      w={{ md: "71vw" }}
      maxW={{ md: "600px" }}
      maxH={{ md: "700px" }}
      mx="auto"
      pt={{ md: "10vh" }}
      p={{ base: "3vh" }}
      paddingBottom={{ base: "0" }}
      position="relative"
      zIndex={2}
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
                router.push("/");
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
                router.push("/");
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
              placeholder="Escreva seu nome aqui"
              fontSize={{ md: "1.5vh" }}
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
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Data de Nascimento:
            </Text>
            <Input
              type="text"
              name="birthDate"
              value={formData.birthDate}
              placeholder="dd/mm/aaaa"
              fontSize={{ md: "1.5vh" }}
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
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Email:
            </Text>
            <Input
              type="email"
              name="email"
              placeholder="Digite seu email aqui"
              fontSize={{ md: "1.5vh" }}
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
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Endereço:
            </Text>
            <Input
              type="text"
              name="address"
              placeholder="Digite seu endereço aqui"
              fontSize={{ md: "1.5vh" }}
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
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Número:
            </Text>
            <Input
              type="text"
              name="addressNumber"
              placeholder="Ex: 123"
              fontSize={{ md: "1.5vh" }}
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
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Complemento:
            </Text>
            <Input
              type="text"
              name="complement"
              placeholder="Ex: Apt 48"
              fontSize={{ md: "1.5vh" }}
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
          <GridItem colSpan={{ base: 1, md: 4 }}>
            <Text
              mb="2"
              color={"#FFDE00"}
              fontWeight={"700"}
              fontSize={{ md: "2vh" }}
            >
              Bairro:
            </Text>
            <Input
              type="text"
              name="neighborhood"
              placeholder="Escreva seu bairro aqui"
              fontSize={{ md: "1.5vh" }}
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
            <Text
              mb="2"
              color={"#FFDE00"}
              fontSize={{ md: "2vh" }}
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
                  fontSize: "1.5vh",
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
              fontSize={{ md: "2vh" }}
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
                  fontSize: "1.5vh",
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
              fontSize={{ md: "1.5vh" }}
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
          >
            ENVIAR
          </Button>
        </Flex>
        <Box
          display={"flex"}
          paddingInline={"20px"}
          paddingTop={"20px"}
          mt={"10px"}
          justifyContent={"center"}
        >
          <Box
            width={{ base: 80, md: 120 }}
            left={{ base: 50, md: 50 }}
            top={{ base: 0, md: -160 }}
            display={{ base: "flex", md: "none" }}
            flexDirection={"column"}
            gap={"10px"}
            alignItems={"center"}
          >
            <Text fontSize={"12px"} color={"#fff"}>
              CERVEJA OFICIAL:
            </Text>
            <Image
              src={"https://shorturl.at/xvMUq"}
              alt="Logo Black Princess"
              width={{ base: "100px" }}
            />
          </Box>
          <Box
            width={{ base: 80, md: 120 }}
            right={{ base: 0, md: 50 }}
            top={{ base: 0, md: 600 }}
            display={{ base: "flex", md: "none" }}
            flexDirection={"column"}
            gap={"10px"}
            alignItems={"center"}
          >
            <Text fontSize={"12px"} color={"#fff"}>
              PATROCINADOR:
            </Text>
            <Image
              src={"https://shorturl.at/hj0gs"}
              alt="Logo Ophicina"
              width={{ base: "100px" }}
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
            src="https://shorturl.at/xvMUq"
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
          top={{ base: "30vh", md: "35vh" }}
          right={{ base: "20vw", md: "3vw" }}
          position={{ base: "absolute", md: "absolute" }}
          gap={"1vh"}
          width={{ md: "15vh" }}
        >
          <Text fontSize="1.6vh" color={"#fff"}>
            PATROCINADOR:
          </Text>
          <Image
            src="https://shorturl.at/hj0gs"
            alt="Logo Ophicina"
            maxW={{ md: "20vh" }}
            w="100%"
            height={{ md: "3vh" }}
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
          src="https://shorturl.at/NNZEz"
          alt="Instrumentos"
          width={{ base: "0%", md: "40vh" }}
          position="absolute"
          left={{ base: "-10%", md: "-130px" }}
          top="-35vh"
          transform={{
            base: "rotate(-10deg) scale(0.8)",
            md: "rotate(40deg)",
          }}
        />

        <Image
          src="https://shorturl.at/NNZEz"
          alt="Instrumentos"
          width={{ base: "0%", md: "40vh" }}
          position="absolute"
          right={{ base: "-10%", md: "-130px" }}
          top="-35vh"
          transform={{
            base: "rotate(10deg) scaleX(-1) scale(0.8)",
            md: "rotate(-40deg) scaleX(-1)",
          }}
        />
      </Box>
    </Box>
  );
}
