import { Box } from "@chakra-ui/react";

export default function CustomBackground() {
  return (
    <Box
      position="relative"
      height="100vh"
      width="100%"
      bgColor="#000" // Cor de fundo da página
    >
      {/* Primeira Imagem */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        width="200px"
        height="200px"
        backgroundImage="url('/image1.png')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        transform="rotate(15deg)" // Ajuste de angulação
      />

      {/* Segunda Imagem */}
      <Box
        position="absolute"
        top="40%"
        left="50%"
        width="150px"
        height="150px"
        backgroundImage="url('/image2.png')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        transform="rotate(-10deg)"
      />

      {/* Terceira Imagem */}
      <Box
        position="absolute"
        bottom="5%"
        right="10%"
        width="100px"
        height="100px"
        backgroundImage="url('/image3.png')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        transform="rotate(25deg)"
      />
    </Box>
  );
}
