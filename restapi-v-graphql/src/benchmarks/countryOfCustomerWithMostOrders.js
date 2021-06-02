async function getCountryOfCustomerWithMostOrdersFromRestApi() {
  const t1 = performance.now();
  const ordersResponse = await fetch('/restapi/orders');
  const orders = await ordersResponse.json();
  const results = {};
  orders.forEach((order) => {
    const { customerNumber } = order;
    if (results[customerNumber]) {
      results[customerNumber] += 1;
      return;
    }
    results[customerNumber] = 1;
  });
  const customerNumbers = Object.keys(results);
  const counts = Object.values(results);
  const index = counts.indexOf(Math.max(...counts));
  const customerResponse = await fetch(
    `/restapi/customers/${customerNumbers[index]}`,
  );
  const { country } = await customerResponse.json();
  const t2 = performance.now();
  console.log(country);
  return t2 - t1;
}

async function getCountryOfCustomerWithMostOrdersFromGraphQL() {
  const QL = `
  {
    orders {
      customer {
        customerNumber
        country
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
    data: { orders },
  } = await response.json();
  const t2 = performance.now();

  const results = {};
  orders.forEach((order) => {
    const { country, customerNumber } = order.customer;
    if (results[customerNumber]) {
      results[customerNumber].count += 1;
      return;
    }
    results[customerNumber] = {
      count: 1,
      country,
    };
  });
  const customerNumbers = Object.keys(results);
  const customerProps = Object.values(results);
  const counts = Object.values(customerProps.map(({ count }) => count));
  const index = counts.indexOf(Math.max(...counts));
  console.log(customerProps[index].country);
  return t2 - t1;
}
