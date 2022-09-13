import {
  Box,
  Img,
  Inline,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  TextField,
  Divider,
} from "@stripe/ui-extension-sdk/ui";

import { useState, useEffect } from "react";
import {
  createHttpClient,
  STRIPE_API_KEY,
} from "@stripe/ui-extension-sdk/http_client";
import Stripe from "stripe";

interface checkoutViewProps {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}

interface ProductsCart {
  [key: string]: Product;
}

interface Product {
  productName: string;
  image: string;
  price: number;
  currency: string;
}

const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
});

const CheckoutView = ({ amount, setAmount }: checkoutViewProps) => {
  const checkoutTabLabels = ["Products", "Manual Entry"];
  const [products, setProducts] = useState<ProductsCart>();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await stripe.products.list({
          active: true,
          expand: ["data.default_price"],
        });
        const temp: ProductsCart = {};
        data.forEach((p) => {
          temp[p.id] = {
            productName: p.name,
            image: p.images[0],
            price: p.default_price?.unit_amount,
            currency: p.default_price?.currency,
          };
        });
        setProducts(temp);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  return (
    <Box
      css={{
        height: "11/12",
        alignY: "stretch",
        stack: "y",
        gap: "medium",
        padding: "medium",
      }}
    >
      <Box css={{}}>
        <Box
          css={{
            stack: "y",
            gap: "medium",
          }}
        >
          Total: {amount ? amount : 0}
          <Divider />
        </Box>
        <Tabs>
          <TabList>
            {checkoutTabLabels.map((i) => (
              <Tab key={i}>{i}</Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              {products && (
                <Box
                  css={{
                    marginTop: "large",
                    wrap: "wrap",
                  }}
                >
                  {Object.keys(products).map((id) => {
                    const product = products[id];
                    return (
                      <Box
                        key={id}
                        css={{
                          background: "container",
                        }}
                      >
                        <Box
                          css={{
                            width: "3/4",
                            stack: "x",
                            alignX: "center",
                            gap: "small",
                            padding: "small",
                          }}
                        >
                          <Box>
                            <Img
                              src={product["image"]}
                              width="100"
                              alt="Gross margin"
                            />
                            <Box>{product.price}</Box>
                          </Box>

                          <Box
                            css={{
                              stack: "y",
                              alignY: "center",
                              distribute: "space-between",
                              marginY: "medium",
                            }}
                          >
                            <Box>{product.productName}</Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </TabPanel>
            <TabPanel>
              <Box>
                <TextField
                  label="Amount"
                  description="Enter an amount in the lowest denomination (cents)"
                  placeholder="1000"
                  size="large"
                  type="number"
                  invalid={amount ? false : amount < 100}
                  error={
                    amount && amount < 100
                      ? "Amount must be greater than 100 cents ($1.00)"
                      : ""
                  }
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default CheckoutView;
