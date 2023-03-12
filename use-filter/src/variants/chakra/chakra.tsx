import { Button, ChakraProvider } from '@chakra-ui/react';

const Chakra = () => {
  return <Button>Button</Button>;
};

const Providers = () => (
  <ChakraProvider>
    <Chakra />
  </ChakraProvider>
);
export { Providers as Chakra };
