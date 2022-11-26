import React from "react";
import { Heading, Flex, Box, Spacer } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex backgroundColor="#e2e8f0" minWidth='max-content' alignItems='center' gap='2' paddingX="5rem" paddingY="0.5rem">
        <Box p='2'>
        <Heading size='md'>Todos</Heading>
        </Box>
        <Spacer />
        <Box>
            Developed By @NoorasFatima
        </Box>
    </Flex>
  );
};

export default Header;