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
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { db, collection, addDoc } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";

// Adicione no início do componente (após as imports)
const VerificationGate: React.FC<{
  onVerify: () => void;
}> = ({ onVerify }) => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerification = () => {
    // Verificação mockada temporária
    const mockValidCode = "1234"; // Substituir por lógica real depois
    if (verificationCode === mockValidCode) {
      onVerify();
    } else {
      toaster.create({
        title: "Código inválido",
        description: "Por favor, insira um código de verificação válido",
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Box
      textAlign="center"
      p="6"
      borderRadius="md"
      bg="transparent"
      maxW="600px"
      height="650px"
      mx="auto"
      my="auto"
    >
      <Image src="https://shorturl.at/3qVoS" mb={"50px"} />
      <Text
        mb="4"
        color="white"
        fontSize={"26px"}
        fontWeight={"400"}
        fontFamily="Roboto, sans-serif"
        lineHeight={"37.5px"}
      >
        Se você foi <b>comprador</b> de alguma edição do{" "}
        <b>Um Baita Festival</b>, digite seu CPF e concorra a um{" "}
        <b id="highlightedText">Black Ticket</b> com prêmios especiais!{" "}
      </Text>

      <Flex gap="2" mb="4">
        <Input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Código de acesso"
          color="black"
          bg="white"
        />
        <Button
          onClick={handleVerification}
          bg="#DF9A00"
          color="white"
          _hover={{ bg: "#FFDE00" }}
        >
          Verificar
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

// Novo tipo para os itens da lista
interface ListItem {
  label: string;
  value: string;
}

export default function SignupPage() {
  const [isVerified, setIsVerified] = useState(false); // Novo estado
  const [states, setStates] = useState(
    createListCollection<ListItem>({ items: [] })
  );
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
    } catch (err) {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    // Aplicando a máscara para a data de nascimento
    if (name === "birthDate") {
      formattedValue = value
        .replace(/\D/g, "") // Remove caracteres não numéricos
        .slice(0, 8) // Limita a 8 caracteres
        .replace(/(\d{2})(\d{2})?(\d{4})?/, (_, d, m, y) => {
          return [d, m, y].filter(Boolean).join("/");
        });
    }

    // Máscara de número
    if (name === "addressNumber") {
      formattedValue = value.replace(/\D/g, "");
    }

    // Máscara para Celular (XX) XXXXX-XXXX
    if (name === "cellphone") {
      const onlyNumbers = value.replace(/\D/g, ""); // Remove tudo que não for número

      if (onlyNumbers.length <= 2) {
        formattedValue = onlyNumbers; // Apenas DDD sem parênteses
      } else if (onlyNumbers.length <= 7) {
        formattedValue = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`; // DDD + primeiros dígitos
      } else {
        formattedValue = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
          2,
          7
        )}-${onlyNumbers.slice(7, 11)}`; // Formato completo
      }
    }

    if (name === "state") {
      fetchCities(formattedValue);
    }

    if (name === "postalCode") {
      const onlyNumbers = value.replace(/\D/g, ""); // Remove tudo que não for número

      if (onlyNumbers.length <= 5) {
        formattedValue = onlyNumbers; // Apenas os primeiros números
      } else {
        formattedValue = `${onlyNumbers.slice(0, 5)}-${onlyNumbers.slice(
          5,
          8
        )}`; // Insere o hífen automaticamente
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
      toaster.create({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        type: "error",
        duration: 5000,
      });
      return;
    }

    try {
      // Processar dados antes de enviar
      const userData = {
        ...formData,
        createdAt: Timestamp.now(),
      };

      // Salvar no Firestore
      const docRef = await addDoc(collection(db, "users"), userData);

      toaster.create({
        title: "Cadastro realizado com sucesso!",
        description: `ID do registro: ${docRef.id}`,
        type: "success",
        duration: 5000,
      });

      // Resetar formulário
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

        // Ordena os estados alfabeticamente
        const sortedStates = data.sort((a, b) => a.nome.localeCompare(b.nome));

        const statesCollection = createListCollection<ListItem>({
          items: sortedStates.map(
            (state): ListItem => ({
              label: state.nome,
              value: state.sigla,
            })
          ),
        });

        setStates(statesCollection);

        setLoading(false);
      } catch (err) {
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
      maxWidth="600px"
      maxHeight="650px"
      mx="auto"
      my="auto"
      p="20px"
    >
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
                />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <SelectRoot
                  name="state"
                  collection={states}
                  gap={"5px"}
                  size={"sm"}
                  onChange={handleChange}
                >
                  <SelectLabel
                    mb="2"
                    color={"#FFDE00"}
                    fontSize={"16px"}
                    fontWeight={"700"}
                  >
                    Selecione um estado:
                  </SelectLabel>
                  <SelectTrigger
                    height={"35px"}
                    borderRadius={"8px"}
                    bgColor={"#FFF"}
                  >
                    <SelectValueText placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.items.map((state) => (
                      <SelectItem item={state} key={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <SelectRoot
                  collection={cities}
                  name="city"
                  gap={"5px"}
                  size={"sm"}
                  onChange={handleChange}
                >
                  <SelectLabel
                    mb="2"
                    color={"#FFDE00"}
                    fontSize={"16px"}
                    fontWeight={"700"}
                  >
                    Selecione uma cidade:
                  </SelectLabel>
                  <SelectTrigger
                    height={"35px"}
                    borderRadius={"8px"}
                    bgColor={"#FFF"}
                  >
                    <SelectValueText placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.items.map((city) => (
                      <SelectItem item={city} key={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
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
                />
              </GridItem>
            </Grid>
            <Flex justifyContent={"center"}>
              <Button
                type="submit"
                color={"#FFF"}
                bgColor={"#DF9A00"}
                mt="35px"
                justifySelf={"center"}
                height={"45px"}
                width="150px"
                borderRadius={"lg"}
                fontWeight={"900"}
                onSubmit={handleSubmit}
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
