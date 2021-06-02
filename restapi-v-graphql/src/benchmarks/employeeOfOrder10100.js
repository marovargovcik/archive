async function getEmployeeOfOrder10100FromRestApi() {
  const t1 = performance.now();
  const orderResponse = await fetch('/restapi/orders/10100');
  const { customerNumber } = await orderResponse.json();
  const customerResponse = await fetch(`/restapi/customers/${customerNumber}`);
  const {
    salesRepEmployeeNumber: employeeNumber,
  } = await customerResponse.json();
  const employeeResponse = await fetch(`/restapi/employees/${employeeNumber}`);
  const { firstName, lastName } = await employeeResponse.json();
  const t2 = performance.now();
  console.log(firstName, lastName);
  return t2 - t1;
}

async function getEmployeeOfOrder10100FromGraphQL() {
  const QL = `
  {
    order(orderNumber: 10100) {
      customer {
        salesRepresentative {
          firstName
          lastName
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
    data: { order },
  } = await response.json();
  const t2 = performance.now();
  const {
    customer: {
      salesRepresentative: { firstName, lastName },
    },
  } = order;
  console.log(firstName, lastName);
  return t2 - t1;
}
