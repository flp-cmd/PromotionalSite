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
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    cellphone: "",
    email: "",
    address: "",
    addressNumber: "",
    neighborhood: "",
    complement: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      city,
      state,
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
      !city ||
      !state ||
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

    console.log("Dados enviados:", formData);

    toaster.create({
      title: "Cadastro realizado com sucesso!",
      description: "Você pode agora fazer login.",
      type: "success",
      duration: 5000,
    });

    setFormData({
      fullName: "",
      birthDate: "",
      cellphone: "",
      email: "",
      address: "",
      addressNumber: "",
      neighborhood: "",
      complement: "",
      city: "",
      state: "",
      postalCode: "",
    });
  };

  return (
    <Box
      bgColor={"transparent"}
      maxWidth="600px"
      maxHeight="650px"
      mx="auto"
      my="auto"
      p="20px"
      borderRadius="md"
      boxShadow="md"
    >
      <Heading as="h1" size="lg" textAlign="center" mb="6" color={"#FFF"} textDecoration={'underline'}>
        Preencha todos os campos para concorrer aos prêmios.
      </Heading>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }} gap="4">
          <GridItem colSpan={{ md: 6 }}>
            <Text mb="2" color={"#FFDE00"}>
              Nome Completo:
            </Text>
            <Input
              type="text"
              name="fullName"
              placeholder="Escreva seu nome aqui..."
              value={formData.fullName}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 2 }}>
            <Text mb="2" color={"#FFDE00"}>
              Data de Nascimento:
            </Text>
            <Input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 4 }}>
            <Text mb="2" color={"#FFDE00"}>
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
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 6 }}>
            <Text mb="2" color={"#FFDE00"}>
              Email:
            </Text>
            <Input
              type="email"
              name="email"
              placeholder="Digite seu email aqui..."
              value={formData.email}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 4 }}>
            <Text mb="2" color={"#FFDE00"}>
              Endereço:
            </Text>
            <Input
              type="text"
              name="address"
              placeholder="Digite seu endereço aqui..."
              value={formData.address}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 2 }}>
            <Text mb="2" color={"#FFDE00"}>
              Número:
            </Text>
            <Input
              type="text"
              name="number"
              placeholder="Ex: 123"
              value={formData.addressNumber}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 4 }}>
            <Text mb="2" color={"#FFDE00"}>
              Bairro:
            </Text>
            <Input
              type="text"
              name="neighborhood"
              placeholder="Escreva seu bairro aqui..."
              value={formData.neighborhood}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 2 }}>
            <Text mb="2" color={"#FFDE00"}>
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
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 2 }}>
            <Text mb="2" color={"#FFDE00"}>
              Cidade:
            </Text>
            <Input
              type="text"
              name="city"
              placeholder="Digite sua cidade..."
              value={formData.city}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 2 }}>
            <Text mb="2" color={"#FFDE00"}>
              Estado:
            </Text>
            <Input
              type="text"
              name="state"
              placeholder="Digite seu estado..."
              value={formData.state}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
          <GridItem colSpan={{ md: 2 }}>
            <Text mb="2" color={"#FFDE00"}>
              CEP:
            </Text>
            <Input
              type="text"
              name="postalCode"
              placeholder="Digite seu CEP..."
              value={formData.postalCode}
              onChange={handleChange}
              height={"35px"}
              borderRadius={"lg"}
              bgColor={"#FFF"}
              _placeholder={{ color: "#929292" }}
            />
          </GridItem>
        </Grid>
        <Flex justifyContent={'center'}>
          <Button
            type="submit"
            color={"#FFF"}
            bgColor={"#DF9A00"}
            mt="35px"
            justifySelf={"center"}
            height={"45px"}
            width="150px"
            borderRadius={"lg"}
          >
            Cadastrar
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
