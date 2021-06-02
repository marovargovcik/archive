async function getTopOrderedProductFromRestApi() {
  const t1 = performance.now();
  const response = await fetch('/restapi/products');
  const products = await response.json();
  const productOrders = await Promise.all(
    products.map(async (product) => {
      const { productCode } = product;
      const response = await fetch(`/restapi/products/${productCode}/orders`);
      return response.json();
    }),
  );
  const t2 = performance.now();

  const results = {};
  productOrders.forEach((orders, index) => {
    const { buyPrice, productCode, productName } = products[index];

    orders.forEach((order) => {
      const { quantityOrdered } = order;

      if (results[productCode]) {
        results[productCode].count += quantityOrdered;
        return;
      }

      results[productCode] = {
        buyPrice,
        count: quantityOrdered,
        productName,
      };
    });
  });

  const productCodes = Object.keys(results);
  const productProps = Object.values(results);
  const counts = productProps.map(({ count }) => count);
  const index = counts.indexOf(Math.max(...counts));
  console.log(productCodes[index], productProps[index]);
  return t2 - t1;
}

async function getTopOrderedProductFromGraphQL() {
  const QL = `
  {
    products {
      productName
      productCode
      buyPrice
      orders {
        orderNumber
        orderDetails {
          quantityOrdered
          productCode
        }
      }
    }
  }`;

  const t1 = performance.now();
  const response = await fetch('/graphql', {
    body: JSON.stringify({ query: QL }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
  const {
    data: { products },
  } = await response.json();

  const t2 = performance.now();
  const results = {};
  products.forEach((product) => {
    const { buyPrice, orders, productCode, productName } = product;

    orders.forEach((order) => {
      const { orderDetails: unfilteredOrderDetails } = order;
      const orderDetails = unfilteredOrderDetails.filter(
        ({ productCode: odProductCode }) => odProductCode === productCode,
      );

      orderDetails.forEach((orderDetail) => {
        const { quantityOrdered } = orderDetail;
        if (results[productCode]) {
          results[productCode].count += quantityOrdered;
          return;
        }
        results[productCode] = {
          buyPrice,
          count: quantityOrdered,
          productName,
        };
      });
    });
  });

  const productCodes = Object.keys(results);
  const productProps = Object.values(results);
  const counts = productProps.map(({ count }) => count);
  const index = counts.indexOf(Math.max(...counts));
  console.log(productCodes[index], productProps[index]);
  return t2 - t1;
}
